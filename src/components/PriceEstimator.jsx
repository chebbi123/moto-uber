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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Estimate Ride Price</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
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
