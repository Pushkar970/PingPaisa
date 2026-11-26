import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authControllerLogin, authControllerSignup, authControllerMe } from '@/src/api/generated/api';
import { getErrorMessage } from '@/src/api/customFetch';
import type { MeUserDto } from '@/src/api/generated/schemas';

const TOKEN_KEY = 'auth_token';

interface AuthContextType {
  user: MeUserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokenAndLoad: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  setTokenAndLoad: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeUserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await authControllerMe();
      setUser(res?.user ?? null);
    } catch {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip bootstrap if we're on the callback page
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.pathname?.includes('/auth/callback')) {
      setIsLoading(false);
      return;
    }
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authControllerLogin({ email, password });
    await AsyncStorage.setItem(TOKEN_KEY, data?.token ?? '');
    const me = await authControllerMe();
    setUser(me?.user ?? null);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const data = await authControllerSignup({ email, password, name });
    await AsyncStorage.setItem(TOKEN_KEY, data?.token ?? '');
    const me = await authControllerMe();
    setUser(me?.user ?? null);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    // Keep biometric_token in SecureStore so Biometric Login continues working after logout.
    setUser(null);
  }, []);

  const setTokenAndLoad = useCallback(async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    try {
      const me = await authControllerMe();
      setUser(me?.user ?? null);
    } catch {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        setTokenAndLoad,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
