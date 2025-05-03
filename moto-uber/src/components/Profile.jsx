import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTag, FaWallet, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import UpdateUser from './Admin/UpdateUser'; // Import UpdateUser component

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle update modal

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = localStorage.getItem('user'); // Get userId from localStorage
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { user, Authorization: `Bearer ${token}` }, // Use userInfo endpoint
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user information.');
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser); // Update the user state with the updated user data
    setIsEditing(false); // Close the update modal
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!user) {
    return <p className="text-gray-500 text-center mt-4">Loading user information...</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaEdit className="h-5 w-5" />
          Update
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <FaUser className="text-blue-500 h-6 w-6" />
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <FaEnvelope className="text-green-500 h-6 w-6" />
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <FaPhone className="text-yellow-500 h-6 w-6" />
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Phone:</span> {user.phone || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <FaMapMarkerAlt className="text-red-500 h-6 w-6" />
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Location:</span>{' '}
            {user.location?.lat && user.location?.lng
              ? `${user.location.lat}, ${user.location.lng}`
              : 'Not set'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <FaUserTag className="text-orange-500 h-6 w-6" />
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <FaWallet className="text-purple-500 h-6 w-6" />
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Wallet Balance:</span> ${user.wallet?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>
      {isEditing && (
        <UpdateUser
          user={user}
          onUpdate={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
