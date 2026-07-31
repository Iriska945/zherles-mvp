# BRIEFING — 2026-08-01T00:28:12Z

## Mission
Implement WhatsApp Green API integration, API route, B2C share modal UI, and Playwright E2E tests.

## 🔒 My Identity
- Archetype: implementer/qa/specialist
- Roles: implementer, qa, specialist
- Working directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m1_1
- Original parent: eb5563f0-f075-40d2-aaef-8bdfef0597c5
- Milestone: Milestone 1 (WhatsApp Green API Integration)

## 🔒 Key Constraints
- CODE_ONLY network mode: do not make outbound external HTTP requests during automated testing unless mocked.
- Real genuine implementation, no cheating or hardcoded mock responses in production code.

## Current Parent
- Conversation ID: eb5563f0-f075-40d2-aaef-8bdfef0597c5
- Updated: 2026-08-01T00:28:12Z

## Task Summary
- **What to build**:
  1. `.env.local` Green API credentials configuration.
  2. Next.js Server API route `app/api/whatsapp/send/route.ts` with phone sanitization and Green API POST forwarder.
  3. UI update in `components/ShareButtons.tsx` (and `app/b2c/passport/page.tsx` if relevant) with phone input modal/prompt and real-time toast feedback.
  4. Playwright tests in `e2e/whatsapp.spec.ts` (or `e2e/zherles_mvp.spec.ts`) with Green API mocking.
  5. Build & test verification (`npm run build`, `npx playwright test`).
- **Success criteria**:
  - `npm run build` passes with zero errors.
  - Playwright test passes.
  - Clean handoff report.

## Change Tracker
- **Files modified**: TBD
- **Build status**: TBD
- **Pending issues**: None

## Quality Status
- **Build/test result**: TBD
- **Lint status**: TBD
- **Tests added/modified**: TBD

## Loaded Skills
- None

## Key Decisions Made
- Starting task analysis and reading Explorer report.

## Artifact Index
- `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m1_1/ORIGINAL_REQUEST.md` — original request
