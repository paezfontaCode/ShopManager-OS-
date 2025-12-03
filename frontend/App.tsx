

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
// FIX: `useAuth` is exported from `hooks/useAuth.ts`, not `context/AuthContext.tsx`.
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LanguageProvider } from './context/LanguageContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { useAppSettings } from './hooks/useAppSettings';
import { ExchangeRateProvider } from './context/ExchangeRateContext';


import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Tickets from './pages/Tickets';
import Login from './pages/Login';
import Settings from './pages/Settings';
import RepairDashboard from './pages/RepairDashboard';
import WorkOrders from './pages/WorkOrders';
import PartsInventory from './pages/PartsInventory';
import Clients from './pages/Clients';
import UserManagement from './pages/UserManagement';

const MainLayout: React.FC = () => {
  const { backgroundImage } = useAppSettings();
  const { userRole } = useAuth();

  const dottedPattern = 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)';

  const mainStyle: React.CSSProperties = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : dottedPattern,
    backgroundSize: backgroundImage ? 'cover' : '1.5rem 1.5rem',
    backgroundPosition: 'center',
    backgroundAttachment: backgroundImage ? 'fixed' : 'initial',
  };


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark-bg"
          style={mainStyle}
        >
          <div className="container mx-auto px-6 py-8">
            <Routes>
              {userRole === 'admin' && (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/work-orders" element={<WorkOrders />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/users" element={<UserManagement />} />
                </>
              )}
              {userRole === 'technician' && (
                <>
                  <Route path="/" element={<Navigate to="/repair-dashboard" replace />} />
                  <Route path="/repair-dashboard" element={<RepairDashboard />} />
                  <Route path="/work-orders" element={<WorkOrders />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/parts-inventory" element={<PartsInventory />} />
                </>
              )}
              <Route path="/settings" element={<Settings />} />
              {/* Add a fallback route for any other case */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const { appName } = useAppSettings();

  useEffect(() => {
    document.title = `${appName} | Management System`;
  }, [appName]);

  const defaultPath = userRole === 'admin' ? '/dashboard' : '/repair-dashboard';


  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={defaultPath} /> : <Login />} />
      <Route path="/*" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />} />
    </Routes>
  )
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppSettingsProvider>
            <ExchangeRateProvider>
              <HashRouter>
                <AppRoutes />
              </HashRouter>
            </ExchangeRateProvider>
          </AppSettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;