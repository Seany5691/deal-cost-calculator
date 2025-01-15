import { create } from 'zustand';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  initializeFromStorage: () => void;
}

// Default users
const DEFAULT_USERS = {
  'Camryn': {
    username: 'Camryn',
    password: 'Elliot',
    role: 'admin' as const
  }
};

const validateCredentials = (username: string, password: string): User | null => {
  // Initialize users with default if empty
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (Object.keys(users).length === 0) {
    users = DEFAULT_USERS;
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  const user = users[username];
  
  if (user && user.password === password) {
    return {
      username: user.username,
      role: user.role
    };
  }
  
  return null;
};

export const useAuthStore = create<AuthStore>((set, get) => {
  // Initialize from localStorage
  const initialToken = localStorage.getItem('userToken');
  const initialUser = localStorage.getItem('user');

  return {
    user: initialUser ? JSON.parse(initialUser) : null,
    token: initialToken,

    setUser: (user) => {
      set({ user });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },

    setToken: (token) => {
      set({ token });
      if (token) {
        localStorage.setItem('userToken', token);
      } else {
        localStorage.removeItem('userToken');
      }
    },

    login: async (username: string, password: string) => {
      const user = validateCredentials(username, password);
      
      if (user) {
        // Generate a simple token (in a real app, this would be more secure)
        const token = btoa(`${username}:${new Date().getTime()}`);
        get().setUser(user);
        get().setToken(token);
        return true;
      }
      
      return false;
    },

    logout: () => {
      get().setUser(null);
      get().setToken(null);
    },

    isAuthenticated: () => {
      return !!get().user && !!get().token;
    },

    isAdmin: () => {
      return get().user?.role === 'admin';
    },

    initializeFromStorage: () => {
      const token = localStorage.getItem('userToken');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        set({
          token,
          user: JSON.parse(user)
        });
      }
    }
  };
});
