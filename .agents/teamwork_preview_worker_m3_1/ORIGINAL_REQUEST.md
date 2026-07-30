## 2026-07-30T14:17:26Z
You are a Worker subagent implementing Milestone 3: Campaign Creation Module ("Көрші-маршрут") for MVP "ЖЕРЛЕС".

Project Directory: /Users/ramil/teamwork_projects/zherles_mvp
Your Working Directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m3_1

Tasks:
1. Create your working directory `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m3_1` if not exists and maintain `progress.md`.
2. Implement components and pages for Milestone 3:
   - `components/QRGenerator.tsx`: Dynamic QR code renderer component generating SVG/Canvas QR codes (or using clean SVG QR matrix / `api.qrserver.com` image fallback) with download & print buttons.
   - `app/b2b/campaigns/new/page.tsx`: Step-by-step Campaign Creation Wizard ("Көрші-маршрут"):
     - Support optional pre-fill via `useSearchParams()` query param `templateId`.
     - Step 1: Partner Selection. Grid of available partner businesses from `state.partners` with match score %, district badge, category icon, and select checkboxes.
     - Step 2: Rewards & Conditions. Form inputs for Campaign Title, Reward Description (text), Minimum Spend (KZT), Duration (days), and custom sharing message template.
     - Step 3: Message & QR Preview. Live preview card of client WhatsApp message + generated QR code targeting `/b2c/passport?campaignId=...` + "Запустить акцию" submit button.
     - Submission persists campaign via `useApp().addCampaign(newCampaign)` and redirects to `/b2b/campaigns`.
   - `app/b2b/campaigns/page.tsx`: Active & Past Campaigns Overview page:
     - Header with "Создать новую акцию" button.
     - Summary metrics (Active Campaigns count, Total Issued Coupons, Total Redeemed Bonuses).
     - Grid/List of campaigns showing title, target partners, reward details, status badges (`ACTIVE`, `PAUSED`), coupon stats, QR code preview modal/trigger, and direct link to B2C Passport view.
3. Verify build by executing `npm run build` in `/Users/ramil/teamwork_projects/zherles_mvp/`.
4. Write your handoff report to `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m3_1/handoff.md`.
5. Send a message to parent with build status and report summary.
