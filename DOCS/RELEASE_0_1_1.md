# 0.1.1 - Truffle Man slam and poison

Requested PATCH release from 0.1.0, including the requested compatible poison mechanic. Internal boss ID `greenCone`, existing save keys, rewards, model, attribution and walking remain intact. No production deployment or main push is part of this change.

## Slam correction

Inspection of the shipped GLB and its sampled source idle showed the imported mirrored hierarchy puts `Arm1.L` at root X +0.947, Y 3.894; `IKHand.L` rests at X +1.727, Y 1.994 (boss scale). The old overhead target X -0.43, Y 2.65 crossed the centreline below the shoulder. Its chest pitch also moved the shoulders backward at impact. Arm bones extend along their local +Y; the source rest rotations and mirrored model transform make global Euler guesses inappropriate. Both embedded animation groups have 270 channels; the existing loader samples the source idle and stops the clips before the procedural overlay.

Targets now derive from each shoulder and measured upper/lower arm lengths, on that shoulder's side, above its head. The chest winds back, then leans forward into a two-arm downward smash. Two-bone IK aims the deforming arms at independently rigged hand controls. Resetting the sampled rest transforms every frame preserves walking and prevents cumulative rotations. Feet remain planted, recovery restores idle, and the authoritative impact/recovery timing is unchanged. The licensed binary asset is unmodified.

## Normal Truffle Man poison

| Rule | Value |
| --- | --- |
| First mark | 6 seconds after fight starts |
| Subsequent marks | 20 seconds between marks |
| Target | One living player, rotating through the room's living-player order; never a totem |
| Countdown | Exactly 5,000 ms from mark deadline to detonation deadline |
| Position | Marked player's current authoritative position at detonation, after movement that tick |
| Cloud radius | 2.5 units, inclusive centre-distance check |
| Grace | 1.5 seconds from actual cloud spawn, no damage |
| Damage | 8 every 1 second; first pulse at grace end, nine pulses maximum (72 raw damage) |
| Lifetime | 10 seconds total from actual spawn; expiry is exclusive |

Purple player ring and overhead beacon identify the marked player. A banner names them (YOU for self), counts down in tenths and explains moving away and leaving the cloud. The cloud has an explicit radius outline and low mist, purple while forming and green when damaging; it differs from the red slam warnings. Grace permits ordinary walking beyond its 2.5-unit radius, including under Bulwark's half-speed movement at the normal simulation rate. Dash is optional. Marks remain on invisible players so Vanish cannot silently invalidate a visible warning.

Both Node and Durable Object hosts execute the same shared simulation; clients render snapshots and never submit poison damage. Existing guard, Bulwark, shields and boss-armour reduction apply. Late joins/reconnects receive target IDs and absolute mark/spawn/active/expiry/tick times and fixed cloud positions. Optional snapshot fields remain compatible with older fixtures/clients.

Servers resolve deadlines on their first simulation tick at or after the exact deadline (normally 50 ms ticks), never early. A paused host cannot execute in real time: after a stall, use the player's position at that resolving tick and preserve a full 1.5-second grace and 10-second lifetime from actual spawn. Missed damage pulses are skipped, never stacked against a player's current position. Expired clouds do no delayed damage. This explicitly favours escape time over catch-up damage.

A dead/disconnected marked player cancels that mark, without selecting a surprise replacement. Existing ground clouds remain dangerous when their marked player leaves/dies while others still fight. Wipe, victory, return to hub, retry and empty-room leave clear all poison state. Each retry starts a fresh six-second first-mark timer. Other bosses cannot run this mechanic. **There is currently no Hard Truffle Man:** no hard variant is introduced and no existing hard boss inherits poison; a future Truffle hard mode needs an explicit design decision.

## Validation

Automated checks verify timing, tracking, bounds, periodic/all-player damage, mitigation, expiry, serialized state and cleanup; browser fixtures verify visuals separately from real live-room coverage. These checks do not establish final human solo/four-player encounter balance.

- `npm test`: 117 tests passed.
- `npm run build`: TypeScript and production Vite build passed; the existing large-chunk warning remains.
- `npm run smoke`: all combat, mixed-class, Hard Warden, scatter, vote/totem, room and new poison checks passed. Final Node poison smoke compared 554 matching snapshots from three clients, including a late arrival.
- Local `wrangler dev --local --port 18793`: built Worker and GLB HTTP 200; the same poison smoke passed with 553 matching snapshots. Wrangler logged `Network connection lost` when smoke clients closed; all assertions and the subsequent built-Worker browser test passed.
- Built-Worker browser: live poison countdown, unmarked-client reconnect, shared cloud and hub cleanup passed against the local Durable Object host.
- Browser suite: `TEST_WS_PORT=18791 npm run test:browser -- --timeout 180000` passed all 15 tests in the final full run (4.1 minutes). An initial run hit existing hub disconnect/Labs asset-load timing failures (both passed unchanged on rerun); the initial new poison test missed its short live window while loading another scene and was replaced with an already-loaded client reconnect, with late arrival covered by the wire smoke. A Windows text-encoding issue in new UI/test strings was fixed and UTF-8 was checked before the final run.
- Screenshots are emitted under ignored `test-results/`: `smash-0/1150/1600/1900/2250.png`, `poison-mark/grace/active.png` and `live-active-cloud.png`. Rig assertions cover both hands above their own shoulders, same-side windup, forward impact at four headings, grounded feet and recovery to idle. Existing walking/stance and actual encounter/summon tests remain required.

No tag, GitHub release, main push or production deployment is included. Human encounter-balance playtesting remains outstanding.
