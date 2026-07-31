# Panorama do projeto

Acervo Cultural de Nova Serrana (MG) — acervo digital da memória migratória da cidade,
com apoio da PNAB. Site público mais painel administrativo.

Este arquivo é o resumo de contexto entre sessões. **Verifique o estado do banco antes de
agir** (comandos na última seção): partes deste documento descrevem pendências que podem já
ter sido resolvidas.

## Stack e comandos

Vite · React 18 · TypeScript · Tailwind · React Router · Supabase (Postgres + Auth)

```bash
npm run dev      # servidor local
npm run build    # tsc -b && vite build — rode sempre antes de entregar
```

Repositório: `KillerDevs0/acervodenovaserrana` (privado). Deploy pretendido na Vercel,
ainda não feito.

## Arquitetura

O conteúdo do acervo nunca é importado direto pelos componentes: tudo passa pelo hook
`useConteudo`.

```
src/
  Site.tsx                 site público
  components/              seções (Hero, Acervo, Mapa, LinhaDoTempo…)
  data.ts                  conteúdo semente e tipos (não é a fonte de verdade)
  lib/supabase.ts          cliente; expõe `supabaseConfigurado`
  store/
    content.tsx            hook useConteudo — decide entre banco e localStorage
    repositorio.ts         CRUD contra o Supabase
    mapeamento.ts          tradução app ↔ banco e colunas públicas
  admin/
    schemas.ts             descreve as coleções — dirige formulários e tabelas
    auth.tsx               Supabase Auth ou senha de demonstração
    paginas/               Entrar, VisaoGeral, Listagem, Editor
supabase/migrations/       0001 estrutura · 0002 seed · 0003 segurança
```

### O painel é dirigido por schema

Formulário, colunas da listagem e validação são **gerados** a partir de `admin/schemas.ts`.
Para adicionar um campo, descreva-o lá — não escreva formulário à mão. Tipos de campo
suportados: `texto`, `textarea`, `numero`, `url`, `cor`, `select`, `booleano`, `data`.

### Dois modos de operação

Decididos por `supabaseConfigurado` (presença de `.env.local`):

- **Supabase** — banco é a fonte de verdade, login validado no servidor.
- **Local** — localStorage e senha `acervo2024` conferida no navegador. Existe para rodar
  sem infraestrutura; não protege nem compartilha nada. O painel avisa quando está nesse modo.

`restaurarPadrao` só funciona no modo local: com o banco, apagaria o acervo de todos.

### `conteudo` vs `conteudoPublico`

O RLS dá leitura completa a editores. Se o site usasse `conteudo`, um editor logado veria
rascunhos — inclusive histórias sem consentimento — nas páginas públicas. Por isso:

- **site** → `conteudoPublico` (filtra `publicado = false`)
- **painel** → `conteudo` inteiro

`buscarTudo(completo)`: o site pede colunas nominais; o painel pede `*` depois do login,
para receber os campos de consentimento. `LayoutAdmin` dispara essa releitura.

### Divergências de nome entre app e banco

`desc` é palavra reservada em SQL. A tradução vive em `store/mapeamento.ts`:

| app | banco |
| --- | --- |
| `desc` | `descricao` |
| `leg` | `legenda` |
| `span` | `destaque` |
| `timeline` | `marcos_temporais` |
| `estados` | `estados_origem` |

A posição de exibição, antes implícita na ordem do array, é a coluna `ordem`.

## Segurança — leia antes de mexer

O acervo guarda **dados pessoais de terceiros**: `historias` tem nome, origem, profissão,
foto e citação de pessoas reais. Isso é LGPD, e o município responde. O usuário pediu
explicitamente rigor aqui.

Decisões tomadas, e o porquê:

- **Escrever exige constar em `public.editores`**, não apenas estar autenticado. A role
  `authenticated` vale para qualquer conta cadastrada — com cadastro aberto, seria porta de
  entrada. Verificação em `e_editor()` / `e_admin()`, funções `SECURITY DEFINER` com
  `search_path` vazio (sem isso a policy recursiona na tabela que consulta).
- **Publicar história exige `consentimento_em`.** Constraint no banco, espelhada na
  validação do formulário. As histórias do seed nascem despublicadas: são demonstração, não
  pessoas com consentimento colhido.
- **Grant por coluna em `historias`.** O RLS filtra linhas, não colunas. Com grant na tabela,
  um visitante pediria `select=consentimento_obs` na API e leria onde está o termo assinado.
- **`auditoria` registra toda escrita**, legível só por admin e sem policy de escrita, para
  que a trilha não seja alterável por quem a gerou.

Ao mexer em policy, migration ou leitura pública, verifique se um anônimo continua sem
acesso a: `editores`, `auditoria`, colunas de consentimento e registros despublicados.

## Pendências do usuário (verifique antes de assumir)

Nenhuma destas eu consigo fazer — todas exigem o dashboard do Supabase:

1. **Aplicar a migration 0003** no SQL Editor — é o bloqueio mais urgente. Em 31/07/2026 ainda
   não estava aplicada, então as policies permissivas da 0001 seguem valendo e nada da seção de
   segurança está em vigor. Além disso o **site não carrega**: as leituras pedem a coluna
   `publicado`, que a 0003 cria, e as cinco coleções respondem 400
   (`column ... does not exist`). Hoje as seções mostram o aviso de falha do
   `components/EstadoConteudo.tsx`; antes dele, apareciam vazias e sem explicação.
2. **Desativar cadastro público** em Authentication → Sign In / Providers. Estava aberto.
3. **Rotacionar a secret key** — uma `sb_secret_...` foi colada no chat em 31/07/2026. Ela
   ignora todo o RLS.
4. **Criar o primeiro admin**, depois de criar o usuário em Authentication → Users:
   ```sql
   insert into public.editores (usuario_id, email, nome, papel)
   select id, email, 'Nome', 'admin' from auth.users where email = 'x@y.com';
   ```

### Nunca testado contra o banco

Login, escrita autenticada, reordenação, a constraint de consentimento recusando publicação,
e o registro em `auditoria`. Tudo isso depende de existir um editor cadastrado. **Não
descreva esses caminhos como funcionando.**

O que já foi verificado: as cinco tabelas existem e devolvem o seed (3 documentários, 4
histórias, 6 fotos, 7 marcos, 8 estados) quando a query **não** pede `publicado`; RLS recusando
escrita anônima; build limpo; rotas servindo no build de produção.

Cuidado com a frase "leitura verificada": ela valeu antes da 0003 entrar no código. Como o
`repositorio.ts` passou a pedir `publicado`, a leitura que o app faz de fato falha hoje —
verificar com as queries desta seção, que espelham `colunasPublicas`, e não com um `select`
qualquer.

## Verificar o estado atual

```bash
curl -s "https://jjgnmpzgffjyfdwkdlfr.supabase.co/rest/v1/historias?select=publicado&limit=1" \
  -H "apikey: $(grep ANON_KEY .env.local | cut -d= -f2)"
```

400 com `column ... does not exist` = 0003 pendente. 200 = aplicada.

```bash
curl -s "https://jjgnmpzgffjyfdwkdlfr.supabase.co/auth/v1/settings" \
  -H "apikey: $(grep ANON_KEY .env.local | cut -d= -f2)" | grep -o '"disable_signup":[a-z]*'
```

`false` = cadastro aberto, ainda vulnerável.

## Preferências de trabalho observadas

- Escreve em português; código, comentários e commits em português.
- Pede "continue" com frequência — quer progresso contínuo, sem pausa para confirmar cada
  passo pequeno.
- Pediu rigor em segurança por causa dos dados pessoais. Vale sinalizar risco mesmo sem ser
  perguntado.
- Não tem `gh` autenticado, mas o Git Credential Manager do Windows tem credencial salva:
  `git push` funciona direto.
