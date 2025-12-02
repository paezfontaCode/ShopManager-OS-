import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ticket } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { dashboardAPI, ticketsAPI } from '../services/api';

const salesData = [
  { name: 'Lun', sales: 0 },
  { name: 'Mar', sales: 0 },
  { name: 'Mié', sales: 0 },
  { name: 'Jue', sales: 0 },
  { name: 'Vie', sales: 0 },
  { name: 'Sáb', sales: 0 },
  { name: 'Dom', sales: 0 },
];

const RecentTicketsTable: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => {
  const { t } = useLanguage();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-bg dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">{t.ticketId}</th>
            <th scope="col" className="px-6 py-3">{t.date}</th>
            <th scope="col" className="px-6 py-3">{t.items}</th>
            <th scope="col" className="px-6 py-3 text-right">{t.total}</th>
          </tr>
        </thead>
        <tbody>
          {tickets.slice(0, 5).map(ticket => (
            <tr key={ticket.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-bg">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{ticket.id}</td>
              <td className="px-6 py-4">{new Date(ticket.date).toLocaleDateString()}</td>
              <td className="px-6 py-4">{ticket.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
              <td className="px-6 py-4 text-right font-semibold">${ticket.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalTickets: 0,
    lowStockProducts: 0
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [summaryData, ticketsData] = await Promise.all([
          dashboardAPI.getAdminSummary(),
          ticketsAPI.getAll()
        ]);

        setSummary(summaryData);
        setRecentTickets(ticketsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const tickColor = theme === 'dark' ? '#E5E7EB' : '#6B7280';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title={t.totalSales}
          value={`$${summary.totalSales.toFixed(2)}`}
          colorClasses="bg-secondary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
          }
        />
        <Card
          title={t.productsInStock}
          value={summary.totalProducts}
          colorClasses="bg-green-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          }
        />
        <Card
          title={t.totalTickets}
          value={summary.totalTickets}
          colorClasses="bg-primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg>
          }
        />
        <Card
          title={t.lowStockAlert || "Alerta Stock Bajo"}
          value={summary.lowStockProducts}
          colorClasses="bg-orange-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          }
        />
      </div>

      <div className="mt-8 bg-white dark:bg-dark-card p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t.weeklySales}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(209, 213, 219, 0.5)'} />
            <XAxis dataKey="name" tick={{ fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: tickColor }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#202330' : '#ffffff',
                borderColor: theme === 'dark' ? 'rgba(107, 114, 128, 0.5)' : '#dddddd',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}
              cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
            />
            <Bar dataKey="sales" fill="url(#colorSales)" />
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 bg-white dark:bg-dark-card p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t.recentTickets}</h3>
        {recentTickets.length > 0 ? (
          <RecentTicketsTable tickets={recentTickets} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay tickets recientes</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;