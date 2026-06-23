// Tela de login do admin — usuário e senha do .env do backend.
// Após login bem-sucedido, redireciona pro dashboard.

import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pega a URL que o usuário tentava acessar antes (se foi redirecionado).
  // Se não tem, manda pro /admin direto.
  const destino = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(usuario, senha);
      navigate(destino, { replace: true });
    } catch {
      setErro("Usuário ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Acesso restrito</h1>
        <p className="sub">Painel · Guerra Arq</p>

        {erro && <div className="error-msg">{erro}</div>}

        <div className="field">
          <label>Usuário</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="field">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn" style={{ width: "100%", justifyContent: "center" }} disabled={carregando}>
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
