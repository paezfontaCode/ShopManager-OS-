
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_NAV_LINKS, TECHNICIAN_NAV_LINKS } from '../constants';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';


const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { userRole } = useAuth();

  const navLinks = userRole === 'admin' ? ADMIN_NAV_LINKS : TECHNICIAN_NAV_LINKS;

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-dark-card shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center">
          <Logo className="h-10 w-auto" showText={true} textColor="text-gray-800 dark:text-white" />
        </div>
      </div>
      <ul className="flex flex-col py-4">
        {navLinks.map((link) => (
          <li key={link.nameKey} className="px-4">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex flex-row items-center h-12 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-white transition-colors duration-200 ${isActive ? 'bg-primary/20 text-white' : ''
                }`
              }
            >
              {({ isActive }) => (
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