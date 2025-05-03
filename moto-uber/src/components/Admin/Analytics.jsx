import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaTruck, FaChartLine, FaCar, FaDollarSign } from 'react-icons/fa';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to fetch analytics data.');
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">Platform Analytics</h2>
        {error && <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>}
        {analytics ? (
          <div className="space-y-4">
            <p className="flex items-center justify-between text-xl font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <FaUsers className="text-blue-500" /> Total Users:
              </span>
              {analytics.totalUsers}
            </p>
            <p className="flex items-center justify-between text-xl font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <FaTruck className="text-yellow-500" /> Total Drivers:
              </span>
              {analytics.totalDrivers}
            </p>
            <p className="flex items-center justify-between text-xl font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <FaCar className="text-green-500" /> Total Rides:
              </span>
              {analytics.totalRides}
            </p>
            <p className="flex items-center justify-between text-xl font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <FaChartLine className="text-purple-500" /> Active Rides:
              </span>
              {analytics.activeRides}
            </p>
            <p className="flex items-center justify-between text-xl font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <FaDollarSign className="text-green-600" /> Total Revenue:
              </span>
              <span className="text-green-600 font-bold">${analytics.totalRevenue.toFixed(2)}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
