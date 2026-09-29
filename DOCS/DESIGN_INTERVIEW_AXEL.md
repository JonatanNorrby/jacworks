# Axel Kratz — Game Design Interview Summary

**Status:** Developer-reviewed and approved  
**Source:** Interview using `DOCS/GAME_DESIGN_QUESTIONNAIRE.md`  
**Purpose:** Preserve Axel's independent preferences for later comparison with Jonatan's and Christoffer's interviews. These are preferences, not accepted project decisions.

## Developer
**Name:** Axel Kratz

## Current vision
A PvE-focused co-op boss game where the ideal experience is four friends in Discord learning an encounter together, discussing the solution, and then needing the mechanical skill to execute it.

The core loop is **learning → strategy → execution → "WE DID IT"**, paired with strong class identities and talents/gear that materially change how a build plays.

The game does not need to be a large continuous RPG. A compact **hub → boss → wipe/kill → hub → retry/next encounter** structure is enough.

## Must haves
- **Boss mechanics are the core.** Bosses should be problems to learn and master, not HP sponges.
- **Distinct class identities.** Classes should require different ways of thinking, not be the same rotation with different effects.
- **Talents/gear should change how builds play**, rather than primarily giving small numerical bonuses.
- Multiplayer must work properly; the first prototype should prove that **four human players can fight the same mechanical boss simultaneously**.
- The game must still be playable when only one human is online.
- Playing with random players should be supported.
- No ninja looting.
- No timegating.
- No pay-to-win.
- Achievements.
- PvE determines combat balance. Any eventual PvP is secondary and should not cause PvE nerfs.

## Strong preferences
- WASD movement.
- Top-down 2D/2.5D seems most practical; hand-drawn art/sprites are appealing. Third-person 3D would be exciting but is not considered practical for this team right now.
- Roughly **8–10 combat abilities**.
- Positioning, rotation/resource management, and encounter mechanics should all matter.
- Roughly **50/50 problem-solving and mechanical execution**.
- Four players are the original/primary version of an encounter.
- Smaller groups may use scaling, altered mechanics, and/or AI.
- Some encounters may require exactly four players.
- Failure should usually create **new problems** rather than instantly wipe the party.
- Recovery should be possible but have a cost: mana, cooldowns, future safety, etc.
- Detailed death recap.
- Learnable, relatively FFXIV-like encounter choreography is appealing, though negotiable.
- Minimal downtime between attempts.
- No death/wipe penalty.
- Rare, memorable loot rather than a Diablo-style loot shower.
- Relatively little item randomization.
- Bank/storage for alternate builds.
- Encounter loot can be passed to one of the up to three other players who participated; otherwise salvage is useful.
- Transmog.
- No character levels.
- Repeating the same boss roughly **five times** for a needed reward feels like a reasonable upper range; avoid excessive farming.
- A character/build may eventually become **done**. Cosmetics/mastery can remain afterward.

## Core gameplay / combat
- Combat should support direct WASD movement and around 8–10 relevant skills.
- Bosses should communicate mechanics visually. Telegraphs should complement readable boss animations.
- Player spells may be very flashy, but allied spell effects should be configurable, e.g. **Full / Simplified / Hidden**, so encounter mechanics remain readable.
- Spell pushback/interruption can vary by attack type rather than following one universal rule.
- Utility with meaningful cooldowns—anti-knockback, interrupts, cleanses, movement tools, defensives, etc.—can be part of class mastery.
- One player's small positioning mistake should not routinely cause an immediate full-party wipe.
- Good recovery creates memorable moments. Example: a healer rescues three dead players but exhausts their mana, leaving the party alive with almost no margin for further mistakes; or a tank spends mitigation early to save a mistake and must later solve a mechanic differently.

## Multiplayer / solo
- The ideal/original encounter is designed around **four players**.
- Four friends coordinating in voice chat is the strongest target fantasy.
- Solo must still be meaningful: being the only person online should not mean there is nothing to play.
- Random matchmaking/grouping should be possible.
- Smaller groups can receive structurally adapted mechanics (e.g. two pressure plates instead of four), not merely HP scaling.
- Some encounters can remain four-player-only.
- Both adapted solo encounters and original-like encounters filled with AI companions are interesting possibilities.

## Classes / builds
A class should have a functional core relatively early. Long-term progression primarily provides **more ways to use that core**.

Examples from the interview:
- **Mage:** long cast times, primarily direct damage.
- **Necromancer:** summons that can absorb hits plus casting/curses. Builds might focus on tankier skeletons, stronger melee skeletons, debuffing mage skeletons, or healing skeletons.
- **Ice Mage:** Frostbite-based gameplay. One build might gain +5% Snowball damage per Frostbite stack and deliberately hold at 9 stacks; another might apply two stacks per Snowball and try to trigger the 10-stack explosion as often as possible.
- **Poison Wizard:** DoT and uptime management.

Build choices should be a more **long-term commitment**, rather than fully respeccing after every wipe. However, base kits should be broad enough—e.g. most classes having some AoE—that a valid build does not become completely unusable because of one encounter requirement.

Traditional tank/healer/DPS roles are acceptable but should not be the only possibilities. Hybrids such as DPS/buffer, debuffer, off-tank/healer, or heal-through-damage archetypes are appealing. A healer can have a simpler/weaker damage rotation than dedicated DPS.

Many narrow classes versus fewer broad classes/specs is **don't care**.

## Progression
- No traditional character-level progression.
- Almost the entire fundamental toolkit should be available relatively early.
- Longer-term progression provides:
  - more talents;
  - more possible builds;
  - gear that changes abilities;
  - potentially new abilities granted by talents/gear;
  - more combinations to experiment with.
- Progression should primarily create **more options**, not enormous vertical stat inflation.
- A veteran bringing developed gear into an early encounter should not simply two-shot the boss.
- A build can eventually be finished; after that, cosmetics and mastery can continue to motivate play.

## Loot / crafting
Multiple acquisition methods should coexist:
- direct boss drops;
- crafting from boss-specific materials;
- items that only drop when a boss is defeated in a particular way;
- materials that only drop under particular kill conditions.

Prefer a few general currencies plus boss-specific materials.

Different materials can use different acquisition rules: some can provide steady deterministic progress, while others can be rare/challenge/discovery rewards.

Crafting, drops, and challenge rewards can complement each other rather than one system doing everything.

## Codex
The Boss Codex should begin incomplete and document **what players have actually discovered**.

Examples:
- After seeing Tail Swipe, its entry can describe the observed tell and behaviour.
- Loot tables populate only after the loot has actually been seen.
- Special kill conditions might eventually receive subtle hints after enough of the boss has been discovered, but exactly how secret they should remain is **don't care**.

The Codex should preserve discovered facts without simply telling players the solution in advance.

## Encounters / difficulty
Difficulty should often evolve the **same mechanical language** rather than only increasing numbers.

Example progression:

**Normal**
- Arena fence prevents leaving.
- Tail Swipe covers 180°.
- Telegraph appears before the boss animation.
- Mechanics are often presented separately.

**Hard**
- Arena edge becomes a damage zone: players can leave accidentally and recover, but it is dangerous.
- Tail Swipe covers 270°.
- Telegraph and boss animation occur closer together.
- Mechanics can become longer/sequenced.

**Insane**
- Arena edge can become a lethal drop.
- Tail Swipe covers 360°.
- The boss animation may become the real warning; the ground indicator can be close to an impact marker rather than enough warning to dodge by itself.
- Previously learned mechanics can be combined.
- Example: a small safe circle from an ice attack occurs simultaneously with delayed lightning AoEs targeted at every player, forcing movement and coordination in limited space.

The same knockback can therefore progress from **annoying → dangerous → lethal** without changing the basic ability.

Encounters can be relatively learnable/choreographed, like FFXIV raids. Axel is not rigid about this if the other developers prefer more variation.

Mistakes should often escalate the encounter: damage, vulnerability, adds, harder subsequent mechanics, spent resources, etc. One-player-error → instant party wipe should be uncommon/special.

## Elements
**Interesting idea, not a requirement.**

Elements may have gameplay effects and interactions, but resistance should never make a class effectively invalid. An Ice boss having ~20% Ice resistance is acceptable; 50–80% is not.

Possible interactions:
- Fire hitting Frozen could be especially effective and turn the target Wet.
- Wet could increase Lightning/Ice effectiveness while reducing Fire effectiveness.
- Ice could freeze a Wet target again.
- Frozen might take modestly increased Fire damage.

The goal is additional tactical possibilities, never "wrong class, leave the group."

## Powerups
Two interesting categories:

**Encounter powerups:** a player may attack a crystal instead of the boss. Destroying it might grant +50% damage for 10 seconds or a heal. The opportunity cost creates a tactical decision.

**Pre-encounter tradeoffs:** optional modifiers such as:
- 20% slower movement but 15% less damage taken;
- 20% more damage dealt but 20% more damage taken.

These are interesting ideas, not core requirements.

## AI
**Open question.**

Axel does not currently have a preference between companions that are independently competent and companions directed by the player.

Both are appealing:
- a genuinely adapted solo/small-party version of an encounter;
- a version closer to the four-player original with empty slots filled by AI.

This should be prototyped rather than decided by assumption.

## World / presentation
Gameplay comes first.

Lore can come **much later or not at all**. NPC needs are primarily functional: bank, consumable vendor, crafter, etc.

A fantasy hub is fine, but bosses do not need a strict shared aesthetic. A futuristic missile-firing robot, T-rex, high-elf-like archmage, absurd clown boss, cute summon-heavy boss, etc. can coexist. The examples describe vibes, not licensed characters.

Bosses should be **memorable**, but priority is:
**gameplay → visual/design identity → lore**.

## Long-term / replayability
The most important retention system is simply that **the game itself is fun**.

After primary progression is complete, players can remain for:
- encounter mastery;
- achievements;
- cosmetics;
- other classes/builds;
- new bosses/content.

New bosses are exciting mainly because they provide **new problems to learn**, not because they reset a gear treadmill.

With unlimited resources, built-in VoIP, full lobbies, many bosses, secret classes, secret bosses, and extensive cosmetics would all be appealing, but none are required for the core game to work.

PvP is not a priority. It can exist as a secondary feature, but balancing should remain 100% PvE-first even if that means some classes are overpowered relative to others in PvP.

## Scope priorities
If only three things can be excellent:
1. **Boss mechanics**
2. **Class identities**
3. **Talents/gear that meaningfully change builds**

Axel is personally most excited by brainstorming and designing **classes, bosses, and mechanics**.

## Prototype test
The smallest prototype needs to prove:

> **Can four real players simultaneously fight a boss with a few mechanics, and is that experience fun?**

Loot, crafting, Codex, cosmetics, AI, lore, elaborate hub systems, etc. can wait until the combat/boss concept proves itself.

## Explicitly does not want
- Ninja looting.
- Timegating.
- Pay-to-win.
- PvP balance changes that damage PvE.
- Huge elemental resistances that invalidate builds.
- Routine "one person stood five pixels wrong, therefore everyone instantly dies" design.
- Large amounts of downtime between attempts.
- Progression mainly consisting of bigger numbers.
- A randomized-junk loot shower as the primary loot model.

## Open questions / uncertainties
- Independently competent versus player-directed companion AI.
- Many narrow classes versus fewer classes/specs.
- Exact degree of choreographed versus dynamic encounter behaviour.
- Exact secrecy of challenge conditions.
- Exact RNG rules can differ by reward/material.
- Elements and elemental combos are appealing but optional.
- PvP may exist secondarily.
- Lore is low priority.

## Potential tensions within the answers
- **Long-term build commitment vs encounter-specific needs:** base classes should have enough general-purpose capability to remain viable, while builds change *how* they solve problems rather than whether they are allowed to participate.
- **Four-player-first design vs meaningful solo play:** this likely needs prototyping of encounter adaptation and/or AI rather than a purely theoretical decision.
- Axel is deliberately collaborative: these are his preferences, not ultimatums. He is willing to adapt to Jonatan's and Christoffer's preferences.

## New ideas not previously captured
- Difficulty can reduce explicit ground telegraph lead time and increasingly rely on readable boss animation.
- Allied spell visuals should be independently reducible/hidden while retaining flashy personal effects.
- Elemental state chains can add tactical depth without hard-countering classes.
- Encounter crystals/powerups can trade immediate boss DPS for later burst or survival.
- Pre-fight powerups can offer explicit risk/reward tradeoffs.

## Confidence
- **Must have:** boss mechanics; class identity; build-changing talents/gear; functional multiplayer prototype; solo remains playable; no ninja looting/timegating/pay-to-win; achievements; PvE-first balance.
- **Strong preference:** four-player-first encounters; recoverable failure; readable mechanics; minimal downtime; meaningful named loot; low item randomness; WASD; ~8–10 abilities; no levels; limited grind; death recap; transmog.
- **Interesting idea:** elemental interactions; encounter/pre-fight powerups; AI-filled parties; secret bosses/classes; built-in VoIP; broad boss aesthetics.
- **Don't care / open:** classes vs specs; exact AI control model; exact choreography/randomness balance; exact challenge-hint secrecy.
- **Don't want:** punitive wipe costs, excessive grind, build-invalidating resistances, routine single-mistake party wipes, vertical-stat progression as the main point, PvP driving balance.

## Core in one sentence
> **Four players learn a boss together, master it with meaningfully different classes and personal builds, and have enough room to experiment and recover from mistakes until the group reaches the "we understand it—now let's execute" moment.**
