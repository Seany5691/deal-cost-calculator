import { create } from 'zustand';
import { API_URL } from '@/config';

interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: () => boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: User) => void;
  removeUser: (username: string) => void;
  initializeFromStorage: () => void;
}

// Default admin user
const defaultAdmin: User = {
  username: 'Camryn',
  password: 'Elliot',
  isAdmin: true,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  users: [defaultAdmin],
  currentUser: null,

  isAuthenticated: () => {
    return get().currentUser !== null;
  },

  login: async (username: string, password: string) => {
    const users = get().users;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      set({ currentUser: user });
      
      // If it's the admin user, set the admin token
      if (user.username === defaultAdmin.username) {
        // In a real app, this would be a JWT from the server
        localStorage.setItem('adminToken', 'admin-token');
        localStorage.setItem('adminTokenTimestamp', new Date().toISOString());
      }
      
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenTimestamp');
  },

  addUser: (user: User) => {
    const users = get().users;
    const newUsers = [...users, user];
    set({ users: newUsers });
    localStorage.setItem('users', JSON.stringify(newUsers));
  },

  removeUser: (username: string) => {
    const users = get().users.filter((u) => u.username !== username);
    set({ users });
    localStorage.setItem('users', JSON.stringify(users));
  },

  initializeFromStorage: () => {
    try {
      const storedUsers = localStorage.getItem('users');
      let users: User[] = [defaultAdmin];

      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers)) {
          // Ensure admin user is always present
          if (!parsedUsers.some(u => u.username === defaultAdmin.username)) {
            users = [...parsedUsers, defaultAdmin];
          } else {
            users = parsedUsers;
          }
        }
      }

      set({ users });
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error initializing auth store:', error);
      // Reset to default state if there's an error
      set({ users: [defaultAdmin] });
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    }
  },
}));
