import { test, expect } from '@playwright/test';

test.describe('MVP ЖЕРЛЕС E2E Test Suite', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.request.post('/api/demo/reset');
  });



  test('Test 1: Campaign Creation Flow', async ({ page }) => {
    // 1. Navigate to /b2b/campaigns/new
    await page.goto('/b2b/campaigns/new');
    await expect(page.getByText('Создание новой кросс-акции «Көрші-маршрут»')).toBeVisible();

    // 2. Step 1: Partner selection (active partners are selected by default)
    const proceedToStep2Btn = page.getByRole('button', { name: /Далее: Условия & Награды/i });
    await expect(proceedToStep2Btn).toBeVisible();
    await proceedToStep2Btn.click();

    // 3. Step 2: Fill campaign title, reward info & min spend
    const titleInput = page.locator('input[placeholder*="Көрші-Маршрут"]');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('Көрші-Маршрут: Автотест Кофе & Барбер');

    const rewardInput = page.locator('textarea[placeholder*="Скидка"]');
    await rewardInput.fill('Скидка 25% на кофе и услуги барбера');

    const minSpendInput = page.locator('input[type="number"]');
    await minSpendInput.fill('3500');

    const proceedToStep3Btn = page.getByRole('button', { name: /Далее: Превью & QR/i });
    await proceedToStep3Btn.click();

    // 4. Step 3: Verify preview of WhatsApp message & QR Code
    await expect(page.getByText('Превью WhatsApp-сообщения')).toBeVisible();
    await expect(page.getByText('Көрші-Маршрут: Автотест Кофе & Барбер')).toBeVisible();

    // 5. Submit campaign
    const submitBtn = page.getByRole('button', { name: /Запустить акцию «Көрші-маршрут»/i });
    await submitBtn.click();

    // 6. Verify redirect to /b2b/campaigns and campaign title appears
    await page.waitForURL('**/b2b/campaigns');
    await expect(page.getByText('Көрші-Маршрут: Автотест Кофе & Барбер')).toBeVisible();
  });

  test('Test 2: B2C District Passport & Client Simulation', async ({ page }) => {
    // 1. Navigate to /b2c/passport
    await page.goto('/b2c/passport');

    // 2. Verify District Passport header and active deals
    await expect(page.getByText('Паспорт района', { exact: true })).toBeVisible();
    await expect(page.getByText(/Активные предложения района/i)).toBeVisible();
    await expect(page.getByText('ManCave', { exact: false })).toBeVisible();
    await expect(page.getByText('Urban Coffee', { exact: false })).toBeVisible();

    // 3. Trigger QR code modal for a deal
    const qrModalBtn = page.getByRole('button', { name: /QR \/ PIN код/i }).first();
    await expect(qrModalBtn).toBeVisible();
    await qrModalBtn.click();

    // Verify QR modal popup content
    await expect(page.getByText('Покажите QR на кассе')).toBeVisible();
    await expect(page.getByText('ПИН-код для гашения')).toBeVisible();

    // Close QR modal (click close button inside modal)
    const closeModalBtn = page.locator('button:has(svg.lucide-x)').first();
    await closeModalBtn.dispatchEvent('click');


    // 4. Verify WhatsApp and Telegram share buttons exist
    const whatsappBtn = page.getByRole('button', { name: /WhatsApp/i }).first();
    const telegramBtn = page.locator('a[href*="t.me"]').first();
    await expect(whatsappBtn).toBeVisible();
    await expect(telegramBtn).toBeVisible();
  });

  test('Test 3: Bonus Redemption Flow', async ({ page }) => {
    // 1. Navigate to /b2c/redeem
    await page.goto('/b2c/redeem');
    await expect(page.getByText('Ввод 4-значного PIN-кода')).toBeVisible();

    // 2. Enter active 4-digit PIN code '1234' using input digits
    const inputs = page.locator('main form input[type="text"]');
    await inputs.nth(0).fill('1');
    await inputs.nth(1).fill('2');
    await inputs.nth(2).fill('3');
    await inputs.nth(3).fill('4');

    // 3. Submit redemption form
    const redeemSubmitBtn = page.getByRole('button', { name: /Погасить бонус/i });
    await expect(redeemSubmitBtn).toBeEnabled();
    await redeemSubmitBtn.click();

    // 4. Verify green success alert with reward details
    await expect(page.getByText('Бонус успешно погашен!')).toBeVisible();
    await expect(page.getByText('Скидка 20% на стрижку в ManCave')).toBeVisible();
    await expect(page.getByText('Кассир (Автоматически)')).toBeVisible();
  });

  test('Test 4: Anti-Fraud Double-Redemption Blocking', async ({ page }) => {
    // 1. Navigate to /b2c/redeem
    await page.goto('/b2c/redeem');

    // 2. Enter pre-seeded redeemed PIN '5678'
    const inputs = page.locator('main form input[type="text"]');
    await inputs.nth(0).fill('5');
    await inputs.nth(1).fill('6');
    await inputs.nth(2).fill('7');
    await inputs.nth(3).fill('8');

    // 3. Submit redemption
    const redeemSubmitBtn = page.getByRole('button', { name: /Погасить бонус/i });
    await expect(redeemSubmitBtn).toBeEnabled();
    await redeemSubmitBtn.click();

    // 4. Verify prominent red error message & double redemption blocking
    await expect(page.getByText('Ошибка: Бонус уже использован!')).toBeVisible();
    await expect(page.getByText('Повторное использование PIN-кода заблокировано')).toBeVisible();
    await expect(page.getByText('Точное время первого гашения:')).toBeVisible();
  });

  test('Test 5: State Persistence Across Page Reload', async ({ page }) => {
    // 1. Navigate to /b2c/redeem and redeem active PIN '7890'
    await page.goto('/b2c/redeem');

    const inputs = page.locator('main form input[type="text"]');
    await inputs.nth(0).fill('7');
    await inputs.nth(1).fill('8');
    await inputs.nth(2).fill('9');
    await inputs.nth(3).fill('0');

    const redeemSubmitBtn = page.getByRole('button', { name: /Погасить бонус/i });
    await redeemSubmitBtn.click();

    // Verify initial redemption succeeded
    await expect(page.getByText('Бонус успешно погашен!')).toBeVisible();

    // 2. Reload page via page.reload()
    await page.reload();

    // 3. Verify state persisted: attempt redeeming PIN '7890' again
    const inputsAfterReload = page.locator('main form input[type="text"]');
    await inputsAfterReload.nth(0).fill('7');
    await inputsAfterReload.nth(1).fill('8');
    await inputsAfterReload.nth(2).fill('9');
    await inputsAfterReload.nth(3).fill('0');

    const redeemBtnAfterReload = page.getByRole('button', { name: /Погасить бонус/i });
    await redeemBtnAfterReload.click();

    // 4. Expect double-redemption error because redeemed state persisted in LocalStorage
    await expect(page.getByText('Ошибка: Бонус уже использован!')).toBeVisible();
  });

  test('Test 6: Reset Demo State Button', async ({ page }) => {
    // 1. First, perform a redemption so state is modified (PIN '1234')
    await page.goto('/b2c/redeem');

    const inputs = page.locator('main form input[type="text"]');
    await inputs.nth(0).fill('1');
    await inputs.nth(1).fill('2');
    await inputs.nth(2).fill('3');
    await inputs.nth(3).fill('4');

    await page.getByRole('button', { name: /Погасить бонус/i }).click();
    await expect(page.getByText('Бонус успешно погашен!')).toBeVisible();

    // 2. Click "Сбросить демо" button in Header
    const resetButton = page.getByTestId('reset-demo-button');
    await expect(resetButton).toBeVisible();
    await resetButton.click();

    // Verify reset feedback on button
    await expect(page.getByText('Данные сброшены!')).toBeVisible();

    // 3. Reload or navigate to /b2c/redeem and verify PIN '1234' is restored to ACTIVE state
    await page.goto('/b2c/redeem');

    const inputsAfterReset = page.locator('main form input[type="text"]');
    await inputsAfterReset.nth(0).fill('1');
    await inputsAfterReset.nth(1).fill('2');
    await inputsAfterReset.nth(2).fill('3');
    await inputsAfterReset.nth(3).fill('4');

    const redeemBtnAfterReset = page.getByRole('button', { name: /Погасить бонус/i });
    await expect(redeemBtnAfterReset).toBeEnabled();
    await redeemBtnAfterReset.click();

    // Verify PIN '1234' can be redeemed again successfully!
    await expect(page.getByText('Бонус успешно погашен!')).toBeVisible();
  });

  test('Test 7: Green API WhatsApp Send Integration', async ({ page }) => {
    // 1. Intercept and mock external Green API endpoint request
    await page.route('**/waInstance*/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ idMessage: 'mock-wa-msg-99999' }),
      });
    });

    // 2. Directly verify API route POST handler /api/whatsapp/send
    const apiResponse = await page.request.post('/api/whatsapp/send', {
      data: {
        phone: '77011234567',
        message: 'Тестовая акция ЖЕРЛЕС',
      },
    });

    expect(apiResponse.status()).toBe(200);
    const apiJson = await apiResponse.json();
    expect(apiJson.success).toBe(true);

    // 3. Test B2C Passport UI flow
    await page.goto('/b2c/passport');
    const waButton = page.getByRole('button', { name: /WhatsApp/i }).first();
    await expect(waButton).toBeVisible();
    await waButton.scrollIntoViewIfNeeded();
    await waButton.click({ force: true });

    // Fill phone in WhatsApp dialog
    const phoneInput = page.getByPlaceholder(/701/i);
    await expect(phoneInput).toBeVisible();
    await phoneInput.fill('77011234567');

    // Click submit button inside modal
    const sendSubmitBtn = page.getByRole('button', { name: /^Отправить$/i });
    await sendSubmitBtn.click();

    // Verify success message appears
    await expect(page.getByText('Сообщение отправлено ✓')).toBeVisible();
  });

});
