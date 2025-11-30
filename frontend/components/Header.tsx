

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { ADMIN_NAV_LINKS, TECHNICIAN_NAV_LINKS } from '../constants';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userRole, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = userRole === 'admin' ? ADMIN_NAV_LINKS : TECHNICIAN_NAV_LINKS;

  const currentLink = navLinks.find(link => link.path === location.pathname);

  // A fallback title in case no link matches
  const defaultTitle = userRole === 'admin' ? t.dashboard : t.repairDashboard;
  const pageTitle = currentLink ? t[currentLink.nameKey] : defaultTitle;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="relative flex items-center justify-end h-20 px-6 bg-white dark:bg-dark-card shadow-md">
      {/* Center section - Title (Absolutely Centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white whitespace-nowrap">{pageTitle}</h1>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white border-2 border-transparent hover:border-primary-light focus:outline-none focus:border-primary-light transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {userRole === 'admin' ? 'Administrador' : 'Técnico'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{t.logout || 'Cerrar Sesión'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;