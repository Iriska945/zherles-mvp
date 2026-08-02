## 2026-08-01T15:12:40Z
Implement Milestone 1 (Interactive Homepage & Map Component - Requirement R1) for the ЖЕРЛЕС MVP project.

Working directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m1_1
Project root: /Users/ramil/teamwork_projects/zherles_mvp

Read investigation report and implementation plan at:
`/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_explorer_m1_1/handoff.md`

Tasks:
1. Update `types/index.ts`:
   - Extend `Business` and `Partner` interfaces with `coordinates?: { lat: number; lng: number }`, `address?: string`, `activePromotions?: string[]`.
   - Export `BusinessPassportModalData` type.
2. Update `data/seedData.json`:
   - Enrich all entries (Urban Coffee, ManCave, FitLife, Flora, Croissant Co) with real Almaty district coordinates, street addresses, and active promotion lists.
3. Create `components/ProductExplanation.tsx`:
   - Visual 3-step value proposition component ("Шаг 1. Локальная коалиция", "Шаг 2. Запуск Көрші-маршрута", "Шаг 3. Паспорт района для жителей").
4. Create `components/InteractiveMap.tsx`:
   - Interactive SVG/Vector Almaty district map component with interactive pins for establishments, district filtering tabs (All, Almaly, Medeu, Bostandyk), hover tooltips, and click handlers.
5. Create `components/BusinessPassportModal.tsx`:
   - Modal popup rendering business details, category badge, district & address, average check (in KZT), match score, active promotions list, and clear CTA buttons (B2B "Запустить Көрші-маршрут", B2C "Забрать бонус в Паспорте").
6. Update `app/page.tsx`:
   - Integrate Product Explanation block, dynamic live count of collaborating businesses, Interactive Map with pin click handlers opening `BusinessPassportModal`, and distinct prominent B2B and B2C entry banners/buttons.
7. Create Playwright test `e2e/m1_interactive_homepage.spec.ts`:
   - Test homepage loading, live count display, map rendering, map pin click opening Business Passport modal, and B2B navigation link.
8. Verify your work by running:
   - `npm run build`
   - `npx playwright test e2e/m1_interactive_homepage.spec.ts`
   - Document all build and test command outputs in your handoff report.

Write handoff report to `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m1_1/handoff.md` and send summary message to orchestrator.
