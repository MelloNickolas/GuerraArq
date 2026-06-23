import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração do Vite (servidor de dev e build de produção).
// - plugin react: habilita JSX/TSX e Fast Refresh.
// - server.port: porta padrão 5173 (consistente com o CORS configurado no backend).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
