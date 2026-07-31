import { POST } from '../../app/api/whatsapp/send/route';
import { NextRequest } from 'next/server';

// Helper to construct NextRequest for POST /api/whatsapp/send
function createRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/whatsapp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// Store original fetch
const originalFetch = global.fetch;

async function runEmpiricalTests() {
  console.log('=== STARTING EMPIRICAL CHALLENGER VERIFICATION ===\n');
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failedCount++;
    }
  }

  // Ensure production mode for strict error response tests
  process.env.NODE_ENV = 'production';
  process.env.MOCK_GREEN_API = 'false';
  process.env.GREENAPI_TOKEN = 'test_mock_token_123';
  process.env.GREENAPI_URL = 'https://7107.api.greenapi.com';
  process.env.GREENAPI_ID = '710722698257';

  // -------------------------------------------------------------
  // TEST GROUP 1: Edge Cases - Phone Number Validation
  // -------------------------------------------------------------
  console.log('--- Test Group 1: Invalid/Empty Phone Numbers ---');

  // 1a. Empty phone string
  let res = await POST(createRequest({ phone: '', message: 'Test' }));
  let json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error === 'Укажите номер телефона и текст сообщения',
    '1a. Empty phone string returns 400 with helpful error message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 1b. Missing phone parameter
  res = await POST(createRequest({ message: 'Test' }));
  json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error === 'Укажите номер телефона и текст сообщения',
    '1b. Missing phone parameter returns 400 with helpful error message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 1c. Short phone number (< 10 digits)
  res = await POST(createRequest({ phone: '12345', message: 'Test' }));
  json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error === 'Неверный формат номера телефона',
    '1c. Short phone number (12345) returns 400 with invalid format message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 1d. Non-digit invalid string
  res = await POST(createRequest({ phone: 'invalid-phone', message: 'Test' }));
  json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error === 'Неверный формат номера телефона',
    '1d. Non-digit string returns 400 with invalid format message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // -------------------------------------------------------------
  // TEST GROUP 2: Edge Cases - Message Validation
  // -------------------------------------------------------------
  console.log('\n--- Test Group 2: Missing/Empty Message String ---');

  // 2a. Empty message string
  res = await POST(createRequest({ phone: '77011234567', message: '' }));
  json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error === 'Укажите номер телефона и текст сообщения',
    '2a. Empty message string returns 400 with helpful error message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 2b. Missing message parameter
  res = await POST(createRequest({ phone: '77011234567' }));
  json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error === 'Укажите номер телефона и текст сообщения',
    '2b. Missing message parameter returns 400 with helpful error message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // -------------------------------------------------------------
  // TEST GROUP 3: Phone Formatting Logic
  // -------------------------------------------------------------
  console.log('\n--- Test Group 3: Phone Formatting Logic ---');

  const testCases = [
    { input: '+7 (701) 123-45-67', expectedChatId: '77011234567@c.us', desc: '+7 (701) 123-45-67 formatted' },
    { input: '87011234567', expectedChatId: '77011234567@c.us', desc: '87011234567 leading 8 converted to 7' },
    { input: '77011234567', expectedChatId: '77011234567@c.us', desc: '77011234567 11-digit starting with 7' },
    { input: '7011234567', expectedChatId: '77011234567@c.us', desc: '7011234567 10-digit padded with 7' },
    { input: '77011234567@c.us', expectedChatId: '77011234567@c.us', desc: '77011234567@c.us already includes suffix' },
  ];

  for (const tc of testCases) {
    let capturedChatId = '';
    global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
      if (init && init.body) {
        const bodyObj = JSON.parse(init.body as string);
        capturedChatId = bodyObj.chatId;
      }
      return new Response(JSON.stringify({ idMessage: 'msg-ok-123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    res = await POST(createRequest({ phone: tc.input, message: 'Format test' }));
    json = await res.json();
    assert(
      res.status === 200 && json.success === true && capturedChatId === tc.expectedChatId,
      `3. Phone format "${tc.input}" (${tc.desc}) -> ${tc.expectedChatId}`,
      `capturedChatId: ${capturedChatId}, status: ${res.status}`
    );
  }

  // -------------------------------------------------------------
  // TEST GROUP 4: Upstream Green API Error Handling
  // -------------------------------------------------------------
  console.log('\n--- Test Group 4: Upstream Green API Error Handling ---');

  // 4a. Production mode: Upstream 401 Unauthorized -> status 400 JSON
  process.env.MOCK_GREEN_API = 'false';
  process.env.NODE_ENV = 'production';

  global.fetch = async () => {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  res = await POST(createRequest({ phone: '77011234567', message: 'Test 401' }));
  json = await res.json();
  assert(
    res.status === 400 && json.success === false && json.error.includes('Green API status 401'),
    '4a. Prod mode: Upstream 401 Unauthorized caught -> HTTP 400 JSON without crashing',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 4b. Production mode: Upstream 500 Internal Error -> status 500 JSON
  global.fetch = async () => {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  res = await POST(createRequest({ phone: '77011234567', message: 'Test 500' }));
  json = await res.json();
  assert(
    res.status === 500 && json.success === false && json.error.includes('Green API status 500'),
    '4b. Prod mode: Upstream 500 Internal Error caught -> HTTP 500 JSON without crashing',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 4c. Exception handling: Fetch exception caught by fetch try-catch block
  global.fetch = async () => {
    throw new Error('Network connection failed');
  };

  res = await POST(createRequest({ phone: '77011234567', message: 'Test Network Exception' }));
  json = await res.json();
  assert(
    res.status === 500 && json.success === false && json.error === 'Ошибка соединения с сервером WhatsApp',
    '4c. Fetch exception caught by inner try-catch -> HTTP 500 JSON with connection error message',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // 4d. Demo/Mock Mode Fallback test
  process.env.MOCK_GREEN_API = 'true';
  global.fetch = async () => {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  };
  res = await POST(createRequest({ phone: '77011234567', message: 'Test Mock Mode Fallback' }));
  json = await res.json();
  assert(
    res.status === 200 && json.success === true && json.idMessage === 'mock-wa-msg-99999',
    '4d. Mock mode fallback when upstream 401: returns mock success response for demo',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // Reset env
  process.env.MOCK_GREEN_API = 'false';
  process.env.NODE_ENV = 'production';

  // -------------------------------------------------------------
  // TEST GROUP 5: Missing GREENAPI_TOKEN Configuration
  // -------------------------------------------------------------
  console.log('\n--- Test Group 5: Missing GREENAPI_TOKEN Configuration ---');

  delete process.env.GREENAPI_TOKEN;
  res = await POST(createRequest({ phone: '77011234567', message: 'Test missing token' }));
  json = await res.json();
  assert(
    res.status === 500 && json.success === false && json.error.includes('отсутствует GREENAPI_TOKEN'),
    '5. Missing GREENAPI_TOKEN returns 500 JSON with config error',
    `got status ${res.status}, json: ${JSON.stringify(json)}`
  );

  // Restore fetch
  global.fetch = originalFetch;

  console.log(`\n=== RESULTS: ${passedCount} PASSED, ${failedCount} FAILED ===`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runEmpiricalTests().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
