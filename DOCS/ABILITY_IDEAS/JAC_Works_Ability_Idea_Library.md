# JAC Works – Ability & Evolution Idea Library

> **Status: Inspirationsbibliotek, inte implementerad/fastställd gamedesign.**
> Källa: Energy_Arena_Spells_Evolutions_Descriptions_v2.xlsx; källa anger uppdatering 2026-10-16.
> Originalvärden, namn, energi och klass är inte JAC Works-beslut. Talents / bossdrops / hybrid är fortfarande öppna alternativ.

## Omfattning

- **30 grundspells** från fem ursprungsklasser, sex per klass.
- **60 Evolutions** knutna till de första fyra spells per origin.
- **24 kombinationsidéer**, både från Energy Arena och nya, uttryckligen märkta JAC-förslag.
- **15 förslag att prototypa först**.

## Designriktning för JAC Works

Utgå från den *roliga mekaniken* (mark, extra slag, teleport-uppföljning, execute, skillshot, summon, shield counter) snarare än Energy Arenas klassnamn och element. Sikta oftast på **ett huvudmål + högst 1–2 extras**, men behåll starka visuella moments. Se till att även bossar utan adds ger meningsfulla spelmöjligheter. Gör kombinationer möjliga via generella triggers, så de inte kräver en viss exakt klass.

## Tidiga favoritförslag (för diskussion)

| Spår | Evolution | Ursprungsspell | Varför |
|---|---|---|---|
| Solar • Axel | **Thunderhead** | Flux Bolt (Solar) | Kännbara åsknedslag på samma mål; fungerar mot boss. |
| Solar • Axel | **Helios Beam** | Flux Bolt (Solar) | Spelaren väljer om uppbyggda stacks ska bli en riskabel kanaliserad beam. |
| Solar • Axel | **Soulbrand** | Cinder Familiar (Solar) | Summon som reagerar på spelarens attacker, inte bara passiv skada. |
| Solar • Axel | **Judgment of Dawn** | Sun Lance (Solar) | Tung single-target finisher med tydligt execute-fönster. |
| Solar • Axel | **Dying Star** | Cinder Familiar (Solar) | Aktivt val att offra sin familiar för ett snyggt avslut. |
| Void • Jonatan | **Phantom Assault** | Rift Slash (Void) | Skuggkloner ger en avgränsad, högkvalitativ melee-VFX. |
| Void • Jonatan | **Shadow Ambush** | Phase Slip (Void) | Teleport påverkar hur nästa attack fungerar. |
| Void • Jonatan | **Psychic Collapse** | Entropy Mark (Void) | Spelaren väljer mellan kvarvarande DoT och att detonera mark. |
| Void • Jonatan | **Mindstorm** | Void Metamorphosis (Void) | Mark-ticks driver extraträffar under aktiv form, även på en boss. |
| Void • Jonatan | **Executioner's Veil** | Rift Slash (Void) | Skuggfinisher som aktiveras av både mark och låg HP. |
| Övriga klasser | **Warpath** | Pulse Sever (Impact) | Lyckad interrupt påverkar nästa slag; belönar spelskicklighet. |
| Övriga klasser | **Singularity Impact** | Gravity Hammer (Impact) | Ren trade-off: mindre AoE ger mycket tyngre precisionsslag. |
| Övriga klasser | **Vital Reversal** | Pulse Mend (Genesis) | Offensivt healande kan göra supportrollen aktiv och taktisk. |
| Övriga klasser | **Focused Fracture** | Fracture Spear (Eclipse) | Klassisk förberedelse + tung single-target payoff. |
| Övriga klasser | **Gravity Well** | Gravity Hammer (Impact) | Grupperar max två småfiender inför precisionsattack. |

## Fullständigt spellbibliotek

## Genesis – källmaterial

### Pulse Mend (GEN-01)

**Originalroll:** Direct healing.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Healer.

**Originalfunktion:** Heals a friendly target for 60 base health.

**Original cast / Flux / cooldown:** 1.5 sec cast · 16 Flux (18 with Vital Reversal) for Genesis

**JAC-tolkning (A):** Behåll tydlig räddningsheal. Offensiv variant kan hela 1–2 närliggande allierade i stället för hela laget.

**Källans kombination:** Vital Reversal → Resonance Guard
Damage an enemy to refill allies' existing Guard absorbs.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Vital Crescendo** — Hold Pulse Mend to extend its cast to 2.5 sec, increasing its direct healing by 78%. Only applies when healing an ally.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Behåll laddad, stark singel-heal; tydligt val mellan snabb räddning och längre cast.
- **Second Heart** — Pulse Mend also marks its target for 12 sec. If they fall to 30% health or lower, the mark is consumed to heal for at least 22 base health or 27% of their maximum health, whichever is higher.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop / talent):* Skydd mot plötslig HP-dipp; en engångsproc med tydlig ikon och intern spärr.
- **Vital Reversal** — Pulse Mend can now target enemies. Deals 23 base damage to that enemy and heals each injured ally for 22 base health. Also restores up to 22% of the capacity of their active Resonance Guard.
  - *JAC-förslag (A; ST + 2 allies; möjlig väg: Talent):* Offensiv heal: skada markerad fiende och hela högst två skadade allierade; fyll deras befintliga absorb.

---

### Resonance Guard (GEN-02)

**Originalroll:** Absorb shield.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Healer / support.

**Originalfunktion:** Shields yourself or an ally, absorbing up to 80 base damage for 8 sec. Damage is absorbed before health is lost.

**Original cast / Flux / cooldown:** Instant · 22 Flux · 32 sec cooldown

**JAC-tolkning (A):** Behåll den stora absorberande skölden. En nätverksvariant kan ge två andra allierade mindre sköldar.

**Källans kombination:** Guardian Network → Vital Cascade
Shield the entire team, then heal injured allies wherever they stand.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Guardian Network** — Resonance Guard also grants every other teammate an absorb shield with 42% of the main shield's capacity, regardless of their position.
  - *JAC-förslag (B; Support 3; möjlig väg: Talent):* Största skölden på huvudmålet; högst två andra allierade får en mindre kopia inom räckvidd.
- **Retaliation** — Damage absorbed by Resonance Guard is stored. When the shield breaks or expires, release that stored energy as damage against up to 3 nearby enemies.
  - *JAC-förslag (B; ST + 1; möjlig väg: Bossdrop):* Lagra absorberad skada och rikta mot angriparen, med högst ett sekundärmål.
- **Last Stand** — Once during Resonance Guard, prevent an otherwise lethal hit and restore the protected ally to at least 28% of maximum health. Consumes the shield's rescue effect.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Låt skölden rädda från ett dödande slag en gång; stor audiovisuell trigger.

---

### Vital Cascade (GEN-03)

**Originalroll:** Team healing.  **Måltyp (original):** Hela laget.  **Tänkbar JAC-roll:** Healer.

**Originalfunktion:** Heals the selected ally for 38 base health and each other injured teammate for about 30. Reaches allies anywhere on your team.

**Original cast / Flux / cooldown:** Instant · 32 Flux · 22 sec cooldown

**JAC-tolkning (B):** Låt första healen välja mål, med begränsad sekundär heal till 1–2 närmaste eller mest skadade allierade.

**Källans kombination:** Vital Cascade → Pulse Mend
Team-wide recovery, followed by focused rescue of the lowest-health ally.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Double Cascade** — After Vital Cascade, a second healing wave occurs 0.65 sec later, restoring 20 base health to each ally who is still injured.
  - *JAC-förslag (B; Support 3; möjlig väg: Talent):* Andra healvågen träffar samma 2–3 gruppmedlemmar med kort fördröjning.
- **Rejuvenating Orbit** — Allies healed by Vital Cascade gain a 6 sec healing effect that restores 5 base health every second.
  - *JAC-förslag (B; Support 2; möjlig väg: Talent):* Ersätt stor allierad AoE med heal-over-time på de två mest skadade mottagarna.
- **Life Transfer** — After Vital Cascade, move health from a healthy ally to the most injured teammate. Transfers at most 14% of the donor's maximum health and never reduces the donor below 55% health.
  - *JAC-förslag (B; Support 2; möjlig väg: Bossdrop):* Tydlig 2-målsöverföring där donatorn aldrig sjunker under säker HP-gräns.

---

### Stasis Seal (GEN-04)

**Originalroll:** Crowd control.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Healer / controller.

**Originalfunktion:** Incapacitates an enemy for up to 5 sec, preventing actions until the effect ends or damage breaks it. Bosses are immune; elites have a shorter duration.

**Original cast / Flux / cooldown:** Instant · 20 Flux · 24 sec cooldown

**JAC-tolkning (A):** Behåll kontroll mot vanliga fiender. Mot boss: kort störning eller sårbarhetsmarkör i stället för lång incapacitate.

**Källans kombination:** Stasis Seal → Vital Cascade
Control dangerous enemies while the team recovers.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Tranquility Wave** — Stasis Seal also incapacitates up to 5 nearby ordinary enemies for up to 2 sec. Additional targets must be in range and are freed when damaged; bosses remain immune.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Sprid den korta extra kontrollen till max två närliggande normalfiender, inte fem.
- **Mercy Bloom** — When the Stasis Seal ends or is broken, heal the most injured teammate for 24 base health.
  - *JAC-förslag (A; ST ally; möjlig väg: Talent):* När kontrollen går sönder eller tar slut får mest skadade allierad en rescue-heal.
- **Essence Siphon** — While Stasis Seal is active, restore 4 Flux to Genesis every second and heal the most injured teammate for 5 base health each second.
  - *JAC-förslag (B; ST ally; möjlig väg: Bossdrop):* Behåll resurs/heal per sekund så länge kontrollen håller; balansbryt om spell skadas loss.

---

### Vital Recall (GEN-05)

**Originalroll:** Healing recovery.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Healer / support.

**Originalfunktion:** Marks an ally for 4 sec. Cast again before the mark expires to restore 75% of health lost since marking, capped at 50% of the ally's maximum health.

**Original cast / Flux / cooldown:** Instant · 20 Flux · 36 sec cooldown

**JAC-tolkning (A):** Behåll återställning av nyligen förlorad hälsa; visa tidsfönster och återstående räddningspotential i UI.

**Källans kombination:** Vital Recall → Resonance Guard
Restore recently lost health and then protect against the next hit.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

### Soul Relay (GEN-06)

**Originalroll:** Linked protection.  **Måltyp (original):** 2 allierade.  **Tänkbar JAC-roll:** Support.

**Originalfunktion:** Select two different teammates to link for 10 sec. Transfer up to 26% of incoming health damage to the other ally without killing them, and share 28% of healing received with the other ally.

**Original cast / Flux / cooldown:** Instant · 22 Flux · 24 sec cooldown

**JAC-tolkning (B):** Behåll heal- och skadelänk för medvetet samspel. Visa tydligt vem som är länkad till vem.

**Källans kombination:** Soul Relay → Pulse Mend
Healing a linked ally also sends a smaller heal to their partner.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

## Impact – källmaterial

### Phase Rush (IMP-01)

**Originalroll:** Targeted charge.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee.

**Originalfunktion:** Charges toward an enemy and stops at melee range. Cannot pass through walls or other obstacles.

**Original cast / Flux / cooldown:** Instant · 14 Flux · 17 sec cooldown

**JAC-tolkning (A):** Målstyrd charge som stannar vid melee. Belöna direkt uppföljning med interrupt eller en komboattack.

**Källans kombination:** Phase Rush → Arc Strike
Close the gap and immediately start your two-hit melee combo.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Meteor Charge** — When Phase Rush reaches its target, unleash a kinetic blast dealing 20 base damage to nearby enemies, including the charged enemy.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Talent):* Riktad charge med närträff på max två fiender bredvid huvudmålet.
- **Relentless Pursuit** — If the enemy reached by Phase Rush dies within 3 sec, reset Phase Rush and allow another charge. Can refresh up to twice in one pursuit chain.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* En möjlig kill-reset i kort kedja; behåll hårt tak på antal resets.
- **Piercing Charge** — On reaching the target, send a kinetic shock through enemies lined up behind it, dealing 18 base damage to each eligible enemy in the path.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Vid landning går en chocklinje genom högst två bakomvarande mål; hinder stoppar.

---

### Arc Strike (IMP-02)

**Originalroll:** Melee combo.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee / rogue.

**Originalfunktion:** Strikes an enemy for 13 base damage. Use Arc Strike again within 4 sec to deal 16% more damage with the second strike and restore 3 Flux.

**Original cast / Flux / cooldown:** Instant · 10 Flux · Melee range

**JAC-tolkning (A):** Behåll första/andra slagets rytm; utveckling kan ge ett tredje cleave-slag mot högst två grannar.

**Källans kombination:** Arc Strike → Phase Rush
Attack one enemy; Relentless Pursuit can refresh the charge when that enemy dies.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Twin Arc** — Every third Arc Strike releases a wide frontal attack, dealing 65% of that strike's damage to up to 5 additional nearby enemies in front of you.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Var tredje melee-slag ger kort frontal cleave som bara hittar två extra fiender.
- **Overdrive** — The second Arc Strike of a combo becomes 3 rapid hits on the same target: one immediate strike and two delayed follow-ups. The combo's damage is split across the hits.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Splittra kombo-avslutet i tre snabba slag mot samma mål för tydlig rogue/warrior-känsla.
- **Kinetic Reprisal** — Completing an Arc Strike combo grants a 3 sec one-hit shield. It absorbs part of the next direct hit and retaliates against the attacker.
  - *JAC-förslag (A; ST counter; möjlig väg: Bossdrop):* Efter full kombo skyddas nästa direkta träff, och angriparen får riktad hämndträff.

---

### Pulse Sever (IMP-03)

**Originalroll:** Melee interrupt.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee / utility.

**Originalfunktion:** Interrupts an enemy that is casting a spell, locking its magic school for 3 sec and dealing 8 base damage. Has no interrupt effect if the target is not casting.

**Original cast / Flux / cooldown:** Instant · 10 Flux · 15 sec cooldown

**JAC-tolkning (A):** Tydlig interrupt med school lock. Evolutions belönar en lyckad interrupt mer än de ökar passiv skada.

**Källans kombination:** Pulse Sever (Warpath) → Arc Strike
A successful interrupt increases melee damage for 4 sec.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Echo Sever** — A successful Pulse Sever also interrupts up to 5 nearby non-boss enemies that are currently casting. Each additional interrupted enemy suffers a 2.5 sec school lock.
  - *JAC-förslag (B; 1 + 1; möjlig väg: Bossdrop):* Utöka lyckad interrupt till högst en annan fiende som faktiskt castar inom kort räckvidd.
- **Countershock** — A successful Pulse Sever releases a shockwave, dealing 15 base damage to enemies near the interrupted target.
  - *JAC-förslag (A; 1 + 1; möjlig väg: Talent):* Lyckad interrupt ger en kraftig smäll på caster och låg splash på en granne.
- **Warpath** — Successfully interrupting with Pulse Sever empowers your Arc Strike, Seismic Uppercut, Gravity Hammer and Phase Rush damage by 20% for 4 sec.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Lyckad interrupt laddar nästa tunga melee-attack; välj en tydlig spenderare framför flera buffs.

---

### Gravity Hammer (IMP-04)

**Originalroll:** Ground impact.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Melee / bruiser.

**Originalfunktion:** Choose a location to deal 37 base damage to enemies in the impact area. Ordinary enemies are knocked down briefly; elites and bosses resist the knockdown.

**Original cast / Flux / cooldown:** 0.6 sec cast · 30 Flux · 20 sec cooldown

**JAC-tolkning (A):** Koncentrera ett stort slag till målpositionen med max två bifångster; tyngd och knockback syns i VFX.

**Källans kombination:** Gravity Hammer → Arc Strike
Damage a group, then focus enemies at melee range.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Singularity Impact** — Gravity Hammer deals 65% more base damage in an area 40% smaller than normal. The concentrated impact no longer knocks enemies down.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Byt stor AoE mot exakt tung singelträff. Mindre radie ger tydlig trade-off.
- **Seismic Wave** — Gravity Hammer also releases 3 expanding shockwaves after impact, each dealing 8 base damage to enemies in its moving outer ring.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Tre visuella ringvågor; huvuddelen av skadan läggs på markerat mål och max två extras.
- **Gravity Well** — Gravity Hammer leaves a gravity field that pulses 4 times over 2.8 sec, dealing 6 base damage per pulse and pulling ordinary enemies toward its center. Bosses resist the pull.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Bossdrop):* Dra samman max två vanliga fiender; bossar påverkas av kort slow/debuff, inte pull.

---

### Seismic Uppercut (IMP-05)

**Originalroll:** Launch and slam.  **Måltyp (original):** 1 + liten yta.  **Tänkbar JAC-roll:** Melee.

**Originalfunktion:** Hits a nearby enemy for 25 base damage, then slams the area for another 18 base damage after 0.42 sec. Ordinary enemies are briefly incapacitated; elites and bosses remain grounded.

**Original cast / Flux / cooldown:** Instant · 27 Flux · 25 sec cooldown

**JAC-tolkning (B):** Stor singel-target uppercut med följdsmäll. Mot boss ersätt full launch med ett avbrytbart stagger-fönster.

**Källans kombination:** Seismic Uppercut → Gravity Hammer
Follow the delayed slam with another ground attack against clustered enemies.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

### Kinetic Rampart (IMP-06)

**Originalroll:** Projectile defense.  **Måltyp (original):** Projektilskydd i frontalzon.  **Tänkbar JAC-roll:** Melee / tank.

**Originalfunktion:** Raises a forward-facing barrier for up to 4 sec, blocking up to 3 incoming direct projectiles from its front. Recast or let it expire to fire stored kinetic damage at nearby enemies.

**Original cast / Flux / cooldown:** Instant · 24 Flux · 30 sec cooldown

**JAC-tolkning (B):** Behåll timingbaserad projektilblockering. Lagrad kraft avlossas mot markerat mål vid recast.

**Källans kombination:** Kinetic Rampart → Phase Rush
Block incoming projectiles, release stored shards, then re-engage.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

## Eclipse – källmaterial

### Crystal Bolt (ECL-01)

**Originalroll:** Ranged damage.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / caster.

**Originalfunktion:** Launches a crystal for 15 base damage and slows the target by 35% for 3 sec.

**Original cast / Flux / cooldown:** 1.3 sec cast · 11 Flux for Eclipse

**JAC-tolkning (A):** Behåll lättavläst projektil, slow och spelbar upprepning. Primär setup inför tungt, villkorat avslut.

**Källans kombination:** Crystal Bolt → Fracture Spear
The Bolt's Slow increases the Spear's damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Rapid Crystal** — Reduces Crystal Bolt's cast time from 1.3 sec to 0.88 sec. Every third Crystal Bolt may also be cast while moving.
  - *JAC-förslag (B; ST; möjlig väg: Talent):* Snabbare cast och var tredje möjlig i rörelse; stark känslomässig skillnad utan stor AoE.
- **Glacial Echo** — Crystal Bolt is followed 0.36 sec later by a second smaller hit on the same enemy, dealing 40% of the original Bolt's damage.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* En andra, mindre träff på samma mål med separat kristall-projektil.
- **Fracture Chain** — Every third Crystal Bolt releases additional crystal hits at up to 3 other nearby enemies, each dealing 38% of the original Bolt's damage.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Var tredje projektil studsar till högst två extra fiender; primärträffen förblir viktigast.

---

### Crystal Snare (ECL-02)

**Originalroll:** Area control.  **Måltyp (original):** Flera nära mål.  **Tänkbar JAC-roll:** Ranged / control.

**Originalfunktion:** Roots nearby enemies around the selected target for up to 3 sec and marks them as Chilled for 5 sec. Bosses resist the root but can still be marked.

**Original cast / Flux / cooldown:** Instant · 15 Flux · 18 sec cooldown

**JAC-tolkning (A):** Roota ett huvudmål; valbar evolution kan koppla in en närliggande fiende. Boss blir märkt, inte fastlåst.

**Källans kombination:** Crystal Snare → Fracture Spear
Root/Chill the target before using the heavy spear.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Deep Freeze / Ice Tomb** — Crystal Snare becomes a 4 sec single-target incapacitate instead of an area root. Works on elites; bosses remain immune to hard crowd control.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Gör root till single-target kontroll med tydligt isfängelse; bossar blir märkta/sårbara men inte stunnade.
- **Shatterfield** — When a Crystal Snare root expires, it releases 3 delayed frost pulses around the target, damaging and slowing nearby enemies.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Tre fördröjda pulser kring huvudmålet; högst två närliggande fiender tar sekundär skada.
- **Crystal Conduit** — Enemies rooted together by Crystal Snare are linked for 3 sec. A direct hit on one linked target also deals up to 24% of that hit's damage to other linked rooted targets, capped at 12 base damage each.
  - *JAC-förslag (A; 2 targets; möjlig väg: Bossdrop):* Länka högst två markerade fiender och kopiera en begränsad andel av direkta träffar.

---

### Fracture Spear (ECL-03)

**Originalroll:** Heavy ranged hit.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / caster.

**Originalfunktion:** Hurls a crystal spear for 32 base damage. Deals 30% more damage to a target that is Rooted, Slowed or Chilled.

**Original cast / Flux / cooldown:** 1.7 sec cast · 21 Flux for Eclipse · 12 sec cooldown

**JAC-tolkning (A):** Bevara tydlig laddning och bonus mot redan påverkade mål. Stark kandidat för bossprecision.

**Källans kombination:** Fracture Spear → Froststorm
With Shattering Storm selected, a Spear hit inside the storm triggers extra damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Focused Fracture** — Fracture Spear deals 92% more damage to targets that are Rooted, Slowed or Chilled, including marked bosses. Remains strictly single-target.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Behåll strikt single-target; belöna setup med slow/chill även på bossmarkerade mål.
- **Crystal Rupture** — Fracture Spear also explodes on impact, dealing 40% of the Spear's damage to up to 4 nearby enemies.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Fokuserad träff exploderar svagt till maximalt två fiender nära målet.
- **Riftbreaker** — Fracture Spear creates up to 4 delayed crystal eruptions in a line beyond its target. Each eruption damages and briefly slows enemies; obstacles stop the sequence.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Två små eruptioner i en riktad linje bakom målet, i stället för fyra stora.

---

### Froststorm (ECL-04)

**Originalroll:** Ground damage.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Ranged / controller.

**Originalfunktion:** Creates a froststorm at a chosen location for 4 sec. Deals 8 base damage in pulses about once per second and slows ordinary enemies caught inside.

**Original cast / Flux / cooldown:** 0.45 sec cast · 30 Flux · 24 sec cooldown

**JAC-tolkning (B):** Minska stormens radie och låt direkta träffar på mål inne i zonen skapa kontrollerad bonus.

**Källans kombination:** Froststorm → Crystal Bolt
With Shattering Storm selected, Bolt hits inside the storm trigger an extra burst.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Glacial Barrage** — Froststorm also calls down 3 additional crystal comets at positions inside the storm, each dealing 12 base damage in a small area.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Tre precisa kometer inne i den mindre frostzonen; prioritera zonens huvudmål.
- **Expanding Frost** — Froststorm lasts 6 sec instead of 4 and gradually expands its radius. It continues dealing its normal damage pulses throughout the extended duration.
  - *JAC-förslag (C; 1 + 2; möjlig väg: Talent):* Zonen växer lite och ger längre kontroll, men begränsa storlek och antal mål.
- **Shattering Storm** — Crystal Bolt or Fracture Spear hitting an enemy inside your Froststorm triggers an additional shatter pulse, dealing 7 base damage to nearby enemies.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Talent):* Direktträff på en fiende inne i zonen triggar shatter-puls; använd intern trigger-cooldown.

---

### Crystal Mirror (ECL-05)

**Originalroll:** Single-hit protection.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Support / caster.

**Originalfunktion:** Places a crystal mirror on yourself or an ally. Blocks the next eligible direct attack and launches retaliatory crystals at the attacker. Does not block damage-over-time or ground effects.

**Original cast / Flux / cooldown:** Instant · 23 Flux · 28 sec cooldown

**JAC-tolkning (B):** Sköld mot en direktträff som svarar med en riktad kristallretaliation. Tydlig reflektionsanimation.

**Källans kombination:** Crystal Mirror → Fracture Spear
Protect an ally while you complete a longer cast.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

### Avalanche (ECL-06)

**Originalroll:** Directional area damage.  **Måltyp (original):** Bred korridor.  **Tänkbar JAC-roll:** Ranged / control.

**Originalfunktion:** Sends a traveling wall of ice in the chosen direction, damaging and pushing ordinary enemies. Leaves a short damaging trail that slows enemies; bosses resist the push.

**Original cast / Flux / cooldown:** Instant · 35 Flux · 30 sec cooldown

**JAC-tolkning (C):** Gör en smal, stark tryckvåg. Ett tungt huvudmål drabbas alltid, småfiender kan tryckas tillbaka.

**Källans kombination:** Avalanche → Froststorm
Push ordinary enemies and control the ground in front of the team.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

## Solar – källmaterial

### Flux Bolt (SOL-01)

**Originalroll:** Ranged damage combo.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Deals 17 base Solar damage. Every third hit on the same enemy within 6 sec adds a burst of 6 base damage.

**Original cast / Flux / cooldown:** 1.5 sec cast · 10 Flux for Solar

**JAC-tolkning (A):** Behåll träffräknaren: tredje träffen laddar nästa effekt. Kan enkelt få blixt-, eld- eller arcane-tema.

**Källans kombination:** Flux Bolt → Solar Ascension
Each qualifying offensive Solar spell can consume a sigil for extra skybeam damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Corona Volley** — Every third successful Flux Bolt hit sends additional Solar bolts to up to 3 other enemies near the original target, dealing 13 base damage each.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Var tredje Bolt skickar små gnistor till högst två närliggande fiender.
- **Thunderhead** — Every third Flux Bolt hit creates a storm over the target, striking it 3 additional times over about 1.6 sec.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Behåll tre extra nedslag centrerade på samma mål; fungerar mycket bra i en bossfight.
- **Helios Beam** — After 3 qualifying Flux Bolt hits on the same enemy, hold the next Flux Bolt to channel a focused beam for up to 2 sec. The beam deals repeated damage that grows with each tick; release early to stop.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Tre byggande hits öppnar en valbar kanalisering mot ett mål; risk för avbruten cast är trade-off.

---

### Sun Lance (SOL-02)

**Originalroll:** Ranged finisher.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Strikes an enemy for 27 base Solar damage. Deals 18% more damage if the target is below 35% health.

**Original cast / Flux / cooldown:** 1.8 sec cast · 16 Flux for Solar

**JAC-tolkning (A):** Behåll tung finisher vid låg HP. Visuellt 'skybeam' när utförandet lyckas. Bra för bossar.

**Källans kombination:** Sun Lance → Solar Ascension
Use a high-damage Lance to consume one empowered Solar sigil.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Judgment of Dawn** — When Sun Lance hits an enemy below 35% health, it deals 90% more damage than its normal base hit and triggers a finishing Solar beam from above.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Låg-HP execute på ett enda mål med separat himmelsstråle som avslut.
- **Scorching Lance** — Sun Lance burns its target for 5 base damage every 2 sec for 8 sec. If the burning target dies, it explodes and spreads a shorter Solar burn to nearby enemies.
  - *JAC-förslag (B; ST -> 1; möjlig väg: Talent):* Behåll burning DoT; vid död sprids den bara till en närmaste fiende.
- **Split Lance** — After Sun Lance hits, launch smaller follow-up lances at up to 2 nearby enemies that are already injured. Each deals 38% of the primary Lance's damage.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Två mindre finisher-spjut söker enbart redan skadade sidomål, aldrig okontrollerad kedja.

---

### Zenith Crash (SOL-03)

**Originalroll:** Placed area damage.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Ranged / caster.

**Originalfunktion:** Choose a ground location. After a 2 sec cast, a Solar pillar deals 38 base damage to enemies in the area. Secondary targets take reduced damage.

**Original cast / Flux / cooldown:** 2 sec cast · 30 Flux · 18 sec cooldown

**JAC-tolkning (B):** Låt pelaren låsa mot målet efter kort cast, med mindre nedslagszon och högst två sidoträffar.

**Källans kombination:** Zenith Crash → Solar Ascension
A hit from the placed Solar pillar can trigger an Ascension skybeam.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Solar Aftershock** — Zenith Crash triggers a second impact at the same location 0.85 sec later, dealing 45% of the main pillar's damage in a smaller area.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Bossdrop):* Låt mindre andra pelaren träffa samma markerade område efter kort fördröjning.
- **Burning Ground** — Zenith Crash leaves a burning field that deals 5.5 base damage to enemies in the area once per second for 3 sec.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Gör en liten brinnande zon vid målet; stark effekt om fienden står kvar snarare än bred AoE.
- **Prism Cross** — Zenith Crash releases 4 diagonal Solar beams from its impact point. Each beam damages enemies along its path and stops at solid obstacles.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Behåll fyra korsstrålar som stark VFX, men skada huvudsakligen mål samt max två i linjen.

---

### Cinder Familiar (SOL-04)

**Originalroll:** Summoned attacker.  **Måltyp (original):** Valda fienden + närliggande.  **Tänkbar JAC-roll:** Ranged / pet.

**Originalfunktion:** Summons one Solar familiar for 12 sec. It follows you and automatically attacks your selected enemy or another nearby enemy roughly every 0.86 sec.

**Original cast / Flux / cooldown:** Instant · 25 Flux · 35 sec cooldown

**JAC-tolkning (A):** Låt följeslagaren prioritera markerad fiende och förstärka spelarens aktiva träffar i stället för ren auto-AoE.

**Källans kombination:** Cinder Familiar (Soulbrand) → Flux Bolt
Your Bolt hits on the familiar's marked target cause additional Solar discharges.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Phoenix Dive** — While Cinder Familiar is active, it dives through enemies near its target roughly every 2.7 sec, damaging them and leaving a short damaging trail.
  - *JAC-förslag (B; 1 + 1; möjlig väg: Bossdrop):* Familiar dyker mot utpekat mål och passerar maximalt en granne; försök begränsa skärmbrus.
- **Soulbrand** — Cinder Familiar focuses on one enemy and attacks it more frequently. Your Flux Bolt, Sun Lance, Zenith Crash and Chain Tempest hits on that enemy trigger extra Solar damage.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Markera ett prioriterat mål; spelarens aktiva attacker får följeslagaren att proc:a på det målet.
- **Dying Star** — Recast Cinder Familiar while it is active to consume it in a targeted supernova, dealing 35 base damage to nearby enemies.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Bossdrop):* Återkalla följeslagaren för kraftig riktad explosion; valbart lägre splash på max två.

---

### Solar Ascension (SOL-05)

**Originalroll:** Empowered Solar spells.  **Måltyp (original):** Nästa 3 offensiva spells.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Grants 3 Solar sigils for up to 12 sec. Each of your next 3 offensive Solar spells consumes one sigil to deal 15 additional base damage to its target.

**Original cast / Flux / cooldown:** Instant · 28 Flux · 38 sec cooldown

**JAC-tolkning (A):** Tydliga tre laddningar och sinsemellan valbara spenderare; använd som kombinationsmotor snarare än bara damage-buff.

**Källans kombination:** Solar Ascension → Chain Tempest
Trigger a sigil while chaining damage through multiple enemies.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

### Chain Tempest (SOL-06)

**Originalroll:** Chain lightning.  **Måltyp (original):** Upp till 5, eller samma.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Hits an enemy for 27 base Solar damage, then chains to up to 4 other nearby enemies. If no other enemy is in range, strikes the original target 3 more times.

**Original cast / Flux / cooldown:** Instant · 25 Flux for Solar · 26 sec cooldown

**JAC-tolkning (B):** Mot få fiender slår blixten tillbaka på huvudmålet. Mot grupp studsar den maximalt två gånger.

**Källans kombination:** Chain Tempest → Cinder Familiar
Use repeated ranged strikes while the familiar continues its automatic attacks.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

## Void – källmaterial

### Rift Slash (VOI-01)

**Originalroll:** Melee shadow damage.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee / rogue.

**Originalfunktion:** Strikes an enemy with two Void blades for 21 base damage. Hitting an enemy affected by your Entropy Mark also restores 3 Flux.

**Original cast / Flux / cooldown:** Instant · 13 Flux · 3 sec cooldown

**JAC-tolkning (A):** Snabb dubbelbladsträff som bygger vidare på mark och teleport. Extra slag viktigare än passiv AoE.

**Källans kombination:** Entropy Mark → Rift Slash
Rift Slash on a marked enemy restores 3 Flux; Devouring Pact can also heal you.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Phantom Assault** — Every third Rift Slash creates a shadow clone behind the struck enemy. The clone lands 2 additional delayed attacks, each dealing 46% of the original Slash's damage.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Var tredje närstridsträff ger två skuggklon-slag på samma mål; stor visuell identitet.
- **Umbral Cyclone** — Every third Rift Slash also strikes up to 10 other nearby enemies with a broad twin-blade cyclone, dealing 67% of that Slash's damage to each.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Behåll twin-blade swirl men träffa max två närliggande mål, inte tio.
- **Executioner's Veil** — Rift Slash against an Entropy-marked enemy at or below 30% health triggers 3 delayed finishing strikes. Can trigger once every 8 sec.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Tre fördröjda avslut mot märkt låg-HP-fiende; intern cooldown bevarar timing.

---

### Entropy Mark (VOI-02)

**Originalroll:** Damage over time.  **Måltyp (original):** 1 fiende; kan spridas.  **Tänkbar JAC-roll:** Rogue / shadow.

**Originalfunktion:** Marks an enemy, dealing 5 base Void damage every 2 sec for 12 sec. Rift Slash against a marked enemy also restores 3 Flux.

**Original cast / Flux / cooldown:** Instant · 15 Flux · 12 sec duration

**JAC-tolkning (A):** Behåll aktiv mark med tydlig visuell timer; explosion via recast ger spelaren beslut om skada nu eller senare.

**Källans kombination:** Rift Slash → Entropy Mark
With Psychic Collapse, build mark ticks then consume the mark for area damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Contagion** — When an enemy affected by your Entropy Mark dies, spread the mark to up to 3 nearby unmarked enemies. The infection can spread through up to 3 generations.
  - *JAC-förslag (B; ST -> 1; möjlig väg: Talent):* Märket kan hoppa till EN närliggande fiende vid död, med max en vidare spridning.
- **Psychic Collapse** — After Entropy Mark has dealt damage twice, recast it for no Flux to consume the mark and deal 32 base damage to the target and 17 to nearby enemies. The recast starts a 3 sec cooldown.
  - *JAC-förslag (A; ST + 1; möjlig väg: Talent):* Recast konsumerar mark för tydlig singel-target explosion, med valbar liten sidoträff.
- **Devouring Pact** — Damaging an Entropy-marked enemy with Rift Slash also heals you for up to 23% of the damage dealt, capped at 13 health per trigger. Can trigger at most once every 0.75 sec.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Uthållighet genom attacker mot markerat mål; behåll heal-tak och intern cooldown.

---

### Phase Slip (VOI-03)

**Originalroll:** Placed teleport.  **Måltyp (original):** Själv / kort distans.  **Tänkbar JAC-roll:** Melee / rogue.

**Originalfunktion:** Teleport to a chosen valid position within short range. Cannot teleport through solid walls or into occupied space.

**Original cast / Flux / cooldown:** Instant · 16 Flux · 23 sec cooldown

**JAC-tolkning (A):** Behåll positioneringsverktyg med tydlig landningsplats. Nästa melee-slag kan få skuggklon-uppföljning.

**Källans kombination:** Phase Slip → Rift Slash
Shadow Ambush adds 3 delayed strikes to your next Slash.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Shadow Ambush** — For 4 sec after Phase Slip, your next Rift Slash triggers 3 extra delayed shadow strikes against its target, each dealing 40% of the original Slash's damage.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Teleportslag får tre extra snabba skuggträffar på samma mål under kort tidsfönster.
- **Rift Echo** — Phase Slip damages enemies along its actual teleport path with 5 delayed shadow echoes. Each echo deals 8 base damage in a small area.
  - *JAC-förslag (B; Högst 2; möjlig väg: Bossdrop):* Synliga ekon längs teleportsträckan, med skada mot max två faktiskt passerade fiender.
- **Veilwalk** — After Phase Slip, gain a 2.5 sec shadow veil. The next direct hostile attack against you passes through harmlessly and consumes the protection.
  - *JAC-förslag (A; Self; möjlig väg: Bossdrop):* Efter reposition undvik EN inkommande direkt attack; läsbar 'dodge'-feedback.

---

### Void Metamorphosis (VOI-04)

**Originalroll:** Combat transformation.  **Måltyp (original):** Melee cleave + DoT.  **Tänkbar JAC-roll:** Melee / shadow.

**Originalfunktion:** Transform into a Void combat form for 8 sec. Rift Slash gains extra reach and damages nearby enemies, while Entropy Mark deals 27% more damage with each tick.

**Original cast / Flux / cooldown:** Instant · 23 Flux · 45 sec cooldown

**JAC-tolkning (A):** Kort men markant transformation med ny slagprofil. För bossar behövs utväg som inte kräver adds-kills.

**Källans kombination:** Void Metamorphosis → Entropy Mark
Marked ticks gain 27% damage; Mindstorm calls additional psychic spears.

**Evolutions i källan (alla effekter ordagrant bevarade):**

- **Dreadblade Form** — During Void Metamorphosis, Rift Slash gains greater reach. Every third Slash also sends out damaging blade arcs that hit other nearby enemies.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Ökad räckvidd mot huvudmål, var tredje swing kan träffa två grannar.
- **Mindstorm** — While transformed, each damage tick from your Entropy Mark calls down an additional psychic spear, dealing 9 base damage to the marked enemy.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Varje mark-tick i form triggar ett riktat psykiskt spjut på samma fiende; bossvänligt.
- **Soul Devourer** — While transformed, deaths of enemies affected by your Entropy Mark heal you for 14 health and extend the form by 1 sec, up to 4 extra sec. The form ends with a damaging Void blast.
  - *JAC-förslag (B; ST / kill; möjlig väg: Bossdrop):* Behåll heal/förlängning vid död, men skapa bossalternativ (t.ex. markkonsumtion) med samma hårda förlängningstak.

---

### Abyssal Rift (VOI-05)

**Originalroll:** Placed area damage.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Shadow / control.

**Originalfunktion:** Open a rift at a chosen location for 4 sec. It damages nearby enemies in repeated pulses, can absorb up to 3 eligible hostile projectiles, then implodes for additional damage.

**Original cast / Flux / cooldown:** Instant · 28 Flux · 32 sec cooldown

**JAC-tolkning (B):** Mindre rift som blockerar projektiler, markerar zon och imploderar på huvudmål. Ge två tydliga funktioner.

**Källans kombination:** Abyssal Rift → Dark Pact
Control a packed area, then land three targeted spears.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

### Dark Pact (VOI-06)

**Originalroll:** Health-sacrifice finisher.  **Måltyp (original):** 1 mål + splash.  **Tänkbar JAC-roll:** Shadow / caster.

**Originalfunktion:** Sacrifice up to 12% of your maximum health without killing yourself. Call down 3 staggered Void spears on an enemy, each also damaging nearby enemies.

**Original cast / Flux / cooldown:** Instant · 23 Flux · 30 sec cooldown

**JAC-tolkning (B):** Behåll hälsa-som-kostnad och tre tunga spjut mot huvudmålet; liten sidoträff endast som variant.

**Källans kombination:** Dark Pact → Entropy Mark
Sustain damage with a mark while planning the next high-cost finisher.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

## Kombinationsrecept

Detta är spelmekaniska förslag som går att prototypa separat. Enskilda spells ska förbli användbara utan specifikt team.

### C01 · Entropy Mark → Rift Slash + Devouring Pact

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [MARKED] + melee hit
- **Payoff:** Skuggslag mot markerad fiende återställer resurs och kan läka spelaren.
- **Mål:** 1 mål
- **Att bevaka:** Bygg spelkänsla runt mark → belönad träff.

### C02 · Entropy Mark → Psychic Collapse

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [DOT_2_TICKS] + recast
- **Payoff:** Låt marken ticka två gånger, konsumera den sedan för riktad explosion.
- **Mål:** 1 mål + ev. 1
- **Att bevaka:** Beslut mellan fortsatt DoT och direkt burst.

### C03 · Phase Slip → Shadow Ambush + Rift Slash

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [TELEPORTED] + next melee
- **Payoff:** Teleport skapar ett kort fönster där nästa slag får tre skuggträffar.
- **Mål:** 1 mål
- **Att bevaka:** Mycket tydlig rogue-identitet med bra VFX.

### C04 · Void Metamorphosis → Entropy Mark + Mindstorm

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [FORM_ACTIVE] + DOT tick
- **Payoff:** Varje mark-tick under formen skjuter ett extra mentalt spjut mot samma mål.
- **Mål:** 1 mål
- **Att bevaka:** Fungerar även mot boss utan minions.

### C05 · Flux Bolt → Thunderhead

- **Spelstil:** Solar / Shaman · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [HIT_3]
- **Payoff:** Var tredje träff kallar ned tre uppföljande åsknedslag på samma fiende.
- **Mål:** 1 mål
- **Att bevaka:** Uppbyggnad och payoff syns lätt.

### C06 · Cinder Familiar → Soulbrand + Flux Bolt

- **Spelstil:** Solar / Shaman · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [PET_MARKED] + spell hit
- **Payoff:** Direktträffar på familiarens prioriterade mål triggar extra familiar-attacker.
- **Mål:** 1 mål
- **Att bevaka:** Pet får en aktiv roll i rotationen.

### C07 · Solar Ascension → Sun Lance / Judgment of Dawn

- **Spelstil:** Solar / Shaman · **Ursprung:** Källfil + komboförslag · **Prioritet:** A
- **Trigger:** [CHARGE_AVAILABLE] + execute
- **Payoff:** Spara en laddning till en tung finisher när bossen kommer under HP-tröskeln.
- **Mål:** 1 mål
- **Att bevaka:** Tydligt beslut när sista sigilen ska användas.

### C08 · Crystal Snare → Fracture Spear / Focused Fracture

- **Spelstil:** Eclipse / Mage · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [CHILLED] + heavy cast
- **Payoff:** Kontroll eller debuff ökar värdet på en tung precisionsprojektil.
- **Mål:** 1 mål
- **Att bevaka:** Boss får debuff utan att frysas fast.

### C09 · Froststorm → Fracture Spear / Shattering Storm

- **Spelstil:** Eclipse / Mage · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [IN_ZONE] + direct hit
- **Payoff:** Direktträff på zonmarkerat mål utlöser en kontrollerad isexplosion.
- **Mål:** 1 mål + ev. 2
- **Att bevaka:** Internt trigger-tak för att undvika proc-spam.

### C10 · Phase Rush → Pulse Sever

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag · **Prioritet:** A
- **Trigger:** [DASH_ARRIVAL] + CASTING
- **Payoff:** Ladda fram till en caster och avbryt den direkt på nära håll.
- **Mål:** 1 mål
- **Att bevaka:** Ingen gratis interrupt vid dash: spelaren trycker nästa förmåga.

### C11 · Pulse Sever / Warpath → Arc Strike / Overdrive

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag · **Prioritet:** A
- **Trigger:** [INTERRUPT_SUCCESS] + next melee
- **Payoff:** Lyckad interrupt laddar nästa komboavslut för extra slag.
- **Mål:** 1 mål
- **Att bevaka:** Bygger skicklighetsbelöning snarare än konstant buff.

### C12 · Gravity Hammer / Gravity Well → Zenith Crash

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** A
- **Trigger:** [PULLED] + placed strike
- **Payoff:** När småfiender dragits mot huvudmålet landar en tung himmelsattack.
- **Mål:** 1 mål + högst 2
- **Att bevaka:** Boss dras inte, men kan märkas för precisionsnedslag.

### C13 · Pulse Mend / Vital Reversal → Resonance Guard

- **Spelstil:** Genesis / Healer · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [ENEMY_HIT] + SHIELDED
- **Payoff:** Offensiv heal fyller på en del av allierades aktiva absorb.
- **Mål:** 1–2 allierade
- **Att bevaka:** Kan passa offensivt support-kit.

### C14 · Soul Relay → Pulse Mend

- **Spelstil:** Genesis / Healer · **Ursprung:** Källfil · **Prioritet:** B
- **Trigger:** [LINKED_ALLIES] + heal
- **Payoff:** En heal på ena länkade allierade delar en mindre heal till den andra.
- **Mål:** 2 allierade
- **Att bevaka:** Visuell länk måste vara läsbar.

### C15 · Vital Recall → Resonance Guard

- **Spelstil:** Genesis / Healer · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [RESTORED_HP] + protect
- **Payoff:** Rädda nyligen förlorad hälsa och ge direkt därefter absorb mot uppföljningssmäll.
- **Mål:** 1 allierad
- **Att bevaka:** Högt defensivt värde; undvik permanent immunitet.

### C16 · Crystal Snare → Chain Tempest

- **Spelstil:** Eclipse + Solar · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [CONTROLLED_OR_CHILLED] + chain hit
- **Payoff:** Blixten söker märkt huvudmål och kan studsa till en enda granne.
- **Mål:** 1 + 1
- **Att bevaka:** Gör status [CONTROLLED] generell, inte låst till frost.

### C17 · Entropy Mark → Cinder Familiar / Soulbrand

- **Spelstil:** Void + Solar · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** A
- **Trigger:** [MARKED] + companion hit
- **Payoff:** Familiaren prioriterar fienden som lagkamraten markerat och ger bonusattack vid träff.
- **Mål:** 1 mål
- **Att bevaka:** Universaliserad mark; kräver inte att exakt Void finns.

### C18 · Crystal Conduit → Arc Strike / Overdrive

- **Spelstil:** Eclipse + Impact · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [LINKED_ENEMIES] + combo hit
- **Payoff:** En tung närstridskombo på ett länkat mål ger liten delad effekt på dess partner.
- **Mål:** 2 mål
- **Att bevaka:** Tak på kopierad skada för balans.

### C19 · Resonance Guard → Dark Pact

- **Spelstil:** Genesis + Void · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [SHIELDED] + HP sacrifice
- **Payoff:** Skydda castern mot inkommande skada under förberedelsen av en riskfylld HP-finisher.
- **Mål:** 1 allierad + 1 fiende
- **Att bevaka:** Absorb ska INTE ta bort den egna HP-kostnaden.

### C20 · Crystal Mirror → Helios Beam

- **Spelstil:** Eclipse + Solar · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** A
- **Trigger:** [BLOCK_NEXT_HIT] + channel
- **Payoff:** En reflexsköld gör en riskabel, riktad beam-cast möjlig i ett kort bossfönster.
- **Mål:** 1 allierad + 1 fiende
- **Att bevaka:** Undvik att kanaliseringen blir oavbrytbar.

### C21 · Stasis Seal / Mercy Bloom → Phase Rush / Arc Strike

- **Spelstil:** Genesis + Impact · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [CC_END] + engage
- **Payoff:** När kontrollen bryts får support en rescue-heal samtidigt som melee öppnar kombo.
- **Mål:** 1 fiende + 1 allierad
- **Att bevaka:** Avslutas av inkommande skada: uppmuntrar timing.

### C22 · Entropy Mark → Gravity Well / Gravity Hammer

- **Spelstil:** Void + Impact · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [MARKED] + controlled burst
- **Payoff:** Den tunga attacken fokuserar markerat mål; högst två grannar dras in kort.
- **Mål:** 1 + 2
- **Att bevaka:** Visuellt imponerande men ska inte kräva stor mobpack.

### C23 · Flux Bolt / Thunderhead → Sun Lance / Judgment of Dawn

- **Spelstil:** Solar / Shaman · **Ursprung:** JAC-förslag · **Prioritet:** A
- **Trigger:** [PROC_READY] + LOW_HP
- **Payoff:** Spara laddad åskstorm och avsluta med en single-target himmelsstråle.
- **Mål:** 1 mål
- **Att bevaka:** Spelaren måste välja när proccen konsumeras.

### C24 · Arc Strike / Kinetic Reprisal → Phase Rush

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag · **Prioritet:** B
- **Trigger:** [SHIELD_CONSUMED] + re-engage
- **Payoff:** Efter att en kort kombo-sköld stoppat ett slag kan en charge återta initiativet.
- **Mål:** 1 fiende
- **Att bevaka:** Fördela power budget mellan skydd och offense.

## Mekaniska triggers (arbetsordlista)

- **[MARKED]** – Markerat prioriterat mål. *Referens:* Entropy Mark, Soulbrand. *Payoff:* Extra träff, lifesteal, spender. *Att bevaka:* Generisk markör ska kunna delas mellan tematiska kit..
- **[CHILLED]** – Sänkt hastighet / frostmark. *Referens:* Crystal Bolt, Crystal Snare. *Payoff:* Hård single-target attack får bonus. *Att bevaka:* På boss bevaras mark, inte root..
- **[CASTING]** – Fiende kanaliserar eller castar. *Referens:* Pulse Sever, Echo Sever. *Payoff:* Interrupt / reaktiv buff. *Att bevaka:* Giltig cast måste finnas..
- **[HIT_3]** – Tredje lyckade träff inom ett fönster. *Referens:* Flux Bolt, Rift Slash. *Payoff:* Storm, klon, cleave. *Att bevaka:* Visa stacks i HUD eller spellikon..
- **[LOW_HP]** – Målet under execute-tröskel. *Referens:* Sun Lance, Executioner's Veil. *Payoff:* Finisher / burst. *Att bevaka:* Bossgränser kan balanseras separat..
- **[SHIELDED]** – Aktiv absorb på allierad. *Referens:* Resonance Guard, Vital Reversal. *Payoff:* Fyll absorb / counterattack. *Att bevaka:* Skilj från healing av HP..
- **[IN_ZONE]** – Mål inne i aktiv markzon. *Referens:* Froststorm, Abyssal Rift. *Payoff:* Direktträff kan utlösa efterpuls. *Att bevaka:* Intern cooldown hindrar proc-loopar..
- **[DOT_TICK]** – Periodisk skada träffar mål. *Referens:* Entropy Mark, Mindstorm. *Payoff:* Ytterligare riktad attack. *Att bevaka:* Ett mark per mål kan hjälpa tydlighet..
- **[TELEPORTED]** – Spelaren har just repositionerat. *Referens:* Phase Slip / Shadow Ambush. *Payoff:* Empower nästa melee-slag. *Att bevaka:* Kort och tydligt tidsfönster..
- **[INTERRUPT_SUCCESS]** – Lyckat avbrott av riktig cast. *Referens:* Pulse Sever / Warpath. *Payoff:* Empower nästa attack. *Att bevaka:* Undvik belöning på tom interrupt..
- **[PET_MARKED]** – Summon har prioriterat mål. *Referens:* Cinder Familiar / Soulbrand. *Payoff:* Player hit triggar familiar. *Att bevaka:* Summon ska även fungera fristående..
- **[FORM_ACTIVE]** – Tillfällig transformation aktiv. *Referens:* Void Metamorphosis. *Payoff:* Slagprofil eller DoT förändras. *Att bevaka:* Ha stark men avgränsad duration..
- **[LINKED]** – Två allierade eller fiender kopplade. *Referens:* Soul Relay, Crystal Conduit. *Payoff:* Dela heal eller capped damage. *Att bevaka:* Klar länk-VFX och skydd mot proc-loopar..

## Möjliga utvecklingssystem – inte avgjort

**Talentmodell:** spelaren väljer ett modifierande beteende per spell och kan byta.

**Bossdropmodell:** bossloot låser upp en ny utvecklingsvariant som sedan kan väljas.

**Hybridmodell:** bossdrops låser upp nya spelstilar medan talents avgör vald aktiv evolution.

Bestäm progressionsmodellen efter att ett litet antal varierade spelbara prototyper har testats. Originalvärden från Energy Arena ska inte användas som JAC-balans utan separat test.
