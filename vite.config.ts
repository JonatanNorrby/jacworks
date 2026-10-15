import {defineConfig} from 'vite';
export default defineConfig({root:'client',envDir:process.cwd(),server:{port:5173},build:{outDir:'../dist',emptyOutDir:true}});
