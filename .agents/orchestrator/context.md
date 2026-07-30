# Context Summary — MVP "ЖЕРЛЕС"

## Project Overview
MVP "ЖЕРЛЕС" is a cross-marketing platform for local offline businesses in Kazakhstan (cafes, salons, bakeries, services). It empowers SMBs to launch joint promotional campaigns ("Көрші-маршрут"), cross-refer clients, issue mobile "District Passports" accessible via QR codes without requiring native app installation, enable WhatsApp/Telegram sharing, and enforce secure 4-digit PIN bonus redemption with anti-fraud double-redemption protection.

## Technical Architecture
- Framework: Next.js 14+ (App Router), React 18+, TypeScript.
- Styling: Tailwind CSS, Lucide React icons.
- Analytics & Charts: Recharts.
- Persistence: Seed JSON + LocalStorage Browser Engine with `storage` event synchronization and Reset Demo state restoration.
- Testing: Playwright E2E framework.
- Design Specs: B2C mobile-first responsive layout, B2B desktop dashboard.

## Key Requirements Checklist
1. B2B Onboarding (business type, district, average ticket).
2. B2B Tools catalog, recommendations, admin panel template CRUD, CRM customer table with test clients.
3. Campaign creation wizard ("Көрші-маршрут") with partner selection, terms/rewards configuration, client message preview, dynamic QR code generation.
4. B2C "District Passport" ("Паспорт района") mobile view (QR entry).
5. Referral sharing links for WhatsApp and Telegram.
6. Bonus redemption via 4-digit one-time code, blocking repeated redemption attempts.
7. LocalStorage state persistence across browser refresh.
8. "Reset Demo" button to reset state to default seed data.
9. Playwright E2E test suite covering all major user flows.
