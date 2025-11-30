import React, { useState, useEffect } from 'react';
import { useExchangeRate } from '../context/ExchangeRateContext';

const ExchangeRateSelector: React.FC = () => {
    const { rate, setRate } = useExchangeRate();
    const [isEditing, setIsEditing] = useState(false);
    const [tempRate, setTempRate] = useState(rate.toString());

    useEffect(() => {
        setTempRate(rate.toString());
    }, [rate]);

    const handleSave = () => {
        const newRate = parseFloat(tempRate);
        if (!isNaN(newRate) && newRate > 0) {
            setRate(newRate);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div className="flex items-center bg-white dark:bg-dark-card rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Tasa BCV:</span>
            {isEditing ? (
                <div className="flex items-center">
                    <input
                        type="number"
                        value={tempRate}
                        onChange={(e) => setTempRate(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-20 px-2 py-0.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-bg dark:text-white dark:border-gray-600"
                    />
                    <button onClick={handleSave} className="ml-1 text-green-500 hover:text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div
                    className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 py-0.5 rounded transition-colors"
                    onClick={() => setIsEditing(true)}
                    title="Click para editar tasa"
                >
                    <span className="font-bold text-gray-800 dark:text-white mr-1">{rate.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">Bs/$</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ExchangeRateSelector;
