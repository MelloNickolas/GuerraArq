// Helper que aplica transformações on-the-fly nas URLs do Cloudinary.
// Em vez de servir a imagem original (que pode ter MB de tamanho), pedimos
// uma versão otimizada — redimensionada e em formato moderno (WebP/AVIF).
// O Cloudinary faz a conversão na primeira vez e cacheia no CDN global.

/**
 * Insere transformações no caminho da URL do Cloudinary.
 * Ex: https://res.cloudinary.com/X/image/upload/v123/foto.jpg
 *   → https://res.cloudinary.com/X/image/upload/w_800,q_auto,f_auto/v123/foto.jpg
 *
 * Se a URL não for do Cloudinary, devolve sem alterar.
 */
export function cldUrl(
  url: string | null | undefined,
  opts: {
    width?: number; // largura em pixels (altura ajusta proporcionalmente)
    height?: number;
    crop?: "fill" | "fit" | "limit" | "scale"; // modo de corte
    quality?: "auto" | number;
  } = {}
): string {
  if (!url) return "";
  // Só aplica transformação se for URL do Cloudinary.
  if (!url.includes("res.cloudinary.com")) return url;

  // Monta a string de transformações separada por vírgulas.
  const params: string[] = [];
  if (opts.width) params.push(`w_${opts.width}`);
  if (opts.height) params.push(`h_${opts.height}`);
  if (opts.crop) params.push(`c_${opts.crop}`);
  // q_auto = Cloudinary escolhe a melhor qualidade pro tamanho do arquivo.
  // f_auto = entrega WebP/AVIF se o navegador aceitar, senão JPG/PNG.
  params.push(`q_${opts.quality ?? "auto"}`);
  params.push("f_auto");

  const transformacao = params.join(",");

  // Injeta logo depois de "/upload/".
  return url.replace("/upload/", `/upload/${transformacao}/`);
}

/**
 * Gera srcSet com múltiplas resoluções pra o navegador escolher
 * a melhor de acordo com a tela do usuário (retina, mobile, etc.).
 */
export function cldSrcSet(url: string, larguras: number[] = [400, 800, 1200, 1600]): string {
  if (!url || !url.includes("res.cloudinary.com")) return "";
  return larguras
    .map((w) => `${cldUrl(url, { width: w, crop: "limit" })} ${w}w`)
    .join(", ");
}

/**
 * Gera URL de um placeholder minúsculo e borrado da imagem (~1-3 KB).
 * Usado pra mostrar uma "prévia" instantânea enquanto a versão final carrega.
 * Técnica chamada "blur-up" — mesma usada pelo Instagram e Medium.
 */
export function cldPlaceholder(url: string | null | undefined): string {
  if (!url || !url.includes("res.cloudinary.com")) return "";
  // w_40 = imagem com 40px de largura (muito pequena = baixa o arquivo num piscar)
  // e_blur:1000 = aplica blur forte (pra esconder a baixa qualidade)
  // q_30 = qualidade baixa (arquivo ainda menor)
  return url.replace("/upload/", "/upload/w_40,e_blur:1000,q_30,f_auto/");
}
