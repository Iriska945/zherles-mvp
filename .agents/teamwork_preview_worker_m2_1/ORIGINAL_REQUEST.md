## 2026-08-01T15:21:07Z
<USER_REQUEST>
You are a Worker agent assigned to implement Milestone 2 (B2C Personal Cabinet with Real Database & Auth System - Requirement R2) for the ЖЕРЛЕС MVP project.

Working directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m2_1
Project root: /Users/ramil/teamwork_projects/zherles_mvp

Read the detailed implementation design in:
`/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_explorer_m2_1/handoff.md`

Your tasks:
1. Update `types/index.ts`:
   - Add `UserTier`, `User`, `AuthSession`, `UserBonusTransaction`, `TierInfo`, `UserCabinetData`, `AuthResponse`, and `DatabaseSchema`.
2. Create `lib/db.ts`:
   - Implement file-backed JSON database engine managing `data/db.json` with atomic file replace writes (`saveDb`), initial seed hydration, and `calculateTierInfo` for Kazakh B2C tiers ("Сосед-Новичок", "Активный Көрші", "Почетный Көрші", "Легенда Района").
3. Create API routes:
   - `POST /api/auth/register/route.ts`: Create user, set HTTP-Only cookie `zherles_session_token`, return user & token.
   - `POST /api/auth/login/route.ts`: Authenticate phone/email + password, set cookie, return user.
   - `POST /api/auth/logout/route.ts`: Clear session token from DB and cookie.
   - `GET /api/auth/me/route.ts`: Read session cookie, return active user & tier info.
   - `GET /api/user/cabinet/route.ts`: Return full `UserCabinetData` (profile, tier info, bonus balance, active coupons, transactions).
   - `POST /api/user/bonuses/route.ts`: Add or redeem bonus points, update DB atomically.
   - `POST /api/b2c/redeem/route.ts`: Redeem PIN coupon with anti-fraud double-redemption check and update logged-in user bonus balance (+500 points).
4. Create `context/AuthContext.tsx`:
   - React AuthProvider supplying `user`, `cabinetData`, `isAuthenticated`, `login`, `register`, `logout`, `refreshCabinet`.
   - Wrap app in `app/layout.tsx` with `AuthProvider`.
5. Create `app/b2c/cabinet/page.tsx`:
   - Full B2C Personal Cabinet page featuring:
     - Auth form tabs for unauthenticated guests ("Вход" / "Регистрация").
     - Logged-in profile view with tier badge, progress bar to next tier, live bonus balance counter, active discounts/coupons list, transaction history, and Logout button.
6. Address minor M1 polish items:
   - Add `Escape` key listener to `components/BusinessPassportModal.tsx`.
   - Ensure header navigation touch targets are min 48px and mobile view at 375px has zero horizontal overflow.
7. Create Playwright test `e2e/m2_b2c_cabinet_auth.spec.ts`:
   - Test auth prompt, user registration, session persistence across page reload, bonus redemption & tier upgrade, and logout.
8. Run build and test verification:
   - `npm run build`
   - `npx playwright test e2e/m2_b2c_cabinet_auth.spec.ts`
   - `npx playwright test`

Write your handoff report to `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m2_1/handoff.md` and notify the orchestrator.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
</USER_REQUEST>
