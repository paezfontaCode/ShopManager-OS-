import React, { useState, useEffect } from 'react';
import { WorkOrder } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { workOrdersAPI } from '../services/api';

interface DelinquentCustomer {
    customer_name: string;
    customer_phone: string | null;
    customer_id: string | null;
    total_debt: number;
    orders_count: number;
    orders: {
        code: string;
        device: string;
        debt: number;
        payment_status: string;
        received_date: string;
    }[];
}

const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [delinquentCustomers, setDelinquentCustomers] = useState<DelinquentCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'all' | 'delinquent'>('all');
    const { t } = useLanguage();

    const fetchOrders = async (query: string) => {
        setIsLoading(true);
        try {
            const data = await workOrdersAPI.getAll();
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

    const fetchDelinquent = async () => {
        setIsLoading(true);
        try {
            // We need to add this method to api.ts or call fetch directly
            // For now using direct fetch as it's a new endpoint
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/work-orders/delinquent', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDelinquentCustomers(data);
            }
        } catch (error) {
            console.error('Error fetching delinquent customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === 'all') {
            if (searchTerm.length > 0) {
                const delayDebounceFn = setTimeout(() => {
                    fetchOrders(searchTerm);
                }, 500);
                return () => clearTimeout(delayDebounceFn);
            } else {
                fetchOrders('');
            }
        } else {
            fetchDelinquent();
        }
    }, [searchTerm, viewMode]);

    const checkWarranty = (order: WorkOrder) => {
        if (order.status !== 'Entregado') return null;
        const deliveryDate = new Date(order.estimated_completion_date || order.received_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - deliveryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const warrantyDays = 8;

        if (diffDays <= warrantyDays) {
            return { active: true, daysLeft: warrantyDays - diffDays };
        }
        return { active: false, daysExpired: diffDays - warrantyDays };
    };

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Clientes</h2>

                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'all'
                                ? 'bg-white dark:bg-dark-bg text-primary shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        Todos los Clientes
                    </button>
                    <button
                        onClick={() => setViewMode('delinquent')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'delinquent'
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        Clientes Morosos ⚠️
                    </button>
                </div>
            </div>

            {/* Search Section - Only for 'all' view */}
            {viewMode === 'all' && (
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
            )}

            {/* Content Area */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-500">Cargando información...</p>
                    </div>
                ) : viewMode === 'all' ? (
                    // ALL CLIENTS VIEW
                    workOrders.length > 0 ? (
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
                                            {order.customer_phone && (
                                                <a
                                                    href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline mt-1"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                    </svg>
                                                    {order.customer_phone}
                                                </a>
                                            )}
                                            {order.customer_id && (
                                                <p className="text-xs text-gray-500 mt-1">ID: {order.customer_id}</p>
                                            )}
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">{order.device}</p>
                                            <p className="text-sm text-gray-500 mt-1">{order.issue}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex flex-col items-end gap-2 mb-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                                                    ${order.status === 'Entregado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        order.status === 'Recibido' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {order.status}
                                                </span>

                                                {/* Payment Status Badge */}
                                                {order.payment_status && (
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                                                        ${order.payment_status === 'Pagado' ? 'bg-green-500 text-white' :
                                                            order.payment_status === 'Pago Parcial' ? 'bg-yellow-500 text-white' :
                                                                order.payment_status === 'Vencido' ? 'bg-red-700 text-white' :
                                                                    'bg-red-500 text-white'}`}>
                                                        {order.payment_status === 'Pagado' ? '💰 Pagado' :
                                                            order.payment_status === 'Pago Parcial' ? '🟡 Parcial' :
                                                                order.payment_status === 'Vencido' ? '⚠️ Vencido' : '🔴 Pendiente'}
                                                    </span>
                                                )}
                                            </div>
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
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg font-medium">No se encontraron órdenes</p>
                        </div>
                    )
                ) : (
                    // DELINQUENT CUSTOMERS VIEW
                    delinquentCustomers.length > 0 ? (
                        delinquentCustomers.map((customer, index) => (
                            <div key={index} className="border border-red-200 dark:border-red-900/50 rounded-xl p-4 bg-red-50 dark:bg-red-900/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{customer.customer_name}</h3>
                                        {customer.customer_phone && (
                                            <a
                                                href={`https://wa.me/${customer.customer_phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline mt-1"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                {customer.customer_phone}
                                            </a>
                                        )}
                                        {customer.customer_id && (
                                            <p className="text-xs text-gray-500 mt-1">ID: {customer.customer_id}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            ${customer.total_debt.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {customer.orders_count} orden(es) pendiente(s)
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detalle de Deuda:</h4>
                                    <div className="space-y-2">
                                        {customer.orders.map((order, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 rounded text-xs">
                                                        {order.code || 'NO-CODE'}
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400">{order.device}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.payment_status === 'Vencido' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {order.payment_status}
                                                    </span>
                                                    <span className="font-bold text-red-600 dark:text-red-400">
                                                        ${order.debt.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <svg className="h-16 w-16 text-green-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">¡No hay clientes morosos!</p>
                            <p className="text-sm text-gray-400 mt-2">Todos los clientes están al día con sus pagos.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Clients;
