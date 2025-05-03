import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Import Sidebar
import Stats from './Stats'; // Import Stats component
import Card from '../Card'; // Import Card
import DriverManagement from './DriverManagement'; // Ensure this path is correct
import UserManagement from './UserManagement'; // Import UserManagement component
import Analytics from '../Admin/Analytics'; // Import Analytics component
import { FaUsers, FaChartBar, FaTruck, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // State for active tab
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch analytics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch analytics data.');
      }
    };

    fetchStats();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/'); // Redirect to login page
  };

  // Render dashboard actions
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        title="Manage Users"
        variant="clickable"
        onClick={() => setActiveTab('users')}
      >
        <div className="flex items-center gap-4">
          <FaUsers className="h-6 w-6 text-blue-500" />
          <p>View and manage all users.</p>
        </div>
      </Card>
      <Card
        title="View Analytics"
        variant="clickable"
        onClick={() => setActiveTab('analytics')}
      >
        <div className="flex items-center gap-4">
          <FaChartBar className="h-6 w-6 text-green-500" />
          <p>View detailed platform analytics.</p>
        </div>
      </Card>
     
    </div>
  );

  // Render content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'stats':
        return <Stats stats={stats} />;
      case 'users':
        return <UserManagement />; // Placeholder for user management
      case 'drivers':
        return <DriverManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <p>Select a tab from the sidebar.</p>;
    }
  };

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="admin" />
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt className="h-5 w-5" />
            Logout
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {renderContent()}
      </div>
    </div>
  );
}
