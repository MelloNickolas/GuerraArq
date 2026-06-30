// Componente de imagem inteligente com técnica "blur-up".
//
// Como funciona:
// 1. Mostra um placeholder borrado (~2KB) que carrega instantaneamente.
// 2. Em paralelo, baixa a imagem em alta qualidade.
// 3. Quando a alta qualidade termina, faz fade-in suave por cima do placeholder.
//
// Resultado: o usuário NUNCA vê um espaço vazio. A "sensação" de site rápido
// melhora muito, mesmo que o tempo total de download seja igual.

import { useState, type CSSProperties, type ImgHTMLAttributes } from "react";
import { cldUrl, cldPlaceholder } from "../lib/cloudinary";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  // URL original do Cloudinary.
  src: string;
  // Largura desejada da versão final (Cloudinary redimensiona).
  width?: number;
  // Modo de prioridade: "eager" pra imagens críticas (hero), "lazy" pro resto.
  priority?: "eager" | "lazy";
}

export default function SmartImage({
  src,
  width = 1000,
  priority = "lazy",
  style,
  ...rest
}: Props) {
  // Marca quando a versão final terminou de baixar.
  const [carregada, setCarregada] = useState(false);

  // Calcula as duas URLs: placeholder borrado + versão final otimizada.
  const placeholderUrl = cldPlaceholder(src);
  const fullUrl = cldUrl(src, { width, crop: "limit" });

  // Estilo combinado: o `style` que o pai passou + transição suave de opacidade.
  const imgStyle: CSSProperties = {
    transition: "opacity 0.5s ease",
    opacity: carregada ? 1 : 0,
    ...style,
  };

  const placeholderStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(20px)",
    transform: "scale(1.1)", // evita ver bordas borradas
    transition: "opacity 0.5s ease",
    opacity: carregada ? 0 : 1,
    ...style,
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      {/* Placeholder borrado por baixo. Carrega instantâneo. */}
      {placeholderUrl && (
        <img
          src={placeholderUrl}
          alt=""
          aria-hidden="true"
          style={placeholderStyle}
        />
      )}

      {/* Imagem real por cima. Faz fade-in quando carregar. */}
      <img
        {...rest}
        src={fullUrl}
        loading={priority}
        // Em navegadores modernos, dica de prioridade pro browser baixar mais cedo.
        // @ts-ignore — fetchpriority ainda não está no tipo padrão do React
        fetchpriority={priority === "eager" ? "high" : "auto"}
        onLoad={() => setCarregada(true)}
        style={imgStyle}
      />
    </div>
  );
}
