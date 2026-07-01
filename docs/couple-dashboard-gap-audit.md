# Milestone 3F-0: Couple dashboard gap audit and completion plan

## 1. Overall dashboard completion estimate

**Current estimated completion: 22% frontend parity / 0% backend parity.**

Milestone 3F replaced the `/couple/*` App Router placeholders with a visible, navigable couple dashboard shell and static/fallback content. This is useful as a frontend route baseline, but it is **not yet a 1:1 migration** of the legacy couple dashboard. The legacy dashboard is API-driven and contains many interactive components, modals, filters, drag/drop areas, upload flows, charts, PDF/export features and account/profile workflows that are currently represented only by simple static tables/cards/forms.

The most important gap is that Milestone 3F intentionally avoided backend/auth/session persistence. That means every route currently uses safe fallback data and does not load or save real couple data.

## Audit sources

This audit compares the migrated Next.js files against these legacy source areas:

- `legacy/twb-web/src/router/CoupleRoutes.js`
- `legacy/twb-web/src/views/dashboard/Layout.js`
- `legacy/twb-web/src/views/dashboard/couple/Layout.js`
- `legacy/twb-web/src/components/couple/**`
- `legacy/twb-web/src/views/dashboard/couple/pages/**`
- `legacy/twb-web/src/views/dashboard/couple/account/**`
- `legacy/twb-web/src/services/CoupleService.js`
- Current migrated files under `apps/web/src/legacy/components/couple-dashboard/**`

## 2. Page-by-page gap list

### `/couple` — My Wedding dashboard

**Estimated completion: 25%**

**Migrated correctly**
- Route is wired to the couple dashboard client.
- Header/Footer and top couple navigation are visible.
- A simplified dashboard banner exists with couple names, wedding date, stats cards and legacy class names such as `slider-wrap`, `dash-hero-wrapper`, `dash-coverTopSection`, `dash-summary`, and `dash-summary-wedsite`.

**Missing visually**
- Real `Banner` layout depth is incomplete.
- User avatar rendering is simplified; legacy `UserAvatar` and real photo handling are absent.
- Legacy countdown timer is absent.
- Legacy circular progress bars are represented by simple circular bordered text.
- Wedding card image/photo cropper state is not represented accurately.
- Share wedding modal and edit profile modal are not rendered.

**Missing functionally**
- No `loadWeddingData(coupleId)` call.
- No wedding stats API loading.
- No change wedding card photo upload.
- No image cropper.
- No share wedding modal.
- No banner edit modal.
- No last-step modal for incomplete couple profiles.

**Static/fallback only**
- Couple names, date, dashboard stats and image are hard-coded in `coupleDashboardData.js`.

**Frontend interaction only needed next**
- Open/close modal shells for edit profile and share wedding.
- Local preview state for banner image before backend integration.
- Client-only countdown display using fallback date.

**Backend/API later**
- `GET /api/couple/account/wedding-details/:coupleId`
- `POST /api/couple/account/update-profile-and-wedding-detail`
- `POST /api/couple/account/update-wedding-card-photo`
- Wedding stats currently loaded by legacy `loadWeddingData`.

**Recommended next milestone**
- 3F-6 Account/settings/notifications frontend polish, then dashboard banner polish.

---

### `/couple/account`

**Estimated completion: 15%**

**Migrated correctly**
- Route is wired.
- Account sidebar-style links exist.
- A basic account form exists.

**Missing visually**
- Legacy page only shows `Settings` heading with `CoupleAccountSidebar`; migrated form goes beyond the very small legacy `Information.js` view.
- Sidebar active styling is not complete.

**Missing functionally**
- No profile load.
- No account update.
- No linked account state.

**Static/fallback only**
- Name, partner and location values are fallback strings.

**Frontend interaction only needed next**
- Preserve exact legacy sidebar styling.
- Decide whether `/couple/account` should remain as minimal as legacy or be aligned with settings page after approval.

**Backend/API later**
- Couple account/wedding detail endpoints.

**Recommended next milestone**
- 3F-6 Account/settings/notifications frontend polish.

---

### `/couple/account/settings`

**Estimated completion: 10%**

**Migrated correctly**
- Route is wired.
- Basic settings form shell exists.

**Missing visually**
- Legacy `Settings.js` is a much larger page with account sidebar, linked account section, email/password/social sign-in sections, account deletion warning copy and more detailed layout.
- `CoupleLinkAccount` is not migrated.
- `SocialSignin` usage is missing.

**Missing functionally**
- Link account invite/remove/accept behavior missing.
- Settings save/delete account flows missing.
- Social sign-in placeholders missing from this page.

**Static/fallback only**
- All field values.

**Frontend interaction only needed next**
- Recreate `Settings.js` markup exactly from legacy.
- Add frontend-only link account modal shells.

**Backend/API later**
- `POST /api/couple/account/link-account-invitation`
- `POST /api/couple/account/remove-linked-account`
- `POST /api/couple/account/accept-linking-account-invitation`
- profile/settings update endpoints.

**Recommended next milestone**
- 3F-6 Account/settings/notifications frontend polish.

---

### `/couple/account/notifications`

**Estimated completion: 20%**

**Migrated correctly**
- Route is wired.
- Basic notifications list exists.

**Missing visually**
- Legacy notification page is minimal but uses account sidebar and legacy spacing; current list is generic Bootstrap.

**Missing functionally**
- No real notification loading.
- No read/unread or notification preferences handling.

**Static/fallback only**
- All notifications.

**Frontend interaction only needed next**
- Exact sidebar and list styling.

**Backend/API later**
- `GET /api/user/notifications` or equivalent notification endpoint.

**Recommended next milestone**
- 3F-6 Account/settings/notifications frontend polish.

---

### `/couple/check-list`

**Estimated completion: 48% after Milestone 3F-1**

**Migrated correctly**
- Route is wired.
- Checklist now uses local React state for fallback tasks.
- Tasks are grouped by timeline/category and show due timing, status and progress.
- Add, edit, delete and complete/incomplete interactions are available without backend persistence.

**Missing visually**
- Legacy checklist has a complex responsive layout with filters, month/timeline groupings, cards, status controls, costs and download/add/filter buttons.
- `ChecklistFilters`, `ChecklistFiltersModal`, and `ChecklistAddUpdateModal` are not migrated.
- Mobile filter button and legacy card styling are missing.

**Missing functionally**
- No `loadChecklists(coupleId)`.
- No backend-backed filter data by category/status/cost.
- No exact legacy add/edit modal parity yet; current add/edit form is local-state only.
- No persisted task completion updates.
- No persisted delete behavior.
- No saved currency formatting rules from backend data.

**Static/fallback only**
- All checklist rows and every add/edit/delete/status change remain frontend-only fallback state.

**Frontend interaction only needed next**
- Exact legacy filter modal polish.
- Exact legacy add/update modal polish.
- Any remaining currency/cost formatting and mobile card parity once reviewed.

**Backend/API later**
- `GET /api/couple/checklist/load-checklists/:coupleId`
- `POST /api/couple/checklist/create-update-checklist`
- `POST /api/couple/checklist/change-checklist-status`
- Possible delete endpoint mismatch noted in prior migration audit.

**Recommended next milestone**
- 3F-2 Guest list interactive frontend, unless 3F-1 checklist polish is requested after review.

---

### `/couple/guest-list`

**Estimated completion: 15%**

**Migrated correctly**
- Route is wired.
- Basic guest table exists.
- Add Guest and Invite By Link buttons exist visually.

**Missing visually**
- Legacy page includes event cards/stats, guest filters, guest grouping, companions, selected event state, upload-by-spreadsheet modal and invite-by-link modal.
- `GuestListEvents`, `GuestListGuests`, filters and guest modals are not migrated.

**Missing functionally**
- No `loadGuestsData(coupleId)`.
- No event selection.
- No event creation/edit/delete.
- No guest creation/edit/delete.
- No companions.
- No bulk actions.
- No RSVP link generation.
- No spreadsheet import.

**Static/fallback only**
- All guests and statuses.

**Frontend interaction only needed next**
- Local event selection.
- Add/edit guest modal with local state.
- Local filters and bulk selection.
- Invite link modal shell.
- Spreadsheet upload shell.

**Backend/API later**
- `GET /api/couple/guests/load-guests/:coupleId`
- guest/event create/update/delete endpoints.
- bulk spreadsheet endpoint.
- invite-by-link endpoint.

**Recommended next milestone**
- 3F-2 Guest list interactive frontend.

---

### `/couple/seating-chart`

**Estimated completion: 8%**

**Migrated correctly**
- Route is wired.
- Page contains a sidebar-like panel and a chart area placeholder.

**Missing visually**
- Legacy page is a large drag/drop seating chart application with `SCHeader`, `SCSidebar`, `Controls`, `SCWindow`, `Tables`, `SCTable`, custom CSS and a canvas-like chart area.
- Current implementation is a simple static card and circle.

**Missing functionally**
- No event loading.
- No table creation/deletion.
- No guest seat assignment/unseating.
- No drag/drop or move mode.
- No zoom/pan/export/PDF behavior.
- No chair highlighting or guest search.

**Static/fallback only**
- Entire seating chart.

**Frontend interaction only needed next**
- Static visual shell for `SCHeader`, `SCSidebar`, `Controls`, table/chair components.
- Client-only drag/drop with local state before backend persistence.

**Backend/API later**
- `GET /api/couple/seating-chart/load-wedding-events/:coupleId`
- `GET /api/couple/seating-chart/load-event-tables-and-guests/:eventId`
- `POST /api/couple/seating-chart/set-table-position`
- `POST /api/couple/seating-chart/set-guest-seat`
- `POST /api/couple/seating-chart/un-seat-guest`
- `DELETE /api/couple/seating-chart/delete-table/:eventId/:tableId`
- `POST /api/couple/seating-chart/change-window-height`

**Recommended next milestone**
- 3F-4 Seating chart drag/drop frontend.

---

### `/couple/budget-planner`

**Estimated completion: 18%**

**Migrated correctly**
- Route is wired.
- Budget category cards exist.
- Link to category route exists.

**Missing visually**
- Legacy budget planner includes dedicated sidebar, header, stats header, charts, payment lists, category action modal and custom CSS.
- Pie/doughnut chart is missing.
- Budget totals and remaining/paid metrics are missing.

**Missing functionally**
- No `loadBudgetPlanner(coupleId)`.
- No add/edit/delete category modal.
- No PDF export.
- No expense/payment state.

**Static/fallback only**
- All categories and totals.

**Frontend interaction only needed next**
- Category modal with local state.
- Totals calculation from local data.
- Stats cards/charts from local data.

**Backend/API later**
- `GET /api/couple/budget-planner/load/:coupleId`
- category/expense/payment create-update/delete endpoints.

**Recommended next milestone**
- 3F-3 Budget planner interactive frontend.

---

### `/couple/budget-planner/[id]`

**Estimated completion: 12%**

**Migrated correctly**
- Dynamic route is wired.
- Basic category view reuses budget cards.

**Missing visually**
- Legacy category page has `CategoryHeader`, inline expense rows, payment dropdowns, notes modal and expense payment modal.

**Missing functionally**
- No selected category from URL.
- No expense add/edit/delete.
- No payment add/edit/delete.
- No note modal.
- No totals by category.

**Static/fallback only**
- Entire category content.

**Frontend interaction only needed next**
- Local selected category routing.
- Expense/payment modal shells.
- Local calculations.

**Backend/API later**
- Budget category/expense/payment endpoints.

**Recommended next milestone**
- 3F-3 Budget planner interactive frontend.

---

### `/couple/vendors`

**Estimated completion: 18%**

**Migrated correctly**
- Route is wired.
- Basic vendor cards and search button exist.

**Missing visually**
- Legacy `Vendors.js` groups supplier categories, shows selected vendors/cards, cover images and a search modal.
- `SearchVendorModal` is not migrated.
- Vendor category cards and placeholder/cover-image behavior are simplified.

**Missing functionally**
- No `loadSuppliers(coupleId)`.
- No add vendor modal.
- No selected vendor state.
- No supplier category logic.

**Static/fallback only**
- All vendor cards.

**Frontend interaction only needed next**
- Search/add vendor modal shell.
- Local selected vendor state.
- Category grouping UI.

**Backend/API later**
- `GET /api/couple/suppliers/load-suppliers/:coupleId`
- `GET /api/couple/suppliers/load-vendors/:coupleId/:vendorCategoryId`
- supplier search/store/select/remove endpoints.

**Recommended next milestone**
- 3F-5 Couple vendors/saved vendors frontend.

---

### `/couple/vendors/search`

**Estimated completion: 12%**

**Migrated correctly**
- Route is wired.
- Search title and vendor cards exist.

**Missing visually**
- Legacy `VendorsFilters.js` includes category/status filters, `react-select` controls and `FilteredVendors` cards.
- Query param handling is missing.

**Missing functionally**
- No category filter state.
- No results status filter.
- No add/search vendor modal.
- No `loadSuppliers` call.

**Static/fallback only**
- Search results.

**Frontend interaction only needed next**
- Local filter controls.
- Preserve query param initialization.
- Filtered vendors cards.

**Backend/API later**
- Couple suppliers/vendor search endpoints.

**Recommended next milestone**
- 3F-5 Couple vendors/saved vendors frontend.

---

### `/couple/dresses`

**Estimated completion: 20%**

**Migrated correctly**
- Route is wired.
- Saved dresses empty state and category column are represented.
- Legacy dashboard nav image is used.

**Missing visually**
- Legacy `Dresses.js` is a large static page with many top category tabs and multiple category links.
- Current version includes only a small subset.

**Missing functionally**
- Legacy page is mostly static/empty-state, so backend dependency appears low.
- Missing category tab switching if needed.

**Static/fallback only**
- Entire page.

**Frontend interaction only needed next**
- Complete all static tabs/categories from legacy.

**Backend/API later**
- Saved dresses persistence if later required; not clearly present in current backend audit.

**Recommended next milestone**
- 3F-6 Account/settings/notifications frontend polish or a small static completion pass.

---

### `/couple/wedding-website`

**Estimated completion: 45%**

**Migrated correctly**
- Route is wired.
- Legacy static form and image layout are closely represented.
- Main wording and button are present.

**Missing visually**
- Minor spacing/responsive differences may remain.

**Missing functionally**
- No real create website flow.
- No template selection route.
- No validation.

**Static/fallback only**
- Entire page.

**Frontend interaction only needed next**
- Local form validation and disabled/pending create flow.

**Backend/API later**
- Wedding website creation/publishing endpoints are not yet mapped in migrated API scope.

**Recommended next milestone**
- 3F-6 or later wedding website-specific polish.

---

### `/couple/web-shoots`

**Estimated completion: 30%**

**Migrated correctly**
- Route is wired.
- Hero section, app store images and first feature cards are represented.
- WebShoots imagery assets are copied.

**Missing visually**
- Legacy `WebShoots.js` is long and includes background image collage, multiple cards, FAQ-like sections and more app promotional sections.
- Current page only migrates the first major sections.

**Missing functionally**
- Legacy page is mostly static marketing UI; no obvious backend logic in the page itself.

**Static/fallback only**
- Entire page.

**Frontend interaction only needed next**
- Complete remaining static sections from legacy.

**Backend/API later**
- None obvious from current legacy page; future album features would need separate API mapping.

**Recommended next milestone**
- Static completion pass after critical tool pages.

## 3. Priority order to finish the dashboard

1. **Checklist** — manageable feature size, high user value, good candidate for local-state interactivity first.
2. **Guest list** — larger than checklist, but required before seating chart can feel complete.
3. **Budget planner** — important and moderately complex; can be done with local calculations before API integration.
4. **Seating chart** — highest frontend complexity; should follow guest list because it depends on guest/event concepts.
5. **Couple vendors/saved vendors** — depends on search/listing and supplier category structures.
6. **Account/settings/notifications/dashboard banner polish** — important for parity, but lower risk than planning tools.
7. **Dresses / Wedding Website / WebShoots static completion** — mostly static polish after core dashboard tools.

## 4. Recommended small milestones

### 3F-1 Checklist interactive frontend
- Port `ChecklistFilters`, `ChecklistFiltersModal`, and `ChecklistAddUpdateModal` as client-only components.
- Use local fallback checklist data.
- Implement local filtering, add/edit, status toggle and grouped timeline cards.
- Keep backend writes disabled.

### 3F-2 Guest list interactive frontend
- Port event cards, guest table/list, filters and modal shells.
- Use local events/guests/companions data.
- Implement local event selection, add/edit guest modal, invite-link modal and upload modal shell.
- Keep backend writes disabled.

### 3F-3 Budget planner interactive frontend
- Port budget sidebar, header, stats header, category cards and category detail layout.
- Use local budget/category/expense/payment data.
- Implement local category/expense/payment modals and totals calculations.
- Keep backend writes disabled.

### 3F-4 Seating chart drag/drop frontend
- Port `SCHeader`, `SCSidebar`, `Controls`, `SCWindow`, table/chair visual components and seating chart CSS.
- Use local event/table/guest data.
- Implement client-only drag/drop/table positioning and seating state without backend persistence.

### 3F-5 Couple vendors/saved vendors frontend
- Port supplier category cards, selected vendor cards, `SearchVendorModal`, filtered vendors and search filter controls.
- Use local supplier/category/vendor data.
- Implement local add/remove/select vendor behavior.

### 3F-6 Account/settings/notifications frontend polish
- Port full `Settings.js` markup, `CoupleLinkAccount`, social sign-in section and account deletion copy.
- Complete notification list styling.
- Polish dashboard banner modal shells and local image preview.

## 5. Backend/API work to defer until later

Do **not** implement these in frontend completion milestones unless explicitly approved:

- Real auth/session/JWT/cookie enforcement.
- Real couple profile loading.
- Real checklist persistence.
- Real guest/event/companion persistence.
- Real seating chart table/seat persistence.
- Real budget category/expense/payment persistence.
- Real supplier search/selection persistence.
- Real notifications read/update behavior.
- Real file/image uploads.
- Real PDF/export generation tied to backend data.

### Deferred endpoint families

- `/api/auth/profile`
- `/api/user/notifications`
- `/api/couple/account/*`
- `/api/couple/checklist/*`
- `/api/couple/guests/*`
- `/api/couple/seating-chart/*`
- `/api/couple/budget-planner/*`
- `/api/couple/suppliers/*`

## Routing decision notes

- All requested `/couple/*` routes exist in the migrated App Router tree.
- `/couple/web-shoots` matches the legacy couple route spelling.
- Public `/wedding-shoots` is separate and already handled by public planning pages.
- No supplier, venue or admin dashboard routes were audited or changed in this milestone.

## 3F-1 implementation note

Milestone 3F-1 upgrades `/couple/check-list` from a purely static table to a client-side interactive checklist using fallback data only. It should improve the checklist estimate, but backend parity remains deferred because no API loading/saving is connected yet.

Expected remaining gaps after 3F-1:

- API-backed `loadChecklists(coupleId)` remains deferred.
- Saved status changes remain deferred.
- Backend-backed custom task add/edit/delete remains deferred.
- Wedding-date synchronized due-date calculations remain deferred.
- Exact legacy filter modal and add/update modal parity may still require a polish pass after the local-state version is reviewed.
