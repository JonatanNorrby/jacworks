import {Color3,Mesh,MeshBuilder,Scene,StandardMaterial,Vector3} from '@babylonjs/core';

/** Original procedural geometry: no additional third-party asset dependency. */
function caveMaterial(scene:Scene,name:string,diffuse:Color3,emissive=new Color3(0,0,0)){
 const m=new StandardMaterial(name,scene);m.diffuseColor=diffuse;m.emissiveColor=emissive;
 m.specularColor=new Color3(.07,.05,.025);return m;
}
export function buildAntCave(scene:Scene){
 const earth=caveMaterial(scene,'ant-earth',new Color3(.28,.175,.092));
 const darkStone=caveMaterial(scene,'ant-stone',new Color3(.14,.082,.05));
 const resin=caveMaterial(scene,'ant-resin',new Color3(.34,.21,.105),new Color3(.08,.04,.015));
 const queenChitin=caveMaterial(scene,'ant-queen-chitin',new Color3(.27,.065,.05),new Color3(.12,.025,.018));
 const workerChitin=caveMaterial(scene,'ant-worker-chitin',new Color3(.23,.12,.065));
 const soldierChitin=caveMaterial(scene,'ant-royal-chitin',new Color3(.48,.24,.07),new Color3(.10,.055,.015));
 const eye=caveMaterial(scene,'ant-eye',new Color3(1,.3,.07),new Color3(.62,.12,.005));
 const floor=caveMaterial(scene,'ant-cave-floor',new Color3(.18,.105,.06));
 const props:Mesh[]=[];
 for(let i=0;i<24;i++){
  const angle=i/24*Math.PI*2,rad=15.1+(i%4)*.24;
  const rock=MeshBuilder.CreateSphere('cave-wall-'+i,{diameter:2.3+(i%4)*.6,segments:8},scene);
  rock.scaling.set(1.1+(i%3)*.13,.9+(i%5)*.18,1.1+(i%4)*.09);
  rock.position.set(Math.cos(angle)*rad,.38+(i%4)*.23,Math.sin(angle)*rad);
  rock.material=i%3===0?earth:darkStone;rock.isPickable=false;rock.setEnabled(false);props.push(rock);
 }
 for(let i=0;i<13;i++){
  const angle=i/13*Math.PI*2;
  const stalagmite=MeshBuilder.CreateCylinder('cave-stalagmite-'+i,{diameterTop:0,diameterBottom:.5+i%3*.18,height:1.2+i%4*.48,tessellation:6},scene);
  const rr=12.5+(i%2)*1;
  stalagmite.position.set(Math.cos(angle)*rr,(1.2+i%4*.48)/2,Math.sin(angle)*rr);
  stalagmite.material=i%2?darkStone:resin;stalagmite.isPickable=false;stalagmite.setEnabled(false);props.push(stalagmite);
 }
 for(const [i,x,z] of [[0,-13,3],[1,13,3],[2,-12.7,-5.5],[3,12.7,-5.5]]){
  const opening=MeshBuilder.CreateTorus('ant-tunnel-mouth-'+i,{diameter:3,thickness:.4,tessellation:24},scene);
  opening.position.set(x,1.3,z);opening.rotation.x=Math.PI/2;opening.material=darkStone;opening.isPickable=false;opening.setEnabled(false);props.push(opening);
  const mouth=MeshBuilder.CreateSphere('ant-tunnel-shadow-'+i,{diameter:2.4,segments:12},scene);
  mouth.scaling.set(.3,1.1,.2);mouth.position.set(x,1.2,z);mouth.material=resin;mouth.isPickable=false;mouth.setEnabled(false);props.push(mouth);
 }
 for(let i=0;i<8;i++){
  const nest=MeshBuilder.CreateSphere('ant-nest-mound-'+i,{diameter:1.7,segments:9},scene);
  nest.scaling.set(1.3,.3,.9);nest.position.set((i%4-1.5)*4,.18,9.3+(i%2)*1.4);nest.material=earth;
  nest.isPickable=false;nest.setEnabled(false);props.push(nest);
 }
 function antModel(name:string,royal=false,queen=false):Mesh{
  const mat=queen?queenChitin:royal?soldierChitin:workerChitin;
  const scale=queen?2.2:royal?1.4:.8;
  const abdomen=MeshBuilder.CreateSphere(name,{diameter:1.15,segments:12},scene);
  abdomen.scaling.set(1.25,.83,1.3);abdomen.material=mat;
  const thorax=MeshBuilder.CreateSphere(name+'-thorax',{diameter:.6,segments:10},scene);
  thorax.parent=abdomen;thorax.position.set(0,0,-.72);thorax.material=mat;
  const head=MeshBuilder.CreateSphere(name+'-head',{diameter:.8,segments:12},scene);
  head.parent=abdomen;head.position.set(0,.04,-1.2);head.material=mat;
  for(const side of [-1,1]){
   const mandible=MeshBuilder.CreateCylinder(name+'-mandible',{diameterTop:0,diameterBottom:.18,height:.63,tessellation:8},scene);
   mandible.parent=abdomen;mandible.rotation.x=-Math.PI/2;mandible.rotation.z=side*.42;
   mandible.position.set(side*.23,-.19,-1.75);mandible.material=mat;
   const eyeball=MeshBuilder.CreateSphere(name+'-eye',{diameter:.18,segments:10},scene);
   eyeball.parent=abdomen;eyeball.position.set(side*.37,.25,-1.48);eyeball.material=eye;
   for(let i=0;i<3;i++){
    const zz=.28-i*.48;
    const path=[new Vector3(side*.27,-.03,zz),new Vector3(side*(.75+i*.08),-.12,zz-.18),new Vector3(side*(1.16+i*.10),-.55,zz-.38)];
    const leg=MeshBuilder.CreateTube(name+'-leg',{path,radius:.055,tessellation:6},scene);
    leg.parent=abdomen;leg.material=mat;
   }
  }
  if(queen){
   for(let i=0;i<4;i++){
    const crest=MeshBuilder.CreateCylinder(name+'-crest',{diameterTop:0,diameterBottom:.2,height:.8,tessellation:6},scene);
    crest.parent=abdomen;crest.position.set((i-1.5)*.32,.56,-.92);crest.rotation.z=(i-1.5)*.12;crest.material=soldierChitin;
   }
  }
  abdomen.scaling.scaleInPlace(scale);
  abdomen.isPickable=false;
  return abdomen;
 }
 const queen=antModel('ant-queen',false,true);
 queen.position.set(0,1.52,10.5);queen.setEnabled(false);
 return {props,queen,floor,earth,createWorker:()=>antModel('worker-ant',false),createRoyal:()=>antModel('royal-guard-ant',true),createQueen:()=>antModel('chaos-queen',false,true)};
}
