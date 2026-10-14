# ADR-0008: Five class-restricted prototype kits

- **Status:** Accepted (user-approved prototype roster)
- **Date:** 2026-10-14
- **Decision owners:** JAC Works user-approved implementation request

## Context

ADR-0003 calls for distinct gameplay identities and ADR-0006 requires meaningful solo play. The user explicitly expanded Prototype 01 to five selectable classes and approved their skill rosters.

## Decision

Offer Warrior (Sword Slash, Charging Stab, Guard), Priest (Holy Nova, Targeted Heal, Holy Light), Lightning Mage (Arc Blast, Lightning Storm, Lightning Shield), Ranger (Aimed Shot, Arrow Rain, Split Shot), and Fire Mage (Fireball, LAZOR, Fire Mine). Every class also has Dash, can deal repeatable damage solo, and can join any party composition. There is no locked trinity and no cross-class skill mixing.

Persist selection locally, independently of inventory. The authoritative shared simulation validates class/loadout, targets, casts/channels, cooldowns, damage and gear eligibility. Keep class definitions and new skill execution separate from boss mechanics, permitting later optional class-specific skills and gear mutations. Existing inventory receipts and owned gear survive switching classes; ineligible saved equipment is inactive rather than deleted. Wands suit spellcasters, hats are universal, and orbs suit Mages. Primitive Wand transforms only Lightning Mage Arc Blast to Arc Spear.

## Consequences

The earlier one-kit prototype boundary is expanded only for this approved roster. Tuning remains experimental; this does not establish a final class count, final balance, account persistence or future talent design. New skills and equipment mutations must respect class eligibility. Existing bosses, crafting, rewards, equipment ownership and retry/hub flow remain supported.

## Related

- ADR-0003 — Builds and gear should change gameplay
- ADR-0006 — Support both solo and multiplayer play
- README — controls, current skill behavior and validation commands
