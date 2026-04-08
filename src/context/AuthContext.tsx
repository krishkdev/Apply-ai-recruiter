import { createContext, useContext, useState, type ReactNode } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const USER = {
  name: "Krishnakumar",
  email: "recruiter@applyai.com",
  company: "ApplyAI Inc.",
};

const KEYS = {
  authenticated:   "applyai_authenticated",
  firstLoginDone:  "applyai_first_login_done",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type User = typeof USER;

type AuthContextValue = {
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  user: User;
  login: () => void;
  logout: () => void;
  clearFirstLogin: () => void;
};

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(KEYS.authenticated) === "true"
  );
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const login = () => {
    const isFirst = localStorage.getItem(KEYS.firstLoginDone) !== "true";
    localStorage.setItem(KEYS.authenticated, "true");
    if (isFirst) {
      localStorage.setItem(KEYS.firstLoginDone, "true");
      setIsFirstLogin(true);
    } else {
      setIsFirstLogin(false);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(KEYS.authenticated);
    setIsAuthenticated(false);
    setIsFirstLogin(false);
    window.location.replace("/login");
  };

  // Called by WelcomePage on mount so ProtectedRoute won't loop back
  const clearFirstLogin = () => {
    setIsFirstLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isFirstLogin, user: USER, login, logout, clearFirstLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
