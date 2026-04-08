import { Navigate, type ReactNode } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isFirstLogin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isFirstLogin) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}
