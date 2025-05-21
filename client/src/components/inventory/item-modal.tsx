import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/contexts/inventory-context';
import { normalizePrice, generateRandomId } from '@/lib/utils';
import { InventoryItem, ModalItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: InventoryItem;
}

const defaultItem: ModalItem = {
  name: '',
  category: '',
  quantity: 0,
  price: 0,
  minStock: 0,
  description: ''
};

export default function ItemModal({ isOpen, onClose, mode = 'add', initialData }: ItemModalProps) {
  const [formData, setFormData] = useState<ModalItem>(defaultItem);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { addItem, updateItem } = useInventory();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          id: initialData.id,
          name: initialData.name,
          category: initialData.category,
          quantity: initialData.quantity,
          price: initialData.price,
          minStock: initialData.minStock,
          description: initialData.description
        });
      } else {
        setFormData({
          ...defaultItem,
          id: generateRandomId()
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'itemPrice') {
      // Format price input to allow only numeric and decimal values
      const sanitizedValue = value.replace(/[^\d.,]/g, '');
      setFormData(prev => ({
        ...prev,
        price: sanitizedValue === '' ? 0 : normalizePrice(sanitizedValue)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id.replace('item', '').toLowerCase()]: 
          (id === 'itemQuantity' || id === 'itemMinStock') 
            ? parseInt(value) || 0 
            : value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    
    if (errors.itemCategory) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.itemCategory;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.id) {
      newErrors.itemId = 'ID é obrigatório';
    }
    
    if (!formData.name) {
      newErrors.itemName = 'Nome do produto é obrigatório';
    }
    
    if (!formData.category) {
      newErrors.itemCategory = 'Categoria é obrigatória';
    }
    
    if (formData.quantity < 0) {
      newErrors.itemQuantity = 'Quantidade deve ser no mínimo 0';
    }
    
    if (formData.price <= 0) {
      newErrors.itemPrice = 'Preço deve ser maior que 0';
    }
    
    if (formData.minStock < 0) {
      newErrors.itemMinStock = 'Estoque mínimo deve ser no mínimo 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (mode === 'add') {
      addItem({
        id: formData.id!,
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        price: formData.price,
        minStock: formData.minStock,
        description: formData.description
      });
    } else if (mode === 'edit' && initialData) {
      updateItem(initialData.id, {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        price: formData.price,
        minStock: formData.minStock,
        description: formData.description
      });
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>
                {mode === 'add' ? 'Adicionar Novo Item' : 'Editar Item'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ID Field */}
              <div className="space-y-2">
                <Label htmlFor="itemId">Código do Item</Label>
                <Input
                  id="itemId"
                  value={formData.id || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: P007"
                  disabled={mode === 'edit'}
                  className={errors.itemId ? 'border-red-500' : ''}
                />
                {errors.itemId && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.itemId}
                  </motion.p>
                )}
              </div>
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="itemName">Nome do Produto</Label>
                <Input
                  id="itemName"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Monitor 24 polegadas"
                  className={errors.itemName ? 'border-red-500' : ''}
                />
                {errors.itemName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.itemName}
                  </motion.p>
                )}
              </div>
              
              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="itemCategory">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="itemCategory" className={errors.itemCategory ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                    <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                  </SelectContent>
                </Select>
                {errors.itemCategory && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.itemCategory}
                  </motion.p>
                )}
              </div>
              
              {/* Quantity Field */}
              <div className="space-y-2">
                <Label htmlFor="itemQuantity">Quantidade</Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Ex: 10"
                  className={errors.itemQuantity ? 'border-red-500' : ''}
                />
                {errors.itemQuantity && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.itemQuantity}
                  </motion.p>
                )}
              </div>
              
              {/* Price Field */}
              <div className="space-y-2">
                <Label htmlFor="itemPrice">Preço Unitário (R$)</Label>
                <Input
                  id="itemPrice"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ex: 1299.90"
                  className={errors.itemPrice ? 'border-red-500' : ''}
                />
                {errors.itemPrice && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.itemPrice}
                  </motion.p>
                )}
              </div>
              
              {/* Min Stock Alert */}
              <div className="space-y-2">
                <Label htmlFor="itemMinStock">Estoque Mínimo</Label>
                <Input
                  id="itemMinStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  placeholder="Ex: 5"
                  className={errors.itemMinStock ? 'border-red-500' : ''}
                />
                {errors.itemMinStock && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.itemMinStock}
                  </motion.p>
                )}
              </div>
              
              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="itemDescription">Descrição</Label>
                <Textarea
                  id="itemDescription"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrição detalhada do produto..."
                  rows={3}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {mode === 'add' ? 'Adicionar' : 'Atualizar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
