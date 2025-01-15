import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { MinusCircle, PlusCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCalculatorStore } from '@/store/calculator';

interface Item {
  id: string;
  name: string;
  cost: number;
  quantity: number;
}

interface ItemsTableProps {
  items: Item[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  sectionId: string;
}

export function ItemsTable({ items, onQuantityChange, sectionId }: ItemsTableProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const { addSessionItem } = useCalculatorStore();

  const handleAddItem = () => {
    if (newItemName && newItemCost) {
      const cost = parseFloat(newItemCost);
      if (!isNaN(cost)) {
        addSessionItem(sectionId, newItemName, cost);
        setNewItemName('');
        setNewItemCost('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="relative overflow-x-auto hidden md:block">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Item</th>
              <th scope="col" className="px-6 py-3">Cost</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="bg-white border-b">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{formatCurrency(item.cost)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      className="btn-icon"
                      onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        onQuantityChange(item.id, Math.max(0, value));
                      }}
                      className="w-16 text-center border rounded px-2 py-1"
                    />
                    <Button
                      className="btn-icon"
                      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-6 py-4">{formatCurrency(item.cost * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="px-6 py-4 text-black">Total</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-right text-black">
                {formatCurrency(items.reduce((sum, item) => sum + item.cost * item.quantity, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <div className="font-semibold text-black">{item.name}</div>
            <div className="text-sm text-gray-600">Cost: {formatCurrency(item.cost)}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  className="btn-icon"
                  onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    onQuantityChange(item.id, Math.max(0, value));
                  }}
                  className="w-16 text-center border rounded px-2 py-1"
                />
                <Button
                  className="btn-icon"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm font-semibold text-black">
                Total: {formatCurrency(item.cost * item.quantity)}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center font-bold text-black">
            <span>Total</span>
            <span>{formatCurrency(items.reduce((sum, item) => sum + item.cost * item.quantity, 0))}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Input
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="w-full sm:flex-1"
        />
        <Input
          placeholder="Cost"
          type="number"
          value={newItemCost}
          onChange={(e) => setNewItemCost(e.target.value)}
          className="w-full sm:w-32"
        />
        <Button onClick={handleAddItem} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
}