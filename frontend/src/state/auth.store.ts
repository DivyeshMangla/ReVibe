import { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
};

let authState = initialState;
const listeners = new Set<(state: AuthState) => void>();

export function useAuthStore() {
  const [, forceUpdate] = useState({});
  
  useState(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  });

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    authState = { token, user, isAuthenticated: true };
    listeners.forEach(l => l(authState));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    authState = { token: null, user: null, isAuthenticated: false };
    listeners.forEach(l => l(authState));
  };

  return { ...authState, login, logout };
}
