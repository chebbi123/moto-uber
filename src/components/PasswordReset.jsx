import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../context/StoreContext';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const { dispatch } = useStore();

  const requestReset = async () => {
    try {
      await axios.post('/api/users/request-reset', { email });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [{ title: 'Success', body: 'Password reset email sent' }] });
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred.');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('/api/users/reset-password', { token, newPassword });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [{ title: 'Success', body: 'Password reset successful' }] });
      setStep(1);
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="p-4">
      {step === 1 ? (
        <div>
          <h2>Request Password Reset</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
          />
          <button onClick={requestReset} className="bg-blue-600 text-white p-2">
            Request Reset
          </button>
        </div>
      ) : (
        <div>
          <h2>Reset Password</h2>
          <input
            type="text"
            placeholder="Enter reset token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2"
          />
          <button onClick={resetPassword} className="bg-blue-600 text-white p-2">
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
