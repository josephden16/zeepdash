import React from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-select2-wrapper/css/select2.css';
import './App.css';
import Router from './Router';


function App(props) {
  return (
    <>
      <Header />
      <Router />
      {
        (props.location.pathname !== '/login' && props.location.pathname !== '/login/reset-password' && props.location.pathname !== '/register') ? <Footer /> : ''
      }
      <ToastContainer style={{ fontSize: '15px', color: 'white', fontFamily: 'Verdana' }} />
    </>
  );
}

export default App;
