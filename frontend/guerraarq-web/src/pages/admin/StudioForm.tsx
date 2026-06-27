// Formulário pra editar informações do estúdio (registro singleton).
// Todos os campos do StudioInfo aparecem aqui.

import { useEffect, useState, type FormEvent } from "react";
import AdminBar from "../../components/AdminBar";
import ImageUploader from "../../components/ImageUploader";
import { studioApi, type StudioInfo } from "../../lib/api";

// Forma do payload (StudioInfo sem os campos calculados que vêm só no GET).
type StudioForm = Omit<StudioInfo, "totalProjetos" | "anosDeEstudio">;

const inicial: StudioForm = {
  whatsapp: "",
  instagram: "",
  pinterest: "",
  linkedin: "",
  email: "",
  anoFundacao: new Date().getFullYear(),
  statCustomLabel: "Sob medida",
  statCustomValor: "100%",
  heroTitulo: "",
  heroTituloDestaque: "",
  heroLead: "",
  sobreParagrafos: [""],
  servicos: ["", "", "", ""],
  fotoArquitetaUrl: null,
  fotoEstudioUrl: null,
};

export default function StudioForm() {
  const [form, setForm] = useState<StudioForm>(inicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  // Busca o registro existente ao montar.
  useEffect(() => {
    studioApi
      .obter()
      .then((s) => {
        // Remove os campos calculados antes de colocar no form.
        const { totalProjetos: _t, anosDeEstudio: _a, ...rest } = s;
        setForm({
          ...inicial,
          ...rest,
          sobreParagrafos: rest.sobreParagrafos.length ? rest.sobreParagrafos : [""],
          servicos: rest.servicos.length ? rest.servicos : ["", "", "", ""],
        });
      })
      .finally(() => setCarregando(false));
  }, []);

  // Atualiza qualquer campo do form.
  function atualizar<K extends keyof StudioForm>(campo: K, valor: StudioForm[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Ações pros parágrafos do "sobre".
  function setParagrafo(i: number, v: string) {
    const novos = [...form.sobreParagrafos];
    novos[i] = v;
    atualizar("sobreParagrafos", novos);
  }

  function setServico(i: number, v: string) {
    const novos = [...form.servicos];
    novos[i] = v;
    atualizar("servicos", novos);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setSalvando(true);
    try {
      // Limpa entradas vazias antes de enviar.
      const payload: StudioForm = {
        ...form,
        sobreParagrafos: form.sobreParagrafos.filter((p) => p.trim()),
        servicos: form.servicos.filter((s) => s.trim()),
      };
      await studioApi.atualizar(payload);
      setMensagem("Salvo com sucesso!");
      setTimeout(() => setMensagem(null), 3000);
    } catch {
      setMensagem("Erro ao salvar.");
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
            {/* === Contato e redes sociais === */}
            <div className="admin-card">
              <h2>Contato e redes sociais</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Esses valores alimentam todos os links do site (header, footer, botões).
              </p>

              <div className="field-row">
                <div className="field">
                  <label>WhatsApp (só números, com DDI)</label>
                  <input
                    type="text"
                    value={form.whatsapp ?? ""}
                    onChange={(e) => atualizar("whatsapp", e.target.value)}
                    placeholder="5511999998888"
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) => atualizar("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Instagram (handle, sem @)</label>
                  <input
                    type="text"
                    value={form.instagram ?? ""}
                    onChange={(e) => atualizar("instagram", e.target.value)}
                    placeholder="guerra.arq"
                  />
                </div>
                <div className="field">
                  <label>Pinterest (handle)</label>
                  <input
                    type="text"
                    value={form.pinterest ?? ""}
                    onChange={(e) => atualizar("pinterest", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>LinkedIn (URL completa)</label>
                <input
                  type="url"
                  value={form.linkedin ?? ""}
                  onChange={(e) => atualizar("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>
            </div>

            {/* === Identidade / Stats === */}
            <div className="admin-card">
              <h2>Identidade</h2>

              <div className="field-row">
                <div className="field">
                  <label>Ano de fundação</label>
                  <input
                    type="number"
                    value={form.anoFundacao ?? ""}
                    onChange={(e) => atualizar("anoFundacao", Number(e.target.value))}
                  />
                  <span className="muted" style={{ fontSize: 12 }}>
                    Os "anos de estúdio" são calculados a partir desse ano.
                  </span>
                </div>
                <div className="field">
                  <label>Texto destaque (3ª stat)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      value={form.statCustomValor ?? ""}
                      onChange={(e) => atualizar("statCustomValor", e.target.value)}
                      placeholder="100%"
                      style={{ flex: "0 0 30%" }}
                    />
                    <input
                      type="text"
                      value={form.statCustomLabel ?? ""}
                      onChange={(e) => atualizar("statCustomLabel", e.target.value)}
                      placeholder="Sob medida"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* === Hero (banner da home) === */}
            <div className="admin-card">
              <h2>Hero da home</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Texto grande que aparece no topo do site. A parte "destaque" fica em verde.
              </p>

              <div className="field">
                <label>Título principal</label>
                <input
                  type="text"
                  value={form.heroTitulo ?? ""}
                  onChange={(e) => atualizar("heroTitulo", e.target.value)}
                  placeholder="Projetos que traduzem o jeito de"
                />
              </div>

              <div className="field">
                <label>Trecho em destaque (verde)</label>
                <input
                  type="text"
                  value={form.heroTituloDestaque ?? ""}
                  onChange={(e) => atualizar("heroTituloDestaque", e.target.value)}
                  placeholder="viver e habitar."
                />
                <span className="muted" style={{ fontSize: 12 }}>
                  Aparece logo depois do título principal, em verde.
                </span>
              </div>

              <div className="field">
                <label>Parágrafo descritivo</label>
                <textarea
                  value={form.heroLead ?? ""}
                  onChange={(e) => atualizar("heroLead", e.target.value)}
                  rows={3}
                  placeholder="Texto curto que aparece abaixo do título principal."
                />
              </div>
            </div>

            {/* === Texto Sobre === */}
            <div className="admin-card">
              <h2>Sobre o estúdio</h2>
              {form.sobreParagrafos.map((p, i) => (
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
                  onClick={() => atualizar("sobreParagrafos", [...form.sobreParagrafos, ""])}
                >
                  + Adicionar parágrafo
                </button>
                {form.sobreParagrafos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      atualizar("sobreParagrafos", form.sobreParagrafos.slice(0, -1))
                    }
                  >
                    − Remover último
                  </button>
                )}
              </div>
            </div>

            {/* === Serviços === */}
            <div className="admin-card">
              <h2>Serviços</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Aparecem como lista numerada no "Sobre" e no rodapé.
              </p>
              {form.servicos.map((s, i) => (
                <div className="field" key={i}>
                  <label>Serviço {i + 1}</label>
                  <input
                    type="text"
                    value={s}
                    onChange={(e) => setServico(i, e.target.value)}
                  />
                </div>
              ))}
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => atualizar("servicos", [...form.servicos, ""])}
                >
                  + Adicionar serviço
                </button>
                {form.servicos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => atualizar("servicos", form.servicos.slice(0, -1))}
                  >
                    − Remover último
                  </button>
                )}
              </div>
            </div>

            {/* === Fotos === */}
            <div className="admin-card">
              <h2>Foto do arquiteto</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Aparece na hero da home (proporção 4:5).
              </p>
              <ImageUploader
                url={form.fotoArquitetaUrl}
                onChange={(url) => atualizar("fotoArquitetaUrl", url)}
              />
            </div>

            <div className="admin-card">
              <h2>Foto do estúdio</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Aparece na seção "Sobre" (proporção 4:5).
              </p>
              <ImageUploader
                url={form.fotoEstudioUrl}
                onChange={(url) => atualizar("fotoEstudioUrl", url)}
              />
            </div>

            {/* === Salvar === */}
            {mensagem && (
              <div className={mensagem.includes("Erro") ? "error-msg" : ""} style={mensagem.includes("Erro") ? {} : { background: "#e8f5e9", color: "#175943", border: "1px solid #a5d6a7", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                {mensagem}
              </div>
            )}

            <div className="admin-actions">
              <button type="submit" className="btn" disabled={salvando}>
                {salvando ? "Salvando…" : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
