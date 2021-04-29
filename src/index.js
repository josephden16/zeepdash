import React, { Suspense } from 'react';
import { render } from 'react-snapshot';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import UserProvider from './components/providers/AuthProvider'
import ScrollToTop from './components/ScrollToTop';
import * as serviceWorker from './serviceWorker';
import './index.css';

render(
  <Router>
    <Suspense fallback={<div>loading...</div>}>
      <ScrollToTop />
      <UserProvider>
        <Route path="/" component={App} />
      </UserProvider>
    </Suspense>
  </Router>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
