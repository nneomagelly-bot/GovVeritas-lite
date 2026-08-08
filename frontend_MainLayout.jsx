// frontend/src/components/Layout/MainLayout.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MainLayout({ user, onLogout, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#001F3F] to-[#003366] text-white shadow-lg">
        {/* Logo Section */}
        <div className="p-6 border-b border-[#004080]">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-[#FFD700] rounded-lg flex items-center justify-center">
              <span className="font-bold text-[#001F3F]">GV</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">GovVeritas Lite</h1>
              <p className="text-xs opacity-75">Compliance Readiness</p>
            </div>
          </div>
        </div>

        {/* State Info */}
        <div className="p-4 bg-[#002a4d] text-white">
          <p className="text-xs opacity-75">Current State</p>
          <p className="font-600 mt-1">{user?.state_name}</p>
          <p className="text-xs opacity-75 mt-2">{user?.full_name}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-[#FFD700] text-[#001F3F] font-600'
                : 'text-white hover:bg-[#004080]'
            }`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate('/reports')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              isActive('/reports')
                ? 'bg-[#FFD700] text-[#001F3F] font-600'
                : 'text-white hover:bg-[#004080]'
            }`}
          >
            📋 Reports
          </button>

          <div className="py-2">
            <p className="text-xs opacity-50 px-4 py-2 font-600 uppercase">Quick Links</p>
            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#004080] rounded">
              📚 User Guide
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#004080] rounded">
              💬 Support
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#004080]">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-500 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Welcome back!</p>
              <h1 className="text-2xl font-600 text-[#001F3F]">{user?.state_name} State</h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-500 text-gray-800">{user?.full_name}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
