import type {BossId,Vec2} from './protocol';
export type Difficulty='Normal'|'Hard'|'Double'|'Nest'|'Chaos';
export const BOSS_CIRCLES=[
 {difficulty:'Normal' as const,center:{x:-4.7,z:-6.5},radius:1.65,bosses:[['warden','Warden'],['yellowBall','Yellow Ball'],['greenCone','Truffle Man'],['fracturer','The Fracturer']] as const},
 {difficulty:'Hard' as const,center:{x:3.1,z:-6.5},radius:1.9,bosses:[['hardWarden','Hard Warden'],['hardYellowBall','Hard Yellow Ball'],['hardGreenCone','Hard Truffle Man']] as const},
 {difficulty:'Nest' as const,center:{x:-10,z:-6.5},radius:.1,bosses:[['antQueen','Ant Queen']] as const},
 {difficulty:'Chaos' as const,center:{x:0,z:8},radius:.1,bosses:[['chaosArena','Chaos Arena · All Bosses']] as const},
 {difficulty:'Double' as const,center:{x:8.9,z:-6.5},radius:1.3,bosses:[['duoYellowWarden','Yellow Ball + Warden'],['duoTruffleFracturer','Truffle Man + Fracturer']] as const},
];
export const BOSS_PEDESTALS=BOSS_CIRCLES.flatMap(circle=>circle.bosses.map(([id,name],i)=>({
 id:id as BossId,name,difficulty:circle.difficulty,
 pos:{x:circle.center.x+Math.cos(i/circle.bosses.length*Math.PI*2)*circle.radius,z:circle.center.z+Math.sin(i/circle.bosses.length*Math.PI*2)*circle.radius},
})));
// Low floor markers are traversable; the small interaction areas never overlap.
export const BOSS_INTERACTION_RADIUS=1.1;
export function nearbyBoss(pos:Vec2){return BOSS_PEDESTALS.find(p=>Math.hypot(p.pos.x-pos.x,p.pos.z-pos.z)<=BOSS_INTERACTION_RADIUS);}

export const DOUBLE_ENCOUNTERS=[['duoYellowWarden','Yellow Ball + Warden'],['duoTruffleFracturer','Truffle Man + Fracturer']] as const;
