
export interface Product {
  id: number;
  name: string;
  brand: string;
  stock: number;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Ticket {
  id: string;
  date: string;
  customer_name?: string;
  payment_method?: string;
  payment_status?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  exchange_rate?: number;
  amount_usd?: number;
  amount_ves?: number;
}

// Types for Repair Module
export type RepairStatus = 'Recibido' | 'En Diagnóstico' | 'Esperando Parte' | 'En Reparación' | 'Reparado' | 'Entregado';

export interface WorkOrder {
  id: string;
  code?: string;
  customer_name: string;
  customer_phone?: string;
  customer_id?: string;
  device: string;
  issue: string;
  status: RepairStatus;
  received_date: string;
  estimated_completion_date?: string;

  // Payment fields
  repair_cost?: number;
  amount_paid?: number;
  payment_status?: string;
  payment_date?: string;
  payment_notes?: string;
}

export interface Part {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  compatible_models: string[];
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'technician';
  created_at?: string;
}
