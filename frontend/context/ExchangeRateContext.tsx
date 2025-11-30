import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ExchangeRateContextType {
    rate: number;
    setRate: (rate: number) => void;
    convert: (amountUSD: number) => number;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

export const ExchangeRateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default rate or load from localStorage
    const [rate, setRateState] = useState<number>(() => {
        const savedRate = localStorage.getItem('exchangeRate');
        return savedRate ? parseFloat(savedRate) : 45.50; // Default fallback
    });

    useEffect(() => {
        localStorage.setItem('exchangeRate', rate.toString());
    }, [rate]);

    const setRate = (newRate: number) => {
        setRateState(newRate);
    };

    const convert = (amountUSD: number) => {
        return amountUSD * rate;
    };

    return (
        <ExchangeRateContext.Provider value={{ rate, setRate, convert }}>
            {children}
        </ExchangeRateContext.Provider>
    );
};

export const useExchangeRate = (): ExchangeRateContextType => {
    const context = useContext(ExchangeRateContext);
    if (!context) {
        throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
    }
    return context;
};
