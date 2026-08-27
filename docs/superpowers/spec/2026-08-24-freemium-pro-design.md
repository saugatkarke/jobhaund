# Indeed Job Tracker — Freemium Pro Design

**Date:** 2026-08-24  
**Status:** Approved for implementation planning  
**Repo:** this Chrome extension repository (`web/` is a new Next.js app in the same repo)

## Summary

Ship a **freemium** product: the extension stays useful for free (metrics, Copy JD, Save, Kanban, resume upload). **Hide / Unhide job cards** and **ATS score results** require a **Pro** subscription.

The Next.js website is the source of truth for accounts and entitlements. **Paddle Billing** is merchant of record. The extension never trusts a client-only flag: it holds opaque tokens, asks `GET /api/me/entitlement`, and gates those two features on the response.

Job descriptions, tracked jobs, resumes, and ATS API keys stay in the browser. The website stores email, auth secrets, Paddle IDs, and subscription status only.

## Confirmed product decisions

| Topic | Decision |
|---|---|
| Identity | Email account on the Next.js site |
| Sign-in methods | Password default; magic link for passwordless and forgot-password |
| Plan | One Pro subscription unlocks Hide/Unhide **and** ATS results |
| Billing | Monthly and yearly (yearly cheaper); Paddle checkout |
| Extension login | Popup Sign in → website login → authorization code + PKCE returns to the extension via `chrome.identity.launchWebAuthFlow` |
| ATS free UX | Button stays clickable; scoring does **not** run; placeholder chart stays blurred with an upgrade prompt |
| Hide free UX | Hide button stays visible; click shows an upgrade prompt instead of hiding |
| Entitlement source | Our Postgres row, kept in sync by Paddle webhooks (not live Paddle API on every click) |

## Out of scope

- Separate add-ons for Hide vs ATS
- Google / social login
- Sending resume, JD, or tracked jobs to our servers
- Analytics, usage metering, or feature flags beyond Pro vs free
- Changing free features (chips, Copy JD, Save, Kanban, CSV, resume upload, model/API-key settings)
- DRM: a determined user can patch a local extension. Gates must still be correct for honest users and must refuse `SCORE_ATS` in the service worker

## Architecture

```
┌─────────────┐  PKCE + code   ┌──────────────────────────────┐
│  Extension  │◄──────────────►│  Next.js (web/)              │
│  popup + SW │  Bearer token  │  Better Auth + Postgres      │
│  content UI │                │  GET /api/me/entitlement     │
└─────────────┘                └──────────────┬───────────────┘
                                              │ webhooks
                                              ▼
                                       ┌─────────────┐
                                       │ Paddle      │
                                       │ Billing     │
                                       └─────────────┘
```

### Website (`web/`)

- Next.js App Router, TypeScript, deployed on Vercel
- Postgres (Neon) + Drizzle ORM
- Better Auth: email/password, magic link plugin, password reset
- Resend for transactional email; if `RESEND_API_KEY` is unset in development, log the full link to the server console so local auth works
- Paddle.js overlay checkout (logged-in users only)
- Paddle Node SDK webhook at `POST /api/webhooks/paddle` using **raw body** (`req.text()`) and `paddle.webhooks.unmarshal`

### Extension (existing zero-build MV3)

- New `shared/appConfig.js` holds `IJT.APP_ORIGIN` (localhost in dev, production HTTPS in store builds)
- New `shared/entitlement.js` pure helpers (unit-tested with `node:test` like the rest of `scripts/`)
- New `shared/account.js` token storage + entitlement fetch (used by the service worker)
- Content scripts ask the service worker for entitlement; they never store the access token
- Popup Sign in / Sign out / Upgrade

## Data model

### Better Auth tables

Use Better Auth’s Drizzle schema (`user`, `session`, `account`, `verification`) generated with `@better-auth/cli generate`. Do not invent alternate column names.

### Extra columns on `user`

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

Pure function `resolveEntitlement(subscriptionRow, nowMs)` in `web/src/lib/entitlement.ts` **and** the same rules in `shared/entitlement.js` (`IJT.resolveEntitlement`).

Inputs (subscription row may be `null`):

- `plan`: `"pro"` or `"free"`
- `status`: Paddle status (`active`, `trialing`, `past_due`, `canceled`, `paused`, or `"none"`)
- `currentPeriodEnd`: ISO string or epoch ms or `null`

**Pro if** `plan === "pro"` AND any of:

1. `status` is `active` or `trialing`
2. `status` is `past_due` (keep access while Paddle retries payment)
3. `status` is `canceled` AND `currentPeriodEnd > now` (paid period still running)

Otherwise free.

Output shape (this is also the JSON body of `GET /api/me/entitlement` plus `authenticated` and `email`):

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

For the one-plan product, `hideJobs === atsResults === (plan === "pro")`. Keep the `features` object so UI checks named capabilities.

Website cookie sessions use Better Auth. Extension requests use `Authorization: Bearer <access_token>`.

## Extension OAuth (PKCE)

Redirect URI must be exactly `chrome.identity.getRedirectURL()` which is `https://<EXTENSION_ID>.chromiumapp.org/`.

Env `EXTENSION_REDIRECT_URIS` is a comma-separated allow list of those URIs (unpacked + store IDs).

1. Popup/service worker creates `state` (32 hex bytes), `code_verifier` (43–128 chars), `code_challenge = base64url(sha256(verifier))`.
2. `chrome.identity.launchWebAuthFlow({ interactive: true, url })` where  
   `url = ${APP_ORIGIN}/extension/connect?redirect_uri=...&state=...&code_challenge=...&code_challenge_method=S256`
3. `/extension/connect` is a Next.js page: if no Better Auth session, redirect to `/login?next=<same url>`. If signed in, POST/GET server action that inserts `extension_auth_code` and 302s to `redirect_uri?code=RAWCODE&state=STATE`.
4. Extension parses `code` from the redirect URL, verifies `state`, POST `${APP_ORIGIN}/api/extension/token`:

```json
{
  "grant_type": "authorization_code",
  "code": "...",
  "code_verifier": "...",
  "redirect_uri": "https://<id>.chromiumapp.org/"
}
```

5. Server verifies PKCE, consumes the code, returns:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<opaque>",
  "token_type": "Bearer",
  "expires_in": 900
}
```

Access JWT: HS256 with `BETTER_AUTH_SECRET`, claims `{ sub, email, typ: "extension", exp }` (15 minutes).

Refresh: 32-byte hex, hashed in DB, 30 days. `POST /api/extension/refresh` with `{ "refresh_token" }` rotates the refresh token (old hash revoked).

`chrome.storage.local` key `ijt_account`:

```json
{
  "accessToken": "",
  "refreshToken": "",
  "accessTokenExpiresAt": 0,
  "entitlement": {
    "plan": "free",
    "status": "none",
    "currentPeriodEnd": null,
    "features": { "hideJobs": false, "atsResults": false },
    "email": null,
    "fetchedAt": 0
  }
}
```

**Stale cache:** if `fetchedAt` is older than 24 hours and refresh fails, treat as signed-out free (do not keep Pro forever offline). If fetch fails but `fetchedAt` is within 24 hours, keep last entitlement.

Refresh entitlement: popup open, service worker on alarm every 6 hours, and immediately after token exchange.

## Paddle

### Catalog (dashboard, not code)

Create one product **Indeed Job Tracker Pro**. Two recurring prices:

| Interval | Display copy in `web/src/lib/pricing.ts` | Env |
|---|---|---|
| Monthly | `$4.99 / month` | `PADDLE_PRICE_ID_MONTHLY` (`pri_...`) |
| Yearly | `$39 / year` (shown as save vs 12× monthly) | `PADDLE_PRICE_ID_YEARLY` (`pri_...`) |

Charge amounts in Paddle must match that copy. Code never hardcodes `pri_` IDs.

### Checkout

Logged-in only. `POST /api/billing/checkout` body `{ "priceId": "pri_..." }` (must be one of the two env IDs).

Server:

1. Reject unknown price IDs
2. If user has no `paddle_customer_id`, `customers.create({ email, customData: { userId } })` and save the id
3. `transactions.create({ customerId, items: [{ priceId, quantity: 1 }], customData: { userId } })`
4. Return `{ transactionId }`
5. Client: `Paddle.Checkout.open({ transactionId })` with `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` and `NEXT_PUBLIC_PADDLE_ENV` (`sandbox` | `production`)

Success URL: `${APP_ORIGIN}/account?checkout=success`.

### Customer portal

`POST /api/billing/portal` returns `{ url }` from Paddle customer portal / cancellation flow. Account page “Manage billing” opens it. If the user has no customer id, return 400 with `{ error: "NO_CUSTOMER" }`.

### Webhooks

Path: `POST /api/webhooks/paddle`  
Header: `Paddle-Signature`  
Body: raw text.

Subscribe at minimum:

- `subscription.created`
- `subscription.updated`
- `subscription.canceled`
- `subscription.past_due` (if offered in the dashboard; otherwise `subscription.updated` with `past_due` is enough)
- `customer.updated`

Ignore unknown event types (200). Duplicate `event_id` → 200 no-op.

Map Paddle subscription → our row:

- `userId` from `data.customData.userId` or `user.paddle_customer_id === data.customerId`
- If no user can be resolved, log and return 200 (do not 500-loop)
- `plan = pro` when the subscription has an item whose `price.id` is the monthly or yearly Pro price **and** status is not a terminal unpaid state; `resolveEntitlement` is what the API uses, the row still stores Paddle `status` and `plan: "pro"` whenever the product is Pro
- `current_period_end` from `data.currentBillingPeriod.endsAt`
- `cancel_at_period_end` true when `data.scheduledChange.action === "cancel"`
- Skip applying an event if `occurred_at` is older than the row’s `occurred_at`

## Website routes

| Path | Purpose |
|---|---|
| `/` | Marketing: free vs Pro, CTA to signup |
| `/pricing` | Monthly / yearly cards, checkout if signed in else login with `next=/pricing` |
| `/login` | Email + password; secondary “Email me a magic link”; link to signup and forgot password |
| `/signup` | Name, email, password |
| `/forgot-password` | Request reset email (same Resend path) |
| `/reset-password` | Set new password from email link |
| `/account` | Email, plan badge, Upgrade / Manage billing, “Chrome extension is connected after you Sign in from the popup” |
| `/extension/connect` | Completes PKCE redirect as described |
| `/privacy` | Hosted privacy policy (can later replace the static HTML host) |
| `/api/auth/[...all]` | Better Auth handler |
| `/api/webhooks/paddle` | Paddle |
| `/api/billing/checkout` | Auth required |
| `/api/billing/portal` | Auth required |
| `/api/extension/token` | No cookie; JSON body |
| `/api/extension/refresh` | No cookie; JSON body |
| `/api/me/entitlement` | Cookie session **or** Bearer extension JWT |

`GET /api/me/entitlement` unauthenticated → `{ authenticated: false, plan: "free", status: "none", currentPeriodEnd: null, email: null, features: { hideJobs: false, atsResults: false } }` with 200 (not 401), so the extension can call it safely.

Authenticated → `{ authenticated: true, email, ...resolveEntitlement(row) }`.

## Extension gating

### Messages (`shared/constants.js`)

- `GET_ENTITLEMENT` → `ENTITLEMENT_RESULT` with `{ ok, entitlement }` (`entitlement` is `IJT.emptyEntitlement()` when signed out)
- `START_SIGN_IN` → `{ ok, error? }` after PKCE flow
- `SIGN_OUT` → revoke refresh token best-effort `POST /api/extension/revoke` if implemented; always clear `ijt_account`
- `OPEN_APP_TAB` payload `{ path: "/pricing" | "/login" | "/account" }` → `chrome.tabs.create({ url: APP_ORIGIN + path })`

Also implement `POST /api/extension/revoke` `{ refresh_token }` that sets `revoked_at`. Sign out calls it; ignore network failure.

### Hide

Keep `IJT.renderHideButtonHtml` as today. In `handleHideUi`, before `hideJob`:

1. `const ent = await IJT.getCachedEntitlement()` (content script: `IJT.send(GET_ENTITLEMENT)` with an in-memory cache of 60s)
2. If `ent.features.hideJobs`, existing hide behavior
3. Else `IJT.applyJobCardUpgradePrompt(card, jobId)` — overlay copy: **“Hide jobs is a Pro feature.”** Buttons: **Upgrade** (`data-ijt-upgrade`, opens `/pricing` via `OPEN_APP_TAB`) and **Not now** (dismiss overlay only, do not hide)

Do not persist a hidden record. Do not blur the card as if it were hidden.

Free users who already have hidden jobs from a previous Pro period: `enhanceHiddenJobCards` still honors stored hidden ids (no retroactive unhide). Undo still works on those cards.

### ATS

`IJT.handleAtsScore`:

1. Fetch entitlement
2. If `features.atsResults`, existing scoring path
3. Else do **not** send `SCORE_ATS`. `IJT.setAtsPanel({ locked: true })`. Button stays enabled, label stays “ATS score” (not “Scoring…” / “Rescore”)

`renderAtsPanelHtml` new mode `locked`: same placeholder numbers and blur as idle, plus overlay:

**“ATS results are a Pro feature.”**  
**Upgrade** → `/pricing`

Service worker `SCORE_ATS`: if `!features.atsResults`, reply `ATS_SCORE_RESULT` `{ ok: false, error: "PAYWALL", message: "ATS results require Pro." }` without calling any model.

### Popup

In the header subtitle row, add an account chip:

- Signed out: button **Sign in** → `START_SIGN_IN`
- Signed in free: email (truncated) + **Upgrade**
- Signed in Pro: email + **Pro** badge + **Manage** (`OPEN_APP_TAB` `/account`)
- Always **Sign out** when signed in

Copy under resume hint when free: “ATS results on Indeed pages require Pro.”

## Permissions and packaging

`manifest.json` additions:

- permission `identity` (launchWebAuthFlow)
- host permission for `IJT.APP_ORIGIN` (localhost `http://localhost:3000/*` in development builds; production origin in store builds)
- Do **not** add `externally_connectable` (localhost is painful; PKCE redirect avoids it)

`package.sh` already copies `background content popup shared lib` — new `shared/*.js` files are included. It does **not** copy `web/`. Keep it that way. Add `web/.env*` and `web/node_modules` and `web/.next` to `.gitignore`.

Firefox `package.sh` background `scripts` array must include any new `shared/*.js` the service worker imports.

## Privacy / CWS copy (must update)

Honest additions:

- We collect email and account data on the website to provide Pro
- Payments processed by Paddle (merchant of record); we do not store card numbers
- Extension sends the session token only to `APP_ORIGIN` to read Pro vs free
- We still do not send resume, JD, or tracked jobs to our server

`identity` justification: used only to complete Sign in from the popup via Chrome’s redirect URL, never to read Google account APIs.

## Testing

### Website (`web/`)

Vitest, no network:

- `resolveEntitlement` matrix (null row, active, trialing, past_due, canceled in period, canceled expired, paused)
- Paddle mapper: idempotent event_id, stale `occurred_at` ignored, customData userId, price id → pro
- PKCE: challenge match, consumed code rejected, bad redirect_uri rejected

### Extension (`scripts/`)

Existing `node:test` + `vm` pattern:

- `scripts/entitlement.test.js` loads `shared/entitlement.js`
- `scripts/cardHide.test.js` asserts upgrade overlay HTML
- ATS panel locked markup test in `scripts/atsWidget.test.js` (new) or extend existing if present

## Success criteria

1. Free user: Hide click shows upgrade overlay; job is not hidden
2. Free user: ATS click shows locked preview; no provider HTTP call
3. Pro user: Hide and ATS behave as they do today
4. Cancel at period end: still Pro until `currentPeriodEnd`
5. Sign in from popup works against local `web/` (`http://localhost:3000`) and production origin
6. CWS zip still has `manifest.json` at zip root and does not contain `web/`

## Self-review

- No TBD product forks: one Pro plan, both billing intervals, password + magic link, PKCE popup sign-in, locked ATS preview, Hide upgrade overlay
- Website and extension share one entitlement rule
- Job/resume data stays local
- Scope is accounts + Paddle + gating those two features, not a new tracker backend
