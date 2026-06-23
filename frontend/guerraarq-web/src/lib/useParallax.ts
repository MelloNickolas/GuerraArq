// Hook que aplica parallax suave aos elementos com [data-parallax].
// O valor do atributo é a velocidade (ex: data-parallax="0.12").
// Calcula um translateY proporcional à distância do centro da tela.

import { useEffect } from "react";

export function useParallax(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let ticking = false;

    function apply() {
      const vh = window.innerHeight || 1;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        // Pula elementos longe da tela — economiza CPU.
        if (r.bottom < -200 || r.top > vh + 200) return;
        const off = (r.top + r.height / 2 - vh / 2) / vh;
        const sp = parseFloat(el.dataset.parallax || "0.1");
        el.style.transform = `translate3d(0, ${(-off * sp * 100).toFixed(1)}px, 0)`;
      });
      ticking = false;
    }

    // requestAnimationFrame evita executar mais de uma vez por frame.
    function req() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }

    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    apply();

    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
