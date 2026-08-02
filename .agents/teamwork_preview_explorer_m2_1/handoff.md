# Handoff Report: Milestone 2 — B2C Personal Cabinet with Real Database & Auth System (Requirement R2)

## 1. Observation

### 1.1 Existing Codebase & State Structure Analysis

A comprehensive inspection of the ЖЕРЛЕС MVP codebase (`/Users/ramil/teamwork_projects/zherles_mvp`) revealed the following current implementation details across key files:

- **`lib/storage.ts`** (Lines 1–200):
  - Current storage mechanism is client-side only, relying on `localStorage.getItem('zherles_app_state_v1')`.
  - Fallback logic hydrates state from static seed data (`data/seedData.json`) on line 15 & line 21.
  - Event dispatching uses `window.dispatchEvent(new CustomEvent('zherles_state_change'))` for intra-tab sync (line 31) and standard `storage` events for cross-tab sync.
  - Bonus redemption logic (`redeemBonus`, lines 50–115) updates `userProfile.globalPoints` (+500 points per redemption) and `userProfile.visitsCount` (+1 visit). Tier upgrade rules are hardcoded on lines 90–99:
    - `visitsCount >= 10`: Tier `'Gold'`, discount `15%`
    - `visitsCount >= 5`: Tier `'Silver'`, discount `10%`
    - Otherwise: Tier `'Bronze'`, discount `5%`
  - *Deficiency*: Storage is purely browser-local (`localStorage`). There is no server API, database file persistence, multi-user accounts, registration, login, session tokens, or user isolation.

- **`context/AppContext.tsx`** (Lines 1–135):
  - Provides React context wrapper around `AppState`.
  - Listens to `zherles_state_change` custom window events and `storage` browser events.
  - Exposes state mutation functions (`resetDemo`, `redeemBonus`, `addCampaign`, `updateBusiness`, `addTemplate`, `deleteTemplate`, `updateTemplate`, `updateGreenApiSettings`).
  - *Deficiency*: Lacks user authentication state (`user`, `token`, `isAuthenticated`, `isLoading`), auth dispatchers (`login`, `register`, `logout`), and API synchronization hooks.

- **`app/b2c/passport/page.tsx`** (Lines 1–451):
  - Mobile web interface for "Паспорт района" (District Passport).
  - Displays a static user profile status banner (lines 181–222) if `state.userProfile` exists, showing global tier (`Bronze`/`Silver`/`Gold`), discount rate, progress bar, and holiday bonuses.
  - Lists district deals (`DistrictPassportDeal`) combined with active campaigns (`Campaign`).
  - Includes QR modal popup (`QRGenerator`) and messenger share buttons (`ShareButtons`).
  - *Deficiency*: Does not distinguish between logged-in B2C users and unauthenticated guests. Does not provide a dedicated B2C Personal Cabinet page (`/b2c/cabinet`), auth modals, real-time user bonus balance updates, or personalized transaction logs.

- **`types/index.ts`** (Lines 1–136):
  - Contains domain models: `Business`, `Partner`, `CampaignTemplate`, `Campaign`, `ClientCRM`, `BonusCoupon`, `DistrictPassportDeal`, `GlobalUserProfile`, `GreenApiSettings`, `AppState`.
  - *Deficiency*: Lacks user authentication & database models (`User`, `UserTier`, `AuthSession`, `UserBonusTransaction`, `UserCabinetData`, `AuthResponse`, `RegisterPayload`, `LoginPayload`).

- **`app/api/`**:
  - Currently contains only `/api/whatsapp/send/route.ts` and `/api/whatsapp/mock-green-api/route.ts`.
  - *Deficiency*: Lacks authentication endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`) and user data endpoints (`/api/user/cabinet`, `/api/user/bonuses`).

- **`package.json` & Environment**:
  - Next.js `14.2.5` (App Router), React `18.3.1`, Tailwind CSS `3.4.7`, TypeScript `5.5.4`, Playwright `1.45.3`.
  - Node environment supports file-backed JSON/SQLite database storage via standard Node.js `fs` / `fs/promises` or lightweight database engines without adding external heavy cloud service dependencies.

---

## 2. Logic Chain

From these observations, we formulate the step-by-step logic chain to satisfy Requirement R2 (B2C Personal Cabinet with Real Database & Auth System):

1. **Storage Transition (Client `localStorage` -> Server File Database)**:
   - To achieve real multi-user database persistence without external SaaS overhead, a server-side file database engine (`lib/db.ts`) must be established.
   - Using a structured JSON document database at `data/db.json` with atomic file replacement (`fs.writeFileSync` to `.tmp` file + `fs.renameSync`) guarantees ACID-like atomic read and write operations, preventing data corruption during concurrent requests.

2. **Auth & User Domain Model Design**:
   - Individual users must have dedicated accounts containing their phone number, email (optional), hashed credentials, current tier level, bonus balance counter, global discount percentage, visit history, active coupons, and transaction ledger.
   - Tier progression must be formalized into Kazakh B2C branding tiers:
     - **Level 1**: "Сосед-Новичок" (0 – 499 баллов, Скидка 5%)
     - **Level 2**: "Активный Көрші" (500 – 1 499 баллов, Скидка 10%)
     - **Level 3**: "Почетный Көрші" (1 500 – 2 999 баллов, Скидка 15%)
     - **Level 4**: "Легенда Района" (3 000+ баллов, Скидка 20%)

3. **Authentication Lifecycle & Session Persistence**:
   - Registration creates a new `User` record in `data/db.json` with a welcome bonus (e.g., 200 баллов).
   - Login authenticates credentials via phone number or email and issues a secure HTTP-Only session cookie (`zherles_session_token`) stored in `AuthSession` collection.
   - `AuthContext` provides global React authentication state, auto-hydrating current user info via `GET /api/auth/me` on mount.

4. **Real-Time Database Read/Write Flow for B2C Cabinet UI**:
   - When a user redeems a bonus coupon at `/b2c/redeem` or claims a new deal:
     1. Client dispatches request to `POST /api/b2c/redeem` or `POST /api/user/bonuses`.
     2. Server handler (`lib/db.ts`) atomically verifies the anti-fraud status, updates coupon status, adds bonus points (e.g. +500 баллов) to the user's database record, recalculates tier and discount rate, and records a `UserBonusTransaction`.
     3. Server returns the updated `UserCabinetData` in the response payload.
     4. `AuthContext` / `CabinetUI` updates state instantly, triggering a re-render of the bonus balance counter and tier badge without full page refresh.

5. **E2E Playwright Test Strategy**:
   - An automated test specification `e2e/m2_b2c_cabinet_auth.spec.ts` must verify registration, login, cookie persistence across reloads, bonus accumulation, tier upgrade, and active coupon display.

---

## 3. Caveats

- **Network Restrictions**: The project operates in `CODE_ONLY` mode. External auth services (Auth0, Firebase Auth, Supabase Auth) or external database servers are avoided. The file-backed JSON database service (`lib/db.ts`) with `data/db.json` is completely self-contained.
- **Backwards Compatibility**: Existing B2B functionality and static seed state must remain accessible. Unauthenticated users visiting `/b2c/passport` will see a prompt to log in or register, but can still browse district deals as a guest.
- **Session Security for MVP**: Simple secure session tokens stored in HTTP-Only cookies and verified server-side against `data/db.json` are sufficient for MVP. Production deployment (M8) can migrate `lib/db.ts` calls to Prisma ORM / PostgreSQL seamlessly.

---

## 4. Conclusion & Detailed Technical Architecture

### 4.1 Data Models Specification (`types/index.ts`)

Add the following interfaces to `types/index.ts`:

```typescript
// --- B2C Auth & Real DB Models ---

export type UserTier = 'Сосед-Новичок' | 'Активный Көрші' | 'Почетный Көрші' | 'Легенда Района';

export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  passwordHash: string;
  tier: UserTier;
  bonusBalance: number;
  discountRate: number; // e.g., 5, 10, 15, 20
  visitsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface UserBonusTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'REDEEMED' | 'WELCOME' | 'HOLIDAY' | 'PROMO';
  amount: number; // e.g. +500 or -200
  description: string;
  createdAt: string;
  relatedCouponId?: string;
}

export interface TierInfo {
  currentTier: UserTier;
  nextTier?: UserTier;
  pointsToNextTier: number;
  progressPercentage: number; // 0 - 100
  discountRate: number; // percentage
}

export interface UserCabinetData {
  user: Omit<User, 'passwordHash'>;
  tierInfo: TierInfo;
  bonusBalance: number;
  activeCoupons: BonusCoupon[];
  recentTransactions: UserBonusTransaction[];
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'passwordHash'>;
  token?: string;
  error?: string;
}

export interface DatabaseSchema {
  users: User[];
  sessions: AuthSession[];
  bonusTransactions: UserBonusTransaction[];
  coupons: BonusCoupon[];
  campaigns: Campaign[];
  partners: Partner[];
  businesses: Business[];
  templates: CampaignTemplate[];
  clients: ClientCRM[];
}
```

---

### 4.2 Database Persistence Layer (`lib/db.ts`)

Create `lib/db.ts` implementing thread-safe atomic file-backed JSON database operations:

```typescript
import fs from 'fs';
import path from 'path';
import { DatabaseSchema, User, AuthSession, UserBonusTransaction, BonusCoupon, UserTier, TierInfo } from '@/types';
import seedData from '@/data/seedData.json';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

// Tier progression rules definition
export function calculateTierInfo(points: number, visitsCount: number): TierInfo {
  if (points >= 3000) {
    return {
      currentTier: 'Легенда Района',
      nextTier: undefined,
      pointsToNextTier: 0,
      progressPercentage: 100,
      discountRate: 20,
    };
  } else if (points >= 1500) {
    return {
      currentTier: 'Почетный Көрші',
      nextTier: 'Легенда Района',
      pointsToNextTier: 3000 - points,
      progressPercentage: Math.min(100, Math.round(((points - 1500) / 1500) * 100)),
      discountRate: 15,
    };
  } else if (points >= 500) {
    return {
      currentTier: 'Активный Көрші',
      nextTier: 'Почетный Көрші',
      pointsToNextTier: 1500 - points,
      progressPercentage: Math.min(100, Math.round(((points - 500) / 1000) * 100)),
      discountRate: 10,
    };
  } else {
    return {
      currentTier: 'Сосед-Новичок',
      nextTier: 'Активный Көрші',
      pointsToNextTier: 500 - points,
      progressPercentage: Math.min(100, Math.round((points / 500) * 100)),
      discountRate: 5,
    };
  }
}

// Atomic File Read & Write
export function getDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialDb: DatabaseSchema = {
      users: [],
      sessions: [],
      bonusTransactions: [],
      coupons: seedData.coupons as BonusCoupon[],
      campaigns: seedData.campaigns as any[],
      partners: seedData.partners as any[],
      businesses: [seedData.business as any],
      templates: seedData.templates as any[],
      clients: seedData.clients as any[],
    };
    saveDb(initialDb);
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Failed to read db.json, reinitializing:', error);
    const fallbackDb: DatabaseSchema = {
      users: [],
      sessions: [],
      bonusTransactions: [],
      coupons: seedData.coupons as BonusCoupon[],
      campaigns: seedData.campaigns as any[],
      partners: seedData.partners as any[],
      businesses: [seedData.business as any],
      templates: seedData.templates as any[],
      clients: seedData.clients as any[],
    };
    saveDb(fallbackDb);
    return fallbackDb;
  }
}

export function saveDb(data: DatabaseSchema): void {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tmpPath = `${DB_FILE_PATH}.tmp-${Date.now()}`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, DB_FILE_PATH);
}
```

---

### 4.3 API Routes Specification

1. **`POST /api/auth/register`** (`app/api/auth/register/route.ts`):
   - Accepts `{ phone, name, email, password }`.
   - Checks if user with phone/email already exists in `getDb().users`.
   - Hashes password (or simple secure digest for MVP).
   - Initializes user with 200 welcome bonus points, tier `"Сосед-Новичок"`, and discount `5%`.
   - Creates transaction record `+200 welcome bonus`.
   - Generates session token, writes to `getDb().sessions`, sets HTTP-Only cookie `zherles_session_token`.
   - Returns `{ success: true, user, token }`.

2. **`POST /api/auth/login`** (`app/api/auth/login/route.ts`):
   - Accepts `{ identifier, password }` (identifier = phone or email).
   - Validates against `getDb().users`.
   - Generates session token, sets HTTP-Only cookie `zherles_session_token`.
   - Returns `{ success: true, user, token }`.

3. **`POST /api/auth/logout`** (`app/api/auth/logout/route.ts`):
   - Reads session cookie, deletes matching record from `getDb().sessions`.
   - Clears cookie and returns `{ success: true }`.

4. **`GET /api/auth/me`** (`app/api/auth/me/route.ts`):
   - Reads `zherles_session_token` cookie.
   - Finds matching non-expired session and user in `getDb()`.
   - Returns `{ success: true, user, tierInfo: calculateTierInfo(user.bonusBalance, user.visitsCount) }`.

5. **`GET /api/user/cabinet`** (`app/api/user/cabinet/route.ts`):
   - Authenticated endpoint.
   - Returns `UserCabinetData`: user profile, tier info, current bonus balance, active coupons, and recent transaction history.

6. **`POST /api/user/bonuses`** (`app/api/user/bonuses/route.ts`):
   - Accepts `{ action: 'CLAIM_PROMO' | 'ADD_POINTS', amount?: number, promoCode?: string }`.
   - Atomically updates user's `bonusBalance`, calculates updated tier level, records `UserBonusTransaction`, and saves to `data/db.json`.

7. **`POST /api/b2c/redeem`** (`app/api/b2c/redeem/route.ts`):
   - Accepts `{ pinCode }`.
   - Verifies coupon in `getDb().coupons`.
   - If coupon is already `REDEEMED`, returns anti-fraud error `{ success: false, error: 'Бонус уже был использован', redeemedAt }`.
   - If coupon is `ACTIVE`, marks `REDEEMED`, sets `redeemedAt`.
   - If user is logged in via session cookie, atomically adds +500 bonus points to user's balance, logs transaction, and updates tier.

---

### 4.4 React Context (`context/AuthContext.tsx`)

Create `context/AuthContext.tsx` providing authentication state across all B2C pages:

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserCabinetData, User } from '@/types';

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  cabinetData: UserCabinetData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { phone: string; name: string; email?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCabinet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [cabinetData, setCabinetData] = useState<UserCabinetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCabinet = async () => {
    try {
      const res = await fetch('/api/user/cabinet');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.cabinetData.user);
          setCabinetData(data.cabinetData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cabinet data:', err);
    }
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            await refreshCabinet();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      await refreshCabinet();
      return { success: true };
    }
    return { success: false, error: data.error || 'Ошибка входа' };
  };

  const register = async (payload: { phone: string; name: string; email?: string; password: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      await refreshCabinet();
      return { success: true };
    }
    return { success: false, error: data.error || 'Ошибка регистрации' };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCabinetData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        cabinetData,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshCabinet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

### 4.5 B2C Personal Cabinet UI Components (`/b2c/cabinet/page.tsx`)

The `/b2c/cabinet/page.tsx` component features:
1. **Unauthenticated View**: Displays login/registration modal forms with tabs ("Вход по телефону" / "Регистрация").
2. **Authenticated Cabinet View**:
   - **Header**: User Name, Phone, and Level Badge.
   - **Level Progress Card (`TierCard`)**: Visual progress bar to next tier level ("Сосед-Новичок" -> "Активный Көрші" -> "Почетный Көрші" -> "Легенда Района") and discount rate (% badge).
   - **Real-Time Bonus Counter (`BonusCounter`)**: Large highlighted counter of accumulated points (`1 250 ₸`), updated in real-time upon redemption.
   - **Active Coupons List**: Filterable cards showing PIN codes, QR launcher modal, and redemption links.
   - **Transaction Ledger (`TransactionHistory`)**: Log of earned/spent points with timestamps and descriptions.
   - **Logout Button**: Clears auth session.

---

## 5. Verification Method & E2E Test Plan

### 5.1 Verification Commands

To independently verify the implementation after code construction:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Production build check
npm run build

# 4. Run Milestone 2 E2E Playwright test suite
npx playwright test e2e/m2_b2c_cabinet_auth.spec.ts

# 5. Run full E2E test suite
npx playwright test
```

### 5.2 E2E Playwright Test Specification (`e2e/m2_b2c_cabinet_auth.spec.ts`)

Create `e2e/m2_b2c_cabinet_auth.spec.ts` to execute automated validation of Requirement R2:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Milestone 2: B2C Personal Cabinet & Real DB Auth E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/b2c/cabinet');
  });

  test('M2-Test 1: Unauthenticated User Auth Prompt', async ({ page }) => {
    // Verify prompt for unauthenticated user
    await expect(page.getByText(/Личный кабинет Көрші/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Вход /i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Регистрация/i })).toBeVisible();
  });

  test('M2-Test 2: New User Registration & Welcome Bonus', async ({ page }) => {
    // 1. Switch to Registration tab
    await page.getByRole('button', { name: /Регистрация/i }).click();

    // 2. Fill registration form
    const uniquePhone = `+7 (701) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(uniquePhone);
    await page.locator('input[name="name"]').fill('Арман Батыр');
    await page.locator('input[name="password"]').fill('Pass12345');

    // 3. Submit registration
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    // 4. Verify logged-in view
    await expect(page.getByText('Арман Батыр')).toBeVisible();
    await expect(page.getByText('Сосед-Новичок')).toBeVisible();
    await expect(page.getByText(/200/)).toBeVisible(); // Welcome bonus 200 points
    await expect(page.getByText('5%')).toBeVisible(); // 5% initial discount
  });

  test('M2-Test 3: Session Persistence Across Reload', async ({ page }) => {
    // Register or Login user
    await page.getByRole('button', { name: /Регистрация/i }).click();
    const phone = `+7 (702) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill('Динара К.');
    await page.locator('input[name="password"]').fill('Pass12345');
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    await expect(page.getByText('Динара К.')).toBeVisible();

    // Reload page
    await page.reload();

    // Verify session remains active
    await expect(page.getByText('Динара К.')).toBeVisible();
    await expect(page.getByText('Сосед-Новичок')).toBeVisible();
  });

  test('M2-Test 4: Real-Time Bonus Accumulation & Tier Upgrade', async ({ page }) => {
    // 1. Register test user
    await page.getByRole('button', { name: /Регистрация/i }).click();
    const phone = `+7 (703) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill('Ерлан Т.');
    await page.locator('input[name="password"]').fill('Pass12345');
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    // 2. Navigate to /b2c/redeem and redeem PIN '1234'
    await page.goto('/b2c/redeem');
    const inputs = page.locator('main form input[type="text"]');
    await inputs.nth(0).fill('1');
    await inputs.nth(1).fill('2');
    await inputs.nth(2).fill('3');
    await inputs.nth(3).fill('4');
    await page.getByRole('button', { name: /Погасить бонус/i }).click();
    await expect(page.getByText('Бонус успешно погашен!')).toBeVisible();

    // 3. Return to cabinet and verify bonus balance increased (+500 -> 700 points) and Tier upgraded to 'Активный Көрші'
    await page.goto('/b2c/cabinet');
    await expect(page.getByText('700')).toBeVisible();
    await expect(page.getByText('Активный Көрші')).toBeVisible();
    await expect(page.getByText('10%')).toBeVisible();
  });

  test('M2-Test 5: User Logout', async ({ page }) => {
    // Register
    await page.getByRole('button', { name: /Регистрация/i }).click();
    const phone = `+7 (704) ${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill('Айгерим С.');
    await page.locator('input[name="password"]').fill('Pass12345');
    await page.getByRole('button', { name: /Создать аккаунт/i }).click();

    await expect(page.getByText('Айгерим С.')).toBeVisible();

    // Click logout
    await page.getByRole('button', { name: /Выйти/i }).click();

    // Verify returning to login prompt
    await expect(page.getByText(/Личный кабинет Көрші/i)).toBeVisible();
  });
});
```
