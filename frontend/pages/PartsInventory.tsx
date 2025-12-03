import React, { useState, useMemo, useEffect } from 'react';
import { Part } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { partsAPI } from '../services/api';
import Modal from '../components/Modal';
import ImportModal from '../components/ImportModal';

const PartsInventory: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [currentPart, setCurrentPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    stock: 0,
    price: 0,
    compatible_models: ''
  });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setIsLoading(true);
      const data = await partsAPI.getAll();
      setParts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parts');
      console.error('Parts error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (part?: Part) => {
    if (part) {
      setCurrentPart(part);
      setFormData({
        name: part.name,
        sku: part.sku,
        stock: part.stock,
        price: part.price,
        compatible_models: part.compatible_models?.join(', ') || ''
      });
    } else {
      setCurrentPart(null);
      setFormData({
        name: '',
        sku: '',
        stock: 0,
        price: 0,
        compatible_models: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPart(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const partData = {
        ...formData,
        compatible_models: formData.compatible_models.split(',').map(s => s.trim()).filter(s => s)
      };

      if (currentPart) {
        await partsAPI.update(currentPart.id, partData);
      } else {
        await partsAPI.create(partData);
      }
      fetchParts();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving part:', err);
      alert('Failed to save part');
    }
  };

  const handleImportParts = async (data: any[]) => {
    try {
      // Import all valid parts
      for (const partData of data) {
        await partsAPI.create(partData);
      }
      fetchParts();
      alert(t.importSuccess);
    } catch (err) {
      console.error('Error importing parts:', err);
      throw new Error(t.importError);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await partsAPI.delete(id);
        fetchParts();
      } catch (err) {
        console.error('Error deleting part:', err);
        alert('Failed to delete part');
      }
    }
  };

  const filteredParts = useMemo(() => {
    return parts.filter(part =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.compatible_models?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parts, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading parts</p>
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
            placeholder={t.searchPartsPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-dark-bg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            {t.importParts}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            {t.addNewPart}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-bg dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">{t.partName}</th>
              <th scope="col" className="px-6 py-3">{t.partCode}</th>
              <th scope="col" className="px-6 py-3">{t.compatibleModels}</th>
              <th scope="col" className="px-6 py-3 text-center">{t.stock}</th>
              <th scope="col" className="px-6 py-3 text-right">{t.price}</th>
              <th scope="col" className="px-6 py-3 text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.length > 0 ? (
              filteredParts.map(part => (
                <tr key={part.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-bg">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{part.name}</td>
                  <td className="px-6 py-4">{part.sku}</td>
                  <td className="px-6 py-4">{part.compatible_models?.join(', ')}</td>
                  <td className="px-6 py-4 text-center">{part.stock}</td>
                  <td className="px-6 py-4 text-right font-semibold">${part.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(part)}
                        className="font-medium text-primary dark:text-primary-light hover:underline"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(part.id)}
                        className="font-medium text-red-600 dark:text-red-400 hover:underline"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {t.noDataFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentPart ? t.editPart : t.addPart}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.partCode}</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.stockLabel}</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.priceLabel}</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.compatibleModels}</label>
            <input
              type="text"
              name="compatible_models"
              value={formData.compatible_models}
              onChange={handleInputChange}
              placeholder={t.compatibleModelsPlaceholder}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              {currentPart ? t.update : t.create}
            </button>
          </div>
        </form>
      </Modal>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportParts}
        type="parts"
      />
    </div>
  );
};

export default PartsInventory;