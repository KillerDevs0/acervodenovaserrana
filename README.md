# Acervo Cultural de Nova Serrana

Acervo digital da memória migratória de Nova Serrana (MG), realizado com apoio da Política
Nacional Aldir Blanc — PNAB. Reúne documentários, histórias de moradores, fotografias
históricas, a linha do tempo do município e um mapa dos fluxos migratórios que formaram
a cidade.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · React Router

## Como rodar

```bash
npm install
npm run dev
```

O site fica em `http://localhost:5173`.

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run preview` | Serve o build de produção localmente |

## Estrutura

```
src/
  Site.tsx              # site público
  components/           # seções da página (Hero, Acervo, Mapa, Linha do Tempo…)
  data.ts               # conteúdo inicial e tipos do acervo
  store/content.tsx     # camada de conteúdo (CRUD + persistência)
  admin/                # painel administrativo
    schemas.ts          # descrição das coleções — dirige formulários e tabelas
    paginas/            # login, visão geral, listagem, editor
```

## Painel administrativo

Disponível em `/admin`. Permite criar, editar, reordenar e excluir registros das cinco
coleções, com busca por coleção e export do acervo em JSON. As alterações aparecem no site
imediatamente.

Para adicionar um campo a uma coleção, basta descrevê-lo em `src/admin/schemas.ts` — o
formulário, a coluna na listagem e a validação são gerados a partir dali.

## Dois modos de operação

A aplicação decide o modo pela presença das chaves em `.env.local`:

| | **Supabase** | **Local** (sem `.env.local`) |
| --- | --- | --- |
| Conteúdo | Postgres, compartilhado | `localStorage` do navegador |
| Login | Supabase Auth, validado no servidor | senha `acervo2024`, conferida no navegador |
| Uso | produção e edição real | rodar o projeto sem infraestrutura |

O modo local existe para o projeto subir sem depender de nada, mas não protege nem
compartilha nada: as edições ficam no dispositivo de quem editou e o login é contornável
pelo console. O painel avisa quando está nesse modo.

## Configurar o Supabase

1. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
2. No **SQL Editor**, rode os arquivos de `supabase/migrations/` na ordem — primeiro
   `0001_estrutura_inicial.sql` (tabelas, índices e RLS), depois
   `0002_conteudo_inicial.sql` (conteúdo atual do acervo; é idempotente).
3. Copie `.env.example` para `.env.local` e preencha com a **Project URL** e a
   **anon public key** de Settings → API.

```bash
cp .env.example .env.local
```

A anon key é pública por natureza — o que protege o banco são as policies de RLS, não o
sigilo da chave. A **service_role key** nunca deve ir para o front-end: ela ignora todas as
policies.

### Criar editores

Em **Authentication → Users → Add user**, crie uma conta para cada editor.

Importante: as policies liberam escrita para a role `authenticated`, que vale para qualquer
conta cadastrada. Em **Authentication → Sign In / Providers**, desative
*"Allow new users to sign up"* — sem isso, qualquer pessoa se cadastra e passa a poder
editar o acervo.

## Antes de publicar

- Rodar as migrations e configurar o `.env.local` no ambiente de produção (o modo local não
  serve para publicação).
- Desativar o cadastro público no Supabase, conforme acima.
- Configurar o host com fallback para `index.html`, já que as rotas `/admin/*` são
  client-side.
