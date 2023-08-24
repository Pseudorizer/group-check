import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MouseDownProvider } from './context/MouseDownContext.tsx';
import dayjs from 'dayjs';

const now = dayjs();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MouseDownProvider>
      <App
        timeRange={{ start: 6, end: 19, step: 60 }}
        days={[
          now.toDate(),
          now.add(1, 'd').toDate(),
          now.add(2, 'd').toDate(),
          now.add(3, 'd').toDate(),
          now.add(4, 'd').toDate(),
          now.add(5, 'd').toDate(),
          now.add(6, 'd').toDate(),
        ]}
      />
    </MouseDownProvider>
  </React.StrictMode>,
);
