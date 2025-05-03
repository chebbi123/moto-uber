import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../Card';
import Sidebar from '../Sidebar'; // Import Sidebar
import Profile from '../Profile'; // Import Profile component
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaMapMarkerAlt, FaRoute, FaUser, FaMoneyBillWave, FaRoad } from 'react-icons/fa'; // Import FontAwesome icons

export default function DriverDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // Add activeTab state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/drivers/performance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch performance metrics.');
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="driver" />
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full flex flex-col">
        {activeTab === 'dashboard' && (
          <div className="flex-grow">
            <h2 className="text-3xl font-bold mb-6">Driver Dashboard</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card title="Completed Rides">
                  <p className="text-2xl">{metrics.completedRides}</p>
                </Card>
                <Card title="Average Rating">
                  <p className="text-2xl">{metrics.averageRating.toFixed(1)}</p>
                </Card>
              </div>
            ) : (
              <p>Loading performance metrics...</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                title="Update Location"
                variant="clickable"
                onClick={() => navigate('/driver/location')} // Use navigate
              >
                <p>Update your current location.</p>
              </Card>
              <Card
                title="View Performance"
                variant="clickable"
                onClick={() => navigate('/driver/performance')} // Use navigate
              >
                <p>View your performance metrics.</p>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'profile' && <Profile />} {/* Display Profile component */}
        {activeTab === 'dashboard' && <RidesList />}
      </div>
    </div>
  );
}

function RidesList() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/rides/requested', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(response.data);
      } catch (err) {
        setError('Failed to fetch requested rides.');
      }
    };

    fetchRides();
  }, []);

  const formatPrice = (price) => {
    return `${price.toFixed(3).replace('.', ',')}TND`; // Format price as 0,000TND
  };

  return (
    <div className="sticky bottom-0 bg-white p-6 rounded-t-lg shadow-md max-h-96 overflow-y-auto mt-6">
      <h3 className="text-xl font-bold mb-4">Requested Rides</h3>
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
                <FaUser className="text-green-500 mr-2" />
                <p><strong>Requested By:</strong> {ride.user?.name || 'Unknown'}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaMoneyBillWave className="text-yellow-500 mr-2" />
                <p><strong>Fare Estimate:</strong> {ride.estimatedFare ? formatPrice(ride.estimatedFare) : 'N/A'}</p>
              </div>
              <div className="flex items-center">
                <FaRoad className="text-gray-500 mr-2" />
                <p><strong>Distance:</strong> {ride.distance ? `${ride.distance.toFixed(2)}KM` : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No requested rides available.</p>
      )}
    </div>
  );
}
