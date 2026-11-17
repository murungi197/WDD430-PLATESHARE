# PlateShare MVP architecture decision

## Status

This is the implementation recommendation used by this branch. It is not a
claim that the team has approved a production vendor; confirm the identity
library and database hosting before deployment.

## Identity, sessions, and persistence

- **Identity/session:** Better Auth email and password authentication, using
  its server-managed sessions and secure, HTTP-only cookies. Registration does
  not automatically sign a member in; the UI confirms account creation and
  directs the member to sign in. Sign-up/sign-in rate limits are stored in
  PostgreSQL so they are shared across app instances. The MVP uses custom,
  accessible forms and does not add provider-specific/social sign-in UI.
- **Persistence:** PostgreSQL accessed through Prisma ORM. PostgreSQL gives
  the relational constraints and transaction semantics needed for member
  ownership and concurrent claims. `DATABASE_URL` must point to a persistent
  PostgreSQL service; do not use an ephemeral filesystem database for a
  deployed app.
- **Migrations:** Keep the Prisma schema and generated SQL migrations in
  version control. Apply migrations with `prisma migrate deploy` during
  deployment. The active-claim partial unique index is database-specific SQL
  in the migration and must be retained in later schema migrations.

The leading alternative is a managed identity service such as Auth.js or a
hosted identity provider, paired with PostgreSQL. Better Auth was selected
for this implementation because it provides the required email/password and
session lifecycle without committing to a social provider. PostgreSQL with
Prisma is preferred over a file-backed store because claims must be protected
across concurrent application instances. The team should confirm hosting,
email-verification policy, and operational ownership before production use.

## Authorization boundary

The client may hide or redirect protected controls for usability, but this is
not authorization. Server Actions, Route Handlers, and server-side data access
must obtain the session from Better Auth and check the member identity for
every request. Listing changes additionally require an owner check; claims
must reject the owner. Never trust a member ID supplied by the browser.

Public browse and detail data is read through a server-only data-access layer
that selects an explicit public DTO. Pickup address/instructions are not
selected or serialized for public responses. A later successful-claim
endpoint must separately authorize the listing owner or active claimant
before returning those fields.

## Initial entities and lifecycle

- **Member:** Better Auth user identity (`id`, name, unique email, verification
  state, timestamps), sessions, and credential account data. The ID is the
  stable foreign key for listing ownership and claims.
- **Listing:** owner, title, description, category, quantity label, food and
  allergen details, optional future image reference, pickup start/end, private
  pickup address/instructions, and lifecycle status
  (`AVAILABLE`, `CLAIMED`, `REMOVED`). Expiration is derived from
  `pickupEndsAt <= now`; it is not a persisted status.
- **Claim:** listing, claimant, creation/update timestamps, and state
  (`ACTIVE`, `CANCELLED`, `COMPLETED`). A listing is browsable only when its
  state is `AVAILABLE` and its pickup cutoff is in the future.

The exact category catalog, quantity units, verification requirements, and
claim cancellation policy remain product decisions. This implementation uses
a small category enum and stores quantity as a display label so it does not
assume one unit system.

## Concurrent-claim invariant

The database has a unique partial index on `Claim(listingId)` where
`status = 'ACTIVE'`. Claim creation must run in a database transaction:

1. Conditionally change the listing from `AVAILABLE` to `CLAIMED` only when
   `pickupEndsAt > now`.
2. Insert its `ACTIVE` claim in that same transaction.
3. If the conditional update affects no row, or the unique index rejects the
   insert, roll back and return an unavailable/conflict result.

The transaction prevents partially applied claim state; the partial unique
index is the persistence-boundary backstop for racing requests, including
requests reaching different app instances. Expired, claimed, and removed
listings are excluded by the public query and checked again by any future
claim mutation.

## UX and operations assumptions

- Browsing is public; registration and sign-in use email/password.
- Registration success states clearly that the member must sign in.
- Passwords are never stored by PlateShare; Better Auth stores credentials
  using its password hashing implementation.
- No email delivery provider is configured, so email verification and
  password recovery need a production decision before launch.
- Authentication secrets and the PostgreSQL connection string are deployment
  secrets and must not be committed.
