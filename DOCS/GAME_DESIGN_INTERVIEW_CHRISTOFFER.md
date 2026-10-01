# JAC Works — Individual Design Interview: Christoffer

**Status:** Developer-reviewed and approved  
**Source:** Interview conducted using `DOCS/GAME_DESIGN_QUESTIONNAIRE.md`  
**Important:** This document captures Christoffer's individual preferences and is not an accepted JAC Works design decision.

## Developer
Name: Christoffer

## Current vision
Ett PvE/PvP-spel som fungerar lika legitimt solo som tillsammans med vänner eller matchmade spelare. Kärnan är skillbaserad combat där spelaren tydligt känner att segern beror på hur bra man spelar, samtidigt som karaktären utvecklas genom fler verktyg, builds, gear och högre power.

Spelet visualiseras främst som ett modernt, relativt stilrent 3D top-down-spel med fantasykänsla. Miljöerna kan vara dämpade och behagliga medan combat bryter av med färgstarka, kraftfulla spells och tydliga visuella effekter.

Det ska gå att hoppa direkt in i combat under ett kort pass, men också finnas längre aktiviteter och downtime för builds, gear, crafting och annan progression.

## Must haves
- Combat måste kännas bra och ge tydlig feedback på vad spelaren själv gör och vad som händer runt omkring.
- Spelarens skill måste ha stor betydelse för resultatet.
- Misstag ska oftast skapa ett svårare läge snarare än omedelbar förlust. En skicklig spelare ska kunna återhämta sig.
- En mycket skicklig spelare ska ibland kunna vinna trots gearmässigt, numerärt eller taktiskt underläge.
- Spelet ska fungera både solo och tillsammans med andra utan att solo känns som ett sekundärt läge.
- Kortare spelsessioner ska kunna leda till samma långsiktiga progression som långa sessioner.
- Combat ska vara lätt att förstå relativt tidigt men ha mycket djup och hög skill ceiling längre fram.
- AI måste kännas trovärdig och passa den typ av motståndare den representerar.
- PvE- och PvP-progression ska inte bli två helt separata gear-ekosystem. Gear från den ena delen ska kunna användas meningsfullt i den andra.
- Progression ska ge fler verktyg och spelmöjligheter, inte bara större siffror.

## Strong preferences
- Live combat framför turn-based combat.
- 3D top-down-perspektiv.
- Fri, responsiv movement med känsla ungefär som fri rörelse i ett MMO.
- Cirka 8–12 aktiva abilities känns lagom.
- Ungefär 30 % av skill-expression får gärna komma från movement/positionering; resten främst från timing, ability-val, resurser, cooldowns och situationsläsning.
- Mechanical execution i själva fighten ska väga tyngre än förberedelser, även om gear, build och encounter-kunskap fortfarande spelar stor roll.
- Combat ska tillåta stark visuell spektakel utan att bli svårläst.
- Optional hard modes, achievements och alternativa sätt att besegra encounters är mycket attraktiva.
- Svårare content ska främst bli svårare genom nya mechanics, kombinationer av mechanics, tajtare execution och smartare beteende — inte bara högre HP/skada.
- Bascontent ska vara tillgängligt för en vanlig spelare, medan högre svårighetsgrader kräver klart mer.
- Normal/Hard/Mythic-liknande svårighetsgrader känns bra.
- Repetition av redan klarat content ska helst vara frivillig snarare än ett krav.
- Matchmaking/randoms ska göra multiplayer lättillgängligt utan att kräva en fast grupp.
- Progression bör så småningom nå ett power-tak snarare än fortsätta oändligt.

## Interesting ideas
- Encounters kan anpassa vissa mechanics efter gruppsammansättning så att exempelvis tre DPS kan spela tillsammans utan att någon tvingas byta roll.
- En hybrid mellan live combat och turn-based-element skulle kunna vara värd att experimentera med, även om live combat är förstapreferensen.
- En klass inspirerad av både Shadow Priest och Demon Hunter:
  - pressure;
  - self-healing;
  - mörk magi;
  - momentum;
  - hög mobilitet;
  - aggressiv melee;
  - burst.
- Ett alternativt progressionssystem istället för traditionella character levels, exempelvis någon typ av rank.
- Misslyckade bossförsök skulle eventuellt kunna ge en temporär resurs för att låsa upp ledtrådar om encountert. Idén är osäker och inte en uttalad preferens.
- En hubbstruktur med viss världskänsla snarare än krav på en stor sammanhängande open world.
- Housing/base kan vara trevligt om scope tillåter det, men är inte centralt.
- Återanvändning av tidigare byggd rating-skalad PvP-AI kan vara relevant om JAC Works får AI-baserad PvP-lik combat.

## Explicitly does not want
- Överdrivet komplexa progressionsträd med exempelvis enorma mängder talent points.
- Gear/items med många svåröverskådliga lager av system ovanpå varandra.
- Långsam progression där begränsad speltid gör att det tar orimligt lång tid att känna utveckling.
- Tvång att repetera samma redan klarade content bara för att fortsätta progressionen.
- Att spelaren måste byta klass eller spelstil för att kompisgruppen råkar ha “fel” gruppsammansättning.
- Att den egna progressionen automatiskt skalas bort bara för att man spelar med svagare vänner.
- Att PvP-gear bara fungerar i PvP och PvE-gear bara fungerar i PvE.
- Oändlig rå power-progression utan ett slut.
- Lore som central bärande del av spelet är inte viktigt personligen.

## Core gameplay / combat
- Combat är det spelaren ska göra större delen av tiden.
- Segern ska framför allt kännas förtjänad genom spelarens skill.
- Skill omfattar:
  - reaktion och precision;
  - movement och positionering;
  - ability-val;
  - cooldown/resource management;
  - läsa fienden;
  - anpassning;
  - strategi.
- Ett misstag behöver inte vara katastrofalt. Spelet bör skapa en återhämtningsfas där marginalerna blir mindre och skill-kraven större.
- Att vinna efter att ha hamnat i underläge kan vara ännu mer tillfredsställande än en perfekt fight.
- Att vinna något man “egentligen inte borde klara” på grund av högre personlig skill är mycket tillfredsställande.
- Misstag kan ibland straffas genom missad bonusbelöning snarare än död.
- Combat får variera i intensitet; det behöver inte konstant vara högsta tempo.
- Spells och attacker ska kunna vara stora, färgstarka och mäktiga samtidigt som spelaren lätt kan läsa situationen.
- Combat ska kännas smooth.

## Multiplayer / solo
- Solo och co-op ska båda kännas som rätt sätt att spela.
- Aktiviteter bör i stor utsträckning kunna skalas till solo.
- Gruppspel får gärna ge större belöning per session.
- Flera solopass ska ändå kunna ge samma slutliga belöning/progression som ett längre grupppass.
- Exempel: flera 30-minuterssessioner ska kunna motsvara en längre 1–3 timmars aktivitet över tid.
- Långa aktiviteter bör gå att pausa/fortsätta senare eftersom verkliga avbrott måste fungera.
- Det bör kunna gå att fortsätta senare med kompisar eller AI.
- AI companions ska kunna ersätta människor när kompisarna inte finns tillgängliga.
- Gruppmedlemmar ska behöva varandra, men inte så hårt att varje individuell svaghet automatiskt dödar gruppen.
- En riktigt skicklig spelare ska kunna bära laget i viss utsträckning.
- Kompisar med högre progression ska kunna hjälpa/bära svagare spelare.
- Den starkare spelarens progression ska helst inte neutraliseras för att matcha den svagare.
- Random matchmaking ska vara naturligt och snabbt.
- Om spelet får MMO-liknande social struktur är textchat önskvärt, men inbyggd voice är inte viktigt.

## Classes / builds
- Cirka 6–9 klasser känns lagom.
- Grov önskad fördelning:
  - 2–3 melee-orienterade;
  - 2–3 ranged-orienterade;
  - 2–3 healing-orienterade.
- Varje klass ska kunna stödja flera tydligt olika spelstilar.
- Exempelvis Mage-liknande Frost/Fire/Arcane-varianter.
- En healer ska kunna byggas mer offensivt och bidra tydligt med DPS.
- Roller får gärna vara mjukare än strikt tank/healer/DPS.
- Talents ska främst ändra gameplay, synergi eller abilities snarare än ge +1 %.
- Respec/build-byte ska vara relativt enkelt, eventuellt med en mindre kostnad.
- En ny build inom samma klass ska inte innebära att progression görs om.
- Ny klass ska däremot nästan kännas som en ny resa, men gärna med viss account-level fördel från tidigare progression.
- Personligt attraktiva klassfantasier:
  - Shadow Priest-lik healer/DPS-hybrid;
  - Warrior/Rogue/Demon Hunter-lik melee;
  - särskilt intressant: Shadow Priest + Demon Hunter-hybridklass.

## Progression
- Efter cirka tio timmar bör karaktären ha:
  - fler abilities/verktyg;
  - mer specialiserad build;
  - bättre gear;
  - märkbart högre power;
  - tillgång till svårare content.
- “Fler val och möjligheter” är viktigare än “bara starkare”, även om power också är viktigt.
- Under resan ska karaktären faktiskt bli starkare.
- Motståndet ska samtidigt bli svårare.
- När power-progressionen är färdig bör progressionen skifta mot:
  - alternativa builds;
  - mastery;
  - rating;
  - cosmetics;
  - achievements;
  - svårare content;
  - nya klasser.
- Traditionella levels är inte nödvändiga.
- Någon annan typ av rank/progressionsnivå kan fungera.
- Om levels/ranks finns ska de ha ett tydligt max.
- Rating/mastery ska kunna fortsätta längre och visa spelarens skill både i PvE och PvP-lik combat.
- Progressionen ska ge märkbara belöningar relativt snabbt eftersom speltiden är begränsad.

## Loot / crafting
- Gear är en tydlig men inte dominerande del av spelets identitet.
- Rare, minnesvärda drops är attraktiva.
- Gear känns bäst när det förändrar hur en ability eller build fungerar.
- Stats får också finnas men behöver inte vara hela poängen.
- Deterministisk progression mot specifik gear genom crafting är positivt.
- Spelaren får gärna kunna se var viss känd loot kommer ifrån.
- Samtidigt är överraskningsloot mycket attraktivt.
- Exakt hur slumpmässiga två exemplar av samma item bör vara är fortfarande öppet.
- Oönskad loot ska kunna behålla värde och omvandlas till något användbart.
- Crafting ska vara valfritt, inte obligatoriskt.
- Den som investerar i crafting ska dock belönas för det.
- Crafting-material bör komma från flera typer av aktiviteter, inte bara bossloot.
- PvP- och PvE-gear ska vara korsanvändbart.

## Encounters / difficulty
- WotLK-lik raidbossdesign är en stark referenspunkt:
  - tydliga och unika encounter-identiteter;
  - mechanics som samverkar;
  - gruppkoordination;
  - faser;
  - optimering över flera försök;
  - alternativa sätt att göra encountert;
  - hard modes med särskild belöning.
- Det är positivt att en svår boss kräver flera försök innan den besegras.
- Encounters bör ha en lärbar grund men också viss variation så att spelaren fortfarande måste läsa situationen.
- Svårare versioner ska lägga till eller kombinera mechanics, öka execution-kraven och/eller förbättra beteendet.
- En mycket skicklig spelare ska kunna klara content tidigare eller med sämre gear än rekommenderat.
- Optional challenges, flawless-liknande mål, speed challenges, speciella kill conditions och liknande är attraktiva.
- Specialvillkor får gärna ge achievements, särskild loot eller andra erkännanden.
- Vid failure ska retry kunna ske direkt.
- Spelet får gärna hjälpa spelaren förstå varför ett försök misslyckades, men exakt hur mycket information som ska ges är inte fastställt.

## AI
- AI companions ska kännas som trovärdiga medspelare, inte perfekta verktyg.
- De får ha:
  - egna styrkor;
  - svagheter;
  - mindre perfekta beslut.
- De ska huvudsakligen agera självständigt.
- Några enkla kommandon kan vara acceptabla.
- PvP-AI och PvE-AI ska vara tydligt olika.
- PvP-AI:
  - ska kunna läsa spelaren;
  - reagera på beteenden;
  - identifiera vanor;
  - anpassa sig;
  - ge en mer mänsklig motståndarkänsla.
- PvE-AI:
  - ska vara encounter-driven;
  - i hög grad förutsägbar och lärbar;
  - reagera på situationer inom tydliga regler;
  - inte aktivt börja motspela spelarens personliga vanor på ett sätt som förstör raid-lärandet.
- Tidigare utvecklad rating-baserad 3v3-AI kan vara relevant att återanvända eller inspireras av.

## World / presentation
- Världen behöver inte vara lore-tung.
- Spelet kan fungera med snygga arenor, hubbar och stilrena menyer.
- Visuell riktning:
  - 3D top-down;
  - relativt enkel men modern grafik;
  - viss WoW-lik fantasykänsla i miljöerna;
  - relativt mörka, dämpade pastelltoner;
  - behagliga miljöer;
  - cozy känsla under idle/downtime;
  - mer intensitet och mystik under combat;
  - spells/attacker ska vara tydligt mer färgstarka och glowiga än omgivningen.
- Visuell identitet och VFX är mycket viktiga.
- Lore får gärna finnas som ett lager, men är inte personligen viktigt.
- Cosmetics, titles och achievements är attraktiva.
- Housing/base är “nice to have”, inte centralt.

## Long-term / replayability
Efter avslutad power-progression ska återspelbarheten framför allt komma från:
- högre rating/mastery;
- svårare difficulties;
- achievements;
- special challenges;
- nya builds;
- nya klasser;
- cosmetics;
- nytt content.
- Spelet behöver inte hålla spelaren kvar genom oändliga statökningar.
- Samma grupp ska inte vara ett krav; random matchmaking ska vara naturligt.
- Repetition ska vara frivillig men kunna belönas genom:
  - bättre gear;
  - progression mot mål;
  - rare loot;
  - rating/mastery;
  - achievements;
  - möjligheten att spela encountert bättre.

## Scope priorities
1. **Combat feedback och readability**  
   Spelaren måste tydligt förstå både egna actions och vad som händer runt omkring.

2. **Grafisk helhet, combat-känsla och visuella effekter**  
   Kraftfulla spells, animationer och rörelser ska kunna ske samtidigt och fortfarande se bra, tydliga och smooth ut.

3. **Trovärdig AI**  
   Bossar, mobs, PvP-liknande fiender och AI allies måste bete sig på ett sätt som känns trovärdigt för sin roll.

### Mest villig att förenkla/skära
- Housing/base kan tas bort först.
- Lore/story kan hållas mycket enkel.

### Personligen mest intressant att bygga
- Grafisk helhet och identitet.
- Visuella effekter.
- Combat-känslan.

### Personligen minst intressant att bygga
- Lore och narrativ design.

### Utvecklingsfällor
Ingen särskild feature identifierades spontant som en tydlig utvecklingsfälla.

## Prototype test
Den minsta prototypen behöver låta spelaren prova **riktig PvE- eller PvP-lik combat**.

Den måste framför allt bevisa att:
- movement känns bra;
- abilities känns bra att använda;
- feedback/readability fungerar;
- combat känns smooth;
- motståndet känns trovärdigt;
- combat-systemet i sig redan känns tillräckligt bra för att vilja fortsätta utveckla spelet.

Djup progression, stor värld, lore och mycket content behöver inte finnas i den första prototypen.

## Open questions / uncertainties
- Exakt hur spelets “twist” jämfört med WoW ska se ut.
- Exakt hur PvE- och PvP-känslan ska kombineras i samma struktur.
- Om traditionella levels ska finnas eller ersättas av rank/annan progression.
- Exakt hur hårt roller ska definieras.
- Hur adaptive encounter mechanics efter gruppsammansättning ska fungera.
- Exakt hur item-randomness ska fungera.
- Exakt hur mycket hjälp spelet ska ge efter misslyckade bossförsök.
- Om misslyckande-token/ledtrådssystemet är en bra idé.
- Om live combat kan eller bör innehålla vissa turn-based-element.
- Exakt vilket unikt system som ska skilja JAC Works från sina inspirationskällor.
- Vilken mindre account-wide fördel en ny klass ska få från tidigare progression.

## Potential tensions within their own answers
- Karaktären ska bli märkbart starkare genom progression, men personlig skill ska samtidigt väga mycket tungt. Designen behöver undvika både rena gear-checks och känslan att gear saknar betydelse.
- Gruppspel ska ge större belöning per session, men solo ska kunna nå samma slutliga belöningar. Balansen mellan effektivitet och likvärdig tillgång behöver testas.
- Spelare ska behöva varandra i co-op, men gruppsammansättningen ska samtidigt vara mycket fri och skickliga spelare ska kunna bära andra.
- Encounters ska vara lärbara genom repetition men samtidigt innehålla tillräcklig variation för att kräva adaptation.
- Combat ska kunna vara visuellt spektakulärt med många effekter samtidigt, samtidigt som readability är högsta prioritet.
- PvP- och PvE-gear ska fungera i båda lägena, samtidigt som de två typerna av combat kan ställa ganska olika krav på builds.
- Spelaren vill ha kontroll över vilken aktivitet som spelas, men uppskattar samtidigt secrets, överraskningsloot och discovery.
- Gear är bara “lagom viktigt”, men bra gear ska ändå kännas betydelsefullt och kunna förändra builds.

## New ideas not previously captured
- Encounters som dynamiskt förändrar mechanics efter gruppens faktiska sammansättning istället för att kräva fasta roller.
- Shadow Priest/Demon Hunter-inspirerad klass med dark magic, pressure, self-healing, momentum, hög mobilitet och aggressiva melee/burst-fönster.
- Samma långsiktiga belöningar möjliga genom många korta sessioner som genom långa raidliknande aktiviteter.
- Långa instanser som går att lämna och fortsätta senare, även med annan kombination av människor och AI.
- Separation mellan avslutningsbar **power progression** och fortsatt **skill progression/rating** även för PvE.
- Möjligheten att använda tidigare utvecklad rating-skalad PvP-AI som grund för JAC Works PvP-liknande AI.
- Failure skulle eventuellt kunna mata ett begränsat hint-system utan att ge permanent valuta.

## Confidence
- **Must have:** Skillbaserad combat där execution spelar stor roll.
- **Must have:** Solo och multiplayer ska båda vara legitima sätt att spela.
- **Must have:** Kort speltid får inte blockera samma långsiktiga progression.
- **Must have:** Combat feedback/readability måste vara mycket bra.
- **Must have:** Trovärdig AI.
- **Strong preference:** Live, 3D top-down combat.
- **Strong preference:** 8–12 abilities och hög skill ceiling.
- **Strong preference:** Progression genom fler val/verktyg snarare än enbart högre siffror.
- **Strong preference:** Hard modes, achievements och alternativa encounter-lösningar.
- **Strong preference:** PvE/PvP gear ska vara korsanvändbart.
- **Strong preference:** Progression ska ha ett power-tak.
- **Strong preference:** 6–9 tydligt olika klasser med flera spelstilar.
- **Strong preference:** Dämpade miljöer + färgstarka, glowiga combat-effekter.
- **Strong preference:** Normal/Hard/Mythic-liknande svårighetsstege.
- **Strong preference:** Repetition ska vara frivillig.
- **Interesting idea:** Adaptive mechanics efter gruppsammansättning.
- **Interesting idea:** Shadow Priest/Demon Hunter-hybridklass.
- **Interesting idea:** Hybrid av live och turn-based combat.
- **Interesting idea:** Failure-tokens för encounter-ledtrådar.
- **Interesting idea:** Housing/base.
- **Don't care / open:** Exakt item-randomness.
- **Don't care / open:** Traditionella levels kontra annat rank-system.
- **Don't want:** Systemöverlast, enorma talentträd och lager-på-lager-itemization.
- **Don't want:** Tvångsgrind.
- **Don't want:** PvE och PvP som separata progressionsekosystem.
- **Don't want:** Att fasta grupproller hindrar kompisar från att spela tillsammans.
- **Don't want:** Oändlig rå power-progression.
