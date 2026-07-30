import seedData from '../../data/seedData.json';

// --- Global DOM Mocks for Node.js Execution ---
class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

class MockCustomEvent {
  type: string;
  detail: any;
  constructor(type: string, options?: { detail?: any }) {
    this.type = type;
    this.detail = options?.detail;
  }
}

const mockLocalStorage = new MockLocalStorage();
const eventLog: string[] = [];

(global as any).window = {
  dispatchEvent: (event: any) => {
    eventLog.push(event.type);
    return true;
  },
  addEventListener: () => {},
  removeEventListener: () => {}
};
(global as any).localStorage = mockLocalStorage;
(global as any).CustomEvent = MockCustomEvent;

// Dynamically import lib/storage after window/localStorage setup
import {
  getInitialState,
  redeemBonus,
  resetDemoState,
  addCampaign,
  STATE_CHANGE_EVENT
} from '../../lib/storage';

async function runTests() {
  console.log('=== RUNNING EMPIRICAL VERIFICATION SUITE FOR lib/storage.ts ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // --- Test 1: Initial State Loading ---
  console.log('--- Test 1: Initial State Loading ---');
  const initialState = getInitialState();
  assert(
    initialState.business.name === 'Urban Coffee',
    'Initial state loads business name from seedData.json',
    `Expected 'Urban Coffee', got '${initialState?.business?.name}'`
  );
  assert(
    initialState.coupons.length === seedData.coupons.length,
    'Initial state coupon count matches seedData',
    `Expected ${seedData.coupons.length}, got ${initialState.coupons.length}`
  );
  const coupon1234Initial = initialState.coupons.find(c => c.pinCode === '1234');
  assert(
    coupon1234Initial?.status === 'ACTIVE',
    'Coupon 1234 initial status is ACTIVE',
    `Expected 'ACTIVE', got '${coupon1234Initial?.status}'`
  );
  assert(
    mockLocalStorage.getItem('zherles_app_state_v1') !== null,
    'Initial state persisted to localStorage',
    'localStorage key zherles_app_state_v1 is null'
  );

  // --- Test 2: Active Bonus Redemption ---
  console.log('\n--- Test 2: Active Bonus Redemption (pinCode 1234) ---');
  const firstRedeemRes = redeemBonus('1234');
  assert(
    firstRedeemRes.success === true,
    'First redemption call returns success: true',
    `Result: ${JSON.stringify(firstRedeemRes)}`
  );
  assert(
    firstRedeemRes.coupon?.status === 'REDEEMED',
    'Redeemed coupon status changed to REDEEMED',
    `Status: ${firstRedeemRes.coupon?.status}`
  );
  assert(
    typeof firstRedeemRes.redeemedAt === 'string' && firstRedeemRes.redeemedAt.length > 0,
    'Redeemed coupon contains ISO redeemedAt timestamp',
    `redeemedAt: ${firstRedeemRes.redeemedAt}`
  );
  const stateAfterFirstRedeem = getInitialState();
  const coupon1234AfterRedeem = stateAfterFirstRedeem.coupons.find(c => c.pinCode === '1234');
  assert(
    coupon1234AfterRedeem?.status === 'REDEEMED',
    'LocalStorage updated: coupon 1234 is REDEEMED in state',
    `Status in storage: ${coupon1234AfterRedeem?.status}`
  );

  // --- Test 3: Double-Redemption Blocking ---
  console.log('\n--- Test 3: Double-Redemption Blocking (pinCode 1234 second call) ---');
  const secondRedeemRes = redeemBonus('1234');
  assert(
    secondRedeemRes.success === false,
    'Second redemption call returns success: false',
    `Result: ${JSON.stringify(secondRedeemRes)}`
  );
  assert(
    secondRedeemRes.error === 'Бонус уже был использован',
    'Second redemption returns exact error "Бонус уже был использован"',
    `Error msg: '${secondRedeemRes.error}'`
  );
  assert(
    secondRedeemRes.redeemedAt === firstRedeemRes.redeemedAt,
    'Second redemption returns original redeemedAt timestamp',
    `Expected '${firstRedeemRes.redeemedAt}', got '${secondRedeemRes.redeemedAt}'`
  );

  // --- Test 4: Non-Existent PIN Code ---
  console.log('\n--- Test 4: Invalid PIN Code handling ---');
  const invalidRes = redeemBonus('9999');
  assert(
    invalidRes.success === false && invalidRes.error === 'Код бонуса не найден',
    'Invalid PIN returns success: false and error "Код бонуса не найден"',
    `Result: ${JSON.stringify(invalidRes)}`
  );

  // --- Test 5: Reset Demo State ---
  console.log('\n--- Test 5: Reset Demo State (resetDemoState()) ---');
  const resetState = resetDemoState();
  const coupon1234AfterReset = resetState.coupons.find(c => c.pinCode === '1234');
  assert(
    coupon1234AfterReset?.status === 'ACTIVE',
    'resetDemoState() resets coupon 1234 back to ACTIVE',
    `Status after reset: ${coupon1234AfterReset?.status}`
  );
  assert(
    coupon1234AfterReset?.redeemedAt === undefined,
    'resetDemoState() clears redeemedAt timestamp on coupon 1234',
    `redeemedAt: ${coupon1234AfterReset?.redeemedAt}`
  );

  // Verification after reset: redemption should succeed again
  const postResetRedeem = redeemBonus('1234');
  assert(
    postResetRedeem.success === true,
    'Redemption succeeds again after demo reset',
    `Result: ${JSON.stringify(postResetRedeem)}`
  );

  // --- Test 6: Custom Event Dispatching ---
  console.log('\n--- Test 6: Intra-tab Event Dispatching ---');
  assert(
    eventLog.includes(STATE_CHANGE_EVENT),
    `saveState and resetDemoState dispatch '${STATE_CHANGE_EVENT}' event`,
    `Events logged: ${eventLog.join(', ')}`
  );

  // --- Summary ---
  console.log('\n==================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
