import React from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-select2-wrapper/css/select2.css';
import './App.css';
import Routes from './Routes';



function App() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      {
        location.pathname !== '/add-location' && <Header />
      }
      <Routes />
      {
        (location.pathname !== '/login' && location.pathname !== '/login/reset-password' && location.pathname !== '/register' && location.pathname !== '/add-location') ? <Footer /> : ''
      }
      <ToastContainer style={{ fontSize: '15px', color: 'white', fontFamily: 'Verdana' }} />
    </>
  );
}

export default Sentry.withProfiler(App);
