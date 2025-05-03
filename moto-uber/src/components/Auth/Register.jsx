import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user', // Default role is 'user'
    vehicleType: '',
    vehicleNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess(t('register.success'));
      setError('');
    } catch (err) {
      setError(t('register.error'));
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          {t('register.title')}
        </h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center font-medium">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center font-medium">{success}</p>}
        <input
          type="text"
          name="name"
          placeholder={t('register.name')}
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t('register.email')}
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('register.password')}
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder={t('register.phone')}
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            {t('register.role')}
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          >
            <option value="user">{t('register.user')}</option>
            <option value="driver">{t('register.driver')}</option>
          </select>
        </div>
        {formData.role === 'driver' && (
          <>
            <input
              type="text"
              name="vehicleType"
              placeholder={t('register.vehicleType')}
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="text"
              name="vehicleNumber"
              placeholder={t('register.vehicleNumber')}
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 shadow"
        >
          {t('register.submit')}
        </button>
        <p className="text-sm text-center text-gray-600 mt-6">
          {t('register.loginPrompt')}{' '}
          <a href="/" className="text-blue-600 hover:underline font-semibold">
            {t('register.login')}
          </a>
        </p>
      </form>
    </div>
  );
}
