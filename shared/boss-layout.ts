import type {BossId,Vec2} from './protocol';
export type Difficulty='Normal'|'Hard';
export const BOSS_CIRCLES=[
 {difficulty:'Normal' as const,center:{x:-4.7,z:-6.5},radius:1.9,bosses:[['warden','Warden'],['yellowBall','Yellow Ball'],['greenCone','Truffle Man']] as const},
 {difficulty:'Hard' as const,center:{x:4.7,z:-6.5},radius:1.9,bosses:[['hardWarden','Hard Warden'],['hardYellowBall','Hard Yellow Ball']] as const},
];
export const BOSS_PEDESTALS=BOSS_CIRCLES.flatMap(circle=>circle.bosses.map(([id,name],i)=>({
 id:id as BossId,name,difficulty:circle.difficulty,
 pos:{x:circle.center.x+Math.cos(i/circle.bosses.length*Math.PI*2)*circle.radius,z:circle.center.z+Math.sin(i/circle.bosses.length*Math.PI*2)*circle.radius},
})));
// Low floor markers are traversable; the small interaction areas never overlap.
export const BOSS_INTERACTION_RADIUS=1.1;
export function nearbyBoss(pos:Vec2){return BOSS_PEDESTALS.find(p=>Math.hypot(p.pos.x-pos.x,p.pos.z-pos.z)<=BOSS_INTERACTION_RADIUS);}
