import { test, expect } from '@playwright/test';

test.describe('Milestone 2: B2C Personal Cabinet & Real DB Auth E2E Suite', () => {

  test.beforeEach(async ({ request, page, context }) => {
    await context.clearCookies();
    await request.post('/api/demo/reset');
    await page.goto('/b2c/cabinet');
    await page.evaluate(() => localStorage.clear());
  });

  test('M2-Test 1: Unauthenticated User Auth Prompt', async ({ page }) => {
    // Verify prompt for unauthenticated user
    await expect(page.getByText(/Личный кабинет Көрші/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Вход/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Регистрация/i })).toBeVisible();
  });

  test('M2-Test 2: New User Registration & Welcome Bonus', async ({ page }) => {
    // 1. Switch to Registration tab
    await page.getByRole('button', { name: /Регистрация/i }).click();

    // 2. Fill registration form
    const uniquePhone = `+7 (701) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(uniquePhone);
    await page.locator('input[name="name"]').fill('Арман Батыр');
    await page.locator('input[name="password"]').fill('Pass12345');

    // 3. Submit registration
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    // 4. Verify logged-in view
    await expect(page.getByText('Арман Батыр')).toBeVisible();
    await expect(page.getByText('Сосед-Новичок').first()).toBeVisible();
    await expect(page.getByText(/200/).first()).toBeVisible(); // Welcome bonus 200 points
    await expect(page.getByText('5%').first()).toBeVisible(); // 5% initial discount
  });


  test('M2-Test 3: Session Persistence Across Reload', async ({ page }) => {
    // Register user
    await page.getByRole('button', { name: /Регистрация/i }).click();
    const phone = `+7 (702) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill('Динара К.');
    await page.locator('input[name="password"]').fill('Pass12345');
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    await expect(page.getByText('Динара К.')).toBeVisible();

    // Reload page
    await page.reload();

    // Verify session remains active
    await expect(page.getByText('Динара К.')).toBeVisible();
    await expect(page.getByText('Сосед-Новичок').first()).toBeVisible();
  });

  test('M2-Test 4: Real-Time Bonus Accumulation & Tier Upgrade', async ({ page }) => {
    // 1. Register test user
    await page.getByRole('button', { name: /Регистрация/i }).click();
    const phone = `+7 (703) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill('Ерлан Т.');
    await page.locator('input[name="password"]').fill('Pass12345');
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    // 2. Navigate to /b2c/redeem and redeem PIN '7890'
    await page.goto('/b2c/redeem');
    const inputs = page.locator('main form input[type="text"]');
    await inputs.nth(0).fill('7');
    await inputs.nth(1).fill('8');
    await inputs.nth(2).fill('9');
    await inputs.nth(3).fill('0');
    await page.getByRole('button', { name: /Погасить бонус/i }).click();
    await expect(page.getByText('Бонус успешно погашен!')).toBeVisible();

    // 3. Return to cabinet and verify bonus balance increased (+500 -> 700 points) and Tier upgraded to 'Активный Көрші'
    await page.goto('/b2c/cabinet');
    await expect(page.getByText('700').first()).toBeVisible();
    await expect(page.getByText('Активный Көрші').first()).toBeVisible();
    await expect(page.getByText('10%').first()).toBeVisible();
  });

  test('M2-Test 5: User Logout', async ({ page }) => {
    // Register
    await page.getByRole('button', { name: /Регистрация/i }).click();
    const phone = `+7 (704) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill('Айгерим С.');
    await page.locator('input[name="password"]').fill('Pass12345');
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    await expect(page.getByText('Айгерим С.')).toBeVisible();

    // Click logout
    await page.getByRole('button', { name: /Выйти/i }).click();

    // Verify returning to login prompt
    await expect(page.getByText(/Личный кабинет Көрші/i)).toBeVisible();
  });
});
