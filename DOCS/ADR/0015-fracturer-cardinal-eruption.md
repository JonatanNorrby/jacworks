# ADR-0015: Fracturer Cardinal Eruption

- **Status:** Accepted for Prototype 01
- **Date:** 2026-11-18
- **Context:** Existing Fracturer corner collapses eventually remove all four outer corners, leaving the central cross of ground traversable. JAC Works now needs a readable mechanic where only one cardinal direction is safe.

## Decision

Add **Cardinal Eruption** to the solo Fracturer and the surviving Fracturer partner in the Truffle Man + Fracturer double encounter.

- Starting approximately 11 seconds into combat, the Fracturer telegraphs four **90-degree compass sectors**, with one highlighted safe sector (green) and three dangerous sectors (red). The server announces the safe direction by name, and the boss title displays the direction and remaining seconds.
- The first warning lasts **3.2 seconds**. When it expires, players in any of the three unsafe sectors receive **55 damage once** through normal server-authoritative damage, mitigation and shielding. Safe-sector players do not take this attack's damage. Totems outside the safe sector are destroyed. The attack repeats on a 16-second cadence, rotating through North, East, South and West.
- Sector determination uses the dominant absolute X/Z axis, measured from the arena center. North is positive Z (the W movement direction), East positive X, South negative Z, West negative X. Color overlays extend beyond the arena's corners to avoid unmarked edges.
- A cardinal direction always offers an intact **axial corridor**, because the existing collapsing quadrants require both |X| and |Z| to exceed 3. The old four corner cuts, Warden-style attacks, and collision rules remain intact; Cardinal Eruption does not permanently collapse additional ground.
- A pending warning cancels if the Fracturer dies. It clears on win, wipe, return to hub, reset, or an inactive duo partner. Late joiners see the remaining warning in the authoritative snapshot; the attack cannot double-hit after server stalls.

## Alternatives rejected

- Making all but one corner safe: this would conflict with already-collapsed corners and could eliminate every reachable safe area.
- Permanent 270-degree floor removal: would eventually make the encounter impossible.
- Client-only damage based on red overlays: violates shared authoritative simulation.

## Scope

This is an approved prototype ability with tuning subject to four-player playtests, not a permanent endgame balance commitment. No additional models, third-party artwork, progression currencies or account systems are introduced.
