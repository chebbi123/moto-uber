import React, { useState } from 'react';
import axios from 'axios';

export default function PriceEstimator() {
  const [pickup, setPickup] = useState({ lat: '', lng: '' });
  const [dropoff, setDropoff] = useState({ lat: '', lng: '' });
  const [price, setPrice] = useState(null);

  const estimatePrice = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/rides/estimate`,
        { pickup, dropoff },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPrice(data.price);
    } catch (error) {
      console.error('Error estimating price:', error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="p-6 card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Estimate Ride Price</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input
          type="number"
          placeholder="Pickup Latitude"
          value={pickup.lat}
          onChange={(e) => setPickup({ ...pickup, lat: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Pickup Longitude"
          value={pickup.lng}
          onChange={(e) => setPickup({ ...pickup, lng: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Dropoff Latitude"
          value={dropoff.lat}
          onChange={(e) => setDropoff({ ...dropoff, lat: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Dropoff Longitude"
          value={dropoff.lng}
          onChange={(e) => setDropoff({ ...dropoff, lng: e.target.value })}
          className="border p-2 rounded"
        />
      </div>
      <button
        onClick={estimatePrice}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Estimate Price
      </button>
      {price !== null && (
        <p className="mt-4 text-lg">
          Estimated Price: <span className="font-bold">{price} currency units</span>
        </p>
      )}
    </div>
  );
}
