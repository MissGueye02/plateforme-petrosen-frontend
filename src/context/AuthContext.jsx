import { createContext, useContext, useState } from "react";
import { getStoredUser, logout as logoutService } from "../services/AuthService";
import { normalizeRole } from "../utils/roles";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());

  function handleLoginSuccess(userData) {
    const normalized = { ...userData, role: normalizeRole(userData?.role) };
    setUser(normalized);
    localStorage.setItem("petrosen_user", JSON.stringify(normalized));
  }

  function handleUserUpdate(updatedUser) {
    const nextUser = updatedUser ? { ...updatedUser, role: normalizeRole(updatedUser.role) } : null;
    setUser(nextUser);
    if (nextUser) localStorage.setItem("petrosen_user", JSON.stringify(nextUser));
    else localStorage.removeItem("petrosen_user");
  }

  async function handleLogout() {
    await logoutService();
    setUser(null);
  }

  function hasRole(role) {
    return normalizeRole(user?.role) === normalizeRole(role);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login: handleLoginSuccess,
      logout: handleLogout,
      updateUser: handleUserUpdate,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return context;
}
