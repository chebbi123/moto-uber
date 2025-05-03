import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WalletBalance() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/wallet/balance',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBalance(response.data.wallet);
      } catch (err) {
        setError('Failed to fetch wallet balance.');
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-400 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">Wallet Balance</h2>
        {error && <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>}
        {balance !== null ? (
          <p className="text-3xl font-bold text-gray-700">${balance.toFixed(2)}</p>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
