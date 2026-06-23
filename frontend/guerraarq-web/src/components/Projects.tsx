// Seção de projetos com filtros (Todos / Real / Estudo) e grid de cards.
// Cada card clicável vai pra página de detalhe do projeto (/projetos/:slug).

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Projeto } from "../lib/api";

interface Props {
  projetos: Projeto[];
}

type FilterValue = "all" | "real" | "estudo";

export default function Projects({ projetos }: Props) {
  // Estado do filtro ativo (default: Todos).
  const [filter, setFilter] = useState<FilterValue>("all");

  // Contadores por categoria — calculados uma única vez quando a lista muda.
  const counts = useMemo(() => {
    const total = projetos.length;
    const real = projetos.filter((p) => p.tipo.toLowerCase() === "real").length;
    const estudo = projetos.filter((p) => p.tipo.toLowerCase() === "estudo").length;
    return { all: total, real, estudo };
  }, [projetos]);

  // Helper pra formatar contagem com zero à esquerda (06 em vez de 6).
  const fmt = (n: number) => String(n).padStart(2, "0");

  // Decide se um projeto entra no filtro atual.
  // OBS: usado pra adicionar/remover classe CSS — NÃO removemos do DOM, senão
  // os data-reveal de cards reaparecidos nunca seriam observados (ficariam invisíveis).
  const visivel = (p: Projeto) => {
    if (filter === "all") return true;
    return p.tipo.toLowerCase() === filter;
  };

  return (
    <section className="section wrap" id="projetos">
      <div className="sec-head">
        <div>
          <span className="eyebrow" data-reveal>
            Portfólio
          </span>
          <h2 data-reveal>Projetos selecionados</h2>
        </div>
        <p data-reveal>
          Uma seleção de trabalhos entre realizações construídas e estudos conceituais.
        </p>
      </div>

      {/* Botões de filtro — cada um com seu contador e cor de "bolinha". */}
      <div className="filters" data-reveal>
        <button
          className={`filter ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todos <span className="count">{fmt(counts.all)}</span>
        </button>
        <button
          className={`filter ${filter === "real" ? "active" : ""}`}
          onClick={() => setFilter("real")}
        >
          <span className="d real"></span> Projeto Real{" "}
          <span className="count">{fmt(counts.real)}</span>
        </button>
        <button
          className={`filter ${filter === "estudo" ? "active" : ""}`}
          onClick={() => setFilter("estudo")}
        >
          <span className="d estudo"></span> Projeto de Estudo{" "}
          <span className="count">{fmt(counts.estudo)}</span>
        </button>
      </div>

      {/* Grid 2 colunas (1 no mobile) com os cards de projeto. */}
      <div className="grid" id="projectGrid">
        {projetos.length === 0 && (
          <p className="muted">Nenhum projeto cadastrado ainda.</p>
        )}

        {projetos.map((p) => {
          const ehReal = p.tipo.toLowerCase() === "real";
          // Renderiza todos sempre — quem não bate com o filtro recebe classe .hide
          // (CSS faz display:none) mas continua no DOM.
          const oculto = !visivel(p);
          return (
            <Link
              key={p.id}
              to={`/projetos/${p.slug}`}
              // Sem data-reveal: os cards aparecem com animação CSS própria
              // ao montar, independente do IntersectionObserver (mais confiável
              // quando os dados chegam async).
              className={`card card-fade-in ${oculto ? "hide" : ""}`}
            >
              <div className="thumb">
                {/* Badge "Real" ou "Estudo" no canto superior esquerdo. */}
                <div className={`badge ${ehReal ? "real" : "estudo"}`}>
                  <span className="d"></span>
                  {ehReal ? "Projeto Real" : "Projeto de Estudo"}
                </div>

                {/* Setinha que aparece no hover (canto inferior direito). */}
                <div className="arrow-pill">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </div>

                {/* Imagem real ou placeholder, dependendo se tem capa. */}
                <div className="imgscale">
                  {p.capaUrl ? (
                    <img src={p.capaUrl} alt={p.titulo} className="imgreal" />
                  ) : (
                    <div className="ph" data-label="foto do projeto · 16:11"></div>
                  )}
                </div>
              </div>

              {/* Título + ano. */}
              <div className="card-meta">
                <h3>{p.titulo}</h3>
                <span className="yr">{p.ano}</span>
              </div>

              {/* Descrição curta — primeira linha do primeiro parágrafo. */}
              <p className="desc">
                {p.descricaoParagrafos?.[0]?.slice(0, 110) || "Projeto autoral do estúdio."}
              </p>

              {/* Tags: categoria, área (se houver), status. */}
              <div className="tags">
                <span>{p.categoria}</span>
                {p.areaM2 && <span>{p.areaM2} m²</span>}
                {p.status && <span>{p.status}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
