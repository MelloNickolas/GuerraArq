// Cliente HTTP centralizado para falar com o backend .NET.
// Usa axios + interceptor pra anexar automaticamente o token JWT
// nas chamadas autenticadas (admin).

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// URL base da API — vem da variável de ambiente do Vite.
// Em dev: http://localhost:5000 (ou outra porta do dotnet run).
// Em prod: URL pública do Render.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Instância principal do axios usada por todo o front.
export const api = axios.create({
  baseURL,
  // Não envia cookies (estamos usando JWT em header, não cookie de sessão).
  withCredentials: false,
});

// === INTERCEPTOR DE REQUISIÇÃO ===
// Antes de cada chamada, se tiver token salvo no localStorage,
// anexa no header Authorization. Assim o admin nem precisa pensar nisso.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("guerraarq_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === INTERCEPTOR DE RESPOSTA ===
// Se a API responder 401 (não autorizado), o token expirou — limpamos
// e redirecionamos pro login. Evita ficar tentando chamadas com token morto.
api.interceptors.response.use(
  (resp) => resp,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("guerraarq_token");
      // Se estiver numa rota admin, manda pro login. Se for chamada pública, ignora.
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// =========================================================
// TIPOS — espelham os modelos do backend.
// =========================================================

export interface GaleriaItem {
  id?: number;
  url: string;
  descricao?: string | null;
  ordem: number;
}

export interface Projeto {
  id: number;
  slug: string;
  titulo: string;
  ano: number;
  tipo: string; // "Real" ou "Estudo"
  categoria: string;
  areaM2?: number | null;
  localizacao?: string | null;
  duracao?: string | null;
  cliente?: string | null;
  status?: string | null;
  ferramentas: string[];
  descricaoParagrafos: string[];
  citacao?: string | null;
  capaUrl: string;
  galeria: GaleriaItem[];
  ordem: number;
  createdAt: string;
}

export interface StudioInfo {
  whatsapp?: string | null;
  instagram?: string | null;
  pinterest?: string | null;
  linkedin?: string | null;
  email?: string | null;
  anoFundacao?: number | null;
  statCustomLabel?: string | null;
  statCustomValor?: string | null;
  heroTitulo?: string | null;
  heroTituloDestaque?: string | null;
  heroLead?: string | null;
  sobreParagrafos: string[];
  servicos: string[];
  fotoArquitetaUrl?: string | null;
  fotoEstudioUrl?: string | null;
  totalProjetos: number;
  anosDeEstudio: number;
}

// =========================================================
// FUNÇÕES DE CHAMADA — atalhos tipados pra cada endpoint.
// =========================================================

export const projetosApi = {
  // Lista todos os projetos (público).
  listar: () => api.get<Projeto[]>("/api/projetos").then((r) => r.data),
  // Busca um projeto pelo slug (público).
  obter: (slug: string) => api.get<Projeto>(`/api/projetos/${slug}`).then((r) => r.data),
  // Cria um novo projeto (admin).
  criar: (data: Omit<Projeto, "id" | "createdAt">) =>
    api.post<Projeto>("/api/projetos", data).then((r) => r.data),
  // Atualiza um projeto existente (admin).
  atualizar: (id: number, data: Omit<Projeto, "id" | "createdAt">) =>
    api.put<Projeto>(`/api/projetos/${id}`, data).then((r) => r.data),
  // Deleta um projeto (admin).
  excluir: (id: number) => api.delete(`/api/projetos/${id}`).then((r) => r.data),
};

export const studioApi = {
  // Busca info do estúdio + stats calculadas (público).
  obter: () => api.get<StudioInfo>("/api/studio").then((r) => r.data),
  // Atualiza info do estúdio (admin).
  atualizar: (data: Omit<StudioInfo, "totalProjetos" | "anosDeEstudio">) =>
    api.put<StudioInfo>("/api/studio", data).then((r) => r.data),
};

export const authApi = {
  // Faz login com usuario/senha — devolve token JWT.
  login: (usuario: string, senha: string) =>
    api
      .post<{ token: string; expiraEm: string }>("/api/auth/login", { usuario, senha })
      .then((r) => r.data),
};

export const uploadApi = {
  // Upload de imagem — devolve URL pública do Cloudinary.
  enviar: (arquivo: File) => {
    const form = new FormData();
    form.append("arquivo", arquivo);
    return api
      .post<{ url: string }>("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.url);
  },
};
