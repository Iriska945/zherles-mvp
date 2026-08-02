# Milestone 1 Empirical Verification & Stress Test Handoff Report

## Observation

### 1. Production Build Execution (`npm run build`)
- **Command**: `npm run build`
- **Result**: FAILED (Exit Code 1)
- **Verbatim Error Output**:
  ```text
  > zherles-mvp@0.1.0 build
  > next build

    ▲ Next.js 14.2.35
    - Environments: .env.local

     Creating an optimized production build ...
   ✓ Compiled successfully
     Linting and checking validity of types ...
     Collecting page data ...

  > Build error occurred
  Error: ENOENT: no such file or directory, open '/Users/ramil/teamwork_projects/zherles_mvp/.next/build-manifest.json'
      at async open (node:internal/fs/promises:640:25)
      at async Object.readFile (node:internal/fs/promises:1287:14)
      at async readManifest (/Users/ramil/teamwork_projects/zherles_mvp/node_modules/next/dist/build/index.js:165:23)
  ```

### 2. Standard Playwright Tests Execution
- **Command**: `npx playwright test e2e/m1_interactive_homepage.spec.ts`
- **Result**: PASSED 10/10 (100%) tests across Chromium and Mobile Chrome.
- **Command**: `npx playwright test`
- **Result**: 25 passed, 23 failed across workspace test suites.

### 3. Empirical Feature-by-Feature Verification
- **Map District Filter Tabs**:
  - `components/InteractiveMap.tsx:60-71, 106-121`: Tab options (`ALL`, `Алмалинский`, `Медеуский`, `Бостандыкский`) correctly filter `allBusinesses` array. `ALL` returns 5 items, `Алмалинский` returns 4 items, `Медеуский` returns 1 item ("Croissant Co"), `Бостандыкский` returns 0 items.
  - *Grammar Flaw*: `InteractiveMap.tsx:194` hardcodes `{filteredBusinesses.length} мест` regardless of count, producing ungrammatical Russian output (`1 мест`, `4 мест`, `0 мест`).

- **Marker Hover Tooltips & Click Event Dispatching**:
  - `components/InteractiveMap.tsx:209-257`: Hover triggers `.aria-tooltip` transition (`opacity-100 scale-100`). Pin `<button>` and card elements dispatch `onSelectBusiness(biz)` opening `BusinessPassportModal`.
  - *Mobile Chrome (375px) Failure Mode*: Pin hover/click events fail on mobile due to pointer interception:
    ```text
    - <div class="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin">…</div> intercepts pointer events
    - <span class="bg-emerald-600...">ЖЕРЛЕС</span> from <header class="bg-white border-b border-slate-200 sticky top-0 z-50">… controls pointer events
    ```

- **Modal Backdrop Click & Escape Key Closing Handlers**:
  - `components/BusinessPassportModal.tsx:17-27`: Backdrop `<div onClick={onClose}>` with inner `<div onClick={(e) => e.stopPropagation()}>` works correctly when clicking outside the dialog content.
  - *Missing Feature / Bug*: `components/BusinessPassportModal.tsx:1-143` contains **NO `useEffect` or `onKeyDown` event listener for the Escape key** (`e.key === 'Escape'`). Pressing Escape key fails to close the modal (`expect(modal).not.toBeVisible()` times out after 1000ms).

- **B2B CTA Navigation Links**:
  - `app/page.tsx:67, 155, 163`:
    - Hero button "Запустить Көрші-маршрут" links to `/b2b/dashboard`.
    - B2B Banner link "Перейти в Дашборд" links to `/b2b/dashboard`.
    - B2B Banner link "Подключить бизнес" links to `/b2b/onboarding`.
  - Clicking `/b2b/onboarding` successfully navigates to `/b2b/onboarding`.

- **Touch Targets & 375px Mobile Viewport Rendering**:
  - *Mobile 375px Horizontal Overflow*: `scrollWidth` on 375px viewport is **417.35px** (exceeds 375px width by 42.35px):
    - `components/Header.tsx:31-51`: `<nav className="flex items-center space-x-3 sm:space-x-4">` containing logo, B2B link, B2C link, and ResetDemoButton extends to `right: 417.35px`.
    - `app/page.tsx:37-38`: Background glow elements with negative margins (`-mr-16 -mt-16 w-80 h-80`) extend to `right: 423px`.
  - *Touch Target Heights*: `components/Header.tsx:34, 42` nav links use `py-1.5` yielding a height of ~30px (< 48px required minimum touch target height).

---

## Logic Chain

1. **Build Instability**: Execution of `npm run build` failed twice with `ENOENT: no such file or directory, open '.next/build-manifest.json'`. Next.js page collection phase fails to output mandatory Next.js manifest files, indicating the production build is currently unstable.
2. **Missing Keyboard Accessibility**: Code inspection of `BusinessPassportModal.tsx` confirms zero references to `Escape` or `keydown` event listeners. Empirical test execution of `page.keyboard.press('Escape')` failed to dismiss the modal, proving that modal keyboard escape dismissal is unhandled.
3. **Mobile Layout & Viewport Breakage**: Nav links in `Header.tsx` are arranged in a horizontal `flex` container without wrapping or mobile dropdown behavior. On a 375px screen width, `document.documentElement.scrollWidth` measures 417.35px, causing horizontal scrolling and breaking mobile layout compliance. Additionally, sticky header elements obscure map pin click targets on mobile viewports.
4. **Grammar & Localization Deficit**: `InteractiveMap.tsx:194` outputs `{filteredBusinesses.length} мест`. In Russian language declension, 1 requires "место", 4 requires "места", and 5 requires "мест". Hardcoding "мест" creates incorrect UI text (`1 мест`, `4 мест`).

---

## Caveats

- Playwright tests were run using local webServer configuration (`http://localhost:3000`).
- No modifications were made to application source files, per Review-Only & Empirical Challenger role constraints.
- Custom verification test file `e2e/m1_challenger_verification.spec.ts` was added to project root `e2e/` directory to document and reproduce failure modes empirically.

---

## Conclusion

Milestone 1 (Interactive Homepage & Map Component) satisfies basic functional requirements in desktop browsers (district filter switching, marker click dispatching, B2B CTA route links, backdrop click closing), but **FAILS empirical stress testing** due to four blocking issues:
1. `npm run build` production build failure (`ENOENT: build-manifest.json`).
2. Missing modal `Escape` key closing handler in `BusinessPassportModal.tsx`.
3. 375px mobile viewport horizontal overflow (`scrollWidth` 417.35px > 375px) caused by `Header.tsx` nav overflow and hero background glows.
4. Mobile Chrome map pin click/hover pointer interception by sticky header and SVG overlays.

---

## Verification Method

To independently verify these empirical findings, execute the following commands in `/Users/ramil/teamwork_projects/zherles_mvp`:

1. **Verify Build Error**:
   ```bash
   npm run build
   ```
   *Expected result*: Process terminates with exit code 1 due to ENOENT build-manifest error.

2. **Verify Milestone 1 Baseline E2E Suite**:
   ```bash
   npx playwright test e2e/m1_interactive_homepage.spec.ts
   ```
   *Expected result*: 10/10 tests pass.

3. **Verify Challenger Empirical Stress Suite**:
   ```bash
   npx playwright test e2e/m1_challenger_verification.spec.ts
   ```
   *Expected result*: 7 tests pass, 5 tests fail detailing the Escape key timeout, mobile 375px horizontal overflow (417.35px), and mobile Chrome map pin pointer interception.

---

## Adversarial Challenge Report

### Challenge Summary
**Overall risk assessment**: HIGH

### Challenges

#### 1. [High] Modal Accessibility: Missing Escape Key Close Handler
- **Assumption challenged**: Modals handle standard keyboard accessibility events.
- **Attack scenario**: Keyboard-only users or users pressing `Escape` to close `BusinessPassportModal` are unable to dismiss the dialog.
- **Blast radius**: Traps keyboard navigation focus inside open modal.
- **Mitigation**: Add `useEffect` listener for `Escape` key in `BusinessPassportModal.tsx`:
  ```tsx
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  ```

#### 2. [High] Mobile Responsiveness: 375px Horizontal Viewport Overflow
- **Assumption challenged**: Homepage renders cleanly on mobile viewports (375px).
- **Attack scenario**: Opening homepage on iPhone SE (375px) causes horizontal scrolling (`scrollWidth` 417.35px) due to un-wrapped header nav and non-clipped hero background glows.
- **Blast radius**: Degraded mobile user experience, broken layout alignment.
- **Mitigation**: Add mobile menu toggle or `overflow-x-auto` to `Header.tsx` nav, and apply `overflow-hidden` on parent hero section.

#### 3. [Medium] Mobile Map Interaction: Sticky Header Pointer Interception
- **Assumption challenged**: Map pins are clickable on small screens.
- **Attack scenario**: On 375px mobile viewports, sticky header overlaps the top map pins, intercepting click and hover events.
- **Blast radius**: Users cannot open passports for businesses located near top map coordinates on mobile.
- **Mitigation**: Adjust map container margin / z-index or add `touch-action` / scroll offset padding.

### Stress Test Results
- `npm run build` → Production build → FAILED (ENOENT manifest missing)
- District Filter Tabs → Click filter options → PASSED (Counts: ALL=5, Almaly=4, Medeu=1, Bostandyk=0)
- Modal Backdrop Click → Click outside dialog → PASSED
- Modal Escape Key → Press `Escape` → FAILED (Modal remains visible)
- B2B Links → Click `/b2b/onboarding` and `/b2b/dashboard` → PASSED
- 375px Mobile Viewport → Check `scrollWidth` <= 375 → FAILED (`scrollWidth` = 417.35px)
