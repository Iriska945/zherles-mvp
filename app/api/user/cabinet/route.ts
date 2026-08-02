import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, calculateTierInfo } from '@/lib/db';
import { UserCabinetData } from '@/types';

export const dynamic = 'force-dynamic';


function cleanPhone(p: string): string {
  return p.replace(/\D/g, '');
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get('zherles_session_token')?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const db = getDb();
    const session = db.sessions.find(
      (s) => s.token === token && new Date(s.expiresAt) > new Date()
    );

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Сессия недействительна или истекла' },
        { status: 401 }
      );
    }

    const user = db.users.find((u) => u.id === session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const tierInfo = calculateTierInfo(user.bonusBalance, user.visitsCount);
    const { passwordHash, ...userWithoutPassword } = user;

    // Filter active coupons for this user or general active coupons
    const userPhoneClean = cleanPhone(user.phone);
    const activeCoupons = db.coupons.filter((c) => {
      if (c.status !== 'ACTIVE') return false;
      if (!c.customerPhone || c.customerPhone === '') return true;
      return cleanPhone(c.customerPhone) === userPhoneClean;
    });

    const recentTransactions = db.bonusTransactions
      .filter((t) => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const cabinetData: UserCabinetData = {
      user: userWithoutPassword,
      tierInfo,
      bonusBalance: user.bonusBalance,
      activeCoupons,
      recentTransactions,
    };

    return NextResponse.json({
      success: true,
      cabinetData,
    });
  } catch (error: any) {
    console.error('User cabinet route error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при получении данных кабинета' },
      { status: 500 }
    );
  }
}
