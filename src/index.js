import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'assets/scss/style.scss';
import { Portal } from 'layouts/Portal';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <Portal />
  </>
);
