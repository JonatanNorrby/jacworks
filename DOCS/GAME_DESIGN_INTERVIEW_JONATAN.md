# JAC Works — Individual Design Interview: Jonatan

**Status:** Individual brainstorming / discovery  
**Source:** Interview conducted using `DOCS/GAME_DESIGN_QUESTIONNAIRE.md`  
**Important:** This document captures Jonatan's individual preferences and is not an accepted JAC Works design decision.

## Developer
Name: Jonatan

## Current vision
A co-op-focused boss/raid game that captures the feeling of **WoW raiding in a browser**, without requiring players to spend large amounts of time gearing before the interesting content begins.

The central progression should primarily be that **the player gets better**: learning encounters, improving execution, communicating better with the group, and understanding how classes and builds can be used for different situations.

A good boss should be able to take several evenings to learn even if a single attempt lasts no more than roughly 15 minutes.

## Must haves
- The game must support strong **skill expression**. A skilled player should clearly be able to outperform a less-skilled player even with a less optimal build.
- Co-op should be the core.
- Bosses/raids should be the main activity.
- Encounters should be difficult enough to require learning across many attempts.
- Mechanics should matter enough that mistakes often lead to a wipe.
- Cooperation, communication, and shared problem-solving should be central.
- Classes should have clearly distinct playstyles.
- Classic roles such as tank/healer/damage should have a clear place.
- The game must work well as a browser game.

## Strong preferences
- Progression should primarily feel like **the player learning and improving**, not the character's stats getting larger.
- A wipe should ideally provide new information: the group understands what went wrong and feels the next attempt can improve.
- Both preparation and learn-by-doing should matter.
- Roughly 50/50 between execution and preparation/strategy is a good direction, but when the two conflict, player skill should matter more.
- The same group should ideally progress together over time.
- Bosses should be fairly consistent and learnable, like a "dance", while still containing some elements that require improvisation.
- Harder content should combine new/overlapping mechanics, tighter checks, smaller margins for error, and higher tempo.
- The same boss should be able to have multiple difficulties.
- The highest difficulty can reward prestige items such as titles or cosmetics.
- Players should be able to restart immediately after a wipe if the group wants to.
- A good combat log is important for understanding failures.
- Players should be able to discover mechanics, secrets, and alternative solutions through information available inside the game.
- External research should not be required to understand encounters.
- Fewer, deeper classes are preferred over many narrower classes.
- Builds should be able to change playstyle significantly.
- Respeccing should be completely free between encounters.
- WASD movement is preferred.
- Roughly 4–8 active abilities feels reasonable.

## Interesting ideas
- A pet/hunter-like class where the player indirectly controls two things at once.
- Secret mechanics and alternative ways to solve encounter elements.
- Optional challenges such as flawless clears, speed kills, or extra conditions could be fun later, but are not important to the core.
- Crafting is acceptable, but does not need to be central.
- Dark fantasy is visually appealing, although other art styles can also work.
- Cosmetics, titles, and achievements are fun prestige rewards but not a primary reason to play.
- Sidegrade-based items and clear loot pools per boss could be interesting.

## Explicitly does not want
- PvP.
- Too much randomness.
- Heavy gear grind.
- Bloat in the number of classes, items, or talents.
- Gear or talents that mainly consist of small stat boosts.
- Character levels feel unnecessary.
- Story or lore as a major focus.
- AI companions for solo play.
- A system where one strong player can easily carry the rest of the group through mechanics.
- A progression system where loot/talents matter more than actual player skill.

## Core gameplay / combat
Combat should be able to feel different depending on class.

A caster with cast times should need to plan ahead and understand encounter timing: when is there enough time to begin a cast and actually finish it?

Melee should instead put more emphasis on movement, dodging, uptime, and learning when it is safe to go back in.

Combat can therefore contain both planning and fast reactions rather than making the whole game choose only one style.

Perspective is not particularly important. Top-down, isometric, and third person can all work. WASD is preferred.

The player should manage roughly 4–8 active abilities.

Mistakes should have high consequences. In difficult encounters, failing an important mechanic should often be able to cause a wipe.

## Multiplayer / solo
Co-op is the core.

Teamwork should involve:
- communication;
- coordination;
- different roles and tools;
- the group solving the encounter together;
- players being able to help recover situations, while mechanics still require the group as a whole to perform correctly.

It should not be possible to trivially carry a group through content.

The same encounter should work with different group sizes by actually adapting mechanics to the number of players, not only by scaling HP.

Solo should exist without AI companions. The solo version of an encounter should instead have mechanics removed, introduced, or redesigned so the fight genuinely works for one player.

Playing repeatedly with the same group is preferable to constantly playing with random players.

Large social systems such as guilds/clans are not particularly important.

## Classes / builds
Clear classes and clear roles are very important.

Tank/healer/damage is a role structure that is liked.

Fewer classes with greater depth are better than many classes with small differences.

Variation should largely come from builds within the class.

Good talents/items should be able to:
- change the rotation;
- provide a new tool for a specific mechanic;
- create a meaningful trade-off;
- open a substantially different playstyle.

Small pure stat boosts are uninteresting. If a talent only increases a number, it feels more like a balance change than an interesting build choice.

Builds should be completely changeable between encounters.

A pet/hunter playstyle is particularly interesting because indirect control of multiple things at once sounds fun.

## Progression
The most important progression is **mastery**.

After ten hours, the largest difference should be that the player:
- understands the game better;
- understands encounters better;
- plays their class better;
- can begin designing their own builds for specific bosses or playstyles.

Talents almost do not need to be unlocked through progression at all. It is appealing if the player gains access to the tools early and then learns how to use them.

Character levels are not needed.

The most important sense of progression is the prestige/achievement of actually defeating difficult bosses.

Skilled players should be able to defeat content earlier or with worse gear than normally expected.

## Loot / crafting
Gear should not be the game's main progression.

Items should primarily be **sidegrades** that change how the player plays or what a build is good at.

Build-defining rewards should not be so rare or central that players feel forced to gear-grind bosses.

Less loot RNG is preferred.

A clear loot pool per boss is one possible model: the player roughly knows what a boss can drop and can target their play, without everything necessarily being fully deterministic.

Boss rewards can include:
- cosmetics;
- titles;
- some items.

Crafting is acceptable but is not an important part of the vision yet.

## Encounters / difficulty
Boss progression is the central gameplay experience.

An individual boss attempt should be at most around 15 minutes, but a difficult boss can ideally require 2–3 evenings of progression before the group succeeds.

The satisfying loop is:
1. The group attempts the fight.
2. Something goes wrong.
3. The group understands more about what happened.
4. Someone learns a mechanic or the group tries a new strategy.
5. The next attempt goes a little further.
6. The group reaches a new phase.
7. Eventually the entire fight comes together.

Memorable bosses have:
- unique mechanics;
- tight skill checks;
- communication requirements;
- visually impressive moments;
- a stressful/intense feeling.

Bosses can become a fairly exact dance once players have learned them, while still containing some variation that requires improvisation.

Higher difficulty can involve a mixture of:
- new mechanics;
- combined mechanics;
- tighter DPS/healing/timing checks;
- less room for error;
- faster tempo.

Optional challenge modes are interesting longer-term but are not important to the core.

The baseline audience is people who actively enjoy **getting good at a game**. The difficulty does not need to be designed so everyone can complete everything.

## AI
AI companions are not wanted for solo play.

Bosses and enemies should primarily be **consistent and learnable** rather than adaptive systems that try to counter player habits.

Variation is good, but encounter knowledge should remain valuable.

## World / presentation
Lore is not important.

Story is not important.

The game can be heavily gameplay-focused as long as the presentation is high quality.

Graphics are one of the three most important parts because the game is simply more fun to play when it looks good.

Dark fantasy is appealing but not a requirement. Other visual directions can also work.

Simple animations are completely acceptable if they can instead be made really good. Visual quality matters more than animation quantity.

Cosmetics, titles, and achievements are fun but not decisive.

## Long-term / replayability
The clearest long-term goal is to **complete all content on the highest difficulty**.

Doing that together with the same group is appealing.

Trying new builds provides additional replayability.

New bosses/content are naturally valuable because encounter mastery is the core.

Cosmetic chasing and social systems are secondary motivations.

## Scope priorities
1. **Classes and their playstyles**
2. **Bosses / encounter design**
3. **Graphics / visual quality**

Doing a small number of things really well is preferred over large amounts of content or system bloat.

Simple animations can be used to keep scope down, as long as their quality is high.

No obvious major development trap was identified during the interview.

The area Jonatan is personally most interested in working on is **graphics and building classes**.

The area he is personally least interested in building is **bosses**, despite bosses simultaneously being one of the most important parts of the game.

## Prototype test
The smallest prototype needs to contain:

- at least one functioning class that actually feels good to play;
- a reasonably engaging boss;
- the boss must be challenging enough that the player needs to learn it.

The prototype does not need to prove loot, crafting, progression, story, or a larger content structure.

It mainly needs to prove that **"play a class against a difficult boss, fail, learn, and improve"** is fun.

## Open questions / uncertainties
- Exact perspective: top-down, isometric, and third person are all acceptable.
- Exact art style is open even though dark fantasy is liked.
- The exact loot system needs more development.
- Crafting's role is undefined and does not appear especially important.
- How classic tank/healer/damage roles best adapt to all group sizes needs prototyping.
- Exactly how boss mechanics should scale/be redesigned between solo and different co-op sizes needs investigation.
- How much numerical gear progression is needed at all remains open.
- Content outside raids/bosses is welcome later, but no specific system feels important yet.
- How a pet class would be controlled in practice is an interesting but unexplored idea.

## Potential tensions within their own answers
- Preparation/build strategy is important and should affect success, while skill expression should matter most. Builds therefore need to be meaningful without the correct build automatically solving the encounter.
- Tank/healer/damage roles are strongly liked, while the game should also work with all group sizes and solo without AI. Encounter design therefore needs to be flexible without roles losing their identity.
- Bosses are one of the three most important parts of the game, while boss design is the area Jonatan is least interested in personally building.
- Graphics are a top priority despite the project being made by three developers and being browser-based. Scope therefore needs to stay controlled through measures such as fewer assets and simpler but well-made animations.
- Gear/items should exist and can affect playstyle, but the game must not become gear-grindy. Sidegrades and limited RNG seem the most compatible direction.

## New ideas not previously captured
- Progression could be largely **pure encounter prestige**, rather than a traditional power curve.
- Almost the entire talent toolkit could potentially be available very early instead of being used as progression rewards.
- Items could be treated more as encounter/build tools than as a traditional gear ladder.
- The same boss could effectively have different mechanic designs depending on group size rather than only numerical scaling.
- A pet-based class where the player indirectly manages two actors at once seems particularly appealing.

## Confidence
- **Must have:** skill expression; co-op as the core; difficult bosses; clear classes/playstyles; mechanics that genuinely determine encounter success; browser compatibility.
- **Strong preference:** raid/boss focus; mastery over stat progression; tank/healer/damage; fewer deep classes; completely free respeccing between encounters; WASD; multiple difficulties; learnable bosses; low gear grind; low RNG; sidegrade items; quick restart; good combat log; discovery inside the game.
- **Interesting idea:** pet hunter-like class; crafting; optional challenges; dark fantasy; cosmetic prestige rewards; boss loot pools.
- **Don't care:** exact perspective; exact visual genre; advanced social systems; extensive systems/content outside bosses in an early version.
- **Don't want:** PvP; AI companions for solo; heavy gear grind; class/item/talent bloat; levels; story/lore as a focus; talents/items that mainly give stat boosts; external guides as a requirement for understanding encounters; builds that can replace actual skill.

## Shortest version of the vision
**"WoW in a browser without requiring huge amounts of time spent gearing."**
