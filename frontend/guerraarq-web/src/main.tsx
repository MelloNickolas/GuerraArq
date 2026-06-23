// Entrypoint do app — monta o React no <div id="root"> do index.html.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Importa o CSS global (porte do template). Substitui o CSS padrão do Vite.
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
