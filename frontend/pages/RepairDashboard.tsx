import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { WorkOrder, Part } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { workOrdersAPI, partsAPI } from '../services/api';

const getStatusColor = (status: WorkOrder['status']) => {
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

const RecentWorkOrdersTable: React.FC<{ orders: WorkOrder[] }> = ({ orders }) => {
    const { t } = useLanguage();

    if (orders.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t.noRecentWorkOrders || "No hay órdenes de trabajo recientes"}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-bg dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t.workOrderId}</th>
                        <th scope="col" className="px-6 py-3">{t.customer}</th>
                        <th scope="col" className="px-6 py-3">{t.device}</th>
                        <th scope="col" className="px-6 py-3 text-center">{t.status}</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-bg">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4">{order.customer_name}</td>
                            <td className="px-6 py-4">{order.device}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const RepairDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, partsData] = await Promise.all([
                    workOrdersAPI.getAll(),
                    partsAPI.getAll()
                ]);
                setWorkOrders(ordersData);
                setParts(partsData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const pendingCount = workOrders.filter(o => ['Recibido', 'En Diagnóstico'].includes(o.status)).length;
    const inProgressCount = workOrders.filter(o => o.status === 'En Reparación' || o.status === 'Esperando Parte').length;
    const readyCount = workOrders.filter(o => o.status === 'Reparado').length;
    const lowStockCount = parts.filter(p => p.stock < 5).length;

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">Cargando datos...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title={t.pendingDevices}
                    value={pendingCount}
                    colorClasses="bg-yellow-500"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    }
                />
                <Card
                    title={t.repairsInProgress}
                    value={inProgressCount}
                    colorClasses="bg-indigo-500"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                />
                <Card
                    title={t.readyForPickup}
                    value={readyCount}
                    colorClasses="bg-green-500"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    }
                />
                <Card
                    title={t.lowStockParts}
                    value={lowStockCount}
                    colorClasses="bg-red-500"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    }
                />
            </div>
            <div className="mt-8 bg-white dark:bg-dark-card p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t.recentWorkOrders}</h3>
                <RecentWorkOrdersTable orders={workOrders} />
            </div>
        </div>
    );
};

export default RepairDashboard;