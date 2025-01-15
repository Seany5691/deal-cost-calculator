import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function AdminLoginButton() {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/admin/login')}
      variant="default"
      className="whitespace-nowrap"
    >
      Admin Login
    </Button>
  );
}
