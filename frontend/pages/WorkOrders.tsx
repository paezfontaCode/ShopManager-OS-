import React, { useState, useMemo, useEffect } from 'react';
import { WorkOrder, RepairStatus } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { workOrdersAPI } from '../services/api';
import Modal from '../components/Modal';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Recibido': return 'bg-blue-500';
    case 'En Diagnóstico': return 'bg-yellow-500';
    case 'Esperando Parte': return 'bg-orange-500';
    case 'En Reparación': return 'bg-indigo-500';
    case 'Reparado': return 'bg-green-500';
    case 'Entregado': return 'bg-gray-500';
    default: return 'bg-gray-400';
  }
};

const WorkOrders: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<WorkOrder | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    device: '',
    issue: '',
    status: 'Recibido' as RepairStatus,
    received_date: new Date().toISOString().split('T')[0],
    estimated_completion_date: ''
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setIsLoading(true);
      const data = await workOrdersAPI.getAll();
      setWorkOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load work orders');
      console.error('Work orders error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (order?: WorkOrder) => {
    if (order) {
      setCurrentOrder(order);
      setFormData({
        customer_name: order.customer_name,
        device: order.device,
        issue: order.issue,
        status: order.status,
        received_date: order.received_date.split('T')[0],
        estimated_completion_date: order.estimated_completion_date ? order.estimated_completion_date.split('T')[0] : ''
      });
    } else {
      setCurrentOrder(null);
      setFormData({
        customer_name: '',
        device: '',
        issue: '',
        status: 'Recibido',
        received_date: new Date().toISOString().split('T')[0],
        estimated_completion_date: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare payload matching backend schema
      const payload: any = {
        customer_name: formData.customer_name,
        device: formData.device,
        issue: formData.issue,
        status: formData.status,
        estimated_completion_date: formData.estimated_completion_date || null
      };

      if (currentOrder) {
        await workOrdersAPI.update(currentOrder.id, payload);
      } else {
        await workOrdersAPI.create(payload);
      }
      fetchWorkOrders();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving work order:', err);
      alert('Failed to save work order');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      try {
        await workOrdersAPI.delete(id);
        fetchWorkOrders();
      } catch (err) {
        console.error('Error deleting work order:', err);
        alert('Failed to delete work order');
      }
    }
  };

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(order =>
      (order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.device?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [workOrders, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading work orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading work orders</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder={t.searchWorkOrders}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {t.registerNewDevice}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-bg dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">{t.workOrderId}</th>
              <th scope="col" className="px-6 py-3">{t.customer}</th>
              <th scope="col" className="px-6 py-3">{t.device}</th>
              <th scope="col" className="px-6 py-3">{t.issue}</th>
              <th scope="col" className="px-6 py-3 text-center">{t.status}</th>
              <th scope="col" className="px-6 py-3">{t.receivedDate}</th>
              <th scope="col" className="px-6 py-3 text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkOrders.length > 0 ? (
              filteredWorkOrders.map(order => (
                <tr key={order.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-bg">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {order.code || order.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4">{order.customer_name}</td>
                  <td className="px-6 py-4">{order.device}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{order.issue}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(order.received_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="font-medium text-primary dark:text-primary-light hover:underline"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="font-medium text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No work orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentOrder ? 'Edit Work Order' : 'Register New Device'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device</label>
            <input
              type="text"
              name="device"
              value={formData.device}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Description</label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
              >
                <option value="Recibido">Recibido</option>
                <option value="En Diagnóstico">En Diagnóstico</option>
                <option value="Esperando Parte">Esperando Parte</option>
                <option value="En Reparación">En Reparación</option>
                <option value="Reparado">Reparado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Received Date</label>
              <input
                type="date"
                name="received_date"
                value={formData.received_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Completion</label>
            <input
              type="date"
              name="estimated_completion_date"
              value={formData.estimated_completion_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              {currentOrder ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkOrders;