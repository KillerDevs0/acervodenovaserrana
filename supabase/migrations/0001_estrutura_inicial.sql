-- Acervo Cultural de Nova Serrana — estrutura inicial
--
-- Cinco coleções do acervo, espelhando os schemas de src/admin/schemas.ts.
-- Rode este arquivo no SQL Editor do Supabase (Dashboard → SQL Editor → New query).
--
-- Convenções:
--   · `ordem` controla a posição de exibição no site (o painel reordena por ela).
--   · `descricao` em vez de `desc`, que é palavra reservada em SQL.
--   · Leitura liberada para visitantes; escrita apenas para usuários autenticados.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table if not exists public.documentarios (
  id          bigint generated always as identity primary key,
  titulo      text    not null,
  subtitulo   text    not null default '',
  duracao     text    not null default '',
  ano         integer not null,
  diretor     text    not null default '',
  thumb       text    not null default '',
  ordem       integer not null default 0,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint documentarios_ano_valido check (ano between 1900 and 2100)
);

create table if not exists public.historias (
  id          bigint generated always as identity primary key,
  nome        text    not null,
  origem      text    not null default '',
  chegada     integer not null,
  profissao   text    not null default '',
  foto        text    not null default '',
  citacao     text    not null default '',
  ordem       integer not null default 0,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint historias_chegada_valida check (chegada between 1900 and 2100)
);

create table if not exists public.fotos (
  id          bigint generated always as identity primary key,
  url         text    not null,
  legenda     text    not null default '',
  -- Classe do mosaico: '' (padrão) ou 'row-span-2' (destaque, altura dupla).
  destaque    text    not null default '',
  ordem       integer not null default 0,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.marcos_temporais (
  id          bigint generated always as identity primary key,
  ano         integer not null,
  titulo      text    not null,
  descricao   text    not null default '',
  ordem       integer not null default 0,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint marcos_ano_valido check (ano between 1900 and 2100)
);

create table if not exists public.estados_origem (
  id          bigint generated always as identity primary key,
  estado      text    not null,
  sigla       text    not null default '',
  familias    integer not null default 0,
  cor         text    not null default '#c49010',
  -- Coordenadas da bolha no SVG do mapa (viewBox 0 0 560 475).
  cx          integer not null default 0,
  cy          integer not null default 0,
  descricao   text    not null default '',
  ordem       integer not null default 0,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint estados_familias_positivas check (familias >= 0),
  constraint estados_cor_hex check (cor ~* '^#[0-9a-f]{6}$')
);

-- Índices para a ordenação usada em toda leitura do site.
create index if not exists documentarios_ordem_idx     on public.documentarios (ordem, id);
create index if not exists historias_ordem_idx         on public.historias (ordem, id);
create index if not exists fotos_ordem_idx             on public.fotos (ordem, id);
create index if not exists marcos_temporais_ordem_idx  on public.marcos_temporais (ordem, id);
create index if not exists estados_origem_ordem_idx    on public.estados_origem (ordem, id);

-- ---------------------------------------------------------------------------
-- atualizado_em automático
-- ---------------------------------------------------------------------------

create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'documentarios', 'historias', 'fotos', 'marcos_temporais', 'estados_origem'
  ]
  loop
    execute format(
      'drop trigger if exists tocar_atualizado_em on public.%I', t
    );
    execute format(
      'create trigger tocar_atualizado_em before update on public.%I
         for each row execute function public.tocar_atualizado_em()', t
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- O site é público, então qualquer visitante lê. Escrever exige uma sessão
-- autenticada — e, com RLS ligado, a chave anon do front-end não consegue
-- escrever nada sem login, mesmo estando visível no navegador.
--
-- ATENÇÃO: a role `authenticated` vale para QUALQUER pessoa que se cadastre.
-- Se o cadastro público estiver aberto no Supabase, qualquer um cria uma conta
-- e passa a poder editar o acervo. Em Authentication → Sign In / Providers,
-- desative "Allow new users to sign up" e crie os editores manualmente.
-- ---------------------------------------------------------------------------

alter table public.documentarios     enable row level security;
alter table public.historias         enable row level security;
alter table public.fotos             enable row level security;
alter table public.marcos_temporais  enable row level security;
alter table public.estados_origem    enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'documentarios', 'historias', 'fotos', 'marcos_temporais', 'estados_origem'
  ]
  loop
    execute format('drop policy if exists leitura_publica on public.%I', t);
    execute format(
      'create policy leitura_publica on public.%I
         for select to anon, authenticated using (true)', t
    );

    execute format('drop policy if exists escrita_autenticada on public.%I', t);
    execute format(
      'create policy escrita_autenticada on public.%I
         for all to authenticated using (true) with check (true)', t
    );
  end loop;
end;
$$;
