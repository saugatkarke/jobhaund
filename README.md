# JobHaund — payment website

Standalone Next.js site for accounts and Paddle Pro checkout. One Pro plan covers the Indeed and Seek Chrome extensions. They later call `GET /api/me/entitlement`.

## Local

```bash
cp .env.example .env.local
# set DATABASE_URL, BETTER_AUTH_SECRET (`openssl rand -base64 32`), and Paddle ids when you have them
npx drizzle-kit push
npm run dev
```

- `/` and `/pricing` render without a database
- Sign up / login / checkout need Postgres + Better Auth secret
- Without `RESEND_API_KEY`, magic-link and reset URLs print to the server log

## Tests

```bash
npm test
```
