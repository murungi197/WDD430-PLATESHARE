# PlateShare

PlateShare is a community food-sharing app built with the Next.js App Router.
The current MVP implements email/password member accounts and public
available-food browsing. See [the architecture decision](./docs/architecture.md)
for the identity, persistence, authorization, privacy, and claim-concurrency
recommendation.

## Local development

1. Copy `.env.example` to `.env` if you do not already have a local environment
   file. Generate a development secret with:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Set the result as `BETTER_AUTH_SECRET` in `.env`.
2. Start the local PostgreSQL service:

   ```powershell
   docker compose up -d db
   ```
3. From the `plateshare` directory, install dependencies, generate Prisma
   Client, and apply the initial migration:

   ```powershell
   npm install
   npm run db:generate
   npm run db:migrate -- --name initial
   npm run dev
   ```

   Open `http://localhost:3000`. Browsing is public; account registration
   reports success and then asks the new member to sign in.

For production, set `DATABASE_URL`, `BETTER_AUTH_URL`, and a unique
`BETTER_AUTH_SECRET` in the deployment environment, then run `npm run db:deploy`
as a migration step. Do not use the development credentials from `.env.example`
in a deployed environment.

## Validation

From `plateshare`, run:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```
