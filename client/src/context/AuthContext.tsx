import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FarmerProfile, CompanyProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: FarmerProfile | CompanyProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerFarmer: (data: any) => Promise<{ success: boolean; error?: string }>;
  registerCompany: (data: any) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (role: UserRole, index?: number) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  registerFarmer: async () => ({ success: false }),
  registerCompany: async () => ({ success: false }),
  demoLogin: async () => ({ success: false }),
  logout: () => {},
  refreshProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | CompanyProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('farmsetu_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
      } else {
        // Expired or invalid
        localStorage.removeItem('farmsetu_token');
        setToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to verify token', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('farmsetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const registerFarmer = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register-farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Farmer registration failed' };
      }
      localStorage.setItem('farmsetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const registerCompany = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Company registration failed' };
      }
      localStorage.setItem('farmsetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const demoLogin = async (role: UserRole, index: number = 0) => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, index })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Demo login failed' };
      }
      localStorage.setItem('farmsetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Demo login error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('farmsetu_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        registerFarmer,
        registerCompany,
        demoLogin,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
