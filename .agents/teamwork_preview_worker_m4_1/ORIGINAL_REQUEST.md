## 2026-07-30T09:21:02Z

You are a Worker subagent implementing Milestone 4: B2C Module ("Паспорт района" & 4-Digit PIN Bonus Redemption) for MVP "ЖЕРЛЕС".

Project Directory: /Users/ramil/teamwork_projects/zherles_mvp
Your Working Directory: /Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m4_1

Tasks:
1. Create your working directory `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m4_1` if not exists and maintain `progress.md`.
2. Implement components and pages for Milestone 4:
   - `components/ShareButtons.tsx`: Messenger share buttons component. Generates pre-filled share links for WhatsApp (`https://wa.me/?text=...`) and Telegram (`https://t.me/share/url?url=...&text=...`), plus native web share / copy link fallback with visual feedback.
   - `app/b2c/passport/page.tsx`: Mobile-adaptive "Паспорт района" interface:
     - Wrap in mobile viewport container (`max-w-md mx-auto shadow-2xl min-h-screen bg-slate-50`).
     - Header displaying District Name (e.g. "Паспорт Алмалинского района"), welcome message, active deals list from `state.districtPassport` and `state.campaigns`.
     - Active deal cards with category icon, partner business name, discount/reward description, QR code preview modal button, and messenger share section (`ShareButtons`).
     - Quick "Погасить бонус по PIN-коду" button opening PIN redemption modal or navigating to `/b2c/redeem`.
     - Support `pin` query parameter in URL (e.g. `/b2c/passport?pin=1234`) inside React `<Suspense>` wrapper to auto-focus or pre-fill bonus card.
   - `app/b2c/redeem/page.tsx`: 4-digit PIN Bonus Redemption page / modal:
     - Input field for 4-digit PIN code with numeric keypad / clean digit inputs.
     - Form submission calls `redeemBonus(pinCode)` from `AppContext`.
     - SUCCESS STATE: Shows green success banner ("Бонус успешно погашен!"), reward details, partner name, and redeemed timestamp.
     - RE-REDEMPTION BLOCKED STATE: When entering an already redeemed PIN code (e.g., `5678` or `1234` second time), displays prominent red error alert ("Ошибка: Бонус уже использован!") with the exact previous redemption timestamp.
     - Ensures state updates immediately in LocalStorage and re-renders dynamically.
3. Verify build by executing `npm run build` in `/Users/ramil/teamwork_projects/zherles_mvp/`.
4. Write your handoff report to `/Users/ramil/teamwork_projects/zherles_mvp/.agents/teamwork_preview_worker_m4_1/handoff.md`.
5. Send a message to parent with build status and report summary.

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
