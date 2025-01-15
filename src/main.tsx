import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserLoginPage } from '@/pages/UserLoginPage';
import App from './App';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminPage } from '@/pages/AdminPage';
import './index.css';
import { useAuthStore } from './store/auth';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Initialize auth store first
const { initializeFromStorage } = useAuthStore.getState();
initializeFromStorage();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <UserLoginPage />,
  },
  {
    path: '/calculator',
    element: <App />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
]);

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
