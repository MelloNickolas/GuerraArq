// Página inicial — concatena todas as seções do portfólio.
// Faz uma única chamada à API ao montar pra buscar projetos + info do estúdio.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Projects from "../components/Projects";
import Footer from "../components/Footer";
import { projetosApi, studioApi, type Projeto, type StudioInfo } from "../lib/api";
import { useReveal } from "../lib/useReveal";
import { useParallax } from "../lib/useParallax";
import { useNavScroll } from "../lib/useNavScroll";

export default function Home() {
  // Estados pra armazenar o que veio da API.
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [studio, setStudio] = useState<StudioInfo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const location = useLocation();

  // Busca dados quando o componente monta. Promise.all faz as duas chamadas em paralelo.
  useEffect(() => {
    Promise.all([projetosApi.listar(), studioApi.obter()])
      .then(([projs, st]) => {
        setProjetos(projs);
        setStudio(st);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
      })
      .finally(() => setCarregando(false));
  }, []);

  // Ativa as animações de scroll/parallax/nav assim que os dados chegam.
  // Dependência [carregando, projetos.length] garante que rodam depois do render real.
  useReveal([carregando, projetos.length]);
  useParallax([carregando]);
  useNavScroll();

  // Rolagem suave pra âncoras quando vem de outra página (#sobre, #projetos, etc.)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location, carregando]);

  return (
    <>
      <Header studio={studio} />
      <Hero studio={studio} />
      <Marquee />
      <About studio={studio} />
      <Projects projetos={projetos} />
      <Footer studio={studio} />
    </>
  );
}
