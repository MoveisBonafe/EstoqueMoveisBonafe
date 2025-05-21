import { useInventory } from "@/contexts/inventory-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

interface InventoryToolbarProps {
  onAddItem: () => void;
}

export default function InventoryToolbar({ onAddItem }: InventoryToolbarProps) {
  const { setCategoryFilter, categoryFilter } = useInventory();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <div className="py-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <Button 
          className="bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-1"
          onClick={onAddItem}
        >
          <span className="material-icons text-sm">add</span>
          Novo Item
        </Button>
        
        <Button variant="outline" className="flex items-center gap-1">
          <span className="material-icons text-sm">file_download</span>
          Exportar
        </Button>
        
        <Button variant="outline" className="flex items-center gap-1">
          <span className="material-icons text-sm">file_upload</span>
          Importar
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select 
            className="bg-white border border-gray-300 rounded-md pl-8 pr-4 py-2 appearance-none text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="">Todas as categorias</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Móveis">Móveis</option>
            <option value="Material de Escritório">Material de Escritório</option>
          </select>
          <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">filter_list</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2">
          <motion.button 
            className={`p-2 border border-gray-300 rounded-md ${viewMode === 'grid' ? 'bg-primary-50 text-primary-700' : 'bg-white hover:bg-gray-50'} transition-colors`}
            onClick={() => setViewMode("grid")}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-icons text-current">grid_view</span>
          </motion.button>
          
          <motion.button 
            className={`p-2 border border-gray-300 rounded-md ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'bg-white hover:bg-gray-50'} transition-colors`}
            onClick={() => setViewMode("list")}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-icons text-current">view_list</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
