import {defineConfig} from '@playwright/test';
const serverPort=process.env.TEST_WS_PORT??'8787';
export default defineConfig({testDir:'./tests',workers:1,timeout:60000,use:{baseURL:process.env.BROWSER_URL??'http://localhost:5173',launchOptions:{args:['--use-angle=swiftshader']}},webServer:process.env.BROWSER_URL?undefined:[{command:'npm run dev:client',env:{VITE_WS_PORT:serverPort},url:'http://localhost:5173',reuseExistingServer:false},{command:'npm run start',env:{PORT:serverPort},port:Number(serverPort),reuseExistingServer:false}]});
