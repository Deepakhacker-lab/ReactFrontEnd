import React, { useState, useEffect, useReducer, createContext } from "react";
import reducer from "./cartReducer";
import {
  REMOVE,
  INCREASE,
  DECREASE,
  ADD_TO_CART,
  CLEAR_CART,
  LOADING,
  DISPLAY_ITEMS,
} from "../context/actions";

import URL from "../baseURL";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const initial = {
    loading: false,
    cartItem: [],
  };
  const [cart, dispatch] = useReducer(reducer, initial);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState(0);

  const fetchData = async () => {
    console.log("inside fetch data");
    dispatch({ type: LOADING });
    const response = await fetch(URL + "/cart/cartItems", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(localStorage.getItem("token"));
    console.log(json);

    dispatch({ type: DISPLAY_ITEMS, payload: json });
  };

  useEffect(() => {
    // cart items
    console.log("useffect" + cart.cartItem);
    let newCartItems = cart.cartItem.reduce((total, cart) => {
      return (total += cart.amount);
    }, 0);
    console.log("Useeffedct for setting cartitems" + newCartItems);
    setCartItems(newCartItems);
    // cart total
    let newTotal = cart.cartItem.reduce((total, cartItem) => {
      return (total += cartItem.amount * cartItem.price);
    }, 0);
    //newTotal = parseFloat(newTotal.toFixed(2));
    setTotal(newTotal);
  }, [cart]);

  const removeItem = (id) => {
    dispatch({ type: REMOVE, payload: id });
  };
  // increase amount
  const increaseAmount = (id) => {
    dispatch({ type: INCREASE, payload: id });
  };
  // decrease amount
  const decreaseAmount = (_id, amount) => {
    if (amount === 1) {
      dispatch({ type: REMOVE, payload: _id });
      return;
    } else {
      dispatch({ type: DECREASE, payload: _id });
    }
  };
  // add to cart
  const addToCart = (item) => {

    const items =cart.cartItem.find((ite) =>  item._id===ite._id);
    console.log(items, item._id);
    if (items) {
      dispatch({ type: INCREASE, payload: item._id });
      console.log('Inside increase'+cart.cartItem);
    } else {
      dispatch({ type: ADD_TO_CART, payload: item });
    }
  };
  // clear cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        cartItems,
        removeItem,
        increaseAmount,
        decreaseAmount,
        addToCart,
        clearCart,
        fetchData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
