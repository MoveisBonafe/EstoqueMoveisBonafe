import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { calculateTotalValue } from '@/lib/utils';
import { InventoryItem, InventoryContextType, TabType, StatsData } from '@/types';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<InventoryItem[]>('inventoryItems', []);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const { toast } = useToast();

  // Initial sample data loading simulation
  useEffect(() => {
    // Only load initial data if there are no items in localStorage
    if (items.length === 0) {
      setLoading(true);
      
      // Simulate delay to show loading state
      const timer = setTimeout(() => {
        const initialItems: InventoryItem[] = [
          {
            id: 'P001',
            name: 'Notebook Dell XPS 15',
            category: 'Eletrônicos',
            quantity: 23,
            price: 7899.00,
            minStock: 5,
            description: 'Notebook high-end para trabalhos profissionais.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'P002',
            name: 'Monitor LG Ultrawide 34"',
            category: 'Eletrônicos',
            quantity: 15,
            price: 2499.00,
            minStock: 3,
            description: 'Monitor ultrawide para maior produtividade.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'P003',
            name: 'Mesa de Escritório Ergonômica',
            category: 'Móveis',
            quantity: 8,
            price: 1299.00,
            minStock: 2,
            description: 'Mesa de escritório com ajuste de altura.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'P004',
            name: 'Cadeira de Escritório Giratória',
            category: 'Móveis',
            quantity: 12,
            price: 849.00,
            minStock: 3,
            description: 'Cadeira ergonômica com suporte lombar.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'P005',
            name: 'Teclado Mecânico Logitech',
            category: 'Eletrônicos',
            quantity: 5,
            price: 549.00,
            minStock: 5,
            description: 'Teclado mecânico com RGB.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'P006',
            name: 'Mouse sem fio MX Master',
            category: 'Eletrônicos',
            quantity: 0,
            price: 399.00,
            minStock: 5,
            description: 'Mouse sem fio de alta precisão.',
            createdAt: new Date().toISOString(),
          }
        ];
        
        setItems(initialItems);
        setLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      // If there are already items in localStorage, just set loading to false
      setLoading(false);
    }
  }, [setItems, items.length]);

  const addItem = (item: Omit<InventoryItem, 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      createdAt: new Date().toISOString()
    };
    
    setItems((prev) => [...prev, newItem]);
    toast({
      title: "Item adicionado",
      description: `${item.name} foi adicionado ao estoque.`,
    });
  };

  const updateItem = (id: string, updatedFields: Partial<InventoryItem>) => {
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    );
    toast({
      title: "Item atualizado",
      description: "O item foi atualizado com sucesso.",
    });
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    
    if (itemToDelete) {
      toast({
        title: "Item removido",
        description: `${itemToDelete.name} foi removido do estoque.`,
      });
    }
  };

  const getFilteredItems = () => {
    return items.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === '' || 
        item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getStats = (): StatsData => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const uniqueCategories = new Set(items.map(item => item.category)).size;
    
    const lowStockItems = items.filter(
      item => item.quantity > 0 && item.quantity <= item.minStock
    ).length;
    
    const totalValue = items.reduce(
      (acc, item) => acc + calculateTotalValue(item.price, item.quantity), 
      0
    );
    
    return {
      totalItems,
      categories: uniqueCategories,
      lowStock: lowStockItems,
      totalValue
    };
  };

  const value: InventoryContextType = {
    items,
    loading,
    activeTab,
    searchQuery,
    categoryFilter,
    addItem,
    updateItem,
    deleteItem,
    setActiveTab,
    setSearchQuery,
    setCategoryFilter,
    getFilteredItems,
    getStats
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
