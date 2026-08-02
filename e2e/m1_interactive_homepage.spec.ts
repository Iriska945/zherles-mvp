import { test, expect } from '@playwright/test';

test.describe('Milestone 1 - Interactive Homepage & Map Component (R1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Homepage loads correctly with Live Count and main hero elements', async ({ page }) => {
    // Check Hero title
    await expect(page.getByRole('heading', { name: /Взаимный обмен клиентами/i })).toBeVisible();

    // Check Live count indicator (5 total businesses: Urban Coffee + 4 partners)
    const liveCounter = page.getByText(/LIVE:/i);
    await expect(liveCounter).toBeVisible();
    await expect(page.getByText(/5 заведений/i).first()).toBeVisible();
  });

  test('2. Product Explanation block renders 3 steps correctly', async ({ page }) => {
    const explanationSection = page.locator('section').filter({ hasText: /Как работают Көрші-маршруты/i });
    await expect(explanationSection).toBeVisible();

    await expect(explanationSection.getByText('Шаг 1')).toBeVisible();
    await expect(explanationSection.getByText('Локальная коалиция')).toBeVisible();

    await expect(explanationSection.getByText('Шаг 2')).toBeVisible();
    await expect(explanationSection.getByText('Запуск Көрші-маршрута')).toBeVisible();

    await expect(explanationSection.getByText('Шаг 3')).toBeVisible();
    await expect(explanationSection.getByRole('heading', { name: 'Паспорт района для жителей' })).toBeVisible();
  });

  test('3. Interactive Map renders pins and responds to district filter tabs', async ({ page }) => {
    // Map Section
    const mapSection = page.locator('section').filter({ hasText: /Локальные партнеры микрорайона/i });
    await expect(mapSection).toBeVisible();

    // SVG Map illustration inside map container
    const svgMap = mapSection.locator('svg').first();
    await expect(svgMap).toBeVisible();

    // Verify district filter tab buttons exist
    const allTab = mapSection.getByRole('button', { name: 'Все районы' });
    const medeuTab = mapSection.getByRole('button', { name: 'Медеуский' });
    const almalyTab = mapSection.getByRole('button', { name: 'Алмалинский' });

    await expect(allTab).toBeVisible();
    await expect(medeuTab).toBeVisible();
    await expect(almalyTab).toBeVisible();

    // Click Medeu district tab
    await medeuTab.click();
    await expect(mapSection.getByRole('heading', { name: /Croissant Co/i }).first()).toBeVisible();

    // Switch back to All districts
    await allTab.click();
    await expect(mapSection.getByRole('heading', { name: /Urban Coffee/i }).first()).toBeVisible();
    await expect(mapSection.getByRole('heading', { name: /ManCave/i }).first()).toBeVisible();
  });

  test('4. Map Pin / Card click opens Business Passport modal with details & CTAs', async ({ page }) => {
    // Click "Открыть Паспорт заведения" button for a partner business
    const cardPassportBtn = page
      .locator('button')
      .filter({ hasText: /Открыть Паспорт заведения/i })
      .first();
    await expect(cardPassportBtn).toBeVisible();
    await cardPassportBtn.scrollIntoViewIfNeeded();
    await cardPassportBtn.click({ force: true });

    // Modal popup should appear
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Modal contents: name, avg check, active promotions
    await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(modal.getByText(/Средний чек/i)).toBeVisible();
    await expect(modal.getByText(/Активные Көрші-акции/i)).toBeVisible();

    // Verify CTAs inside modal
    const b2bCta = modal.getByRole('link', { name: /Запустить Көрші-маршрут/i });
    const b2cCta = modal.getByRole('link', { name: /Забрать бонус в Паспорте/i });

    await expect(b2bCta).toBeVisible();
    await expect(b2cCta).toBeVisible();

    // Close modal via close button
    const closeBtn = modal.getByRole('button', { name: /Закрыть модальное окно/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('5. B2B and B2C Entry Banners navigate to respective modules', async ({ page }) => {
    // B2B Entry Banner link
    const b2bDashboardBtn = page.getByRole('link', { name: /Перейти в Дашборд/i }).first();
    await expect(b2bDashboardBtn).toBeVisible();
    await b2bDashboardBtn.click();

    await page.waitForURL('**/b2b/dashboard');
    expect(page.url()).toContain('/b2b/dashboard');

    // Go back to homepage and test B2C link
    await page.goto('/');
    const b2cPassportBtn = page.getByRole('link', { name: /Открыть Паспорт района/i }).first();
    await expect(b2cPassportBtn).toBeVisible();
    await b2cPassportBtn.click();

    await page.waitForURL('**/b2c/passport');
    expect(page.url()).toContain('/b2c/passport');
  });
});
