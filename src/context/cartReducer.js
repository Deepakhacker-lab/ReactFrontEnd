import { REMOVE, INCREASE, DECREASE, ADD_TO_CART, CLEAR_CART, LOADING, DISPLAY_ITEMS } from "./actions";
export default (state, action)=>{
    switch (action.type) {
        case REMOVE:
          return state.filter(item => item.id !== action.payload);
        case INCREASE:
          return state.cartItem.map(item => {
            return item._id === action.payload
              ? { ...item, amount: item.amount + 1 }
              : { ...item };
          });
        case DECREASE:
          return state.cartItem.map(item => {
            return item._id === action.payload
              ? { ...item, amount: item.amount - 1 }
              : { ...item };
          });
        case ADD_TO_CART:
          const { _id, title, content } = action.payload;
          let newcartItem = { _id, title, content, amount: 1 };
          return {cartItem:[...state.cartItem, newcartItem], loading:false};
    
        case CLEAR_CART:
          return [];

        case LOADING:
            return {...state, loading:true};
        
        case DISPLAY_ITEMS:
            return {...state, cart: action.payload, loading:false };
    
        default:
          return state;
      }
    };