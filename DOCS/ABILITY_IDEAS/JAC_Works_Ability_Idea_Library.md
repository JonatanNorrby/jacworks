# JAC Works — Unified Skill & Evolution Idea Library

**Canonical idea library · Draft inspiration, not accepted design or an implementation request.**

This combines Chris (Christoffer)'s Project Energy / Energy Arena source mechanics, the PR #12 JAC reinterpretations and combos, and our documented JAC brainstorms. Source names, class labels, numerical values, priorities, suggested acquisition routes and prototype favorites are historical reference or proposals. None establishes JAC class structure, progression, balance, talents, crafting, drops or unlock rules. No acquisition model is selected here. Hybrid concepts below mean combinations of ideas, never an acquisition model.

## Browse and status

- [Unified index](#unified-index): every source ability, evolution, combination and JAC idea in one searchable table.
- [Categories and overlaps](#categories-and-overlaps): browse motifs across origins.
- [Earlier JAC ideas](#earlier-jac-ideas): full mutation and interview entries with base relationships.
- [Combination and speculative hybrid ideas](#combination-and-speculative-hybrid-ideas).
- [Preserved Energy / PR #12 detail](#preserved-energy-detail): original effects, JAC adaptations, 24 combos and 15 historical favorites.
- [Workbook](JAC_Works_Ability_Evolution_Library.xlsx): original six sheets retained; Unified Index and JAC Ideas are companion views of this Markdown.

Stable IDs: existing GEN/IMP/ECL/SOL/VOI IDs and C01–C24 stay unchanged; `-E01`–`-E03` identify each source evolution in its original order. `JAC-B` names base-ability contexts, `JAC-M` earlier named mutations, `JAC-I` interview concepts, `JC` earlier combination suggestions and `H` newly speculative hybrids. IDs are documentation keys, not runtime identifiers. Never renumber or reuse retired IDs. Base-context rows are navigation aids, not additional invented abilities. A link means “derived from”, “combined with” or “similar motif”; it does not assert compatibility, equivalence or accepted kit membership.

## Provenance and scope

- Chris's source is identified by the imported library as **Energy_Arena_Spells_Evolutions_Descriptions_v2.xlsx**, source update **2026-10-16**. The raw upstream file is not in this checkout; source fidelity here means fidelity to the material merged in [PR #12](https://github.com/JonatanNorrby/jacworks/pull/12), main `4d4e326`. Original source effects remain verbatim below; JAC interpretations retain their separate labels. C01–C24 retain their individual source-versus-JAC origin labels; do not attribute all 24 to Chris.
- [Earlier mutation draft](../SKILL_MUTATION_CRAFTING_PROPOSALS.md), introduced in `c7d2b20`: all 54 named mutation ideas and three combination examples are incorporated. Recipe item names are aliases for these ideas, not extra abilities; recipes/economy stay historical and undecided.
- [Axel interview](../DESIGN_INTERVIEW_AXEL.md): four skeleton variants, two Snowball/Frostbite build examples and a tactical crystal payoff are indexed as seven concrete concepts. Mage/Poison Wizard archetypes and broad hybrid-role preferences remain interview context rather than fabricated skills.
- [Jonatan interview](../GAME_DESIGN_INTERVIEW_JONATAN.md), [Chris interview](../GAME_DESIGN_INTERVIEW_CHRISTOFFER.md), [questionnaire](../GAME_DESIGN_QUESTIONNAIRE.md), [prototype scope](../PROTOTYPE_01.md), [branch audit](../BRANCH_CONSOLIDATION_AUDIT.md), and [ADRs](../ADR/README.md) inform context, not additional approved library mechanics. Historical proposal history was checked; the original mutation document contains the same named set. GitHub returned no issues (open or closed) during this review; open PRs #9 and #11 concern prototype presentation/Labs, not approval of these ideas.
- Accepted ADRs are the durable decision log; Proposed ADRs and interviews are discussion inputs. Any later durable decision must follow the [ADR workflow](../ADR/README.md). Existing accepted prototype extensions remain separate from these draft ideas.

**Indexed ideas: 182** = 30 source bases + 60 source evolutions + 24 preserved combos + 54 earlier JAC mutations + 7 interview concepts + 3 earlier JAC combinations + 4 speculative hybrids. The 25 JAC base contexts below are excluded from this count. The 30 existing per-base source-combination notes, 90 JAC adaptation annotations and 15 favorites are preserved references, not additional unique entries.

## Unified index

| ID / detail | Name | Kind → base / participants | Tags | Origin | Status |
|---|---|---|---|---|---|
| [GEN-01](#gen-01) | Pulse Mend | base → — | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-01-E01](#gen-01-e01) | Vital Crescendo | evolution → [GEN-01](#gen-01) | healing, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-01-E02](#gen-01-e02) | Second Heart | evolution → [GEN-01](#gen-01) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-01-E03](#gen-01-e03) | Vital Reversal | evolution → [GEN-01](#gen-01) | healing, protection | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-02](#gen-02) | Resonance Guard | base → — | protection | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-02-E01](#gen-02-e01) | Guardian Network | evolution → [GEN-02](#gen-02) | protection | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-02-E02](#gen-02-e02) | Retaliation | evolution → [GEN-02](#gen-02) | protection, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-02-E03](#gen-02-e03) | Last Stand | evolution → [GEN-02](#gen-02) | healing, protection | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-03](#gen-03) | Vital Cascade | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-03-E01](#gen-03-e01) | Double Cascade | evolution → [GEN-03](#gen-03) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-03-E02](#gen-03-e02) | Rejuvenating Orbit | evolution → [GEN-03](#gen-03) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-03-E03](#gen-03-e03) | Life Transfer | evolution → [GEN-03](#gen-03) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-04](#gen-04) | Stasis Seal | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-04-E01](#gen-04-e01) | Tranquility Wave | evolution → [GEN-04](#gen-04) | control, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-04-E02](#gen-04-e02) | Mercy Bloom | evolution → [GEN-04](#gen-04) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-04-E03](#gen-04-e03) | Essence Siphon | evolution → [GEN-04](#gen-04) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-05](#gen-05) | Vital Recall | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [GEN-06](#gen-06) | Soul Relay | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-01](#imp-01) | Phase Rush | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-01-E01](#imp-01-e01) | Meteor Charge | evolution → [IMP-01](#imp-01) | movement, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-01-E02](#imp-01-e02) | Relentless Pursuit | evolution → [IMP-01](#imp-01) | movement | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-01-E03](#imp-01-e03) | Piercing Charge | evolution → [IMP-01](#imp-01) | movement | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-02](#imp-02) | Arc Strike | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-02-E01](#imp-02-e01) | Twin Arc | evolution → [IMP-02](#imp-02) | area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-02-E02](#imp-02-e02) | Overdrive | evolution → [IMP-02](#imp-02) | timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-02-E03](#imp-02-e03) | Kinetic Reprisal | evolution → [IMP-02](#imp-02) | protection | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-03](#imp-03) | Pulse Sever | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-03-E01](#imp-03-e01) | Echo Sever | evolution → [IMP-03](#imp-03) | control, area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-03-E02](#imp-03-e02) | Countershock | evolution → [IMP-03](#imp-03) | control | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-03-E03](#imp-03-e03) | Warpath | evolution → [IMP-03](#imp-03) | control | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-04](#imp-04) | Gravity Hammer | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-04-E01](#imp-04-e01) | Singularity Impact | evolution → [IMP-04](#imp-04) | area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-04-E02](#imp-04-e02) | Seismic Wave | evolution → [IMP-04](#imp-04) | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-04-E03](#imp-04-e03) | Gravity Well | evolution → [IMP-04](#imp-04) | area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-05](#imp-05) | Seismic Uppercut | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [IMP-06](#imp-06) | Kinetic Rampart | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-01](#ecl-01) | Crystal Bolt | base → — | projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-01-E01](#ecl-01-e01) | Rapid Crystal | evolution → [ECL-01](#ecl-01) | projectile, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-01-E02](#ecl-01-e02) | Glacial Echo | evolution → [ECL-01](#ecl-01) | projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-01-E03](#ecl-01-e03) | Fracture Chain | evolution → [ECL-01](#ecl-01) | projectile, area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-02](#ecl-02) | Crystal Snare | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-02-E01](#ecl-02-e01) | Deep Freeze / Ice Tomb | evolution → [ECL-02](#ecl-02) | control, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-02-E02](#ecl-02-e02) | Shatterfield | evolution → [ECL-02](#ecl-02) | control, area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-02-E03](#ecl-02-e03) | Crystal Conduit | evolution → [ECL-02](#ecl-02) | control | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-03](#ecl-03) | Fracture Spear | base → — | projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-03-E01](#ecl-03-e01) | Focused Fracture | evolution → [ECL-03](#ecl-03) | control, projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-03-E02](#ecl-03-e02) | Crystal Rupture | evolution → [ECL-03](#ecl-03) | projectile, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-03-E03](#ecl-03-e03) | Riftbreaker | evolution → [ECL-03](#ecl-03) | control, projectile, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-04](#ecl-04) | Froststorm | base → — | control | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-04-E01](#ecl-04-e01) | Glacial Barrage | evolution → [ECL-04](#ecl-04) | control, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-04-E02](#ecl-04-e02) | Expanding Frost | evolution → [ECL-04](#ecl-04) | control | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-04-E03](#ecl-04-e03) | Shattering Storm | evolution → [ECL-04](#ecl-04) | control, projectile, area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-05](#ecl-05) | Crystal Mirror | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [ECL-06](#ecl-06) | Avalanche | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-01](#sol-01) | Flux Bolt | base → — | projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-01-E01](#sol-01-e01) | Corona Volley | evolution → [SOL-01](#sol-01) | projectile, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-01-E02](#sol-01-e02) | Thunderhead | evolution → [SOL-01](#sol-01) | projectile, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-01-E03](#sol-01-e03) | Helios Beam | evolution → [SOL-01](#sol-01) | projectile, beam, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-02](#sol-02) | Sun Lance | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-02-E01](#sol-02-e01) | Judgment of Dawn | evolution → [SOL-02](#sol-02) | healing, beam | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-02-E02](#sol-02-e02) | Scorching Lance | evolution → [SOL-02](#sol-02) | area, periodic | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-02-E03](#sol-02-e03) | Split Lance | evolution → [SOL-02](#sol-02) | area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-03](#sol-03) | Zenith Crash | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-03-E01](#sol-03-e01) | Solar Aftershock | evolution → [SOL-03](#sol-03) | area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-03-E02](#sol-03-e02) | Burning Ground | evolution → [SOL-03](#sol-03) | area, periodic | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-03-E03](#sol-03-e03) | Prism Cross | evolution → [SOL-03](#sol-03) | beam | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-04](#sol-04) | Cinder Familiar | base → — | summon | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-04-E01](#sol-04-e01) | Phoenix Dive | evolution → [SOL-04](#sol-04) | summon | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-04-E02](#sol-04-e02) | Soulbrand | evolution → [SOL-04](#sol-04) | summon, projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-04-E03](#sol-04-e03) | Dying Star | evolution → [SOL-04](#sol-04) | summon, area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-05](#sol-05) | Solar Ascension | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [SOL-06](#sol-06) | Chain Tempest | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-01](#voi-01) | Rift Slash | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-01-E01](#voi-01-e01) | Phantom Assault | evolution → [VOI-01](#voi-01) | timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-01-E02](#voi-01-e02) | Umbral Cyclone | evolution → [VOI-01](#voi-01) | area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-01-E03](#voi-01-e03) | Executioner's Veil | evolution → [VOI-01](#voi-01) | healing, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-02](#voi-02) | Entropy Mark | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-02-E01](#voi-02-e01) | Contagion | evolution → [VOI-02](#voi-02) | area | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-02-E02](#voi-02-e02) | Psychic Collapse | evolution → [VOI-02](#voi-02) | area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-02-E03](#voi-02-e03) | Devouring Pact | evolution → [VOI-02](#voi-02) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-03](#voi-03) | Phase Slip | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-03-E01](#voi-03-e01) | Shadow Ambush | evolution → [VOI-03](#voi-03) | timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-03-E02](#voi-03-e02) | Rift Echo | evolution → [VOI-03](#voi-03) | movement, area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-03-E03](#voi-03-e03) | Veilwalk | evolution → [VOI-03](#voi-03) | protection | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-04](#voi-04) | Void Metamorphosis | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-04-E01](#voi-04-e01) | Dreadblade Form | evolution → [VOI-04](#voi-04) | area, timing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-04-E02](#voi-04-e02) | Mindstorm | evolution → [VOI-04](#voi-04) | projectile | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-04-E03](#voi-04-e03) | Soul Devourer | evolution → [VOI-04](#voi-04) | healing | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-05](#voi-05) | Abyssal Rift | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [VOI-06](#voi-06) | Dark Pact | base → — | direct-effect | Chris / Project Energy | Source reference; JAC adaptation draft |
| [C01](#c01) | Entropy Mark → Rift Slash + Devouring Pact | combination → [VOI-01](#voi-01), [VOI-02](#voi-02), [VOI-02-E03](#voi-02-e03) | direct-effect | Project Energy source combo / PR #12 curation | Draft combination |
| [C02](#c02) | Entropy Mark → Psychic Collapse | combination → [VOI-02](#voi-02), [VOI-02-E02](#voi-02-e02) | periodic, timing | Project Energy source combo / PR #12 curation | Draft combination |
| [C03](#c03) | Phase Slip → Shadow Ambush + Rift Slash | combination → [VOI-01](#voi-01), [VOI-03](#voi-03), [VOI-03-E01](#voi-03-e01), [JAC-M047](#jac-m047) | movement | Project Energy source combo / PR #12 curation | Draft combination |
| [C04](#c04) | Void Metamorphosis → Entropy Mark + Mindstorm | combination → [VOI-02](#voi-02), [VOI-04](#voi-04), [VOI-04-E02](#voi-04-e02) | periodic | Project Energy source combo / PR #12 curation | Draft combination |
| [C05](#c05) | Flux Bolt → Thunderhead | combination → [SOL-01](#sol-01), [SOL-01-E02](#sol-01-e02) | projectile | Project Energy source combo / PR #12 curation | Draft combination |
| [C06](#c06) | Cinder Familiar → Soulbrand + Flux Bolt | combination → [SOL-01](#sol-01), [SOL-04](#sol-04), [SOL-04-E02](#sol-04-e02) | summon, projectile | Project Energy source combo / PR #12 curation | Draft combination |
| [C07](#c07) | Solar Ascension → Sun Lance / Judgment of Dawn | combination → [SOL-02](#sol-02), [SOL-05](#sol-05), [SOL-02-E01](#sol-02-e01) | movement | Project Energy source combo / PR #12 curation | Draft combination |
| [C08](#c08) | Crystal Snare → Fracture Spear / Focused Fracture | combination → [ECL-02](#ecl-02), [ECL-03](#ecl-03), [ECL-03-E01](#ecl-03-e01) | control, projectile, timing | Project Energy source combo / PR #12 curation | Draft combination |
| [C09](#c09) | Froststorm → Fracture Spear / Shattering Storm | combination → [ECL-03](#ecl-03), [ECL-04](#ecl-04), [ECL-04-E03](#ecl-04-e03) | control, projectile, area | Project Energy source combo / PR #12 curation | Draft combination |
| [C10](#c10) | Phase Rush → Pulse Sever | combination → [IMP-01](#imp-01), [IMP-03](#imp-03) | movement, control, timing | JAC proposal / PR #12 | Draft combination |
| [C11](#c11) | Pulse Sever / Warpath → Arc Strike / Overdrive | combination → [IMP-02](#imp-02), [IMP-03](#imp-03), [IMP-02-E02](#imp-02-e02), [IMP-03-E03](#imp-03-e03) | control | JAC proposal / PR #12 | Draft combination |
| [C12](#c12) | Gravity Hammer / Gravity Well → Zenith Crash | combination → [IMP-04](#imp-04), [SOL-03](#sol-03), [IMP-04-E03](#imp-04-e03) | direct-effect | JAC proposal / PR #12 | Draft combination |
| [C13](#c13) | Pulse Mend / Vital Reversal → Resonance Guard | combination → [GEN-01](#gen-01), [GEN-02](#gen-02), [GEN-01-E03](#gen-01-e03) | healing, protection | Project Energy source combo / PR #12 curation | Draft combination |
| [C14](#c14) | Soul Relay → Pulse Mend | combination → [GEN-01](#gen-01), [GEN-06](#gen-06) | healing | Project Energy source combo / PR #12 curation | Draft combination |
| [C15](#c15) | Vital Recall → Resonance Guard | combination → [GEN-02](#gen-02), [GEN-05](#gen-05) | healing, protection | Project Energy source combo / PR #12 curation | Draft combination |
| [C16](#c16) | Crystal Snare → Chain Tempest | combination → [ECL-02](#ecl-02), [SOL-06](#sol-06) | control | JAC proposal / PR #12 | Draft combination |
| [C17](#c17) | Entropy Mark → Cinder Familiar / Soulbrand | combination → [SOL-04](#sol-04), [VOI-02](#voi-02), [SOL-04-E02](#sol-04-e02) | summon | JAC proposal / PR #12 | Draft combination |
| [C18](#c18) | Crystal Conduit → Arc Strike / Overdrive | combination → [IMP-02](#imp-02), [IMP-02-E02](#imp-02-e02), [ECL-02-E03](#ecl-02-e03) | direct-effect | JAC proposal / PR #12 | Draft combination |
| [C19](#c19) | Resonance Guard → Dark Pact | combination → [GEN-02](#gen-02), [VOI-06](#voi-06) | protection, timing | JAC proposal / PR #12 | Draft combination |
| [C20](#c20) | Crystal Mirror → Helios Beam | combination → [ECL-05](#ecl-05), [SOL-01-E03](#sol-01-e03) | beam, timing | JAC proposal / PR #12 | Draft combination |
| [C21](#c21) | Stasis Seal / Mercy Bloom → Phase Rush / Arc Strike | combination → [GEN-04](#gen-04), [IMP-01](#imp-01), [IMP-02](#imp-02), [GEN-04-E02](#gen-04-e02) | healing | JAC proposal / PR #12 | Draft combination |
| [C22](#c22) | Entropy Mark → Gravity Well / Gravity Hammer | combination → [IMP-04](#imp-04), [VOI-02](#voi-02), [IMP-04-E03](#imp-04-e03) | direct-effect | JAC proposal / PR #12 | Draft combination |
| [C23](#c23) | Flux Bolt / Thunderhead → Sun Lance / Judgment of Dawn | combination → [SOL-01](#sol-01), [SOL-02](#sol-02), [SOL-01-E02](#sol-01-e02), [SOL-02-E01](#sol-02-e01) | projectile | JAC proposal / PR #12 | Draft combination |
| [C24](#c24) | Arc Strike / Kinetic Reprisal → Phase Rush | combination → [IMP-01](#imp-01), [IMP-02](#imp-02), [IMP-02-E03](#imp-02-e03) | healing, protection, movement, control, summon, projectile, area, periodic, timing | JAC proposal / PR #12 | Draft combination |
| [JAC-M001](#jac-m001) | Serrated Cleave | mutation → [JAC-B01](#jac-b01) | area, periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M002](#jac-m002) | Blood Harvest | mutation → [JAC-B01](#jac-b01) | healing, area, periodic, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M003](#jac-m003) | Whirlwind | mutation → [JAC-B01](#jac-b01) | area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M004](#jac-m004) | Executioner's Arc | mutation → [JAC-B01](#jac-b01) | projectile, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M005](#jac-m005) | Unstoppable Charge | mutation → [JAC-B02](#jac-b02) | movement, control | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M006](#jac-m006) | Rallying Cry | mutation → [JAC-B03](#jac-b03) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M007](#jac-m007) | Shared Mend | mutation → [JAC-B04](#jac-b04) | healing, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M008](#jac-m008) | Prayer of Renewal | mutation → [JAC-B04](#jac-b04) | healing, periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M009](#jac-m009) | Divine Intervention | mutation → [JAC-B04](#jac-b04) | healing, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M010](#jac-m010) | Purifying Light | mutation → [JAC-B05](#jac-b05) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M011](#jac-m011) | Sanctuary | mutation → [JAC-B06](#jac-b06) | protection, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M012](#jac-m012) | Martyr's Bond | mutation → [JAC-B07](#jac-b07) | healing, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M013](#jac-m013) | Blizzard | mutation → [JAC-B08](#jac-b08) | control | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M014](#jac-m014) | Thunder Prison | mutation → [JAC-B08](#jac-b08) | control, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M015](#jac-m015) | Storm Chaser | mutation → [JAC-B08](#jac-b08) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M016](#jac-m016) | Chain Reaction | mutation → [JAC-B09](#jac-b09) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M017](#jac-m017) | Overload | mutation → [JAC-B09](#jac-b09) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M018](#jac-m018) | Ice Block | mutation → [JAC-B10](#jac-b10) | protection, movement | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M019](#jac-m019) | Static Discharge | mutation → [JAC-B10](#jac-b10) | movement | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M020](#jac-m020) | Endless Volley | mutation → [JAC-B11](#jac-b11) | movement, projectile, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M021](#jac-m021) | Sniper's Patience | mutation → [JAC-B11](#jac-b11) | movement, control | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M022](#jac-m022) | Splinter Shot | mutation → [JAC-B11](#jac-b11) | projectile | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M023](#jac-m023) | Pinning Arrow | mutation → [JAC-B11](#jac-b11) | movement, control, projectile | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M024](#jac-m024) | Ricochet Arrow | mutation → [JAC-B11](#jac-b11) | projectile | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M025](#jac-m025) | Explosive Tip | mutation → [JAC-B11](#jac-b11) | area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M026](#jac-m026) | Rolling Escape | mutation → [JAC-B10](#jac-b10) | protection, movement | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M027](#jac-m027) | Lobbed Fireball | mutation → [JAC-B12](#jac-b12) | projectile | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M028](#jac-m028) | Living Flame | mutation → [JAC-B12](#jac-b12) | projectile, area, periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M029](#jac-m029) | Cluster Fireball | mutation → [JAC-B12](#jac-b12) | projectile | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M030](#jac-m030) | Flamethrower | mutation → [JAC-B12](#jac-b12) | projectile, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M031](#jac-m031) | Meteor | mutation → [JAC-B12](#jac-b12) | projectile, area, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M032](#jac-m032) | Phoenix Dash | mutation → [JAC-B10](#jac-b10) | movement, periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M033](#jac-m033) | Cauterize | mutation → [JAC-B13](#jac-b13) | healing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M034](#jac-m034) | Refracting LAZOR | mutation → [JAC-B14](#jac-b14) | beam | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M035](#jac-m035) | Sweeping LAZOR | mutation → [JAC-B14](#jac-b14) | beam, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M036](#jac-m036) | Piercing LAZOR | mutation → [JAC-B14](#jac-b14) | projectile, beam | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M037](#jac-m037) | Guardian Bulwark | mutation → [JAC-B15](#jac-b15) | protection, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M038](#jac-m038) | Reflective Bulwark | mutation → [JAC-B15](#jac-b15) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M039](#jac-m039) | Fortress Mode | mutation → [JAC-B15](#jac-b15) | protection, control | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M040](#jac-m040) | Sacrificial Guard | mutation → [JAC-B15](#jac-b15) | protection | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M041](#jac-m041) | Contagious Poison | mutation → [JAC-B16](#jac-b16) | periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M042](#jac-m042) | Fleet Venom | mutation → [JAC-B16](#jac-b16) | movement, periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M043](#jac-m043) | Paralytic Venom | mutation → [JAC-B17](#jac-b17) | control, periodic, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M044](#jac-m044) | Explosive Venom | mutation → [JAC-B18](#jac-b18) | periodic | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M045](#jac-m045) | Shadowstep | mutation → [JAC-B10](#jac-b10) | movement | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M046](#jac-m046) | Smoke Bomb | mutation → [JAC-B10](#jac-b10) | movement, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M047](#jac-m047) | Ambush | mutation → [JAC-B19](#jac-b19) | direct-effect | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M048](#jac-m048) | Totemic Legion | mutation → [JAC-B20](#jac-b20) | healing, summon, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M049](#jac-m049) | Ancestral Totem | mutation → [JAC-B20](#jac-b20) | healing, summon, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M050](#jac-m050) | Spirit Link | mutation → [JAC-B20](#jac-b20) | healing, summon | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M051](#jac-m051) | Volatile Totem | mutation → [JAC-B21](#jac-b21) | summon | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M052](#jac-m052) | Flamecaller | mutation → [JAC-B21](#jac-b21) | summon | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M053](#jac-m053) | Walking Totem | mutation → [JAC-B21](#jac-b21) | summon, timing | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-M054](#jac-m054) | Earthbind | mutation → [JAC-B22](#jac-b22) | control, area | Earlier JAC brainstorm | Draft idea; not approved |
| [JAC-I001](#jac-i001) | Hit-absorbing skeletons | interview concept → [JAC-B23](#jac-b23) | protection, summon | Axel design interview | Draft interview idea; not approved |
| [JAC-I002](#jac-i002) | Melee skeletons | interview concept → [JAC-B23](#jac-b23) | summon | Axel design interview | Draft interview idea; not approved |
| [JAC-I003](#jac-i003) | Debuffing mage skeletons | interview concept → [JAC-B23](#jac-b23) | summon | Axel design interview | Draft interview idea; not approved |
| [JAC-I004](#jac-i004) | Healing skeletons | interview concept → [JAC-B23](#jac-b23) | healing, summon | Axel design interview | Draft interview idea; not approved |
| [JAC-I005](#jac-i005) | Hold Frostbite stacks | interview concept → [JAC-B24](#jac-b24) | control, timing | Axel design interview | Draft interview idea; not approved |
| [JAC-I006](#jac-i006) | Trigger Frostbite explosions | interview concept → [JAC-B24](#jac-b24) | control, timing | Axel design interview | Draft interview idea; not approved |
| [JAC-I007](#jac-i007) | Tactical crystal payoff | interview concept → [JAC-B25](#jac-b25) | healing | Axel design interview | Draft interview idea; not approved |
| [JC01](#jc01) | Lobbed Fireball + Living Flame | combination → [JAC-M027](#jac-m027), [JAC-M028](#jac-m028) | projectile, area, periodic | Earlier JAC brainstorm | Speculative idea; not approved |
| [JC02](#jc02) | Contagious Poison + Fleet Venom | combination → [JAC-M041](#jac-m041), [JAC-M042](#jac-m042) | movement, periodic | Earlier JAC brainstorm | Speculative idea; not approved |
| [JC03](#jc03) | Totemic Legion + Ancestral Totem | combination → [JAC-M048](#jac-m048), [JAC-M049](#jac-m049) | healing, summon, area, timing | Earlier JAC brainstorm | Speculative idea; not approved |
| [H01](#h01) | Volatile familiar / totem | combination → [JAC-M051](#jac-m051), [SOL-04-E03](#sol-04-e03) | summon | New speculative hybrid | Speculative idea; not approved |
| [H02](#h02) | Refracting channeled beam | combination → [JAC-M034](#jac-m034), [SOL-01-E03](#sol-01-e03) | beam, timing | New speculative hybrid | Speculative idea; not approved |
| [H03](#h03) | Chilled storm setup | combination → [JAC-M013](#jac-m013), [ECL-03-E01](#ecl-03-e01) | control, area | New speculative hybrid | Speculative idea; not approved |
| [H04](#h04) | Linked healing deployables | combination → [JAC-M050](#jac-m050), [GEN-06](#gen-06) | healing, protection | New speculative hybrid | Speculative idea; not approved |

## Categories and overlaps

Tags are browse aids, not class assignments. Similar motifs keep distinct IDs and original wording; they are not silently deduplicated into one mechanic. Exact repeats in recipe tables and favorites cross-reference their idea instead of increasing counts.

- **healing:** [GEN-01](#gen-01), [GEN-01-E01](#gen-01-e01), [GEN-01-E02](#gen-01-e02), [GEN-01-E03](#gen-01-e03), [GEN-02-E03](#gen-02-e03), [GEN-03-E01](#gen-03-e01), [GEN-03-E02](#gen-03-e02), [GEN-03-E03](#gen-03-e03), [GEN-04-E02](#gen-04-e02), [GEN-04-E03](#gen-04-e03), [SOL-02-E01](#sol-02-e01), [VOI-01-E03](#voi-01-e03), [VOI-02-E03](#voi-02-e03), [VOI-04-E03](#voi-04-e03), [C13](#c13), [C14](#c14), [C15](#c15), [C21](#c21), [C24](#c24), [JAC-M002](#jac-m002), [JAC-M007](#jac-m007), [JAC-M008](#jac-m008), [JAC-M009](#jac-m009), [JAC-M012](#jac-m012), [JAC-M033](#jac-m033), [JAC-M048](#jac-m048), [JAC-M049](#jac-m049), [JAC-M050](#jac-m050), [JAC-I004](#jac-i004), [JAC-I007](#jac-i007), [JC03](#jc03), [H04](#h04).
- **protection:** [GEN-01-E03](#gen-01-e03), [GEN-02](#gen-02), [GEN-02-E01](#gen-02-e01), [GEN-02-E02](#gen-02-e02), [GEN-02-E03](#gen-02-e03), [IMP-02-E03](#imp-02-e03), [VOI-03-E03](#voi-03-e03), [C13](#c13), [C15](#c15), [C19](#c19), [C24](#c24), [JAC-M011](#jac-m011), [JAC-M018](#jac-m018), [JAC-M026](#jac-m026), [JAC-M037](#jac-m037), [JAC-M039](#jac-m039), [JAC-M040](#jac-m040), [JAC-I001](#jac-i001), [H04](#h04).
- **movement:** [IMP-01-E01](#imp-01-e01), [IMP-01-E02](#imp-01-e02), [IMP-01-E03](#imp-01-e03), [VOI-03-E02](#voi-03-e02), [C03](#c03), [C07](#c07), [C10](#c10), [C24](#c24), [JAC-M005](#jac-m005), [JAC-M018](#jac-m018), [JAC-M019](#jac-m019), [JAC-M020](#jac-m020), [JAC-M021](#jac-m021), [JAC-M023](#jac-m023), [JAC-M026](#jac-m026), [JAC-M032](#jac-m032), [JAC-M042](#jac-m042), [JAC-M045](#jac-m045), [JAC-M046](#jac-m046), [JC02](#jc02).
- **control:** [GEN-04-E01](#gen-04-e01), [IMP-03-E01](#imp-03-e01), [IMP-03-E02](#imp-03-e02), [IMP-03-E03](#imp-03-e03), [ECL-02-E01](#ecl-02-e01), [ECL-02-E02](#ecl-02-e02), [ECL-02-E03](#ecl-02-e03), [ECL-03-E01](#ecl-03-e01), [ECL-03-E03](#ecl-03-e03), [ECL-04](#ecl-04), [ECL-04-E01](#ecl-04-e01), [ECL-04-E02](#ecl-04-e02), [ECL-04-E03](#ecl-04-e03), [C08](#c08), [C09](#c09), [C10](#c10), [C11](#c11), [C16](#c16), [C24](#c24), [JAC-M005](#jac-m005), [JAC-M013](#jac-m013), [JAC-M014](#jac-m014), [JAC-M021](#jac-m021), [JAC-M023](#jac-m023), [JAC-M039](#jac-m039), [JAC-M043](#jac-m043), [JAC-M054](#jac-m054), [JAC-I005](#jac-i005), [JAC-I006](#jac-i006), [H03](#h03).
- **summon:** [SOL-04](#sol-04), [SOL-04-E01](#sol-04-e01), [SOL-04-E02](#sol-04-e02), [SOL-04-E03](#sol-04-e03), [C06](#c06), [C17](#c17), [C24](#c24), [JAC-M048](#jac-m048), [JAC-M049](#jac-m049), [JAC-M050](#jac-m050), [JAC-M051](#jac-m051), [JAC-M052](#jac-m052), [JAC-M053](#jac-m053), [JAC-I001](#jac-i001), [JAC-I002](#jac-i002), [JAC-I003](#jac-i003), [JAC-I004](#jac-i004), [JC03](#jc03), [H01](#h01).
- **projectile:** [ECL-01](#ecl-01), [ECL-01-E01](#ecl-01-e01), [ECL-01-E02](#ecl-01-e02), [ECL-01-E03](#ecl-01-e03), [ECL-03](#ecl-03), [ECL-03-E01](#ecl-03-e01), [ECL-03-E02](#ecl-03-e02), [ECL-03-E03](#ecl-03-e03), [ECL-04-E03](#ecl-04-e03), [SOL-01](#sol-01), [SOL-01-E01](#sol-01-e01), [SOL-01-E02](#sol-01-e02), [SOL-01-E03](#sol-01-e03), [SOL-04-E02](#sol-04-e02), [VOI-04-E02](#voi-04-e02), [C05](#c05), [C06](#c06), [C08](#c08), [C09](#c09), [C23](#c23), [C24](#c24), [JAC-M004](#jac-m004), [JAC-M020](#jac-m020), [JAC-M022](#jac-m022), [JAC-M023](#jac-m023), [JAC-M024](#jac-m024), [JAC-M027](#jac-m027), [JAC-M028](#jac-m028), [JAC-M029](#jac-m029), [JAC-M030](#jac-m030), [JAC-M031](#jac-m031), [JAC-M036](#jac-m036), [JC01](#jc01).
- **beam:** [SOL-01-E03](#sol-01-e03), [SOL-02-E01](#sol-02-e01), [SOL-03-E03](#sol-03-e03), [C20](#c20), [JAC-M034](#jac-m034), [JAC-M035](#jac-m035), [JAC-M036](#jac-m036), [H02](#h02).
- **area:** [GEN-02-E02](#gen-02-e02), [GEN-04-E01](#gen-04-e01), [IMP-01-E01](#imp-01-e01), [IMP-02-E01](#imp-02-e01), [IMP-03-E01](#imp-03-e01), [IMP-04-E01](#imp-04-e01), [IMP-04-E03](#imp-04-e03), [ECL-01-E03](#ecl-01-e03), [ECL-02-E01](#ecl-02-e01), [ECL-02-E02](#ecl-02-e02), [ECL-03-E02](#ecl-03-e02), [ECL-04-E01](#ecl-04-e01), [ECL-04-E03](#ecl-04-e03), [SOL-02-E02](#sol-02-e02), [SOL-02-E03](#sol-02-e03), [SOL-03-E01](#sol-03-e01), [SOL-03-E02](#sol-03-e02), [SOL-04-E03](#sol-04-e03), [VOI-01-E02](#voi-01-e02), [VOI-02-E01](#voi-02-e01), [VOI-02-E02](#voi-02-e02), [VOI-03-E02](#voi-03-e02), [VOI-04-E01](#voi-04-e01), [C09](#c09), [C24](#c24), [JAC-M001](#jac-m001), [JAC-M002](#jac-m002), [JAC-M003](#jac-m003), [JAC-M004](#jac-m004), [JAC-M007](#jac-m007), [JAC-M011](#jac-m011), [JAC-M012](#jac-m012), [JAC-M014](#jac-m014), [JAC-M025](#jac-m025), [JAC-M028](#jac-m028), [JAC-M031](#jac-m031), [JAC-M037](#jac-m037), [JAC-M046](#jac-m046), [JAC-M049](#jac-m049), [JAC-M054](#jac-m054), [JC01](#jc01), [JC03](#jc03), [H03](#h03).
- **periodic:** [SOL-02-E02](#sol-02-e02), [SOL-03-E02](#sol-03-e02), [C02](#c02), [C04](#c04), [C24](#c24), [JAC-M001](#jac-m001), [JAC-M002](#jac-m002), [JAC-M008](#jac-m008), [JAC-M028](#jac-m028), [JAC-M032](#jac-m032), [JAC-M041](#jac-m041), [JAC-M042](#jac-m042), [JAC-M043](#jac-m043), [JAC-M044](#jac-m044), [JC01](#jc01), [JC02](#jc02).
- **timing:** [GEN-01-E01](#gen-01-e01), [IMP-02-E01](#imp-02-e01), [IMP-02-E02](#imp-02-e02), [IMP-03-E01](#imp-03-e01), [ECL-01-E01](#ecl-01-e01), [ECL-01-E03](#ecl-01-e03), [ECL-02-E02](#ecl-02-e02), [ECL-03-E03](#ecl-03-e03), [SOL-01-E01](#sol-01-e01), [SOL-01-E02](#sol-01-e02), [SOL-01-E03](#sol-01-e03), [SOL-04-E03](#sol-04-e03), [VOI-01-E01](#voi-01-e01), [VOI-01-E02](#voi-01-e02), [VOI-01-E03](#voi-01-e03), [VOI-02-E02](#voi-02-e02), [VOI-03-E01](#voi-03-e01), [VOI-03-E02](#voi-03-e02), [VOI-04-E01](#voi-04-e01), [C02](#c02), [C08](#c08), [C10](#c10), [C19](#c19), [C20](#c20), [C24](#c24), [JAC-M002](#jac-m002), [JAC-M009](#jac-m009), [JAC-M020](#jac-m020), [JAC-M030](#jac-m030), [JAC-M031](#jac-m031), [JAC-M035](#jac-m035), [JAC-M043](#jac-m043), [JAC-M048](#jac-m048), [JAC-M053](#jac-m053), [JAC-I005](#jac-i005), [JAC-I006](#jac-i006), [JC03](#jc03), [H02](#h02).
- **direct-effect:** [GEN-03](#gen-03), [GEN-04](#gen-04), [GEN-05](#gen-05), [GEN-06](#gen-06), [IMP-01](#imp-01), [IMP-02](#imp-02), [IMP-03](#imp-03), [IMP-04](#imp-04), [IMP-04-E02](#imp-04-e02), [IMP-05](#imp-05), [IMP-06](#imp-06), [ECL-02](#ecl-02), [ECL-05](#ecl-05), [ECL-06](#ecl-06), [SOL-02](#sol-02), [SOL-03](#sol-03), [SOL-05](#sol-05), [SOL-06](#sol-06), [VOI-01](#voi-01), [VOI-02](#voi-02), [VOI-03](#voi-03), [VOI-04](#voi-04), [VOI-05](#voi-05), [VOI-06](#voi-06), [C01](#c01), [C12](#c12), [C18](#c18), [C22](#c22), [JAC-M006](#jac-m006), [JAC-M010](#jac-m010), [JAC-M015](#jac-m015), [JAC-M016](#jac-m016), [JAC-M017](#jac-m017), [JAC-M038](#jac-m038), [JAC-M047](#jac-m047).

### Related motifs across origins

- **Healing / damage conversion:** [JAC-M007](#jac-m007) Shared Mend, [GEN-01-E03](#gen-01-e03) Vital Reversal, [JAC-M033](#jac-m033) Cauterize, [JAC-M012](#jac-m012) Martyr's Bond. Similarity only; no merge or compatibility claim.
- **Stationary frost control:** [JAC-M013](#jac-m013) Blizzard, [ECL-04](#ecl-04) Froststorm. Similarity only; no merge or compatibility claim.
- **Beam shaping:** [JAC-M034](#jac-m034) Refracting LAZOR, [JAC-M035](#jac-m035) Sweeping LAZOR, [SOL-01-E03](#sol-01-e03) Helios Beam. Similarity only; no merge or compatibility claim.
- **Summon sacrifice / expiry:** [JAC-M051](#jac-m051) Volatile Totem, [SOL-04-E03](#sol-04-e03) Dying Star. Similarity only; no merge or compatibility claim.
- **Linked protection:** [JAC-M050](#jac-m050) Spirit Link, [JAC-M040](#jac-m040) Sacrificial Guard, [GEN-06](#gen-06) Soul Relay. Similarity only; no merge or compatibility claim.
- **Teleport follow-up:** [JAC-M045](#jac-m045) Shadowstep, [VOI-03-E01](#voi-03-e01) Shadow Ambush, [JAC-M047](#jac-m047) Ambush. Similarity only; no merge or compatibility claim.

### Historical recipe aliases (deduplicated)

These proposed item names refer to existing mutation ideas; they are not additional abilities or acquisition decisions. Costs remain only in the historical proposal. Ancestral Idol describes Spirit Link, despite resembling Ancestral Totem by name.

| Historical item alias | Existing idea |
|---|---|
| Serrated Greatsword | [JAC-M001](#jac-m001) Serrated Cleave |
| Whirlwind Axe | [JAC-M003](#jac-m003) Whirlwind |
| Prayer Beads | [JAC-M008](#jac-m008) Prayer of Renewal |
| Stormglass Staff | [JAC-M013](#jac-m013) Blizzard |
| Longbow of the Watcher | [JAC-M020](#jac-m020) Endless Volley |
| Siegecaster's Staff | [JAC-M027](#jac-m027) Lobbed Fireball |
| Guardian's Crest | [JAC-M037](#jac-m037) Guardian Bulwark |
| Viper's Gloves | [JAC-M041](#jac-m041) Contagious Poison |
| Fleetfoot Charm | [JAC-M042](#jac-m042) Fleet Venom |
| Totemkeeper's Mask | [JAC-M048](#jac-m048) Totemic Legion |
| Volatile Fetish | [JAC-M051](#jac-m051) Volatile Totem |
| Frostbound Boots | [JAC-M018](#jac-m018) Ice Block |
| Bloodreaver | [JAC-M002](#jac-m002) Blood Harvest |
| Oath of Sacrifice | [JAC-M040](#jac-m040) Sacrificial Guard |
| Tempest Crown | [JAC-M015](#jac-m015) Storm Chaser |
| Thunderheart | [JAC-M017](#jac-m017) Overload |
| Sniper's Covenant | [JAC-M021](#jac-m021) Sniper's Patience |
| Meteorcaller | [JAC-M031](#jac-m031) Meteor |
| Prism of Judgment | [JAC-M034](#jac-m034) Refracting LAZOR |
| Fortress Heart | [JAC-M039](#jac-m039) Fortress Mode |
| Plaguebearer's Fang | [JAC-M044](#jac-m044) Explosive Venom |
| Shadowwalkers | [JAC-M045](#jac-m045) Shadowstep |
| Ancestral Idol | [JAC-M050](#jac-m050) Spirit Link |
| Infernal Effigy | [JAC-M053](#jac-m053) Walking Totem |

## Earlier JAC ideas

Every entry below is a draft. Historical class labels only identify where the idea was recorded; they do not assign future classes. Quoted timings, counts and trade-offs preserve the brainstorm, not approved tuning.

### Base-ability contexts

<a id="jac-b01"></a>
- **JAC-B01 · Wide Cleave** — context from mutation draft or Axel interview; children: [JAC-M001](#jac-m001), [JAC-M002](#jac-m002), [JAC-M003](#jac-m003), [JAC-M004](#jac-m004).
<a id="jac-b02"></a>
- **JAC-B02 · Gap-closer** — context from mutation draft or Axel interview; children: [JAC-M005](#jac-m005).
<a id="jac-b03"></a>
- **JAC-B03 · Defensive ability** — context from mutation draft or Axel interview; children: [JAC-M006](#jac-m006).
<a id="jac-b04"></a>
- **JAC-B04 · Mend** — context from mutation draft or Axel interview; children: [JAC-M007](#jac-m007), [JAC-M008](#jac-m008), [JAC-M009](#jac-m009).
<a id="jac-b05"></a>
- **JAC-B05 · Holy skill** — context from mutation draft or Axel interview; children: [JAC-M010](#jac-m010).
<a id="jac-b06"></a>
- **JAC-B06 · Protective skill** — context from mutation draft or Axel interview; children: [JAC-M011](#jac-m011).
<a id="jac-b07"></a>
- **JAC-B07 · Healing an ally** — context from mutation draft or Axel interview; children: [JAC-M012](#jac-m012).
<a id="jac-b08"></a>
- **JAC-B08 · Lightning Storm** — context from mutation draft or Axel interview; children: [JAC-M013](#jac-m013), [JAC-M014](#jac-m014), [JAC-M015](#jac-m015).
<a id="jac-b09"></a>
- **JAC-B09 · Chain Lightning** — context from mutation draft or Axel interview; children: [JAC-M016](#jac-m016), [JAC-M017](#jac-m017).
<a id="jac-b10"></a>
- **JAC-B10 · Dash / mobility skill** — context from mutation draft or Axel interview; children: [JAC-M018](#jac-m018), [JAC-M019](#jac-m019), [JAC-M026](#jac-m026), [JAC-M032](#jac-m032), [JAC-M045](#jac-m045), [JAC-M046](#jac-m046).
<a id="jac-b11"></a>
- **JAC-B11 · Aimed Shot** — context from mutation draft or Axel interview; children: [JAC-M020](#jac-m020), [JAC-M021](#jac-m021), [JAC-M022](#jac-m022), [JAC-M023](#jac-m023), [JAC-M024](#jac-m024), [JAC-M025](#jac-m025).
<a id="jac-b12"></a>
- **JAC-B12 · Fireball** — context from mutation draft or Axel interview; children: [JAC-M027](#jac-m027), [JAC-M028](#jac-m028), [JAC-M029](#jac-m029), [JAC-M030](#jac-m030), [JAC-M031](#jac-m031).
<a id="jac-b13"></a>
- **JAC-B13 · Fire damage-over-time** — context from mutation draft or Axel interview; children: [JAC-M033](#jac-m033).
<a id="jac-b14"></a>
- **JAC-B14 · LAZOR** — context from mutation draft or Axel interview; children: [JAC-M034](#jac-m034), [JAC-M035](#jac-m035), [JAC-M036](#jac-m036).
<a id="jac-b15"></a>
- **JAC-B15 · Bulwark** — context from mutation draft or Axel interview; children: [JAC-M037](#jac-m037), [JAC-M038](#jac-m038), [JAC-M039](#jac-m039), [JAC-M040](#jac-m040).
<a id="jac-b16"></a>
- **JAC-B16 · Poison Enchant** — context from mutation draft or Axel interview; children: [JAC-M041](#jac-m041), [JAC-M042](#jac-m042).
<a id="jac-b17"></a>
- **JAC-B17 · Poison damage** — context from mutation draft or Axel interview; children: [JAC-M043](#jac-m043).
<a id="jac-b18"></a>
- **JAC-B18 · Poisoned enemies** — context from mutation draft or Axel interview; children: [JAC-M044](#jac-m044).
<a id="jac-b19"></a>
- **JAC-B19 · Backstab** — context from mutation draft or Axel interview; children: [JAC-M047](#jac-m047).
<a id="jac-b20"></a>
- **JAC-B20 · Healing Totem** — context from mutation draft or Axel interview; children: [JAC-M048](#jac-m048), [JAC-M049](#jac-m049), [JAC-M050](#jac-m050).
<a id="jac-b21"></a>
- **JAC-B21 · Fire Totem** — context from mutation draft or Axel interview; children: [JAC-M051](#jac-m051), [JAC-M052](#jac-m052), [JAC-M053](#jac-m053).
<a id="jac-b22"></a>
- **JAC-B22 · Earth Shock** — context from mutation draft or Axel interview; children: [JAC-M054](#jac-m054).
<a id="jac-b23"></a>
- **JAC-B23 · Skeleton summon** — context from mutation draft or Axel interview; children: [JAC-I001](#jac-i001), [JAC-I002](#jac-i002), [JAC-I003](#jac-i003), [JAC-I004](#jac-i004).
<a id="jac-b24"></a>
- **JAC-B24 · Snowball / Frostbite** — context from mutation draft or Axel interview; children: [JAC-I005](#jac-i005), [JAC-I006](#jac-i006).
<a id="jac-b25"></a>
- **JAC-B25 · Encounter crystal** — context from mutation draft or Axel interview; children: [JAC-I007](#jac-i007).

<a id="jac-m001"></a>
### JAC-M001 · Serrated Cleave

Wide Cleave applies Bleed to all enemies hit.

- **Base:** [JAC-B01](#jac-b01) · **Tags:** area, periodic.
- **Origin:** Earlier JAC brainstorm; Warrior. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#warrior).
- **Status:** Draft idea; not approved.

<a id="jac-m002"></a>
### JAC-M002 · Blood Harvest

Wide Cleave consumes Bleed stacks for self-healing.

- **Base:** [JAC-B01](#jac-b01) · **Tags:** healing, area, periodic, timing.
- **Origin:** Earlier JAC brainstorm; Warrior. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#warrior).
- **Status:** Draft idea; not approved.

<a id="jac-m003"></a>
### JAC-M003 · Whirlwind

Wide Cleave becomes a 360-degree spin with shorter reach.

- **Base:** [JAC-B01](#jac-b01) · **Tags:** area.
- **Origin:** Earlier JAC brainstorm; Warrior. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#warrior).
- **Status:** Draft idea; not approved.

<a id="jac-m004"></a>
### JAC-M004 · Executioner's Arc

Narrower Cleave, stronger execute against low-HP targets.

- **Base:** [JAC-B01](#jac-b01) · **Tags:** projectile, area.
- **Origin:** Earlier JAC brainstorm; Warrior. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#warrior).
- **Status:** Draft idea; not approved.

<a id="jac-m005"></a>
### JAC-M005 · Unstoppable Charge

Gap-closer charges through ordinary slows and knocks aside enemies.

- **Base:** [JAC-B02](#jac-b02) · **Tags:** movement, control.
- **Origin:** Earlier JAC brainstorm; Warrior. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#warrior).
- **Status:** Draft idea; not approved.

<a id="jac-m006"></a>
### JAC-M006 · Rallying Cry

Defensive ability becomes a short-range party damage-reduction cry.

- **Base:** [JAC-B03](#jac-b03) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Warrior. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#warrior).
- **Status:** Draft idea; not approved.

<a id="jac-m007"></a>
### JAC-M007 · Shared Mend

Mend heals the target and a nearby injured ally at reduced potency.

- **Base:** [JAC-B04](#jac-b04) · **Tags:** healing, area.
- **Origin:** Earlier JAC brainstorm; Priest. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#priest).
- **Status:** Draft idea; not approved.

<a id="jac-m008"></a>
### JAC-M008 · Prayer of Renewal

Mend becomes healing over time instead of immediate healing.

- **Base:** [JAC-B04](#jac-b04) · **Tags:** healing, periodic.
- **Origin:** Earlier JAC brainstorm; Priest. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#priest).
- **Status:** Draft idea; not approved.

<a id="jac-m009"></a>
### JAC-M009 · Divine Intervention

Delayed large heal after marking an ally.

- **Base:** [JAC-B04](#jac-b04) · **Tags:** healing, timing.
- **Origin:** Earlier JAC brainstorm; Priest. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#priest).
- **Status:** Draft idea; not approved.

<a id="jac-m010"></a>
### JAC-M010 · Purifying Light

Holy skill can remove a debuff from allies or buff from enemies.

- **Base:** [JAC-B05](#jac-b05) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Priest. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#priest).
- **Status:** Draft idea; not approved.

<a id="jac-m011"></a>
### JAC-M011 · Sanctuary

Protective skill becomes a stationary group damage-reduction zone.

- **Base:** [JAC-B06](#jac-b06) · **Tags:** protection, area.
- **Origin:** Earlier JAC brainstorm; Priest. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#priest).
- **Status:** Draft idea; not approved.

<a id="jac-m012"></a>
### JAC-M012 · Martyr's Bond

Healing an ally damages a nearby enemy at a small personal HP cost.

- **Base:** [JAC-B07](#jac-b07) · **Tags:** healing, area.
- **Origin:** Earlier JAC brainstorm; Priest. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#priest).
- **Status:** Draft idea; not approved.

<a id="jac-m013"></a>
### JAC-M013 · Blizzard

Lightning Storm is replaced by Blizzard, dealing cold damage and slowing.

- **Base:** [JAC-B08](#jac-b08) · **Tags:** control.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m014"></a>
### JAC-M014 · Thunder Prison

Lightning Storm becomes a smaller field that briefly stuns enemies trying to leave.

- **Base:** [JAC-B08](#jac-b08) · **Tags:** control, area.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m015"></a>
### JAC-M015 · Storm Chaser

Lightning Storm follows its target.

- **Base:** [JAC-B08](#jac-b08) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m016"></a>
### JAC-M016 · Chain Reaction

Chain Lightning reaches additional targets with falloff.

- **Base:** [JAC-B09](#jac-b09) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m017"></a>
### JAC-M017 · Overload

Chain Lightning stops chaining and instead strikes one target repeatedly.

- **Base:** [JAC-B09](#jac-b09) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m018"></a>
### JAC-M018 · Ice Block

Replace Dash with a stationary, action-locking temporary invulnerability.

- **Base:** [JAC-B10](#jac-b10) · **Tags:** protection, movement.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m019"></a>
### JAC-M019 · Static Discharge

Mobility skill emits lightning around the landing position.

- **Base:** [JAC-B10](#jac-b10) · **Tags:** movement.
- **Origin:** Earlier JAC brainstorm; Lightning Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#lightning-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m020"></a>
### JAC-M020 · Endless Volley

Aimed Shot charges indefinitely while held and fires an arrow every **0.8 seconds**; moving cancels the channel. Explicitly define resource cost, hold/release input, retargeting and damage balance.

- **Base:** [JAC-B11](#jac-b11) · **Tags:** movement, projectile, timing.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m021"></a>
### JAC-M021 · Sniper's Patience

Longer Aimed Shot charge for range and power; movement interrupts.

- **Base:** [JAC-B11](#jac-b11) · **Tags:** movement, control.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m022"></a>
### JAC-M022 · Splinter Shot

Aimed Shot fires three arrows in a spread.

- **Base:** [JAC-B11](#jac-b11) · **Tags:** projectile.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m023"></a>
### JAC-M023 · Pinning Arrow

Fully charged Aimed Shot briefly roots.

- **Base:** [JAC-B11](#jac-b11) · **Tags:** movement, control, projectile.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m024"></a>
### JAC-M024 · Ricochet Arrow

Aimed Shot seeks a second target after impact.

- **Base:** [JAC-B11](#jac-b11) · **Tags:** projectile.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m025"></a>
### JAC-M025 · Explosive Tip

Aimed Shot explodes in an area.

- **Base:** [JAC-B11](#jac-b11) · **Tags:** area.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m026"></a>
### JAC-M026 · Rolling Escape

Dash becomes a shorter dodge roll with brief invulnerability.

- **Base:** [JAC-B10](#jac-b10) · **Tags:** protection, movement.
- **Origin:** Earlier JAC brainstorm; Ranger. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#ranger).
- **Status:** Draft idea; not approved.

<a id="jac-m027"></a>
### JAC-M027 · Lobbed Fireball

Fireball becomes an **arcing ground-targeted projectile** that can pass **over pillars/cover**, then explodes at the target location. It should not arbitrarily ignore all obstacles or arena boundaries.

- **Base:** [JAC-B12](#jac-b12) · **Tags:** projectile.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m028"></a>
### JAC-M028 · Living Flame

Fireball leaves a burning patch.

- **Base:** [JAC-B12](#jac-b12) · **Tags:** projectile, area, periodic.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m029"></a>
### JAC-M029 · Cluster Fireball

Fireball breaks into three smaller impact explosions.

- **Base:** [JAC-B12](#jac-b12) · **Tags:** projectile.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m030"></a>
### JAC-M030 · Flamethrower

Replace Fireball with a channeled frontal cone.

- **Base:** [JAC-B12](#jac-b12) · **Tags:** projectile, timing.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m031"></a>
### JAC-M031 · Meteor

Replace Fireball with a delayed large AoE impact.

- **Base:** [JAC-B12](#jac-b12) · **Tags:** projectile, area, timing.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m032"></a>
### JAC-M032 · Phoenix Dash

Dash leaves a burning trail.

- **Base:** [JAC-B10](#jac-b10) · **Tags:** movement, periodic.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m033"></a>
### JAC-M033 · Cauterize

Fire damage-over-time can instead target allies as healing-over-time (requires careful target-mode rules).

- **Base:** [JAC-B13](#jac-b13) · **Tags:** healing.
- **Origin:** Earlier JAC brainstorm; Fire Mage. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#fire-mage).
- **Status:** Draft idea; not approved.

<a id="jac-m034"></a>
### JAC-M034 · Refracting LAZOR

LAZOR splits/refracts into weaker beams after striking enemies or cover; cap beam count and ensure pillars remain meaningful.

- **Base:** [JAC-B14](#jac-b14) · **Tags:** beam.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m035"></a>
### JAC-M035 · Sweeping LAZOR

LAZOR becomes a steerable channeled beam.

- **Base:** [JAC-B14](#jac-b14) · **Tags:** beam, timing.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m036"></a>
### JAC-M036 · Piercing LAZOR

Narrower LAZOR passes through enemies.

- **Base:** [JAC-B14](#jac-b14) · **Tags:** projectile, beam.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m037"></a>
### JAC-M037 · Guardian Bulwark

Bulwark also protects nearby allies.

- **Base:** [JAC-B15](#jac-b15) · **Tags:** protection, area.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m038"></a>
### JAC-M038 · Reflective Bulwark

Bulwark reflects some incoming damage.

- **Base:** [JAC-B15](#jac-b15) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m039"></a>
### JAC-M039 · Fortress Mode

Bulwark roots the Defender in exchange for stronger mitigation/knockback immunity.

- **Base:** [JAC-B15](#jac-b15) · **Tags:** protection, control.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m040"></a>
### JAC-M040 · Sacrificial Guard

Bulwark redirects part of a selected ally's incoming damage to the Defender.

- **Base:** [JAC-B15](#jac-b15) · **Tags:** protection.
- **Origin:** Earlier JAC brainstorm; Defender. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#defender).
- **Status:** Draft idea; not approved.

<a id="jac-m041"></a>
### JAC-M041 · Contagious Poison

**Poison Enchant can target allies**, enchanting their attacks.

- **Base:** [JAC-B16](#jac-b16) · **Tags:** periodic.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m042"></a>
### JAC-M042 · Fleet Venom

Poison Enchant also **increases the enchanted player's movement speed**.

- **Base:** [JAC-B16](#jac-b16) · **Tags:** movement, periodic.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m043"></a>
### JAC-M043 · Paralytic Venom

Replace poison damage with a stacking slow.

- **Base:** [JAC-B17](#jac-b17) · **Tags:** control, periodic, timing.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m044"></a>
### JAC-M044 · Explosive Venom

Poisoned enemies explode on death, spreading poison.

- **Base:** [JAC-B18](#jac-b18) · **Tags:** periodic.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m045"></a>
### JAC-M045 · Shadowstep

Dash becomes a short teleport that passes through pillars.

- **Base:** [JAC-B10](#jac-b10) · **Tags:** movement.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m046"></a>
### JAC-M046 · Smoke Bomb

Replace Dash with a smoke field that conceals allies inside.

- **Base:** [JAC-B10](#jac-b10) · **Tags:** movement, area.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m047"></a>
### JAC-M047 · Ambush

Backstab is stronger from stealth and weaker outside stealth.

- **Base:** [JAC-B19](#jac-b19) · **Tags:** direct-effect.
- **Origin:** Earlier JAC brainstorm; Rogue. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#rogue).
- **Status:** Draft idea; not approved.

<a id="jac-m048"></a>
### JAC-M048 · Totemic Legion

Permit **multiple simultaneous Healing Totems** (suggest up to three) with reduced healing per totem; avoid uncapped stacking.

- **Base:** [JAC-B20](#jac-b20) · **Tags:** healing, summon, timing.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-m049"></a>
### JAC-M049 · Ancestral Totem

Healing Totem becomes a larger persistent healing field with a longer cooldown.

- **Base:** [JAC-B20](#jac-b20) · **Tags:** healing, summon, area.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-m050"></a>
### JAC-M050 · Spirit Link

Healing Totem redistributes some damage among allies in range.

- **Base:** [JAC-B20](#jac-b20) · **Tags:** healing, summon.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-m051"></a>
### JAC-M051 · Volatile Totem

**Fire Totem explodes when it dies** or expires.

- **Base:** [JAC-B21](#jac-b21) · **Tags:** summon.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-m052"></a>
### JAC-M052 · Flamecaller

Fire Totem attacks faster but is more fragile.

- **Base:** [JAC-B21](#jac-b21) · **Tags:** summon.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-m053"></a>
### JAC-M053 · Walking Totem

Fire Totem follows its caster.

- **Base:** [JAC-B21](#jac-b21) · **Tags:** summon, timing.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-m054"></a>
### JAC-M054 · Earthbind

Earth Shock becomes an AoE slow rather than single-target burst.

- **Base:** [JAC-B22](#jac-b22) · **Tags:** control, area.
- **Origin:** Earlier JAC brainstorm; Shaman. [Documented source](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#shaman).
- **Status:** Draft idea; not approved.

<a id="jac-i001"></a>
### JAC-I001 · Hit-absorbing skeletons

Skeletons absorb hits; tankier-skeleton build idea.

- **Base:** [JAC-B23](#jac-b23) · **Tags:** protection, summon.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md#classes--builds).
- **Status:** Draft interview idea; not approved.

<a id="jac-i002"></a>
### JAC-I002 · Melee skeletons

Build idea focused on stronger melee skeletons.

- **Base:** [JAC-B23](#jac-b23) · **Tags:** summon.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md#classes--builds).
- **Status:** Draft interview idea; not approved.

<a id="jac-i003"></a>
### JAC-I003 · Debuffing mage skeletons

Build idea focused on debuffing mage skeletons.

- **Base:** [JAC-B23](#jac-b23) · **Tags:** summon.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md#classes--builds).
- **Status:** Draft interview idea; not approved.

<a id="jac-i004"></a>
### JAC-I004 · Healing skeletons

Build idea focused on healing skeletons.

- **Base:** [JAC-B23](#jac-b23) · **Tags:** healing, summon.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md#classes--builds).
- **Status:** Draft interview idea; not approved.

<a id="jac-i005"></a>
### JAC-I005 · Hold Frostbite stacks

Snowball gains damage per Frostbite stack; deliberately hold stacks instead of detonating. Historical example uses +5% and nine stacks; not JAC balance.

- **Base:** [JAC-B24](#jac-b24) · **Tags:** control, timing.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md#classes--builds).
- **Status:** Draft interview idea; not approved.

<a id="jac-i006"></a>
### JAC-I006 · Trigger Frostbite explosions

Snowball applies extra Frostbite stacks to trigger explosions frequently. Historical example uses two stacks and a ten-stack explosion; not JAC balance.

- **Base:** [JAC-B24](#jac-b24) · **Tags:** control, timing.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md#classes--builds).
- **Status:** Draft interview idea; not approved.

<a id="jac-i007"></a>
### JAC-I007 · Tactical crystal payoff

Attack a crystal instead of the boss for a temporary damage buff or heal. Encounter interaction idea, not an acquisition decision; historical example is +50% for ten seconds.

- **Base:** [JAC-B25](#jac-b25) · **Tags:** healing.
- **Origin:** Axel design interview; Interview example; no class commitment. [Documented source](../DESIGN_INTERVIEW_AXEL.md).
- **Status:** Draft interview idea; not approved.

## Combination and speculative hybrid ideas

All seven are speculative, unvalidated combinations; none establishes stacking rules or an accepted design. JC01–JC03 preserve earlier examples; H01–H04 are newly proposed synthesis, not claims about earlier discussions.

<a id="jc01"></a>
### JC01 · Lobbed Fireball + Living Flame

Arc over cover and leave a burning patch.

- **Participants:** [JAC-M027](#jac-m027), [JAC-M028](#jac-m028).
- **Origin:** Earlier JAC brainstorm. **Status:** Speculative idea; not approved. **Tags:** projectile, area, periodic.
- **Provenance:** [Earlier combination examples](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#combining-mutations-suggested-rules).

<a id="jc02"></a>
### JC02 · Contagious Poison + Fleet Venom

Ally-targetable poison enchant with movement utility.

- **Participants:** [JAC-M041](#jac-m041), [JAC-M042](#jac-m042).
- **Origin:** Earlier JAC brainstorm. **Status:** Speculative idea; not approved. **Tags:** movement, periodic.
- **Provenance:** [Earlier combination examples](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#combining-mutations-suggested-rules).

<a id="jc03"></a>
### JC03 · Totemic Legion + Ancestral Totem

Multiple persistent healing fields; compatibility and stacking unresolved.

- **Participants:** [JAC-M048](#jac-m048), [JAC-M049](#jac-m049).
- **Origin:** Earlier JAC brainstorm. **Status:** Speculative idea; not approved. **Tags:** healing, summon, area, timing.
- **Provenance:** [Earlier combination examples](../SKILL_MUTATION_CRAFTING_PROPOSALS.md#combining-mutations-suggested-rules).

<a id="h01"></a>
### H01 · Volatile familiar / totem

Explore an active summon sacrifice or expiry explosion; do not assume familiar and totem lifecycles are interchangeable.

- **Participants:** [JAC-M051](#jac-m051), [SOL-04-E03](#sol-04-e03).
- **Origin:** New speculative hybrid. **Status:** Speculative idea; not approved. **Tags:** summon.
- **Provenance:** Editorial synthesis in this library; no earlier attribution.

<a id="h02"></a>
### H02 · Refracting channeled beam

Explore aimed channel plus refraction; cover behavior, input and overlap remain questions.

- **Participants:** [JAC-M034](#jac-m034), [SOL-01-E03](#sol-01-e03).
- **Origin:** New speculative hybrid. **Status:** Speculative idea; not approved. **Tags:** beam, timing.
- **Provenance:** Editorial synthesis in this library; no earlier attribution.

<a id="h03"></a>
### H03 · Chilled storm setup

Explore a slowing field preparing a focused hit; no shared status contract is approved.

- **Participants:** [JAC-M013](#jac-m013), [ECL-03-E01](#ecl-03-e01).
- **Origin:** New speculative hybrid. **Status:** Speculative idea; not approved. **Tags:** control, area.
- **Provenance:** Editorial synthesis in this library; no earlier attribution.

<a id="h04"></a>
### H04 · Linked healing deployables

Explore deployable healing with a linked-protection motif; damage transfer and healing semantics unresolved.

- **Participants:** [JAC-M050](#jac-m050), [GEN-06](#gen-06).
- **Origin:** New speculative hybrid. **Status:** Speculative idea; not approved. **Tags:** healing, protection.
- **Provenance:** Editorial synthesis in this library; no earlier attribution.

<a id="preserved-energy-detail"></a>
## Preserved Energy detail

The following is the PR #12 text, including Swedish commentary. Imperative wording, priority A/B, target caps, suggested routes and “prototype first” favorites are preserved historical proposals, not current decisions. The “possible development systems” section records previously open alternatives and selects none.


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

<a id="gen-01"></a>
### Pulse Mend (GEN-01)

**Originalroll:** Direct healing.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Healer.

**Originalfunktion:** Heals a friendly target for 60 base health.

**Original cast / Flux / cooldown:** 1.5 sec cast · 16 Flux (18 with Vital Reversal) for Genesis

**JAC-tolkning (A):** Behåll tydlig räddningsheal. Offensiv variant kan hela 1–2 närliggande allierade i stället för hela laget.

**Källans kombination:** Vital Reversal → Resonance Guard
Damage an enemy to refill allies' existing Guard absorbs.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="gen-01-e01"></a>
- **Vital Crescendo** — Hold Pulse Mend to extend its cast to 2.5 sec, increasing its direct healing by 78%. Only applies when healing an ally.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Behåll laddad, stark singel-heal; tydligt val mellan snabb räddning och längre cast.
<a id="gen-01-e02"></a>
- **Second Heart** — Pulse Mend also marks its target for 12 sec. If they fall to 30% health or lower, the mark is consumed to heal for at least 22 base health or 27% of their maximum health, whichever is higher.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop / talent):* Skydd mot plötslig HP-dipp; en engångsproc med tydlig ikon och intern spärr.
<a id="gen-01-e03"></a>
- **Vital Reversal** — Pulse Mend can now target enemies. Deals 23 base damage to that enemy and heals each injured ally for 22 base health. Also restores up to 22% of the capacity of their active Resonance Guard.
  - *JAC-förslag (A; ST + 2 allies; möjlig väg: Talent):* Offensiv heal: skada markerad fiende och hela högst två skadade allierade; fyll deras befintliga absorb.

---

<a id="gen-02"></a>
### Resonance Guard (GEN-02)

**Originalroll:** Absorb shield.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Healer / support.

**Originalfunktion:** Shields yourself or an ally, absorbing up to 80 base damage for 8 sec. Damage is absorbed before health is lost.

**Original cast / Flux / cooldown:** Instant · 22 Flux · 32 sec cooldown

**JAC-tolkning (A):** Behåll den stora absorberande skölden. En nätverksvariant kan ge två andra allierade mindre sköldar.

**Källans kombination:** Guardian Network → Vital Cascade
Shield the entire team, then heal injured allies wherever they stand.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="gen-02-e01"></a>
- **Guardian Network** — Resonance Guard also grants every other teammate an absorb shield with 42% of the main shield's capacity, regardless of their position.
  - *JAC-förslag (B; Support 3; möjlig väg: Talent):* Största skölden på huvudmålet; högst två andra allierade får en mindre kopia inom räckvidd.
<a id="gen-02-e02"></a>
- **Retaliation** — Damage absorbed by Resonance Guard is stored. When the shield breaks or expires, release that stored energy as damage against up to 3 nearby enemies.
  - *JAC-förslag (B; ST + 1; möjlig väg: Bossdrop):* Lagra absorberad skada och rikta mot angriparen, med högst ett sekundärmål.
<a id="gen-02-e03"></a>
- **Last Stand** — Once during Resonance Guard, prevent an otherwise lethal hit and restore the protected ally to at least 28% of maximum health. Consumes the shield's rescue effect.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Låt skölden rädda från ett dödande slag en gång; stor audiovisuell trigger.

---

<a id="gen-03"></a>
### Vital Cascade (GEN-03)

**Originalroll:** Team healing.  **Måltyp (original):** Hela laget.  **Tänkbar JAC-roll:** Healer.

**Originalfunktion:** Heals the selected ally for 38 base health and each other injured teammate for about 30. Reaches allies anywhere on your team.

**Original cast / Flux / cooldown:** Instant · 32 Flux · 22 sec cooldown

**JAC-tolkning (B):** Låt första healen välja mål, med begränsad sekundär heal till 1–2 närmaste eller mest skadade allierade.

**Källans kombination:** Vital Cascade → Pulse Mend
Team-wide recovery, followed by focused rescue of the lowest-health ally.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="gen-03-e01"></a>
- **Double Cascade** — After Vital Cascade, a second healing wave occurs 0.65 sec later, restoring 20 base health to each ally who is still injured.
  - *JAC-förslag (B; Support 3; möjlig väg: Talent):* Andra healvågen träffar samma 2–3 gruppmedlemmar med kort fördröjning.
<a id="gen-03-e02"></a>
- **Rejuvenating Orbit** — Allies healed by Vital Cascade gain a 6 sec healing effect that restores 5 base health every second.
  - *JAC-förslag (B; Support 2; möjlig väg: Talent):* Ersätt stor allierad AoE med heal-over-time på de två mest skadade mottagarna.
<a id="gen-03-e03"></a>
- **Life Transfer** — After Vital Cascade, move health from a healthy ally to the most injured teammate. Transfers at most 14% of the donor's maximum health and never reduces the donor below 55% health.
  - *JAC-förslag (B; Support 2; möjlig väg: Bossdrop):* Tydlig 2-målsöverföring där donatorn aldrig sjunker under säker HP-gräns.

---

<a id="gen-04"></a>
### Stasis Seal (GEN-04)

**Originalroll:** Crowd control.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Healer / controller.

**Originalfunktion:** Incapacitates an enemy for up to 5 sec, preventing actions until the effect ends or damage breaks it. Bosses are immune; elites have a shorter duration.

**Original cast / Flux / cooldown:** Instant · 20 Flux · 24 sec cooldown

**JAC-tolkning (A):** Behåll kontroll mot vanliga fiender. Mot boss: kort störning eller sårbarhetsmarkör i stället för lång incapacitate.

**Källans kombination:** Stasis Seal → Vital Cascade
Control dangerous enemies while the team recovers.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="gen-04-e01"></a>
- **Tranquility Wave** — Stasis Seal also incapacitates up to 5 nearby ordinary enemies for up to 2 sec. Additional targets must be in range and are freed when damaged; bosses remain immune.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Sprid den korta extra kontrollen till max två närliggande normalfiender, inte fem.
<a id="gen-04-e02"></a>
- **Mercy Bloom** — When the Stasis Seal ends or is broken, heal the most injured teammate for 24 base health.
  - *JAC-förslag (A; ST ally; möjlig väg: Talent):* När kontrollen går sönder eller tar slut får mest skadade allierad en rescue-heal.
<a id="gen-04-e03"></a>
- **Essence Siphon** — While Stasis Seal is active, restore 4 Flux to Genesis every second and heal the most injured teammate for 5 base health each second.
  - *JAC-förslag (B; ST ally; möjlig väg: Bossdrop):* Behåll resurs/heal per sekund så länge kontrollen håller; balansbryt om spell skadas loss.

---

<a id="gen-05"></a>
### Vital Recall (GEN-05)

**Originalroll:** Healing recovery.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Healer / support.

**Originalfunktion:** Marks an ally for 4 sec. Cast again before the mark expires to restore 75% of health lost since marking, capped at 50% of the ally's maximum health.

**Original cast / Flux / cooldown:** Instant · 20 Flux · 36 sec cooldown

**JAC-tolkning (A):** Behåll återställning av nyligen förlorad hälsa; visa tidsfönster och återstående räddningspotential i UI.

**Källans kombination:** Vital Recall → Resonance Guard
Restore recently lost health and then protect against the next hit.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

<a id="gen-06"></a>
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

<a id="imp-01"></a>
### Phase Rush (IMP-01)

**Originalroll:** Targeted charge.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee.

**Originalfunktion:** Charges toward an enemy and stops at melee range. Cannot pass through walls or other obstacles.

**Original cast / Flux / cooldown:** Instant · 14 Flux · 17 sec cooldown

**JAC-tolkning (A):** Målstyrd charge som stannar vid melee. Belöna direkt uppföljning med interrupt eller en komboattack.

**Källans kombination:** Phase Rush → Arc Strike
Close the gap and immediately start your two-hit melee combo.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="imp-01-e01"></a>
- **Meteor Charge** — When Phase Rush reaches its target, unleash a kinetic blast dealing 20 base damage to nearby enemies, including the charged enemy.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Talent):* Riktad charge med närträff på max två fiender bredvid huvudmålet.
<a id="imp-01-e02"></a>
- **Relentless Pursuit** — If the enemy reached by Phase Rush dies within 3 sec, reset Phase Rush and allow another charge. Can refresh up to twice in one pursuit chain.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* En möjlig kill-reset i kort kedja; behåll hårt tak på antal resets.
<a id="imp-01-e03"></a>
- **Piercing Charge** — On reaching the target, send a kinetic shock through enemies lined up behind it, dealing 18 base damage to each eligible enemy in the path.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Vid landning går en chocklinje genom högst två bakomvarande mål; hinder stoppar.

---

<a id="imp-02"></a>
### Arc Strike (IMP-02)

**Originalroll:** Melee combo.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee / rogue.

**Originalfunktion:** Strikes an enemy for 13 base damage. Use Arc Strike again within 4 sec to deal 16% more damage with the second strike and restore 3 Flux.

**Original cast / Flux / cooldown:** Instant · 10 Flux · Melee range

**JAC-tolkning (A):** Behåll första/andra slagets rytm; utveckling kan ge ett tredje cleave-slag mot högst två grannar.

**Källans kombination:** Arc Strike → Phase Rush
Attack one enemy; Relentless Pursuit can refresh the charge when that enemy dies.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="imp-02-e01"></a>
- **Twin Arc** — Every third Arc Strike releases a wide frontal attack, dealing 65% of that strike's damage to up to 5 additional nearby enemies in front of you.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Var tredje melee-slag ger kort frontal cleave som bara hittar två extra fiender.
<a id="imp-02-e02"></a>
- **Overdrive** — The second Arc Strike of a combo becomes 3 rapid hits on the same target: one immediate strike and two delayed follow-ups. The combo's damage is split across the hits.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Splittra kombo-avslutet i tre snabba slag mot samma mål för tydlig rogue/warrior-känsla.
<a id="imp-02-e03"></a>
- **Kinetic Reprisal** — Completing an Arc Strike combo grants a 3 sec one-hit shield. It absorbs part of the next direct hit and retaliates against the attacker.
  - *JAC-förslag (A; ST counter; möjlig väg: Bossdrop):* Efter full kombo skyddas nästa direkta träff, och angriparen får riktad hämndträff.

---

<a id="imp-03"></a>
### Pulse Sever (IMP-03)

**Originalroll:** Melee interrupt.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee / utility.

**Originalfunktion:** Interrupts an enemy that is casting a spell, locking its magic school for 3 sec and dealing 8 base damage. Has no interrupt effect if the target is not casting.

**Original cast / Flux / cooldown:** Instant · 10 Flux · 15 sec cooldown

**JAC-tolkning (A):** Tydlig interrupt med school lock. Evolutions belönar en lyckad interrupt mer än de ökar passiv skada.

**Källans kombination:** Pulse Sever (Warpath) → Arc Strike
A successful interrupt increases melee damage for 4 sec.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="imp-03-e01"></a>
- **Echo Sever** — A successful Pulse Sever also interrupts up to 5 nearby non-boss enemies that are currently casting. Each additional interrupted enemy suffers a 2.5 sec school lock.
  - *JAC-förslag (B; 1 + 1; möjlig väg: Bossdrop):* Utöka lyckad interrupt till högst en annan fiende som faktiskt castar inom kort räckvidd.
<a id="imp-03-e02"></a>
- **Countershock** — A successful Pulse Sever releases a shockwave, dealing 15 base damage to enemies near the interrupted target.
  - *JAC-förslag (A; 1 + 1; möjlig väg: Talent):* Lyckad interrupt ger en kraftig smäll på caster och låg splash på en granne.
<a id="imp-03-e03"></a>
- **Warpath** — Successfully interrupting with Pulse Sever empowers your Arc Strike, Seismic Uppercut, Gravity Hammer and Phase Rush damage by 20% for 4 sec.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Lyckad interrupt laddar nästa tunga melee-attack; välj en tydlig spenderare framför flera buffs.

---

<a id="imp-04"></a>
### Gravity Hammer (IMP-04)

**Originalroll:** Ground impact.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Melee / bruiser.

**Originalfunktion:** Choose a location to deal 37 base damage to enemies in the impact area. Ordinary enemies are knocked down briefly; elites and bosses resist the knockdown.

**Original cast / Flux / cooldown:** 0.6 sec cast · 30 Flux · 20 sec cooldown

**JAC-tolkning (A):** Koncentrera ett stort slag till målpositionen med max två bifångster; tyngd och knockback syns i VFX.

**Källans kombination:** Gravity Hammer → Arc Strike
Damage a group, then focus enemies at melee range.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="imp-04-e01"></a>
- **Singularity Impact** — Gravity Hammer deals 65% more base damage in an area 40% smaller than normal. The concentrated impact no longer knocks enemies down.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Byt stor AoE mot exakt tung singelträff. Mindre radie ger tydlig trade-off.
<a id="imp-04-e02"></a>
- **Seismic Wave** — Gravity Hammer also releases 3 expanding shockwaves after impact, each dealing 8 base damage to enemies in its moving outer ring.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Tre visuella ringvågor; huvuddelen av skadan läggs på markerat mål och max två extras.
<a id="imp-04-e03"></a>
- **Gravity Well** — Gravity Hammer leaves a gravity field that pulses 4 times over 2.8 sec, dealing 6 base damage per pulse and pulling ordinary enemies toward its center. Bosses resist the pull.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Bossdrop):* Dra samman max två vanliga fiender; bossar påverkas av kort slow/debuff, inte pull.

---

<a id="imp-05"></a>
### Seismic Uppercut (IMP-05)

**Originalroll:** Launch and slam.  **Måltyp (original):** 1 + liten yta.  **Tänkbar JAC-roll:** Melee.

**Originalfunktion:** Hits a nearby enemy for 25 base damage, then slams the area for another 18 base damage after 0.42 sec. Ordinary enemies are briefly incapacitated; elites and bosses remain grounded.

**Original cast / Flux / cooldown:** Instant · 27 Flux · 25 sec cooldown

**JAC-tolkning (B):** Stor singel-target uppercut med följdsmäll. Mot boss ersätt full launch med ett avbrytbart stagger-fönster.

**Källans kombination:** Seismic Uppercut → Gravity Hammer
Follow the delayed slam with another ground attack against clustered enemies.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

<a id="imp-06"></a>
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

<a id="ecl-01"></a>
### Crystal Bolt (ECL-01)

**Originalroll:** Ranged damage.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / caster.

**Originalfunktion:** Launches a crystal for 15 base damage and slows the target by 35% for 3 sec.

**Original cast / Flux / cooldown:** 1.3 sec cast · 11 Flux for Eclipse

**JAC-tolkning (A):** Behåll lättavläst projektil, slow och spelbar upprepning. Primär setup inför tungt, villkorat avslut.

**Källans kombination:** Crystal Bolt → Fracture Spear
The Bolt's Slow increases the Spear's damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="ecl-01-e01"></a>
- **Rapid Crystal** — Reduces Crystal Bolt's cast time from 1.3 sec to 0.88 sec. Every third Crystal Bolt may also be cast while moving.
  - *JAC-förslag (B; ST; möjlig väg: Talent):* Snabbare cast och var tredje möjlig i rörelse; stark känslomässig skillnad utan stor AoE.
<a id="ecl-01-e02"></a>
- **Glacial Echo** — Crystal Bolt is followed 0.36 sec later by a second smaller hit on the same enemy, dealing 40% of the original Bolt's damage.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* En andra, mindre träff på samma mål med separat kristall-projektil.
<a id="ecl-01-e03"></a>
- **Fracture Chain** — Every third Crystal Bolt releases additional crystal hits at up to 3 other nearby enemies, each dealing 38% of the original Bolt's damage.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Var tredje projektil studsar till högst två extra fiender; primärträffen förblir viktigast.

---

<a id="ecl-02"></a>
### Crystal Snare (ECL-02)

**Originalroll:** Area control.  **Måltyp (original):** Flera nära mål.  **Tänkbar JAC-roll:** Ranged / control.

**Originalfunktion:** Roots nearby enemies around the selected target for up to 3 sec and marks them as Chilled for 5 sec. Bosses resist the root but can still be marked.

**Original cast / Flux / cooldown:** Instant · 15 Flux · 18 sec cooldown

**JAC-tolkning (A):** Roota ett huvudmål; valbar evolution kan koppla in en närliggande fiende. Boss blir märkt, inte fastlåst.

**Källans kombination:** Crystal Snare → Fracture Spear
Root/Chill the target before using the heavy spear.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="ecl-02-e01"></a>
- **Deep Freeze / Ice Tomb** — Crystal Snare becomes a 4 sec single-target incapacitate instead of an area root. Works on elites; bosses remain immune to hard crowd control.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Gör root till single-target kontroll med tydligt isfängelse; bossar blir märkta/sårbara men inte stunnade.
<a id="ecl-02-e02"></a>
- **Shatterfield** — When a Crystal Snare root expires, it releases 3 delayed frost pulses around the target, damaging and slowing nearby enemies.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Tre fördröjda pulser kring huvudmålet; högst två närliggande fiender tar sekundär skada.
<a id="ecl-02-e03"></a>
- **Crystal Conduit** — Enemies rooted together by Crystal Snare are linked for 3 sec. A direct hit on one linked target also deals up to 24% of that hit's damage to other linked rooted targets, capped at 12 base damage each.
  - *JAC-förslag (A; 2 targets; möjlig väg: Bossdrop):* Länka högst två markerade fiender och kopiera en begränsad andel av direkta träffar.

---

<a id="ecl-03"></a>
### Fracture Spear (ECL-03)

**Originalroll:** Heavy ranged hit.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / caster.

**Originalfunktion:** Hurls a crystal spear for 32 base damage. Deals 30% more damage to a target that is Rooted, Slowed or Chilled.

**Original cast / Flux / cooldown:** 1.7 sec cast · 21 Flux for Eclipse · 12 sec cooldown

**JAC-tolkning (A):** Bevara tydlig laddning och bonus mot redan påverkade mål. Stark kandidat för bossprecision.

**Källans kombination:** Fracture Spear → Froststorm
With Shattering Storm selected, a Spear hit inside the storm triggers extra damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="ecl-03-e01"></a>
- **Focused Fracture** — Fracture Spear deals 92% more damage to targets that are Rooted, Slowed or Chilled, including marked bosses. Remains strictly single-target.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Behåll strikt single-target; belöna setup med slow/chill även på bossmarkerade mål.
<a id="ecl-03-e02"></a>
- **Crystal Rupture** — Fracture Spear also explodes on impact, dealing 40% of the Spear's damage to up to 4 nearby enemies.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Fokuserad träff exploderar svagt till maximalt två fiender nära målet.
<a id="ecl-03-e03"></a>
- **Riftbreaker** — Fracture Spear creates up to 4 delayed crystal eruptions in a line beyond its target. Each eruption damages and briefly slows enemies; obstacles stop the sequence.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Två små eruptioner i en riktad linje bakom målet, i stället för fyra stora.

---

<a id="ecl-04"></a>
### Froststorm (ECL-04)

**Originalroll:** Ground damage.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Ranged / controller.

**Originalfunktion:** Creates a froststorm at a chosen location for 4 sec. Deals 8 base damage in pulses about once per second and slows ordinary enemies caught inside.

**Original cast / Flux / cooldown:** 0.45 sec cast · 30 Flux · 24 sec cooldown

**JAC-tolkning (B):** Minska stormens radie och låt direkta träffar på mål inne i zonen skapa kontrollerad bonus.

**Källans kombination:** Froststorm → Crystal Bolt
With Shattering Storm selected, Bolt hits inside the storm trigger an extra burst.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="ecl-04-e01"></a>
- **Glacial Barrage** — Froststorm also calls down 3 additional crystal comets at positions inside the storm, each dealing 12 base damage in a small area.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Tre precisa kometer inne i den mindre frostzonen; prioritera zonens huvudmål.
<a id="ecl-04-e02"></a>
- **Expanding Frost** — Froststorm lasts 6 sec instead of 4 and gradually expands its radius. It continues dealing its normal damage pulses throughout the extended duration.
  - *JAC-förslag (C; 1 + 2; möjlig väg: Talent):* Zonen växer lite och ger längre kontroll, men begränsa storlek och antal mål.
<a id="ecl-04-e03"></a>
- **Shattering Storm** — Crystal Bolt or Fracture Spear hitting an enemy inside your Froststorm triggers an additional shatter pulse, dealing 7 base damage to nearby enemies.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Talent):* Direktträff på en fiende inne i zonen triggar shatter-puls; använd intern trigger-cooldown.

---

<a id="ecl-05"></a>
### Crystal Mirror (ECL-05)

**Originalroll:** Single-hit protection.  **Måltyp (original):** 1 allierad.  **Tänkbar JAC-roll:** Support / caster.

**Originalfunktion:** Places a crystal mirror on yourself or an ally. Blocks the next eligible direct attack and launches retaliatory crystals at the attacker. Does not block damage-over-time or ground effects.

**Original cast / Flux / cooldown:** Instant · 23 Flux · 28 sec cooldown

**JAC-tolkning (B):** Sköld mot en direktträff som svarar med en riktad kristallretaliation. Tydlig reflektionsanimation.

**Källans kombination:** Crystal Mirror → Fracture Spear
Protect an ally while you complete a longer cast.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

<a id="ecl-06"></a>
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

<a id="sol-01"></a>
### Flux Bolt (SOL-01)

**Originalroll:** Ranged damage combo.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Deals 17 base Solar damage. Every third hit on the same enemy within 6 sec adds a burst of 6 base damage.

**Original cast / Flux / cooldown:** 1.5 sec cast · 10 Flux for Solar

**JAC-tolkning (A):** Behåll träffräknaren: tredje träffen laddar nästa effekt. Kan enkelt få blixt-, eld- eller arcane-tema.

**Källans kombination:** Flux Bolt → Solar Ascension
Each qualifying offensive Solar spell can consume a sigil for extra skybeam damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="sol-01-e01"></a>
- **Corona Volley** — Every third successful Flux Bolt hit sends additional Solar bolts to up to 3 other enemies near the original target, dealing 13 base damage each.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Var tredje Bolt skickar små gnistor till högst två närliggande fiender.
<a id="sol-01-e02"></a>
- **Thunderhead** — Every third Flux Bolt hit creates a storm over the target, striking it 3 additional times over about 1.6 sec.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Behåll tre extra nedslag centrerade på samma mål; fungerar mycket bra i en bossfight.
<a id="sol-01-e03"></a>
- **Helios Beam** — After 3 qualifying Flux Bolt hits on the same enemy, hold the next Flux Bolt to channel a focused beam for up to 2 sec. The beam deals repeated damage that grows with each tick; release early to stop.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Tre byggande hits öppnar en valbar kanalisering mot ett mål; risk för avbruten cast är trade-off.

---

<a id="sol-02"></a>
### Sun Lance (SOL-02)

**Originalroll:** Ranged finisher.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Strikes an enemy for 27 base Solar damage. Deals 18% more damage if the target is below 35% health.

**Original cast / Flux / cooldown:** 1.8 sec cast · 16 Flux for Solar

**JAC-tolkning (A):** Behåll tung finisher vid låg HP. Visuellt 'skybeam' när utförandet lyckas. Bra för bossar.

**Källans kombination:** Sun Lance → Solar Ascension
Use a high-damage Lance to consume one empowered Solar sigil.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="sol-02-e01"></a>
- **Judgment of Dawn** — When Sun Lance hits an enemy below 35% health, it deals 90% more damage than its normal base hit and triggers a finishing Solar beam from above.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Låg-HP execute på ett enda mål med separat himmelsstråle som avslut.
<a id="sol-02-e02"></a>
- **Scorching Lance** — Sun Lance burns its target for 5 base damage every 2 sec for 8 sec. If the burning target dies, it explodes and spreads a shorter Solar burn to nearby enemies.
  - *JAC-förslag (B; ST -> 1; möjlig väg: Talent):* Behåll burning DoT; vid död sprids den bara till en närmaste fiende.
<a id="sol-02-e03"></a>
- **Split Lance** — After Sun Lance hits, launch smaller follow-up lances at up to 2 nearby enemies that are already injured. Each deals 38% of the primary Lance's damage.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Två mindre finisher-spjut söker enbart redan skadade sidomål, aldrig okontrollerad kedja.

---

<a id="sol-03"></a>
### Zenith Crash (SOL-03)

**Originalroll:** Placed area damage.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Ranged / caster.

**Originalfunktion:** Choose a ground location. After a 2 sec cast, a Solar pillar deals 38 base damage to enemies in the area. Secondary targets take reduced damage.

**Original cast / Flux / cooldown:** 2 sec cast · 30 Flux · 18 sec cooldown

**JAC-tolkning (B):** Låt pelaren låsa mot målet efter kort cast, med mindre nedslagszon och högst två sidoträffar.

**Källans kombination:** Zenith Crash → Solar Ascension
A hit from the placed Solar pillar can trigger an Ascension skybeam.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="sol-03-e01"></a>
- **Solar Aftershock** — Zenith Crash triggers a second impact at the same location 0.85 sec later, dealing 45% of the main pillar's damage in a smaller area.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Bossdrop):* Låt mindre andra pelaren träffa samma markerade område efter kort fördröjning.
<a id="sol-03-e02"></a>
- **Burning Ground** — Zenith Crash leaves a burning field that deals 5.5 base damage to enemies in the area once per second for 3 sec.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Gör en liten brinnande zon vid målet; stark effekt om fienden står kvar snarare än bred AoE.
<a id="sol-03-e03"></a>
- **Prism Cross** — Zenith Crash releases 4 diagonal Solar beams from its impact point. Each beam damages enemies along its path and stops at solid obstacles.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Bossdrop):* Behåll fyra korsstrålar som stark VFX, men skada huvudsakligen mål samt max två i linjen.

---

<a id="sol-04"></a>
### Cinder Familiar (SOL-04)

**Originalroll:** Summoned attacker.  **Måltyp (original):** Valda fienden + närliggande.  **Tänkbar JAC-roll:** Ranged / pet.

**Originalfunktion:** Summons one Solar familiar for 12 sec. It follows you and automatically attacks your selected enemy or another nearby enemy roughly every 0.86 sec.

**Original cast / Flux / cooldown:** Instant · 25 Flux · 35 sec cooldown

**JAC-tolkning (A):** Låt följeslagaren prioritera markerad fiende och förstärka spelarens aktiva träffar i stället för ren auto-AoE.

**Källans kombination:** Cinder Familiar (Soulbrand) → Flux Bolt
Your Bolt hits on the familiar's marked target cause additional Solar discharges.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="sol-04-e01"></a>
- **Phoenix Dive** — While Cinder Familiar is active, it dives through enemies near its target roughly every 2.7 sec, damaging them and leaving a short damaging trail.
  - *JAC-förslag (B; 1 + 1; möjlig väg: Bossdrop):* Familiar dyker mot utpekat mål och passerar maximalt en granne; försök begränsa skärmbrus.
<a id="sol-04-e02"></a>
- **Soulbrand** — Cinder Familiar focuses on one enemy and attacks it more frequently. Your Flux Bolt, Sun Lance, Zenith Crash and Chain Tempest hits on that enemy trigger extra Solar damage.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Markera ett prioriterat mål; spelarens aktiva attacker får följeslagaren att proc:a på det målet.
<a id="sol-04-e03"></a>
- **Dying Star** — Recast Cinder Familiar while it is active to consume it in a targeted supernova, dealing 35 base damage to nearby enemies.
  - *JAC-förslag (A; 1 + 2; möjlig väg: Bossdrop):* Återkalla följeslagaren för kraftig riktad explosion; valbart lägre splash på max två.

---

<a id="sol-05"></a>
### Solar Ascension (SOL-05)

**Originalroll:** Empowered Solar spells.  **Måltyp (original):** Nästa 3 offensiva spells.  **Tänkbar JAC-roll:** Ranged / shaman.

**Originalfunktion:** Grants 3 Solar sigils for up to 12 sec. Each of your next 3 offensive Solar spells consumes one sigil to deal 15 additional base damage to its target.

**Original cast / Flux / cooldown:** Instant · 28 Flux · 38 sec cooldown

**JAC-tolkning (A):** Tydliga tre laddningar och sinsemellan valbara spenderare; använd som kombinationsmotor snarare än bara damage-buff.

**Källans kombination:** Solar Ascension → Chain Tempest
Trigger a sigil while chaining damage through multiple enemies.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

<a id="sol-06"></a>
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

<a id="voi-01"></a>
### Rift Slash (VOI-01)

**Originalroll:** Melee shadow damage.  **Måltyp (original):** 1 fiende.  **Tänkbar JAC-roll:** Melee / rogue.

**Originalfunktion:** Strikes an enemy with two Void blades for 21 base damage. Hitting an enemy affected by your Entropy Mark also restores 3 Flux.

**Original cast / Flux / cooldown:** Instant · 13 Flux · 3 sec cooldown

**JAC-tolkning (A):** Snabb dubbelbladsträff som bygger vidare på mark och teleport. Extra slag viktigare än passiv AoE.

**Källans kombination:** Entropy Mark → Rift Slash
Rift Slash on a marked enemy restores 3 Flux; Devouring Pact can also heal you.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="voi-01-e01"></a>
- **Phantom Assault** — Every third Rift Slash creates a shadow clone behind the struck enemy. The clone lands 2 additional delayed attacks, each dealing 46% of the original Slash's damage.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Var tredje närstridsträff ger två skuggklon-slag på samma mål; stor visuell identitet.
<a id="voi-01-e02"></a>
- **Umbral Cyclone** — Every third Rift Slash also strikes up to 10 other nearby enemies with a broad twin-blade cyclone, dealing 67% of that Slash's damage to each.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Behåll twin-blade swirl men träffa max två närliggande mål, inte tio.
<a id="voi-01-e03"></a>
- **Executioner's Veil** — Rift Slash against an Entropy-marked enemy at or below 30% health triggers 3 delayed finishing strikes. Can trigger once every 8 sec.
  - *JAC-förslag (A; ST; möjlig väg: Bossdrop):* Tre fördröjda avslut mot märkt låg-HP-fiende; intern cooldown bevarar timing.

---

<a id="voi-02"></a>
### Entropy Mark (VOI-02)

**Originalroll:** Damage over time.  **Måltyp (original):** 1 fiende; kan spridas.  **Tänkbar JAC-roll:** Rogue / shadow.

**Originalfunktion:** Marks an enemy, dealing 5 base Void damage every 2 sec for 12 sec. Rift Slash against a marked enemy also restores 3 Flux.

**Original cast / Flux / cooldown:** Instant · 15 Flux · 12 sec duration

**JAC-tolkning (A):** Behåll aktiv mark med tydlig visuell timer; explosion via recast ger spelaren beslut om skada nu eller senare.

**Källans kombination:** Rift Slash → Entropy Mark
With Psychic Collapse, build mark ticks then consume the mark for area damage.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="voi-02-e01"></a>
- **Contagion** — When an enemy affected by your Entropy Mark dies, spread the mark to up to 3 nearby unmarked enemies. The infection can spread through up to 3 generations.
  - *JAC-förslag (B; ST -> 1; möjlig väg: Talent):* Märket kan hoppa till EN närliggande fiende vid död, med max en vidare spridning.
<a id="voi-02-e02"></a>
- **Psychic Collapse** — After Entropy Mark has dealt damage twice, recast it for no Flux to consume the mark and deal 32 base damage to the target and 17 to nearby enemies. The recast starts a 3 sec cooldown.
  - *JAC-förslag (A; ST + 1; möjlig väg: Talent):* Recast konsumerar mark för tydlig singel-target explosion, med valbar liten sidoträff.
<a id="voi-02-e03"></a>
- **Devouring Pact** — Damaging an Entropy-marked enemy with Rift Slash also heals you for up to 23% of the damage dealt, capped at 13 health per trigger. Can trigger at most once every 0.75 sec.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Uthållighet genom attacker mot markerat mål; behåll heal-tak och intern cooldown.

---

<a id="voi-03"></a>
### Phase Slip (VOI-03)

**Originalroll:** Placed teleport.  **Måltyp (original):** Själv / kort distans.  **Tänkbar JAC-roll:** Melee / rogue.

**Originalfunktion:** Teleport to a chosen valid position within short range. Cannot teleport through solid walls or into occupied space.

**Original cast / Flux / cooldown:** Instant · 16 Flux · 23 sec cooldown

**JAC-tolkning (A):** Behåll positioneringsverktyg med tydlig landningsplats. Nästa melee-slag kan få skuggklon-uppföljning.

**Källans kombination:** Phase Slip → Rift Slash
Shadow Ambush adds 3 delayed strikes to your next Slash.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="voi-03-e01"></a>
- **Shadow Ambush** — For 4 sec after Phase Slip, your next Rift Slash triggers 3 extra delayed shadow strikes against its target, each dealing 40% of the original Slash's damage.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Teleportslag får tre extra snabba skuggträffar på samma mål under kort tidsfönster.
<a id="voi-03-e02"></a>
- **Rift Echo** — Phase Slip damages enemies along its actual teleport path with 5 delayed shadow echoes. Each echo deals 8 base damage in a small area.
  - *JAC-förslag (B; Högst 2; möjlig väg: Bossdrop):* Synliga ekon längs teleportsträckan, med skada mot max två faktiskt passerade fiender.
<a id="voi-03-e03"></a>
- **Veilwalk** — After Phase Slip, gain a 2.5 sec shadow veil. The next direct hostile attack against you passes through harmlessly and consumes the protection.
  - *JAC-förslag (A; Self; möjlig väg: Bossdrop):* Efter reposition undvik EN inkommande direkt attack; läsbar 'dodge'-feedback.

---

<a id="voi-04"></a>
### Void Metamorphosis (VOI-04)

**Originalroll:** Combat transformation.  **Måltyp (original):** Melee cleave + DoT.  **Tänkbar JAC-roll:** Melee / shadow.

**Originalfunktion:** Transform into a Void combat form for 8 sec. Rift Slash gains extra reach and damages nearby enemies, while Entropy Mark deals 27% more damage with each tick.

**Original cast / Flux / cooldown:** Instant · 23 Flux · 45 sec cooldown

**JAC-tolkning (A):** Kort men markant transformation med ny slagprofil. För bossar behövs utväg som inte kräver adds-kills.

**Källans kombination:** Void Metamorphosis → Entropy Mark
Marked ticks gain 27% damage; Mindstorm calls additional psychic spears.

**Evolutions i källan (alla effekter ordagrant bevarade):**

<a id="voi-04-e01"></a>
- **Dreadblade Form** — During Void Metamorphosis, Rift Slash gains greater reach. Every third Slash also sends out damaging blade arcs that hit other nearby enemies.
  - *JAC-förslag (B; 1 + 2; möjlig väg: Talent):* Ökad räckvidd mot huvudmål, var tredje swing kan träffa två grannar.
<a id="voi-04-e02"></a>
- **Mindstorm** — While transformed, each damage tick from your Entropy Mark calls down an additional psychic spear, dealing 9 base damage to the marked enemy.
  - *JAC-förslag (A; ST; möjlig väg: Talent):* Varje mark-tick i form triggar ett riktat psykiskt spjut på samma fiende; bossvänligt.
<a id="voi-04-e03"></a>
- **Soul Devourer** — While transformed, deaths of enemies affected by your Entropy Mark heal you for 14 health and extend the form by 1 sec, up to 4 extra sec. The form ends with a damaging Void blast.
  - *JAC-förslag (B; ST / kill; möjlig väg: Bossdrop):* Behåll heal/förlängning vid död, men skapa bossalternativ (t.ex. markkonsumtion) med samma hårda förlängningstak.

---

<a id="voi-05"></a>
### Abyssal Rift (VOI-05)

**Originalroll:** Placed area damage.  **Måltyp (original):** Markyta / många.  **Tänkbar JAC-roll:** Shadow / control.

**Originalfunktion:** Open a rift at a chosen location for 4 sec. It damages nearby enemies in repeated pulses, can absorb up to 3 eligible hostile projectiles, then implodes for additional damage.

**Original cast / Flux / cooldown:** Instant · 28 Flux · 32 sec cooldown

**JAC-tolkning (B):** Mindre rift som blockerar projektiler, markerar zon och imploderar på huvudmål. Ge två tydliga funktioner.

**Källans kombination:** Abyssal Rift → Dark Pact
Control a packed area, then land three targeted spears.

**Evolutions:** Inga angivna i originalfilen. Det betyder inte att JAC-versionen inte får några.

---

<a id="voi-06"></a>
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

<a id="c01"></a>
### C01 · Entropy Mark → Rift Slash + Devouring Pact

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [MARKED] + melee hit
- **Payoff:** Skuggslag mot markerad fiende återställer resurs och kan läka spelaren.
- **Mål:** 1 mål
- **Att bevaka:** Bygg spelkänsla runt mark → belönad träff.

<a id="c02"></a>
### C02 · Entropy Mark → Psychic Collapse

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [DOT_2_TICKS] + recast
- **Payoff:** Låt marken ticka två gånger, konsumera den sedan för riktad explosion.
- **Mål:** 1 mål + ev. 1
- **Att bevaka:** Beslut mellan fortsatt DoT och direkt burst.

<a id="c03"></a>
### C03 · Phase Slip → Shadow Ambush + Rift Slash

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [TELEPORTED] + next melee
- **Payoff:** Teleport skapar ett kort fönster där nästa slag får tre skuggträffar.
- **Mål:** 1 mål
- **Att bevaka:** Mycket tydlig rogue-identitet med bra VFX.

<a id="c04"></a>
### C04 · Void Metamorphosis → Entropy Mark + Mindstorm

- **Spelstil:** Void / Rogue · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [FORM_ACTIVE] + DOT tick
- **Payoff:** Varje mark-tick under formen skjuter ett extra mentalt spjut mot samma mål.
- **Mål:** 1 mål
- **Att bevaka:** Fungerar även mot boss utan minions.

<a id="c05"></a>
### C05 · Flux Bolt → Thunderhead

- **Spelstil:** Solar / Shaman · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [HIT_3]
- **Payoff:** Var tredje träff kallar ned tre uppföljande åsknedslag på samma fiende.
- **Mål:** 1 mål
- **Att bevaka:** Uppbyggnad och payoff syns lätt.

<a id="c06"></a>
### C06 · Cinder Familiar → Soulbrand + Flux Bolt

- **Spelstil:** Solar / Shaman · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [PET_MARKED] + spell hit
- **Payoff:** Direktträffar på familiarens prioriterade mål triggar extra familiar-attacker.
- **Mål:** 1 mål
- **Att bevaka:** Pet får en aktiv roll i rotationen.

<a id="c07"></a>
### C07 · Solar Ascension → Sun Lance / Judgment of Dawn

- **Spelstil:** Solar / Shaman · **Ursprung:** Källfil + komboförslag · **Prioritet:** A
- **Trigger:** [CHARGE_AVAILABLE] + execute
- **Payoff:** Spara en laddning till en tung finisher när bossen kommer under HP-tröskeln.
- **Mål:** 1 mål
- **Att bevaka:** Tydligt beslut när sista sigilen ska användas.

<a id="c08"></a>
### C08 · Crystal Snare → Fracture Spear / Focused Fracture

- **Spelstil:** Eclipse / Mage · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [CHILLED] + heavy cast
- **Payoff:** Kontroll eller debuff ökar värdet på en tung precisionsprojektil.
- **Mål:** 1 mål
- **Att bevaka:** Boss får debuff utan att frysas fast.

<a id="c09"></a>
### C09 · Froststorm → Fracture Spear / Shattering Storm

- **Spelstil:** Eclipse / Mage · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [IN_ZONE] + direct hit
- **Payoff:** Direktträff på zonmarkerat mål utlöser en kontrollerad isexplosion.
- **Mål:** 1 mål + ev. 2
- **Att bevaka:** Internt trigger-tak för att undvika proc-spam.

<a id="c10"></a>
### C10 · Phase Rush → Pulse Sever

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag · **Prioritet:** A
- **Trigger:** [DASH_ARRIVAL] + CASTING
- **Payoff:** Ladda fram till en caster och avbryt den direkt på nära håll.
- **Mål:** 1 mål
- **Att bevaka:** Ingen gratis interrupt vid dash: spelaren trycker nästa förmåga.

<a id="c11"></a>
### C11 · Pulse Sever / Warpath → Arc Strike / Overdrive

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag · **Prioritet:** A
- **Trigger:** [INTERRUPT_SUCCESS] + next melee
- **Payoff:** Lyckad interrupt laddar nästa komboavslut för extra slag.
- **Mål:** 1 mål
- **Att bevaka:** Bygger skicklighetsbelöning snarare än konstant buff.

<a id="c12"></a>
### C12 · Gravity Hammer / Gravity Well → Zenith Crash

- **Spelstil:** Impact / Warrior · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** A
- **Trigger:** [PULLED] + placed strike
- **Payoff:** När småfiender dragits mot huvudmålet landar en tung himmelsattack.
- **Mål:** 1 mål + högst 2
- **Att bevaka:** Boss dras inte, men kan märkas för precisionsnedslag.

<a id="c13"></a>
### C13 · Pulse Mend / Vital Reversal → Resonance Guard

- **Spelstil:** Genesis / Healer · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [ENEMY_HIT] + SHIELDED
- **Payoff:** Offensiv heal fyller på en del av allierades aktiva absorb.
- **Mål:** 1–2 allierade
- **Att bevaka:** Kan passa offensivt support-kit.

<a id="c14"></a>
### C14 · Soul Relay → Pulse Mend

- **Spelstil:** Genesis / Healer · **Ursprung:** Källfil · **Prioritet:** B
- **Trigger:** [LINKED_ALLIES] + heal
- **Payoff:** En heal på ena länkade allierade delar en mindre heal till den andra.
- **Mål:** 2 allierade
- **Att bevaka:** Visuell länk måste vara läsbar.

<a id="c15"></a>
### C15 · Vital Recall → Resonance Guard

- **Spelstil:** Genesis / Healer · **Ursprung:** Källfil · **Prioritet:** A
- **Trigger:** [RESTORED_HP] + protect
- **Payoff:** Rädda nyligen förlorad hälsa och ge direkt därefter absorb mot uppföljningssmäll.
- **Mål:** 1 allierad
- **Att bevaka:** Högt defensivt värde; undvik permanent immunitet.

<a id="c16"></a>
### C16 · Crystal Snare → Chain Tempest

- **Spelstil:** Eclipse + Solar · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [CONTROLLED_OR_CHILLED] + chain hit
- **Payoff:** Blixten söker märkt huvudmål och kan studsa till en enda granne.
- **Mål:** 1 + 1
- **Att bevaka:** Gör status [CONTROLLED] generell, inte låst till frost.

<a id="c17"></a>
### C17 · Entropy Mark → Cinder Familiar / Soulbrand

- **Spelstil:** Void + Solar · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** A
- **Trigger:** [MARKED] + companion hit
- **Payoff:** Familiaren prioriterar fienden som lagkamraten markerat och ger bonusattack vid träff.
- **Mål:** 1 mål
- **Att bevaka:** Universaliserad mark; kräver inte att exakt Void finns.

<a id="c18"></a>
### C18 · Crystal Conduit → Arc Strike / Overdrive

- **Spelstil:** Eclipse + Impact · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [LINKED_ENEMIES] + combo hit
- **Payoff:** En tung närstridskombo på ett länkat mål ger liten delad effekt på dess partner.
- **Mål:** 2 mål
- **Att bevaka:** Tak på kopierad skada för balans.

<a id="c19"></a>
### C19 · Resonance Guard → Dark Pact

- **Spelstil:** Genesis + Void · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [SHIELDED] + HP sacrifice
- **Payoff:** Skydda castern mot inkommande skada under förberedelsen av en riskfylld HP-finisher.
- **Mål:** 1 allierad + 1 fiende
- **Att bevaka:** Absorb ska INTE ta bort den egna HP-kostnaden.

<a id="c20"></a>
### C20 · Crystal Mirror → Helios Beam

- **Spelstil:** Eclipse + Solar · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** A
- **Trigger:** [BLOCK_NEXT_HIT] + channel
- **Payoff:** En reflexsköld gör en riskabel, riktad beam-cast möjlig i ett kort bossfönster.
- **Mål:** 1 allierad + 1 fiende
- **Att bevaka:** Undvik att kanaliseringen blir oavbrytbar.

<a id="c21"></a>
### C21 · Stasis Seal / Mercy Bloom → Phase Rush / Arc Strike

- **Spelstil:** Genesis + Impact · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [CC_END] + engage
- **Payoff:** När kontrollen bryts får support en rescue-heal samtidigt som melee öppnar kombo.
- **Mål:** 1 fiende + 1 allierad
- **Att bevaka:** Avslutas av inkommande skada: uppmuntrar timing.

<a id="c22"></a>
### C22 · Entropy Mark → Gravity Well / Gravity Hammer

- **Spelstil:** Void + Impact · **Ursprung:** JAC-förslag / klassöverskridande · **Prioritet:** B
- **Trigger:** [MARKED] + controlled burst
- **Payoff:** Den tunga attacken fokuserar markerat mål; högst två grannar dras in kort.
- **Mål:** 1 + 2
- **Att bevaka:** Visuellt imponerande men ska inte kräva stor mobpack.

<a id="c23"></a>
### C23 · Flux Bolt / Thunderhead → Sun Lance / Judgment of Dawn

- **Spelstil:** Solar / Shaman · **Ursprung:** JAC-förslag · **Prioritet:** A
- **Trigger:** [PROC_READY] + LOW_HP
- **Payoff:** Spara laddad åskstorm och avsluta med en single-target himmelsstråle.
- **Mål:** 1 mål
- **Att bevaka:** Spelaren måste välja när proccen konsumeras.

<a id="c24"></a>
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
