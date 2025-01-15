import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

export function UsersTab() {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();
  const { users, addUser, removeUser } = useAuthStore();

  const handleAddUser = (e: FormEvent) => {
    e.preventDefault();

    if (!newUsername || !newPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // Don't allow adding user with name 'Camryn'
    if (newUsername.trim() === 'Camryn') {
      toast({
        title: 'Error',
        description: 'This username is reserved',
        variant: 'destructive',
      });
      return;
    }

    const newUser: User = {
      username: newUsername.trim(),
      password: newPassword.trim(),
      isAdmin: false,
    };

    addUser(newUser);
    setNewUsername('');
    setNewPassword('');

    toast({
      title: 'Success',
      description: 'User added successfully',
    });
  };

  const handleRemoveUser = (username: string) => {
    if (username === 'Camryn') {
      toast({
        title: 'Error',
        description: 'Cannot remove admin user',
        variant: 'destructive',
      });
      return;
    }

    removeUser(username);
    toast({
      title: 'Success',
      description: 'User removed successfully',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
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
            </div>
            <Button type="submit" className="w-full">
              Add User
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.username}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm"
          >
            <span>{user.username}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveUser(user.username)}
              className="h-8 w-8"
              disabled={user.username === 'Camryn'}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
