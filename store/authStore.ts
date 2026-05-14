import { create } from 'zustand';
import type { User } from 'firebase/auth';

type Role = 'student' | 'company' | null;

interface AuthState {
  user: User | null;
  role: Role;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ 
    user: null, 
    role: null, 
    isLoading: false 
  }),
}));
