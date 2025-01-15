import { useEffect } from 'react';
import { Calculator } from '@/components/Calculator';
import { Toaster } from '@/components/ui/toaster';
import { useCalculatorStore } from './store/calculator';
import { useAuthStore } from './store/auth';
import { useNavigate } from 'react-router-dom';

function App() {
  const { initializeStore } = useCalculatorStore();
  const { isAuthenticated, initializeFromStorage } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initializeStore();
    initializeFromStorage();
  }, [initializeStore, initializeFromStorage]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="min-h-screen max-w-[1400px] mx-auto px-0 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6">
        <Calculator />
      </div>
      <Toaster />
    </div>
  );
}

export default App;