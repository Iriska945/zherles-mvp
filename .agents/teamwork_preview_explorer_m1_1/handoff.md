# Milestone 1 Handoff Report: Project Foundation, Data Models & Seed State Engine

## 1. Observation

Direct observations from project requirements (`ORIGINAL_REQUEST.md` and `PROJECT.md`):

- **Tech Stack Requirements**: Next.js App Router, TypeScript, Tailwind CSS, Recharts, Lucide React icons, Playwright.
- **Dependencies List**:
  - `next`: `^14.2.5`
  - `react`: `^18.3.1`
  - `react-dom`: `^18.3.1`
  - `typescript`: `^5.5.4`
  - `@types/react`: `^18.3.3`
  - `@types/node`: `^20.14.12`
  - `tailwindcss`: `^3.4.7`
  - `postcss`: `^8.4.40`
  - `autoprefixer`: `^10.4.20`
  - `recharts`: `^2.12.7`
  - `lucide-react`: `^0.417.0`
  - `playwright`: `^1.45.3`
  - `@playwright/test`: `^1.45.3`
- **Data Models required** (`PROJECT.md` lines 20-27):
  - `Business`, `Partner`, `CampaignTemplate`, `Campaign`, `ClientCRM`, `BonusCoupon`.
- **State Store & Storage Contract** (`PROJECT.md` lines 5-6, 28-33):
  - Initialized with `data/seedData.json` into LocalStorage under key `'zherles_app_state_v1'`.
  - Must dispatch custom event `'zherles_state_change'` and listen to window `'storage'` events for immediate reactive updates.
  - Must implement `redeemBonus(pinCode)` with anti-fraud double-redemption protection.
  - Must provide a global `ResetDemoButton` to clear LocalStorage and re-hydrate `seedData.json`.

---

## 2. Logic Chain

1. **Scaffolding & Configuration**:
   - Next.js App Router layout with Tailwind CSS ensures fast compilation and responsive mobile/desktop UI.
   - `playwright.config.ts` configured for automatic webServer startup on port 3000 during test execution.

2. **Data Model Architecture (`types/index.ts`)**:
   - `Business`: Anchors the main B2B user (`id`, `name`, `category`, `district`, `avgCheck`, `phone`, `contactName`, `description`, `logoUrl`).
   - `Partner`: Potential/active cross-marketing partner venues in the same or adjacent district (`matchScore`, `avgCheck`, `status`).
   - `CampaignTemplate`: Pre-designed cross-promotional campaign templates (`title`, `recommendedFor`, `defaultReward`, `expectedReach`, `expectedRoi`).
   - `Campaign`: Active or draft joint marketing campaign created by business (`rewardText`, `minSpend`, `durationDays`, `expireDate`, `qrCodeUrl`, `shareMessage`, `status`).
   - `ClientCRM`: Attracted customer data for CRM dashboard (`acquiredFromPartner`, `visitCount`, `totalSpent`, `status`).
   - `BonusCoupon`: B2C voucher linked to 4-digit `pinCode` (`status`: `'ACTIVE' | 'REDEEMED'`, `redeemedAt`, `redeemedByStaff`).

3. **State Engine Architecture (`lib/storage.ts` & `context/AppContext.tsx`)**:
   - Standard browser `storage` events only fire across *different* browser windows/tabs.
   - To make single-page state updates reactively trigger re-renders in the *current* tab instantly, `lib/storage.ts` dispatches a `CustomEvent('zherles_state_change', { detail: newState })` whenever `saveState()` or `resetDemoState()` is invoked.
   - `AppContext.tsx` subscribes to both `'storage'` and `'zherles_state_change'` events on mount, providing seamless real-time reactivity across all React components.

4. **Anti-Fraud & Double-Redemption Contract**:
   - `redeemBonus(pinCode)` locates the coupon by `pinCode`.
   - If missing: returns `{ success: false, error: 'Код бонуса не найден' }`.
   - If coupon is already `'REDEEMED'`: returns `{ success: false, error: 'Бонус уже был использован', redeemedAt: coupon.redeemedAt }`.
   - If coupon is `'ACTIVE'`: changes status to `'REDEEMED'`, records `redeemedAt: new Date().toISOString()`, updates CRM client visit count/total spent if applicable, persists to LocalStorage, dispatches event, and returns `{ success: true, coupon }`.

---

## 3. Caveats

- **Client-Side Only**: MVP relies on browser `localStorage`. Browsers in incognito or private mode without localStorage permissions will fallback to in-memory state.
- **Synchronous Event Dispatch**: Custom events run synchronously on the window object. `lib/storage.ts` handles SSG/SSR checks safely (`typeof window !== 'undefined'`).
- **Headless E2E Execution**: Playwright tests require running dev server (`npm run dev`) or automatic webServer boot on port 3000.

---

## 4. Conclusion & Implementation Specification

Here are the complete, pasteable file specifications for implementation in Milestone 1:

### A. Configuration Files

#### `package.json`
```json
{
  "name": "zherles-mvp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "lucide-react": "^0.417.0",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "@playwright/test": "^1.45.3",
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
```

#### `postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

#### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

### B. Core Types (`types/index.ts`)

```typescript
export interface Business {
  id: string;
  name: string;
  category: string;
  district: string;
  avgCheck: number;
  phone: string;
  contactName: string;
  description: string;
  logoUrl: string;
}

export interface Partner {
  id: string;
  businessId: string;
  name: string;
  category: string;
  district: string;
  matchScore: number;
  avgCheck: number;
  status: 'ACTIVE' | 'PENDING' | 'SUGGESTED';
}

export interface CampaignTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  recommendedFor: string;
  defaultReward: string;
  expectedReach: string;
  expectedRoi: string;
  tags: string[];
}

export interface Campaign {
  id: string;
  title: string;
  sourceBusinessId: string;
  targetPartnerIds: string[];
  rewardText: string;
  minSpend: number;
  durationDays: number;
  expireDate: string;
  qrCodeUrl: string;
  shareMessage: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'EXPIRED';
  createdAt: string;
}

export interface ClientCRM {
  id: string;
  name: string;
  phone: string;
  acquiredFromPartner: string;
  campaignId: string;
  totalSpent: number;
  visitCount: number;
  status: 'NEW' | 'ACTIVE' | 'VIP' | 'CHURNED';
  lastVisit: string;
}

export interface BonusCoupon {
  id: string;
  campaignId: string;
  pinCode: string;
  rewardText: string;
  partnerName: string;
  customerPhone: string;
  status: 'ACTIVE' | 'REDEEMED';
  redeemedAt?: string;
  redeemedByStaff?: string;
}

export interface DistrictPassportDeal {
  id: string;
  title: string;
  businessName: string;
  category: string;
  reward: string;
  pinCode: string;
  qrCodeUrl: string;
  minSpend: number;
}

export interface AppState {
  business: Business;
  partners: Partner[];
  templates: CampaignTemplate[];
  campaigns: Campaign[];
  clients: ClientCRM[];
  coupons: BonusCoupon[];
  districtPassport: {
    districtName: string;
    featuredDeals: DistrictPassportDeal[];
  };
}
```

---

### C. Seed Data (`data/seedData.json`)

```json
{
  "business": {
    "id": "biz-001",
    "name": "Urban Coffee",
    "category": "Кофейня & Пекарня",
    "district": "Алмалинский",
    "avgCheck": 2500,
    "phone": "+7 (707) 111-2233",
    "contactName": "Арман Ибраев",
    "description": "Уютная спешелти кофейня в центре Алматы с авторскими десертами и свежей выпечкой.",
    "logoUrl": "☕"
  },
  "partners": [
    {
      "id": "part-001",
      "businessId": "biz-002",
      "name": "Барбершоп \"ManCave\"",
      "category": "Барбершоп & Мужской уход",
      "district": "Алмалинский",
      "matchScore": 94,
      "avgCheck": 6000,
      "status": "ACTIVE"
    },
    {
      "id": "part-002",
      "businessId": "biz-003",
      "name": "Фитнес-клуб \"FitLife\"",
      "category": "Спорт & Фитнес",
      "district": "Алмалинский",
      "matchScore": 88,
      "avgCheck": 18000,
      "status": "ACTIVE"
    },
    {
      "id": "part-003",
      "businessId": "biz-004",
      "name": "Цветочная студия \"Flora\"",
      "category": "Цветы & Подарки",
      "district": "Алмалинский",
      "matchScore": 82,
      "avgCheck": 8500,
      "status": "SUGGESTED"
    },
    {
      "id": "part-004",
      "businessId": "biz-005",
      "name": "Пекарня \"Croissant Co\"",
      "category": "Выпечка & Десерты",
      "district": "Медеуский",
      "matchScore": 79,
      "avgCheck": 3000,
      "status": "SUGGESTED"
    }
  ],
  "templates": [
    {
      "id": "tmpl-001",
      "title": "Утренний кофе + Скидка на стрижку",
      "category": "Кросс-промо",
      "description": "Клиент кофейни получает скидку 20% в барбершопе, а клиент барбершопа — бесплатный напиток.",
      "recommendedFor": "Кофейни, Барбершопы",
      "defaultReward": "Скидка 20% + Бесплатный кофе",
      "expectedReach": "500+ клиентов/мес",
      "expectedRoi": "+35% повторных визитов",
      "tags": ["Кофе", "Стрижка", "Район"]
    },
    {
      "id": "tmpl-002",
      "title": "ЗОЖ-маршрут: Фитнес + Полезный завтрак",
      "category": "Здоровье",
      "description": "После тренировки клиент получат 15% скидку на протеиновые боулы и смузи в вашей кофейне.",
      "recommendedFor": "Фитнес-клубы, ЗОЖ-кафе",
      "defaultReward": "Скидка 15% на боулы",
      "expectedReach": "350+ клиентов/мес",
      "expectedRoi": "+25% чека",
      "tags": ["ЗОЖ", "Фитнес", "Смузи"]
    },
    {
      "id": "tmpl-003",
      "title": "Романтический вечер: Букет + Десерт",
      "category": "Праздники",
      "description": "При покупке букета клиент получает купон на фирменный десерт при заказе кофе.",
      "recommendedFor": "Цветочные салоны, Пекарни",
      "defaultReward": "Фирменный десерт в подарок",
      "expectedReach": "200+ клиентов/мес",
      "expectedRoi": "+40% лояльности",
      "tags": ["Цветы", "Десерт", "Праздник"]
    }
  ],
  "campaigns": [
    {
      "id": "cmp-001",
      "title": "Көрші-Маршрут: Кофе & Стрижка",
      "sourceBusinessId": "biz-001",
      "targetPartnerIds": ["part-001"],
      "rewardText": "Скидка 20% на первую стрижку в ManCave при чеке от 2000 ₸ в Urban Coffee",
      "minSpend": 2000,
      "durationDays": 30,
      "expireDate": "2026-08-30",
      "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://zherles.kz/b2c/passport?pin=1234",
      "shareMessage": "Привет! Держи мой Паспорт Алмалинского района со скидкой 20% на стрижку в ManCave!",
      "status": "ACTIVE",
      "createdAt": "2026-07-28T10:00:00Z"
    },
    {
      "id": "cmp-002",
      "title": "Көрші-Маршрут: Фитнес & Завтрак",
      "sourceBusinessId": "biz-001",
      "targetPartnerIds": ["part-002"],
      "rewardText": "Бесплатный фреш к любому боулу при предъявлении клубной карты FitLife",
      "minSpend": 2500,
      "durationDays": 15,
      "expireDate": "2026-08-15",
      "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://zherles.kz/b2c/passport?pin=7890",
      "shareMessage": "Лови подарок от FitLife и Urban Coffee — бесплатный фреш!",
      "status": "ACTIVE",
      "createdAt": "2026-07-29T14:30:00Z"
    }
  ],
  "clients": [
    {
      "id": "crm-001",
      "name": "Айдар Касымов",
      "phone": "+7 (777) 333-4455",
      "acquiredFromPartner": "Барбершоп \"ManCave\"",
      "campaignId": "cmp-001",
      "totalSpent": 12500,
      "visitCount": 5,
      "status": "VIP",
      "lastVisit": "2026-07-29T16:20:00Z"
    },
    {
      "id": "crm-002",
      "name": "Динара Сатпаева",
      "phone": "+7 (701) 555-8822",
      "acquiredFromPartner": "Фитнес-клуб \"FitLife\"",
      "campaignId": "cmp-002",
      "totalSpent": 5000,
      "visitCount": 2,
      "status": "ACTIVE",
      "lastVisit": "2026-07-30T11:00:00Z"
    },
    {
      "id": "crm-003",
      "name": "Кайрат Нуртасов",
      "phone": "+7 (705) 888-1122",
      "acquiredFromPartner": "Барбершоп \"ManCave\"",
      "campaignId": "cmp-001",
      "totalSpent": 2500,
      "visitCount": 1,
      "status": "NEW",
      "lastVisit": "2026-07-30T13:45:00Z"
    }
  ],
  "coupons": [
    {
      "id": "coup-001",
      "campaignId": "cmp-001",
      "pinCode": "1234",
      "rewardText": "Скидка 20% на стрижку в ManCave",
      "partnerName": "Барбершоп \"ManCave\"",
      "customerPhone": "+7 (777) 333-4455",
      "status": "ACTIVE"
    },
    {
      "id": "coup-002",
      "campaignId": "cmp-001",
      "pinCode": "5678",
      "rewardText": "Бесплатный американо в Urban Coffee",
      "partnerName": "Urban Coffee",
      "customerPhone": "+7 (701) 999-0011",
      "status": "REDEEMED",
      "redeemedAt": "2026-07-29T18:10:00Z",
      "redeemedByStaff": "Кассир Алия"
    },
    {
      "id": "coup-003",
      "campaignId": "cmp-002",
      "pinCode": "7890",
      "rewardText": "Бесплатный фреш к боулу",
      "partnerName": "Urban Coffee",
      "customerPhone": "+7 (701) 555-8822",
      "status": "ACTIVE"
    }
  ],
  "districtPassport": {
    "districtName": "Алмалинский район",
    "featuredDeals": [
      {
        "id": "deal-001",
        "title": "Скидка 20% на первую стрижку",
        "businessName": "Барбершоп \"ManCave\"",
        "category": "Красота",
        "reward": "Скидка 20% по промокоду 1234",
        "pinCode": "1234",
        "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=1234",
        "minSpend": 2000
      },
      {
        "id": "deal-002",
        "title": "Бесплатный фреш к боулу",
        "businessName": "Urban Coffee",
        "category": "Кофейня",
        "reward": "Фреш в подарок по промокоду 7890",
        "pinCode": "7890",
        "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=7890",
        "minSpend": 2500
      }
    ]
  }
}
```

---

### D. LocalStorage Engine (`lib/storage.ts`)

```typescript
import { AppState, BonusCoupon, Campaign, CampaignTemplate, Business } from '@/types';
import seedData from '@/data/seedData.json';

const STORAGE_KEY = 'zherles_app_state_v1';
export const STATE_CHANGE_EVENT = 'zherles_state_change';

export function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return seedData as AppState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData as AppState;
    }
    return JSON.parse(raw) as AppState;
  } catch (error) {
    console.error('Failed to parse state from localStorage, resetting to seed:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData as AppState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT, { detail: state }));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function resetDemoState(): AppState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT, { detail: seedData }));
    } catch (error) {
      console.error('Failed to reset demo state:', error);
    }
  }
  return seedData as AppState;
}

export function redeemBonus(pinCode: string): {
  success: boolean;
  coupon?: BonusCoupon;
  error?: string;
  redeemedAt?: string;
} {
  const state = getInitialState();
  const couponIndex = state.coupons.findIndex((c) => c.pinCode === pinCode);

  if (couponIndex === -1) {
    return { success: false, error: 'Код бонуса не найден' };
  }

  const coupon = state.coupons[couponIndex];

  if (coupon.status === 'REDEEMED') {
    return {
      success: false,
      error: 'Бонус уже был использован',
      redeemedAt: coupon.redeemedAt,
    };
  }

  const redeemedAt = new Date().toISOString();
  const updatedCoupon: BonusCoupon = {
    ...coupon,
    status: 'REDEEMED',
    redeemedAt,
    redeemedByStaff: 'Кассир (Автоматически)',
  };

  const updatedCoupons = [...state.coupons];
  updatedCoupons[couponIndex] = updatedCoupon;

  const newState: AppState = {
    ...state,
    coupons: updatedCoupons,
  };

  saveState(newState);

  return {
    success: true,
    coupon: updatedCoupon,
    redeemedAt,
  };
}

export function addCampaign(campaign: Campaign): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    campaigns: [campaign, ...currentState.campaigns],
    coupons: [
      {
        id: `coup-${Date.now()}`,
        campaignId: campaign.id,
        pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
        rewardText: campaign.rewardText,
        partnerName: currentState.business.name,
        customerPhone: '+7 (777) 000-0000',
        status: 'ACTIVE',
      },
      ...currentState.coupons,
    ],
  };
  saveState(updatedState);
  return updatedState;
}

export function updateBusinessProfile(business: Business): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    business,
  };
  saveState(updatedState);
  return updatedState;
}

export function addTemplate(template: CampaignTemplate): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    templates: [template, ...currentState.templates],
  };
  saveState(updatedState);
  return updatedState;
}

export function deleteTemplate(id: string): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    templates: currentState.templates.filter((t) => t.id !== id),
  };
  saveState(updatedState);
  return updatedState;
}
```

---

### E. Context Provider (`context/AppContext.tsx`)

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, BonusCoupon, Business, Campaign, CampaignTemplate } from '@/types';
import {
  addCampaign as addCampaignStorage,
  addTemplate as addTemplateStorage,
  deleteTemplate as deleteTemplateStorage,
  getInitialState,
  redeemBonus as redeemBonusStorage,
  resetDemoState as resetDemoStorage,
  saveState as saveStateStorage,
  STATE_CHANGE_EVENT,
  updateBusinessProfile as updateBusinessStorage,
} from '@/lib/storage';

interface AppContextType {
  state: AppState;
  resetDemo: () => void;
  redeemBonus: (pinCode: string) => {
    success: boolean;
    coupon?: BonusCoupon;
    error?: string;
    redeemedAt?: string;
  };
  addCampaign: (campaign: Campaign) => void;
  updateBusiness: (business: Business) => void;
  addTemplate: (template: CampaignTemplate) => void;
  deleteTemplate: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    // Sync state on load
    setState(getInitialState());

    // Listen to custom intra-tab events
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AppState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(getInitialState());
      }
    };

    // Listen to window storage events (cross-tab sync)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'zherles_app_state_v1') {
        setState(getInitialState());
      }
    };

    window.addEventListener(STATE_CHANGE_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(STATE_CHANGE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const resetDemo = () => {
    const freshState = resetDemoStorage();
    setState(freshState);
  };

  const redeemBonus = (pinCode: string) => {
    return redeemBonusStorage(pinCode);
  };

  const addCampaign = (campaign: Campaign) => {
    const updated = addCampaignStorage(campaign);
    setState(updated);
  };

  const updateBusiness = (business: Business) => {
    const updated = updateBusinessStorage(business);
    setState(updated);
  };

  const addTemplate = (template: CampaignTemplate) => {
    const updated = addTemplateStorage(template);
    setState(updated);
  };

  const deleteTemplate = (id: string) => {
    const updated = deleteTemplateStorage(id);
    setState(updated);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        resetDemo,
        redeemBonus,
        addCampaign,
        updateBusiness,
        addTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
```

---

### F. Reset Demo Button Component (`components/ResetDemoButton.tsx`)

```typescript
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RotateCcw, Check } from 'lucide-react';

export default function ResetDemoButton() {
  const { resetDemo } = useApp();
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    resetDemo();
    setTimeout(() => {
      setResetting(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleReset}
      disabled={resetting}
      data-testid="reset-demo-button"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-sm active:scale-95 disabled:opacity-50"
      title="Сбросить все данные демо-версии к исходным"
    >
      {resetting ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600 animate-pulse" />
          <span className="text-green-700">Данные сброшены!</span>
        </>
      ) : (
        <>
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить демо</span>
        </>
      )}
    </button>
  );
}
```

---

### G. Navigation Header Component (`components/Header.tsx`)

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import ResetDemoButton from './ResetDemoButton';
import { useApp } from '@/context/AppContext';
import { MapPin, Store, Smartphone } from 'lucide-react';

export default function Header() {
  const { state } = useApp();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-emerald-600 text-white font-extrabold text-lg px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
              ЖЕРЛЕС
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              MVP
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{state.business.district} район, Алматы</span>
          </div>
        </div>

        <nav className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/b2b/dashboard"
            className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-600 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Бизнес B2B</span>
          </Link>

          <Link
            href="/b2c/passport"
            className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-600 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Клиент B2C</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <ResetDemoButton />
        </nav>
      </div>
    </header>
  );
}
```

---

### H. App Router Layout & Home Page (`app/layout.tsx` & `app/page.tsx`)

#### `app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'ЖЕРЛЕС — Кросс-маркетинг локального бизнеса',
  description: 'Платформа совместных акций и обмена клиентами для локальных заведений Алматы',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased flex flex-col">
        <AppProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
            ЖЕРЛЕС MVP © 2026. Платформа локального кросс-маркетинга.
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
```

#### `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
```

#### `app/page.tsx`
```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Store, Smartphone, Users, Zap, Award, Tag, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { state } = useApp();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Локальный партнерский маркетинг</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Объединяйте заведения, привлекайте соседей — без лишних трат
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Платформа «ЖЕРЛЕС» помогает бизнесам {state.business.district} района объединяться в кросс-маркетинговые маршруты «Көрші». Обменивайтесь клиентами через QR-коды и WhatsApp без установки мобильных приложений.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/b2b/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 font-bold rounded-xl shadow hover:bg-emerald-50 transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Кабинет бизнеса</span>
            </Link>
            <Link
              href="/b2c/passport"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow hover:bg-emerald-400 border border-emerald-400 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Паспорт района (B2C)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Ваш бизнес</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 truncate">{state.business.name}</p>
          <p className="text-xs text-slate-500">{state.business.district} район</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Активных партнеров</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {state.partners.filter((p) => p.status === 'ACTIVE').length}
          </p>
          <p className="text-xs text-slate-500">из {state.partners.length} доступных</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Запущенных акций</span>
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{state.campaigns.length}</p>
          <p className="text-xs text-slate-500">Көрші-маршрутов</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Привлечено клиентов</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{state.clients.length}</p>
          <p className="text-xs text-slate-500">в CRM таблице</p>
        </div>
      </section>

      {/* Module Navigation Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* B2B Module Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Store className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              B2B Кабинет
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Модуль для Бизнеса</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Онбординг заведения, каталог готовых механик, конструктор акций "Көрші-маршрут", партнерский скоринг и аналитический дашборд с CRM.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            <Link href="/b2b/onboarding" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>1. Онбординг</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2b/catalog" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>2. Каталог акций</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2b/campaigns/new" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>3. Конструктор</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2b/dashboard" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>4. Дашборд & CRM</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* B2C Module Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
              B2C Клиент
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Модуль для Гостей</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Мобильный веб-интерфейс "Паспорт района", шеринг акций друзьям в мессенджерах и безопасная гашение бонусов по 4-значному PIN-коду.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            <Link href="/b2c/passport" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>Паспорт района</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/b2c/redeem" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between">
              <span>Погашение бонуса</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 5. Verification Method

To verify the implementation of Milestone 1 independently:

1. **Scaffold & Dependencies**:
   ```bash
   cd /Users/ramil/teamwork_projects/zherles_mvp
   npm install
   ```
   Verify `node_modules` is populated without dependency conflicts.

2. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in browser. Confirm layout renders navigation bar with "ЖЕРЛЕС", "Алмалинский район, Алматы", and "Сбросить демо" button.

3. **Verify LocalStorage State Hydration**:
   In browser Developer Tools Console:
   ```javascript
   const state = JSON.parse(localStorage.getItem('zherles_app_state_v1'));
   console.log(state.business.name); // Should print "Urban Coffee"
   console.log(state.coupons.length); // Should be >= 3
   ```

4. **Verify Anti-Fraud Double-Redemption**:
   In Developer Tools Console:
   ```javascript
   import('@/lib/storage').then(storage => {
     console.log(storage.redeemBonus('1234')); // First try -> { success: true, coupon: {...} }
     console.log(storage.redeemBonus('1234')); // Second try -> { success: false, error: 'Бонус уже был использован' }
   });
   ```

5. **Verify Reset Demo Button**:
   Click "Сбросить демо" button in the header. Confirm state reverts back to original `seedData.json` state.

6. **Run Playwright E2E Test Suite**:
   ```bash
   npx playwright test
   ```
   Confirm headless Chrome and Mobile Chrome tests pass.
