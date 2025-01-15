import React from 'react';
import { useCalculatorStore } from '@/store/calculator';
import { ItemsTable } from '@/components/tables/ItemsTable';
import { AddItemDialog } from '@/components/dialogs/AddItemDialog';
import type { Section } from '@/types/calculator';

interface ItemsSectionProps {
  section: Section;
}

export function ItemsSection({ section }: ItemsSectionProps) {
  const { updateQuantity } = useCalculatorStore();

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity(section.id, itemId, quantity);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">{section.name}</h2>
        <AddItemDialog sectionId={section.id} />
      </div>
      <ItemsTable items={section.items} onQuantityChange={handleQuantityChange} />
    </div>
  );
}