# Milestone 2 — Frontend Shell Strategy

Milestone 2 prepares `apps/web` for the future TWB-WEB migration without migrating UI, assets, homepage content, header, footer, backend logic, or route behavior.

## Route skeleton strategy

- App Router route skeletons are created to match the current TWB-WEB route paths.
- Skeleton pages render a small migration placeholder through a client component so future legacy UI-heavy pages can safely use browser-only dependencies.
- Dynamic legacy routes are represented with App Router dynamic segments, for example:
  - `/vendor-detail/:vendorId` → `vendor-detail/[vendorId]`
  - `/guest-invitation/:coupleData` → `guest-invitation/[coupleData]`
  - `/reset-password/:hash` → `reset-password/[hash]`
  - `/couple/budget-planner/:id` → `couple/budget-planner/[id]`
  - vendor enquiry details under both `/venue/enquiries/[enquiryId]` and `/supplier/enquiries/[enquiryId]`

## Layout shell strategy

- `RootLayout` stays minimal and wraps children in a migration shell only.
- Header, footer, dropdowns, mobile menu, dashboard sidebars, and visual page layouts are not migrated in this milestone.
- The shell is intentionally presentation-neutral to avoid visual redesign before legacy UI is ported.

## CSS loading strategy

- `globals.css` remains minimal.
- Legacy global CSS should be copied and loaded in a later approved milestone, preserving the original load order from TWB-WEB.
- Page/component CSS should be introduced only when the matching legacy component/page is migrated.

## Asset path strategy

- Future migrated UI should preserve legacy `/assets/...` references wherever possible.
- The legacy asset tree is not copied in Milestone 2.
- No large binary files are added in this milestone.

## Explicitly not included

- No homepage migration.
- No TWB-WEB component migration.
- No header/footer migration.
- No search/listing page migration.
- No backend migration.
- No admin dashboard design.
