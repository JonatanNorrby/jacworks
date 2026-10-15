import bpy,json,sys
# Run with Blender --background --python scripts/convert-truffle.py -- <extracted-folder>
from pathlib import Path
base=Path(sys.argv[sys.argv.index('--')+1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(base/'source/Shroom.fbx'))
report={'meshes':[],'armatures':[],'actions':[],'materials':[], 'custom_properties':{o.name:{k:str(o[k]) for k in o.keys()} for o in bpy.data.objects if o.keys()}}
for o in bpy.data.objects:
 if o.type=='MESH': report['meshes'].append({'name':o.name,'vertices':len(o.data.vertices),'triangles':sum(len(p.vertices)-2 for p in o.data.polygons),'dimensions':list(o.dimensions),'vertex_groups':len(o.vertex_groups)})
 if o.type=='ARMATURE': report['armatures'].append({'name':o.name,'bones':len(o.data.bones)})
for a in bpy.data.actions: report['actions'].append({'name':a.name,'frames':list(a.frame_range)})
for m in bpy.data.materials:
 report['materials'].append(m.name)
 m.use_nodes=True
 nodes=m.node_tree.nodes;nodes.clear();out=nodes.new('ShaderNodeOutputMaterial');bs=nodes.new('ShaderNodeBsdfPrincipled');m.node_tree.links.new(bs.outputs['BSDF'],out.inputs['Surface'])
 key='MatMushroomBody' if 'Body' in m.name else 'MatMushroom'
 for suffix,socket in [('BaseColor','Base Color'),('Roughness','Roughness'),('Metallic','Metallic'),('Normal','Normal')]:
  paths=list((base/'textures').glob('*_'+key+'_'+suffix+'.png'))
  if not paths: continue
  img=bpy.data.images.load(str(paths[0]),check_existing=True)
  report.setdefault('textures',[]).append({'name':img.name,'source_size':list(img.size)})
  if max(img.size)>1024: img.scale(1024,1024)
  if suffix!='BaseColor':img.colorspace_settings.name='Non-Color'
  tex=nodes.new('ShaderNodeTexImage');tex.image=img
  if suffix=='Normal':
   normal=nodes.new('ShaderNodeNormalMap');m.node_tree.links.new(tex.outputs['Color'],normal.inputs['Color']);m.node_tree.links.new(normal.outputs['Normal'],bs.inputs[socket])
  else:m.node_tree.links.new(tex.outputs['Color'],bs.inputs[socket])
  img.pack()
(base/'inspection.json').write_text(json.dumps(report,indent=2))
bpy.ops.export_scene.gltf(filepath=str(base/'truffle.glb'),export_format='GLB',export_image_format='JPEG',export_jpeg_quality=85,export_animations=True)
print('TRUFFLE_INSPECTION '+json.dumps(report))
