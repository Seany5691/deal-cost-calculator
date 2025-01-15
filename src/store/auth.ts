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

// Default users - this should always be available
const DEFAULT_USERS = {
  'Camryn': {
    username: 'Camryn',
    password: 'Elliot',
    role: 'admin' as const
  }
};

// Initialize localStorage with default users if not already set
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
}

const validateCredentials = (username: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(DEFAULT_USERS));
  const user = users[username];
  
  if (user && user.password === password) {
    return {
      username: user.username,
      role: user.role
    };
  }
  
  return null;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,

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
}));
