import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useCalculatorStore } from '@/store/calculator';
import { API_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Scales {
  installation: {
    [key: string]: number;
  };
  finance_fee: {
    [key: string]: number;
  };
  gross_profit: {
    [key: string]: number;
  };
}

// Define the order of ranges
const EXTENSION_RANGES = ['0-4', '5-8', '9-16', '17-32', '33-48'];
const AMOUNT_RANGES = ['0-20000', '20001-50000', '50001-100000', '100000+'];

const DEFAULT_SCALES: Scales = {
  installation: EXTENSION_RANGES.reduce((acc, range) => ({ ...acc, [range]: 0 }), {}),
  finance_fee: AMOUNT_RANGES.reduce((acc, range) => ({ ...acc, [range]: 0 }), {}),
  gross_profit: EXTENSION_RANGES.reduce((acc, range) => ({ ...acc, [range]: 0 }), {})
};

export function ScalesTab() {
  const [scales, setScales] = useState<Scales>(DEFAULT_SCALES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { setBaseGrossProfit, setFinanceScales, setInstallationScales } = useCalculatorStore();

  const updateStoreScales = (data: Scales) => {
    try {
      setInstallationScales(data.installation);
      setFinanceScales(data.finance_fee);
      setBaseGrossProfit(data.gross_profit);
    } catch (error) {
      console.error('Error updating store scales:', error);
      setError('Failed to update calculator values');
    }
  };

  const fetchScales = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_URL}/api/admin/scales`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scales');
      }

      const data = await response.json();
      
      // Ensure all ranges have values, even if they're 0
      const normalizedData: Scales = {
        installation: {
          ...DEFAULT_SCALES.installation,
          ...data.installation
        },
        finance_fee: {
          ...DEFAULT_SCALES.finance_fee,
          ...data.finance_fee
        },
        gross_profit: {
          ...DEFAULT_SCALES.gross_profit,
          ...data.gross_profit
        }
      };

      setScales(normalizedData);
      updateStoreScales(normalizedData);
    } catch (error) {
      console.error('Error fetching scales:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch scales');
      toast({
        title: 'Error',
        description: 'Failed to fetch scales. Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScales();
    
    // Cleanup function to reset state when component unmounts
    return () => {
      setScales(DEFAULT_SCALES);
      setError(null);
      setIsLoading(true);
    };
  }, []);

  const handleScaleChange = (
    category: keyof Scales,
    range: string,
    value: string
  ) => {
    try {
      const numericValue = Number(value);
      if (isNaN(numericValue) || numericValue < 0) return;

      const newScales = {
        ...scales,
        [category]: {
          ...scales[category],
          [range]: numericValue
        }
      };

      setScales(newScales);
    } catch (error) {
      console.error('Error updating scale:', error);
      toast({
        title: 'Error',
        description: 'Failed to update value',
        variant: 'destructive',
      });
    }
  };

  const saveChanges = async () => {
    try {
      setError(null);
      setIsSaving(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      // First fetch current data to preserve factors
      const currentResponse = await fetch(`${API_URL}/api/admin/scales`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current data');
      }

      const currentData = await currentResponse.json();

      // Merge current factors with new scales
      const response = await fetch(`${API_URL}/api/admin/scales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...currentData,
          installation: scales.installation,
          finance_fee: scales.finance_fee,
          gross_profit: scales.gross_profit
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save scales');
      }

      updateStoreScales(scales);
      toast({
        title: 'Success',
        description: 'Scales saved successfully',
      });
    } catch (error) {
      console.error('Error saving scales:', error);
      setError(error instanceof Error ? error.message : 'Failed to save scales');
      toast({
        title: 'Error',
        description: 'Failed to save scales. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            className="ml-4"
            onClick={() => {
              setError(null);
              fetchScales();
            }}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Scales Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage finance fee, installation cost, and gross profit scales
        </p>
      </div>

      {isSaving && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <AlertDescription>
            Saving changes...
          </AlertDescription>
        </Alert>
      )}

      {/* Finance Fee Scales */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Fee Scales</CardTitle>
          <CardDescription>
            Set finance fee percentages based on finance amount ranges.
            These fees are applied to the total finance amount.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {AMOUNT_RANGES.map(range => (
              <div key={range} className="grid grid-cols-2 gap-4 items-center">
                <label className="font-medium">R{range}</label>
                <Input
                  type="number"
                  step="0.00001"
                  min="0"
                  value={scales.finance_fee[range] || ''}
                  onChange={(e) => handleScaleChange('finance_fee', range, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installation Scales */}
      <Card>
        <CardHeader>
          <CardTitle>Installation Scales</CardTitle>
          <CardDescription>
            Set installation costs based on the number of extensions.
            The cost is determined by which range the total number of extensions falls into.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {EXTENSION_RANGES.map(range => (
              <div key={range} className="grid grid-cols-2 gap-4 items-center">
                <label className="font-medium">{range} Extensions</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={scales.installation[range] || ''}
                  onChange={(e) => handleScaleChange('installation', range, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gross Profit Scales */}
      <Card>
        <CardHeader>
          <CardTitle>Gross Profit Scales</CardTitle>
          <CardDescription>
            Set base gross profit percentages based on the number of extensions.
            The percentage is determined by which range the total number of extensions falls into.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {EXTENSION_RANGES.map(range => (
              <div key={range} className="grid grid-cols-2 gap-4 items-center">
                <label className="font-medium">{range} Extensions</label>
                <Input
                  type="number"
                  step="0.00001"
                  min="0"
                  value={scales.gross_profit[range] || ''}
                  onChange={(e) => handleScaleChange('gross_profit', range, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={saveChanges} 
          disabled={isSaving}
          className="w-32"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}
