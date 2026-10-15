# Version and release rules

The first consolidated prototype is **0.1.0**. Use MAJOR.MINOR.PATCH. PATCH covers compatible fixes; MINOR covers compatible features; MAJOR covers breaking supported interfaces after 1.0. Before 1.0, breaking changes require a MINOR bump and explicit release notes.

Update package.json and both package-lock root version entries together with `npm version <version> --no-git-tag-version`. Review hooks first. Do not create automatic release/deploy hooks. Protocol and save migrations need explicit compatibility handling; package versions do not migrate data.

Before publication: review scope/credits and diff, run TypeScript/Vite build, unit and socket smokes, browser Labs/actual boss/room restoration checks, and local Durable Object checks. Record exact results and limitations. Re-fetch main to detect concurrent work. Publish a consolidation branch first; merge main only with authorization and no new material deployment uncertainty. A main push may trigger production Workers Builds; never run wrangler deploy implicitly. Tags and GitHub releases require explicit release intent.

No root LICENSE is introduced. Existing source rights and third-party asset licenses remain unchanged. Keep asset provenance, adjacent attribution and public Credits intact.
