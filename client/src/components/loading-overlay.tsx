import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventory } from '@/contexts/inventory-context';

export default function LoadingOverlay() {
  const { loading } = useInventory();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Ensure the loading state doesn't disappear too quickly
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(true);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {localLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center transition-opacity duration-300"
        >
          <div className="text-center">
            <motion.div 
              className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-gray-700"
            >
              Carregando sistema...
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500"
            >
              Preparando seu controle de estoque
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
