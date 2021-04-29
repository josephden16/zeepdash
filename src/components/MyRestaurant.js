import React, { useState, useContext } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Row, Col, Container, Image } from 'react-bootstrap';
import Meals from './myrestaurant/Meals';
import Orders from './myrestaurant/Orders';
import EditRestaurantProfileModal from './modals/EditRestaurantProfileModal';
import NotSignedIn from './NotSignedIn';
import { UserContext } from '../components/providers/AuthProvider';


const MyRestaurant = () => {

  const user = useContext(UserContext);

  const [showEditProfile, setShowEditProfile] = useState(false);

  const hideEditProfile = () => setShowEditProfile(false);

  if (!user || user.role === "customer") {
    return <NotSignedIn />
  }

  return (
    <>
      <EditRestaurantProfileModal defaultData={{ phone: user.phone }} restaurantId={user.id} slug={user.slug} show={showEditProfile} onHide={hideEditProfile} />
      <section className="section pt-4 pb-4 osahan-account-page">
        <Container>
          <Row>
            <Col md={3}>
              <div className="osahan-account-page-left shadow-sm bg-white h-100">
                <div className="border-bottom p-4">
                  <div className="osahan-user text-center">
                    <div className="osahan-user-media">
                      <Image style={{ borderRadius: '50%', width: '70px', height: '70px' }} className="mb-3 shadow-sm mt-1" src={user.photoURL || "/img/user/default-profile.webp"} draggable={false} alt={user.name} />
                      <div className="osahan-user-media-body">
                        <h6 className="mb-2">{user.name}</h6>
                        <p className="mb-1">{user.phone}</p>
                        <p>{user.email}</p>
                        <p className="mb-0 text-black font-weight-bold"><Link to='#' onClick={() => setShowEditProfile(true)} className="text-primary mr-3"><i className="icofont-ui-edit"></i> EDIT</Link></p>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="nav flex-column border-0 pt-4 pl-4 pb-4">
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" exact to="/myrestaurant/meals"><i className="icofont-fast-food"></i> Meals</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" exact to="/myrestaurant/orders"><i className="icofont-food-cart"></i> Orders</NavLink>
                  </li>
                  {/* <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" exact to="/myrestaurant/details"><i className="icofont-user-alt-7"></i> Account</NavLink>
                  </li> */}
                </ul>
              </div>
            </Col>
            <Col md={9}>
              <Switch>
                <Route path="/myrestaurant/meals" exact component={Meals} />
                <Route path="/myrestaurant/orders" exact component={Orders} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}


export default MyRestaurant;
