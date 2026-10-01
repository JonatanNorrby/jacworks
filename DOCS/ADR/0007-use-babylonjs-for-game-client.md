# ADR-0007: Use Babylon.js for the game client

- **Status:** Accepted
- **Date:** 2026-10-01
- **Decision owners:** JAC Works team

## Context
JAC Works is intended to be browser-first. The team has now selected Babylon.js as the client-side game engine/framework direction.

This technology choice is separate from the questionnaire consensus: it is a subsequent project decision.

## Decision
The JAC Works game client will be built with **Babylon.js**.

The first prototype should use Babylon.js rather than building a disposable prototype in an unrelated engine unless a later ADR explicitly changes that decision.

This ADR does not yet lock:
- final rendering/art style;
- 2D/2.5D versus fully 3D presentation details;
- client application framework around Babylon.js;
- networking/backend architecture beyond already documented project direction.

## Consequences
- Client architecture and prototypes should assume Babylon.js.
- Technical experiments should favor browser-native workflows compatible with Babylon.js.
- Future engine changes require a superseding ADR because switching engine is expensive.

## Related
- ADR-0001
- `DOCS/PROTOTYPE_01.md`
