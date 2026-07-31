## 2026-08-01T00:28:12Z

You are Worker 1 for Milestone 1 (WhatsApp Green API Integration).
Working directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m1_1

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Refer to the Explorer's report at `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_explorer_m1_1/handoff.md`.

Your task:
1. Environment configuration:
   Create or update `/Users/ramil/teamwork_projects/zherles_mvp/.env.local`:
   GREENAPI_URL=https://7107.api.greenapi.com
   GREENAPI_ID=710722698257
   GREENAPI_TOKEN=8e5ed41b52a44dbe8a74e50ae8ad7a04958f3eebe8004fcfbf

2. Next.js Server API Route:
   Create `/Users/ramil/teamwork_projects/zherles_mvp/app/api/whatsapp/send/route.ts`
   - Handle POST request receiving JSON `{ phone, message }`.
   - Validate and sanitize phone number (e.g. remove non-digits; handle 87... -> 77...; format as 77XXXXXXXXX@c.us).
   - Read `GREENAPI_URL`, `GREENAPI_ID`, `GREENAPI_TOKEN` from process.env.
   - Forward request via `fetch` to `${GREENAPI_URL}/waInstance${GREENAPI_ID}/sendMessage/${GREENAPI_TOKEN}` with payload `{ "chatId": chatId, "message": message }`.
   - Return 200 JSON `{ success: true, idMessage: data.idMessage }` on success, or 400/500 JSON `{ success: false, error: ... }` on failure.

3. B2C UI Component Update:
   Update `/Users/ramil/teamwork_projects/zherles_mvp/components/ShareButtons.tsx` (and `app/b2c/passport/page.tsx` if relevant):
   - When clicking "Поделиться в WhatsApp", prompt/open modal for entering phone number (or default test number with option to change).
   - Call `/api/whatsapp/send` with user phone and deal/passport share message.
   - Display real-time UI feedback toast/banner: "Сообщение отправлено ✓" (green) or "Ошибка — попробуйте ещё раз" (red).

4. E2E Test:
   Update `/Users/ramil/teamwork_projects/zherles_mvp/e2e/zherles_mvp.spec.ts` (or create `e2e/whatsapp.spec.ts`):
   - Add test for `/api/whatsapp/send` returning 200 on valid POST request (mocking external Green API endpoint `**/waInstance*/**` with page.route or API request).
   - Verify UI "Поделиться в WhatsApp" displays "Сообщение отправлено ✓".

5. Build & Test Verification:
   - Run `npm run build` and `npx playwright test` to verify zero errors and all tests passing.
   - Document build and test outputs in your handoff report.

6. Write your handoff report to `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m1_1/handoff.md` and send a message back to orchestrator.
