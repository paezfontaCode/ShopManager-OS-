
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_NAV_LINKS, TECHNICIAN_NAV_LINKS } from '../constants';
import { useLanguage } from '../hooks/useLanguage';
import { useAppSettings } from '../hooks/useAppSettings';
import { useAuth } from '../hooks/useAuth';


const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { appName } = useAppSettings();
  const { userRole } = useAuth();

  const navLinks = userRole === 'admin' ? ADMIN_NAV_LINKS : TECHNICIAN_NAV_LINKS;

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-dark-card shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h1 className="text-2xl font-bold ml-2 text-gray-800 dark:text-white">{appName}</h1>
        </div>
      </div>
      <ul className="flex flex-col py-4">
        {navLinks.map((link) => (
          <li key={link.nameKey} className="px-4">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex flex-row items-center h-12 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-white transition-colors duration-200 ${
                  isActive ? 'bg-primary/20 text-white' : ''
                }`
              }
            >
              {({isActive}) => (
                <>
                  <span className={`inline-flex items-center justify-center h-12 w-12 text-lg ${isActive ? 'text-primary-light' : ''}`}>
                    {link.icon}
                  </span>
                  <span className={`text-sm font-medium`}>{t[link.nameKey]}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;