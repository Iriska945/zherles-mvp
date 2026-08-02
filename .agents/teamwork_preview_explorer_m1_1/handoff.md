# Handoff Report — Milestone 1 Investigation & Implementation Strategy

## 1. Observation

### Codebase Inspection Findings
- **`app/page.tsx` (Lines 1–138)**: Currently renders a basic landing page with a hero banner ("Взаимный обмен клиентами"), a 4-card metric grid (showing `state.business.name`, active partner count, campaign count, client count), and basic B2B/B2C navigation links. It lacks:
  - Clear product explanation block detailing the "Көрші-маршрут" model.
  - Interactive district map displaying establishment markers/pins.
  - "Business Passport" modal when pins are clicked.
  - Prominent B2B entry banner/button for business onboarding.
- **`types/index.ts` (Lines 1–113)**: The `Business` (lines 1–11) and `Partner` (lines 13–22) interfaces lack geographic coordinate fields (`coordinates?: { lat: number; lng: number }`), street addresses (`address?: string`), and active promotions lists (`activePromotions?: string[]`).
- **`data/seedData.json` (Lines 1–223)**: Defines 1 primary business ("Urban Coffee", Almaly district) and 4 partners ("ManCave", "FitLife", "Flora", "Croissant Co"). Coordinates and street addresses are missing from all entries.
- **`lib/storage.ts` (Lines 1–200)**: Implements LocalStorage state management (`zherles_app_state_v1`), custom event dispatching (`zherles_state_change`), and initial state hydration from `seedData.json`.
- **`package.json` (Lines 12–28)**: Currently includes `lucide-react`, `next`, `react`, `react-dom`, `recharts`. Leaflet/React-Leaflet are not installed.
- **`e2e/` Specs**: The test suite includes strict mobile responsiveness checks (`m2_minimalism_responsiveness.spec.ts`) requiring 375px viewport compatibility, 0px horizontal scroll, and min 48px button touch target height.

---

## 2. Logic Chain

### Reasoning & Architectural Strategy

1. **Type Definitions & Data Schema Enhancement**:
   - To support map markers and detailed business passports, `Business` and `Partner` in `types/index.ts` must be extended with `coordinates: { lat: number; lng: number }`, `address: string`, and `activePromotions?: string[]`.
   - Add a `BusinessPassportModalData` interface in `types/index.ts` to manage modal state cleanly.

2. **Geographic Seed Data Enrichment**:
   - Update `data/seedData.json` with real Almaty district coordinates and street addresses:
     - **Urban Coffee**: `lat: 43.2565, lng: 76.9284`, address: "ул. Байтирсынова 88, Алмалинский район"
     - **Барбершоп ManCave**: `lat: 43.2542, lng: 76.9321`, address: "ул. Курмангазы 45, Алмалинский район"
     - **Фитнес-клуб FitLife**: `lat: 43.2510, lng: 76.9250`, address: "ул. Шевченко 112, Алмалинский район"
     - **Цветочная студия Flora**: `lat: 43.2580, lng: 76.9360`, address: "ул. Гоголя 67, Алмалинский район"
     - **Пекарня Croissant Co**: `lat: 43.2430, lng: 76.9540`, address: "пр. Достык 120, Медеуский район"

3. **Product Explanation Block (`components/ProductExplanation.tsx`)**:
   - Create a dedicated, visual 3-step explanation component:
     1. **Шаг 1. Локальная коалиция**: Неконкурирующие заведения одного района (кофейня + барбершоп + фитнес) объединяются без рекламных расходов.
     2. **Шаг 2. Запуск Көрші-маршрута**: Создаются взаимные акции — клиент кофейни получает купон в салон, а клиент салона — подарок в кофейне.
     3. **Шаг 3. Паспорт района для жителей**: Жители района накапливают бонусы и приводят повторный клиентопоток.

4. **Dynamic Live Count Component**:
   - Calculate live total collaborating businesses dynamically from state: `1 (state.business) + state.partners.length` (or `state.partners.filter(p => p.status === 'ACTIVE').length`).
   - Display a live pulsing badge (`LIVE` indicator) that updates in real time upon state changes (e.g. adding partner or resetting demo).

5. **Interactive District Map Component (`components/InteractiveMap.tsx`)**:
   - Implement an interactive, responsive vector/SVG district map component for Almaty (covering Almaly, Medeu, Bostandyk, Auezov districts).
   - *Rationale for SVG/Vector approach*: 100% SSR-safe in Next.js App Router, zero external npm package install required, zero tile CDN latency/CORS risk, instant load in Playwright headless tests, fully custom styled with Tailwind CSS emerald markers, interactive tooltips, and click event handlers for pin selection.

6. **Business Passport Modal Component (`components/BusinessPassportModal.tsx`)**:
   - Triggered when any establishment pin is clicked on the map or in the directory list.
   - Renders business name, category badge, district, real address, average check (`avgCheck` in KZT), match score, contact info, and active promotion details.
   - Includes actionable CTAs:
     - **B2B CTA**: "Запустить Көрші-маршрут" -> navigates to `/b2b/campaigns/new?partnerId={id}`.
     - **B2C CTA**: "Забрать бонус в Паспорте" -> navigates to `/b2c/passport`.

7. **Prominent B2B & B2C Entry Points on `/`**:
   - Add a high-visibility B2B Hero banner ("Для предпринимателей: Привлекайте новых клиентов без затрат на таргетинг") with a primary CTA button navigating to `/b2b/onboarding` and `/b2b/dashboard`.
   - Add a high-visibility B2C banner ("Для жителей района: Цифровой Паспорт вашего микрорайона") with a CTA button navigating to `/b2c/passport`.

---

## 3. Caveats

- **SSR & Next.js App Router Boundaries**: All interactive components (`InteractiveMap.tsx`, `BusinessPassportModal.tsx`, `ProductExplanation.tsx`) must use the `'use client'` directive.
- **Mobile Touch Target Requirements**: Per `e2e/m2_minimalism_responsiveness.spec.ts`, all clickable map markers, pin cards, and modal action buttons must maintain minimum 48px touch target height to ensure 100% mobile accessibility compliance.
- **State Reactivity**: Dynamic business counters and active promotions inside the modal must subscribe to `useApp()` state to reflect live changes immediately.

---

## 4. Conclusion

The implementation strategy for Milestone 1 (Requirement R1) is fully outlined and architected. The exact list of file changes and additions needed is:

1. **`types/index.ts`**: Add `coordinates`, `address`, and `activePromotions` to `Business` & `Partner`. Add `BusinessPassportModalData` type.
2. **`data/seedData.json`**: Populate Almaty coordinates and addresses for all businesses.
3. **`components/ProductExplanation.tsx`**: Create 3-step product explanation card component.
4. **`components/InteractiveMap.tsx`**: Create interactive Almaty vector map component with pins, tooltips, and click callbacks.
5. **`components/BusinessPassportModal.tsx`**: Create business passport modal overlay with avg check, district, active promos, and CTAs.
6. **`app/page.tsx`**: Reconstruct homepage to combine Hero, Product Explanation, Live Counter, Interactive Map, Directory Grid, and B2B/B2C entry points.
7. **`e2e/m1_interactive_homepage.spec.ts`**: Add E2E tests for map pin interaction, passport modal, dynamic counter, and B2B entry points.

---

## 5. Verification Method

To verify the implementation once executed by the implementer agent:

1. **TypeScript & Compilation Verification**:
   ```bash
   npm run build
   ```
   Must succeed with zero TypeScript or Next.js build errors.

2. **Interactive Homepage E2E Test Suite**:
   ```bash
   npx playwright test e2e/m1_interactive_homepage.spec.ts
   ```
   Verifies that:
   - Dynamic live count displays total collaborating businesses correctly.
   - Interactive map pins render for Almaty establishments.
   - Clicking a pin opens the Business Passport modal displaying business name, avg check, district, and active promos.
   - B2B entry point button navigates to B2B module.

3. **Full Regression & Mobile Responsiveness Check**:
   ```bash
   npx playwright test
   ```
   Ensures all existing tests (`zherles_mvp.spec.ts`, `m2_minimalism_responsiveness.spec.ts`, `whatsapp_challenger.spec.ts`) pass without regression.
