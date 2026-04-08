import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isFirstLogin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isFirstLogin) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}
