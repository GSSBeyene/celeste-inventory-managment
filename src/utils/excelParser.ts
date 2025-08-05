import * as XLSX from 'xlsx';

export interface ExcelInventoryItem {
  name: string;
  itemCode: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  location: string;
  unitCost?: number;
  supplier?: string;
  description?: string;
}

export const parseExcelFile = (file: File): Promise<ExcelInventoryItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and parse data
        const items: ExcelInventoryItem[] = [];
        const headers = jsonData[0] as string[];
        
        // Find column indices
        const getColumnIndex = (header: string) => {
          const normalizedHeaders = headers.map(h => String(h).toLowerCase().trim());
          const variations = {
            name: ['name', 'item name', 'item_name', 'product name'],
            itemCode: ['item code', 'itemcode', 'item_code', 'code', 'sku'],
            category: ['category', 'type', 'class'],
            currentStock: ['current stock', 'currentstock', 'current_stock', 'stock', 'quantity'],
            minStock: ['min stock', 'minstock', 'min_stock', 'minimum stock', 'reorder level'],
            unit: ['unit', 'uom', 'unit of measure'],
            location: ['location', 'storage location', 'warehouse'],
            unitCost: ['unit cost', 'unitcost', 'unit_cost', 'cost', 'price'],
            supplier: ['supplier', 'vendor', 'manufacturer'],
            description: ['description', 'notes', 'details']
          };
          
          const targetVariations = variations[header as keyof typeof variations] || [header];
          return normalizedHeaders.findIndex(h => 
            targetVariations.some(v => h.includes(v.toLowerCase()))
          );
        };
        
        const columnIndices = {
          name: getColumnIndex('name'),
          itemCode: getColumnIndex('itemCode'),
          category: getColumnIndex('category'),
          currentStock: getColumnIndex('currentStock'),
          minStock: getColumnIndex('minStock'),
          unit: getColumnIndex('unit'),
          location: getColumnIndex('location'),
          unitCost: getColumnIndex('unitCost'),
          supplier: getColumnIndex('supplier'),
          description: getColumnIndex('description')
        };
        
        // Parse data rows
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.length === 0) continue;
          
          const item: ExcelInventoryItem = {
            name: String(row[columnIndices.name] || '').trim(),
            itemCode: String(row[columnIndices.itemCode] || '').trim(),
            category: String(row[columnIndices.category] || 'general').toLowerCase(),
            currentStock: Number(row[columnIndices.currentStock]) || 0,
            minStock: Number(row[columnIndices.minStock]) || 0,
            unit: String(row[columnIndices.unit] || 'pieces').toLowerCase(),
            location: String(row[columnIndices.location] || '').trim(),
            unitCost: columnIndices.unitCost >= 0 ? Number(row[columnIndices.unitCost]) || 0 : undefined,
            supplier: columnIndices.supplier >= 0 ? String(row[columnIndices.supplier] || '').trim() : undefined,
            description: columnIndices.description >= 0 ? String(row[columnIndices.description] || '').trim() : undefined
          };
          
          // Validate required fields
          if (item.name && item.itemCode) {
            // Normalize category to match system categories
            const categoryMap: { [key: string]: string } = {
              'room': 'rooms',
              'rooms': 'rooms',
              'room amenities': 'rooms',
              'housekeeping': 'housekeeping',
              'cleaning': 'housekeeping',
              'minibar': 'minibar',
              'f&b': 'minibar',
              'food': 'minibar',
              'beverage': 'minibar',
              'maintenance': 'maintenance',
              'repair': 'maintenance',
              'general': 'rooms'
            };
            
            item.category = categoryMap[item.category] || 'rooms';
            items.push(item);
          }
        }
        
        resolve(items);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

export const generateExcelTemplate = (): void => {
  const templateData = [
    ['Name', 'Item Code', 'Category', 'Current Stock', 'Min Stock', 'Unit', 'Location', 'Unit Cost', 'Supplier', 'Description'],
    ['Premium Bath Towels', 'BTW-001', 'rooms', 50, 10, 'pieces', 'Linen Room A', 25.00, 'Hotel Supplies Co', 'High quality cotton towels'],
    ['All-Purpose Cleaner', 'CLE-002', 'housekeeping', 30, 5, 'bottles', 'Cleaning Storage', 12.50, 'CleanCo', 'Multi-surface cleaner'],
    ['Coffee Pods', 'COF-003', 'minibar', 100, 20, 'pods', 'Minibar Storage', 0.75, 'Coffee Plus', 'Premium blend coffee pods']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory Template');
  
  // Download the template
  XLSX.writeFile(wb, 'inventory_template.xlsx');
};