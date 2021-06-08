import React, { createContext, useState } from 'react';


export const CartContext = createContext([]);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const updateCart = (items) => {
    let currentCart = items;
    setCart(currentCart);
  }


  return (
    <CartContext.Provider value={{ cart, updateCart }}>
      {children}
    </CartContext.Provider>
  )
}


export default CartProvider;
