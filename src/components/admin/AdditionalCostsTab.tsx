import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/config';
import { useToast } from '@/components/ui/use-toast';

export function AdditionalCostsTab() {
  const [costPerKilometer, setCostPerKilometer] = useState<number>(15);
  const [costPerPoint, setCostPerPoint] = useState<number>(250);
  const { toast } = useToast();

  // Fetch initial values
  React.useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetch(`${API_URL}/api/admin/scales`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.additional_costs) {
          setCostPerKilometer(data.additional_costs.cost_per_kilometer);
          setCostPerPoint(data.additional_costs.cost_per_point);
        }
      })
      .catch((error) => {
        console.error('Error fetching additional costs:', error);
        toast({
          title: "Error",
          description: "Failed to load additional costs",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/api/admin/scales`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const currentScales = await response.json();

      // Update only the additional_costs section
      const updatedScales = {
        ...currentScales,
        additional_costs: {
          cost_per_kilometer: costPerKilometer,
          cost_per_point: costPerPoint
        }
      };

      const saveResponse = await fetch(`${API_URL}/api/admin/scales`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedScales),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save changes');
      }

      toast({
        title: "Success",
        description: "Additional costs updated successfully",
      });
    } catch (error) {
      console.error('Error saving additional costs:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black">Additional Costs</h2>
      <div className="grid grid-cols-1 gap-4 max-w-md">
        <div>
          <label className="block mb-2 text-black">Cost Per Kilometer (R)</label>
          <Input
            type="number"
            value={costPerKilometer}
            onChange={(e) => setCostPerKilometer(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2 text-black">Cost Per Point (R)</label>
          <Input
            type="number"
            value={costPerPoint}
            onChange={(e) => setCostPerPoint(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
