import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { productsAPI, ticketsAPI } from '../services/api';
import { useExchangeRate } from '../context/ExchangeRateContext';
import ExchangeRateSelector from '../components/ExchangeRateSelector';
import PaymentModal from '../components/PaymentModal';

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => (
  <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full">
    <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-32 object-cover" />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-semibold text-gray-800 dark:text-white truncate" title={product.name}>{product.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
      <div className="flex justify-between items-center mt-auto pt-4">
        <span className="font-bold text-lg text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className={`p-2 rounded-full focus:outline-none transition-colors ${product.stock > 0 ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
      </div>
      {product.stock <= 0 && <p className="text-xs text-red-500 mt-1">Out of Stock</p>}
    </div>
  </div>
);

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { t } = useLanguage();
  const { rate, convert } = useExchangeRate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Products error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity >= product.stock) {
          alert(`Cannot add more. Only ${product.stock} in stock.`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.stock) {
      alert(`Cannot add more. Only ${product.stock} in stock.`);
      return;
    }

    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0; // Prices already include tax
  const total = subtotal;
  const totalVES = convert(total);

  const handleCompleteSale = async (paymentDetails: { usd: number; ves: number; method: string }) => {
    try {
      // Prepare ticket data
      const ticketData = {
        customer_name: "Cliente General",
        payment_method: paymentDetails.method,
        payment_status: "Paid",
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        exchange_rate: rate,
        amount_usd: paymentDetails.usd,
        amount_ves: paymentDetails.ves
      };

      // Send to backend
      const createdTicket: any = await ticketsAPI.create(ticketData);

      // Success! Show ticket number and clear cart
      alert(`¡Venta completada exitosamente!\n\nTicket: ${createdTicket.id}\nTotal: $${total.toFixed(2)} / Bs ${totalVES.toFixed(2)}\n\nPagado:\n- Dólares: $${paymentDetails.usd.toFixed(2)}\n- Bolívares: Bs ${paymentDetails.ves.toFixed(2)}`);

      setCart([]);
      setIsPaymentModalOpen(false);

      // Refresh products to update stock
      await fetchProducts();
    } catch (error) {
      console.error('Error creating sale:', error);
      alert(`Error al procesar la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading products</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Product Selection */}
      <div className="lg:w-2/3 flex flex-col">
        {/* Exchange Rate Selector */}
        <div className="mb-4 flex justify-end">
          <ExchangeRateSelector />
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={t.searchProductsPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-dark-card dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-grow overflow-y-auto pr-2">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart/Ticket */}
      <div className="lg:w-1/3 bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 flex flex-col h-full border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.currentTicket}</h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        </div>

        <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>{t.cartEmpty}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg group hover:shadow-sm transition-all">
                  <div className="flex-grow min-w-0 mr-4">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} / unit</p>
                  </div>
                  <div className="flex items-center bg-white dark:bg-dark-card rounded-lg border dark:border-gray-600 shadow-sm">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                      className="w-10 text-center text-sm bg-transparent border-none focus:ring-0 p-0"
                      min="1"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-500 hover:text-green-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-4 font-bold text-gray-800 dark:text-white w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t pt-6 mt-4 dark:border-gray-700/50 space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t.subtotal}</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t.tax}</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-2 border-t border-dashed dark:border-gray-700">
            <span>{t.total}</span>
            <div className="text-right">
              <div className="text-primary">${total.toFixed(2)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Bs {totalVES.toFixed(2)}</div>
            </div>
          </div>
          <button
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={cart.length === 0}
            onClick={() => setIsPaymentModalOpen(true)}
          >
            {t.completeSale}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleCompleteSale}
        totalUSD={total}
        rate={rate}
      />
    </div>
  );
};

export default POS;