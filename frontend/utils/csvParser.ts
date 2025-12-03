/**
 * CSV/Excel Parser and Validator for Product and Part Data Import
 */

export interface ParsedRow {
    row: number;
    data: any;
    errors: string[];
    isValid: boolean;
}

export interface ParseResult {
    data: ParsedRow[];
    validCount: number;
    invalidCount: number;
    headers: string[];
}

/**
 * Normalize column names to handle different languages and variations
 */
const columnMappings: { [key: string]: string } = {
    // Product fields
    'nombre': 'name',
    'name': 'name',
    'producto': 'name',
    'product': 'name',

    'marca': 'brand',
    'brand': 'brand',

    'stock': 'stock',
    'cantidad': 'stock',
    'inventory': 'stock',

    'precio': 'price',
    'price': 'price',
    'cost': 'price',

    'url imagen': 'imageUrl',
    'image url': 'imageUrl',
    'imageurl': 'imageUrl',
    'imagen': 'imageUrl',
    'image': 'imageUrl',

    // Part fields
    'código': 'sku',
    'codigo': 'sku',
    'code': 'sku',
    'sku': 'sku',
    'código de parte': 'sku',
    'part code': 'sku',

    'modelos compatibles': 'compatible_models',
    'compatible models': 'compatible_models',
    'compatibilidad': 'compatible_models',
    'models': 'compatible_models',
};

/**
 * Normalize a header name
 */
function normalizeHeader(header: string): string {
    const normalized = header.toLowerCase().trim();
    return columnMappings[normalized] || normalized;
}

/**
 * Parse CSV text content
 */
/**
 * Parse CSV text content
 */
export function parseCSV(text: string): any[] {
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
        throw new Error('El archivo está vacío');
    }

    // Detect separator (comma or semicolon) based on the first line
    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const separator = semicolonCount > commaCount ? ';' : ',';

    const headers = parseCSVLine(lines[0], separator);
    const normalizedHeaders = headers.map(h => normalizeHeader(h));

    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i], separator);

        if (values.length === 0 || values.every(v => !v)) {
            continue; // Skip empty lines
        }

        const row: any = {};
        normalizedHeaders.forEach((header, index) => {
            row[header] = values[index]?.trim() || '';
        });

        rows.push(row);
    }

    return rows;
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string, separator: string = ','): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === separator && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsText(file);
    });
}

/**
 * Validate product data
 */
export function validateProductData(rows: any[]): ParseResult {
    const parsedRows: ParsedRow[] = [];
    let validCount = 0;
    let invalidCount = 0;

    rows.forEach((row, index) => {
        const errors: string[] = [];

        // Validate required fields
        if (!row.name || row.name.toString().trim() === '') {
            errors.push('Nombre requerido');
        }

        if (!row.brand || row.brand.toString().trim() === '') {
            errors.push('Marca requerida');
        }

        if (!row.stock && row.stock !== 0) {
            errors.push('Stock requerido');
        } else {
            const stockNum = parseFloat(row.stock);
            if (isNaN(stockNum) || stockNum < 0) {
                errors.push('Stock debe ser un número válido >= 0');
            }
        }

        if (!row.price && row.price !== 0) {
            errors.push('Precio requerido');
        } else {
            const priceNum = parseFloat(row.price);
            if (isNaN(priceNum) || priceNum < 0) {
                errors.push('Precio debe ser un número válido >= 0');
            }
        }

        const isValid = errors.length === 0;
        if (isValid) {
            validCount++;
        } else {
            invalidCount++;
        }

        parsedRows.push({
            row: index + 2, // +2 because of header row and 1-based indexing
            data: {
                name: row.name?.toString().trim() || '',
                brand: row.brand?.toString().trim() || '',
                stock: parseFloat(row.stock) || 0,
                price: parseFloat(row.price) || 0,
                imageUrl: row.imageUrl?.toString().trim() || ''
            },
            errors,
            isValid
        });
    });

    return {
        data: parsedRows,
        validCount,
        invalidCount,
        headers: ['name', 'brand', 'stock', 'price', 'imageUrl']
    };
}

/**
 * Validate part data
 */
export function validatePartData(rows: any[]): ParseResult {
    const parsedRows: ParsedRow[] = [];
    let validCount = 0;
    let invalidCount = 0;

    rows.forEach((row, index) => {
        const errors: string[] = [];

        // Validate required fields
        if (!row.name || row.name.toString().trim() === '') {
            errors.push('Nombre requerido');
        }

        if (!row.sku || row.sku.toString().trim() === '') {
            errors.push('Código requerido');
        }

        if (!row.stock && row.stock !== 0) {
            errors.push('Stock requerido');
        } else {
            const stockNum = parseFloat(row.stock);
            if (isNaN(stockNum) || stockNum < 0) {
                errors.push('Stock debe ser un número válido >= 0');
            }
        }

        if (!row.price && row.price !== 0) {
            errors.push('Precio requerido');
        } else {
            const priceNum = parseFloat(row.price);
            if (isNaN(priceNum) || priceNum < 0) {
                errors.push('Precio debe ser un número válido >= 0');
            }
        }

        const isValid = errors.length === 0;
        if (isValid) {
            validCount++;
        } else {
            invalidCount++;
        }

        // Parse compatible models
        let compatibleModels: string[] = [];
        if (row.compatible_models) {
            compatibleModels = row.compatible_models
                .toString()
                .split(',')
                .map((s: string) => s.trim())
                .filter((s: string) => s);
        }

        parsedRows.push({
            row: index + 2,
            data: {
                name: row.name?.toString().trim() || '',
                sku: row.sku?.toString().trim() || '',
                stock: parseFloat(row.stock) || 0,
                price: parseFloat(row.price) || 0,
                compatible_models: compatibleModels
            },
            errors,
            isValid
        });
    });

    return {
        data: parsedRows,
        validCount,
        invalidCount,
        headers: ['name', 'sku', 'stock', 'price', 'compatible_models']
    };
}

/**
 * Generate CSV template for products
 */
/**
 * Generate CSV template for products
 */
export function generateProductTemplate(): string {
    return 'Nombre;Marca;Stock;Precio;URL Imagen\niPhone 13 Pro;Apple;15;999.99;https://example.com/iphone13.jpg\nSamsung Galaxy S21;Samsung;20;799.99;\nXiaomi Redmi Note 10;Xiaomi;30;299.99;';
}

/**
 * Generate CSV template for parts
 */
export function generatePartTemplate(): string {
    return 'Nombre;Código;Stock;Precio;Modelos Compatibles\n"Pantalla LCD";SCR-IP13-BLK;25;89.99;"iPhone 13, iPhone 13 Pro"\nBatería;BAT-SAM-S21;15;45.50;Samsung Galaxy S21\n"Flex de Carga";FLX-XM-RN10;40;12.99;"Xiaomi Redmi Note 10, Redmi Note 10S"';
}

/**
 * Download a CSV template
 */
export function downloadTemplate(type: 'products' | 'parts', filename: string): void {
    const content = type === 'products'
        ? generateProductTemplate()
        : generatePartTemplate();

    // Add BOM (Byte Order Mark) for Excel to recognize UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
