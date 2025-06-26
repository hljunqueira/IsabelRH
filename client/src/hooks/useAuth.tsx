import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Usuario, Candidato, Empresa } from "@shared/schema";

interface AuthUser {
  usuario: Usuario;
  profile: Candidato | Empresa | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("auth-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", { email, senha });
      const data = await response.json();
      
      setUser(data);
      localStorage.setItem("auth-user", JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const response = await apiRequest("POST", "/api/auth/register", data);
      const result = await response.json();
      
      setUser(result);
      localStorage.setItem("auth-user", JSON.stringify(result));
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}