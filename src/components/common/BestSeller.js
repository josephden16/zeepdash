import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Image, Badge, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AiFillStar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { UserContext } from '../providers/AuthProvider';
import { updateFirestoreCart, isRestaurantOpen } from '../../utils';


const BestSeller = (props) => {
  const restaurantId = props.restaurantId;
  const mealId = props.id;
  const user = useContext(UserContext);
  const closingTime = props.closingTime;
  const openingTime = props.openingTime;


  const addToCart = () => {
    if (user) {
      if (user.role === "business") {
        toast.info("Business accounts cannot make orders");
        return;
      }
    }

    // ensure users can't place orders when restaurant's are closed
    const restaurantOpen = isRestaurantOpen(openingTime, closingTime);
    if (!restaurantOpen) {
      toast.info("You can't add meals to cart while a restaurant is closed");
      return;
    }

    let currentCart = JSON.parse(sessionStorage.getItem(restaurantId));
    if (currentCart) {
      // check if item already exists in cart
      const mealExist = currentCart.find(item => item.id === mealId);
      if (mealExist) {
        toast.info("This meal is already in your cart");
      } else {
        let meal = { name: props.title, id: mealId, price: props.price, quantity: 1, };
        currentCart = currentCart.concat(meal);
        // update session storage
        sessionStorage.setItem(restaurantId, JSON.stringify(currentCart));
        // update react state
        props.updateCart(currentCart);
        // update firestore
        updateFirestoreCart(currentCart, user, restaurantId);
        toast.success("Meal added to cart");
      }
    } else {
      let meal = { name: props.title, id: mealId, price: props.price, quantity: 1, };
      let cart = [];
      cart = cart.concat(meal);
      // update firestore 
      updateFirestoreCart(cart, user, restaurantId);
      // update session storage
      sessionStorage.setItem(restaurantId, JSON.stringify(cart));
      // update react state
      props.updateCart(cart, user);
      toast.success("Meal added to cart");
    }
  }

  return (
    <div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
      <div className="list-card-image">
        {props.rating ? (
          <div className="star position-absolute">
            <Badge variant="success">
              <AiFillStar /> {props.rating}
            </Badge>
          </div>
        )
          : ""
        }
        {props.showPromoted ? (
          <div className="member-plan position-absolute">
            <Badge variant={props.promotedVariant}>Promoted</Badge>
          </div>
        )
          : ""
        }
        <Link to="#">
          <Image draggable={false} style={{ height: '170px', width: '100%' }} src={props.image} className={props.imageClass} alt={props.imageAlt} />
        </Link>
      </div>
      <div className="p-3 position-relative">
        <div className="list-card-body">
          <p className="mb-1 text-black"><Link to="#" style={{ fontSize: '14px' }} className="text-black">{props.title}</Link></p>
          {props.subTitle ? (
            <p className="text-dark mb-3 mt-2" style={{ fontSize: '11px' }}>{props.subTitle}</p>
          )
            : ''
          }
          {(props.price) ? (
            <p className="text-gray time mb-0 flex justify-content-between">
              <span className="btn-sm pl-0 text-black pr-0" to="#">
                {props.priceUnit}{props.price}
              </span>
              {(props.isNew) ? (<Badge variant="success" className='ml-1'>NEW</Badge>) : ""}
              <span className="float-right">
                <Button onClick={addToCart} variant='outline-secondary' size="sm">ADD</Button>
              </span>
            </p>
          ) : ''
          }
        </div>
      </div>
    </div>
  );
}


BestSeller.propTypes = {
  title: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  image: PropTypes.string.isRequired,
  imageClass: PropTypes.string,
  isNew: PropTypes.bool,
  subTitle: PropTypes.string,
  price: PropTypes.number.isRequired,
  priceUnit: PropTypes.string.isRequired,
  showPromoted: PropTypes.bool,
  promotedVariant: PropTypes.string,
  favIcoIconColor: PropTypes.string,
  rating: PropTypes.string,
  id: PropTypes.string.isRequired,
  qty: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
};
BestSeller.defaultProps = {
  imageAlt: '',
  imageClass: '',
  isNew: false,
  subTitle: '',
  price: '',
  priceUnit: '$',
  showPromoted: false,
  promotedVariant: 'dark',
  favIcoIconColor: '',
  rating: ''
}

export default BestSeller;
