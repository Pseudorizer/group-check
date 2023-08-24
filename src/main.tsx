import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MouseDownProvider } from '@/contexts/MouseDownContext.tsx';
import { ThemeProvider } from '@/contexts/ThemeContext.tsx';
import dayjs from 'dayjs';

const now = dayjs();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
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
          selections={[
            {
              id: 1,
              user: 'Emily',
              times: {
                '2023-7-24': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                '2023-7-25': [1, 7, 13, 14, 15],
              },
            },
            {
              id: 1,
              user: 'Char',
              times: {
                '2023-7-24': [6, 7, 13, 14, 15],
              },
            },
            {
              id: 1,
              user: 'Josh',
              times: {
                '2023-7-24': [12, 13, 14, 15],
              },
            },
          ]}
        />
      </MouseDownProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
