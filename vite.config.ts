import {defineConfig,loadEnv} from 'vite';
import {createReadStream,existsSync} from 'node:fs';
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'');
 return {root:'client',envDir:process.cwd(),server:{port:5173},build:{outDir:'../dist',emptyOutDir:true},plugins:[{
  name:'private-local-truffle',
  configureServer(server){server.middlewares.use('/__local-assets/truffle.glb',(req,res)=>{
   const path=env.TRUFFLE_LOCAL_GLB;
   if(!path||!existsSync(path)){res.statusCode=404;res.end();return;}
   res.setHeader('Content-Type','model/gltf-binary');res.setHeader('Cache-Control','no-store');
   const stream=createReadStream(path);stream.on('error',()=>{res.destroy();});stream.pipe(res);
  });}
 }]};
});
