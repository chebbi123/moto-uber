import React, { useState } from 'react';
import axios from 'axios';

export default function AddFunds() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/wallet/add-funds',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Funds added successfully!');
      setError('');
    } catch (err) {
      setError('Failed to add funds. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-pink-600 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Add Funds
        </h2>
        {message && (
          <p className="text-green-600 text-sm mb-4 text-center font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium">{error}</p>
        )}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-300 shadow"
        >
          Add Funds
        </button>
      </form>
    </div>
  );
}
