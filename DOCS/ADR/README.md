# Architecture Decision Records

This directory contains JAC Works Architecture Decision Records (ADRs).

ADRs capture **significant durable decisions and why they were made**. They are not a dumping ground for every implementation choice or brainstorm.

## Index

| ADR | Status | Decision |
| --- | --- | --- |
| [0001](0001-use-architecture-decision-records.md) | Accepted | Use Architecture Decision Records |
| [0002](0002-player-skill-over-raw-power.md) | Accepted | Player skill matters more than raw power |
| [0003](0003-builds-change-gameplay.md) | Accepted | Builds and gear should change gameplay |
| [0004](0004-learnable-encounters-and-mechanical-difficulty.md) | Accepted | Learnable encounters and mechanical difficulty |
| [0005](0005-avoid-forced-grind-and-infinite-power.md) | Accepted | Avoid forced grind and infinite power progression |
| [0006](0006-support-solo-and-multiplayer.md) | Accepted | Support both solo and multiplayer play |
| [0007](0007-use-babylonjs-for-game-client.md) | Accepted | Use Babylon.js for the game client |

| [0008](0008-five-prototype-classes.md) | Superseded (roster size) | Five class-restricted prototype kits |

| [0009](0009-defender-rogue-hard-warden.md) | Superseded (selection and roster size) | Defender, Rogue and separate Hard Warden tier |

| [0010](0010-room-votes-and-shaman.md) | Accepted | Unanimous room votes and Shaman |

| [0011](0011-yellow-ball-splits.md) | Accepted | Yellow Ball split encounters and Large Sphere |

| [0012](0012-connected-development-labs.md) | Accepted | Connected development Labs and consolidation |
| [0013](0013-branching-talents-and-duo-gear.md) | Partially superseded by 0018 (talent branch count), otherwise accepted | Class talent branches and dual-encounter skill mutation gear |
| [0014](0014-browser-local-rebindable-controls.md) | Accepted for prototype | Safe and persistent configurable keyboard controls |
| [0015](0015-fracturer-cardinal-eruption.md) | Accepted for prototype | Cardinal Eruption: three unsafe compass sectors, one guaranteed intact safe corridor |
| [0016](0016-ant-queen-objective-and-extended-builds.md) | Accepted for prototype | Ant Queen Guard-death objective, new Nest, south-facing bars, Hard Warden proximity and deeper builds |
| [0017](0017-nest-layout-gear-slots-and-fourth-talents.md) | Partially superseded by 0018 (Ranger slots), otherwise accepted | Royal Chitin gear in distinct slots, southern Nest gate, enlarged cave and fourth-tier class talents |
| [0018](0018-chaos-threat-class-loadouts-codex.md) | Accepted for prototype, Chaos mechanics clarified by 0019 | Five Ranger slots, class equipment presets, threat, three talent branches, HP scaling, Chaos Arena, Guide |
| [0019](0019-chaos-boss-mechanic-parity-and-warrior.md) | Accepted for prototype | Complete normal Chaos boss mechanics; fixed Warden/Fracturer/Queen, mobile Yellow/Truffle; Warrior role damage check |

## Workflow

1. Check this index and relevant Accepted ADRs before making architectural or durable game-system changes.
2. Copy `0000-template.md` and assign the next unused four-digit number.
3. Use **Proposed** while a decision is still being discussed.
4. Change it to **Accepted** only when the project team has actually made the decision.
5. Once Accepted, preserve it as historical record. If direction changes, create a new ADR and mark the old one **Superseded**.
6. Update this index whenever an ADR is added or its lifecycle status changes.

## What deserves an ADR?

Good candidates include:
- client/server authority and networking architecture;
- persistence/data ownership boundaries;
- authentication/security architecture;
- major repository/package conventions;
- core game-system rules that constrain many future features;
- decisions resolving meaningful team disagreement;
- technology choices that are costly to reverse.

Usually not ADR-worthy:
- routine bug fixes;
- local refactors;
- individual tuning values;
- temporary experiments;
- brainstorming that has not become a decision;
- small, easily reversible implementation details.

The design questionnaires and interview summaries are **decision inputs**, not decisions themselves.
