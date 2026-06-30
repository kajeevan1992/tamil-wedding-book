# Tamil Wedding Book

Fresh migration workspace for Tamil Wedding Book.

This repo is being prepared as a monorepo migration of the existing TWB-WEB and TWB-SERVER projects.

Current rule: migration first, no redesign.

Milestone 1 is scaffold only.

Current folders:

- apps/web: basic Next.js scaffold
- apps/api: placeholder API folder for future Express setup
- packages/shared: placeholder shared package

No original UI, backend logic, or assets have been migrated yet.

Rules:

- Preserve existing TWB-WEB UI.
- Preserve existing TWB-SERVER API behaviour.
- Preserve route paths unless technically required.
- Preserve auth/session behaviour.
- Do not use the production database during development.
- Do not build a new admin dashboard design yet.
