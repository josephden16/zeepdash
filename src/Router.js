import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom';
const MyRestaurant = lazy(() => import('./components/MyRestaurant'));
const Index = lazy(() => import('./components/Index'));
const Offers = lazy(() => import('./components/Offers'));
const MyAccount = lazy(() => import('./components/MyAccount'));
const List = lazy(() => import('./components/List'));
const NotFound = lazy(() => import('./components/NotFound'));
const Thanks = lazy(() => import('./components/Thanks'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Invoice = lazy(() => import('./components/Invoice'));
const Checkout = lazy(() => import('./components/Checkout'));
const Detail = lazy(() => import('./components/Detail'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));


const Router = () => {
  return (
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/offers" exact component={Offers} />
      <Route path="/restaurants" exact component={List} />
      <Route path="/myaccount" component={MyAccount} />
      <Route path="/myrestaurant" component={MyRestaurant} />
      <Route path="/login" exact component={Login} />
      <Route path="/register/" exact component={Register} />
      <Route path="/login/reset-password" exact component={ResetPassword} />
      <Route path="/invoice" exact component={Invoice} />
      <Route path="/checkout/:restaurantId" exact component={Checkout} />
      <Route path="/thanks" exact component={Thanks} />
      <Route path="/restaurant/:slug" exact component={Detail} />
      {/* <Route path="/track-order" exact component={TrackOrder} /> */}
      {/* <Route path="/extra" exact component={Extra} /> */}
      <Route exact component={NotFound} />
    </Switch>
  )
}

export default Router;