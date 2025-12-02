import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentDetails: { usd: number; ves: number; method: string; customerName?: string; isCredit?: boolean }) => void;
    totalUSD: number;
    rate: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, totalUSD, rate }) => {
    const { t } = useLanguage();
    const [amountUSD, setAmountUSD] = useState<string>('');
    const [amountVES, setAmountVES] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState('mixed');
    const [isCredit, setIsCredit] = useState(false);
    const [customerName, setCustomerName] = useState('');

    // Reset fields when modal opens
    useEffect(() => {
        if (isOpen) {
            setAmountUSD('');
            setAmountVES('');
            setPaymentMethod('mixed');
            setIsCredit(false);
            setCustomerName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const totalVES = totalUSD * rate;

    const paidUSD = parseFloat(amountUSD) || 0;
    const paidVES = parseFloat(amountVES) || 0;

    // Calculate value of VES payment in USD
    const paidVESinUSD = paidVES / rate;

    // Total paid in USD equivalent
    const totalPaidInUSD = paidUSD + paidVESinUSD;

    // Remaining amount
    const remainingUSD = totalUSD - totalPaidInUSD;
    const remainingVES = remainingUSD * rate;

    const isComplete = remainingUSD <= 0.01; // Tolerance for float errors
    const changeUSD = Math.abs(remainingUSD);
    const changeVES = Math.abs(remainingVES);

    const canConfirm = isComplete || (isCredit && customerName.trim().length > 0);

    const handleConfirm = () => {
        if (canConfirm) {
            onConfirm({
                usd: paidUSD,
                ves: paidVES,
                method: paymentMethod,
                customerName: customerName.trim() || "Cliente General",
                isCredit: isCredit && !isComplete // Only mark as credit if not fully paid
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Procesar Pago</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Totals Display */}
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="text-center w-1/2 border-r border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total USD</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">${totalUSD.toFixed(2)}</p>
                        </div>
                        <div className="text-center w-1/2">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total VES</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">Bs {totalVES.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Credit Toggle */}
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="credit-toggle"
                                checked={isCredit}
                                onChange={(e) => setIsCredit(e.target.checked)}
                                className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                            />
                            <label htmlFor="credit-toggle" className="font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none">
                                Venta a Crédito / Pago Parcial
                            </label>
                        </div>
                    </div>

                    {/* Customer Name Input (Required for Credit) */}
                    {(isCredit || customerName.length > 0) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre del Cliente {isCredit && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${isCredit && customerName.trim().length === 0 ? 'border-red-300 dark:border-red-700' : 'dark:border-gray-600'
                                    }`}
                                placeholder="Ej: Juan Perez"
                            />
                        </div>
                    )}

                    {/* Payment Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Pago en Dólares ($)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={amountUSD}
                                    onChange={(e) => setAmountUSD(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border rounded-xl bg-white dark:bg-dark-bg dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Pago en Bolívares (Bs)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Bs</span>
                                <input
                                    type="number"
                                    value={amountVES}
                                    onChange={(e) => setAmountVES(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-dark-bg dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Remaining / Change */}
                    <div className={`p-4 rounded-xl border ${isCredit && remainingUSD > 0.01
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : remainingUSD > 0.01
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                : 'bg-green-50 border-green-200 text-green-800'
                        }`}>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">
                                {remainingUSD > 0.01 ? (isCredit ? 'Saldo Pendiente (Crédito):' : 'Falta por pagar:') : 'Cambio / Vuelto:'}
                            </span>
                            <div className="text-right">
                                <p className="font-bold text-lg">
                                    ${remainingUSD > 0.01 ? remainingUSD.toFixed(2) : changeUSD.toFixed(2)}
                                </p>
                                <p className="text-sm opacity-80">
                                    Bs {remainingUSD > 0.01 ? remainingVES.toFixed(2) : changeVES.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${canConfirm
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-500/30'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {isCredit && !isComplete ? 'Confirmar Crédito' : isComplete ? 'Confirmar Venta' : 'Complete el Pago'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
