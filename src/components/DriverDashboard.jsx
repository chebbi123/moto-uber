import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState(0);

  const fetchRides = useCallback(async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/driver/rides`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRides(Array.isArray(data) ? data : []);
      calculateEarnings(data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  }, []);

  const calculateEarnings = (rides) => {
    const total = rides.reduce((sum, ride) => sum + (ride.price || 0), 0);
    setEarnings(total);
  };

  useEffect(() => {
    fetchRides();
  }, [fetchRides]); // Only re-run when `fetchRides` changes

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <p className="mb-4">Total Earnings: <span className="font-bold">{earnings} currency units</span></p>
      <h2 className="text-xl font-semibold mb-2">My Rides</h2>
      <ul>
        {rides.map((ride) => (
          <li key={ride._id} className="flex justify-between items-center mb-2">
            <span>
              {ride.pickup.address} → {ride.dropoff.address} ({ride.status})
            </span>
            <span className="font-bold">{ride.price} currency units</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
