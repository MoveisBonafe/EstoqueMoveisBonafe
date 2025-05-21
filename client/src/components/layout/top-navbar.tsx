import { useState, useEffect } from 'react';
import { useInventory } from '@/contexts/inventory-context';
import { debounce } from '@/lib/utils';

export default function TopNavbar() {
  const { setSearchQuery } = useInventory();
  const [searchValue, setSearchValue] = useState('');
  
  // Debounce search to avoid too many state updates
  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);
  
  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue]);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3">
          <span className="material-icons text-primary-600 text-3xl">inventory_2</span>
          <h1 className="text-xl font-bold text-gray-800">StockControl</h1>
        </div>
        
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-3 py-2 w-1/3 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:bg-white">
          <span className="material-icons text-gray-400 mr-2">search</span>
          <input 
            type="text" 
            placeholder="Pesquisar no estoque..." 
            className="bg-transparent border-none outline-none w-full text-gray-700"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        
        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-icons text-gray-600">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-icons text-gray-600">help_outline</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
              AG
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
