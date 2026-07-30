import {
  getInitialState,
  saveState,
  resetDemoState,
  updateBusinessProfile,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  STATE_CHANGE_EVENT,
} from '../../lib/storage';
import seedData from '../../data/seedData.json';
import { Business, CampaignTemplate } from '../../types';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`[PASS] ${name}: ${details}`);
  } else {
    results.push({ name, passed: false, details, error: 'Assertion failed' });
    console.error(`[FAIL] ${name}: ${details}`);
  }
}

// Global DOM Mocks for Node environment
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

class MockCustomEvent {
  type: string;
  detail: any;
  constructor(type: string, eventInitDict?: { detail?: any }) {
    this.type = type;
    this.detail = eventInitDict?.detail;
  }
}

let dispatchedEvents: { type: string; detail: any }[] = [];

const mockWindow = {
  dispatchEvent: (event: any) => {
    dispatchedEvents.push({ type: event.type, detail: event.detail });
    return true;
  },
};

const mockLocalStorage = new MockLocalStorage();

// Setup global mock
(global as any).window = mockWindow;
(global as any).localStorage = mockLocalStorage;
(global as any).CustomEvent = MockCustomEvent;

async function runTests() {
  console.log('==================================================');
  console.log('RUNNING B2B STORAGE VERIFICATION TESTS (Milestone 2)');
  console.log('==================================================\n');

  // Test 1: getInitialState in browser environment initializes with seedData when storage empty
  try {
    mockLocalStorage.clear();
    const initialState = getInitialState();
    assert(
      initialState.business.name === seedData.business.name,
      'Test 1: getInitialState() default seed load',
      `Loaded seed data business name "${initialState.business.name}" correctly into empty localStorage`
    );
    assert(
      mockLocalStorage.getItem('zherles_app_state_v1') !== null,
      'Test 1b: localStorage populated',
      'zherles_app_state_v1 key set in localStorage on initial seed load'
    );
  } catch (err: any) {
    results.push({ name: 'Test 1', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Test 2: updateBusinessProfile updates business name/district and dispatches event
  try {
    dispatchedEvents = [];
    const currentBus = getInitialState().business;
    const updatedBus: Business = {
      ...currentBus,
      name: 'Кофейня Жулдыз (Updated)',
      district: 'Медеуский район (Updated)',
    };

    const returnedState = updateBusinessProfile(updatedBus);

    assert(
      returnedState.business.name === 'Кофейня Жулдыз (Updated)' &&
        returnedState.business.district === 'Медеуский район (Updated)',
      'Test 2a: updateBusinessProfile returned state',
      'Returned state reflects updated name and district'
    );

    // Verify localStorage persistence
    const storedState = JSON.parse(mockLocalStorage.getItem('zherles_app_state_v1') || '{}');
    assert(
      storedState.business.name === 'Кофейня Жулдыз (Updated)' &&
        storedState.business.district === 'Медеуский район (Updated)',
      'Test 2b: updateBusinessProfile localStorage persistence',
      'localStorage updated with new business profile'
    );

    // Verify event dispatch
    assert(
      dispatchedEvents.length === 1 &&
        dispatchedEvents[0].type === STATE_CHANGE_EVENT &&
        dispatchedEvents[0].detail.business.name === 'Кофейня Жулдыз (Updated)',
      'Test 2c: updateBusinessProfile event dispatch',
      `Event "${STATE_CHANGE_EVENT}" dispatched with updated business detail`
    );
  } catch (err: any) {
    results.push({ name: 'Test 2', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Test 3: addTemplate inserts new template
  try {
    dispatchedEvents = [];
    const newTpl: CampaignTemplate = {
      id: 'tpl-test-101',
      title: 'Скидка 20% на спешелти кофе',
      category: 'Кофейни',
      description: 'При покупке выпечки скидка на любой напиток',
      recommendedFor: 'Кофейни и пекарни',
      defaultReward: '20% скидка на кофе',
      expectedReach: '150-200 клиентов',
      expectedRoi: 'x3.5',
      tags: ['кофе', 'акция', 'утро'],
    };

    const initialTemplateCount = getInitialState().templates.length;
    const newState = addTemplate(newTpl);

    assert(
      newState.templates.length === initialTemplateCount + 1,
      'Test 3a: addTemplate length count',
      `Template count increased from ${initialTemplateCount} to ${newState.templates.length}`
    );

    assert(
      newState.templates[0].id === 'tpl-test-101' && newState.templates[0].title === 'Скидка 20% на спешелти кофе',
      'Test 3b: addTemplate insertion index',
      'New template prepended at index 0 of templates array'
    );

    const storedState = JSON.parse(mockLocalStorage.getItem('zherles_app_state_v1') || '{}');
    assert(
      storedState.templates.some((t: CampaignTemplate) => t.id === 'tpl-test-101'),
      'Test 3c: addTemplate localStorage persistence',
      'New template persisted to localStorage'
    );
  } catch (err: any) {
    results.push({ name: 'Test 3', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Test 4: updateTemplate modifies template title and fields
  try {
    dispatchedEvents = [];
    const updatedTpl: CampaignTemplate = {
      id: 'tpl-test-101',
      title: 'Скидка 30% на все латте (Обновлено)',
      category: 'Кофейни',
      description: 'Специальное предложение в обеденное время',
      recommendedFor: 'Все кофейни района',
      defaultReward: '30% скидка',
      expectedReach: '300 клиентов',
      expectedRoi: 'x5.0',
      tags: ['кофе', 'новинка', 'обед'],
    };

    const newState = updateTemplate(updatedTpl);
    const targetInState = newState.templates.find((t) => t.id === 'tpl-test-101');

    assert(
      targetInState !== undefined &&
        targetInState.title === 'Скидка 30% на все латте (Обновлено)' &&
        targetInState.expectedRoi === 'x5.0' &&
        targetInState.tags.includes('новинка'),
      'Test 4a: updateTemplate modifies target template',
      'Template title, expectedRoi, and tags successfully modified'
    );

    const storedState = JSON.parse(mockLocalStorage.getItem('zherles_app_state_v1') || '{}');
    const storedTpl = storedState.templates.find((t: CampaignTemplate) => t.id === 'tpl-test-101');
    assert(
      storedTpl && storedTpl.title === 'Скидка 30% на все латте (Обновлено)',
      'Test 4b: updateTemplate localStorage persistence',
      'Updated template persisted to localStorage'
    );
  } catch (err: any) {
    results.push({ name: 'Test 4', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Test 5: deleteTemplate removes template by ID
  try {
    dispatchedEvents = [];
    const stateBeforeDelete = getInitialState();
    const countBefore = stateBeforeDelete.templates.length;
    const newState = deleteTemplate('tpl-test-101');

    assert(
      newState.templates.length === countBefore - 1,
      'Test 5a: deleteTemplate array length',
      `Template array length reduced from ${countBefore} to ${newState.templates.length}`
    );

    assert(
      !newState.templates.some((t) => t.id === 'tpl-test-101'),
      'Test 5b: deleteTemplate removes target ID',
      'Template "tpl-test-101" no longer exists in returned state'
    );

    const storedState = JSON.parse(mockLocalStorage.getItem('zherles_app_state_v1') || '{}');
    assert(
      !storedState.templates.some((t: CampaignTemplate) => t.id === 'tpl-test-101'),
      'Test 5c: deleteTemplate localStorage persistence',
      'Template "tpl-test-101" deleted from localStorage'
    );
  } catch (err: any) {
    results.push({ name: 'Test 5', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Test 6: Stress Test & Edge Cases
  console.log('\n--- STRESS-TESTING & EDGE CASES ---');
  
  // Edge Case 6a: updateTemplate with non-existent ID
  try {
    const nonexistentTpl: CampaignTemplate = {
      id: 'non-existent-999',
      title: 'Ghost Template',
      category: 'Test',
      description: 'Test',
      recommendedFor: 'Test',
      defaultReward: 'Test',
      expectedReach: '0',
      expectedRoi: '0',
      tags: [],
    };
    const stateBefore = getInitialState();
    const stateAfter = updateTemplate(nonexistentTpl);
    assert(
      stateBefore.templates.length === stateAfter.templates.length &&
        !stateAfter.templates.some((t) => t.id === 'non-existent-999'),
      'Test 6a: updateTemplate with non-existent ID',
      'State templates count unchanged, non-existent template not inserted'
    );
  } catch (err: any) {
    results.push({ name: 'Test 6a', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Edge Case 6b: deleteTemplate with non-existent ID
  try {
    const stateBefore = getInitialState();
    const stateAfter = deleteTemplate('non-existent-888');
    assert(
      stateBefore.templates.length === stateAfter.templates.length,
      'Test 6b: deleteTemplate with non-existent ID',
      'State templates count unchanged when deleting non-existent ID'
    );
  } catch (err: any) {
    results.push({ name: 'Test 6b', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Edge Case 6c: SSR behavior (window === undefined)
  try {
    (global as any).window = undefined;
    const currentState = getInitialState();
    const updatedBus: Business = { ...currentState.business, name: 'SSR Business' };
    const ssrReturnedState = updateBusinessProfile(updatedBus);
    
    // In SSR, return state reflects memory change but saveState was no-op
    assert(
      ssrReturnedState.business.name === 'SSR Business',
      'Test 6c-1: updateBusinessProfile in SSR environment returns updated instance',
      'Function returns updated state in memory during SSR'
    );

    // Restore window
    (global as any).window = mockWindow;
  } catch (err: any) {
    results.push({ name: 'Test 6c', passed: false, details: 'Exception thrown', error: err.message });
  }

  // Test Summary
  console.log('\n==================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('==================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();
