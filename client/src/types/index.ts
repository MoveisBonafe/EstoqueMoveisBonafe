export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description: string;
  createdAt: string;
}

export type TabType = 'products' | 'orders' | 'suppliers' | 'outputs';

export interface StatsData {
  totalItems: number;
  categories: number;
  lowStock: number;
  totalValue: number;
}

export interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  activeTab: TabType;
  searchQuery: string;
  categoryFilter: string;
  addItem: (item: Omit<InventoryItem, 'createdAt'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  getFilteredItems: () => InventoryItem[];
  getStats: () => StatsData;
}

export interface ModalItem extends Omit<InventoryItem, 'id' | 'createdAt'> {
  id?: string;
}
