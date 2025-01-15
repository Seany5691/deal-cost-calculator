import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculator';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_URL } from '@/config';

const LOCKED_HARDWARE_ITEMS = ['switchboard', 'desktop-phone', 'cordless-phone', 'mobile-apps'];

interface ItemsTabProps {
  onSave?: () => Promise<void>;
}

export function ItemsTab({ onSave }: ItemsTabProps) {
  const { sections, setSections } = useCalculatorStore();
  const { toast } = useToast();
  const [newItems, setNewItems] = useState<{ [key: string]: { name: string; cost: string } }>({
    hardware: { name: '', cost: '' },
    connectivity: { name: '', cost: '' },
    licensing: { name: '', cost: '' },
  });

  const handleItemChange = (sectionId: string, itemId: string, field: 'name' | 'cost', value: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                [field]: field === 'cost' ? parseFloat(value) || 0 : value,
              };
            }
            return item;
          }),
        };
      }
      return section;
    });
    setSections(updatedSections);
    
    // Auto-save changes
    saveChanges(updatedSections);
    
    // Call parent's onSave if provided
    if (onSave) {
      try {
        onSave();
      } catch (error) {
        console.error('Failed to save changes:', error);
      }
    }
  };

  const saveChanges = async (sectionsToSave = sections) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ sections: sectionsToSave }),
      });

      if (!response.ok) {
        throw new Error('Failed to save items');
      }

      toast({
        description: 'Changes saved successfully',
      });
    } catch (error) {
      console.error('Error saving items:', error);
      toast({
        description: 'Failed to save changes',
        variant: 'destructive',
      });
    }
  };

  const handleAddItem = async (sectionId: string) => {
    const newItem = newItems[sectionId];
    if (!newItem.name.trim() || !newItem.cost) {
      toast({
        description: "Please provide both name and cost for the new item",
        variant: "destructive",
      });
      return;
    }

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [
            ...section.items,
            {
              id: newItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              name: newItem.name.trim(),
              cost: parseFloat(newItem.cost),
              quantity: 0,
              locked: sectionId === 'hardware' && LOCKED_HARDWARE_ITEMS.includes(newItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
            },
          ],
        };
      }
      return section;
    });

    // Update state and save to backend
    setSections(updatedSections);
    await saveChanges(updatedSections);

    // Clear the input fields
    setNewItems(prev => ({
      ...prev,
      [sectionId]: { name: '', cost: '' },
    }));

    toast({
      description: "New item added successfully",
    });
  };

  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    const item = sections.find(s => s.id === sectionId)?.items.find(i => i.id === itemId);
    if (item?.locked) {
      toast({
        description: "Cannot delete locked items",
        variant: "destructive",
      });
      return;
    }

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId),
        };
      }
      return section;
    });

    // Update state and save to backend
    setSections(updatedSections);
    await saveChanges(updatedSections);

    toast({
      description: "Item deleted successfully",
      variant: "default"
    });
  };

  const handleNewItemChange = (sectionId: string, field: 'name' | 'cost', value: string) => {
    setNewItems(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id} className="p-4">
          <h3 className="text-xl font-semibold mb-4">{section.name}</h3>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Input
                  value={item.name}
                  onChange={(e) => handleItemChange(section.id, item.id, 'name', e.target.value)}
                  disabled={item.locked}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={item.cost}
                  onChange={(e) => handleItemChange(section.id, item.id, 'cost', e.target.value)}
                  className="w-32"
                />
                {!item.locked && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteItem(section.id, item.id)}
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {/* Add new item form */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <Input
                placeholder="New item name"
                value={newItems[section.id].name}
                onChange={(e) => handleNewItemChange(section.id, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Cost"
                value={newItems[section.id].cost}
                onChange={(e) => handleNewItemChange(section.id, 'cost', e.target.value)}
                className="w-32"
              />
              <Button 
                onClick={() => handleAddItem(section.id)}
                className="whitespace-nowrap"
              >
                Add Item
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
