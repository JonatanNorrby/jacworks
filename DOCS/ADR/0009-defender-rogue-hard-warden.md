# ADR-0009: Defender, Rogue and a separate Hard Warden tier

- **Status:** Superseded by ADR-0010 for encounter selection and roster size; authority, gear and persistence retained
- **Date:** 2026-10-14
- **Supersedes:** ADR-0008 roster size only; its authority, eligibility and persistence rules remain current.

## Context

The user explicitly requested two additional class kits and a mechanically harder Warden encounter with separate crafting material and armour. Existing classes, bosses, equipment and save keys must remain supported.

## Decision

Expand the selectable roster with Defender (Stab, Bulwark, Heroic Shield, Dash) and Rogue (Quick Stab, Vanish with temporary Backstab, Poison Enchant, Dash). Keep temporary skill changes in authoritative encounter state and preserve slot ordering and cooldowns. Enemy AI excludes invisible players from targeting, while allies retain visibility and area damage remains effective. Centralize incoming damage so mitigation precedes absorb shields and all enemy damage paths respect buffs.

Hard Warden is a distinct, first-entrant-locked boss selection. Two solid pillars share client and server coordinates; authoritative swept movement prevents tunnelling, and segment occlusion blocks the full-circle sweep. Hard loot is Large Cylinder, separate from normal Cylinder Tube. Three large cylinders craft reusable Redtube Armour for melee classes (Warrior, Defender, Rogue), reducing boss damage and extending Warrior cleave. All old classes and equipment retain their behavior.

## Consequences

Browser class and inventory save keys remain unchanged. Legacy saves gain empty armour ownership; crafted counts remain constrained by receipts. Class switching never deletes gear. This expands the prototype scope expressly approved by the user, without establishing final roster size, balance, authenticated ownership or account persistence. Exact tuning and rear-position conventions are documented in README and covered by tests.
