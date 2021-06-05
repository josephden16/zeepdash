import React, { useContext } from 'react';
import { Image, Badge, Button, Media } from 'react-bootstrap';
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { BsCircleFill } from 'react-icons/bs';
import { UserContext } from '../providers/AuthProvider';
import { isRestaurantOpen, updateFirestoreCart, getItemQuantity } from '../../utils';
import { CartContext } from '../providers/CartProvider';


const QuickBite = (props) => {
  const { cart, updateCart } = useContext(CartContext);
  const mealId = props.id;
  const user = useContext(UserContext);
  const quantity = getItemQuantity(cart, mealId); // get the quantity from the Cart Context
  const max = props.maxValue || 15;
  const min = props.minValue || 0;
  const closingTime = props.closingTime;
  const openingTime = props.openingTime;
  const restaurantId = props.restaurantId;

  const incrementItem = () => {
    // ensure users can't place orders when restaurant's are closed
    const restaurantOpen = isRestaurantOpen(openingTime, closingTime);
    if (!restaurantOpen) {
      toast.info("You can't add meals to cart while a restaurant is closed");
      return;
    }

    if (quantity >= max) {

    } else {
      let item = { name: props.title, id: mealId, price: props.price, quantity: quantity + 1, };
      console.log(item);
      update(item);
    }
  }

  const decreaseItem = () => {
    if (quantity <= (min)) {

    } else {
      let item = { name: props.title, id: mealId, price: props.price, quantity: quantity - 1, };
      console.log(item);
      update(item);
    }
  }

  const update = (item) => {

    if (user && user.role === "business") {
      toast.info("Business accounts cannot make orders");
      return;
    }

    let currentCart = JSON.parse(sessionStorage.getItem(restaurantId));
    // checks if there is a cart in session
    if (currentCart) {
      // check if item already exists in cart
      const mealExist = currentCart.find(meal => meal.id === item.id);
      if (item.quantity > 0) {
        // what to do if the meal is in the cart
        if (mealExist) {
          currentCart = currentCart.filter(meal => meal.id !== item.id);
          currentCart = currentCart.concat(item);
          // update react state
          updateCart(currentCart);
          // update session storage
          sessionStorage.setItem(restaurantId, JSON.stringify(currentCart));
          // update firestore
          updateFirestoreCart(currentCart, user, restaurantId);
        } else {
          currentCart = currentCart.concat(item);
          // update react state
          updateCart(currentCart);
          // update session storage
          sessionStorage.setItem(restaurantId, JSON.stringify(currentCart));
          // update firestore
          updateFirestoreCart(currentCart, user, restaurantId);
          toast.success("Meal added to cart");
        }
      } else {
        // quantity now is set to 0 so the user wishes to remove the meal from his cart
        currentCart = currentCart.filter(meal => meal.id !== item.id);
        // update react state
        updateCart(currentCart);
        // update session storage
        sessionStorage.setItem(restaurantId, JSON.stringify(currentCart));
        // update firestore
        updateFirestoreCart(currentCart, user, restaurantId);
      }

    } else {
      let cart = [];
      cart = cart.concat(item);
      // update react state
      updateCart(cart);
      // update firestore 
      updateFirestoreCart(cart, user, restaurantId);
      // update session storage
      sessionStorage.setItem(restaurantId, JSON.stringify(cart));
      toast.success("Meal added to cart");
    }
  }

  return (
    <div className={"p-3 border-bottom bg-white " + props.itemClass}>
      {quantity === 0 ?
        <span className="float-right">
          <Button variant='outline-secondary' onClick={incrementItem} size="sm">ADD</Button>
        </span>
        :
        <span className="count-number float-right">
          <Button variant="outline-secondary" onClick={decreaseItem} className="btn-sm left dec"> <HiOutlineMinusSm /> </Button>
          <input className="count-number-input" type="text" value={quantity} readOnly />
          <Button variant="outline-secondary" onClick={incrementItem} className="btn-sm right inc"> <HiOutlinePlusSm /> </Button>
        </span>
      }
      <Media>
        {props.image ?
          <Image className={"mr-3 rounded-pill " + props.imageClass} src={props.image} alt={props.imageAlt} />
          :
          <div className="mr-3"><BsCircleFill className={"text-" + props.badgeVariant + " food-item"} /></div>
        }
        <Media.Body>
          <h6 className="mb-1"><span style={{fontSize: '14px'}}>{props.title}</span> {props.showBadge ? <Badge variant={props.badgeVariant}>{props.badgeText}</Badge> : ""}</h6>
          <p className="text-gray mb-0">{props.priceUnit}{props.price}</p>
        </Media.Body>
      </Media>
    </div>
  );
}

QuickBite.propTypes = {
  itemClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  image: PropTypes.string,
  imageClass: PropTypes.string,
  showBadge: PropTypes.bool,
  badgeVariant: PropTypes.string,
  badgeText: PropTypes.string,
  price: PropTypes.number.isRequired,
  priceUnit: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  qty: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
};
QuickBite.defaultProps = {
  itemClass: 'gold-members',
  imageAlt: '',
  imageClass: '',
  showBadge: false,
  price: '',
  priceUnit: '$',
  showPromoted: false,
  badgeVariant: 'danger'
}

export default QuickBite;
