# Guerra Arq — Portfólio

Portfólio do estúdio de arquitetura [@guerra_arq_](https://instagram.com/guerra_arq_), com painel admin para gerenciar projetos e informações do estúdio sem precisar mexer no código.

## Stack

- **Frontend**: React + Vite + TypeScript (deploy: Vercel)
- **Backend**: ASP.NET Core 9 Web API + Entity Framework Core (deploy: Render)
- **Banco**: PostgreSQL (Neon)
- **Imagens**: Cloudinary
- **Auth**: JWT com usuário/senha fixos no `.env`

## Estrutura do repositório

```
.
├── backend/GuerraArq.Api/    # API .NET (controllers, models, EF Core)
├── frontend/guerraarq-web/   # SPA React (público + admin)
└── example/                  # HTML/CSS original (referência de design)
```

---

## Rodando localmente

Precisa de **dois terminais abertos** — um pro backend, um pro frontend.

### Pré-requisitos

- .NET SDK 9
- Node.js 20+
- Conta no [Neon](https://neon.tech) (banco) — pega a connection string
- Conta no [Cloudinary](https://cloudinary.com) (imagens) — pega Cloud Name, API Key, API Secret

### 1. Backend

```bash
cd backend/GuerraArq.Api

# 1ª vez: copie o exemplo e preencha valores reais
cp .env.example .env
# (editar .env com DATABASE_URL, ADMIN_USER/PASSWORD, JWT_SECRET, CLOUDINARY_*)

dotnet run
```

A API sobe em `http://localhost:5000`. Ao iniciar pela primeira vez, o EF Core aplica as migrations automaticamente no Neon.

Testa que tá funcionando: abra `http://localhost:5000/api/studio` no navegador — deve retornar um JSON.

### 2. Frontend

```bash
cd frontend/guerraarq-web

# 1ª vez: instala dependências
npm install

npm run dev
```

O site sobe em `http://localhost:5173`.

- **Site público**: http://localhost:5173/
- **Painel admin**: http://localhost:5173/admin/login

Use as credenciais (`ADMIN_USER` e `ADMIN_PASSWORD`) que você definiu no `.env` do backend.

---

## Variáveis de ambiente

### Backend (`backend/GuerraArq.Api/.env`)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres (Neon) |
| `ADMIN_USER` | Usuário do admin (você define) |
| `ADMIN_PASSWORD` | Senha do admin (você define) |
| `JWT_SECRET` | String aleatória longa (32+ chars) usada pra assinar tokens |
| `CLOUDINARY_CLOUD_NAME` | Nome do "cloud" no Cloudinary |
| `CLOUDINARY_API_KEY` | API Key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret do Cloudinary |
| `CORS_ORIGIN` | URL(s) do front, separadas por vírgula |

### Frontend (`frontend/guerraarq-web/.env`)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API. Dev: `http://localhost:5000`. Prod: URL pública do Render. |

---

## Deploy

### Backend → Render

1. Faça push do repositório pro GitHub.
2. Em https://render.com → **New** → **Web Service**.
3. Conecte o repositório, escolha **Root Directory**: `backend/GuerraArq.Api`.
4. Runtime: **Docker** (vai usar o `Dockerfile` já presente).
5. Em **Environment**, adicione todas as variáveis do `.env` (uma a uma na interface, não copie o arquivo).
6. Em `CORS_ORIGIN`, deixe a URL final do front (preenche depois de subir o front).
7. Deploy. A primeira build leva ~5 min.

Anote a URL pública (algo como `https://guerraarq-api.onrender.com`).

### Frontend → Vercel

1. Em https://vercel.com → **Add New Project** → importa o repo do GitHub.
2. **Root Directory**: `frontend/guerraarq-web`.
3. Framework Preset: **Vite** (detecta automático).
4. Em **Environment Variables**, adicione:
   - `VITE_API_URL` = URL do backend no Render.
5. Deploy.

O `vercel.json` já cuida do SPA routing (`/admin`, `/projetos/:slug` funcionam ao recarregar).

### Volta no Render — atualizar CORS

Depois que o front subir, **atualize `CORS_ORIGIN` no Render** com a URL do Vercel:

```
CORS_ORIGIN=https://guerraarq.vercel.app
```

(ou várias separadas por vírgula, incluindo o domínio próprio).

### Domínio próprio

- Compre em Registro.br, Cloudflare Registrar ou Namecheap.
- Na Vercel: **Settings → Domains** → adiciona o domínio.
- A Vercel mostra os registros DNS — aponte no painel de onde comprou.

---

## Uso do admin

1. Acesse `/admin/login`.
2. Faça login.
3. **Aba Projetos**: lista cadastrada. Botão **+ Novo projeto** abre o formulário.
4. **Aba Estúdio**: edita contatos, redes sociais, texto sobre, serviços, fotos.

### Cadastrando um projeto

- **Slug**: gerado automaticamente a partir do título; pode editar.
- **Capa**: imagem única que aparece no card e topo do detalhe.
- **Galeria**: várias imagens com descrição (aparece no hover do site público).
- **Descrição**: parágrafos + citação destacada opcional.

### Estúdio — pontos importantes

- Os contadores **nº de projetos** e **anos de estúdio** são calculados automaticamente. Você só define o **ano de fundação** e o **terceiro stat custom** (ex: "100% Sob medida").
- Sempre clique em **Salvar alterações** no final.

---

## Troubleshooting

**Backend não inicia, erro de DATABASE_URL:**
- Confira se a string do Neon está completa, em uma linha só, sem duplicatas.
- O parser converte automaticamente `postgres://...` em formato Npgsql.

**Front mostra "Erro ao buscar dados":**
- Verifica se o backend está rodando.
- Confira `VITE_API_URL` no `.env` do front.
- Verifica se a porta bate (5000, 5001 — veja o output do `dotnet run`).

**Login falha:**
- Confira `ADMIN_USER` e `ADMIN_PASSWORD` no `.env` do backend.
- Reinicie o backend após editar o `.env`.

**Upload de imagem não funciona:**
- Confira as 3 variáveis do Cloudinary.
- O API Secret precisa ser revelado/copiado da página de API Keys.
