// Página de detalhe de um projeto — busca pelo slug na URL.
// Mostra capa, especificações (sidebar sticky), descrição e galeria com hover.

import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Lightbox from "../components/Lightbox";
import { projetosApi, studioApi, type Projeto, type StudioInfo } from "../lib/api";
import { useReveal } from "../lib/useReveal";
import { useNavScroll } from "../lib/useNavScroll";
import { cldUrl } from "../lib/cloudinary";
import SmartImage from "../components/SmartImage";

export default function ProjetoDetalhe() {
  // Pega o slug da URL (/projetos/:slug).
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [studio, setStudio] = useState<StudioInfo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Estado do lightbox: null = fechado, número = índice da imagem aberta.
  const [lightboxIndice, setLightboxIndice] = useState<number | null>(null);

  // Busca o projeto + info do estúdio. Se não achar projeto, marca erro.
  useEffect(() => {
    if (!slug) return;
    setCarregando(true);
    setErro(false);
    // Volta o scroll pro topo ao trocar de projeto.
    window.scrollTo(0, 0);

    Promise.all([projetosApi.obter(slug), studioApi.obter()])
      .then(([p, s]) => {
        setProjeto(p);
        setStudio(s);
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [slug]);

  useReveal([carregando, projeto?.id]);
  useNavScroll();

  // Estados de carregamento e erro.
  if (carregando) {
    return (
      <>
        <Header studio={studio} />
        <div className="wrap" style={{ paddingTop: 200, paddingBottom: 200, textAlign: "center" }}>
          <p className="muted">Carregando…</p>
        </div>
      </>
    );
  }

  if (erro || !projeto) {
    return (
      <>
        <Header studio={studio} />
        <div className="wrap" style={{ paddingTop: 200, paddingBottom: 200, textAlign: "center" }}>
          <h2>Projeto não encontrado</h2>
          <button className="btn" onClick={() => navigate("/")} style={{ marginTop: 20 }}>
            Voltar ao portfólio
          </button>
        </div>
        <Footer studio={studio} />
      </>
    );
  }

  const ehReal = projeto.tipo.toLowerCase() === "real";

  // Helper pra escolher classes de tamanho diferentes pra cada imagem da galeria,
  // criando o efeito masonry sem ter que cadastrar isso no admin.
  // Repete um padrão: wide, tall, square, square, panorama, wide…
  const galleryClasses = ["s4", "s2-tall", "s2", "s2", "s6", "s3"];

  return (
    <>
      <Header studio={studio} />

      {/* Cabeçalho do projeto: breadcrumb + badge + título + descrição curta. */}
      <section className="phead wrap" data-reveal>
        <div className="crumb">
          <Link to="/#projetos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Projetos
          </Link>
          <span>/</span>
          <span>{projeto.titulo}</span>
        </div>

        <span className={`badge inline ${ehReal ? "real" : "estudo"}`}>
          <span className="d"></span>
          {ehReal ? "Projeto Real" : "Projeto de Estudo"}
        </span>

        <h1 className="ptitle">{projeto.titulo}</h1>
        <p className="ptag">
          {projeto.categoria}
          {projeto.localizacao && ` · ${projeto.localizacao}`}
          {projeto.ano && ` · ${projeto.ano}`}
        </p>

        {/* Imagem grande de capa. */}
        <div className="featured" data-reveal>
          <div className="frame">
            {projeto.capaUrl ? (
              <SmartImage
                src={projeto.capaUrl}
                width={1600}
                alt={projeto.titulo}
                className="photo-real"
                priority="eager"
              />
            ) : (
              <div className="ph" data-label="capa do projeto · 16:9"></div>
            )}
          </div>
        </div>
      </section>

      {/* Grid com sidebar de specs (sticky) + corpo de descrição. */}
      <section className="info wrap">
        <div className="info-grid">
          {/* === Coluna esquerda: especificações === */}
          <aside className="spec" data-reveal>
            {projeto.categoria && (
              <div className="row">
                <span className="lbl">Ramo</span>
                <span className="val">{projeto.categoria}</span>
              </div>
            )}
            {projeto.ferramentas?.length > 0 && (
              <div className="row">
                <span className="lbl">Ferramentas</span>
                <div className="tags">
                  {projeto.ferramentas.map((f, i) => (
                    <span key={i}>{f}</span>
                  ))}
                </div>
              </div>
            )}
            {projeto.cliente && (
              <div className="row">
                <span className="lbl">Cliente</span>
                <span className="val">{projeto.cliente}</span>
              </div>
            )}
            {projeto.duracao && (
              <div className="row">
                <span className="lbl">Duração</span>
                <span className="val">{projeto.duracao}</span>
              </div>
            )}
            <div className="row">
              <span className="lbl">Ano / Área</span>
              <span className="val">
                {projeto.ano}
                {projeto.areaM2 ? ` · ${projeto.areaM2.toLocaleString("pt-BR")} m²` : ""}
              </span>
            </div>
            {projeto.status && (
              <div className="row">
                <span className="lbl">Status</span>
                <span className="val">{projeto.status}</span>
              </div>
            )}
          </aside>

          {/* === Coluna direita: descrição === */}
          <div className="desc-body" data-reveal>
            <h3>Sobre o projeto</h3>
            {projeto.descricaoParagrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {projeto.citacao && <blockquote>{projeto.citacao}</blockquote>}
          </div>
        </div>
      </section>

      {/* === Galeria === */}
      {projeto.galeria?.length > 0 && (
        <section className="wrap" data-reveal>
          <div className="gallery">
            {projeto.galeria.map((img, i) => (
              <div
                key={img.id ?? i}
                className={`gimg ${galleryClasses[i % galleryClasses.length]}`}
                // Clicar abre o lightbox no índice correspondente.
                onClick={() => setLightboxIndice(i)}
              >
                {/* Galeria: SmartImage com blur-up + lazy loading. */}
                <SmartImage
                  src={img.url}
                  width={1000}
                  alt={img.descricao || `Imagem ${i + 1}`}
                  priority="lazy"
                />
                {img.descricao && <div className="cap">{img.descricao}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA pra voltar pra lista. */}
      <section className="wrap" style={{ padding: "40px 0 80px", textAlign: "center" }}>
        <Link to="/#projetos" className="btn btn-ghost">
          Ver todos os projetos
        </Link>
      </section>

      <Footer studio={studio} />

      {/* Lightbox renderizado no final — só aparece quando lightboxIndice != null. */}
      <Lightbox
        imagens={projeto.galeria}
        indice={lightboxIndice}
        onClose={() => setLightboxIndice(null)}
        onNavegar={setLightboxIndice}
      />
    </>
  );
}
