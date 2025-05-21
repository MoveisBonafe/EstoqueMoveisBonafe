import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Verificação inicial
    checkMobile();
    
    // Adicionar event listener para redimensionamento
    window.addEventListener('resize', checkMobile);
    
    // Limpar event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}