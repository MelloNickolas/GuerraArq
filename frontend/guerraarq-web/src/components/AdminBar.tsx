// Barra superior do admin com abas de navegação e botão de logout.
// Aparece em todas as páginas do admin (dashboard, formulários, etc.).

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function AdminBar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper que retorna se a rota atual começa com determinado prefixo
  // (pra destacar a aba ativa).
  const isActive = (prefix: string) => location.pathname.startsWith(prefix);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-bar">
      <div className="admin-bar-in">
        {/* Brand minimalista — clica e volta pro dashboard. */}
        <Link to="/admin" className="brand" style={{ gap: 10 }}>
          <img src="/assets/logo-green.png" alt="" />
          <span className="wm">
            <b style={{ fontSize: 15 }}>Guerra Arq</b>
            <span>Painel admin</span>
          </span>
        </Link>

        {/* Abas de navegação. */}
        <div className="admin-tabs">
          <Link to="/admin" className={isActive("/admin") && !isActive("/admin/studio") ? "active" : ""}>
            Projetos
          </Link>
          <Link to="/admin/studio" className={isActive("/admin/studio") ? "active" : ""}>
            Estúdio
          </Link>
          <Link to="/" className="" target="_blank" rel="noopener noreferrer">
            Ver site
          </Link>
        </div>

        {/* Botão de sair. */}
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}
