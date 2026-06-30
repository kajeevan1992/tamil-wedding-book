# Tamil Wedding Book Migration Map

Milestone 0 purpose: document the current project before any code migration.

This repository will be treated as the fresh migration workspace for Tamil Wedding Book. The existing TWB-WEB frontend and TWB-SERVER backend are the source of truth.

## Source of truth

- Frontend source of truth: TWB-WEB
- Backend source of truth: TWB-SERVER
- Original deployed visual reference: TWB-WEB live site
- Migration target: new monorepo structure to be created after approval

## Approved stack decisions

- Package manager: npm
- Frontend: Next.js with TypeScript
- Router: Next.js App Router
- Backend: Node/Express, preserving existing JavaScript behaviour first
- Backend TypeScript: gradual later, after behaviour parity
- Database for development: new migration/testing PostgreSQL database
- Styling: preserve current CSS, classes, Bootstrap-style layout and assets first
- Admin: structure only later, no new admin dashboard design during migration

## Non-negotiable preservation rules

For existing pages and behaviour, do not change:

- UI
- layout
- colours
- fonts
- spacing
- wording
- images
- icons
- buttons
- cards
- header
- dropdowns
- footer
- links
- route paths
- mobile layout
- user flow
- backend API request/response behaviour
- database schema
- auth behaviour

This is migration, not redesign.

## Planned monorepo structure

```text
legacy/twb-web
legacy/twb-server
apps/web
apps/api
packages/shared
```

The `legacy` folders must remain untouched as comparison references.

## Frontend route inventory to confirm from TWB-WEB

Known important routes from previous TWB-WEB review:

```text
/
/search-vendor
/vendor-detail/:vendorId
/check-list
/guest-list
/seating-chart
/budget-planner
/vendors
/dresses
/wedding-website
/wedding-shoots
/venues/barn-weddings
```

Additional routes must be confirmed from the current TWB-WEB router before migration, including:

- login routes
- register routes
- reset password routes
- couple dashboard routes
- supplier/vendor dashboard routes
- venue category routes
- supplier category routes
- error routes
- public detail routes

## Frontend component inventory to confirm from TWB-WEB

Known important homepage/global components:

- Layout
- Header
- HeaderMenu
- mobile menu
- Home
- HomeScreenSlider
- HomeSliderContent
- GlobalSearch
- popular searches
- HomePageToolsSection
- featured venues section
- featured vendors section
- real wedding section
- Footer

Other components to inventory before migration:

- search/listing cards
- filters
- vendor/venue detail components
- auth forms
- couple planning tool components
- supplier/vendor dashboard components
- modals
- shared form controls
- shared helpers/utilities
- Redux/store files if used
- service files such as HttpService and AuthService

## Backend API inventory to confirm from TWB-SERVER

Before backend migration, document all existing endpoints and keep their contracts unchanged.

Required groups to inventory:

- auth endpoints
- user/couple endpoints
- supplier/vendor endpoints
- venue endpoints
- category endpoints
- search/filter endpoints
- enquiry endpoints
- review endpoints
- image/upload endpoints
- email/mailer endpoints
- dashboard endpoints
- payment/invoice endpoints if present
- admin-related endpoints if present

For each endpoint, capture:

```text
method
path
request body/query params
response shape
auth requirement
role requirement
frontend pages using it
```

## Auth/session map to confirm

Known rule:

- Preserve localStorage key: `tamil-wedding-book`
- Preserve role redirect behaviour
- Preserve existing token/session handling unless a technical Next.js compatibility change is required

To confirm:

- token storage format
- user object structure
- role names
- protected route behaviour
- login redirects
- logout behaviour
- register flow
- reset password flow
- email verification flow if present

## Database/model inventory to confirm

Before migrating backend logic, document all existing Sequelize models and database relationships.

Required to confirm:

- user model
- role model if present
- supplier/vendor model
- venue model
- category model
- enquiry model
- review model
- image/upload model
- couple planning models
- checklist model
- guest list model
- seating chart model
- budget planner model
- invoice/payment models if present

Do not change schema without approval.

## Environment variables to confirm

Create real `.env.example` files only during the scaffold/backend setup milestone.

Expected env categories:

- API URL
- frontend/client URL
- database URL or DB host/name/user/password
- JWT secret
- CryptoJS key
- Google Maps key if used
- mailer SMTP host/user/password/from address
- upload/static file paths
- server port
- CORS allowed origins
- any existing TWB-SERVER env values

No real secrets should be committed.

## Visual parity priority

1. Homepage desktop and mobile
2. Header, dropdowns and mobile menu
3. Footer
4. Search/listing pages
5. Vendor/venue detail pages
6. Auth pages
7. Couple planning pages
8. Supplier/vendor dashboard pages

Homepage must pass visual parity before moving to the next UI migration milestone.

## Admin scope

Admin dashboard is not currently designed or completed.

Do not build a new admin dashboard during migration.

Later, only prepare structure such as:

```text
/admin
/admin/login
/admin/dashboard
/admin/suppliers
/admin/venues
/admin/couples
/admin/enquiries
/admin/reviews
/admin/payments
/admin/settings
```

No admin UI design should be created without approval.

## Stop condition

After this Milestone 0 documentation PR is created, stop and wait for approval before creating scaffold, migrating UI, migrating backend, or copying assets.
