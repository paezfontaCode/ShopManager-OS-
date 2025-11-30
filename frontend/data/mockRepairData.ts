
import { WorkOrder, Part } from '../types';

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'REP-001',
    customer_name: 'Ana García',
    device: 'iPhone 13 Pro',
    issue: 'Pantalla rota, no responde al tacto.',
    status: 'En Reparación',
    received_date: '2023-11-01T10:00:00Z',
  },
  {
    id: 'REP-002',
    customer_name: 'Carlos Martinez',
    device: 'Samsung Galaxy S22',
    issue: 'La batería no dura más de 2 horas.',
    status: 'Reparado',
    received_date: '2023-10-30T14:20:00Z',
  },
  {
    id: 'REP-003',
    customer_name: 'Lucía Fernández',
    device: 'Google Pixel 7',
    issue: 'El puerto de carga está suelto y no carga bien.',
    status: 'Esperando Parte',
    received_date: '2023-11-02T11:00:00Z',
  },
  {
    id: 'REP-004',
    customer_name: 'Javier Rodríguez',
    device: 'OnePlus 10T',
    issue: 'Se reinicia aleatoriamente.',
    status: 'En Diagnóstico',
    received_date: '2023-11-03T09:15:00Z',
  },
  {
    id: 'REP-005',
    customer_name: 'Sofía López',
    device: 'Xiaomi 13',
    issue: 'La cámara trasera no enfoca.',
    status: 'Recibido',
    received_date: '2023-11-03T16:45:00Z',
  },
  {
    id: 'REP-006',
    customer_name: 'David Gómez',
    device: 'iPhone 14',
    issue: 'Problema de software, se queda en el logo de Apple.',
    status: 'Entregado',
    received_date: '2023-10-28T18:00:00Z',
  },
];

export const mockParts: Part[] = [
  { id: 101, name: 'Pantalla OLED iPhone 13 Pro', sku: 'IP13-SCR', stock: 5, price: 250.00, compatible_models: ['iPhone 13 Pro'] },
  { id: 102, name: 'Batería Galaxy S22', sku: 'S22-BAT', stock: 12, price: 80.00, compatible_models: ['Galaxy S22', 'Galaxy S22+'] },
  { id: 103, name: 'Puerto de Carga USB-C (Genérico)', sku: 'USBC-PRT', stock: 2, price: 25.00, compatible_models: ['Pixel 7', 'OnePlus 10T', 'Xiaomi 13'] },
  { id: 104, name: 'Módulo Cámara Trasera Xiaomi 13', sku: 'X13-CAM', stock: 8, price: 120.00, compatible_models: ['Xiaomi 13'] },
  { id: 105, name: 'Altavoz Superior iPhone 14', sku: 'IP14-SPK', stock: 20, price: 45.00, compatible_models: ['iPhone 14', 'iPhone 14 Pro'] },
];
