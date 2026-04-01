import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API } from "@/lib/api";

export interface User {
  id: string;

  name: string;
  email: string;
  phone: string;
  college: string;
  role: string;
  teamId: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  signIn: (data: any) => Promise<{ error: Error | null }>;
  signUp: (data: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateUserContext: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When the app loads, reload local context cache to keep app fast
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Migration: Ensure 'id' exists if '_id' is present
        if (parsed && parsed._id && !parsed.id) {
          parsed.id = parsed._id;
        }
        setUser(parsed);
      } catch (err) {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (data: any) => {
    try {
      await API.signup(data);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (data: any) => {
    try {
      const response = await API.login(data);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUserContext = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signUp, signIn, signOut, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
