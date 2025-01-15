import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

interface User {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export function UsersTab() {
  const [users, setUsers] = useState<Record<string, User>>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : {
      'admin': {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      }
    };
  });
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const addUser = () => {
    if (!newUsername || !newPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (users[newUsername]) {
      toast({
        title: 'Error',
        description: 'User already exists',
        variant: 'destructive',
      });
      return;
    }

    const updatedUsers = {
      ...users,
      [newUsername]: {
        username: newUsername,
        password: newPassword,
        role: 'user'
      }
    };

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setNewUsername('');
    setNewPassword('');
    
    toast({
      title: 'Success',
      description: 'User added successfully',
    });
  };

  const deleteUser = (username: string) => {
    if (username === 'admin') {
      toast({
        title: 'Error',
        description: 'Cannot delete admin user',
        variant: 'destructive',
      });
      return;
    }

    const updatedUsers = { ...users };
    delete updatedUsers[username];
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast({
      title: 'Success',
      description: 'User deleted successfully',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={addUser}>Add User</Button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(users).map(([username, user]) => (
              <div key={username} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{username}</span>
                  <span className="ml-2 text-sm text-gray-500">({user.role})</span>
                </div>
                {username !== 'admin' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUser(username)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
