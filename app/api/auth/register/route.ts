import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb, calculateTierInfo } from '@/lib/db';
import { User, AuthSession, UserBonusTransaction } from '@/types';

export const dynamic = 'force-dynamic';


function cleanPhone(p: string): string {
  return p.replace(/\D/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name, email, password } = body;

    if (!phone || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'Заполните обязательные поля (телефон, имя, пароль)' },
        { status: 400 }
      );
    }

    const db = getDb();
    const normalizedPhone = cleanPhone(phone);

    // Anti-duplicate check
    const existingPhone = db.users.find((u) => cleanPhone(u.phone) === normalizedPhone);
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким номером уже зарегистрирован' },
        { status: 400 }
      );
    }

    if (email && email.trim() !== '') {
      const existingEmail = db.users.find(
        (u) => u.email && u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'Пользователь с такой почтой уже зарегистрирован' },
          { status: 400 }
        );
      }
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();
    const initialPoints = 200;
    const tierInfo = calculateTierInfo(initialPoints, 0);

    const newUser: User = {
      id: userId,
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      name: name.trim(),
      passwordHash: Buffer.from(password).toString('base64'),
      tier: tierInfo.currentTier,
      bonusBalance: initialPoints,
      discountRate: tierInfo.discountRate,
      visitsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const welcomeTransaction: UserBonusTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: userId,
      type: 'WELCOME',
      amount: initialPoints,
      description: 'Приветственный бонус Көрші',
      createdAt: now,
    };

    const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newSession: AuthSession = {
      id: `s_${Date.now()}`,
      userId,
      token: sessionToken,
      expiresAt,
      createdAt: now,
    };

    db.users.push(newUser);
    db.bonusTransactions.push(welcomeTransaction);
    db.sessions.push(newSession);

    saveDb(db);

    const cookieStore = cookies();
    cookieStore.set('zherles_session_token', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    const { passwordHash, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: sessionToken,
      tierInfo,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при регистрации' },
      { status: 500 }
    );
  }
}
