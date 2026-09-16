import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 的项目站点跑在 /<仓库名>/ 下，本地开发仍用根路径。
// 部署工作流会注入 BASE_PATH=/abstract-meme-encyclopedia/
const base = process.env.BASE_PATH ?? '/';

// Vite 配置：启用 React 插件，并把 @ 指向 src 目录
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
