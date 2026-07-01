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

**Estimated completion: 45% after Milestone 3F-2**

**Migrated correctly**
- Route is wired.
- Guest list now follows the legacy event overview/detail structure with event cards and stats.
- Guests render in a legacy-style table grouped by Group/Menu/Seating Chart/Attendance/List filters.
- Add/edit/delete/status/list/menu/table changes work with local React state only.
- Invite-by-link and spreadsheet import modal shells are represented without backend calls.

**Missing visually**
- Exact `GuestListEvents`, `GuestListGuests`, `WeddingGuestModal`, `WeddingEventModal`, `WeddingEventItemModal`, `ChangeGuestItemModal`, `InviteByLink` and `UploadBySpreadsheet` component boundaries are not fully split out yet.
- Companion row rendering and some dropdown/select polish still need closer parity.
- Full social-share buttons and real spreadsheet upload styling are deferred.

**Missing functionally**
- No `loadGuestsData(coupleId)`.
- No persisted event creation/edit/delete.
- No persisted guest creation/edit/delete.
- No companion add/remove flows.
- Bulk delete is local state only; backend bulk actions are deferred.
- No real RSVP link generation.
- No real spreadsheet import.

**Static/fallback only**
- All events, guests, statuses, menus, lists, groups, tables and invite link values are fallback data.
- All add/edit/delete/status changes remain frontend-only local state.

**Frontend interaction only needed next**
- Split the inline local-state implementation into legacy-named components.
- Add local companion row support.
- Add local event/item modal shells if requested before backend integration.
- Polish exact react-select parity after option data is available.

**Backend/API later**
- `GET /api/couple/guests/load-guests/:coupleId`
- guest/event create/update/delete endpoints.
- bulk spreadsheet endpoint.
- invite-by-link endpoint.

**Recommended next milestone**
- 3F-3 Budget planner interactive frontend, unless 3F-2 guest-list polish is requested after review.

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

**Estimated completion: 50% after Milestone 3F-3**

**Migrated correctly**
- Route is wired.
- Budget planner now follows the legacy sidebar/header/stats/category route structure.
- Overview totals, paid/pending totals and category breakdowns calculate from fallback data.
- Category detail pages render legacy-style expense rows with estimated/final/paid/note/action columns.
- Add/edit/delete expense and payment paid/pending changes are local React state only.

**Missing visually**
- Exact component boundaries for `Sidebar`, `Header`, `StatsHeader`, `Stats`, `Category`, `Payments`, `CategoryActionModal`, `ExpensePaymentModal` and note modal are not fully split out yet.
- Pie/doughnut chart is represented by a legacy-style progress breakdown rather than the exact chart library.
- Exact note modal and PDF export output remain deferred.

**Missing functionally**
- No `loadBudgetPlanner(coupleId)`.
- Category, expense and payment changes are not persisted.
- PDF export button is visual only.
- Expense note modal is not fully implemented.
- Supplier/vendor sync is not connected.

**Static/fallback only**
- All categories, expenses, payments and totals are fallback data.
- All add/edit/delete/paid-pending changes remain frontend-only local state.

**Frontend interaction only needed next**
- Split inline local-state implementation into legacy-named components if more parity is requested.
- Add exact note modal behaviour.
- Replace progress breakdown with exact chart component when client-only chart dependencies are ready.

**Backend/API later**
- `GET /api/couple/budget-planner/load/:coupleId`
- category/expense/payment create-update/delete endpoints.

**Recommended next milestone**
- 3F-4 Seating chart drag/drop frontend, unless 3F-3 budget-planner polish is requested after review.

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
- 3F-4 Seating chart drag/drop frontend, unless 3F-3 budget-planner polish is requested after review.

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

## PR #12 legacy checklist audit addendum

### 1. Exact legacy files/components used as the source

- `legacy/twb-web/src/router/CoupleRoutes.js` wires the legacy dashboard route `check-list` to the couple `Checklist` page.
- `legacy/twb-web/src/views/dashboard/couple/pages/Checklist.js` is the primary source of truth for the authenticated couple checklist page layout, state shape, filtering, progress, task grouping, add/edit modal triggers and status toggle behaviour.
- `legacy/twb-web/src/components/couple/checklist/Filters.js` is the source for the Results, Status, By date and By Category filter sidebar markup.
- `legacy/twb-web/src/components/couple/checklist/FiltersModal.js` is the source for the mobile filter modal structure and wording.
- `legacy/twb-web/src/components/couple/checklist/ChecklistAddUpdateModal.js` is the source for the Add new task/Edit task modal wording, task title/description inputs, category/date selectors and submit button structure.
- `legacy/twb-web/src/services/CoupleService.js` defines the future backend API call shape for loading checklists, creating/updating checklist rows, changing checklist status and deleting checklist rows.

### 2. Original checklist UI migrated more directly in PR #12

- The page now follows the legacy `container spacer` two-column structure with a left filter column and right checklist content column.
- The filter area now follows the legacy Results, Status, By date and By Category sections, including result filter pills and the `active-filter`, `timeline`, `timeline-title`, `fn-grey`, `text-success` and `text-warning` class patterns.
- The checklist progress copy now follows the legacy wording: `You Have Completed X out of Y Tasks`.
- The Add new task entry now uses the legacy `card mt-3 bg-light-grey`, `card-body c-p p-095-09`, `bi bi-plus-circle plus-icon fs-32px` and `Add new task` structure.
- Task groups now use the legacy date/timeline grouping and `tamil-task-operational-parent` class pattern.
- Individual task rows now use the legacy `list-group-item tamil-task-operational`, `done`/`to-do`, `task-icon-bg`, `task-title` and `badge badge-light text-muted fn-10` class patterns.
- Add/edit and mobile filter overlays now use the legacy modal IDs, titles and button wording while staying frontend-only.

### 3. Parts newly created in PR #12

- The current task data is fallback/static data in `apps/web/src/legacy/data/coupleDashboardData.js`, shaped to resemble the legacy checklist objects enough for frontend rendering.
- The current add/edit/delete/complete/filter behaviour is local React state only.
- The current date text uses static fallback labels instead of calculating against a saved wedding date.
- The current modal controls use native `<select>` fields instead of the legacy `react-select` controls because backend-provided category/filter option data is not connected yet.

### 4. Original behaviours still missing

- `loadChecklists(coupleId)` is not connected.
- `createUpdateChecklist(checklist)` is not connected.
- `changeChecklistStatus(checklist)` is not connected.
- Delete persistence is not connected, and the legacy delete endpoint mismatch still needs backend review.
- Wedding-date-based date labels from `subtractAndformatDate`/`formatDate` are not connected because real couple profile data is not available in this frontend-only milestone.
- The full supplier/vendor and budget-planner sections inside the legacy add/update modal are not migrated yet because they depend on backend-loaded vendors, categories and budget planner data.
- Toast/loading/validation message behaviours are not connected because Redux, backend responses and validation responses are deferred.

### 5. Migration vs replacement assessment

- The first PR #12 version was closer to a recreated frontend replacement because it used a new card/sidebar structure and new wording.
- This updated version is closer to a migration because it reuses the legacy page layout, filter/sidebar structure, progress wording, add-task card, grouped task list classes and modal wording from the original checklist implementation.
- It is still not a complete 1:1 migration because data loading/saving, backend-backed modal options and some modal sub-sections remain deferred by the frontend-only milestone boundary.

### 6. Changes still needed to make it closer to legacy

- Migrate the legacy `ChecklistFilters`, `ChecklistFiltersModal` and `ChecklistAddUpdateModal` components as separate components instead of keeping them inline once their dependencies are available in the migrated app.
- Reintroduce `react-select`-based category/date/vendor/expense selectors when backend option data is ready.
- Reconnect wedding-date-based due labels when real couple profile/auth state is available.
- Reconnect checklist load/create/update/status/delete APIs in the later backend/auth integration milestone.
- Reintroduce backend validation, toast and loading behaviours after Redux/auth/backend integration is approved.

## 3F-2 guest list legacy audit addendum

### 1. Exact legacy files/components used as the source

- `legacy/twb-web/src/router/CoupleRoutes.js` wires `/couple/guest-list` to the legacy couple `GuestList` page.
- `legacy/twb-web/src/views/dashboard/couple/pages/GuestList.js` is the primary source for selected event state, event stats, guest list data loading and child component wiring.
- `legacy/twb-web/src/components/couple/guest-list/Events.js` is the source for the event overview cards, selected event summary, guest/list/table stats and event action buttons.
- `legacy/twb-web/src/components/couple/guest-list/Guests.js` is the source for search, Add Guest, filter nav, select-all, grouped guest table, RSVP/menu/list/table controls and row actions.
- `legacy/twb-web/src/components/couple/guest-list/Filters.js` is the source for Group/Menu/Seating Chart/Attendance/Lists filter tabs.
- `legacy/twb-web/src/components/couple/guest-list/WeddingGuestModal.js` is the source for Add/Edit Guest, Invite by link and Import spreadsheet modal tabs.
- `legacy/twb-web/src/components/couple/guest-list/InviteByLink.js` and `UploadBySpreadsheet.js` are the sources for the invite-link and spreadsheet shell content.
- `legacy/twb-web/src/services/CoupleService.js` defines the deferred backend API shape for loading guests, adding/updating/deleting guests, changing guest event status, bulk actions, spreadsheet import and guest invitation by link.

### 2. Parts migrated close to 1:1

- The page now uses the legacy `container spacer` layout, event overview cards and selected-event summary sections.
- Event stats follow the legacy Guests/Confirmed/Pending/Declined wording and class patterns.
- The guest management area follows the legacy search + Add Guest header, filter nav, select-all controls and grouped table structure.
- Guest table rows retain the legacy columns for Attendance, Menu, List and Table plus row Edit/Delete actions.
- The Add/Edit Guest modal preserves the legacy modal ID, tab labels, `Guest Name`, contact field wording, invite-by-link copy and spreadsheet import wording.

### 3. Newly created/local-state-only pieces

- Fallback wedding event, group, menu, list, table and guest records live in `apps/web/src/legacy/data/coupleDashboardData.js`.
- Guest add/edit/delete, RSVP/status changes, selected event, filters and selected rows are handled in local React state only.
- Native `<select>` controls stand in for legacy `react-select` controls until real backend-loaded option data is connected.

### 4. Original behaviours still missing

- Real `loadGuestsData(coupleId)` loading and encrypted invite-link generation are not connected.
- Event creation/edit/delete and event item creation/edit/delete are not persisted.
- Companion rows and companion actions are not fully migrated.
- Bulk actions, table capacity checks, spreadsheet upload, social sharing, validation, toast and loading behaviours remain deferred.

### 5. Backend/API gaps deferred

- `GET /api/couple/guests/load-guests/:coupleId`
- `POST /api/couple/guests/create-update-event`
- `POST /api/couple/guests/delete-event/:eventId`
- `POST /api/couple/guests/create-update-item`
- `POST /api/couple/guests/add-guest`
- `POST /api/couple/guests/update-guest`
- `DELETE /api/couple/guests/delete-guest-with-companions/:id`
- `POST /api/couple/guests/action-on-multiple-guests`
- `POST /api/couple/guests/change-guest-event-status`
- `POST /api/couple/guests/bulk-create-by-spreadsheet`
- `POST /api/couple/guests/add-guest-by-link`

## 3F-3 budget planner legacy audit addendum

### 1. Exact legacy budget planner files used

- `legacy/twb-web/src/views/dashboard/couple/pages/BudgetPlanner.js` is the primary layout/controller source for `/couple/budget-planner` and `/couple/budget-planner/:id`.
- `legacy/twb-web/src/components/couple/budget-planner/Sidebar.js` is the source for the Categories sidebar and Stats/category navigation.
- `legacy/twb-web/src/components/couple/budget-planner/Header.js` is the source for the Budget Planner/Payments tabs and PDF button.
- `legacy/twb-web/src/components/couple/budget-planner/StatsHeader.js` and `legacy/twb-web/src/views/dashboard/couple/pages/budget-planner/Stats.js` are the sources for overview totals and category breakdown/chart behaviour.
- `legacy/twb-web/src/views/dashboard/couple/pages/budget-planner/Category.js` is the source for category detail expense rows, estimated/final/paid/note/action columns and expandable payments.
- `legacy/twb-web/src/components/couple/budget-planner/Payments.js` is the source for the Payments tab table.
- `legacy/twb-web/src/components/couple/budget-planner/CategoryActionModal.js` and `ExpensePaymentModal.js` are the sources for category and payment modal wording/structure.
- `legacy/twb-web/src/services/CoupleService.js` defines the deferred backend API shape for budget planner load, category actions, expense actions and payment actions.

### 2. original-ui-html files used

- `legacy/original-ui-html/couples-dashboard.html` contains the dashboard budget planner reference area, including the `budget-manage`, `pills-budget-planner`, category tab IDs, estimated/final cost wording and expense table columns.
- `legacy/original-ui-html/planning-budget.html` was inspected as the public planning budget reference, but the authenticated dashboard React source remained the higher-priority source for this milestone.

### 3. Parts migrated close to 1:1

- The migrated page follows the legacy `container spacer mb-5`, Categories sidebar, Budget Planner/Payments tabs and PDF button structure.
- Overview uses legacy Estimated Cost, Final Cost, Paid and Pending wording.
- Category detail pages use the legacy expense table headings: Expenses, Estimated Cost, Final Cost, Paid, Note and Action.
- Expense rows use editable text/number fields with legacy classes such as `hvr-fcs-b-1`, `no-focus`, `b-0`, `no-counter` and `text-right`.
- Payment rows preserve the legacy No./Amount/Detail/Action structure and paid/pending labels.

### 4. Newly created/local-state-only pieces

- Fallback budget planner category, expense and payment records live in `apps/web/src/legacy/data/coupleDashboardData.js`.
- Category add/edit, expense add/edit/delete, payment add/edit and paid/pending toggles are local React state only.
- The chart is represented as a local progress breakdown instead of the exact `PieDoughnutChart` dependency.
- Native controls are used where backend-loaded options or modal dependencies are not ready.

### 5. Original behaviours still missing

- Real `loadBudgetPlanner(coupleId)` data loading is not connected.
- Category, expense and payment create/update/delete calls are not connected.
- PDF generation, exact pie/doughnut chart rendering and note modal editing are not fully migrated.
- Supplier/vendor-linked expenses and checklist sync are not connected.
- Toast/loading/validation behaviours remain deferred.

### 6. Backend/API gaps deferred

- `GET /api/couple/budget-planner/load/:coupleId`
- `POST /api/couple/budget-planner/create-update-category`
- `DELETE /api/couple/budget-planner/delete-category/:categoryId`
- `POST /api/couple/budget-planner/create-update-expense`
- `DELETE /api/couple/budget-planner/delete-expense/:expenseId`
- `POST /api/couple/budget-planner/create-update-expense-payment`
- `DELETE /api/couple/budget-planner/delete-expense-payment/:paymentId`
- Couple account/session integration, saved totals calculation and supplier/vendor synchronization.
