import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authApi from "../api/auth.js";
import { getAccessToken } from "../api/tokens.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return null;
    }
    try {
      const me = await authApi.fetchCurrentUser();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    await authApi.login(credentials);
    return refreshUser();
  }, [refreshUser]);

  const register = useCallback(async (data) => {
    await authApi.register(data);
    return authApi.login({ email: data.email, password: data.password }).then(refreshUser);
  }, [refreshUser]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, deleteAccount, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
