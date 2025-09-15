// AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService, { type IAuthUser } from "../components/Services/AuthService";

interface AuthContextType {
  user: IAuthUser | null;
  login: (userName: string, password: string) => Promise<IAuthUser>;
  logout: () => Promise<void>;
  isAuth: boolean;
  loading: boolean;
  checkAuth: () => Promise<IAuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Run only on refresh (first load)
  useEffect(() => {
    const init = async () => {
      try {
        const res = await AuthService.check();
        setUser(res);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ✅ Return user when checking
  const checkAuth = async (): Promise<IAuthUser | null> => {
    try {
      const res = await AuthService.check();
      setUser(res);
      debugger
      return res;
    } catch {
      setUser(null);
      return null;
    }
  };

  // ✅ login now returns the fresh user
  const login = async (userName: string, password: string): Promise<IAuthUser> => {
    await AuthService.login({ userName, password });
    debugger
    const res = await checkAuth();
    debugger
    if (!res) throw new Error("Login failed");
    return res;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuth: !!user,
        loading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
