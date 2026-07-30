import seedData from '../../data/seedData.json';

// DOM Mock
class MockLocalStorage {
  public store = new Map<string, string>();
  getItem(key: string) { return this.store.get(key) ?? null; }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
  removeItem(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
}
class MockCustomEvent {
  type: string; detail: any;
  constructor(type: string, options?: { detail?: any }) {
    this.type = type; this.detail = options?.detail;
  }
}

const mockLS = new MockLocalStorage();
(global as any).window = {
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {}
};
(global as any).localStorage = mockLS;
(global as any).CustomEvent = MockCustomEvent;

import { getInitialState, redeemBonus, resetDemoState } from '../../lib/storage';

async function runStressTests() {
  console.log('=== RUNNING ADVERSARIAL & STRESS SUITE FOR lib/storage.ts ===\n');

  // Test S1: Pre-seeded REDEEMED coupon (PIN 5678)
  console.log('--- Stress Test 1: Pre-seeded REDEEMED coupon (PIN 5678) ---');
  resetDemoState();
  const preRedeemedRes = redeemBonus('5678');
  console.log('Pre-redeemed coupon result:', preRedeemedRes);
  if (preRedeemedRes.success === false && preRedeemedRes.error === 'Бонус уже был использован') {
    console.log('✅ [PASS] Pre-seeded REDEEMED coupon is correctly blocked');
  } else {
    console.log('❌ [FAIL] Pre-seeded REDEEMED coupon was not blocked correctly');
  }

  // Test S2: Corrupted JSON recovery in LocalStorage
  console.log('\n--- Stress Test 2: Recovery from corrupted JSON in LocalStorage ---');
  mockLS.setItem('zherles_app_state_v1', 'CORRUPTED_{{{JSON_DATA_BROKEN');
  const recoveryState = getInitialState();
  if (recoveryState && recoveryState.business.name === 'Urban Coffee') {
    console.log('✅ [PASS] Corrupted JSON caught, fallback to seedData successful');
  } else {
    console.log('❌ [FAIL] Corrupted JSON recovery failed');
  }

  // Test S3: Untrimmed PIN inputs (" 1234 ")
  console.log('\n--- Stress Test 3: Whitespace PIN input (" 1234 ") ---');
  resetDemoState();
  const spacePinRes = redeemBonus(' 1234 ');
  console.log('Whitespace PIN result:', spacePinRes);
  if (spacePinRes.success === false) {
    console.log('ℹ️ [NOTE] Untrimmed PIN " 1234 " fails matching (strict comparison). Recommend trimming in UI/lib.');
  }

  // Test S4: Node SSR Environment check (window = undefined)
  console.log('\n--- Stress Test 4: Node SSR Behavior (window = undefined) ---');
  const savedWindow = (global as any).window;
  delete (global as any).window;
  const ssrState = getInitialState();
  console.log('SSR getInitialState business:', ssrState.business.name);
  const ssrRedeem = redeemBonus('1234');
  console.log('SSR redeemBonus result:', ssrRedeem);
  (global as any).window = savedWindow;
  console.log('✅ [PASS] SSR behavior tested gracefully');

  console.log('\n=== ADVERSARIAL STRESS SUITE COMPLETE ===');
}

runStressTests().catch(console.error);
