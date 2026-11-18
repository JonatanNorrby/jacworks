import type {Vec2} from './protocol';
/** A child bar cancels its character's yaw so it remains facing negative Z (south). */
export function southFacingBarYaw(facing:Vec2){
 return -Math.atan2(facing.x,facing.z);
}
