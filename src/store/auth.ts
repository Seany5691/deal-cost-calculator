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

// Temporary local users for testing
const USERS = {
  'Camryn': {
    password: 'Elliot',
    role: 'user' as const
  },
  'admin': {
    password: 'admin123',
    role: 'admin' as const
  }
};

const validateToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    // Basic validation: check if it's a non-empty string
    return typeof token === 'string' && token.length > 0;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const useAuthStore = create<AuthStore>((set, get) => {
  // Initialize token from localStorage
  const initialToken = localStorage.getItem('userToken');
  const initialUser = localStorage.getItem('user');

  return {
    user: initialUser ? JSON.parse(initialUser) : null,
    token: validateToken(initialToken) ? initialToken : null,
    
    setUser: (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      set({ user });
    },
    
    setToken: (token) => {
      if (token && validateToken(token)) {
        localStorage.setItem('userToken', token);
        set({ token });
      } else {
        console.log('Removing invalid token');
        localStorage.removeItem('userToken');
        set({ token: null });
      }
    },
    
    login: async (username: string, password: string) => {
      console.log('Attempting login with username:', username);
      
      const user = USERS[username];
      if (!user || user.password !== password) {
        console.log('Invalid credentials');
        return false;
      }

      const token = btoa(username + ':' + new Date().getTime());
      
      set({ 
        token,
        user: {
          username,
          role: user.role
        }
      });
      
      localStorage.setItem('userToken', token);
      localStorage.setItem('user', JSON.stringify({
        username,
        role: user.role
      }));
      
      console.log('Login successful');
      return true;
    },
    
    logout: () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    },
    
    isAuthenticated: () => {
      const state = get();
      return !!state.token && !!state.user;
    },
    
    isAdmin: () => {
      const state = get();
      return state.user?.role === 'admin';
    },
    
    initializeFromStorage: () => {
      const token = localStorage.getItem('userToken');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          set({ token, user: parsedUser });
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
        }
      }
    }
  };
});
