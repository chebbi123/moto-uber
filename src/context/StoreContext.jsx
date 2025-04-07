
import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

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
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return initialState;
    default:
      return state;
  }
};

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = axios.create({
    baseURL: '/api',
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });

  const actions = {
    login: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      dispatch({ type: 'SET_TOKEN', payload: data.token });
      dispatch({ type: 'SET_USER', payload: data.user });
      dispatch({ type: 'SET_ROLE', payload: data.user.role });
    },
    logout: () => dispatch({ type: 'LOGOUT' }),
    updateLocation: (location) => dispatch({ type: 'SET_LOCATION', payload: location }),
    updateStatus: (status) => dispatch({ type: 'SET_STATUS', payload: status }),
    fetchUsers: async () => {
      const { data } = await api.get('/users');
      dispatch({ type: 'SET_USERS', payload: data });
    },
    fetchRides: async () => {
      const { data } = await api.get('/rides');
      dispatch({ type: 'SET_RIDES', payload: data });
    },
    fetchDrivers: async () => {
      const { data } = await api.get('/drivers');
      dispatch({ type: 'SET_DRIVERS', payload: data });
    },
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
