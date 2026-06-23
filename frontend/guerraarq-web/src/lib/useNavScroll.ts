// Hook que adiciona/remove a classe "scrolled" no <header.nav>
// conforme o usuário rola a página (>20px = scrolled).
// Cria o efeito de blur translúcido no header quando rola.

import { useEffect } from "react";

export function useNavScroll() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    };

    onScroll(); // estado inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
