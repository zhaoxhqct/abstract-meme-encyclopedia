import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('未找到 #root 挂载点');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    {/* basename 跟随 Vite 的 base，部署到子路径时路由才不会错位 */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
