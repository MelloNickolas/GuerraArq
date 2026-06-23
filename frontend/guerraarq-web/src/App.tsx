// Componente raiz da aplicação.
// Define todas as rotas (públicas e admin) e envolve tudo no AuthProvider.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProjetoDetalhe from "./pages/ProjetoDetalhe";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProjetoForm from "./pages/admin/ProjetoForm";
import StudioForm from "./pages/admin/StudioForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* === Rotas públicas === */}
          <Route path="/" element={<Home />} />
          <Route path="/projetos/:slug" element={<ProjetoDetalhe />} />

          {/* === Login do admin (não protegido — é a porta de entrada) === */}
          <Route path="/admin/login" element={<Login />} />

          {/* === Rotas protegidas do admin ===
              ProtectedRoute redireciona pra /admin/login se não tiver token. */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projetos/novo"
            element={
              <ProtectedRoute>
                <ProjetoForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projetos/:id"
            element={
              <ProtectedRoute>
                <ProjetoForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/studio"
            element={
              <ProtectedRoute>
                <StudioForm />
              </ProtectedRoute>
            }
          />

          {/* Qualquer rota desconhecida cai na home. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
