// Cabeçalho fixo no topo. Aparece em todas as páginas públicas.
// Inclui logo, navegação por âncoras e botão CTA pro WhatsApp.

import { Link } from "react-router-dom";
import type { StudioInfo } from "../lib/api";

interface Props {
  studio: StudioInfo | null;
}

export default function Header({ studio }: Props) {
  // Monta o link do WhatsApp se o cliente tiver cadastrado o número.
  const whatsappLink = studio?.whatsapp
    ? `https://wa.me/${studio.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Olá! Tenho interesse em conhecer o estúdio.")}`
    : "#contato";

  return (
    <header className="nav" id="nav">
      <div className="nav-in">
        {/* Logo + nome do estúdio — sempre leva pra home. */}
        <Link to="/" className="brand" aria-label="Guerra Arq — início">
          <img src="/assets/logo-green.png" alt="Guerra Arq" />
          <span className="wm">
            <b>Guerra Arq</b>
            <span>Estúdio de Arquitetura</span>
          </span>
        </Link>

        {/* Links de navegação por âncora (rolam suavemente). */}
        <nav className="links">
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
        </nav>

        {/* CTA principal — abre WhatsApp em nova aba. */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ display: "inline-flex" }}
        >
          Vamos conversar
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>

        {/* Botão hambúrguer pro mobile (visualmente só — a nav é por âncora). */}
        <button className="menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
