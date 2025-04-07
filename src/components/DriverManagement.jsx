import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { useStore } from '../context/StoreContext';

export default function DriverManagement() {
  const { state, dispatch } = useStore();
  const { drivers } = state;
  const [form, setForm] = useState({ email: '', name: '', phone: '', vehicleType: '', vehicleNumber: '' });
  const [editingDriver, setEditingDriver] = useState(null);

  const fetchDrivers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/drivers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch({ type: 'SET_DRIVERS', payload: data });
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]); // Only re-run when `fetchDrivers` changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await axios.put(`/api/admin/drivers/${editingDriver._id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/api/admin/drivers', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      setForm({ email: '', name: '', phone: '', vehicleType: '', vehicleNumber: '' });
      setEditingDriver(null);
      fetchDrivers();
    } catch (error) {
      console.error('Error submitting driver:', error);
    }
  };

  const handleEdit = (driver) => {
    setForm(driver);
    setEditingDriver(driver);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/drivers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
            required
            disabled={!!editingDriver}
          />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Vehicle Type"
            value={form.vehicleType}
            onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editingDriver ? 'Update Driver' : 'Add Driver'}
        </button>
      </form>
      <ul>
        {drivers.map((driver) => (
          <li key={driver._id} className="flex justify-between items-center mb-2">
            <span>
              {driver.name} ({driver.email}) - {driver.vehicleType} ({driver.vehicleNumber})
            </span>
            <div>
              <button
                onClick={() => handleEdit(driver)}
                className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(driver._id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
