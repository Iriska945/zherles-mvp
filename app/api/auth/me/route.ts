import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, calculateTierInfo } from '@/lib/db';

export const dynamic = 'force-dynamic';


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
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const db = getDb();
    const session = db.sessions.find(
      (s) => s.token === token && new Date(s.expiresAt) > new Date()
    );

    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const user = db.users.find((u) => u.id === session.userId);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const tierInfo = calculateTierInfo(user.bonusBalance, user.visitsCount);
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      tierInfo,
    });
  } catch (error: any) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при проверке авторизации' },
      { status: 500 }
    );
  }
}
