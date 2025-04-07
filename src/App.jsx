
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import RideTracking from './components/RideTracking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useStore } from './context/StoreContext';

const App = () => {
  const { state } = useStore();

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!state.token) return <Navigate to="/login" />;
    if (requiredRole && state.role !== requiredRole) return <Navigate to="/" />;
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: state.token ? (
        state.role === 'admin' ? (
          <Navigate to="/admin" />
        ) : (
          <Navigate to="/driver" />
        )
      ) : (
        <Navigate to="/login" />
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/driver",
      element: (
        <ProtectedRoute requiredRole="driver">
          <DriverDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/track/:rideId",
      element: (
        <ProtectedRoute>
          <RideTracking />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
