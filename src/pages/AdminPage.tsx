import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemsTab } from '@/components/admin/ItemsTab';
import { FactorSheetTab } from '@/components/admin/FactorSheetTab';
import { ScalesTab } from '@/components/admin/ScalesTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { AdditionalCostsTab } from '@/components/admin/AdditionalCostsTab';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCalculatorStore } from '@/store/calculator';
import { API_URL } from '../config';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('items');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sections, initializeStore } = useCalculatorStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        // Verify token and load data
        const response = await fetch(`${API_URL}/api/admin/items`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        // Initialize store with fresh data
        await initializeStore();
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate, initializeStore]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenTimestamp');
    navigate('/admin/login');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/api/admin/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sections }),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save items');
      }

      toast({
        title: 'Success',
        description: 'Items saved successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error saving items:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save items',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const tabs = [
    {
      value: 'items',
      label: 'Items',
      content: <ItemsTab onSave={handleSave} />
    },
    {
      value: 'factor-sheet',
      label: 'Factor Sheet',
      content: <FactorSheetTab />
    },
    {
      value: 'scales',
      label: 'Scales',
      content: <ScalesTab />
    },
    {
      value: 'additional-costs',
      label: 'Additional Costs',
      content: <AdditionalCostsTab />
    },
    {
      value: 'users',
      label: 'Users',
      content: <UsersTab />
    }
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Calculator
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
