import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import DriverManagement from './DriverManagement';
import { useStore } from '../context/StoreContext';

export default function AdminDashboard() {
  const { state, dispatch } = useStore();
  const { users, rides } = state;
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch({ type: 'SET_USERS', payload: data });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [dispatch]);

  const fetchRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/rides', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch({ type: 'SET_RIDES', payload: data });
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
    fetchRides();
  }, [fetchUsers, fetchRides]); // Only re-run when `fetchUsers` or `fetchRides` changes

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteRide = async (id) => {
    try {
      await axios.delete(`/api/admin/rides/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchRides();
    } catch (error) {
      console.error('Error deleting ride:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleEditRide = (ride) => {
    setEditingRide(ride);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await axios.put(`/api/admin/users/${updatedUser._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUpdateRide = async (updatedRide) => {
    try {
      await axios.put(`/api/admin/rides/${updatedRide._id}`, updatedRide, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingRide(null);
      fetchRides();
    } catch (error) {
      console.error('Error updating ride:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('rides')}
          className={`px-4 py-2 rounded ${activeTab === 'rides' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Rides
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2 rounded ${activeTab === 'drivers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Drivers
        </button>
      </div>
      {activeTab === 'users' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id} className="flex justify-between items-center mb-2">
                <span>{user.name} ({user.email})</span>
                <div>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {editingUser && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="border p-2 rounded mb-2"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="border p-2 rounded mb-2"
              />
              <button
                onClick={() => handleUpdateUser(editingUser)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          )}
        </div>
      )}
      {activeTab === 'rides' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Rides</h2>
          <ul>
            {rides.map((ride) => (
              <li key={ride._id} className="flex justify-between items-center mb-2">
                <span>
                  {ride.user?.name} → {ride.driver?.name} ({ride.status})
                </span>
                <div>
                  <button
                    onClick={() => handleEditRide(ride)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRide(ride._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {editingRide && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Edit Ride</h3>
              <input
                type="text"
                value={editingRide.status}
                onChange={(e) => setEditingRide({ ...editingRide, status: e.target.value })}
                className="border p-2 rounded mb-2"
              />
              <button
                onClick={() => handleUpdateRide(editingRide)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          )}
        </div>
      )}
      {activeTab === 'drivers' && <DriverManagement />}
    </div>
  );
}
