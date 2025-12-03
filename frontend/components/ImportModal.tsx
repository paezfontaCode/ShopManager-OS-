import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { useLanguage } from '../hooks/useLanguage';
import {
    parseCSV,
    readFileAsText,
    validateProductData,
    validatePartData,
    downloadTemplate,
    ParseResult
} from '../utils/csvParser';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => Promise<void>;
    type: 'products' | 'parts';
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, type }) => {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [parseResult, setParseResult] = useState<ParseResult | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (selectedFile: File) => {
        setError(null);
        setParseResult(null);

        // Validate file type
        const validExtensions = ['.csv', '.xlsx', '.xls'];
        const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            setError('Formato de archivo no soportado. Use CSV o Excel.');
            return;
        }

        setFile(selectedFile);

        try {
            // For now, we only support CSV. Excel support would require additional library
            if (fileExtension !== '.csv') {
                setError('Actualmente solo se soporta formato CSV. Para Excel, por favor conviértalo a CSV primero.');
                return;
            }

            const text = await readFileAsText(selectedFile);
            const rows = parseCSV(text);

            if (rows.length === 0) {
                setError('El archivo no contiene datos');
                return;
            }

            // Validate data based on type
            const result = type === 'products'
                ? validateProductData(rows)
                : validatePartData(rows);

            setParseResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
            console.error('Parse error:', err);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleDownloadTemplate = () => {
        const filename = type === 'products'
            ? 'plantilla_productos.csv'
            : 'plantilla_partes.csv';
        downloadTemplate(type, filename);
    };

    const handleImport = async () => {
        if (!parseResult || parseResult.validCount === 0) {
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Only import valid rows
            const validData = parseResult.data
                .filter(row => row.isValid)
                .map(row => row.data);

            await onImport(validData);

            // Reset and close
            setFile(null);
            setParseResult(null);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al importar datos');
            console.error('Import error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setParseResult(null);
        setError(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={type === 'products' ? t.importProducts : t.importParts}
        >
            <div className="space-y-4">
                {/* Download Template Button */}
                <div className="flex justify-between items-center pb-3 border-b dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ¿Primera vez? Descarga una plantilla para comenzar
                    </p>
                    <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="text-sm text-primary hover:text-primary-dark dark:text-primary-light font-medium flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t.downloadTemplate}
                    </button>
                </div>

                {/* File Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary-light transition"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {!file ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400 mb-1">{t.dragDropFile}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{t.supportedFormats}</p>
                        </>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Parse Result Summary */}
                {parseResult && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">{t.preview}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-blue-700 dark:text-blue-400">
                                    <span className="font-medium">{t.validRows}:</span> {parseResult.validCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-blue-700 dark:text-blue-400">
                                    <span className="font-medium">{t.invalidRows}:</span> {parseResult.invalidCount}
                                </p>
                            </div>
                        </div>

                        {/* Show invalid rows */}
                        {parseResult.invalidCount > 0 && (
                            <div className="mt-3 max-h-32 overflow-y-auto">
                                <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Errores encontrados:</p>
                                {parseResult.data
                                    .filter(row => !row.isValid)
                                    .slice(0, 5)
                                    .map((row, idx) => (
                                        <div key={idx} className="text-xs text-red-600 dark:text-red-400 mb-1">
                                            Fila {row.row}: {row.errors.join(', ')}
                                        </div>
                                    ))}
                                {parseResult.invalidCount > 5 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        ... y {parseResult.invalidCount - 5} errores más
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                    >
                        {t.cancel}
                    </button>
                    <button
                        type="button"
                        onClick={handleImport}
                        disabled={!parseResult || parseResult.validCount === 0 || isUploading}
                        className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.importing}
                            </>
                        ) : (
                            t.confirmImport
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ImportModal;
