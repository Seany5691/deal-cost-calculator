import { create } from 'zustand';

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
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },

  addUser: (user: User) => {
    const users = get().users;
    set({ users: [...users, user] });
    localStorage.setItem('users', JSON.stringify([...users, user]));
  },

  removeUser: (username: string) => {
    const users = get().users.filter((u) => u.username !== username);
    set({ users });
    localStorage.setItem('users', JSON.stringify(users));
  },

  initializeFromStorage: () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      // Ensure admin user is always present
      if (!users.some((u: User) => u.username === defaultAdmin.username)) {
        users.push(defaultAdmin);
      }
      set({ users });
    } else {
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    }
  },
}));
