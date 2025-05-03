import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Moto Uber</div>
      <div className="hidden md:flex space-x-6">
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>
        <Link to="/profile" className="navbar-link">
          Profile
        </Link>
        <Link to="/logout" className="navbar-link">
          Logout
        </Link>
      </div>
      <button className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg">
        Menu
      </button>
    </nav>
  );
}
