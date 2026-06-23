// Contador animado em React.
// Anima de 0 até o valor final usando requestAnimationFrame com easing cubic.
// Re-anima sempre que o `value` muda (importante porque o valor vem da API
// e chega depois do primeiro render).

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duracao?: number; // duração da animação em ms
}

export default function Counter({ value, prefix = "", suffix = "", duracao = 1100 }: Props) {
  // Valor exibido na tela — começa em 0 e sobe gradualmente.
  const [display, setDisplay] = useState(0);

  // Guarda o handle da animação atual pra poder cancelar se o valor mudar no meio.
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Se o valor é zero ou negativo, mostra direto sem animar.
    if (value <= 0) {
      setDisplay(0);
      return;
    }

    // Cancela qualquer animação em andamento.
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const t0 = performance.now();
    const inicial = 0; // sempre anima do zero pro novo valor

    function tick(now: number) {
      // Calcula o progresso (0 a 1).
      const p = Math.min(1, (now - t0) / duracao);
      // Easing cubic-out: começa rápido, desacelera no final.
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(inicial + (value - inicial) * eased));
      if (p < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    // Limpeza: cancela animação se o componente desmontar ou value mudar.
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duracao]);

  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}
