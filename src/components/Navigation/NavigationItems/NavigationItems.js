import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { RiShoppingCartFill } from 'react-icons/ri';
import { CartContext } from '../../../context/Carthook';
import './NavigationItems.css';

const navItems = [
  { id: 'feed', text: 'Feed', link: '/', auth: true },
  { id: 'login', text: 'Login', link: '/', auth: false },
  { id: 'signup', text: 'Signup', link: '/signup', auth: false }
];

const navigationItems = props => { 
  
  const { cartItems,fetchData } = React.useContext(CartContext);
useEffect(()=>{
fetchData();
},[])

  return ([
  ...navItems.filter(item => item.auth === props.isAuth).map(item => (
    <li
      key={item.id}
      className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}
    >
      <NavLink to={item.link} exact onClick={props.onChoose}>
        {item.text}
      </NavLink>
    </li>
  )),
  props.isAuth && (
    <li className="navigation-item-cart"  key="cart">
     
      <NavLink to={'/cart'} className="navigation-nav"  exact >
        <RiShoppingCartFill  className="cart-svg"/>
        <span className="cart-span">{cartItems}</span>
        </NavLink>
       
    </li>
  ),
  props.isAuth && (
    <li className="navigation-item" key="logout">
      <button onClick={props.onLogout}>Logout</button>
    </li>
  )
  
]);
}

export default navigationItems;
