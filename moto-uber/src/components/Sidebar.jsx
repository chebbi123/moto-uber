import React from 'react';
import { FaUsers, FaClipboardList, FaTruck, FaChartBar, FaUserCircle } from 'react-icons/fa'; // Import icons


export default function Sidebar({ activeTab, setActiveTab, role }) {
  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar className="h-6 w-6" /> },
      { id: 'users', label: 'Manage Users', icon: <FaUsers className="h-6 w-6" /> },
      { id: 'analytics', label: 'Analytics', icon: <FaClipboardList className="h-6 w-6" /> },
    ],
    driver: [
      { id: 'profile', label: 'Profile', icon: <FaUserCircle className="h-6 w-6" /> },
      { id: 'rides', label: 'My Rides', icon: <FaTruck className="h-6 w-6" /> },
    ],
    user: [
      { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar className="h-6 w-6" /> },
      { id: 'profile', label: 'Profile', icon: <FaUserCircle className="h-6 w-6" /> },
      { id: 'bookings', label: 'My Bookings', icon: <FaClipboardList className="h-6 w-6" /> },
    ],
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0 flex flex-col z-50">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">Moto Uber</div>
        <ul className="flex-1 p-4 space-y-4">
          {menuItems[role]?.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                activeTab === item.id ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
     
    </div>
  );
}
