import React from 'react';
import { useCalculatorStore } from '@/store/calculator';
import { ItemsTable } from '../tables/ItemsTable';

export function HardwareSection() {
  const { sections, updateQuantity } = useCalculatorStore();
  const hardwareSection = sections.find(s => s.id === 'hardware');

  if (!hardwareSection) return null;

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity('hardware', itemId, quantity);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black">Hardware</h2>
      <ItemsTable 
        items={hardwareSection.items} 
        onQuantityChange={handleQuantityChange} 
        sectionId="hardware"
      />
    </div>
  );
}
