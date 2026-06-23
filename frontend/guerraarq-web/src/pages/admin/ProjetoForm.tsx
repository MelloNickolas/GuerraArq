// Formulário de criação/edição de projeto.
// Mesma tela funciona pra criar (rota /admin/projetos/novo) e editar (/admin/projetos/:id).
// Inclui upload de capa, gerenciamento de galeria com descrição por imagem, etc.

import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminBar from "../../components/AdminBar";
import ImageUploader from "../../components/ImageUploader";
import { projetosApi, uploadApi, type GaleriaItem, type Projeto } from "../../lib/api";

// Estado inicial vazio — usado quando criamos um projeto novo.
const projetoVazio: Omit<Projeto, "id" | "createdAt"> = {
  slug: "",
  titulo: "",
  ano: new Date().getFullYear(),
  tipo: "Real",
  categoria: "",
  areaM2: null,
  localizacao: "",
  duracao: "",
  cliente: "",
  status: "",
  ferramentas: [],
  descricaoParagrafos: [""],
  citacao: "",
  capaUrl: "",
  galeria: [],
  ordem: 0,
};

export default function ProjetoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Se a URL tem um id numérico, estamos editando. Senão, criando.
  const editando = id && id !== "novo";

  const [form, setForm] = useState<Omit<Projeto, "id" | "createdAt">>(projetoVazio);
  const [projetoExistente, setProjetoExistente] = useState<Projeto | null>(null);
  const [carregando, setCarregando] = useState(!!editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Se for edição, busca o projeto pelo id na lista (a API só tem GET por slug,
  // então pegamos do listar() e filtramos — simples e suficiente).
  useEffect(() => {
    if (!editando) return;
    projetosApi
      .listar()
      .then((lista) => {
        const p = lista.find((x) => x.id === Number(id));
        if (p) {
          setProjetoExistente(p);
          // Remove os campos que não vão no payload (id, createdAt).
          const { id: _i, createdAt: _c, ...rest } = p;
          setForm(rest);
        } else {
          setErro("Projeto não encontrado.");
        }
      })
      .finally(() => setCarregando(false));
  }, [id, editando]);

  // Helper genérico pra atualizar um campo do formulário.
  function atualizar<K extends keyof typeof form>(campo: K, valor: (typeof form)[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Gera slug automaticamente a partir do título (só se ainda não foi editado manualmente).
  function gerarSlug(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // remove acentos
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Atualiza um parágrafo específico da descrição (ou adiciona/remove).
  function setParagrafo(i: number, valor: string) {
    const novos = [...form.descricaoParagrafos];
    novos[i] = valor;
    atualizar("descricaoParagrafos", novos);
  }

  // Upload de uma nova imagem pra galeria.
  async function adicionarImagemGaleria(arquivo: File) {
    try {
      const url = await uploadApi.enviar(arquivo);
      const item: GaleriaItem = { url, descricao: "", ordem: form.galeria.length };
      atualizar("galeria", [...form.galeria, item]);
    } catch {
      alert("Falha no upload da imagem.");
    }
  }

  // Atualiza descrição de uma imagem específica da galeria.
  function setDescricaoImagem(idx: number, descricao: string) {
    const novas = [...form.galeria];
    novas[idx] = { ...novas[idx], descricao };
    atualizar("galeria", novas);
  }

  // Remove uma imagem da galeria.
  function removerImagem(idx: number) {
    atualizar("galeria", form.galeria.filter((_, i) => i !== idx));
  }

  // === SUBMIT ===
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    // Validações mínimas no front (backend valida de novo).
    if (!form.titulo || !form.slug || !form.capaUrl || !form.categoria) {
      setErro("Preencha título, slug, categoria e suba a capa.");
      return;
    }

    setSalvando(true);
    try {
      // Limpa parágrafos vazios antes de enviar.
      const payload = {
        ...form,
        descricaoParagrafos: form.descricaoParagrafos.filter((p) => p.trim()),
      };

      if (editando && projetoExistente) {
        await projetosApi.atualizar(projetoExistente.id, payload);
      } else {
        await projetosApi.criar(payload);
      }
      navigate("/admin");
    } catch (err: any) {
      setErro(err?.response?.data?.erro || "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <>
        <AdminBar />
        <div className="admin-shell">
          <div className="wrap">
            <p className="muted">Carregando…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminBar />
      <div className="admin-shell">
        <div className="wrap">
          <form onSubmit={handleSubmit}>
            {/* === Informações básicas === */}
            <div className="admin-card">
              <h2>{editando ? "Editar projeto" : "Novo projeto"}</h2>

              {erro && <div className="error-msg">{erro}</div>}

              <div className="field">
                <label>Título</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => {
                    atualizar("titulo", e.target.value);
                    // Auto-gera slug se ainda não foi preenchido manualmente.
                    if (!editando && !form.slug) atualizar("slug", gerarSlug(e.target.value));
                  }}
                  required
                />
              </div>

              <div className="field">
                <label>Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => atualizar("slug", gerarSlug(e.target.value))}
                  required
                />
                <span className="muted" style={{ fontSize: 12 }}>
                  Aparece em /projetos/{form.slug || "exemplo"}
                </span>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Tipo</label>
                  <select value={form.tipo} onChange={(e) => atualizar("tipo", e.target.value)}>
                    <option value="Real">Projeto Real</option>
                    <option value="Estudo">Projeto de Estudo</option>
                  </select>
                </div>
                <div className="field">
                  <label>Ano</label>
                  <input
                    type="number"
                    value={form.ano}
                    onChange={(e) => atualizar("ano", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Categoria</label>
                  <input
                    type="text"
                    value={form.categoria}
                    onChange={(e) => atualizar("categoria", e.target.value)}
                    placeholder="Residencial, Comercial, Interiores…"
                    required
                  />
                </div>
                <div className="field">
                  <label>Área (m²)</label>
                  <input
                    type="number"
                    value={form.areaM2 ?? ""}
                    onChange={(e) => atualizar("areaM2", e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Localização</label>
                  <input
                    type="text"
                    value={form.localizacao ?? ""}
                    onChange={(e) => atualizar("localizacao", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Duração</label>
                  <input
                    type="text"
                    value={form.duracao ?? ""}
                    onChange={(e) => atualizar("duracao", e.target.value)}
                    placeholder="ex: 10 meses"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Cliente</label>
                  <input
                    type="text"
                    value={form.cliente ?? ""}
                    onChange={(e) => atualizar("cliente", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Status</label>
                  <input
                    type="text"
                    value={form.status ?? ""}
                    onChange={(e) => atualizar("status", e.target.value)}
                    placeholder="Construído, Em obra, Render…"
                  />
                </div>
              </div>

              <div className="field">
                <label>Ferramentas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={form.ferramentas.join(", ")}
                  onChange={(e) =>
                    atualizar(
                      "ferramentas",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="AutoCAD, SketchUp, Lumion, Photoshop"
                />
              </div>
            </div>

            {/* === Capa === */}
            <div className="admin-card">
              <h2>Capa do projeto</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Imagem principal exibida no card e no topo da página de detalhe (16:9).
              </p>
              <ImageUploader url={form.capaUrl} onChange={(url) => atualizar("capaUrl", url || "")} />
            </div>

            {/* === Descrição === */}
            <div className="admin-card">
              <h2>Descrição</h2>
              {form.descricaoParagrafos.map((p, i) => (
                <div className="field" key={i}>
                  <label>Parágrafo {i + 1}</label>
                  <textarea
                    value={p}
                    onChange={(e) => setParagrafo(i, e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => atualizar("descricaoParagrafos", [...form.descricaoParagrafos, ""])}
                >
                  + Adicionar parágrafo
                </button>
                {form.descricaoParagrafos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      atualizar(
                        "descricaoParagrafos",
                        form.descricaoParagrafos.slice(0, -1)
                      )
                    }
                  >
                    − Remover último
                  </button>
                )}
              </div>

              <div className="field" style={{ marginTop: 18 }}>
                <label>Citação destacada (opcional)</label>
                <textarea
                  value={form.citacao ?? ""}
                  onChange={(e) => atualizar("citacao", e.target.value)}
                  rows={2}
                  placeholder="Uma frase que resume o projeto"
                />
              </div>
            </div>

            {/* === Galeria === */}
            <div className="admin-card">
              <h2>Galeria</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Imagens adicionais. Cada uma pode ter descrição que aparece no hover.
              </p>

              {/* Botão de upload da galeria. */}
              <label className="image-uploader" style={{ display: "block" }}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) adicionarImagemGaleria(f);
                    e.target.value = "";
                  }}
                />
                <p style={{ fontWeight: 600 }}>+ Adicionar imagem à galeria</p>
                <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
                  Você pode adicionar várias imagens
                </p>
              </label>

              {/* Grid de imagens já adicionadas. */}
              {form.galeria.length > 0 && (
                <div className="gallery-editor">
                  {form.galeria.map((img, idx) => (
                    <div key={idx}>
                      <div className="image-preview">
                        <img src={img.url} alt="" />
                        <button
                          type="button"
                          className="remove"
                          onClick={() => removerImagem(idx)}
                        >
                          Remover
                        </button>
                      </div>
                      <input
                        type="text"
                        className="cap"
                        placeholder="Descrição (aparece no hover)"
                        value={img.descricao ?? ""}
                        onChange={(e) => setDescricaoImagem(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* === Ações de salvar/cancelar === */}
            <div className="admin-actions">
              <button type="submit" className="btn" disabled={salvando}>
                {salvando ? "Salvando…" : editando ? "Salvar alterações" : "Criar projeto"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/admin")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
