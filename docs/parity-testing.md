# Visual and Behaviour Parity Testing

This document defines how each migrated milestone must be checked against the original Tamil Wedding Book project.

## Core principle

A migrated page is not complete until it matches the original TWB-WEB page visually and behaviourally.

This is migration, not redesign.

## Required comparison views

Each UI milestone should be checked in:

- desktop width
- tablet width where relevant
- mobile width

Minimum browser checks:

- Chrome desktop
- Chrome mobile responsive mode
- Safari/mobile browser if available later

## Homepage must-pass checklist

Before moving beyond homepage migration, confirm:

- [ ] page loads without console errors
- [ ] header logo matches
- [ ] header links match
- [ ] dropdown menus match
- [ ] dropdown hover/click behaviour matches
- [ ] mobile menu matches
- [ ] hero slider matches
- [ ] hero image/assets match
- [ ] hero text matches
- [ ] search component matches
- [ ] popular searches match
- [ ] planning tools section matches
- [ ] featured venues section matches
- [ ] featured vendors section matches
- [ ] real wedding section matches
- [ ] footer columns match
- [ ] footer links match
- [ ] social/app sections match if present
- [ ] spacing and alignment match
- [ ] brand colour matches
- [ ] font matches
- [ ] mobile layout matches

## Header parity checklist

- [ ] logo path and size match
- [ ] main nav items match
- [ ] nav order matches
- [ ] dropdown headings match
- [ ] dropdown item labels match
- [ ] dropdown icons match if present
- [ ] dropdown right-side content matches
- [ ] logged-in/logged-out header state matches
- [ ] supplier upgrade prompt matches if present
- [ ] mobile menu open/close behaviour matches
- [ ] active link styling matches

## Footer parity checklist

- [ ] footer background/spacing matches
- [ ] logo matches
- [ ] column headings match
- [ ] links match
- [ ] copyright text matches
- [ ] social links/icons match
- [ ] app/download area matches if present
- [ ] mobile footer stacking matches

## Search/listing parity checklist

- [ ] route path preserved
- [ ] search box layout matches
- [ ] filter labels match
- [ ] filter options match
- [ ] selected filter behaviour matches
- [ ] card layout matches
- [ ] image size/crop matches
- [ ] badge/plan display matches if present
- [ ] pagination/infinite scroll behaviour matches if present
- [ ] empty state matches
- [ ] loading state matches
- [ ] API calls use same request shape
- [ ] API responses are handled the same way

## Detail page parity checklist

- [ ] route path preserved
- [ ] gallery/images match
- [ ] title/details layout match
- [ ] package/service sections match
- [ ] review section matches if present
- [ ] enquiry form fields match
- [ ] enquiry validation matches
- [ ] related vendors/venues match if present
- [ ] mobile layout matches

## Auth parity checklist

- [ ] login page layout matches
- [ ] register page layout matches
- [ ] reset password page layout matches
- [ ] form fields match
- [ ] validation messages match unless a bug blocks migration
- [ ] localStorage key `tamil-wedding-book` preserved
- [ ] token/session handling preserved
- [ ] role redirect behaviour preserved
- [ ] logout behaviour preserved

## Couple dashboard parity checklist

- [ ] route paths preserved
- [ ] dashboard layout preserved
- [ ] checklist behaviour preserved
- [ ] vendors/saved vendors behaviour preserved
- [ ] guest list data flow preserved
- [ ] seating chart behaviour preserved
- [ ] budget planner calculations preserved
- [ ] forms/validation preserved
- [ ] mobile layout preserved

## Supplier/vendor dashboard parity checklist

- [ ] dashboard layout preserved
- [ ] storefront setup flow preserved
- [ ] business detail forms preserved
- [ ] location form preserved
- [ ] image/video upload behaviour preserved
- [ ] FAQs behaviour preserved
- [ ] events/deals/menus/social links preserved if present
- [ ] reviews preserved
- [ ] enquiries preserved
- [ ] export behaviour preserved if present
- [ ] settings/invoice placeholders preserved if placeholders already exist

## Backend behaviour parity checklist

For each migrated API group:

- [ ] endpoint path unchanged
- [ ] HTTP method unchanged
- [ ] request body unchanged
- [ ] query params unchanged
- [ ] response shape unchanged
- [ ] auth requirement unchanged
- [ ] role requirement unchanged
- [ ] error format unchanged where possible
- [ ] database schema unchanged
- [ ] upload paths unchanged unless approved
- [ ] email link format unchanged unless approved

## Screenshot capture process

For every UI PR:

1. Capture original TWB-WEB screenshot.
2. Capture migrated page screenshot.
3. Compare desktop.
4. Compare mobile.
5. List any differences in the PR description.
6. Do not mark complete if major visual differences remain.

## Manual testing before merge

Each PR should include:

```text
Routes tested:
Browsers/views tested:
API calls tested:
Visual differences found:
Known incomplete areas:
```

## Blocking differences

The following block merge unless explicitly approved:

- changed header layout
- changed dropdown behaviour
- changed footer layout
- changed brand colour
- changed font/spacing
- changed route paths
- changed auth redirect behaviour
- changed API request/response shape
- changed database schema
- missing mobile layout
- missing key section from original page

## Allowed temporary differences

Only allowed if documented clearly:

- placeholder API data during shell setup
- blank route skeletons before the route milestone
- admin placeholder pages because admin is not designed yet
- env placeholder values

## Stop condition

If a PR changes more than the approved milestone scope, stop and split it into smaller PRs.
