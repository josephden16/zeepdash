import React, { useState, useContext } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { IoFastFoodSharp } from 'react-icons/io5';
import { RiFileList3Fill, RiEdit2Fill, RiRestaurantFill } from 'react-icons/ri';
import { Row, Col, Container, Image } from 'react-bootstrap';
import Meals from './myrestaurant/Meals';
import Orders from './myrestaurant/Orders';
import Details from './myrestaurant/Details';
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
      <div>
        <Image style={{height: '230px', objectFit: 'fill', width: '100%'}} fluid src={user.backgroundImageURL || '/img/mall-dedicated-banner.png'} />
      </div>
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
                        <p className="mb-0 text-black font-weight-bold"><Link to='#' onClick={() => setShowEditProfile(true)} className="text-primary mr-3"><RiEdit2Fill /> EDIT</Link></p>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="nav flex-column border-0 pt-4 pl-4 pb-4">
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" exact to="/myrestaurant/meals">
                      <IoFastFoodSharp style={{ fontSize: '23px' }} className="mr-2" /> <span>Meals</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" exact to="/myrestaurant/orders">
                      <RiFileList3Fill style={{ fontSize: '23px' }} className="mr-2" /><span>Orders</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" exact to="/myrestaurant/details">
                      <RiRestaurantFill style={{ fontSize: '23px' }} className="mr-2" /><span>My Restaurant</span>
                    </NavLink>
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
                <Route path="/myrestaurant/details" exact component={Details} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}


export default MyRestaurant;
