# ADR-0017: Distinct Royal equipment slots and an expanded Nest arena

**Status:** Accepted for Prototype 01; combat values remain provisional
**Date:** 2026-11-18
**Related:** ADR-0003, ADR-0013, ADR-0016, release 0.1.10

## Decision

In response to the equipment-slot and boss-room playtest request:

1. **Three distinct equipment slots.** The Shaman's Royal Ant weapon is the **Brood Totemstaff** (internal historical item ID `broodTotem`, equipped in **weapon**), the Defender's Royal Ant chestpiece is the **Royal Carapace Plate** (internal historical ID `carapaceShield`, equipped in **armour**), and the Ranger's **Brood Quiver** remains an **offhand**. Recipes, ownership and ability-mutation effects stay intact. These are alternatives to existing items rather than additional slots or free bonuses.
2. **Old save migration.** An item saved as an offhand in v0.1.9 migrates automatically into its new weapon or armour slot if that slot is empty. If occupied by another legal item, the occupying equipment keeps priority and the migrated item remains owned and unequipped. Crafted receipts are never consumed again. The server validates the resulting class and slot, instead of trusting arbitrary client field values.
3. **Nest gate joins the other hub boss circles.** The Nest circle is on the southern row at x=-10, z=-6.5, immediately west of Normal. The same encounter ID and existing unanimous voting rules are retained. It remains visually distinct and accessible without adding a world region.
4. **Larger dedicated ant cave.** The Nest arena's ground grows from 26 by 26 to **32 by 32 world units**, with collision bounds expanded from the 12-unit half-square to a **14.5-unit-radius playable circle**. Its outer cave-wall props move outward; Queen, workers, Royals, rockfall markers and player spawns are redistributed to use the extra room. Ordinary boss arenas keep the old 26-unit ground and 12-unit movement bounds. Ability range remains 11 units, so players must still position themselves to reach a target. The camera backs out slightly only in the Nest.
5. **One more tier of active talents.** Both branches of all eight class trees receive a fourth prerequisite-dependent ability mutation (16 new talents; **nine nodes per class, 72 total**). There are still exactly ten earnable unique-first-clear points. Players can invest deeply in one class or respec freely; the design intentionally does not create passive infinite power or a new talent-farming currency.

## Rationale

The new equipment slots make builds more expressive and allow appropriate item mixing (a Shaman can wield a Totemstaff and still choose a healing or offensive offhand; a Defender's armour can augment shields while leaving the offhand free; a Ranger's quiver remains where ranged players expect it). The larger cave gives swarms and rockfalls breathing room but cannot leak new movement boundaries into unrelated bosses.

The fourth talent tier is designed as additional *conditional skill behavior*, primarily healing, utility, secondary attacks and shield interactions. Additional effects are bounded by specific skills, targets, existing cooldowns and prerequisites. The first-clear point cap remains unchanged. The accepted library is still draft source material unless an individual adaptation is explicitly recorded in release docs.

## Compatibility and verification

- Preserve all IDs: `broodTotem`, `carapaceShield`, `broodQuiver`, old talent node IDs and boss `antQueen`.
- Migrate old equipped offhand gear only when the appropriate new slot is empty, preserving both legal ownership and legacy equipment.
- The larger player boundary and placement allowance are active **only during a Nest fight**; normal rooms and hub interactions are unchanged.
- Confirm server-originated effects for all 16 fourth-tier nodes. No permanent changes to matchmaking, multiplayer scaling, Cloudflare storage, login, or prior class identities are implied.
- Use actual 1–4-player playtests to tune the larger cave's worker travel time and how much space Rockfall occupies.

If the fundamental boss objective or talent economy changes later, create a superseding ADR rather than rewriting ADR-0016 or ADR-0017.
