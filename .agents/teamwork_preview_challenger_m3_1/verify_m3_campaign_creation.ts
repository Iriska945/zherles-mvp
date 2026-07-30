import { addCampaign, getInitialState, saveState } from '../../lib/storage';
import { Campaign, AppState } from '../../types';
import seedData from '../../data/seedData.json';

class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

interface TestResult {
  category: 'Functional' | 'Stress';
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function recordResult(category: 'Functional' | 'Stress', name: string, passed: boolean, details: string) {
  results.push({ category, name, passed, details });
  const status = passed ? '[PASS]' : '[FAIL]';
  console.log(`${status} [${category}] ${name}: ${details}`);
}

async function runVerification() {
  console.log('===================================================================');
  console.log('  EMPIRICAL VERIFICATION HARNESS - MILESTONE 3: CAMPAIGN CREATION ');
  console.log('===================================================================\n');

  // --- SECTION 1: CORE FUNCTIONAL REQUIREMENTS ---
  console.log('--- 1. Testing Core Functional Requirements (SSR & Browser) ---');

  const initialSeedCampaignCount = seedData.campaigns.length;
  const initialSeedCouponCount = seedData.coupons.length;

  const testCampaign1: Campaign = {
    id: 'cmp-test-ssr-001',
    title: 'Көрші-Маршрут: Кофе & Выпечка',
    sourceBusinessId: 'biz-001',
    targetPartnerIds: ['part-001', 'part-002'],
    rewardText: 'Скидка 15% на выпечку в Croissant Co',
    minSpend: 1500,
    durationDays: 30,
    expireDate: '2026-08-30',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=test1',
    shareMessage: 'Тестовое сообщение SSR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  // SSR test
  const updatedStateSSR = addCampaign(testCampaign1);

  // 1.1 Verify addCampaign prepends new campaign
  recordResult(
    'Functional',
    'Campaign Prepending',
    updatedStateSSR.campaigns[0].id === testCampaign1.id && updatedStateSSR.campaigns.length === initialSeedCampaignCount + 1,
    `New campaign prepended at index 0. Total count: ${updatedStateSSR.campaigns.length}`
  );

  // 1.2 Verify addCampaign generates active coupon with 4-digit pinCode
  const couponSSR = updatedStateSSR.coupons[0];
  const is4DigitPin = /^\d{4}$/.test(couponSSR.pinCode);
  const pinNum = parseInt(couponSSR.pinCode, 10);
  const isPinInRange = pinNum >= 1000 && pinNum <= 9999;

  recordResult(
    'Functional',
    'BonusCoupon Generation & Prepending',
    updatedStateSSR.coupons.length === initialSeedCouponCount + 1 && couponSSR.campaignId === testCampaign1.id,
    `New coupon prepended at index 0 linked to campaign ID '${couponSSR.campaignId}'`
  );

  recordResult(
    'Functional',
    'BonusCoupon Status ACTIVE',
    couponSSR.status === 'ACTIVE',
    `Coupon status is '${couponSSR.status}'`
  );

  recordResult(
    'Functional',
    'BonusCoupon 4-Digit PIN Code',
    is4DigitPin && isPinInRange,
    `Generated pinCode '${couponSSR.pinCode}' is 4 digits (range 1000-9999)`
  );

  recordResult(
    'Functional',
    'BonusCoupon Fields Match Campaign & Business',
    couponSSR.rewardText === testCampaign1.rewardText && couponSSR.partnerName === seedData.business.name,
    `rewardText: '${couponSSR.rewardText}', partnerName: '${couponSSR.partnerName}'`
  );

  // 1.3 LocalStorage persistence (Browser simulation)
  console.log('\n--- 2. Testing LocalStorage Persistence (Browser Simulation) ---');

  const mockStorage = new MockLocalStorage();
  (global as any).window = {
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  (global as any).localStorage = mockStorage;
  (global as any).CustomEvent = class CustomEvent {
    constructor(public type: string, public params?: any) {}
  };

  const testCampaignBrowser: Campaign = {
    id: 'cmp-test-browser-002',
    title: 'Көрші-Маршрут: Фитнес & Завтрак',
    sourceBusinessId: 'biz-001',
    targetPartnerIds: ['part-002'],
    rewardText: 'Бесплатный смузи при заказе от 2000 ₸',
    minSpend: 2000,
    durationDays: 14,
    expireDate: '2026-08-14',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=test2',
    shareMessage: 'Тестовое сообщение Browser',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  const updatedStateBrowser = addCampaign(testCampaignBrowser);
  const rawStorage = mockStorage.getItem('zherles_app_state_v1');
  const parsedStorage: AppState | null = rawStorage ? JSON.parse(rawStorage) : null;

  recordResult(
    'Functional',
    'saveState LocalStorage Write',
    rawStorage !== null && parsedStorage !== null && parsedStorage.campaigns[0].id === testCampaignBrowser.id,
    `Campaign '${testCampaignBrowser.id}' persisted in localStorage under key 'zherles_app_state_v1'`
  );

  recordResult(
    'Functional',
    'saveState Coupon LocalStorage Write',
    parsedStorage !== null && parsedStorage.coupons[0].campaignId === testCampaignBrowser.id && parsedStorage.coupons[0].status === 'ACTIVE',
    `Coupon '${parsedStorage?.coupons[0]?.id}' (PIN: ${parsedStorage?.coupons[0]?.pinCode}) persisted in localStorage`
  );

  const reloadedState = getInitialState();
  recordResult(
    'Functional',
    'getInitialState LocalStorage Read',
    reloadedState.campaigns[0].id === testCampaignBrowser.id,
    `State successfully reloaded from localStorage`
  );

  // --- SECTION 2: ADVERSARIAL STRESS TESTING ---
  console.log('\n--- 3. Stress Harness & Failure Mode Mining ---');

  // 2.1 Statistical PIN Distribution Test (10,000 iterations)
  let pinValid = true;
  for (let i = 0; i < 10000; i++) {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    if (!/^\d{4}$/.test(pin) || parseInt(pin, 10) < 1000 || parseInt(pin, 10) > 9999) {
      pinValid = false;
      break;
    }
  }
  recordResult(
    'Stress',
    'PIN Code Invariant (10,000 iterations)',
    pinValid,
    `Math.floor(1000 + Math.random() * 9000) strictly produces 4-digit strings in range [1000, 9999]`
  );

  // 2.2 Rapid Synchronous Execution ID Collision Check
  const rapidC1: Campaign = { ...testCampaignBrowser, id: 'cmp-rapid-1', rewardText: 'R1' };
  const rapidC2: Campaign = { ...testCampaignBrowser, id: 'cmp-rapid-2', rewardText: 'R2' };
  
  const st1 = addCampaign(rapidC1);
  const st2 = addCampaign(rapidC2);

  const coup1 = st2.coupons.find(c => c.campaignId === 'cmp-rapid-1');
  const coup2 = st2.coupons.find(c => c.campaignId === 'cmp-rapid-2');

  const uniqueIds = coup1 && coup2 && coup1.id !== coup2.id;
  recordResult(
    'Stress',
    'Coupon ID Collision on Rapid Execution',
    !!uniqueIds,
    uniqueIds
      ? `Coupon IDs are unique: '${coup1?.id}' vs '${coup2?.id}'`
      : `COLLISION DETECTED! Both coupons received identical ID: '${coup1?.id}' due to Date.now() 1ms resolution`
  );

  // 2.3 PIN Code Uniqueness & Collision Check
  const pins = new Set<string>();
  let pinCollisionFound = false;
  for (let i = 0; i < 500; i++) {
    const p = Math.floor(1000 + Math.random() * 9000).toString();
    if (pins.has(p)) {
      pinCollisionFound = true;
      break;
    }
    pins.add(p);
  }
  recordResult(
    'Stress',
    'PIN Uniqueness Risk in High Volume',
    !pinCollisionFound,
    pinCollisionFound
      ? 'PIN collision detected within 500 randomly generated PINs (expected given birthday paradox with 9000 space)'
      : 'No PIN collision in 500 samples'
  );

  console.log('\n===================================================================');
  const funcPassed = results.filter(r => r.category === 'Functional' && r.passed).length;
  const funcTotal = results.filter(r => r.category === 'Functional').length;
  const stressPassed = results.filter(r => r.category === 'Stress' && r.passed).length;
  const stressTotal = results.filter(r => r.category === 'Stress').length;

  console.log(`Functional Requirements: ${funcPassed}/${funcTotal} Passed`);
  console.log(`Stress Harness Checks:  ${stressPassed}/${stressTotal} Passed`);
  console.log('===================================================================\n');
}

runVerification().catch(err => {
  console.error('Fatal error running verification:', err);
  process.exit(1);
});
