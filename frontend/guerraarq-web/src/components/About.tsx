// Seção "Sobre" — apresentação do estúdio com foto + texto + lista de serviços.
// Todos os textos vêm das infos cadastradas no admin (com fallback genérico).

import type { StudioInfo } from "../lib/api";

interface Props {
  studio: StudioInfo | null;
}

export default function About({ studio }: Props) {
  // Pega parágrafos cadastrados ou usa textos genéricos.
  const paragrafos =
    studio?.sobreParagrafos?.length
      ? studio.sobreParagrafos
      : [
          "O Guerra Arq é um estúdio dedicado a projetos residenciais e comerciais sob medida, do conceito à obra. Acreditamos que bons espaços nascem do equilíbrio entre função, luz e materialidade.",
          "Cada projeto começa por entender a rotina, os desejos e o terreno — para então traduzir tudo isso em desenho.",
        ];

  const servicos =
    studio?.servicos?.length
      ? studio.servicos
      : ["Arquitetura residencial", "Projetos comerciais", "Design de interiores", "Consultoria & estudos"];

  // Texto do ano de fundação no chip flutuante.
  const desdeAno = studio?.anoFundacao ? `desde ${studio.anoFundacao}` : "Estúdio de arquitetura";

  return (
    <section className="section wrap" id="sobre">
      <div className="about-grid">
        {/* Lado esquerdo: foto do estúdio com chip flutuante. */}
        <div className="about-media" data-reveal>
          <div className="frame">
            {studio?.fotoEstudioUrl ? (
              <img
                src={studio.fotoEstudioUrl}
                alt="Foto do estúdio do arquiteto"
                className="photo-real"
                data-parallax="0.12"
              />
            ) : (
              <div className="ph" data-parallax="0.12" data-label="foto do estúdio · 4:5"></div>
            )}
          </div>

          {/* Chip flutuante com ícone de prédio + nome e ano. */}
          <div className="about-chip">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
              </svg>
            </span>
            <div>
              <b>Guerra Arq</b>
              <span>{desdeAno}</span>
            </div>
          </div>
        </div>

        {/* Lado direito: texto e lista. */}
        <div className="about-text">
          <span className="eyebrow" data-reveal>
            Sobre
          </span>
          <h2 data-reveal>
            Arquitetura pensada<br />para <em>quem vai viver</em><br />cada metro.
          </h2>

          {/* Renderiza cada parágrafo como um <p>. */}
          {paragrafos.map((p, i) => (
            <p key={i} data-reveal>
              {p}
            </p>
          ))}

          {/* Lista numerada de serviços. */}
          <ul className="about-list">
            {servicos.map((s, i) => (
              <li key={i} data-reveal>
                <span className="n">{String(i + 1).padStart(2, "0")}</span> {s}
              </li>
            ))}
          </ul>

          {/* Assinatura estilizada. */}
          <div className="about-sign" data-reveal>
            <span className="sg">Guerra</span>
            <span className="role">Arquiteto responsável</span>
          </div>
        </div>
      </div>
    </section>
  );
}
