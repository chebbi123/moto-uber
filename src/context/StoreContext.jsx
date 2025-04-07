import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  notifications: [],
  language: localStorage.getItem('language') || 'en',
  location: null,
  status: null,
  users: [],
  rides: [],
  drivers: [],
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      localStorage.setItem('token', action.payload);
      return { ...state, token: action.payload };
    case 'SET_ROLE':
      localStorage.setItem('role', action.payload);
      return { ...state, role: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_LANGUAGE':
      localStorage.setItem('language', action.payload);
      return { ...state, language: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_RIDES':
      return { ...state, rides: action.payload };
    case 'SET_DRIVERS':
      return { ...state, drivers: action.payload };
    case 'FETCH_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        notifications: [],
        location: null,
        status: null,
        users: [],
        rides: [],
        drivers: [],
      };
    default:
      console.error(`Unhandled action type: ${action.type}`);
      return state;
  }
};

// Create context
const StoreContext = createContext();

// StoreProvider component
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch notifications function
  const fetchNotifications = async () => {
    if (!state.token) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/notifications`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: 'FETCH_NOTIFICATIONS', payload: data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        dispatch({ type: 'LOGOUT' });
      }
    }
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, fetchNotifications }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store
export const useStore = () => useContext(StoreContext);
