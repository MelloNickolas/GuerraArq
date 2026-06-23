// Hook que ativa as animações de "reveal" (fade + slide) ao rolar a página.
// Equivalente ao IntersectionObserver do HTML original, mas isolado em React.
// Uso: chama useReveal() em qualquer página/componente que tenha
// elementos com [data-reveal] ou [data-reveal-mask].

import { useEffect } from "react";

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    // Coleta todos os elementos marcados pra revelar.
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-mask]")
    );

    // Aplica delay incremental pra dar efeito cascata (até 6 elementos).
    els.forEach((el, i) => {
      if (el.hasAttribute("data-reveal")) {
        el.style.transitionDelay = `${Math.min(i, 6) * 55}ms`;
      }
    });

    // Função que marca um elemento como "revelado" (adiciona classe .in).
    const reveal = (el: HTMLElement) => {
      el.classList.add("in");
      // Se tiver contador animado dentro, dispara também.
      el.querySelectorAll<HTMLElement>("[data-count]").forEach(runCount);
      if (el.hasAttribute("data-count")) runCount(el);
    };

    // Helper: checa se elemento já está visível na viewport.
    const inView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 0) * 0.95 && r.bottom > 0;
    };

    // Cria o observer — quando um elemento entra na tela, revela e para de observar.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Safety net: revela imediatamente quem já está visível ao carregar.
    requestAnimationFrame(() => {
      els.forEach((el) => {
        if (inView(el)) reveal(el);
      });
    });

    // Fallback final: depois de 1.6s, revela qualquer um que ficou pra trás.
    const t = setTimeout(() => els.forEach(reveal), 1600);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Contador animado — sobe de 0 até o valor de data-count em ~1.1s com easing.
function runCount(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseFloat(el.dataset.count || "0");
  const pre = el.dataset.prefix || "";
  const suf = el.dataset.suffix || "";
  const dur = 1100;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    // Easing cubic out — começa rápido e desacelera no final.
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + Math.round(target * e) + suf;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
