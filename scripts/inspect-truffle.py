# Blender --background --python scripts/inspect-truffle.py -- <Shroom.fbx>
# Read-only diagnosis; no asset is saved or exported.
import bpy, sys, json
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=sys.argv[sys.argv.index('--')+1])
rig=next(o for o in bpy.data.objects if o.type=='ARMATURE')
report={'bones':len(rig.data.bones),'clips':[]}
for action in bpy.data.actions:
 rig.animation_data.action=action
 start,end=map(int,action.frame_range)
 names=['IKLeg.L','IKLeg.R','Foot.L','Foot.R','Leg1.L','Leg2.L','Leg1.R','Leg2.R','Sprine01']
 samples={n:[] for n in names}
 for frame in range(start,end+1):
  bpy.context.scene.frame_set(frame)
  for n in names:samples[n].append(list(rig.pose.bones[n].matrix.translation))
 report['clips'].append({'name':action.name,'frames':[start,end],'bone_translation_range':{n:[max(v[i] for v in values)-min(v[i] for v in values) for i in range(3)] for n,values in samples.items()}})
print('TRUFFLE_MOTION '+json.dumps(report))
