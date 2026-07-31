import { test, expect } from '@playwright/test';

test.describe('WhatsApp Green API Challenger Empirical E2E & API Edge Tests', () => {

  test('Edge Case 1: Empty or missing phone numbers return 400 JSON', async ({ request }) => {
    // Missing phone field
    const res1 = await request.post('/api/whatsapp/send', {
      data: { message: 'Тест без телефона' },
    });
    expect(res1.status()).toBe(400);
    const json1 = await res1.json();
    expect(json1.success).toBe(false);
    expect(json1.error).toContain('Укажите номер телефона');

    // Empty phone string
    const res2 = await request.post('/api/whatsapp/send', {
      data: { phone: '', message: 'Тест с пустым телефоном' },
    });
    expect(res2.status()).toBe(400);
    const json2 = await res2.json();
    expect(json2.success).toBe(false);
    expect(json2.error).toContain('Укажите номер телефона');

    // Short phone number (<10 digits)
    const res3 = await request.post('/api/whatsapp/send', {
      data: { phone: '12345', message: 'Короткий номер' },
    });
    expect(res3.status()).toBe(400);
    const json3 = await res3.json();
    expect(json3.success).toBe(false);
    expect(json3.error).toContain('Неверный формат номера');

    // Non-digit string
    const res4 = await request.post('/api/whatsapp/send', {
      data: { phone: 'invalid-phone-str', message: 'Буквенный номер' },
    });
    expect(res4.status()).toBe(400);
    const json4 = await res4.json();
    expect(json4.success).toBe(false);
    expect(json4.error).toContain('Неверный формат номера');
  });

  test('Edge Case 2: Empty or missing message string returns 400 JSON', async ({ request }) => {
    // Missing message field
    const res1 = await request.post('/api/whatsapp/send', {
      data: { phone: '77011234567' },
    });
    expect(res1.status()).toBe(400);
    const json1 = await res1.json();
    expect(json1.success).toBe(false);
    expect(json1.error).toContain('Укажите номер телефона и текст сообщения');

    // Empty message string
    const res2 = await request.post('/api/whatsapp/send', {
      data: { phone: '77011234567', message: '' },
    });
    expect(res2.status()).toBe(400);
    const json2 = await res2.json();
    expect(json2.success).toBe(false);
    expect(json2.error).toContain('Укажите номер телефона и текст сообщения');
  });

  test('Edge Case 3: Valid phone and message returns 200 JSON success', async ({ request }) => {
    const res = await request.post('/api/whatsapp/send', {
      data: { phone: '+7 (701) 123-45-67', message: 'Тест валидного отправления' },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.idMessage).toBeDefined();
  });

});
