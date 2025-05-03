import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWallet, FaTrash, FaUserTag, FaEdit } from 'react-icons/fa';
import UpdateUser from '../Admin/UpdateUser'; // Import the UpdateUser component

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setFilteredUsers(filteredUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name, email, or role"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <FaUser className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-bold">{user.name || 'N/A'}</h3>
            </div>
            <p className="flex items-center gap-2 text-gray-700">
              <FaEnvelope className="text-green-500" /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaPhone className="text-yellow-500" /> {user.phone || 'N/A'}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt className="text-red-500" /> 
              {user.location?.lat && user.location?.lng
                ? `${user.location.lat}, ${user.location.lng}`
                : 'Location not set'}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaWallet className="text-purple-500" /> Wallet: ${user.wallet.toFixed(2)}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaUserTag className="text-orange-500" /> Role: {user.role}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedUser(user)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FaEdit className="inline-block mr-2" /> Update
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <FaTrash className="inline-block mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <UpdateUser
          user={selectedUser}
          onUpdate={handleUpdate}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
