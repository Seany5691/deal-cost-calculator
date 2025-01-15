import { useCalculatorStore } from '@/store/calculator';
import { ItemsTable } from '../tables/ItemsTable';

export function LicensingSection() {
  const { sections, updateQuantity } = useCalculatorStore();
  const licensingSection = sections.find(s => s.id === 'licensing');

  if (!licensingSection) return null;

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity('licensing', itemId, quantity);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black">Licensing</h2>
      <ItemsTable 
        items={licensingSection.items} 
        onQuantityChange={handleQuantityChange} 
        sectionId="licensing"
      />
    </div>
  );
}
