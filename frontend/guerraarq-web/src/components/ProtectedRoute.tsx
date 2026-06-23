// Wrapper que protege rotas do admin.
// Se o usuário não estiver autenticado, redireciona pro /admin/login.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Enquanto carrega o estado inicial (verificando localStorage), mostra um loading.
  if (loading) {
    return (
      <div className="login-shell">
        <p className="muted">Verificando sessão…</p>
      </div>
    );
  }

  // Se não tem token, manda pro login. state guarda a URL original pra voltar depois.
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
