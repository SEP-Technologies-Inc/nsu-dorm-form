import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './app/styles/global.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Не найден корневой элемент #app');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
