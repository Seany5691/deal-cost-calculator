import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useCalculatorStore } from '@/store/calculator';
import { API_URL } from '../../config';

/**
 * Represents the structure of factors in the admin interface
 * Example:
 * {
 *   "36_months": {
 *     "0%": {
 *       "0-20000": 0.03891
 *     }
 *   }
 * }
 */
type AdminFactors = {
  [term: string]: { // e.g. "36_months"
    [escalation: string]: { // e.g. "0%"
      [range: string]: number; // e.g. "0-20000": 0.03891
    };
  };
};

/**
 * Represents the structure of factors in the calculator store
 * Example:
 * {
 *   "36-0": {
 *     "0-20000": 0.03891
 *   }
 * }
 */
type StoreFactors = {
  [key: string]: { // e.g. "36-0" for 36 months, 0% escalation
    [range: string]: number; // e.g. "0-20000": 0.03891
  };
};

// Constants for available terms, escalations, and ranges
const TERMS = ['36_months', '48_months', '60_months'] as const;
const ESCALATIONS = ['0%', '10%', '15%'] as const;
const RANGES = ['0-20000', '20001-50000', '50001-100000', '100000+'] as const;

export function FactorSheetTab() {
  const [factors, setFactors] = useState<AdminFactors>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { setFactorScales } = useCalculatorStore();

  useEffect(() => {
    fetchFactors();
  }, []);

  /**
   * Converts the admin interface factor format to the store format
   */
  const convertToStoreFormat = (data: AdminFactors): StoreFactors => {
    const storeFormat: StoreFactors = {};
    
    Object.entries(data).forEach(([term, escalationObj]) => {
      Object.entries(escalationObj).forEach(([escalation, rangeObj]) => {
        // Convert "36_months" and "0%" to "36-0"
        const termValue = term.split('_')[0];
        const escalationValue = escalation.replace('%', '');
        const key = `${termValue}-${escalationValue}`;
        storeFormat[key] = rangeObj;
      });
    });
    
    return storeFormat;
  };

  /**
   * Fetches factors from the API and updates both local state and store
   */
  const fetchFactors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/factors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch factors');
      }

      const formattedFactors = await response.json();
      
      setFactors(formattedFactors);
      setFactorScales(convertToStoreFormat(formattedFactors));
    } catch (error) {
      console.error('Error fetching factors:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch factors',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles changes to factor values and updates both local state and the API
   */
  const handleFactorChange = async (term: string, escalation: string, range: string, value: string) => {
    try {
      const numericValue = Number(value);
      if (isNaN(numericValue)) return;

      // Update local state
      const updatedFactors = {
        ...factors,
        [term]: {
          ...factors[term],
          [escalation]: {
            ...factors[term]?.[escalation],
            [range]: numericValue
          }
        }
      };
      setFactors(updatedFactors);

      // Update API
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/factors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedFactors)
      });

      if (!response.ok) {
        throw new Error('Failed to update factor');
      }

      // Update store with converted format
      setFactorScales(convertToStoreFormat(updatedFactors));

      toast({
        title: 'Success',
        description: 'Factor updated successfully',
      });
    } catch (error) {
      console.error('Error updating factor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update factor',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {TERMS.map(term => (
        <Card key={term} className="w-full">
          <CardHeader>
            <CardTitle>{term.replace('_', ' ')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {ESCALATIONS.map(escalation => (
                <div key={escalation}>
                  <h3 className="text-lg font-semibold mb-4">
                    {escalation} Escalation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {RANGES.map(range => (
                      <div key={range}>
                        <label className="block text-sm font-medium mb-2">
                          {range}
                        </label>
                        <Input
                          type="number"
                          step="0.00001"
                          value={factors[term]?.[escalation]?.[range] || ''}
                          onChange={(e) => handleFactorChange(term, escalation, range, e.target.value)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
