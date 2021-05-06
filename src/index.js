import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/Carthook';

import './index.css';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
  <CartProvider>
    <App />
    </CartProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
