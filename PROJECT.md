# Project Specification: MVP "ЖЕРЛЕС"

## Architecture
- Framework: Next.js (App Router), TypeScript, Tailwind CSS, Recharts, Lucide React icons.
- Data Layer: Client-side LocalStorage state store initialized with `data/seedData.json`. Sync mechanism supports `storage` window events and custom `zherles_state_change` custom events so components re-render instantly on updates.
- Reset State: Global "Сбросить демо" (Reset Demo) button in the navigation header clears LocalStorage and re-hydrates `seedData.json`.
- Testing: Playwright E2E test suite running headlessly (`npx playwright test`).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Foundation & State Engine | Next.js App Router, Tailwind, TypeScript, seed JSON, LocalStorage state store, Reset Demo button | None | DONE |
| M2 | B2B Module | Business Onboarding, Catalog with recommendations, Admin Panel CRUD, B2B Dashboard with Recharts & CRM table | M1 | DONE |
| M3 | Campaign Builder | Step-by-step "Көрші-маршрут" wizard, partner matching, rewards setup, message preview, dynamic QR generator | M1, M2 | DONE |
| M4 | B2C Module & Redemption | Mobile "District Passport" view, WhatsApp/Telegram share links, 4-digit PIN redemption with anti-fraud double-redemption blocking | M1, M3 | DONE |
| M5 | E2E Testing & Hardening | Automated Playwright test suite for all user flows, reload persistence, double redemption blocking, reset demo, and forensic audit | M1, M2, M3, M4 | DONE |

## Interface Contracts & Data Schemas

### Data Models (`types/index.ts`)
- `Business`: `{ id, name, category, district, avgCheck, phone, contactName, description, logoUrl }`
- `Partner`: `{ id, businessId, name, category, district, matchScore, avgCheck, status }`
- `CampaignTemplate`: `{ id, title, category, description, recommendedFor, defaultReward, expectedReach, expectedRoi, tags }`
- `Campaign`: `{ id, title, sourceBusinessId, targetPartnerIds, rewardText, minSpend, durationDays, expireDate, qrCodeUrl, shareMessage, status, createdAt }`
- `ClientCRM`: `{ id, name, phone, acquiredFromPartner, campaignId, totalSpent, visitCount, status, lastVisit }`
- `BonusCoupon`: `{ id, campaignId, pinCode, rewardText, partnerName, customerPhone, status: 'ACTIVE' | 'REDEEMED', redeemedAt?: string, redeemedByStaff?: string }`

### Anti-Fraud & Double-Redemption Contract
- A `BonusCoupon` is identified by a 4-digit PIN code (or unique coupon code).
- When `redeemBonus(pinCode)` is called:
  - If coupon is not found: return `{ success: false, error: 'Код не найден' }`.
  - If coupon status is `'REDEEMED'`: return `{ success: false, error: 'Бонус уже был использован', redeemedAt: coupon.redeemedAt }`.
  - If status is `'ACTIVE'`: set status to `'REDEEMED'`, set `redeemedAt` to ISO timestamp, persist to LocalStorage, notify CRM state, return `{ success: true, coupon }`.

## Code Layout
```
/Users/ramil/teamwork_projects/zherles_mvp/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Landing & Navigation selector)
│   ├── b2b/
│   │   ├── onboarding/page.tsx
│   │   ├── catalog/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── campaigns/
│   │       ├── page.tsx
│   │       └── new/page.tsx
│   └── b2c/
│       ├── passport/page.tsx
│       └── redeem/page.tsx
├── components/
│   ├── Header.tsx
│   ├── ResetDemoButton.tsx
│   ├── QRGenerator.tsx
│   ├── RechartsWrapper.tsx
│   └── ShareButtons.tsx
├── context/
│   └── AppContext.tsx
├── data/
│   └── seedData.json
├── lib/
│   └── storage.ts
├── types/
│   └── index.ts
├── e2e/
│   └── zherles_mvp.spec.ts
└── playwright.config.ts
```
