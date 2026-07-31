# Handoff Report — Milestone 1 (WhatsApp Green API Integration) Review

## Review Summary

**Verdict**: **FAIL**

---

## 1. Observation

### Build & E2E Test Execution
- **Command**: `npm run build`
  - **Result**: PASSED cleanly. Next.js 14.2.35 generated static pages (13/13) and dynamic API routes (`/api/whatsapp/send`).
- **Command**: `npx playwright test`
  - **Result**: **FAILED** (Exit code 1, 12 test failures out of 22 test runs across Chromium and Mobile Chrome projects).
  - **Verbatim Error (Mobile Chrome - Test 7)**:
    ```text
    1) [Mobile Chrome] › e2e/zherles_mvp.spec.ts:191:7 › MVP ЖЕРЛЕС E2E Test Suite › Test 7: Green API WhatsApp Send Integration
       Test timeout of 30000ms exceeded.
       Error: locator.click: Test timeout of 30000ms exceeded.
       Call log:
         - waiting for getByRole('button', { name: /WhatsApp/i }).first()
           - locator resolved to <button type="button" title="Поделиться в WhatsApp через Green API" class="inline-flex items-center space-x-1.5 ...">...</button>
         - attempting click action
           - waiting for element to be visible, enabled and stable
           - element is visible, enabled and stable
           - scrolling into view if needed
           - done scrolling
           - <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl z-40">...</div> intercepts pointer events
    ```

### Code & Config Inspection Findings
- **File**: `/Users/ramil/teamwork_projects/zherles_mvp/.gitignore` (Lines 1-5):
  ```gitignore
  node_modules/
  .next/
  playwright-report/
  test-results/
  ```
  - **Observation**: `.env.local` or `.env*` is **NOT listed in `.gitignore`**.
- **File**: `/Users/ramil/teamwork_projects/zherles_mvp/.env.local` (Lines 1-3):
  ```env
  GREENAPI_URL=https://7107.api.greenapi.com
  GREENAPI_ID=710722698257
  GREENAPI_TOKEN=8e5ed41b52a44dbe8a74e50ae8ad7a04958f3eebe8004fcfbf
  ```
  - **Observation**: Real API token credentials exist in `.env.local`, which is untracked by `.gitignore` and eligible to be committed to git.
- **File**: `/Users/ramil/teamwork_projects/zherles_mvp/app/api/whatsapp/send/route.ts` (Lines 35-37):
  ```ts
  const greenApiUrl = process.env.GREENAPI_URL || 'https://7107.api.greenapi.com';
  const greenApiId = process.env.GREENAPI_ID || '710722698257';
  const greenApiToken = process.env.GREENAPI_TOKEN;
  ```
  - **Observation**: `greenApiId` fallback value `'710722698257'` is hardcoded in source code.

---

## 2. Logic Chain

1. **E2E Test Failure on Mobile Chrome**:
   - Observations show that when running `npx playwright test` on the `Mobile Chrome` (Pixel 5) viewport, `Test 7: Green API WhatsApp Send Integration` fails due to pointer event interception.
   - Specifically, `ShareButtons.tsx` on `/b2c/passport` places the "WhatsApp" button in a section covered by the fixed bottom navigation bar (`div.fixed.bottom-0.z-40`).
   - Consequently, real mobile users (and Playwright Mobile Chrome runner) cannot tap the WhatsApp share button because clicks are intercepted by the bottom bar.
   - Therefore, the feature fails mobile layout/interaction acceptance criteria and breaks E2E test execution.

2. **Security & Git Integrity Risk**:
   - Observations show `.env.local` contains `GREENAPI_TOKEN=8e5ed41b52a44dbe8a74e50ae8ad7a04958f3eebe8004fcfbf`.
   - `.gitignore` only excludes `node_modules/`, `.next/`, `playwright-report/`, and `test-results/`. `.env.local` is missing.
   - Leaving `.env.local` exposed in git repositories violates basic secret-handling rules ("no hardcoded tokens in repo, read from env").
   - In addition, hardcoding `'710722698257'` as a default fallback in `app/api/whatsapp/send/route.ts` line 36 embeds account-specific identifiers in source code.

3. **Sanitization & Desktop UI Assessment**:
   - Sanitization logic in `app/api/whatsapp/send/route.ts` (converting `8701...` to `7701...` and appending `@c.us`) operates as intended for valid phone formats.
   - Desktop UI feedback displaying `"Сообщение отправлено ✓"` in `components/ShareButtons.tsx` functions properly when un-obscured.
   - However, the mobile layout bug and secret exposure require a **FAIL** verdict.

---

## 3. Caveats

- Upstream live network calls to Green API servers were tested using Playwright network interception mocks (`page.route('**/waInstance*/**', ...)`), as required by network isolation constraints.
- No other caveats.

---

## 4. Conclusion

**Verdict**: **FAIL**

The implementation cannot be approved in its current state due to:
1. **Critical E2E Test Failure / Mobile UI Defect**: Test 7 fails on `Mobile Chrome` viewport because `fixed bottom-0` navigation bar overlays and intercepts clicks on the `ShareButtons` WhatsApp button.
2. **Critical Security Issue**: `.env.local` containing `GREENAPI_TOKEN` is not ignored in `.gitignore`, posing a secret exposure risk in git.
3. **Hardcoded Credential Fallback**: `app/api/whatsapp/send/route.ts` line 36 contains a hardcoded fallback Green API Instance ID (`710722698257`).

---

## 5. Verification Method

To verify these findings independently:

1. **Verify Mobile UI Interception Bug & Test Failure**:
   ```bash
   npx playwright test --project="Mobile Chrome" e2e/zherles_mvp.spec.ts:191
   ```
   *Expected result*: Test fails with timeout / pointer event interception error on `<div class="fixed bottom-0...">`.

2. **Verify Security / Git Exposure**:
   ```bash
   cat .gitignore
   ```
   *Expected result*: `.env.local` is missing from `.gitignore`.
   ```bash
   git status
   ```
   *Expected result*: `.env.local` is listed as an untracked/committed file.

3. **Verify Build Status**:
   ```bash
   npm run build
   ```
   *Expected result*: Next.js build completes cleanly (0 TypeScript/lint errors).

---

## Findings Summary

### [Critical] Finding 1: E2E Failure on Mobile Viewport (UI Interception)
- **Where**: `components/ShareButtons.tsx` on `/b2c/passport`
- **Why**: Fixed bottom navigation toolbar (`div.fixed.bottom-0.z-40`) overlaps the WhatsApp button on mobile viewport sizes (Pixel 5), intercepting clicks and timing out Playwright Test 7.
- **Suggestion**: Adjust padding/margin on `/b2c/passport` or z-index / container positioning so that action buttons are not covered by the fixed bottom navbar.

### [Critical] Finding 2: Exposed Secrets in Repository (`.env.local` missing from `.gitignore`)
- **Where**: `.gitignore` and `.env.local`
- **Why**: `.env.local` contains `GREENAPI_TOKEN` but is not excluded in `.gitignore`. Secrets will be leaked to git control.
- **Suggestion**: Add `.env.local` and `.env*.local` to `.gitignore` immediately.

### [Major] Finding 3: Hardcoded Account Instance ID Fallback in API Route
- **Where**: `app/api/whatsapp/send/route.ts`:36
- **Why**: `const greenApiId = process.env.GREENAPI_ID || '710722698257';` hardcodes an account instance ID into application source code.
- **Suggestion**: Remove hardcoded fallback instance ID; require `process.env.GREENAPI_ID` or return a 500 error if missing, similar to `GREENAPI_TOKEN`.

---

## Verified Claims

- `npm run build` succeeds → verified via running build command → **PASS**
- Phone number sanitization (8->7 and @c.us suffix) → verified via code inspection → **PASS**
- Desktop UI toast / success message ("Сообщение отправлено ✓") → verified via Desktop Chrome E2E → **PASS**
- Mobile Chrome E2E Test 7 execution → verified via `npx playwright test` → **FAIL**
