// Faixa horizontal com texto rolando infinitamente.
// O loop é puro CSS (keyframes "marq"). Duplicamos o conteúdo pra dar continuidade.

export default function Marquee() {
  // Conteúdo da faixa — palavras-chave que descrevem o estúdio.
  const Track = () => (
    <div className="item">
      <b>Arquitetura Residencial</b>
      <span className="di"></span>
      <b className="alt">Projetos Reais</b>
      <span className="di"></span>
      <b>Interiores</b>
      <span className="di"></span>
      <b className="alt">Estudos Conceituais</b>
      <span className="di"></span>
      <b>Comercial</b>
      <span className="di"></span>
    </div>
  );

  return (
    <div className="marquee" aria-hidden="true">
      {/* Duas trilhas idênticas que rolam juntas — quando uma sai, a outra entra. */}
      <div className="marquee-track">
        <Track />
        <Track />
      </div>
    </div>
  );
}
