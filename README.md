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

> **Senha de demonstração:** `acervo2024`

## Estado atual e limitações

Este é um ambiente de demonstração, ainda **sem backend**:

- **Persistência:** o conteúdo editado no painel vive no `localStorage` do navegador
  (`acervo-ns:conteudo:v1`), semeado a partir de `src/data.ts`. As edições não são
  compartilhadas entre dispositivos. Use o export JSON como backup.
- **Autenticação:** a senha é comparada no JavaScript da página e a sessão fica em
  `sessionStorage`. Qualquer pessoa com acesso ao console contorna essa verificação. Ela
  serve para desenhar o fluxo do painel, não para proteger conteúdo real.

### Antes de publicar

1. Mover conteúdo e autenticação para um servidor. O ponto de troca é `carregar`/`persistir`
   em `src/store/content.tsx` e `src/admin/auth.tsx` — o resto da aplicação consome apenas o
   hook `useConteudo`.
2. Usar sessão em cookie `httpOnly`, hash de senha no backend e verificação em todas as
   rotas de escrita da API.
3. Configurar o host com fallback para `index.html`, já que as rotas `/admin/*` são
   client-side.
