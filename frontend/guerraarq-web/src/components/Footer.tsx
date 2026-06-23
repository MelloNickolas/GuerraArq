// Rodapé verde com CTA de contato, colunas de links e watermark gigante.
// Todos os links sociais vêm das infos cadastradas pelo cliente no admin.

import type { StudioInfo } from "../lib/api";

interface Props {
  studio: StudioInfo | null;
}

export default function Footer({ studio }: Props) {
  // Helper: monta link do WhatsApp se houver número cadastrado.
  const whatsappLink = studio?.whatsapp
    ? `https://wa.me/${studio.whatsapp.replace(/\D/g, "")}`
    : null;

  // Link de email com mailto: se houver email cadastrado.
  const emailLink = studio?.email ? `mailto:${studio.email}` : null;

  return (
    <footer id="contato">
      <div className="wrap">
        {/* Bloco grande de CTA: título + botão de contato (WhatsApp). */}
        <div className="foot-cta">
          <div>
            <span className="eyebrow light" data-reveal>
              Contato
            </span>
            <h2 data-reveal style={{ marginTop: 18 }}>
              Vamos projetar
              <br />o seu espaço.
            </h2>
          </div>
          <div data-reveal>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light"
              >
                Falar no WhatsApp
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            ) : emailLink ? (
              <a href={emailLink} className="btn btn-light">
                {studio?.email}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>

        {/* Colunas com brand, navegação, serviços, social. */}
        <div className="foot-cols">
          <div className="foot-brand">
            <img src="/assets/logo-white.png" alt="Guerra Arq" />
            <p>
              {studio?.sobreParagrafos?.[0] ||
                "Estúdio de arquitetura dedicado a projetos residenciais e comerciais sob medida."}
            </p>
          </div>

          <div className="foot-col">
            <h4>Navegar</h4>
            <a href="/#projetos">Projetos</a>
            <a href="/#sobre">Sobre</a>
            {studio?.instagram && (
              <a
                href={`https://instagram.com/${studio.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            )}
            <a href="/#contato">Contato</a>
          </div>

          <div className="foot-col">
            <h4>Serviços</h4>
            {(studio?.servicos?.length
              ? studio.servicos
              : ["Arquitetura residencial", "Projetos comerciais", "Interiores", "Consultoria"]
            ).map((s, i) => (
              <a key={i}>{s}</a>
            ))}
          </div>

          <div className="foot-col">
            <h4>Social</h4>
            {studio?.instagram && (
              <a
                href={`https://instagram.com/${studio.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            )}
            {studio?.pinterest && (
              <a
                href={`https://pinterest.com/${studio.pinterest}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pinterest
              </a>
            )}
            {studio?.linkedin && (
              <a href={studio.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Linha do rodapé (copyright + localização). */}
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Guerra Arq — Todos os direitos reservados</span>
          <span>Brasil · Disponível para novos projetos</span>
        </div>
      </div>

    </footer>
  );
}
