// Lightbox = modal de imagem em tela cheia.
// Abre ao clicar numa imagem da galeria, com navegação por setas e tecla ESC pra fechar.

import { useEffect, useCallback } from "react";
import type { GaleriaItem } from "../lib/api";

interface Props {
  // Lista completa de imagens da galeria (pra navegação).
  imagens: GaleriaItem[];
  // Índice da imagem atualmente aberta. null = lightbox fechado.
  indice: number | null;
  // Callbacks pra fechar e navegar.
  onClose: () => void;
  onNavegar: (novoIndice: number) => void;
}

export default function Lightbox({ imagens, indice, onClose, onNavegar }: Props) {
  // Determina se o lightbox está aberto.
  const aberto = indice !== null && indice >= 0 && indice < imagens.length;
  const imagem = aberto ? imagens[indice] : null;

  // Navegação circular: passa do último volta pro primeiro e vice-versa.
  const proxima = useCallback(() => {
    if (indice === null) return;
    onNavegar((indice + 1) % imagens.length);
  }, [indice, imagens.length, onNavegar]);

  const anterior = useCallback(() => {
    if (indice === null) return;
    onNavegar((indice - 1 + imagens.length) % imagens.length);
  }, [indice, imagens.length, onNavegar]);

  // === Atalhos de teclado ===
  // ESC fecha, ← e → navegam.
  useEffect(() => {
    if (!aberto) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") proxima();
      else if (e.key === "ArrowLeft") anterior();
    }

    window.addEventListener("keydown", handleKey);

    // Trava o scroll do body enquanto o lightbox está aberto
    // (pra não rolar a página por trás).
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto, onClose, proxima, anterior]);

  // Se não tá aberto, não renderiza nada.
  if (!aberto || !imagem) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Botão de fechar (X) no canto superior direito. */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Fechar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Setas de navegação — só aparecem se tem mais de uma imagem. */}
      {imagens.length > 1 && (
        <>
          <button
            className="lightbox-arrow left"
            onClick={(e) => {
              e.stopPropagation(); // evita fechar ao clicar na seta
              anterior();
            }}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="lightbox-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              proxima();
            }}
            aria-label="Próxima"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}

      {/* Contêiner da imagem — stopPropagation pra não fechar ao clicar nela. */}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={imagem.url} alt={imagem.descricao || ""} />

        {/* Descrição + contador (1 / 6). */}
        <div className="lightbox-caption">
          {imagem.descricao && <p>{imagem.descricao}</p>}
          <span className="lightbox-counter">
            {(indice ?? 0) + 1} / {imagens.length}
          </span>
        </div>
      </div>
    </div>
  );
}
