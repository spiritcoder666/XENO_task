import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      
      login: (token: string) => {
        try {
          const decoded = jwtDecode<{
            sub: string;
            name: string;
            email: string;
            picture?: string;
            exp: number;
          }>(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              token: null,
              isLoading: false 
            });
            return;
          }
          
          const user: User = {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture
          };
          
          set({ 
            isAuthenticated: true, 
            user, 
            token,
            isLoading: false 
          });
        } catch (error) {
          console.error('Invalid token:', error);
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null,
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null,
          isLoading: false 
        });
      },
      
      checkAuth: () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false });
          return;
        }
        
        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              token: null,
              isLoading: false 
            });
          } else {
            set({ isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null,
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user
      }),
    }
  )
);