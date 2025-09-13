import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppStore();

  const navItems = [
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/watchlist', label: 'Watchlist', icon: '👀' },
  ];

  return (
    <nav className="nav-premium">
      <div className="container-premium">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Hack the North</span>
              <span className="text-sm text-gray-500 font-medium">Course Monitor</span>
            </div>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-premium px-4 py-2 rounded-xl ${
                  location.pathname === item.path ? 'active bg-primary-50' : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-gray-700 text-sm font-semibold">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name || user?.email || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
                <button className="btn-ghost-premium text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary-premium ml-6"
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
