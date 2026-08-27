# Indeed Job Tracker — Payment Website Design

**Date:** 2026-08-26  
**Status:** Implemented in this repo (accounts + Paddle + entitlement/PKCE APIs)  
**Repo:** this folder (`Freemium website`). The Next.js app lives at the **repository root**, not a nested `web/`.  
**Parent product spec:** `docs/superpowers/spec/2026-08-24-freemium-pro-design.md`  
**Visual reference:** SaaS landing layout supplied 2026-08-26 (hero, feature cards, FAQ accordion, mesh CTA, footer). Brand colors stay the extension tokens, not the purple template.

## Summary

Ship a standalone website that creates accounts, collects Pro payment via **Paddle Billing** (merchant of record), and exposes entitlement so the Chrome extension can later unlock **Hide / Unhide** and **ATS score results**.

This repo is the source of truth for accounts and entitlements. The extension (separate repo) never trusts a client-only flag: it will hold opaque tokens and call `GET /api/me/entitlement`.

Job descriptions, tracked jobs, resumes, and ATS API keys stay in the browser. This website stores email, auth secrets, Paddle IDs, and subscription status only.

## Confirmed decisions

| Topic | Decision |
|---|---|
| Location | This folder, app at repo root |
| Identity | Email account on this site |
| Sign-in | Password default; magic link for passwordless and forgot-password |
| Plan | One Pro subscription unlocks Hide/Unhide **and** ATS results |
| Billing | Monthly `$4.99 / month` and yearly `$39 / year` (yearly cheaper); Paddle overlay checkout |
| Visual | Follow the supplied landing layout; tint with `#20FC8F`, `#000000`, `#FDB833`; font `"Roboto", system-ui, sans-serif` |
| Social proof | Honest Indeed-host line only. No fake company logos or testimonials |
| Extension login | Built now: `/extension/connect` + PKCE token APIs. Wired in the extension repo later |
| Entitlement source | Our Postgres row, kept in sync by Paddle webhooks (not live Paddle API on every click) |

## Out of scope

- Implementing Hide/ATS gates inside the extension (separate repo / later plan)
- Separate add-ons for Hide vs ATS
- Google / social login
- Sending resume, JD, or tracked jobs to this server
- Analytics, usage metering, or feature flags beyond Pro vs free
- Fake testimonials, fake customer logos, or a “Watch demo” video
- Changing free extension features

## Architecture

```
┌─────────────────────┐  PKCE + Bearer   ┌──────────────────────────────┐
│  Extension (later)  │◄────────────────►│  This Next.js site           │
│  popup + SW         │                  │  Better Auth + Postgres      │
└─────────────────────┘                  │  GET /api/me/entitlement     │
                                         └──────────────┬───────────────┘
                                                        │ webhooks
                                                        ▼
                                                 ┌─────────────┐
                                                 │ Paddle      │
                                                 │ Billing     │
                                                 └─────────────┘
```

### Stack

- Next.js App Router, TypeScript, Tailwind, deployed on Vercel
- Postgres (Neon) + Drizzle ORM
- Better Auth: email/password, magic link plugin, password reset
- Resend for transactional email; if `RESEND_API_KEY` is unset in development, log the full link to the server console
- Paddle.js overlay checkout (logged-in users only)
- Paddle Node SDK webhook at `POST /api/webhooks/paddle` using **raw body** (`req.text()`) and `paddle.webhooks.unmarshal`
- Vitest for pure unit tests (no network)

### Trust model

Checkout requires a Better Auth session. Webhooks write `subscription`. `resolveEntitlement` is the only Pro/free decoder. The site never stores card numbers. The extension (when connected) uses `Authorization: Bearer`; website pages use cookies.

## Visual design

Centered container (~1200px). Large rounded cards (~20px). Soft shadows. Pill badges. Mesh gradients on hero and closing CTA, tinted mint → gold (`#20FC8F` → `#FDB833`), not the purple/cyan template.

Auth and checkout pages use the same chrome but a quiet centered card so they do not fight Paddle’s overlay. `/extension/connect` has no marketing chrome.

### Home (`/`)

1. **Nav** — logo + Indeed Job Tracker · Features (`/#features`) · Pricing · Privacy · Login · Get started → `/signup` (black pill)
2. **Hero** — pill (“Pro: Hide jobs + ATS results”) · headline · short value line · **Get Pro** → `/pricing` · **Install free** links to `NEXT_PUBLIC_CWS_URL` when set, otherwise the Features section (no dead `#`) · product mock (Kanban + metrics chips) on a mint/gold wash
3. **Trust line** — “Works on Indeed AU, NZ, UK, CA, and US, and Seek AU and NZ.”
4. **Free features** — three cards: metrics chips, Copy JD + Save, local Kanban
5. **Pro features** — Hide/Unhide and ATS results
6. **How it works** — Install free → sign in here → checkout in Paddle overlay
7. No testimonial block in v1
8. **FAQ accordion** — what Pro unlocks, what stays local, Paddle/cards, cancel anytime
9. **Closing CTA** on mint/gold mesh · **Get Pro** + **Create account**
10. **Footer** — Product (Features, Pricing) · Account (Login, Sign up) · Legal (Privacy) · “Not affiliated with Indeed or Seek.”

### Other routes

| Path | Purpose |
|---|---|
| `/pricing` | Free vs Pro cards. Pro: Monthly `$4.99 / month` and Yearly `$39 / year` with save vs 12× monthly. Checkout if signed in, else `/login?next=/pricing` |
| `/login` | Email + password; “Email me a magic link”; links to signup and forgot password |
| `/signup` | Name, email, password |
| `/forgot-password` | Request reset email |
| `/reset-password` | Set new password from email link |
| `/account` | Email, plan badge, Upgrade or Manage billing, note that the Chrome extension connects after Sign in from the popup |
| `/extension/connect` | Completes PKCE redirect |
| `/privacy` | Hosted policy: email + Paddle; no card numbers; jobs/resumes stay in the extension |

## Data model

### Better Auth tables

Use Better Auth’s Drizzle schema (`user`, `session`, `account`, `verification`) generated with `@better-auth/cli generate`. Do not invent alternate column names.

### Extra column on `user`

| Column | Type | Purpose |
|---|---|---|
| `paddle_customer_id` | text, unique, nullable | Paddle customer id |

### `subscription`

One current subscription snapshot per user (upsert on `paddle_subscription_id`).

| Column | Type | Purpose |
|---|---|---|
| `id` | text pk | cuid/uuid |
| `user_id` | text not null → user.id | owner |
| `paddle_subscription_id` | text unique not null | Paddle subscription id |
| `paddle_price_id` | text not null | monthly or yearly price |
| `status` | text not null | Paddle status string |
| `plan` | text not null | `free` or `pro` |
| `current_period_end` | timestamptz nullable | end of paid period |
| `cancel_at_period_end` | boolean not null default false | scheduled cancel |
| `occurred_at` | timestamptz not null | last applied Paddle `occurred_at` (ignore older events) |
| `updated_at` | timestamptz not null | |

### `paddle_event`

| Column | Type | Purpose |
|---|---|---|
| `event_id` | text pk | Paddle `event_id` for idempotency |
| `event_type` | text not null | |
| `processed_at` | timestamptz not null | |

### `extension_auth_code`

One-time authorization codes (5 minute TTL).

| Column | Type |
|---|---|
| `id` | text pk |
| `user_id` | text not null |
| `code_hash` | text not null (sha256 of the raw code) |
| `code_challenge` | text not null (PKCE S256 challenge) |
| `redirect_uri` | text not null |
| `state` | text not null |
| `expires_at` | timestamptz not null |
| `consumed_at` | timestamptz nullable |

### `extension_refresh_token`

| Column | Type |
|---|---|
| `id` | text pk |
| `user_id` | text not null |
| `token_hash` | text not null (sha256 of raw refresh token) |
| `expires_at` | timestamptz not null (30 days) |
| `revoked_at` | timestamptz nullable |
| `created_at` | timestamptz not null |

## Entitlement rules

Pure function `resolveEntitlement(subscriptionRow, nowMs)` in `src/lib/entitlement.ts`.

Inputs (subscription row may be `null`):

- `plan`: `"pro"` or `"free"`
- `status`: Paddle status (`active`, `trialing`, `past_due`, `canceled`, `paused`, or `"none"`)
- `currentPeriodEnd`: ISO string or epoch ms or `null`

**Pro if** `plan === "pro"` AND any of:

1. `status` is `active` or `trialing`
2. `status` is `past_due` (keep access while Paddle retries payment)
3. `status` is `canceled` AND `currentPeriodEnd > now` (paid period still running)

Otherwise free.

Output shape (also the JSON body of `GET /api/me/entitlement` plus `authenticated` and `email`):

```ts
type Entitlement = {
  plan: "pro" | "free";
  status: string;
  currentPeriodEnd: string | null; // ISO 8601 or null
  features: {
    hideJobs: boolean;
    atsResults: boolean;
  };
};
```

For the one-plan product, `hideJobs === atsResults === (plan === "pro")`. Keep the `features` object so the extension checks named capabilities.

Website cookie sessions use Better Auth. Extension requests use `Authorization: Bearer <access_token>`.

`GET /api/me/entitlement` unauthenticated → `{ authenticated: false, plan: "free", status: "none", currentPeriodEnd: null, email: null, features: { hideJobs: false, atsResults: false } }` with **200** (not 401).

Authenticated → `{ authenticated: true, email, ...resolveEntitlement(row) }`.

## Extension OAuth (PKCE)

Redirect URI must be exactly `chrome.identity.getRedirectURL()` which is `https://<EXTENSION_ID>.chromiumapp.org/`.

Env `EXTENSION_REDIRECT_URIS` is a comma-separated allow list of those URIs (unpacked + store IDs).

1. Extension creates `state`, `code_verifier`, `code_challenge = base64url(sha256(verifier))`.
2. `chrome.identity.launchWebAuthFlow` to `${APP_ORIGIN}/extension/connect?redirect_uri=...&state=...&code_challenge=...&code_challenge_method=S256`
3. `/extension/connect`: if no session, redirect to `/login?next=<same url>`. If signed in, insert `extension_auth_code` and 302 to `redirect_uri?code=RAWCODE&state=STATE`.
4. Extension `POST /api/extension/token` with `{ grant_type, code, code_verifier, redirect_uri }`.
5. Server verifies PKCE, consumes the code, returns access JWT (15 min, HS256, `BETTER_AUTH_SECRET`, claims `{ sub, email, typ: "extension", exp }`) and opaque refresh (30 days, hashed).
6. `POST /api/extension/refresh` rotates the refresh token.
7. `POST /api/extension/revoke` sets `revoked_at`. Always 200.

`code_challenge_method` other than `S256`, or a `redirect_uri` not on the allow list → 400.

## Paddle

### Catalog (dashboard, not code)

Create one product **Indeed Job Tracker Pro**. Two recurring prices:

| Interval | Display copy in `src/lib/pricing.ts` | Env |
|---|---|---|
| Monthly | `$4.99 / month` | `PADDLE_PRICE_ID_MONTHLY` (`pri_...`) |
| Yearly | `$39 / year` (shown as save vs 12× monthly) | `PADDLE_PRICE_ID_YEARLY` (`pri_...`) |

Charge amounts in Paddle must match that copy. Code never hardcodes `pri_` IDs. Prefer server-rendered `data-price-id` on checkout buttons.

### Checkout

Logged-in only. `POST /api/billing/checkout` body `{ "priceId": "pri_..." }`.

Server:

1. Reject unknown price IDs
2. If user has no `paddle_customer_id`, `customers.create({ email, customData: { userId } })` and save the id
3. `transactions.create({ customerId, items: [{ priceId, quantity: 1 }], customData: { userId } })`
4. Return `{ transactionId }`
5. Client: `Paddle.Checkout.open({ transactionId })` with `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` and `NEXT_PUBLIC_PADDLE_ENV` (`sandbox` | `production`)

Success URL: `${APP_ORIGIN}/account?checkout=success`.

### Customer portal

`POST /api/billing/portal` returns `{ url }` from Paddle customer portal. Account page “Manage billing” opens it. If the user has no customer id, return 400 `{ error: "NO_CUSTOMER" }`.

### Webhooks

Path: `POST /api/webhooks/paddle`  
Header: `Paddle-Signature`  
Body: raw text.

Subscribe at minimum:

- `subscription.created`
- `subscription.updated`
- `subscription.canceled`
- `subscription.past_due` (if offered; otherwise `subscription.updated` with `past_due` is enough)
- `customer.updated` — record `paddle_event` only; do not change email or plan from this event in v1

Ignore unknown event types (200). Duplicate `event_id` → 200 no-op.

Map Paddle subscription → our row:

- `userId` from `data.customData.userId`, else `user.paddle_customer_id === data.customerId`
- If no user can be resolved, log and return 200 (do not 500-loop)
- `plan = pro` when an item `price.id` is the monthly or yearly Pro price; `resolveEntitlement` is what the API uses
- `current_period_end` from `data.currentBillingPeriod.endsAt`
- `cancel_at_period_end` true when `data.scheduledChange.action === "cancel"`
- Skip applying an event if `occurred_at` is older than the row’s `occurred_at`

## API routes

| Path | Purpose |
|---|---|
| `/api/auth/[...all]` | Better Auth handler |
| `/api/webhooks/paddle` | Paddle, raw body |
| `/api/billing/checkout` | Auth required |
| `/api/billing/portal` | Auth required |
| `/api/extension/token` | No cookie; JSON body |
| `/api/extension/refresh` | No cookie; JSON body |
| `/api/extension/revoke` | No cookie; JSON body; always 200 |
| `/api/me/entitlement` | Cookie session **or** Bearer extension JWT |

## Error handling

| Case | Behavior |
|---|---|
| Checkout while signed out | 401 `{ error: "UNAUTHENTICATED" }`; client redirects to `/login?next=/pricing` |
| Unknown or empty `priceId` | 400 `{ error: "INVALID_PRICE" }` |
| Portal with no `paddle_customer_id` | 400 `{ error: "NO_CUSTOMER" }`; account page shows Upgrade, not Manage billing |
| Invalid Paddle webhook signature | 400 `{ error: "INVALID_SIGNATURE" }` |
| Duplicate webhook `event_id` | 200 `{ ok: true, duplicate: true }` |
| Webhook user cannot be resolved | Log; 200 (never retry-loop) |
| Unknown webhook type | 200 after recording `paddle_event` when signature is valid |
| PKCE mismatch, consumed code, expired code, bad redirect | 401 `{ error: "INVALID_GRANT" }` on token; 400 on connect page for method/URI |
| Expired / revoked / unknown refresh | 401 `{ error: "INVALID_GRANT" }` |
| Revoke unknown token | 200 (idempotent) |
| Entitlement unauthenticated | 200 free payload (not 401) |
| Auth email send fails (no Resend in prod) | Surface a generic “could not send email” on the form; in dev, console-log the link |
| Paddle.js / checkout network failure | Stay on `/pricing`; show “Checkout could not start. Try again.” |
| `/account?checkout=success` before webhook lands | Show “Payment received — Pro unlocks in a moment.” Poll `GET /api/me/entitlement` a few times, then show the plan badge |

Do not leak stack traces or Paddle secrets in JSON.

## File map (implementation)

| Path | Responsibility |
|---|---|
| `src/lib/entitlement.ts` | Pure Pro/free resolver |
| `src/lib/pricing.ts` | Display copy + env price IDs |
| `src/lib/schema.ts` | Drizzle tables |
| `src/lib/db.ts` | Postgres client |
| `src/lib/auth.ts` | Better Auth server |
| `src/lib/auth-client.ts` | Better Auth React client |
| `src/lib/mail.ts` | Resend or console fallback |
| `src/lib/paddle.ts` | Paddle SDK singleton |
| `src/lib/paddle-map.ts` | Webhook → subscription row |
| `src/lib/crypto-hash.ts` | SHA-256, PKCE S256, redirect allow list |
| `src/lib/extension-auth.ts` | Codes, JWT, refresh rotate/revoke |
| `src/lib/session-entitlement.ts` | Cookie or Bearer → entitlement payload |
| `src/app/api/webhooks/paddle/route.ts` | Unmarshal + persist |
| `src/app/api/extension/*/route.ts` | Token, refresh, revoke |
| `src/app/api/me/entitlement/route.ts` | Cookie or Bearer |
| `src/app/api/billing/*/route.ts` | Checkout + portal |
| `src/app/extension/connect/page.tsx` | PKCE redirect after login |
| `src/app/page.tsx` | Marketing home |
| `src/app/pricing/page.tsx` | Plans + checkout |
| `src/app/account/page.tsx` | Plan + manage billing |

## Testing

Vitest, no network:

- `resolveEntitlement` matrix: null row, active, trialing, past_due, canceled in period, canceled expired, paused
- Paddle mapper: maps monthly to pro, scheduled cancel flag, unknown price → null
- Webhook apply rules (pure helpers if extracted): duplicate `event_id` no-op, stale `occurred_at` ignored, `customData.userId`, customer-id fallback documented in the route
- PKCE: RFC 7636 challenge vector; consumed code rejected; bad redirect_uri rejected

Manual (human + sandbox, not required for unit tests to pass):

- Sign up, login, magic-link console URL
- `curl` unsigned `GET /api/me/entitlement` returns free 200
- Paddle sandbox checkout when `pri_` ids exist

## Operator setup (human, not code)

1. Paddle sandbox: product **Indeed Job Tracker Pro**, recurring `$4.99` monthly and `$39` yearly
2. Copy `pri_` ids, API key, client token, webhook secret into `.env.local`
3. Neon (or other Postgres) `DATABASE_URL`
4. Optional Resend domain + `RESEND_API_KEY`
5. `EXTENSION_REDIRECT_URIS` once the unpacked extension id is known

Unit tests and checkout wiring must pass without live Paddle.

## Success criteria

1. Signed-out visitor can read `/` and `/pricing` in the approved layout
2. Sign up + login work; magic link appears in the server log when Resend is unset
3. Unsigned `GET /api/me/entitlement` is 200 with `authenticated: false` and `plan: "free"`
4. Signed-in free user hitting checkout is rejected for unknown price IDs and accepted for env price IDs (returns `transactionId` when Paddle keys exist)
5. Webhook handler compiles, verifies signature, and is idempotent on `event_id`
6. Cancel at period end still resolves Pro until `currentPeriodEnd`
7. `/extension/connect` refuses a redirect URI not on the allow list
8. This repo never stores job, resume, or ATS-key payloads

## Env example

```
DATABASE_URL=postgres://user:pass@host/db
BETTER_AUTH_SECRET=replace-with-32-plus-char-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=
RESEND_FROM=Indeed Job Tracker <noreply@localhost>
PADDLE_API_KEY=
PADDLE_NOTIFICATION_WEBHOOK_SECRET=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
NEXT_PUBLIC_PADDLE_ENV=sandbox
PADDLE_PRICE_ID_MONTHLY=pri_replace_monthly
PADDLE_PRICE_ID_YEARLY=pri_replace_yearly
NEXT_PUBLIC_CWS_URL=
EXTENSION_REDIRECT_URIS=https://abcdefghijklmnopqrstuvwxyzabcdefghijk.chromiumapp.org/
```

## Self-review

- No TBD product forks: one Pro plan, both intervals, password + magic link, PKCE endpoints, mint/gold landing layout
- App root is this repo, not `web/`
- Entitlement function is the only Pro/free decoder
- Job/resume data stays out of this server
- Scope is accounts + Paddle + entitlement/PKCE APIs, not extension UI gating
- Fake social proof removed; CWS button uses `NEXT_PUBLIC_CWS_URL` or falls back to `/#features`
