import React ,{useContext}from 'react';
import {CartContext} from '../../context/Carthook';
import './cart.css'


const Cart = props=>{
   const {cart} = useContext(CartContext);
    console.log(cart);

    return (
      
   <ul>
       {cart.cartItem.map((item, idx)=>{
         return (
            <li className="list" key={idx}>
            <div className="post">
              <header className="post__header">
                <h1 className="post__title">{item.title}</h1>
                <p className="post_content">{item.content}</p>
              </header>
              <div className="post__actions">
                <span className="post_read"> {item.amount}</span>
                </div>
            </div>
            </li>
         );  
       })}

   </ul>
    );
}

export default Cart;