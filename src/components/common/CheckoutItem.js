import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { UserContext } from '../providers/AuthProvider';
import { MIN, MAX, getCart, updateCartSession, updateFirestoreCart, getItemQuantity } from '../../utils';
import { CartContext } from '../providers/CartProvider';


const CheckoutItem = (props) => {
  const restaurantId = props.restaurantId;
  const user = useContext(UserContext);
  const { cart, updateCart } = useContext(CartContext);
  const quantity = getItemQuantity(cart, props.id); // get the quantity from the Cart Context

  const IncrementItem = () => {
    if (quantity >= MAX) {

    } else {
      let cart = getCart(props.restaurantId);
      let meal = { name: props.itemName, id: props.id, quantity: quantity + 1, price: props.price };
      // remove meal from cart
      cart = cart.filter(meal => meal.id !== props.id);
      // add meal back to cart 
      cart = cart.concat(meal);
      // update react state
      updateCart(cart);
      //update firestore
      updateFirestoreCart(cart, user, restaurantId);
      // update session storage
      updateCartSession(props.restaurantId, cart);
      // setQuantity(quantity + 1);

    }
  }

  const DecreaseItem = () => {
    if (quantity <= (MIN + 1)) {

    } else {
      let cart = getCart(props.restaurantId);
      let meal = { name: props.itemName, id: props.id, quantity: quantity - 1, price: props.price };
      // remove meal from cart
      cart = cart.filter(meal => meal.id !== props.id);
      // add meal back to cart 
      cart = cart.concat(meal);
      // update react state
      updateCart(cart);
      // update firestore 
      updateFirestoreCart(cart, user, restaurantId);
      // update session storage
      updateCartSession(props.restaurantId, cart);
      // setQuantity(quantity - 1);
    }
  }

  const removeItem = () => {
    let cart = getCart(props.restaurantId);
    cart = cart.filter(meal => meal.id !== props.id);
    // update react state
    updateCart(cart);
    // update firestore 
    updateFirestoreCart(cart, user, restaurantId);
    // update session storage
    updateCartSession(props.restaurantId, cart);
  }

  const formatItemName = (itemName) => {
    if (itemName.length < 22) return itemName;

    return itemName.substring(0,19) + "..."
  }

  return (
    <div className="gold-members p-2 border-bottom checkout-item">
      <p className="text-gray mb-0 float-right ml-2">{props.priceUnit}{props.price * quantity}</p>
      <span className="count-number float-right">
        <Button variant="outline-secondary" onClick={DecreaseItem} className="btn-sm left dec"><HiOutlineMinusSm /></Button>
        <input className="count-number-input" type="text" value={quantity} readOnly />
        <Button variant="outline-secondary" onClick={IncrementItem} className="btn-sm right inc"><HiOutlinePlusSm /> </Button>
      </span>
        <div className="media">
        <button onClick={removeItem} style={{ height: '23px', marginTop: '1px', outline: 'red', background: 'red', borderColor: 'white', fontWeight: 'bold' }} className="mr-2 p-0 pl-2 pr-2 text-white">x</button>
        <div className="media-body">
          <p className="mt-1 mb-0 text-black">{formatItemName(props.itemName)}</p>
        </div>
      </div>
    </div>
  )
}

CheckoutItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  priceUnit: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
};
CheckoutItem.defaultProps = {
  show: true,
  priceUnit: '&#8358;'
}


export default CheckoutItem;
