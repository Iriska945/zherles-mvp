# Master Plan — ЖЕРЛЕС MVP Enhancement

## Architecture & Scope Overview
The "ЖЕРЛЕС" project is a Next.js (App Router), TypeScript, Tailwind CSS local business cross-marketing web application.
This enhancement iteration covers 4 core requirement areas (R1-R4):
1. **R1: WhatsApp Green API Integration**: Server API route `/api/whatsapp/send`, `.env.local` configuration (`GREENAPI_URL`, `GREENAPI_ID`, `GREENAPI_TOKEN`), B2C "Share on WhatsApp" button integration with status feedback, and a Playwright test with API mocking.
2. **R2: Minimalism UX Redesign**:
   - Hick's Law: <=4 primary actions per screen above fold.
   - Miller's Law: <=5 navigation items.
   - F-pattern layout: 1-line title, <=2 lines subtitle.
   - Visual hierarchy: Title -> Subtitle/Description -> Large CTA button. No text blocks > 3 lines.
   - Color as signal: Green (success/action), Grey (secondary), Red (error). Max 2 primary colors per page.
   - Mobile B2C: 375px responsive, no horizontal scroll, cards with big icons + 1-3 word labels, min 48px buttons.
   - Desktop B2B: Compact sidebar with icons, single column content, metric cards max 4 per row.
   - Concise text throughout.
3. **R3: `PROJECT.md` Update**: Comprehensive root documentation with 5 sections (Product Description, Status/Roadmap, Developer Instructions, Architecture, WhatsApp Integration).
4. **R4: Retain Existing Functionality**: All modules (B2B Dashboard, CRM, Admin CRUD, Campaign Builder, QR Generation, PIN Redemption) and 12 existing E2E Playwright tests + build validation.

## Milestone Decomposition

### Milestone 1 (M1): WhatsApp Server API & Integration
- **Scope**:
  - Implement `/app/api/whatsapp/send/route.ts` taking `{ phone, message }`, sending POST to `${GREENAPI_URL}/waInstance${GREENAPI_ID}/sendMessage/${GREENAPI_TOKEN}` with `{ chatId: `${cleanPhone}@c.us`, message }`.
  - Create/update `.env.local` containing `GREENAPI_URL=https://7107.api.greenapi.com`, `GREENAPI_ID=710722698257`, `GREENAPI_TOKEN=...`.
  - Update B2C "District Passport" page ("Паспорт района") with "Поделиться в WhatsApp" CTA calling `/api/whatsapp/send`.
  - Add toast/status element displaying "Сообщение отправлено ✓" or "Ошибка — попробуйте ещё раз".
  - Add E2E Playwright test (`e2e/whatsapp.spec.ts`) asserting `/api/whatsapp/send` API functionality and UI trigger.

### Milestone 2 (M2): Minimalism UX Redesign
- **Scope**:
  - Refactor all app pages (Home/B2C, B2B Dashboard, Campaign Builder, CRM, Admin CRUD, PIN Redemption modal/page) for UX minimalism:
    - Hick's Law: Max 4 actions above fold per page.
    - Miller's Law: Navigation menus reduced to max 5 items.
    - F-pattern layout & Visual Hierarchy: 1-line page title, <=2 lines subtitle, clear CTA.
    - Remove long text blocks (no text > 3 lines).
    - Color signals: Green for primary/success, Grey for neutral/secondary, Red for errors. Max 2 main theme colors per page.
    - Mobile B2C: Full responsiveness at 375px width without horizontal scrolling, big icon cards with 1-3 word labels, buttons min 48px height.
    - Desktop B2B: Compact icon sidebar, single column content layout, metric cards max 4 per row.
    - Concise labels and microcopy.
  - Preserve all existing data structures, LocalStorage schema, and functional capabilities.

### Milestone 3 (M3): Documentation (`PROJECT.md`) & Verification
- **Scope**:
  - Update `PROJECT.md` in project root with 5 detailed sections:
    1. Product Description (2-3 paragraphs)
    2. Current Status & Roadmap
    3. Developer Instructions (`npm run dev`, env setup, build)
    4. Architecture Overview (routes, data flow, LocalStorage schema)
    5. WhatsApp Integration details & testing guide.
  - Run `npm run build` and all E2E Playwright tests (all 12 existing + new WhatsApp test).
  - Execute Reviewer, Challenger, and Forensic Auditor verification.

## Execution Schedule & Verification
Each milestone follows:
- Specialist Worker implementation
- Code Review & Quality check (Reviewer)
- Stress & Empirical verification (Challenger)
- Forensic Integrity Audit (Auditor)
