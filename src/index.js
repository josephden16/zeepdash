import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from './App';
import UserProvider from './components/providers/AuthProvider'
import CartProvider from './components/providers/CartProvider';
import * as serviceWorker from './serviceWorker';
import './index.css';
import ScreenLoader from './components/common/ScreenLoader';

Sentry.init({
  dsn: "https://d9c11e37b49d47fcb4b6c74a3deb06ed@o684222.ingest.sentry.io/5771452",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <Suspense fallback={<ScreenLoader />}>
    <UserProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </UserProvider>
  </Suspense>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
