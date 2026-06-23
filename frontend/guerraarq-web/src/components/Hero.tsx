// Seção principal (banner) — primeira coisa que o visitante vê.
// Inclui título grande, lead, CTAs e os contadores animados.

import type { StudioInfo } from "../lib/api";
import Counter from "./Counter";

interface Props {
  studio: StudioInfo | null;
}

export default function Hero({ studio }: Props) {
  // Pega os valores das stats. Se a API ainda não respondeu, usa fallback.
  const totalProjetos = studio?.totalProjetos ?? 0;
  const anosEstudio = studio?.anosDeEstudio ?? 0;
  const customLabel = studio?.statCustomLabel || "Sob medida";
  const customValor = studio?.statCustomValor || "100%";

  return (
    <section className="hero wrap" id="top">
      <div className="hero-grid">
        <div className="hero-text">
          <span className="eyebrow" data-reveal>
            Estúdio de arquitetura · Brasil
          </span>

          {/* Título principal — usamos data-reveal-mask pra efeito de "cortina". */}
          <h1 data-reveal data-reveal-mask>
            Projetos que<br />traduzem o jeito<br />de <em>viver e habitar.</em>
          </h1>

          <p className="lead" data-reveal>
            Desenhamos espaços residenciais e comerciais com foco em luz natural,
            materialidade e funcionalidade — do estudo conceitual à entrega final.
          </p>

          {/* Botões de chamada — Ver projetos rola até a seção; Iniciar projeto rola pro contato. */}
          <div className="hero-cta" data-reveal>
            <a href="#projetos" className="btn">
              Ver projetos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#contato" className="btn btn-ghost">
              Iniciar um projeto
            </a>
          </div>

          {/* Contadores animados — usa o componente Counter que re-anima
              automaticamente quando o valor muda (importante: os dados vêm da API
              depois do primeiro render). */}
          <div className="hero-meta" data-reveal>
            <div>
              <b>
                <Counter value={totalProjetos} prefix="+" />
              </b>
              <span>Projetos</span>
            </div>
            <div>
              <b>
                <Counter value={anosEstudio} />
              </b>
              <span>Anos de estúdio</span>
            </div>
            <div>
              <b>{customValor}</b>
              <span>{customLabel}</span>
            </div>
          </div>
        </div>

        {/* Foto do arquiteto — se cadastrada, mostra; senão, placeholder. */}
        <div className="hero-photo" data-reveal>
          {studio?.fotoArquitetaUrl ? (
            <img
              src={studio.fotoArquitetaUrl}
              alt="Foto do arquiteto"
              className="photo-real"
              style={{ aspectRatio: "4 / 5", borderRadius: "var(--r)", width: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="ph" data-label="sua foto profissional · 4:5"></div>
          )}
          <div className="photo-tag">
            <span className="dot"></span> retrato / estúdio
          </div>
          <div className="float-badge">
            <b>Guerra Arq</b>
            <span>Arquiteto responsável</span>
          </div>
        </div>
      </div>
    </section>
  );
}
