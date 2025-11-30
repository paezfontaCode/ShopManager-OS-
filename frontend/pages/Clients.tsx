import React, { useState, useEffect } from 'react';
import { WorkOrder } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { workOrdersAPI } from '../services/api';

const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const { t } = useLanguage();

    const fetchOrders = async (query: string) => {
        setIsLoading(true);
        try {
            // Reuse existing endpoint which filters by customer name or device
            const data = await workOrdersAPI.getAll();
            // Client-side filtering for now as the API search might be limited
            // Ideally backend should handle this, but for now we filter loaded orders
            const filtered = data.filter(order =>
                order.customer_name.toLowerCase().includes(query.toLowerCase()) ||
                order.device.toLowerCase().includes(query.toLowerCase()) ||
                (order.code && order.code.toLowerCase().includes(query.toLowerCase()))
            );
            setWorkOrders(filtered);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                fetchOrders(searchTerm);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else if (searchTerm.length === 0) {
            setWorkOrders([]);
            setSelectedCustomer(null);
        }
    }, [searchTerm]);

    const checkWarranty = (order: WorkOrder) => {
        if (order.status !== 'Entregado') return null;

        // Assuming updated_at or a specific delivery date is used. 
        // For now, we'll use estimated_completion_date as a proxy or updated_at if available in future
        // Let's assume the 'received_date' + 3 days is delivery for this mock logic if no delivery date exists
        // In a real scenario, we need a 'delivered_date' field.
        // Using received_date as a fallback for calculation demonstration:

        const deliveryDate = new Date(order.estimated_completion_date || order.received_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - deliveryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Warranty: 8 days for screens (assuming all repairs have this policy for now)
        const warrantyDays = 8;

        if (diffDays <= warrantyDays) {
            return { active: true, daysLeft: warrantyDays - diffDays };
        }
        return { active: false, daysExpired: diffDays - warrantyDays };
    };

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Clientes y Garantías</h2>

            {/* Search Section */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buscar por Cliente, Equipo o ID
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ej: Juan Perez, iPhone 13, A1B2C3..."
                        className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-dark-bg dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-500">Buscando historial...</p>
                    </div>
                ) : workOrders.length > 0 ? (
                    workOrders.map((order) => {
                        const warranty = checkWarranty(order);
                        return (
                            <div key={order.id} className="border dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-dark-bg/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{order.customer_name}</h3>
                                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-300">
                                                {order.code || 'NO-CODE'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">{order.device}</p>
                                        <p className="text-sm text-gray-500 mt-1">{order.issue}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 
                      ${order.status === 'Entregado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                order.status === 'Recibido' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status}
                                        </span>
                                        <p className="text-xs text-gray-500">Recibido: {new Date(order.received_date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Warranty Section */}
                                {order.status === 'Entregado' && warranty && (
                                    <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${warranty.active ? 'bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800'}`}>
                                        <div className={`p-2 rounded-full ${warranty.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${warranty.active ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                                                {warranty.active ? 'Garantía Activa' : 'Garantía Expirada'}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {warranty.active
                                                    ? `Quedan ${warranty.daysLeft} días de cobertura.`
                                                    : `Expiró hace ${warranty.daysExpired} días.`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : searchTerm.length > 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron reparaciones para "{searchTerm}"
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">Ingrese un nombre, equipo o código para ver el historial</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clients;
