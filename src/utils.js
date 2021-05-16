import { firestore } from './firebase';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { deleteDoc, doc, setDoc } from '@firebase/firestore';


export const MIN = 0;
export const MAX = 15;

export const capitalize = (string) => {
  let lower = string.toLowerCase();

  return string.charAt(0).toUpperCase() + lower.slice(1);
}

export const generateSlug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

export const getMealFromCart = (mealId, restaurantId) => {
  const cart = JSON.parse(sessionStorage.getItem(restaurantId));
  const meal = cart.find(meal => meal.id === mealId);
  return meal;
}

export const getCart = (restaurantId) => {
  const cart = JSON.parse(sessionStorage.getItem(restaurantId));
  return cart;
}

export const updateCartSession = (restaurantId, cart) => {
  if (!cart || cart.length === 0) {
    sessionStorage.setItem(restaurantId, undefined);
  }
  let sortedCart = cart.sort((a, b) => a.name.localeCompare(b.name))
  sessionStorage.setItem(restaurantId, JSON.stringify(sortedCart));
}

export const updateFirestoreCart = async (cart, user, restaurantId) => {
  if (!user) return;
  const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
  const userRef = doc(firestore, collectionName, user.id);
  const cartRef = doc(userRef, "Cart", restaurantId);
  let sortedCart = cart.sort((a, b) => a.name.localeCompare(b.name))
  try {
    if (cart.length > 0) {
      let total = getTotalAmount(cart);
      await setDoc(cartRef, {
        totalAmount: total,
        cart: sortedCart
      }, { merge: true });
    } else {
      await deleteDoc(cartRef);
    }
  } catch (error) {
    toast.error("Cart update failed");
  }
}

export const getTotalAmount = (cart) => {
  let total = 0;
  const reducer = (accumulator, currentValue) => {
    return accumulator + (currentValue.quantity * currentValue.price);
  }

  if (cart) {
    total = cart.reduce(reducer, 0);
  }

  return total;
}

export const isRestaurantOpen = (openingTime, closingTime) => {
  let [openingTimeHour, openingTimeMinute] = openingTime.split(":");
  let [closingTimeHour, closingTimeMinute] = closingTime.split(":");

  let now = new Date();
  let timeOpened = new Date().setHours(parseInt(openingTimeHour), parseInt(openingTimeMinute));
  let timeClosed = new Date().setHours(parseInt(closingTimeHour), parseInt(closingTimeMinute));


  if ((now > timeOpened && now < timeClosed)) {
    return true;
  }
  return false;
}



export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

// form validation functions
export const verifyTime = (openingTime, closingTime) => {
  let openingDateTime = new Date();
  let closingDateTime = new Date();


  let openingTimeHour = parseInt(openingTime.split(":")[0]);
  let openingTimeMinute = parseInt(openingTime.split(":")[1]);


  let closingTimeHour = parseInt(closingTime.split(":")[0]);
  let closingTimeMinute = parseInt(closingTime.split(":")[1]);

  openingDateTime.setHours(openingTimeHour, openingTimeMinute);
  closingDateTime.setHours(closingTimeHour, closingTimeMinute);

  if (openingDateTime < closingDateTime) {
    return true;
  }

  return false;
}

export const validateName = (name) => {
  if (!name) return false;

  if (typeof name !== "string") {
    return false;
  }

  var letters = /^[A-Za-z\s]+$/;
  if (name.match(letters)) {
    return true;
  }
  else {
    return false;
  }
}

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;

  var phoneno = /^\d{10,11}$/;

  if (phoneNumber.startsWith("+234")) {
    let phone = phoneNumber.substr(4);
    if (phone.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  }

  if ((phoneNumber.match(phoneno))) {
    return true;
  } else {
    return false;
  }
}

export const formatPhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber !== 'string') {
    return null;
  }
  if (phoneNumber.length < 11) {
    return null;
  }
  if (phoneNumber.startsWith("+234")) {
    return phoneNumber;
  } else {
    return `+234${phoneNumber.substring(1)}`;
  }
}

export const validateEmail = (email) => {
  if (!email) return false;

  if (typeof email !== "string") return false;

  if (email.length < 4 || email.length > 320) return false;

  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return (true)
  }
  return (false)
}

export const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 6) {
    return false;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  return passwordRegex.test(password);
}

export const DELIVERY_FEE = 300;

export const getCuisinesArray = (string) => {
  return string.split(",");
}
