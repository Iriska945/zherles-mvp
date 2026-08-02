import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb, calculateTierInfo } from '@/lib/db';
import { UserBonusTransaction } from '@/types';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pinCode = (body.pinCode || body.pin || '').toString().trim();

    if (!pinCode || pinCode.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'Укажите 4-значный PIN-код' },
        { status: 400 }
      );
    }

    const db = getDb();
    const coupon = db.coupons.find((c) => c.pinCode === pinCode);

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Купон с таким PIN-кодом не найден' },
        { status: 404 }
      );
    }

    if (coupon.status === 'REDEEMED') {
      return NextResponse.json({
        success: false,
        error: 'Бонус уже был использован',
        redeemedAt: coupon.redeemedAt || new Date().toISOString(),
        coupon,
      });
    }

    const now = new Date().toISOString();
    coupon.status = 'REDEEMED';
    coupon.redeemedAt = now;
    coupon.redeemedByStaff = 'Кассир (Автоматически)';

    // Check if logged in via session cookie
    const cookieStore = cookies();
    const token = cookieStore.get('zherles_session_token')?.value;
    let activeUser = null;

    if (token) {
      const session = db.sessions.find(
        (s) => s.token === token && new Date(s.expiresAt) > new Date()
      );
      if (session) {
        activeUser = db.users.find((u) => u.id === session.userId) || null;
      }
    }

    if (activeUser) {
      activeUser.bonusBalance += 500;
      activeUser.visitsCount += 1;
      activeUser.updatedAt = now;

      const tierInfo = calculateTierInfo(activeUser.bonusBalance, activeUser.visitsCount);
      activeUser.tier = tierInfo.currentTier;
      activeUser.discountRate = tierInfo.discountRate;

      const newTx: UserBonusTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        userId: activeUser.id,
        type: 'EARNED',
        amount: 500,
        description: `Гашение купона: ${coupon.rewardText} (${coupon.partnerName})`,
        createdAt: now,
        relatedCouponId: coupon.id,
      };

      db.bonusTransactions.push(newTx);
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      coupon,
      redeemedAt: now,
    });
  } catch (error: any) {
    console.error('B2C redeem route error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при гашении бонуса' },
      { status: 500 }
    );
  }
}
