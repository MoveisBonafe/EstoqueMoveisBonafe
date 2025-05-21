import { useState } from 'react';
import { useInventory } from '@/contexts/inventory-context';
import { InventoryItem } from '@/types';
import { formatCurrency, calculateTotalValue, getStatusBadgeInfo } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import ItemModal from './item-modal';

type SortField = 'id' | 'name' | 'category' | 'quantity' | 'price' | 'total';
type SortDirection = 'asc' | 'desc';

export default function DataGrid() {
  const { getFilteredItems, updateItem, deleteItem } = useInventory();
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editModalItem, setEditModalItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const items = getFilteredItems();
  
  // Sorting function
  const sortedItems = [...items].sort((a, b) => {
    if (sortField === 'total') {
      const totalA = calculateTotalValue(a.price, a.quantity);
      const totalB = calculateTotalValue(b.price, b.quantity);
      return sortDirection === 'asc' ? totalA - totalB : totalB - totalA;
    }
    
    if (typeof a[sortField] === 'string') {
      return sortDirection === 'asc' 
        ? (a[sortField] as string).localeCompare(b[sortField] as string)
        : (b[sortField] as string).localeCompare(a[sortField] as string);
    }
    
    return sortDirection === 'asc' 
      ? Number(a[sortField]) - Number(b[sortField])
      : Number(b[sortField]) - Number(a[sortField]);
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleCellFocus = (item: InventoryItem, field: keyof InventoryItem) => {
    setEditingCell({ id: item.id, field });
  };

  const handleCellBlur = (item: InventoryItem, field: keyof InventoryItem, value: string) => {
    setEditingCell(null);
    
    // Only update if the value has changed
    if (String(item[field]) !== value) {
      let updatedValue: string | number = value;
      
      // Convert to number for numeric fields
      if (field === 'quantity' || field === 'price' || field === 'minStock') {
        updatedValue = Number(value);
      }
      
      updateItem(item.id, { [field]: updatedValue });
    }
  };

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    item: InventoryItem,
    field: keyof InventoryItem,
    rowIndex: number,
    cellIndex: number
  ) => {
    // Enter or Tab key submits the edit
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLDivElement;
      target.blur();
      
      // Move to next cell or row
      const allCells = document.querySelectorAll('.grid-cell[tabindex="0"]');
      const nextIndex = e.key === 'Enter' 
        ? (rowIndex + 1) * 5 + cellIndex 
        : rowIndex * 5 + cellIndex + 1;
      
      if (nextIndex < allCells.length) {
        (allCells[nextIndex] as HTMLElement).focus();
      }
    }
    
    // Escape key cancels the edit
    if (e.key === 'Escape') {
      e.preventDefault();
      const target = e.target as HTMLDivElement;
      target.textContent = String(item[field]);
      target.blur();
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      deleteItem(id);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditModalItem(item);
    setIsEditModalOpen(true);
  };

  const editableFields = ['id', 'name', 'category', 'quantity', 'price'];

  return (
    <>
      <div className="flex-1 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left w-12">
                  <Checkbox 
                    checked={selectedItems.length === items.length && items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <button 
                    className="flex items-center space-x-1 font-medium text-sm text-gray-600"
                    onClick={() => handleSort('id')}
                  >
                    <span>ID</span>
                    <span className="material-icons text-sm text-gray-400 hover:text-gray-600">
                      {sortField === 'id' ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="p-3 text-left min-w-[200px] border-r border-gray-200">
                  <button 
                    className="flex items-center space-x-1 font-medium text-sm text-gray-600"
                    onClick={() => handleSort('name')}
                  >
                    <span>Produto</span>
                    <span className="material-icons text-sm text-gray-400 hover:text-gray-600">
                      {sortField === 'name' ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <button 
                    className="flex items-center space-x-1 font-medium text-sm text-gray-600"
                    onClick={() => handleSort('category')}
                  >
                    <span>Categoria</span>
                    <span className="material-icons text-sm text-gray-400 hover:text-gray-600">
                      {sortField === 'category' ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <button 
                    className="flex items-center space-x-1 font-medium text-sm text-gray-600"
                    onClick={() => handleSort('quantity')}
                  >
                    <span>Quantidade</span>
                    <span className="material-icons text-sm text-gray-400 hover:text-gray-600">
                      {sortField === 'quantity' ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <button 
                    className="flex items-center space-x-1 font-medium text-sm text-gray-600"
                    onClick={() => handleSort('price')}
                  >
                    <span>Preço</span>
                    <span className="material-icons text-sm text-gray-400 hover:text-gray-600">
                      {sortField === 'price' ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <button 
                    className="flex items-center space-x-1 font-medium text-sm text-gray-600"
                    onClick={() => handleSort('total')}
                  >
                    <span>Valor Total</span>
                    <span className="material-icons text-sm text-gray-400 hover:text-gray-600">
                      {sortField === 'total' ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <div className="flex items-center space-x-1 font-medium text-sm text-gray-600">
                    <span>Status</span>
                  </div>
                </th>
                <th className="p-3 text-left min-w-[100px]">
                  <div className="flex items-center space-x-1 font-medium text-sm text-gray-600">
                    <span>Ações</span>
                  </div>
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white">
              <AnimatePresence>
                {sortedItems.map((item, rowIndex) => {
                  const isSelected = selectedItems.includes(item.id);
                  const totalValue = calculateTotalValue(item.price, item.quantity);
                  const statusBadge = getStatusBadgeInfo(item.quantity, item.minStock);

                  return (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="p-3">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                        />
                      </td>
                      
                      {/* Editable cells */}
                      {editableFields.map((field, cellIndex) => (
                        <td key={field} className="p-3 border-r border-gray-200 font-mono text-sm text-gray-700 cell-editable">
                          <div 
                            className={`grid-cell ${editingCell?.id === item.id && editingCell?.field === field ? 'cell-selected' : ''}`} 
                            tabIndex={0}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onFocus={() => handleCellFocus(item, field as keyof InventoryItem)}
                            onBlur={(e) => handleCellBlur(item, field as keyof InventoryItem, e.currentTarget.textContent || '')}
                            onKeyDown={(e) => handleCellKeyDown(e, item, field as keyof InventoryItem, rowIndex, cellIndex)}
                          >
                            {field === 'price' 
                              ? formatCurrency(item[field] as number).replace('R$', '').trim() 
                              : String(item[field])}
                          </div>
                        </td>
                      ))}
                      
                      {/* Calculated Total Value */}
                      <td className="p-3 border-r border-gray-200 font-mono text-sm font-medium text-gray-800">
                        {formatCurrency(totalValue)}
                      </td>
                      
                      {/* Status Badge */}
                      <td className="p-3 border-r border-gray-200">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-gray-500 hover:text-primary-600"
                            onClick={() => handleEditItem(item)}
                          >
                            <span className="material-icons text-sm">edit</span>
                          </button>
                          <button 
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <span className="material-icons text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                
                {sortedItems.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="material-icons mb-2 text-3xl">inventory_2</span>
                        <p>Nenhum item encontrado</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="pt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <span>Mostrando</span>
          <span className="font-medium mx-1">1</span>
          <span>até</span>
          <span className="font-medium mx-1">{Math.min(sortedItems.length, 10)}</span>
          <span>de</span>
          <span className="font-medium mx-1">{sortedItems.length}</span>
          <span>resultados</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
            <span className="material-icons text-sm">chevron_left</span>
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-primary-50 text-primary-700">1</button>
          {sortedItems.length > 10 && (
            <>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
              {sortedItems.length > 30 && <span className="text-gray-500">...</span>}
              {sortedItems.length > 30 && (
                <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  {Math.ceil(sortedItems.length / 10)}
                </button>
              )}
            </>
          )}
          <button 
            className={`px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 ${sortedItems.length <= 10 ? 'disabled:opacity-50' : ''}`}
            disabled={sortedItems.length <= 10}
          >
            <span className="material-icons text-sm">chevron_right</span>
          </button>
        </div>
      </div>
      
      {/* Edit Item Modal */}
      {editModalItem && (
        <ItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={editModalItem}
        />
      )}
    </>
  );
}
