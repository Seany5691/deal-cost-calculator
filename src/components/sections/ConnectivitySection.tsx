import React from 'react';
import { useCalculatorStore } from '@/store/calculator';
import { ItemsTable } from '../tables/ItemsTable';

export function ConnectivitySection() {
  const { sections, updateQuantity } = useCalculatorStore();
  const connectivitySection = sections.find(s => s.id === 'connectivity');

  if (!connectivitySection) return null;

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity('connectivity', itemId, quantity);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black">Connectivity</h2>
      <ItemsTable 
        items={connectivitySection.items} 
        onQuantityChange={handleQuantityChange} 
        sectionId="connectivity"
      />
    </div>
  );
}
