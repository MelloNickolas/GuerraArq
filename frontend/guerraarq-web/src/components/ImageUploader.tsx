// Componente reutilizável de upload de imagem.
// Aceita uma URL atual (preview) e chama onChange com a nova URL após upload.
// Usado no admin pra capa de projeto, foto do arquiteto, foto do estúdio, etc.

import { useRef, useState } from "react";
import { uploadApi } from "../lib/api";

interface Props {
  url: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function ImageUploader({ url, onChange, label = "Clique para enviar imagem" }: Props) {
  // Ref pro <input type=file> (escondido) — disparado via clique no contêiner.
  const inputRef = useRef<HTMLInputElement>(null);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Faz upload pro backend → Cloudinary, recebe URL pública e atualiza estado.
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setErro(null);
    setEnviando(true);
    try {
      const novaUrl = await uploadApi.enviar(arquivo);
      onChange(novaUrl);
    } catch (err) {
      console.error(err);
      setErro("Falha no upload. Tenta de novo.");
    } finally {
      setEnviando(false);
      // Reseta o input pra permitir enviar o mesmo arquivo de novo se quiser.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // Se já tem imagem, mostra o preview com botão de remover.
  if (url) {
    return (
      <div className="image-preview">
        <img src={url} alt="" />
        <button type="button" className="remove" onClick={() => onChange(null)}>
          Remover
        </button>
      </div>
    );
  }

  // Senão, mostra a caixa de upload (dropzone visual).
  return (
    <div className="image-uploader" onClick={() => inputRef.current?.click()}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      {enviando ? (
        <p className="muted">Enviando…</p>
      ) : (
        <>
          <p style={{ fontWeight: 600 }}>{label}</p>
          <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
            JPG, PNG, WEBP até ~10MB
          </p>
        </>
      )}
      {erro && <p className="error-msg" style={{ marginTop: 12 }}>{erro}</p>}
    </div>
  );
}
