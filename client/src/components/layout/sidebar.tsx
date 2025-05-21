import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/use-mobile';
import { useInventory } from '@/contexts/inventory-context';

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const isMobile = useMobile();
  const { getStats } = useInventory();

  const stats = getStats();
  const storageUsagePercentage = Math.min(70, Math.max(10, (stats.totalItems / 20) * 100));

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: 'dashboard', 
      path: '/', 
      isActive: location === '/' 
    },
    { 
      name: 'Estoque', 
      icon: 'inventory', 
      path: '/inventory', 
      isActive: location === '/inventory' 
    },
    { 
      name: 'Fornecedores', 
      icon: 'local_shipping', 
      path: '/suppliers', 
      isActive: location === '/suppliers' 
    },
    { 
      name: 'Compras', 
      icon: 'shopping_cart', 
      path: '/orders', 
      isActive: location === '/orders' 
    },
    { 
      name: 'Saídas', 
      icon: 'logout', 
      path: '/outputs', 
      isActive: location === '/outputs' 
    },
  ];

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out">
      {/* Collapsed Sidebar (Mobile) */}
      {isMobile && (
        <div className="md:hidden flex flex-col items-center py-4 space-y-6">
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`p-2 rounded-md ${item.isActive ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <span className="material-icons">{item.icon}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Expanded Sidebar (Desktop) */}
      {!isMobile && (
        <div className="hidden md:flex flex-col flex-1">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
              >
                <a className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                  item.isActive 
                    ? 'bg-primary-50 text-primary-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}>
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Storage Usage */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Armazenamento local</span>
              <span className="text-xs text-gray-500">{storageUsagePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${storageUsagePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Usando armazenamento do navegador
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
