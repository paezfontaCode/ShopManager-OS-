
import { Product, Ticket } from '../types';

export const mockProducts: Product[] = [
  { id: 1, name: 'Galaxy S24 Ultra', brand: 'Samsung', stock: 15, price: 1299.99, imageUrl: 'https://picsum.photos/seed/s24/200' },
  { id: 2, name: 'iPhone 15 Pro Max', brand: 'Apple', stock: 22, price: 1199.99, imageUrl: 'https://picsum.photos/seed/i15/200' },
  { id: 3, name: 'Pixel 8 Pro', brand: 'Google', stock: 18, price: 999.99, imageUrl: 'https://picsum.photos/seed/p8/200' },
  { id: 4, name: 'OnePlus 12', brand: 'OnePlus', stock: 12, price: 799.99, imageUrl: 'https://picsum.photos/seed/op12/200' },
  { id: 5, name: 'Galaxy Z Fold 5', brand: 'Samsung', stock: 8, price: 1799.99, imageUrl: 'https://picsum.photos/seed/zfold5/200' },
  { id: 6, name: 'iPhone 15', brand: 'Apple', stock: 30, price: 799.99, imageUrl: 'https://picsum.photos/seed/i15std/200' },
  { id: 7, name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', stock: 10, price: 1150.00, imageUrl: 'https://picsum.photos/seed/x14/200' },
  { id: 8, name: 'Nothing Phone (2)', brand: 'Nothing', stock: 25, price: 599.00, imageUrl: 'https://picsum.photos/seed/np2/200' },
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    date: '2023-10-26T10:00:00Z',
    items: [
      { ...mockProducts[1], quantity: 1 },
      { ...mockProducts[5], quantity: 1 },
    ],
    subtotal: 1999.98,
    tax: 159.99,
    total: 2159.97,
  },
  {
    id: 'TKT-002',
    date: '2023-10-26T12:35:00Z',
    items: [
      { ...mockProducts[2], quantity: 2 },
    ],
    subtotal: 1999.98,
    tax: 159.99,
    total: 2159.97,
  },
  {
    id: 'TKT-003',
    date: '2023-10-27T09:15:00Z',
    items: [
      { ...mockProducts[3], quantity: 1 },
    ],
    subtotal: 799.99,
    tax: 64.00,
    total: 863.99,
  },
];
