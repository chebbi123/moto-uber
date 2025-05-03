import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateUser from './UpdateUser'; // Import the UpdateUser component

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
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
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">User Management</h2>
        {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center">No users found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user._id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {user.name}</p>
                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
                    <p className="text-gray-700"><span className="font-semibold">Role:</span> {user.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition font-semibold shadow"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition font-semibold shadow"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
