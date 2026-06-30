# Migration Checklist

This checklist controls the Tamil Wedding Book migration. Every milestone must be small, reviewable and reversible.

## Global rules

- This is migration, not redesign.
- TWB-WEB is the frontend source of truth.
- TWB-SERVER is the backend source of truth.
- Keep legacy copies untouched once frozen.
- Do not create huge PRs.
- Do not include `node_modules`, `.next`, `dist`, `build`, generated files or duplicated large assets in review PRs.
- Do not hard-code secrets.
- Use placeholder env values only.

## Milestone 0 — Migration readiness docs

Allowed:

- `docs/migration-map.md`
- `docs/migration-checklist.md`
- `docs/parity-testing.md`

Not allowed:

- app code changes
- monorepo scaffolding
- UI migration
- backend migration
- asset copying
- route changes
- API changes

Status:

- [x] Create migration map
- [x] Create migration checklist
- [x] Create parity testing checklist
- [ ] Review docs
- [ ] Approve and merge Milestone 0 PR

Stop after this PR until approved.

## Milestone 1 — Monorepo scaffolding only

Allowed:

- root npm workspace config
- root README setup notes
- root `.gitignore` updates
- `apps/web` basic Next.js + TypeScript App Router setup
- `apps/api` basic Express setup, JS-compatible first
- `packages/shared` minimal setup
- `.env.example` files for apps/web and apps/api

Not allowed:

- no TWB-WEB UI migration
- no TWB-SERVER backend logic migration
- no asset copy
- no homepage build
- no design changes
- no API behaviour changes

Acceptance:

- [ ] Repo installs with npm
- [ ] `apps/web` can start as a blank Next.js app
- [ ] `apps/api` can start as a basic Express health check
- [ ] env examples exist with placeholders only
- [ ] no legacy UI/backend migrated yet

## Milestone 2 — Frontend shell only

Allowed:

- port global CSS loading strategy
- preserve `/assets/...` path plan
- create route skeletons matching existing route paths
- create layout shell needed for migration
- mark UI-heavy pages as client components where required

Not allowed:

- no full homepage migration yet
- no search page migration yet
- no auth logic migration yet
- no design changes

Acceptance:

- [ ] Existing route paths are mapped
- [ ] CSS/assets loading plan is documented
- [ ] No UI has been redesigned

## Milestone 3A — Homepage 1:1

Allowed:

- migrate original homepage components only
- migrate original Header/HeaderMenu
- migrate original mobile menu behaviour
- migrate original Footer
- migrate original hero/search/tools/featured sections
- connect only homepage-required API calls if needed

Must preserve:

- original class names where possible
- original CSS
- original assets
- original text
- original spacing/layout
- original desktop and mobile behaviour

Acceptance:

- [ ] Homepage matches original desktop view
- [ ] Homepage matches original mobile view
- [ ] Header dropdowns match
- [ ] Mobile menu matches
- [ ] Footer matches
- [ ] No unrelated pages migrated

## Milestone 3B — Public search/listing pages

Scope:

- search vendor
- venue listing
- supplier listing
- category listings
- filters/search result pages

Acceptance:

- [ ] routes preserved
- [ ] filters preserved
- [ ] cards preserved
- [ ] API request/response behaviour preserved
- [ ] mobile layout preserved

## Milestone 3C — Public detail pages

Scope:

- vendor detail
- venue detail
- gallery/images
- reviews if present
- enquiry/contact forms if present
- related vendors/venues if present

Acceptance:

- [ ] route paths preserved
- [ ] layout preserved
- [ ] API behaviour preserved
- [ ] forms preserve existing fields and validation

## Milestone 3D — Other public/planning pages

Scope:

- public planning pages
- dresses
- wedding website
- wedding shoots
- venue category/informational pages
- network/error/not-found pages

Acceptance:

- [ ] pages match existing TWB-WEB design
- [ ] route paths preserved
- [ ] no redesign

## Milestone 4 — Auth migration

Scope:

- AuthService
- HttpService
- login
- register
- vendor/supplier login if present
- reset password
- verify email if present
- role redirects

Must preserve:

- localStorage key `tamil-wedding-book`
- token/session behaviour
- role behaviour
- existing API contracts

Acceptance:

- [ ] login works
- [ ] register works
- [ ] logout works
- [ ] role redirects work
- [ ] protected pages behave the same

## Milestone 5 — Couple dashboard/planning tools

Suggested order:

1. My Wedding/account/wedding details
2. Checklist
3. Vendors
4. Guest list
5. Seating chart
6. Budget planner
7. Dresses/Wedding Website/Wedding Shoots

Acceptance:

- [ ] UI preserved
- [ ] data flow preserved
- [ ] forms preserved
- [ ] API behaviour preserved

## Milestone 6 — Supplier/vendor dashboard

Suggested order:

1. Dashboard
2. Create storefront and business detail
3. Location/images/videos/FAQs
4. Events/deals/menus/social links/preferred vendor
5. Reviews
6. Enquiries/export
7. Settings/invoices placeholders if only placeholders exist

Acceptance:

- [ ] dashboard UI preserved
- [ ] routes preserved
- [ ] API behaviour preserved
- [ ] upload/image handling preserved
- [ ] export behaviour preserved if present

## Milestone 7 — Backend API migration

Approach:

- copy existing JS behaviour module-by-module
- keep endpoint paths unchanged
- keep request bodies unchanged
- keep response shapes unchanged
- keep Sequelize models/migrations compatible
- add TypeScript only gradually later

Acceptance:

- [ ] API starts locally
- [ ] env variables documented
- [ ] CORS configured for migrated frontend
- [ ] auth works
- [ ] uploads/static files work
- [ ] database connection works
- [ ] no schema changes without approval

## Milestone 8 — Admin structure only

Scope:

- `/admin`
- `/admin/login`
- `/admin/dashboard`
- `/admin/suppliers`
- `/admin/venues`
- `/admin/couples`
- `/admin/enquiries`
- `/admin/reviews`
- `/admin/payments`
- `/admin/settings`

Not allowed:

- no new admin dashboard design
- no random UI
- no new design system
- no new admin features unless approved

Acceptance:

- [ ] structure exists only
- [ ] existing backend admin capability documented
- [ ] no full admin design created

## Milestone 9 — Parity testing and cutover

Validate:

- [ ] every migrated route loads
- [ ] desktop screenshots match
- [ ] mobile screenshots match
- [ ] auth role redirects work
- [ ] file uploads work
- [ ] email-generated links work
- [ ] guest invitation public flow works if present
- [ ] vendor enquiries export works if present
- [ ] no production DB used during development

## PR review rule

Every PR must list:

- files changed
- routes affected
- APIs affected
- visual parity status
- tests run
- known gaps
- next milestone
