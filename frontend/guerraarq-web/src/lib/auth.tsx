// Contexto de autenticação do admin.
// Guarda o token no localStorage e expõe funções de login/logout.
// Componentes filhos usam o hook useAuth() para saber se está logado.

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "./api";

// Formato do objeto exposto pelo contexto.
interface AuthCtx {
  isAuthenticated: boolean;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

// Provider que envolve o app inteiro — disponibiliza o contexto pra todos.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado simples: tem token salvo no localStorage = considerado autenticado.
  // (Não validamos contra o backend aqui — se o token estiver inválido,
  // o interceptor do axios cuida de jogar pro login no primeiro 401.)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ao montar o app, checa se já tem token salvo (login persistente).
  useEffect(() => {
    const token = localStorage.getItem("guerraarq_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // Faz login chamando a API, salva token e marca como autenticado.
  async function login(usuario: string, senha: string) {
    const { token } = await authApi.login(usuario, senha);
    localStorage.setItem("guerraarq_token", token);
    setIsAuthenticated(true);
  }

  // Limpa o token e marca como deslogado.
  function logout() {
    localStorage.removeItem("guerraarq_token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook custom — usado pelas páginas pra acessar o contexto.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
