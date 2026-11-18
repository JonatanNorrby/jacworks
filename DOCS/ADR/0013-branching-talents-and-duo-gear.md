# ADR-0013: Prototype 0.1.6 branching class talents and dual-boss mutation gear

- **Status:** Accepted for Prototype 01 implementation, experimental balance
- **Date:** 2026-11-18
- **Decision owner:** User-requested JAC Works feature round
- **Related:** ADR-0002, ADR-0003, ADR-0005, ADR-0010, ADR-0011, Prototype 01, PR #24

## Context

The 0.1.5 talent panel displayed linear cards and only Shaman had unique talents. Double-boss drops had no crafting uses. The user explicitly requested deeper class-specific talent trees with drawn prerequisite links and more items that change skill behavior, using the unified ability/evolution library as inspiration. The active prototype already has eight classes, nine unique encounters and a shared earned-point pool.

## Decision

In the current playable prototype, each of the eight class tabs presents a five-node talent graph: the existing purchasable Unyielding Force root and two independent two-node branches. Render real visual connectors and arrows matching the prerequisite dependency graph. A node requires its parent in the same class; the server validates allocations. Preserve the existing one-point-per-unique-clear shared pool (maximum nine from current encounters), free per-class respec, browser-local save and server-validated active-room state.

Introduce eight class-restricted, behavior-changing equipment recipes: one new item per class. Each consumes either Twin Core or Fractured Spore from the two double-boss fights plus a pre-existing boss material. Preserve one-effect item identities and tradeoffs with existing equipment slots. All combat mutations are resolved in the shared authoritative simulation, not by client-supplied damage.

The precise implemented nodes, numerical values, recipes, source-library provenance, interactions and test coverage are recorded in [release 0.1.6](../RELEASE_0_1_6.md). Shaman's Parting Gift and Violent Farewell are retained unchanged. This is the user's authorization to explore more talents and items in the current prototype, **not** approval of every other idea in the library.

## Boundaries

- No account migration or cloud inventory. Existing browser-local trust boundary persists.
- No new talent-point farming, additional encounter IDs, progression inflation or mandatory endless grind.
- No forced respec on upgrade; old talent IDs and purchase histories remain valid.
- Old gear, crafting receipts and class restrictions remain valid.
- Character/skill progression, final talent allocation limits, competitive economy and balance remain prototype tuning, not permanent full-game policy. Larger changes need review.
- The library's 182 ideas remain draft references unless explicitly implemented and documented here.

## Consequences

Every class has at least two meaningful, mutually combinable thematic build paths, with no ability acquisition beyond existing four active skills. Choosing a branch means allocating scarce points between classes; full-tree access is deliberately impossible with nine current first-clears. Double-boss materials have purpose. Shared code and new unit/browser tests preserve server authority and regressions.

Follow up with four-player balance and clarity playtests. Do not claim production deployment based on a merged PR alone.
