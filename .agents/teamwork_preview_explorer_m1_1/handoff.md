# Handoff Report: Milestone 1 (WhatsApp Green API Integration) Exploration & Design

## 1. Observation

Direct observations from inspecting `/Users/ramil/teamwork_projects/zherles_mvp`:

1. **Missing Files & Directories**:
   - `app/api/` directory does NOT exist yet.
   - `/api/whatsapp/send/route.ts` is missing.
   - `.env.local` file does NOT exist in root project directory `/Users/ramil/teamwork_projects/zherles_mvp/`.

2. **Existing B2C Sharing Component (`components/ShareButtons.tsx`)**:
   - Currently lines 72–80 in `components/ShareButtons.tsx` construct a standard `<a>` tag pointing to `https://wa.me/?text=...`:
     ```tsx
     <a
       href={whatsappUrl}
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
       title="Поделиться в WhatsApp"
     >
       <span className="font-bold">WhatsApp</span>
     </a>
     ```
   - Does NOT currently trigger a backend Green API HTTP request or provide state feedback ("Сообщение отправлено ✓" / "Ошибка — попробуйте ещё раз").

3. **B2C Passport Integration (`app/b2c/passport/page.tsx`)**:
   - Lines 295–300 and 376–381 render `<ShareButtons>` for deals and in the QR modal overlay:
     ```tsx
     <ShareButtons
       title={`Бонус от ${deal.businessName}`}
       text={deal.shareMessage || `Скидка и бонус от ${deal.businessName}: ${deal.reward}`}
       pinCode={deal.pinCode}
       url={`https://zherles.kz/b2c/passport?pin=${deal.pinCode}`}
     />
     ```

4. **Playwright Suite (`e2e/zherles_mvp.spec.ts` & `playwright.config.ts`)**:
   - Currently contains 6 E2E tests covering Campaign creation, B2C Passport, Bonus redemption, Anti-fraud blocking, State persistence, and Reset Demo button.
   - `playwright.config.ts` runs on `http://localhost:3000` with 1 worker. Needs an additional E2E test specifically verifying `/api/whatsapp/send` endpoint and UI share feedback using route mocking.

5. **Green API Technical Contract (`/Users/ramil/teamwork_projects/zherles_mvp/.agents/orchestrator/ORIGINAL_REQUEST.md`)**:
   - Base URL: `GREENAPI_URL` (default: `https://7107.api.greenapi.com`)
   - Instance ID: `GREENAPI_ID` (default: `710722698257`)
   - Token: `GREENAPI_TOKEN`
   - Target HTTP POST: `{apiUrl}/waInstance{idInstance}/sendMessage/{apiTokenInstance}`
   - Target Payload: `{ "chatId": "77XXXXXXXXX@c.us", "message": "текст" }`

---

## 2. Logic Chain

1. **Architecture & Environment**:
   - Next.js App Router uses file-based routing inside `app/`. Creating `app/api/whatsapp/send/route.ts` creates a server-side API endpoint POST `/api/whatsapp/send`.
   - Credentials must not be hardcoded in client or server code. By placing `GREENAPI_URL`, `GREENAPI_ID`, and `GREENAPI_TOKEN` in `.env.local`, Next.js loads them into `process.env`.

2. **Phone Number Sanitization & Formatting**:
   - Phone numbers entered by Kazakh users come in various formats (e.g., `+7 (701) 123-45-67`, `87011234567`, `77011234567`, or `7011234567`).
   - Standardizing phone numbers by stripping all non-digits (`replace(/\D/g, '')`), converting leading `8` to `7` if 11 digits, and prepending `7` if 10 digits ensures valid 11-digit numbers (`77XXXXXXXXX`).
   - Appending `@c.us` satisfies Green API's `chatId` format specification.

3. **User Experience & Feedback Loop**:
   - When a user clicks the WhatsApp button in `ShareButtons.tsx`, opening an inline modal/popover allows inputting/confirming the recipient phone number.
   - Submitting the form fires a `fetch('/api/whatsapp/send', { method: 'POST', body: JSON.stringify({ phone, message }) })`.
   - Providing visual states (`loading`, `success`, `error`) gives immediate user feedback ("Сообщение отправлено ✓" or "Ошибка — попробуйте ещё раз").
   - Providing a direct `wa.me` fallback link guarantees compatibility if Green API fails or if direct app opening is preferred.

4. **Testing & Isolation**:
   - In automated E2E tests, external API calls to Green API should be mocked using Playwright's `page.route('**/waInstance*/**', ...)` so test runs are deterministic, fast, and do not spam real phone numbers or consume API quotas.

---

## 3. Caveats

- **No Caveats**: All requirements are clear and technical specifications directly address all Green API formatting, route creation, component state feedback, and Playwright verification.

---

## 4. Conclusion & Implementation Plan for Worker M1

Worker M1 must execute the following 4 files creation/modifications:

### Task 1: Create `.env.local`
- **Path**: `/Users/ramil/teamwork_projects/zherles_mvp/.env.local`
- **Content**:
```env
GREENAPI_URL=https://7107.api.greenapi.com
GREENAPI_ID=710722698257
GREENAPI_TOKEN=8e5ed41b52a44dbe8a74e50ae8ad7a04958f3eebe8004fcfbf
```

---

### Task 2: Create API Route `/api/whatsapp/send/route.ts`
- **Path**: `/Users/ramil/teamwork_projects/zherles_mvp/app/api/whatsapp/send/route.ts`
- **Code**:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Укажите номер телефона и текст сообщения' },
        { status: 400 }
      );
    }

    const { phone, message } = body;

    // Clean phone number: remove non-digits
    let cleanPhone = String(phone).replace(/\D/g, '');

    // Standardize Kazakh/CIS numbers to 77XXXXXXXXX
    if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
      cleanPhone = '7' + cleanPhone.slice(1);
    } else if (cleanPhone.length === 10) {
      cleanPhone = '7' + cleanPhone;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат номера телефона' },
        { status: 400 }
      );
    }

    const chatId = `${cleanPhone}@c.us`;

    const greenApiUrl = process.env.GREENAPI_URL || 'https://7107.api.greenapi.com';
    const greenApiId = process.env.GREENAPI_ID || '710722698257';
    const greenApiToken = process.env.GREENAPI_TOKEN;

    if (!greenApiToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Сервер WhatsApp не настроен (отсутствует GREENAPI_TOKEN в .env.local)',
        },
        { status: 500 }
      );
    }

    const endpoint = `${greenApiUrl}/waInstance${greenApiId}/sendMessage/${greenApiToken}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Green API error:', response.status, errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Ошибка — попробуйте ещё раз (Green API status ${response.status})`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in /api/whatsapp/send:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка — попробуйте ещё раз' },
      { status: 500 }
    );
  }
}
```

---

### Task 3: Update `components/ShareButtons.tsx`
- **Path**: `/Users/ramil/teamwork_projects/zherles_mvp/components/ShareButtons.tsx`
- **Code**:
```tsx
'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Send, PhoneCall, X, Loader2 } from 'lucide-react';

interface ShareButtonsProps {
  title?: string;
  text?: string;
  url?: string;
  pinCode?: string;
  className?: string;
}

export default function ShareButtons({
  title = 'ЖЕРЛЕС — Паспорт района',
  text = 'Получи бонусы и скидки в заведениях нашего района!',
  url,
  pinCode,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return url || 'https://zherles.kz/b2c/passport';
  };

  const currentUrl = getShareUrl();
  const shareText = pinCode ? `${text} (ПИН-код: ${pinCode})` : text;
  const waMessage = `${shareText} ${currentUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleSendGreenApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setStatus('error');
      setStatusMessage('Введите номер телефона');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          message: waMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMessage('Сообщение отправлено ✓');
        setTimeout(() => {
          setShowModal(false);
          setStatus('idle');
          setStatusMessage('');
          setPhone('');
        }, 2500);
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Ошибка — попробуйте ещё раз');
      }
    } catch (err) {
      console.error('Green API call failed:', err);
      setStatus('error');
      setStatusMessage('Ошибка — попробуйте ещё раз');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Native share error:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      const copyContent = `${shareText}\n${currentUrl}`;
      await navigator.clipboard.writeText(copyContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* WhatsApp Trigger Button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        title="Поделиться в WhatsApp через Green API"
      >
        <span className="font-bold">WhatsApp</span>
      </button>

      {/* Telegram Button */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        title="Поделиться в Telegram"
      >
        <Send className="w-3.5 h-3.5" />
        <span className="font-bold">Telegram</span>
      </a>

      {/* Native Web Share / Copy Link Fallback */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
          copied
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
        title="Скопировать ссылку"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ссылка скопирована!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Скопировать</span>
          </>
        )}
      </button>

      {/* Native Share icon button */}
      {typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-95"
          title="Поделиться через мобильное меню"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* WhatsApp Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setStatus('idle');
                setStatusMessage('');
              }}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Отправить в WhatsApp
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Введите номер телефона получателя для отправки сообщения через Green API.
            </p>

            <form onSubmit={handleSendGreenApi} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  placeholder="+7 (701) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              {/* Status Alert Banner */}
              {status === 'success' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Сообщение отправлено ✓</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl">
                  {statusMessage || 'Ошибка — попробуйте ещё раз'}
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <span>Отправить</span>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all text-center"
                  title="Открыть прямо в приложении WhatsApp"
                >
                  wa.me
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Task 4: Add E2E Playwright Test in `e2e/zherles_mvp.spec.ts`
- **Path**: `/Users/ramil/teamwork_projects/zherles_mvp/e2e/zherles_mvp.spec.ts`
- **Code to append**:
```typescript
  test('Test 7: Green API WhatsApp Send Integration', async ({ page }) => {
    // 1. Intercept and mock external Green API endpoint request
    await page.route('**/waInstance*/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ idMessage: 'mock-wa-msg-99999' }),
      });
    });

    // 2. Directly verify API route POST handler /api/whatsapp/send
    const apiResponse = await page.request.post('/api/whatsapp/send', {
      data: {
        phone: '77011234567',
        message: 'Тестовая акция ЖЕРЛЕС',
      },
    });

    expect(apiResponse.status()).toBe(200);
    const apiJson = await apiResponse.json();
    expect(apiJson.success).toBe(true);

    // 3. Test B2C Passport UI flow
    await page.goto('/b2c/passport');
    const waButton = page.getByRole('button', { name: /WhatsApp/i }).first();
    await expect(waButton).toBeVisible();
    await waButton.click();

    // Fill phone in WhatsApp dialog
    const phoneInput = page.getByPlaceholder(/701/i);
    await expect(phoneInput).toBeVisible();
    await phoneInput.fill('77011234567');

    // Click submit button inside modal
    const sendSubmitBtn = page.getByRole('button', { name: /^Отправить$/i });
    await sendSubmitBtn.click();

    // Verify success message appears
    await expect(page.getByText('Сообщение отправлено ✓')).toBeVisible();
  });
```

---

## 5. Verification Method

1. **Lint & Build**:
   ```bash
   npm run build
   ```
   Must complete without TypeScript or Next.js build errors.

2. **Automated E2E Tests**:
   ```bash
   npx playwright test
   ```
   All tests (including Test 7 for Green API WhatsApp sending) must pass cleanly.

3. **Invalidation Conditions**:
   - If `/api/whatsapp/send` returns status other than 200/400/500 JSON.
   - If phone number formatting fails to transform `87011234567` to `77011234567@c.us`.
   - If "Сообщение отправлено ✓" text does not render on success.
