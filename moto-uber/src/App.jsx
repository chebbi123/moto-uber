import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookRide from './components/Ride/BookRide';
import RideHistory from './components/Ride/RideHistory';
import FareEstimation from './components/Ride/FareEstimation';
import AddFunds from './components/Wallet/AddFunds';
import WalletBalance from './components/Wallet/WalletBalance';
import UserManagement from './components/Admin/UserManagement';
import Analytics from './components/Admin/Analytics';
import LocationTracking from './components/Driver/LocationTracking';
import PerformanceMetrics from './components/Driver/PerformanceMetrics';
import UserDashboard from './components/Dashboard/UserDashboard';
import DriverDashboard from './components/Dashboard/DriverDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Profile from './components/Profile';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="font-sans bg-gray-50 min-h-screen">
        <Router future={{ v7_startTransition: true}}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book-ride" element={<BookRide />} />
            <Route path="/ride-history" element={<RideHistory />} />
            <Route path="/fare-estimation" element={<FareEstimation />} />
            <Route path="/add-funds" element={<AddFunds />} />
            <Route path="/wallet-balance" element={<WalletBalance />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/driver/location" element={<LocationTracking />} />
            <Route path="/driver/performance" element={<PerformanceMetrics />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </div>
    </I18nextProvider>
  );
}

export default App;
