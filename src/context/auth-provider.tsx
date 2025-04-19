// context/auth-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from 'next-auth';
import { useSession, signOut as nextAuthSignOut, signIn as nextAuthSignIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: Session['user'] | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  const logout = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push('/');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        status,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
