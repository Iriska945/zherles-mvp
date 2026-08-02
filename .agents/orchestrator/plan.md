# Master Plan — ЖЕРЛЕС MVP Full Implementation & Enhancement

## Architecture & Scope Overview
The "ЖЕРЛЕС" project is a Next.js (App Router), TypeScript, Tailwind CSS local business cross-marketing web application.
This iteration implements all core requirements in `ORIGINAL_REQUEST.md`:

1. **R1: Interactive Homepage & Map**:
   - Clear product explanation & live count of collaborating businesses.
   - Real interactive mapping component (e.g. Mapbox / Google / Leaflet OpenStreetMap with real interactive markers).
   - Clicking a business marker opens its Business Passport modal or detailed card.
   - Clear B2B entry point navigating to the business workspace/dashboard.

2. **R2: B2C Personal Cabinet with Real Database & Auth**:
   - Real database & authentication system (e.g., Supabase/Firebase or server DB API with phone/email login & registration).
   - Personal Cabinet showing authenticated user's current level/tier, accumulated bonuses, and active discounts.
   - Real-time read and write of user level, bonus balance, and active discounts to the database.

3. **R3: WhatsApp Bot Experience**:
   - Interactive WhatsApp bot experience delivering promotions and information directly via chat interface/backend webhook integration.
   - Demonstrable flow of user requests (e.g. checking bonuses, requesting local promos, receiving instant discount codes).

4. **R4: Aesthetic & Psychological Optimization**:
   - Light, clean, intuitive UI with Kazakh aesthetic touches (ornament patterns, color palette, typography).
   - Applied social engineering and marketing psychology principles inspired by Zebra Coffee (community belonging, social proof, loyalty triggers).

5. **R5: Documentation, Build & E2E Testing**:
   - Updated `PROJECT.md` documenting architecture, API endpoints, DB schema, and features.
   - `npm run build` succeeds with 0 errors.
   - Comprehensive Playwright E2E tests passing 100%.
   - Full Review, Challenge, and Forensic Integrity Audit.

---

## Milestone Decomposition

### Milestone 1 (M1): Interactive Homepage & Real Map Component (R1)
- **Scope**:
  - Redesign main page (`app/page.tsx`) with product explanation, live count of collaborating businesses, and distinct B2B entry button.
  - Implement real interactive map component (`components/InteractiveMap.tsx`) with business markers.
  - Pin click opens business passport modal (`components/BusinessPassportModal.tsx`) with establishment details, promotions, and quick action.
- **Verification**:
  - Homepage loads without errors, displays product info & business count.
  - Map renders markers correctly.
  - Clicking marker opens Business Passport modal/view.

### Milestone 2 (M2): B2C Personal Cabinet with Real Database & Auth (R2)
- **Scope**:
  - Implement authentication system (registration, login, logout, session persistence by phone/email).
  - Implement real database API routes / storage persistence for user accounts, bonuses, discounts, and tier levels.
  - Build B2C Personal Cabinet page (`app/b2c/cabinet/page.tsx` or `/b2c/passport`) connected to the auth & DB engine.
  - Display authenticated user profile, tier level (e.g., "Сосед-Новичок", "Почетный Көрші"), accumulated bonus points, and active discount cards.
- **Verification**:
  - User can register and log in.
  - User profile reads/writes level, bonuses, and discounts to the real database.

### Milestone 3 (M3): Interactive WhatsApp Bot Experience (R3)
- **Scope**:
  - Implement WhatsApp Bot chat interface (`components/WhatsAppBotSimulator.tsx` or `/whatsapp-bot`) and API handlers.
  - Support automated bot responses for commands like "Акции", "Мои бонусы", "Партнеры рядом", "Получить скидку".
  - Demonstrate complete flow of information retrieval directly in chat.
- **Verification**:
  - Interactive bot responds to user prompts with live business promos and bonus updates.

### Milestone 4 (M4): Kazakh Aesthetics & Marketing Psychology (R4)
- **Scope**:
  - Integrate Kazakh aesthetic elements (custom Kazakh national ornament SVG patterns, color scheme like Sky Blue/Golden Grain/Emerald, Kazakh typography accents).
  - Apply Zebra Coffee-inspired marketing psychology: social proof badges ("1,240 жителей района здесь"), community belonging counters ("Твой Көрші-клуб"), quick service loyalty triggers.
  - Refine overall visual design to be light, spacious, and uncluttered.
- **Verification**:
  - UI visually exhibits Kazakh design touches and social proof/community mechanics.

### Milestone 5 (M5): E2E Verification, Build & Forensic Audit
- **Scope**:
  - Update `PROJECT.md` with new features, routes, DB schema, and test instructions.
  - Implement and run complete Playwright test suite covering Homepage, Map, Auth, Cabinet, WhatsApp Bot, and B2B Dashboard.
  - Ensure `npm run build` passes with 0 errors.
  - Multi-agent gating: Reviewer, Challenger, and Forensic Auditor.
