import {Mesh,MeshBuilder,StandardMaterial,Color3,type Scene} from '@babylonjs/core';

// Original Truffle placeholder: a cream capsule stem and flattened brown cap.
// Grounded at y=0; callers can scale this procedural mesh without loading a GLB.
export function createMushroom(scene:Scene,name:string,height=1.91){
 const root=new Mesh(name,scene);
 const stem=MeshBuilder.CreateCapsule(name+'-stem',{height:1.35,radius:.35},scene);stem.parent=root;stem.position.y=.7;
 const cap=MeshBuilder.CreateSphere(name+'-cap',{diameter:1.6,segments:16},scene);cap.parent=root;cap.position.y=1.55;cap.scaling.y=.45;
 // Share materials so repeated summons do not accumulate material instances.
 let brown=scene.getMaterialByName('truffle-placeholder-brown');
 if(!brown){const material=new StandardMaterial('truffle-placeholder-brown',scene);material.diffuseColor=new Color3(.48,.22,.08);brown=material;}
 let cream=scene.getMaterialByName('truffle-placeholder-cream');
 if(!cream){const material=new StandardMaterial('truffle-placeholder-cream',scene);material.diffuseColor=new Color3(.85,.72,.44);cream=material;}
 cap.material=brown;stem.material=cream;
 root.scaling.setAll(height/1.91);
 return root;
}
