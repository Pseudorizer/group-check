import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MouseDownProvider } from './context/MouseDownContext.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MouseDownProvider>
      <App timeRange={{ start: 6, end: 19, step: 60 }} />
    </MouseDownProvider>
  </React.StrictMode>,
);
