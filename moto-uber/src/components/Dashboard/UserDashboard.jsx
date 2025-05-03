import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../Card';
import Sidebar from '../Sidebar'; // Import Sidebar
import FareEstimation from '../Ride/FareEstimation'; // Import FareEstimation component
import Profile from '../Profile'; // Import Profile component
import { FaSignOutAlt, FaMapMarkerAlt, FaRoute, FaMoneyBillWave, FaRoad, FaClock } from 'react-icons/fa'; // Import logout icon and FontAwesome icons
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link for navigation
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; // Import Leaflet components
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

export default function UserDashboard() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // Add activeTab state
  const emchi = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/wallet/balance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(response.data.wallet);
      } catch (err) {
        setError('Failed to fetch wallet balance.');
      }
    };

    fetchBalance();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    emchi('/');
  };

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="user" />
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">User Dashboard</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt className="h-5 w-5" />
            Logout
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {activeTab === 'dashboard' && (
          <>
            {balance !== null ? (
              <Card title="Wallet Balance">
                <p className="text-2xl">${balance.toFixed(2)}</p>
              </Card>
            ) : (
              <p>Loading wallet balance...</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card
                title="Book a Ride"
                variant="clickable"
                className="p-0"
              >
                <Link to="/book-ride" className="block p-6 w-full h-full">
                  <p>Book a new ride.</p>
                </Link>
              </Card>
              <Card
                title="Ride History"
                variant="clickable"
                onClick={() => setActiveTab('rideHistory')}
              >
                <p>View your past rides.</p>
              </Card>
              <Card
                title="Estimate Fare"
                variant="clickable"
                onClick={() => setActiveTab('fareEstimation')}
              >
                <p>Estimate the fare for a ride.</p>
              </Card>
              <Card
                title="Add Funds"
                variant="clickable"
                onClick={() => emchi('/add-funds')}
              >
                <p>Add funds to your wallet.</p>
              </Card>
            </div>
          </>
        )}
        {activeTab === 'rideHistory' && <RideHistory />}
        {activeTab === 'fareEstimation' && <FareEstimation />}
        {activeTab === 'profile' && <Profile />} {/* Display Profile component */}
      </div>
    </div>
  );
}

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/rides/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(response.data);
      } catch (err) {
        setError('Failed to fetch ride history.');
      }
    };

    fetchRides();
  }, []);

  const formatPrice = (price) => {
    return `${price.toFixed(3).replace('.', ',')}TND`; // Format price as 0,000TND
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Ride History</h3>
      {error && <p className="text-red-500">{error}</p>}
      {rides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <div key={ride._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <p><strong>Pickup:</strong> {ride.pickup.address}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaRoute className="text-blue-500 mr-2" />
                <p><strong>Dropoff:</strong> {ride.dropoff.address}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaMoneyBillWave className="text-yellow-500 mr-2" />
                <p><strong>Fare:</strong> {ride.estimatedFare ? formatPrice(ride.estimatedFare) : 'N/A'}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaRoad className="text-gray-500 mr-2" />
                <p><strong>Status:</strong> {ride.status}</p>
              </div>
              <div className="flex items-center">
                <FaClock className="text-green-500 mr-2" />
                <p><strong>Date:</strong> {new Date(ride.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No rides found.</p>
      )}
    </div>
  );
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const type = window.confirm('Is this the pickup location? Click "Cancel" for dropoff.') ? 'pickup' : 'dropoff';
      onMapClick(type, { lat, lng });
    },
  });
  return null;
}
