import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/rides/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(response.data);
      } catch (err) {
        setError('Failed to fetch ride history.');
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">Ride History</h2>
        {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          {rides.length === 0 ? (
            <p className="text-gray-500 text-center">No rides found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rides.map((ride) => (
                <li key={ride._id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <p className="text-gray-700"><span className="font-semibold">Pickup:</span> {ride.pickup.address}</p>
                    <p className="text-gray-700"><span className="font-semibold">Dropoff:</span> {ride.dropoff.address}</p>
                    <p className="text-gray-700"><span className="font-semibold">Status:</span> {ride.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${ride.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
