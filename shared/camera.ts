export const CAMERA_KEY='jacworks-camera-v1';
export type CameraPreferences={followPlayer:boolean;zoom:number};
export const DEFAULT_CAMERA:CameraPreferences={followPlayer:true,zoom:31};
export function readCamera(raw:string|null):CameraPreferences {
 try{const v=JSON.parse(raw??'null');return {followPlayer:typeof v?.followPlayer==='boolean'?v.followPlayer:DEFAULT_CAMERA.followPlayer,zoom:typeof v?.zoom==='number'&&Number.isFinite(v.zoom)?Math.max(29,Math.min(40,v.zoom)):DEFAULT_CAMERA.zoom}}catch{return {...DEFAULT_CAMERA}}
}
export function loadCamera(storage:Pick<Storage,'getItem'>){try{return readCamera(storage.getItem(CAMERA_KEY))}catch{return {...DEFAULT_CAMERA}}}
export function saveCamera(storage:Pick<Storage,'setItem'>,value:CameraPreferences){try{storage.setItem(CAMERA_KEY,JSON.stringify(value))}catch{}}
// Bounded, gentle tracking keeps the arena near the center; exponential smoothing is frame-rate independent.
export function cameraTarget(current:{x:number;z:number},player:{x:number;z:number}|undefined,follow:boolean,dt:number){
 const alpha=1-Math.exp(-Math.max(0,dt)*2),target=follow&&player?{x:Math.max(-2,Math.min(2,player.x*.2)),z:Math.max(-2,Math.min(2,player.z*.2))}:{x:0,z:0};
 return {x:current.x+(target.x-current.x)*alpha,z:current.z+(target.z-current.z)*alpha};
}
