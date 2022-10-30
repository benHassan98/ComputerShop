import React, { createContext, useState } from "react";
const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (component) => {
    let obj = {};
    obj[component.category.name] = component;

    setCart({ ...cart, ...obj });
  };

  const removeFromCart = (categoryName) => {
    let new_cart = JSON.parse(JSON.stringify(cart));
    delete new_cart[categoryName];
    if (cart.hasOwnProperty(categoryName)) setCart(new_cart);
  };

  const emptyCart = () => setCart({});
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, emptyCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
