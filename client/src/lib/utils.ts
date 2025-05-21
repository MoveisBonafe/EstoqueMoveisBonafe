import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function calculateTotalValue(price: number, quantity: number): number {
  return price * quantity;
}

export const generateRandomId = (): string => {
  const prefix = 'P';
  const number = Math.floor(Math.random() * 10000).toString().padStart(3, '0');
  return `${prefix}${number}`;
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const getStatusBadgeInfo = (quantity: number, minStock: number) => {
  if (quantity <= 0) {
    return {
      label: "Sem estoque",
      className: "bg-red-100 text-red-800"
    };
  }
  
  if (quantity <= minStock) {
    return {
      label: "Estoque baixo",
      className: "bg-orange-100 text-orange-800"
    };
  }
  
  return {
    label: "Em estoque",
    className: "bg-green-100 text-green-800"
  };
};

export function normalizePrice(price: string): number {
  // Remove R$ and any non-numeric characters except dots and commas
  const normalized = price
    .replace(/[^\d.,]/g, '')
    .replace(',', '.');
  
  return Number(normalized);
}
