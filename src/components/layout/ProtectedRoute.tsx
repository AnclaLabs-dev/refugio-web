import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          {/* Spinner estilizado con la identidad de Refugio */}
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
          <p className="text-sm font-medium text-muted">Cargando sesión…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirige al login guardando la ruta previa en el state por si queremos volver luego de loguear
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
