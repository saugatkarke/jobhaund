# Payment Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Next.js app at this repo root that can create users, take a Paddle Pro subscription, and tell the extension whether Hide and ATS results are unlocked.

**Architecture:** Better Auth cookie sessions for the website; hashed one-time codes + JWT access / opaque refresh for the extension; Paddle webhooks upsert `subscription`. Marketing pages use the approved mint/gold landing layout.

**Tech Stack:** Next.js 15, TypeScript, Tailwind, Drizzle, `postgres`, Better Auth, `jose`, `@paddle/paddle-node-sdk`, `@paddle/paddle-js`, Resend, Vitest.

## Global Constraints

- App at repository root (not `web/`)
- No job/resume/ATS-key data on the server
- Display copy `$4.99 / month` and `$39 / year`; never hardcode `pri_` IDs
- Brand: `#20FC8F`, `#000000`, `#FDB833`; `"Roboto", system-ui, sans-serif`
- Webhook uses raw body (`req.text()`), never `req.json()`
- `resolveEntitlement` is the only Pro/free decoder
- No fake logos or testimonials
- Do not commit unless the owner asks

## File map

| Path | Responsibility |
|---|---|
| `src/lib/entitlement.ts` | Pure Pro/free resolver |
| `src/lib/pricing.ts` | Display copy + env price IDs |
| `src/lib/schema.ts` | Drizzle tables |
| `src/lib/db.ts` | Lazy Postgres client |
| `src/lib/auth.ts` | Better Auth server |
| `src/lib/auth-client.ts` | Better Auth React client |
| `src/lib/mail.ts` | Resend or console fallback |
| `src/lib/paddle.ts` | Paddle SDK singleton |
| `src/lib/paddle-map.ts` | Webhook → subscription row |
| `src/lib/crypto-hash.ts` | SHA-256, PKCE S256, redirect allow list |
| `src/lib/extension-auth.ts` | Codes, JWT, refresh rotate/revoke |
| `src/lib/session-entitlement.ts` | Cookie or Bearer → entitlement payload |
| `src/app/api/webhooks/paddle/route.ts` | Unmarshal + persist |
| `src/app/api/extension/token/route.ts` | Code exchange |
| `src/app/api/extension/refresh/route.ts` | Refresh rotate |
| `src/app/api/extension/revoke/route.ts` | Sign-out revoke |
| `src/app/api/me/entitlement/route.ts` | Cookie or Bearer |
| `src/app/api/billing/checkout/route.ts` | Create Paddle transaction |
| `src/app/api/billing/portal/route.ts` | Customer portal URL |
| `src/app/extension/connect/page.tsx` | PKCE redirect after login |

---

### Task 1: Scaffold Next.js at repo root

**Files:**
- Create: Next.js app files at repo root (keep `docs/`)
- Create: `.env.example`, `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: runnable app on port 3000; `@/*` import alias

- [ ] **Step 1:** `npx create-next-app@15.1.6 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes` (keep existing `docs/`)
- [ ] **Step 2:** Install `better-auth drizzle-orm postgres @paddle/paddle-node-sdk @paddle/paddle-js resend jose` and `-D drizzle-kit vitest`
- [ ] **Step 3:** Add `.env.example` from the spec env block; add `"test": "vitest run"` to `package.json`
- [ ] **Step 4:** Confirm `npm run dev` starts (or `npm run build` if port busy)

### Task 2: Entitlement resolver (TDD)

**Files:**
- Create: `src/lib/entitlement.ts`, `src/lib/entitlement.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces: `emptyEntitlement()`, `resolveEntitlement(row, nowMs) => Entitlement`

- [ ] **Step 1:** Write failing tests (null → free; active/trialing/past_due → pro; canceled in period → pro; canceled expired / paused → free)
- [ ] **Step 2:** Run — expect FAIL
- [ ] **Step 3:** Implement per spec
- [ ] **Step 4:** Run — expect PASS

### Task 3: Pricing + schema

**Files:**
- Create: `src/lib/pricing.ts`, `src/lib/schema.ts`, `src/lib/db.ts`, `drizzle.config.ts`

**Interfaces:**
- Produces: `MONTHLY_LABEL`, `YEARLY_LABEL`, `PRODUCT_NAME`, `monthlyPriceId()`, `yearlyPriceId()`, `isProPriceId(id)`, `yearlySavingsLabel()`; Drizzle tables from spec

- [ ] **Step 1:** Pricing module with labels and env price IDs
- [ ] **Step 2:** Schema: Better Auth tables + `paddleCustomerId` + subscription + paddle_event + extension tables
- [ ] **Step 3:** Lazy `db` so marketing pages boot without `DATABASE_URL`

### Task 4: Paddle mapper (TDD)

**Files:**
- Create: `src/lib/paddle-map.ts`, `src/lib/paddle-map.test.ts`

**Interfaces:**
- Produces: `mapPaddleSubscription(event): MappedSubscription | null`

- [ ] **Step 1:** Failing tests: monthly → pro; scheduled cancel; unknown price → null; missing userId → null
- [ ] **Step 2:** Implement mapper
- [ ] **Step 3:** Tests PASS

### Task 5: PKCE helpers (TDD)

**Files:**
- Create: `src/lib/crypto-hash.ts`, `src/lib/crypto-hash.test.ts`

**Interfaces:**
- Produces: `sha256Hex`, `newSecret`, `allowedRedirectUris`, `isAllowedRedirectUri`, `pkceS256Challenge`

- [ ] **Step 1:** RFC 7636 vector test + allow-list test
- [ ] **Step 2:** Implement
- [ ] **Step 3:** Tests PASS

### Task 6: Auth, mail, extension JWT helpers, APIs, pages

**Files:**
- Create: auth/mail/paddle/extension-auth/session-entitlement + all API routes + marketing/auth/account/privacy/connect pages

**Interfaces:**
- See spec routes and error table

- [ ] **Step 1:** Auth + pages (login/signup/forgot/reset)
- [ ] **Step 2:** Billing checkout/portal/webhook
- [ ] **Step 3:** Extension token/refresh/revoke + connect page
- [ ] **Step 4:** Entitlement API + landing/pricing/account/privacy
- [ ] **Step 5:** Run `npm test`; `curl` unsigned entitlement; verify `/` and `/pricing` in browser

### Task 7: Verify

- [ ] **Step 1:** `npm test` — all pass
- [ ] **Step 2:** Unsigned `GET /api/me/entitlement` is 200 free
- [ ] **Step 3:** Browser: home + pricing match approved layout
