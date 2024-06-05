import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import 'assets/scss/style.scss';
import { Portal } from 'layouts/Portal';
import { LoadingSuspense } from 'components/elements';
const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Suspense fallback={<LoadingSuspense />}>
      <App />
      <Portal />
    </Suspense>
  </>
);
