import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventory } from "@/contexts/inventory-context";
import InventoryToolbar from "./inventory-toolbar";
import DataGrid from "./data-grid";
import ItemModal from "./item-modal";
import { TabType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusBadgeInfo } from "@/lib/utils";

// Componente de visualização em grade
const GridView = ({ onEditItem }: { onEditItem: (item: any) => void }) => {
  const { getFilteredItems, deleteItem } = useInventory();
  const items = getFilteredItems();
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      deleteItem(id);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-md mt-4">
        <div className="text-center p-6">
          <span className="material-icons text-4xl text-gray-400 mb-2">inventory_2</span>
          <h3 className="text-lg font-medium text-gray-900">Nenhum item encontrado</h3>
          <p className="text-gray-500 mt-1">Adicione itens ao seu estoque para visualizá-los aqui.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 overflow-auto">
      {items.map(item => {
        const statusBadge = getStatusBadgeInfo(item.quantity, item.minStock);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <Card className="flex flex-col h-full">
              <CardContent className="p-4 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-primary-50 text-primary-700 font-mono rounded-md px-2 py-1 text-xs">
                      {item.id}
                    </div>
                    <Badge className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1 leading-tight">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{item.category}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 text-sm font-medium">Quantidade:</span>
                    <span className="text-gray-900 font-mono">{item.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700 text-sm font-medium">Preço:</span>
                    <span className="text-gray-900 font-medium font-mono">{formatCurrency(item.price)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto border-t pt-3">
                  <span className="text-gray-700 text-sm font-medium">Total:</span>
                  <span className="text-primary-700 font-bold font-mono">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
                
                <div className="flex justify-end space-x-2 mt-3 border-t pt-3">
                  <button
                    onClick={() => onEditItem(item)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-700 transition-colors"
                  >
                    <span className="material-icons text-base">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-700 transition-colors"
                  >
                    <span className="material-icons text-base">delete</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function InventoryTabs() {
  const { activeTab, setActiveTab, getFilteredItems } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editModalItem, setEditModalItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'products', label: 'Produtos', icon: 'inventory' },
    { id: 'orders', label: 'Compras', icon: 'shopping_cart' },
    { id: 'suppliers', label: 'Fornecedores', icon: 'local_shipping' },
    { id: 'outputs', label: 'Saídas', icon: 'logout' }
  ];

  return (
    <div className="px-4 sm:px-6 py-4 flex-1 flex flex-col overflow-hidden">
      {/* Tab Controls */}
      <div className="border-b border-gray-200 flex items-center">
        <div className="flex space-x-1 overflow-x-auto pb-1 flex-grow">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center ${
                activeTab === tab.id
                  ? 'text-primary-700 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="material-icons text-sm mr-1">{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
        <button 
          className="ml-2 p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="material-icons">add</span>
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <InventoryToolbar 
            onAddItem={() => setIsAddModalOpen(true)} 
            onViewModeChange={(mode) => setViewMode(mode)}
          />
          
          {activeTab === 'products' && (
            <>
              {viewMode === "list" ? (
                <DataGrid />
              ) : (
                <GridView 
                  onEditItem={(item) => {
                    setEditModalItem(item);
                    setIsEditModalOpen(true);
                  }}
                />
              )}
            </>
          )}
          
          {activeTab === 'suppliers' && (
            <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-md">
              <div className="text-center p-6">
                <span className="material-icons text-4xl text-gray-400 mb-2">local_shipping</span>
                <h3 className="text-lg font-medium text-gray-900">Fornecedores</h3>
                <p className="text-gray-500 mt-1">Este módulo está em desenvolvimento.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-md">
              <div className="text-center p-6">
                <span className="material-icons text-4xl text-gray-400 mb-2">shopping_cart</span>
                <h3 className="text-lg font-medium text-gray-900">Compras</h3>
                <p className="text-gray-500 mt-1">Este módulo está em desenvolvimento.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'outputs' && (
            <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-md">
              <div className="text-center p-6">
                <span className="material-icons text-4xl text-gray-400 mb-2">logout</span>
                <h3 className="text-lg font-medium text-gray-900">Saídas</h3>
                <p className="text-gray-500 mt-1">Este módulo está em desenvolvimento.</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add/Edit Item Modal */}
      <ItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="add"
      />
      
      {/* Edit Modal */}
      {editModalItem && (
        <ItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={editModalItem}
        />
      )}
    </div>
  );
}
