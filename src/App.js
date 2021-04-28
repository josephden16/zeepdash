import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Index from './components/Index';
import Offers from './components/Offers';
import MyAccount from './components/MyAccount';
import List from './components/List';
import NotFound from './components/NotFound';
import Thanks from './components/Thanks';
import Login from './components/Login';
import Register from './components/Register';
import Invoice from './components/Invoice';
import Checkout from './components/Checkout';
import Detail from './components/Detail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-select2-wrapper/css/select2.css';
import './App.css';
import MyRestaurant from './components/MyRestaurant';


function App(props) {
  return (
    <>
      <Header />

      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/offers" exact component={Offers} />
        <Route path="/restaurants" exact component={List} />
        <Route path="/myaccount" component={MyAccount} />
        <Route path="/myrestaurant" component={MyRestaurant} />
        <Route path="/login" exact component={Login} />
        <Route path="/register/" exact component={Register} />
        <Route path="/invoice" exact component={Invoice} />
        <Route path="/checkout/:restaurantId" exact component={Checkout} />
        <Route path="/thanks" exact component={Thanks} />
        <Route path="/restaurant/:slug" exact component={Detail} />
        {/* <Route path="/track-order" exact component={TrackOrder} /> */}
        {/* <Route path="/extra" exact component={Extra} /> */}
        <Route exact component={NotFound} />
      </Switch>
      {
        (props.location.pathname !== '/login' && props.location.pathname !== '/register') ? <Footer /> : ''
      }
      <ToastContainer style={{ fontSize: '15px', color: 'white', fontFamily: 'Verdana' }} />
    </>
  );
}

export default App;
