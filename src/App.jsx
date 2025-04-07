import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import RideTracking from './components/RideTracking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useStore } from './context/StoreContext';

function App() {
  const { state, fetchNotifications } = useStore();
  const { token, role } = state;

  useEffect(() => {
    fetchNotifications();
  }, [token, fetchNotifications]); // Only re-run when `token` changes

  const router = createBrowserRouter([
    {
      path: '/',
      element: token ? (
        role === 'admin' ? (
          <Navigate replace to="/admin-dashboard" />
        ) : role === 'driver' ? (
          <Navigate replace to="/driver-dashboard" />
        ) : (
          <Navigate replace to="/dashboard" />
        )
      ) : (
        <Navigate replace to="/login" />
      ),
    },
    {
      path: '/login',
      element: !token ? <Login /> : <Navigate replace to="/" />,
    },
    {
      path: '/signup',
      element: !token ? <Signup /> : <Navigate replace to="/" />,
    },
    {
      path: '/admin-dashboard',
      element: role === 'admin' ? <AdminDashboard /> : <Navigate replace to="/" />,
    },
    {
      path: '/driver-dashboard',
      element: role === 'driver' ? <DriverDashboard /> : <Navigate replace to="/" />,
    },
    {
      path: '/dashboard',
      element: role === 'user' ? <RideTracking /> : <Navigate replace to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;