import {defineConfig} from 'vite';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const version=JSON.parse(readFileSync(new URL('./package.json',import.meta.url),'utf8')).version;
let commit=(process.env.CF_PAGES_COMMIT_SHA||process.env.GITHUB_SHA||'').slice(0,8);
if(!commit){try{commit=execFileSync('git',['rev-parse','--short=8','HEAD'],{encoding:'utf8'}).trim()}catch{commit='unknown'}}
export default defineConfig({root:'client',envDir:process.cwd(),define:{__GAME_VERSION__:JSON.stringify(version+'+'+commit)},server:{port:5173},build:{outDir:'../dist',emptyOutDir:true}});
