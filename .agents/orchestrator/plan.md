# Master Execution Plan — MVP "ЖЕРЛЕС"

## Vision & Core Goal
Deliver a fully functional, mobile-responsive B2C and desktop-optimized B2B cross-marketing platform for local businesses ("ЖЕРЛЕС") with Next.js App Router, LocalStorage state persistence, seed data, 4-digit PIN bonus redemption with anti-fraud double-redemption blocking, campaign QR builder, WhatsApp/Telegram share links, and automated Playwright E2E tests verifying all acceptance criteria.

---

## Milestone Decomposition

### Milestone 1: Foundation, Infrastructure & Seed State Engine (M1)
- **Goal**: Initialize Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, and LocalStorage state store with initial seed JSON data and Reset Demo functionality.
- **Deliverables**:
  - `package.json`, `tsconfig.json`, `tailwind.config.js`, `next.config.js`.
  - Data models (`types/index.ts` for Business, Partner, CampaignTemplate, Campaign, ClientCRM, BonusCoupon, RedemptionRecord).
  - Seed JSON dataset (`data/seedData.json`) with realistic local Kazakhstani businesses (cafes, beauty salons, fitness centers, bakeries, car washes across districts like Алмалинский, Медеуский, Бостандыкский).
  - LocalStorage State Manager hook & service (`lib/storage.ts` & `context/AppContext.tsx`) with state persistence, subscriber events, and `resetDemoData()` function.
  - Root Layout with responsive frame switcher / header including "Reset Demo" button ("Сбросить демо").

### Milestone 2: B2B Module — Onboarding, Catalog, Dashboard & Admin (M2)
- **Goal**: Build desktop-optimized B2B workspace for offline business owners.
- **Deliverables**:
  - **Onboarding Page (`/b2b/onboarding`)**: Step-by-step business info collection (Business Name, Category/Type, District/City, Average Check in KZT, Contact Person, Phone, Description).
  - **Catalog of Tools & Templates (`/b2b/catalog`)**: Grid of cross-marketing campaign templates (e.g. "Кофе + Стрижка", "Фитнес + Здоровое питание", "Автомойка + Кафе") with filters by business type/district, ROI/reach recommendations.
  - **Admin Panel (`/b2b/admin`)**: Template CRUD operations (Create, Edit, Delete templates, add custom tags & default rewards).
  - **B2B Dashboard (`/b2b/dashboard`)**:
    - High-level KPIs (Total Reach, Issued Coupons, Redeemed Bonuses, Conversion Rate, Estimated Revenue).
    - Interactive Recharts charts (Daily conversions, Revenue breakdown by partner, Popular reward tiers).
    - CRM Customer Table: list of test clients, acquired via cross-marketing, status (New, Active, Redeemed), contact info, partner source, date.

### Milestone 3: Campaign Creation Module — "Көрші-маршрут" (M3)
- **Goal**: Build step-by-step wizard to create cross-promotional campaigns with partner selection, reward rules, message preview, and QR code generation.
- **Deliverables**:
  - **Wizard UI (`/b2b/campaigns/new`)**:
    - Step 1: Select partner businesses from catalog in the same or adjacent district (with match score & recommendations).
    - Step 2: Configure reward terms (Give reward X when customer spends Y KZT at partner, expiry period in days, max redemptions limit).
    - Step 3: Client message preview (SMS/WhatsApp template format) & QR Code generator (downloadable/printable QR code linking to `/b2c/passport?campaignId=...`).
  - Active campaigns listing page (`/b2b/campaigns`) with status indicators, active QR links, and pause/delete actions.

### Milestone 4: B2C Module — "Паспорт района" & 4-Digit PIN Bonus Redemption (M4)
- **Goal**: Build mobile-optimized customer experience accessible via QR scan or share links with anti-fraud PIN redemption logic.
- **Deliverables**:
  - **"Паспорт района" View (`/b2c/passport`)**:
    - Mobile-first responsive UI presenting local partner deals, map/list of participating neighborhood spots, earned bonuses, active coupons.
  - **Share Mechanism**:
    - "Пригласить друга" (Invite a friend) buttons generating pre-filled shareable URLs for WhatsApp (`https://wa.me/?text=...`) and Telegram (`https://t.me/share/url?url=...`).
  - **Bonus Redemption Flow (`/b2c/redeem` & modal inside Passport)**:
    - Customer presents coupon to partner staff.
    - 4-digit PIN code verification interface (Enter 4-digit code e.g. `1234` or unique coupon code).
    - Successful redemption: Coupon status updates to `REDEEMED`, timestamp logged, CRM table updated in LocalStorage.
    - **Anti-fraud enforcement**: Attempting to redeem an already redeemed 4-digit code MUST fail immediately with clear warning ("Бонус уже был использован [timestamp]"). Double-redemption is strictly blocked in LocalStorage state.

### Milestone 5: E2E Testing Suite & Quality Hardening (Dual Track) (M5)
- **Goal**: End-to-end Playwright automated test suite verifying all functional requirements and acceptance criteria.
- **Deliverables**:
  - `playwright.config.ts` setup.
  - E2E test files covering:
    1. Campaign creation flow via B2B wizard.
    2. B2C client path via District Passport link.
    3. WhatsApp/Telegram share link button triggers.
    4. Successful 4-digit PIN bonus redemption.
    5. Blocked re-redemption attempt (verifying error message and state rejection).
    6. LocalStorage persistence validation across browser reloads.
    7. "Reset Demo" button resetting state to initial seed state.
  - All tests passing with `npx playwright test`.
  - Forensic Auditor verification.

---

## Gating & Quality Criteria
- Every milestone requires Explorer assessment -> Worker implementation -> Reviewer pass -> Challenger verification -> Forensic Auditor veto check.
- Build must pass cleanly (`npm run build`).
- E2E tests must pass 100%.
