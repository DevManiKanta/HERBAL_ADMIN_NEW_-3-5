import React, { createContext, useContext, useReducer } from 'react';

export const AppContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null,
  products: [],
  cart: [],
  orders: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: { email: action.payload },
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        products: [],
        cart: [],
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, { ...action.payload, id: Date.now().toString() }],
      };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1, cartId: Date.now().toString() }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartId !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'CREATE_ORDER': {
      const order = {
        id: `ORD-${Date.now()}`,
        items: state.cart,
        total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: action.payload,
        date: new Date().toLocaleString(),
      };
      return {
        ...state,
        orders: [...state.orders, order],
        cart: [],
      };
    }
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    state,
    login: (email) => dispatch({ type: 'LOGIN', payload: email }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    addProduct: (product) => dispatch({ type: 'ADD_PRODUCT', payload: product }),
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    removeFromCart: (cartId) => dispatch({ type: 'REMOVE_FROM_CART', payload: cartId }),
    updateCartQuantity: (cartId, quantity) =>
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { cartId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    createOrder: (paymentMethod) => dispatch({ type: 'CREATE_ORDER', payload: paymentMethod }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
