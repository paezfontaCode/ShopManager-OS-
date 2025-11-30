
import React, { useState, useEffect } from 'react';
import { Ticket } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { ticketsAPI } from '../services/api';

const TicketDetailsModal: React.FC<{ ticket: Ticket; onClose: () => void }> = ({ ticket, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 dark:border-gray-700/50">
          <h3 className="text-2xl font-bold">{t.ticketDetails}: {ticket.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* General Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
              <p className="font-semibold">{new Date(ticket.date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
              <p className="font-semibold">{ticket.customer_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Método de Pago</p>
              <p className="font-semibold">{ticket.payment_method || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
              <p className="font-semibold">{ticket.payment_status || 'N/A'}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-2">{t.items}:</h4>
            <ul className="space-y-2">
              {ticket.items.map((item, index) => (
                <li key={index} className="flex justify-between py-2 border-b dark:border-gray-700/50">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 dark:border-gray-700/50 space-y-2">
            <div className="flex justify-between">
              <span>{t.subtotal}:</span>
              <span>${ticket.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{t.tax}:</span>
              <span>${ticket.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>{t.total}:</span>
              <span>${ticket.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Multi-Currency Payment Details */}
          {(ticket.exchange_rate || ticket.amount_usd !== undefined || ticket.amount_ves !== undefined) && (
            <div className="border-t pt-4 dark:border-gray-700/50">
              <h4 className="font-semibold mb-3 text-primary">Detalles de Pago (USD/VES)</h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {ticket.exchange_rate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Cambio</p>
                    <p className="font-bold text-lg">Bs {ticket.exchange_rate.toFixed(2)}</p>
                  </div>
                )}
                {ticket.amount_usd !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pagado en Dólares</p>
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">${ticket.amount_usd.toFixed(2)}</p>
                  </div>
                )}
                {ticket.amount_ves !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pagado en Bolívares</p>
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">Bs {ticket.amount_ves.toFixed(2)}</p>
                  </div>
                )}
                {ticket.exchange_rate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total en Bolívares</p>
                    <p className="font-semibold">Bs {(ticket.total * ticket.exchange_rate).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition-colors">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};


const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ticketsAPI.getAll();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Error al cargar los tickets');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button onClick={fetchTickets} className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Historial de Ventas</h2>
        <button onClick={fetchTickets} className="text-primary hover:text-primary-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No hay tickets registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-bg dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t.ticketId}</th>
                <th scope="col" className="px-6 py-3">{t.date}</th>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3 text-center">{t.items}</th>
                <th scope="col" className="px-6 py-3 text-right">{t.total}</th>
                <th scope="col" className="px-6 py-3 text-right">USD</th>
                <th scope="col" className="px-6 py-3 text-right">VES</th>
                <th scope="col" className="px-6 py-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-bg">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{ticket.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4">{new Date(ticket.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{ticket.customer_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">{ticket.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="px-6 py-4 text-right font-semibold">${ticket.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-green-600 dark:text-green-400">
                    {ticket.amount_usd !== undefined ? `$${ticket.amount_usd.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-green-600 dark:text-green-400">
                    {ticket.amount_ves !== undefined ? `Bs ${ticket.amount_ves.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setSelectedTicket(ticket)} className="font-medium text-primary dark:text-primary-light hover:underline">{t.viewDetails}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default Tickets;