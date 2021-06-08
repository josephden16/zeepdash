import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getDoc, doc } from '@firebase/firestore';
import { toast } from 'react-toastify';
import { Row, Col, Tab, Image, Badge, } from 'react-bootstrap';
import { FiCheckCircle } from 'react-icons/fi';
import { HiClock, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { CgArrowLongRight } from 'react-icons/cg';
import CheckoutItem from '../common/CheckoutItem';
import { UserContext } from '../providers/AuthProvider';
import { CartContext } from '../providers/CartProvider';
import QuickBite from '../common/QuickBite';
import { firestore } from '../../firebase';
import { capitalize, isRestaurantOpen, MAX, MIN, updateCartSession, updateFirestoreCart, getTotalAmount } from '../../utils';


export const MealsContainer = ({ restaurantOffers, restaurant }) => {
  if (!restaurantOffers) return null;

  return (
    <Row>
      <h2 className="mb-4 mt-3 col-md-12">Our meals 🍽️</h2>
      {restaurantOffers && restaurantOffers.map(offer => (
        <Meal key={offer.id} offer={offer} restaurant={restaurant} />
      ))}
    </Row>
  )
}

export const RestaurantOpenStatus = ({ openingTime, closingTime }) => {
  const restaurantOpen = isRestaurantOpen(openingTime, closingTime);
  if (restaurantOpen) {
    return (
      <Badge variant="success" className="p-1 ml-1">OPEN</Badge>
    )
  }
  return (
    <Badge variant="danger" className="p-1 ml-1">CLOSED</Badge>
  )
}

export const Meal = ({ offer, restaurant }) => {
  const { cart } = useContext(CartContext);
  const mealId = offer.id;
  let quantity = 0;

  let currentCart = cart;
  if (currentCart) {
    const meal = currentCart.find(meal => meal.id === mealId);
    if (meal && meal.quantity > 0) {
      quantity = meal.quantity
    }
  }

  return (
    <Col sm={12} lg={8} className="mb-4">
      <QuickBite
        id={offer.id}
        itemClass="menu-list"
        image={offer.imageURL}
        title={offer.name}
        price={offer.price}
        priceUnit='&#8358;'
        closingTime={restaurant.closingTime}
        openingTime={restaurant.openingTime}
        restaurantId={restaurant.id}
        qty={quantity || null}
      />
    </Col>
  )
}

export const RestaurantInfoTab = ({ restaurant }) => {
  return (
    <Tab.Pane eventKey="third">
      <div id="restaurant-info" className="bg-white rounded shadow-sm p-4 mb-4">
        <div className="address-map float-right ml-5">
          <div className="mapouter">
            {/* <div className="gmap_canvas">
							<iframe title='addressMap' width="300" height="170" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=9&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
						</div> */}
          </div>
        </div>
        <h5 className="mb-4">Restaurant Info</h5>
        <p className="mb-2 text-black"><HiLocationMarker className="text-red mr-2" />{restaurant.address}</p>
        <p className="mb-2 text-black"><HiPhone className="text-red mr-2" />{restaurant.phone}</p>
        <p className="mb-2 text-black"><HiMail className="email text-red text-primary mr-2" />{restaurant.email}</p>
        <p className="mb-2 text-black"><HiClock className="clock-time text-red text-primary mr-2" /> <span className="mr-1">Today {restaurant.openingTime} - {restaurant.closingTime}</span>   <RestaurantOpenStatus openingTime={restaurant.openingTime} closingTime={restaurant.closingTime} /></p>
        {/* <hr className="clearfix" />
				<p className="text-black mb-0">You can also check the 3D view by using our menue map clicking here &nbsp;&nbsp;&nbsp; <Link className="text-info font-weight-bold" to="#">Venue Map</Link></p>
				<hr className="clearfix" /> */}
        <h5 className="mt-4 mb-4">More Info</h5>
        {/* TODO: add food offered by the restaurants here	 */}
        {/* <p className="mb-3">Dal Makhani, Panneer Butter Masala, Kadhai Paneer, Raita, Veg Thali, Laccha Paratha, Butter Naan</p> */}
        <div className="border-btn-main mb-4">
          {
            restaurant.cuisines && restaurant.cuisines.map((cuisine, index) => <CuisineOffered key={index} cuisine={cuisine} />)
          }
        </div>
      </div>
    </Tab.Pane>
  )
}

export const Cart = ({ restaurant }) => {
  const { cart, updateCart } = useContext(CartContext);
  const user = useContext(UserContext);
  const restaurantId = restaurant.id;
  let total = cart ? getTotalAmount(cart) : 0;
  const history = useHistory();
  let sortedCart = cart.sort((a, b) => a.name.localeCompare(b.name)); // sort the cart alphabetically
  
  useEffect(() => {
    const fetchCart = async () => {
      // remove any previous cart data stored in react context
      updateCart([]);
      // checks if the cart exists in the session
      let sessionCart = JSON.parse(sessionStorage.getItem(restaurantId));
      if (!user) {
        if (sessionCart) {
          updateCart(sessionCart);
        }
      } else {
        try {
          // pull the cart data from firestore
          const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
          const userRef = doc(firestore, collectionName, user.id);
          const cartRef = doc(userRef, "Cart", restaurantId);
          const snapshot = await getDoc(cartRef);

          if (snapshot.exists) {
            const data = snapshot.data();
            if (data) {
              let { cart } = data;
              updateCart(cart);
              updateCartSession(restaurantId, cart);
            }
          }
        } catch { }
      }
    }

    fetchCart();
    //ensure this useEffect hook runs on the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const handleCheckout = () => {
    if (!user) {
      toast.error("You must be signed in to checkout");
      history.replace(`/login?next=${window.location.pathname}`);
    } else {
      // send cart data to firestore
      try {
        updateFirestoreCart(cart, user, restaurantId);
        history.push(`/checkout/${restaurantId}`);
      } catch (error) {
        toast.error("Checkout failed");
      }
    }
  }

  return (
    <Col md={4}>
      <div className="generator-bg rounded shadow-sm mb-4 p-4 osahan-cart-item">

        <div>
          {
            (!cart || cart.length < 1) &&
            <div className="mt-2" style={{ display: 'flex', flexFlow: 'column nowrap' }}>
              <Image draggable={false} src="/img/empty-cart.svg" alt="empty-cart" fluid style={{ width: '20%', margin: 'auto' }} />
              <p style={{ fontSize: '15px' }} className="text-center text-white mt-2">Your cart is empty. Add meals to your cart.</p>
            </div>
          }
          {(cart && cart.length > 0) &&
            <div>
              <h5 className="mb-2 text-white">Your Order</h5>
              <p className="mb-4 text-white">{cart.length} Items</p>
              <div className="bg-white rounded shadow-sm mb-2">
                {sortedCart.map((meal) => <OrderItem restaurantId={restaurantId} key={meal.name} meal={meal} />)}
              </div>
              <div className="mb-2 bg-white rounded p-2 clearfix">
                <Image fluid className="float-left" src="/img/wallet-icon.png" />
                <h6 className="font-weight-bold text-right mb-2">Subtotal : <span className="text-danger">&#8358;{total}</span></h6>
                <p className="seven-color mb-1 text-right">Extra charges may apply</p>
              </div>
            </div>}
          {
            (cart && cart.length > 0) &&
            <button onClick={handleCheckout} className="btn btn-success btn-block btn-lg">
              Checkout <CgArrowLongRight />
            </button>
          }
          <div className="pt-2"></div>
        </div>
      </div>
    </Col>
  )
}

export const OrderItem = ({ meal, restaurantId }) => {
  const { cart } = useContext(CartContext);

  let quantity = null;
  let currentCart = cart;
  if (currentCart) {
    const currentMeal = currentCart.find(item => item.id === meal.id);
    if (currentMeal.quantity > 0) {
      quantity = currentMeal.quantity;
    }
  }

  return (
    <CheckoutItem
      itemName={meal.name}
      price={meal.price}
      priceUnit="&#8358;"
      id={meal.id}
      restaurantId={restaurantId}
      qty={quantity}
      show={true}
      minValue={MIN}
      maxValue={MAX}
    />
  )
}

export const CuisineOffered = ({ cuisine }) => (
  <span className="border-btn bg-white text-success mr-2" ><FiCheckCircle />{" "}{capitalize(cuisine)}</span>
)
