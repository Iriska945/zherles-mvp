import { test, expect } from '@playwright/test';

test.describe('Milestone 2 Minimalism UX & Mobile Responsiveness Stress Harness (375px)', () => {

  const pagesToTest = [
    { name: 'Home', path: '/' },
    { name: 'B2C District Passport', path: '/b2c/passport' },
    { name: 'B2C Redeem PIN', path: '/b2c/redeem' },
    { name: 'B2B Onboarding', path: '/b2b/onboarding' },
    { name: 'B2B Catalog', path: '/b2b/catalog' },
    { name: 'B2B Admin', path: '/b2b/admin' },
    { name: 'B2B Dashboard', path: '/b2b/dashboard' },
    { name: 'B2B Campaigns List', path: '/b2b/campaigns' },
    { name: 'B2B Campaign Creation', path: '/b2b/campaigns/new' },
  ];

  test.use({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });

  for (const p of pagesToTest) {
    test(`Mobile 375px Check: ${p.name} (${p.path})`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'networkidle' });

      // 1. Check for horizontal overflow (zero horizontal scroll)
      const hasHorizontalScroll = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        return docWidth > windowWidth || bodyWidth > windowWidth;
      });

      const overflowDetails = await page.evaluate(() => {
        const elementsWithOverflow: string[] = [];
        const windowWidth = window.innerWidth;
        document.querySelectorAll('*').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > windowWidth + 1) { // 1px tolerance for subpixel math
            const tag = el.tagName.toLowerCase();
            const cls = el.className ? `.${String(el.className).split(' ').slice(0, 3).join('.')}` : '';
            elementsWithOverflow.push(`${tag}${cls} (right: ${Math.round(rect.right)}px > ${windowWidth}px)`);
          }
        });
        return elementsWithOverflow.slice(0, 10);
      });

      console.log(`[375px] ${p.name} - Horizontal Scroll: ${hasHorizontalScroll ? 'FAILED' : 'PASSED'}`);
      if (hasHorizontalScroll) {
        console.log(`  Overflow elements:`, overflowDetails);
      }
      expect(hasHorizontalScroll, `Page ${p.path} has horizontal scroll! Overflow elements: ${overflowDetails.join(', ')}`).toBe(false);

      // 2. Check main buttons for min 48px height
      const buttonHeightViolations = await page.evaluate(() => {
        const violations: string[] = [];
        const buttons = Array.from(document.querySelectorAll('button, a.btn, [role="button"]'));
        buttons.forEach((btn) => {
          const rect = btn.getBoundingClientRect();
          // Filter out hidden or collapsed buttons (0x0), small inline filter chips/tags, and emoji selectors
          if (rect.width > 0 && rect.height > 0) {
            const cls = String(btn.className || '');
            const isInlineChip =
              cls.includes('text-[10px]') ||
              cls.includes('text-[11px]') ||
              cls.includes('p-1.5') ||
              btn.closest('.flex-wrap') ||
              btn.closest('td');

            if (!isInlineChip && rect.height < 47.5) {
              const text = (btn.textContent || '').trim().slice(0, 30);
              const clsShort = cls.split(' ').slice(0, 4).join('.');
              violations.push(`"${text}" (${clsShort}) - height: ${rect.height.toFixed(1)}px < 48px`);
            }

          }
        });
        return violations;
      });


      console.log(`[375px] ${p.name} - 48px Button Height: ${buttonHeightViolations.length === 0 ? 'PASSED' : 'FAILED (' + buttonHeightViolations.length + ' violations)'}`);
      if (buttonHeightViolations.length > 0) {
        console.log(`  Violations:`, buttonHeightViolations);
      }

      // 3. Check fixed bottom toolbar obscuration of CTAs / WhatsApp buttons
      const obscurationViolations = await page.evaluate(() => {
        const violations: string[] = [];
        // Find bottom nav element if present
        const bottomNav = Array.from(document.querySelectorAll('*')).find((el) => {
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' && (style.bottom === '0px' || style.bottom === '0');
        });

        if (!bottomNav) return violations;

        const navRect = bottomNav.getBoundingClientRect();
        if (navRect.height === 0) return violations;

        // Check primary action buttons and WhatsApp buttons
        const ctaButtons = Array.from(document.querySelectorAll('button, a[href*="wa.me"], a[href*="whatsapp"]'));
        ctaButtons.forEach((btn) => {
          if (bottomNav.contains(btn)) return; // Ignore buttons inside the bottom nav itself

          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // Check if bottom nav obscures the button
            const isCovered = !(
              rect.bottom <= navRect.top ||
              rect.top >= navRect.bottom ||
              rect.right <= navRect.left ||
              rect.left >= navRect.right
            );

            if (isCovered) {
              const text = (btn.textContent || '').trim().slice(0, 30);
              violations.push(`CTA "${text}" is obscured by fixed bottom nav (btn bottom: ${rect.bottom}px, nav top: ${navRect.top}px)`);
            }
          }
        });
        return violations;
      });

      console.log(`[375px] ${p.name} - Bottom Nav Obscuration: ${obscurationViolations.length === 0 ? 'PASSED' : 'FAILED'}`);
      if (obscurationViolations.length > 0) {
        console.log(`  Violations:`, obscurationViolations);
      }

      expect(buttonHeightViolations, `Page ${p.path} has buttons under 48px height: ${buttonHeightViolations.join('; ')}`).toEqual([]);
      expect(obscurationViolations, `Page ${p.path} has CTAs obscured by bottom nav: ${obscurationViolations.join('; ')}`).toEqual([]);
    });
  }
});
