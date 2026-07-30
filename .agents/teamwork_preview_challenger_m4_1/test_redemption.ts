import { AppState, BonusCoupon } from '../../types';

// Step 1: Mock browser environment (window, localStorage, CustomEvent)
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const localStorageMock = new LocalStorageMock();
(global as any).window = {
  localStorage: localStorageMock,
  dispatchEvent: (event: any) => {},
};
(global as any).localStorage = localStorageMock;
(global as any).CustomEvent = class CustomEvent {
  constructor(public type: string, public detail?: any) {}
};

// Import storage functions after mocking environment
import { getInitialState, saveState, redeemBonus, resetDemoState } from '../../lib/storage';

interface TestResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  details?: string;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, expected: any, actual: any, details?: string) {
  results.push({
    name,
    passed: condition,
    expected,
    actual,
    details,
  });
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name}\n   Expected: ${JSON.stringify(expected)}\n   Actual:   ${JSON.stringify(actual)}`);
  }
}

async function runEmpiricalTests() {
  console.log('====================================================');
  console.log('STARTING EMPIRICAL VERIFICATION OF bonus redemption');
  console.log('====================================================\n');

  // Reset state to seed data
  resetDemoState();
  const initialState = getInitialState();
  console.log(`Initial state loaded with ${initialState.coupons.length} coupons.`);

  // Test 1: Redeem valid active coupon (PIN 1234)
  console.log('\n--- Test 1: Redeem valid active coupon (PIN 1234) ---');
  const res1 = redeemBonus('1234');
  assert(
    'Redeem valid active coupon 1234 returns success: true',
    res1.success === true,
    { success: true, status: 'REDEEMED' },
    { success: res1.success, status: res1.coupon?.status },
    `Coupon details: ${res1.coupon?.id}, redeemedAt: ${res1.redeemedAt}`
  );

  assert(
    'Redeem valid active coupon 1234 updates coupon status to REDEEMED',
    res1.coupon?.status === 'REDEEMED',
    'REDEEMED',
    res1.coupon?.status
  );

  assert(
    'Redeem valid active coupon 1234 includes valid redeemedAt timestamp',
    typeof res1.redeemedAt === 'string' && res1.redeemedAt.length > 0 && !isNaN(Date.parse(res1.redeemedAt)),
    'valid ISO timestamp',
    res1.redeemedAt
  );

  // Test 2: Immediate re-redemption with same PIN 1234
  console.log('\n--- Test 2: Immediate re-redemption with same PIN 1234 ---');
  const res2 = redeemBonus('1234');
  assert(
    'Re-redeeming PIN 1234 returns success: false',
    res2.success === false,
    false,
    res2.success
  );

  assert(
    'Re-redeeming PIN 1234 returns exact error "Бонус уже был использован"',
    res2.error === 'Бонус уже был использован',
    'Бонус уже был использован',
    res2.error
  );

  assert(
    'Re-redeeming PIN 1234 returns previous redeemedAt timestamp',
    res2.redeemedAt === res1.redeemedAt,
    res1.redeemedAt,
    res2.redeemedAt
  );

  // Test 3: Redeem pre-seeded redeemed coupon 5678
  console.log('\n--- Test 3: Redeem pre-seeded redeemed coupon 5678 ---');
  const res3 = redeemBonus('5678');
  assert(
    'Redeeming pre-seeded redeemed coupon 5678 returns success: false',
    res3.success === false,
    false,
    res3.success
  );

  assert(
    'Redeeming pre-seeded redeemed coupon 5678 returns exact error "Бонус уже был использован"',
    res3.error === 'Бонус уже был использован',
    'Бонус уже был использован',
    res3.error
  );

  assert(
    'Redeeming pre-seeded redeemed coupon 5678 returns pre-seeded redeemedAt timestamp',
    res3.redeemedAt === '2026-07-29T18:10:00Z',
    '2026-07-29T18:10:00Z',
    res3.redeemedAt
  );

  // Test 4: Invalid / non-existent PIN 0000
  console.log('\n--- Test 4: Invalid/non-existent PIN 0000 ---');
  const res4 = redeemBonus('0000');
  assert(
    'Redeeming invalid PIN 0000 returns success: false',
    res4.success === false,
    false,
    res4.success
  );

  assert(
    'Redeeming invalid PIN 0000 returns exact error "Код бонуса не найден"',
    res4.error === 'Код бонуса не найден',
    'Код бонуса не найден',
    res4.error
  );

  // Test 5: State persistence across reload (getInitialState)
  console.log('\n--- Test 5: State persistence across reload (getInitialState) ---');
  const reloadedState = getInitialState();
  const reloadedCoupon1234 = reloadedState.coupons.find((c) => c.pinCode === '1234');
  const reloadedCoupon5678 = reloadedState.coupons.find((c) => c.pinCode === '5678');
  const reloadedCoupon7890 = reloadedState.coupons.find((c) => c.pinCode === '7890');

  assert(
    'Reloaded state contains coupon 1234 with status REDEEMED',
    reloadedCoupon1234?.status === 'REDEEMED',
    'REDEEMED',
    reloadedCoupon1234?.status
  );

  assert(
    'Reloaded state coupon 1234 matches redeemedAt timestamp from test 1',
    reloadedCoupon1234?.redeemedAt === res1.redeemedAt,
    res1.redeemedAt,
    reloadedCoupon1234?.redeemedAt
  );

  assert(
    'Reloaded state coupon 5678 remains REDEEMED',
    reloadedCoupon5678?.status === 'REDEEMED',
    'REDEEMED',
    reloadedCoupon5678?.status
  );

  assert(
    'Reloaded state coupon 7890 remains ACTIVE',
    reloadedCoupon7890?.status === 'ACTIVE',
    'ACTIVE',
    reloadedCoupon7890?.status
  );

  // Summary
  console.log('\n====================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runEmpiricalTests().catch((err) => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});
