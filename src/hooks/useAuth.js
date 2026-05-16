import { useContext } from 'react';

// Create an Auth Context
import { createContext } from 'react';

export const AuthContext = createContext(null);

// Create a custom hook to use the Auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // If no provider, return a default user object from localStorage
    const user = localStorage.getItem('user');
    return {
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!user,
      logout: () => {
        localStorage.removeItem('user');
        window.location.reload();
      }
    };
  }
  return context;
}
