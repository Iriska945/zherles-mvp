import { test, expect } from '@playwright/test';

test.describe('Milestone 1 Challenger Empirical Verification Suite', () => {

  test('Requirement 3.1: District filter tabs filtering (All, Almaly, Medeu, Bostandyk)', async ({ page }) => {
    await page.goto('/');

    const mapSection = page.locator('section').filter({ hasText: /Локальные партнеры микрорайона/i });
    
    const allTab = mapSection.getByRole('button', { name: 'Все районы' });
    const almalyTab = mapSection.getByRole('button', { name: 'Алмалинский' });
    const medeuTab = mapSection.getByRole('button', { name: 'Медеуский' });
    const bostandykTab = mapSection.getByRole('button', { name: 'Бостандыкский' });

    await expect(allTab).toBeVisible();
    await expect(almalyTab).toBeVisible();
    await expect(medeuTab).toBeVisible();
    await expect(bostandykTab).toBeVisible();

    const countBadge = mapSection.locator('.bg-emerald-500.text-white.rounded-full').first();
    await expect(countBadge).toHaveText('5 мест');

    await almalyTab.click();
    await expect(countBadge).toHaveText('4 мест');

    await medeuTab.click();
    await expect(countBadge).toHaveText('1 мест');
    await expect(mapSection.getByText('Croissant Co').first()).toBeVisible();

    await bostandykTab.click();
    await expect(countBadge).toHaveText('0 мест');

    await allTab.click();
    await expect(countBadge).toHaveText('5 мест');
  });

  test('Requirement 3.2: Marker hover tooltips and click event dispatching', async ({ page }) => {
    await page.goto('/');

    const firstPin = page.locator('button[aria-label^="Открыть Паспорт района для"]').first();
    await expect(firstPin).toBeVisible();

    await firstPin.dispatchEvent('click');
    
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('Requirement 3.3a: Modal backdrop click closing handler', async ({ page }) => {
    await page.goto('/');

    const cardBtn = page.locator('button').filter({ hasText: /Открыть Паспорт заведения/i }).first();
    await cardBtn.scrollIntoViewIfNeeded();
    await cardBtn.click({ force: true });

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    await modal.dispatchEvent('click');

    await expect(modal).not.toBeVisible();
  });

  test('Requirement 3.3b: Modal Escape key closing handler (EMPIRICALLY EXPECTED FAILURE)', async ({ page }) => {
    await page.goto('/');

    const cardBtn = page.locator('button').filter({ hasText: /Открыть Паспорт заведения/i }).first();
    await cardBtn.scrollIntoViewIfNeeded();
    await cardBtn.click({ force: true });

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(modal).not.toBeVisible({ timeout: 1000 });
  });

  test('Requirement 3.4: B2B CTA button navigation link to /b2b/onboarding and /b2b/dashboard', async ({ page }) => {
    await page.goto('/');

    const heroB2bBtn = page.getByRole('link', { name: /Запустить Көрші-маршрут/i }).first();
    await expect(heroB2bBtn).toHaveAttribute('href', '/b2b/dashboard');

    const bannerDashboardBtn = page.getByRole('link', { name: /Перейти в Дашборд/i });
    await expect(bannerDashboardBtn).toHaveAttribute('href', '/b2b/dashboard');

    const bannerOnboardingBtn = page.getByRole('link', { name: /Подключить бизнес/i });
    await expect(bannerOnboardingBtn).toHaveAttribute('href', '/b2b/onboarding');

    await bannerOnboardingBtn.click();
    await page.waitForURL('**/b2b/onboarding');
    expect(page.url()).toContain('/b2b/onboarding');
  });

  test('Requirement 3.5: Touch targets and mobile viewport rendering at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const overflowingElements = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('*'));
      return els
        .filter((el) => el.clientWidth > 375 || el.getBoundingClientRect().right > 375)
        .map((el) => ({
          tagName: el.tagName,
          className: el.className,
          right: el.getBoundingClientRect().right,
          scrollWidth: el.scrollWidth,
        }))
        .slice(0, 10);
    });

    console.log('Overflowing elements on 375px viewport:', JSON.stringify(overflowingElements, null, 2));

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

});
