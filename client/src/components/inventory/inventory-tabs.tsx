import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventory } from "@/contexts/inventory-context";
import InventoryToolbar from "./inventory-toolbar";
import DataGrid from "./data-grid";
import ItemModal from "./item-modal";
import { TabType } from "@/types";

export default function InventoryTabs() {
  const { activeTab, setActiveTab } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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
          <InventoryToolbar onAddItem={() => setIsAddModalOpen(true)} />
          
          {activeTab === 'products' && <DataGrid />}
          
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
    </div>
  );
}
