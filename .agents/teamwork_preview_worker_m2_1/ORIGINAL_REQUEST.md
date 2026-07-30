## 2026-07-30T14:09:57Z
You are a Worker subagent implementing Milestone 2: B2B Module (Onboarding, Catalog, Dashboard & Admin) for MVP "ЖЕРЛЕС".

Project Directory: /Users/ramil/teamwork_projects/zherles_mvp
Your Working Directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m2_1

Tasks:
1. Create your working directory `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m2_1` if not exists and maintain `progress.md`.
2. Implement the following B2B pages and components:
   - `components/RechartsWrapper.tsx`: Dynamic client component wrapper around Recharts (ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell) to prevent SSR hydration errors in Next.js App Router.
   - `app/b2b/onboarding/page.tsx`: Business onboarding form allowing user to update profile details (Business Name, Category/Type dropdown, District dropdown e.g. Алмалинский/Медеуский/Бостандыкский, Average Check in KZT, Contact Person, Phone, Description). Submits via `useApp().updateBusiness()`.
   - `app/b2b/catalog/page.tsx`: Catalog of campaign templates. Search input, Category filter pills, Tag filter buttons, "Рекомендовано для вас" highlight badge, template cards showing recommended reach, ROI %, default reward, tags, and action buttons ("Запустить по шаблону" linking to `/b2b/campaigns/new?templateId=...`, and "Редактировать").
   - `app/b2b/admin/page.tsx`: Admin panel for template CRUD operations. Table of current templates with Create modal / form, Edit modal / form, and Delete action button with state persistence in LocalStorage (`addTemplate`, `deleteTemplate`).
   - `app/b2b/dashboard/page.tsx`: B2B Dashboard for business owners.
     - Top KPI cards (Total Reach, Active Partners, Issued Coupons, Redeemed Bonuses, Conversion Rate %, Cross-Marketing Revenue).
     - Interactive Recharts section with 2 charts: (1) Conversions & Redeemed Bonuses timeline, (2) Revenue breakdown by Partner.
     - CRM Client Table listing test clients with search filter, status badges (NEW, ACTIVE, VIP), partner source, visit count, and spent KZT.
3. Verify build by executing `npm run build` in `/Users/ramil/teamwork_projects/zherles_mvp/`.
4. Write your handoff report to `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m2_1/handoff.md`.
5. Send a message to parent with build status and report summary.
