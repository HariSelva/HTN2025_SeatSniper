import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppStore();

  const navItems = [
    { path: '/courses', label: 'Courses' },
    { path: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            HTN2025
          </Link>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {user?.name || user?.email || 'User'}
                </span>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
