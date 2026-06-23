// Dashboard do admin — lista todos os projetos com opções de editar/excluir.
// Botão "Novo projeto" leva pro formulário em branco.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminBar from "../../components/AdminBar";
import { projetosApi, type Projeto } from "../../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Função que recarrega a lista — usada após excluir um projeto.
  function recarregar() {
    setCarregando(true);
    projetosApi
      .listar()
      .then(setProjetos)
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    recarregar();
  }, []);

  // Exclui após confirmação. window.confirm é simples e suficiente pro admin.
  async function excluir(p: Projeto) {
    if (!window.confirm(`Excluir o projeto "${p.titulo}"? Esta ação é permanente.`)) return;
    try {
      await projetosApi.excluir(p.id);
      recarregar();
    } catch {
      alert("Erro ao excluir.");
    }
  }

  return (
    <>
      <AdminBar />
      <div className="admin-shell">
        <div className="wrap">
          {/* Cabeçalho do dashboard com botão de criar. */}
          <div className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ margin: 0 }}>Projetos cadastrados</h2>
              <button className="btn" onClick={() => navigate("/admin/projetos/novo")}>
                + Novo projeto
              </button>
            </div>

            {carregando && <p className="muted" style={{ marginTop: 18 }}>Carregando…</p>}

            {!carregando && projetos.length === 0 && (
              <p className="muted" style={{ marginTop: 18 }}>
                Nenhum projeto cadastrado ainda. Clica em "Novo projeto" pra começar.
              </p>
            )}

            {/* Lista de projetos. Cada item tem thumb + meta + ações. */}
            {!carregando && projetos.length > 0 && (
              <div className="admin-list" style={{ marginTop: 18 }}>
                {projetos.map((p) => (
                  <div key={p.id} className="admin-list-item">
                    {p.capaUrl ? (
                      <img src={p.capaUrl} alt={p.titulo} />
                    ) : (
                      <div className="ph" style={{ width: 60, height: 60, borderRadius: 8 }}></div>
                    )}
                    <div className="meta">
                      <b>{p.titulo}</b>
                      <span>
                        {p.categoria} · {p.tipo} · {p.ano}
                      </span>
                    </div>
                    <div className="actions">
                      <Link to={`/projetos/${p.slug}`} className="btn btn-ghost btn-sm" target="_blank">
                        Ver
                      </Link>
                      <Link to={`/admin/projetos/${p.id}`} className="btn btn-sm">
                        Editar
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => excluir(p)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
