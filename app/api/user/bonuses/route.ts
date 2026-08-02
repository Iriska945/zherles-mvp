import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb, calculateTierInfo } from '@/lib/db';
import { UserBonusTransaction } from '@/types';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
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
        { success: false, error: 'Сессия недействительна' },
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

    const body = await req.json();
    const { action, amount = 0, promoCode, description } = body;

    let delta = Number(amount) || 0;
    let txType: UserBonusTransaction['type'] = 'EARNED';
    let txDescription = description || 'Начисление бонусов';

    if (action === 'CLAIM_PROMO') {
      delta = delta || 300;
      txType = 'PROMO';
      txDescription = `Активация промокода ${promoCode || 'KORSHI'}`;
    } else if (action === 'REDEEM') {
      delta = -Math.abs(delta);
      txType = 'REDEEMED';
      txDescription = description || 'Списание бонусов';
      if (user.bonusBalance + delta < 0) {
        return NextResponse.json(
          { success: false, error: 'Недостаточно бонусов на балансе' },
          { status: 400 }
        );
      }
    }

    user.bonusBalance += delta;
    user.updatedAt = new Date().toISOString();

    const tierInfo = calculateTierInfo(user.bonusBalance, user.visitsCount);
    user.tier = tierInfo.currentTier;
    user.discountRate = tierInfo.discountRate;

    const newTx: UserBonusTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: user.id,
      type: txType,
      amount: delta,
      description: txDescription,
      createdAt: new Date().toISOString(),
    };

    db.bonusTransactions.push(newTx);
    saveDb(db);

    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      tierInfo,
      bonusBalance: user.bonusBalance,
      transaction: newTx,
    });
  } catch (error: any) {
    console.error('User bonuses route error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при операции с бонусами' },
      { status: 500 }
    );
  }
}
