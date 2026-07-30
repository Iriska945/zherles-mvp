import { AppState } from '../../types';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null { return this.store[key] || null; }
  setItem(key: string, value: string): void { this.store[key] = value.toString(); }
  removeItem(key: string): void { delete this.store[key]; }
  clear(): void { this.store = {}; }
}

const localStorageMock = new LocalStorageMock();
(global as any).window = { localStorage: localStorageMock, dispatchEvent: () => {} };
(global as any).localStorage = localStorageMock;
(global as any).CustomEvent = class { constructor() {} };

import { getInitialState, redeemBonus, resetDemoState, addCampaign } from '../../lib/storage';

console.log('====================================================');
console.log('STARTING ADVERSARIAL EDGE CASE STRESS TESTS');
console.log('====================================================\n');

resetDemoState();

// Edge Case 1: Untrimmed PIN input
console.log('--- Edge Case 1: Untrimmed PIN input ---');
const resUntrimmed = redeemBonus(' 1234 ');
console.log('Untrimmed result:', resUntrimmed);
if (resUntrimmed.success === false && resUntrimmed.error === 'Код бонуса не найден') {
  console.log('✅ Untrimmed PIN correctly rejected without automatic trimming in storage.ts');
} else {
  console.error('❌ Unexpected untrimmed PIN result:', resUntrimmed);
}

// Edge Case 2: Empty PIN input
console.log('\n--- Edge Case 2: Empty PIN input ---');
const resEmpty = redeemBonus('');
console.log('Empty result:', resEmpty);
if (resEmpty.success === false && resEmpty.error === 'Код бонуса не найден') {
  console.log('✅ Empty PIN correctly returns "Код бонуса не найден"');
} else {
  console.error('❌ Unexpected empty PIN result:', resEmpty);
}

// Edge Case 3: Newly created campaign coupon redemption
console.log('\n--- Edge Case 3: Newly created campaign coupon redemption ---');
const newCampaignState = addCampaign({
  id: 'cmp-test-999',
  title: 'Test Campaign',
  sourceBusinessId: 'biz-001',
  targetPartnerIds: ['part-001'],
  rewardText: '100% Free Test Item',
  minSpend: 1000,
  durationDays: 10,
  expireDate: '2026-08-10',
  qrCodeUrl: 'http://test',
  shareMessage: 'Test',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
});

const generatedCoupon = newCampaignState.coupons[0];
console.log(`Generated new coupon with PIN: ${generatedCoupon.pinCode}, reward: ${generatedCoupon.rewardText}`);

const resNewCoupon = redeemBonus(generatedCoupon.pinCode);
console.log('Redeem new campaign coupon result:', resNewCoupon);
if (resNewCoupon.success && resNewCoupon.coupon?.status === 'REDEEMED') {
  console.log('✅ Newly created campaign coupon successfully redeemed');
} else {
  console.error('❌ Failed to redeem newly created campaign coupon:', resNewCoupon);
}

// Re-redeem newly created coupon
const resNewCouponReRedeem = redeemBonus(generatedCoupon.pinCode);
console.log('Re-redeem new campaign coupon result:', resNewCouponReRedeem);
if (resNewCouponReRedeem.success === false && resNewCouponReRedeem.error === 'Бонус уже был использован') {
  console.log('✅ Re-redemption of newly created campaign coupon correctly blocked');
} else {
  console.error('❌ Double redemption allowed on newly created coupon:', resNewCouponReRedeem);
}

console.log('\n====================================================');
console.log('EDGE CASE STRESS TESTS COMPLETED');
console.log('====================================================');
