import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb, calculateTierInfo } from '@/lib/db';
import { AuthSession } from '@/types';

export const dynamic = 'force-dynamic';


function cleanPhone(p: string): string {
  return p.replace(/\D/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = body.identifier || body.phone || body.email;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Укажите телефон или email и пароль' },
        { status: 400 }
      );
    }

    const db = getDb();
    const cleanId = cleanPhone(identifier);
    const lowerId = identifier.trim().toLowerCase();

    const user = db.users.find((u) => {
      if (cleanId.length >= 7 && cleanPhone(u.phone) === cleanId) {
        return true;
      }
      if (u.email && u.email.toLowerCase() === lowerId) {
        return true;
      }
      return false;
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    const expectedHash = Buffer.from(password).toString('base64');
    if (user.passwordHash !== expectedHash && user.passwordHash !== password) {
      return NextResponse.json(
        { success: false, error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newSession: AuthSession = {
      id: `s_${Date.now()}`,
      userId: user.id,
      token: sessionToken,
      expiresAt,
      createdAt: now,
    };

    db.sessions.push(newSession);
    saveDb(db);

    const cookieStore = cookies();
    cookieStore.set('zherles_session_token', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    const tierInfo = calculateTierInfo(user.bonusBalance, user.visitsCount);
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: sessionToken,
      tierInfo,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при входе' },
      { status: 500 }
    );
  }
}
