-- ===========================================================================
-- Acervo Cultural de Nova Serrana — Memorial Cultural Digital
-- Migration 0005: Expansão do Memorial Cultural Digital (PNAB Edital 01/2026)
--
-- Estrutura para preservação da memória municipal:
--   · sources (fontes históricas e confiabilidade)
--   · people (moradores, pioneiros, entrevistados)
--   · families (núcleos familiares e genealogia migratória)
--   · memories (relatos orais, entrevistas e registros pessoais)
--   · historical_images (fotografias antigas e atuais)
--   · documents (documentos, cartazes, recortes de jornais)
--   · neighborhoods (bairros e lugares históricos)
--   · urban_memory (evolução urbana, linha do tempo e antes/depois)
--   · cultural_events (Festa do Imigrante, folia, eventos culturais)
--   · media (áudios, vídeos, fotografias associadas)
--   · accessibility_content (audiodescrições, legendas, transcrições)
--   · contributions (atualização com novos tipos e estados de curadoria)
-- ===========================================================================

-- 1. Fontes históricas e confiabilidade documental
create table if not exists public.sources (
  id                bigint generated always as identity primary key,
  titulo            text not null,
  tipo              text not null check (tipo in (
                      'Fonte documental',
                      'Relato oral',
                      'Acervo familiar',
                      'Imprensa',
                      'Publicação',
                      'Registro institucional'
                    )),
  autor             text not null default '',
  entrevistado      text not null default '',
  data_registro     text not null default '',
  origem_documento  text not null default '',
  responsavel_envio text not null default '',
  nivel_confirmacao text not null default 'Registro aguardando validação histórica',
  observacoes       text not null default '',
  publicado         boolean not null default true,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

-- 2. Pessoas (moradores, pioneiros, mestres e entrevistados)
create table if not exists public.people (
  id                     bigint generated always as identity primary key,
  nome_completo          text not null,
  nome_social            text not null default '',
  ano_nascimento         integer check (ano_nascimento between 1800 and 2100),
  ano_falecimento        integer check (ano_falecimento between 1800 and 2100),
  municipio_origem       text not null default '',
  estado_origem          text not null default '',
  ano_chegada            integer check (ano_chegada between 1900 and 2100),
  profissao_oficio       text not null default '',
  relacao_cidade         text not null default '',
  foto_perfil_url        text not null default '',
  religiao_fe            text not null default '',
  consentimento_em       date,
  consentimento_obs      text not null default '',
  publicado              boolean not null default false,
  ordem                  integer not null default 0,
  criado_em              timestamptz not null default now(),
  atualizado_em          timestamptz not null default now()
);

-- 3. Famílias migrantes e pioneiras
create table if not exists public.families (
  id                bigint generated always as identity primary key,
  sobrenome_familia text not null,
  municipio_origem  text not null default '',
  estado_origem     text not null default '',
  decada_chegada    text not null default '',
  bairro_fixacao    text not null default '',
  oficios_tradicoes text not null default '',
  culinaria_musica  text not null default '',
  historico_resumo  text not null default '',
  publicado         boolean not null default true,
  ordem             integer not null default 0,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

-- 4. Bairros e lugares históricos
create table if not exists public.neighborhoods (
  id               bigint generated always as identity primary key,
  nome             text not null,
  decada_formacao  text not null default '',
  fotografia_url   text not null default '',
  historico        text not null default '',
  curiosidades     text not null default '',
  fontes           text not null default '',
  status_validacao text not null default 'Conteúdo em processo de pesquisa e catalogação.',
  publicado        boolean not null default true,
  ordem            integer not null default 0,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

-- 5. Memória Urbana (marcos temporais e antes/depois)
create table if not exists public.urban_memory (
  id                   bigint generated always as identity primary key,
  tipo                 text not null check (tipo in ('marco_temporal', 'antes_depois')),
  titulo               text not null,
  ano_antiga           text not null default '',
  ano_atual            text not null default '',
  categoria            text not null default 'transformações da cidade',
  bairro_id            bigint references public.neighborhoods (id) on delete set null,
  endereco_referencia  text not null default '',
  foto_antiga_url      text not null default '',
  foto_atual_url       text not null default '',
  descricao_historica  text not null default '',
  fonte_fotografia     text not null default '',
  creditos             text not null default '',
  source_id            bigint references public.sources (id) on delete set null,
  publicado            boolean not null default true,
  ordem                integer not null default 0,
  criado_em            timestamptz not null default now(),
  atualizado_em        timestamptz not null default now()
);

-- 6. Eventos culturais e tradições (Festa do Imigrante e outros)
create table if not exists public.cultural_events (
  id                       bigint generated always as identity primary key,
  nome                     text not null,
  periodo_data             text not null default '',
  eh_festa_imigrante       boolean not null default false,
  descricao                text not null default '',
  manifestacoes_culturais  text not null default '',
  comunidades_envolvidas   text not null default '',
  programacao_historica    text not null default '',
  fontes                   text not null default '',
  creditos                 text not null default '',
  source_id                bigint references public.sources (id) on delete set null,
  publicado                boolean not null default true,
  ordem                    integer not null default 0,
  criado_em                timestamptz not null default now(),
  atualizado_em            timestamptz not null default now()
);

-- 7. Documentos históricos e recortes
create table if not exists public.documents (
  id                  bigint generated always as identity primary key,
  titulo              text not null,
  categoria           text not null check (categoria in (
                        'Documentos históricos',
                        'Jornais e recortes',
                        'Cartazes',
                        'Manuscritos',
                        'Registros oficiais'
                      )),
  data_periodo        text not null default '',
  decada              text not null default '',
  arquivo_url         text not null,
  descricao           text not null default '',
  origem_material     text not null default '',
  autor               text not null default '',
  disponibilizado_por text not null default '',
  creditos            text not null default '',
  fonte               text not null default '',
  tags                text not null default '',
  source_id           bigint references public.sources (id) on delete set null,
  publicado           boolean not null default true,
  ordem               integer not null default 0,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

-- 8. Fotografias do acervo histórico
create table if not exists public.historical_images (
  id                  bigint generated always as identity primary key,
  titulo              text not null,
  categoria           text not null check (categoria in (
                        'Fotografias antigas',
                        'Fotografias atuais',
                        'Fotografias de famílias',
                        'Fotografias de fábricas',
                        'Espaços públicos',
                        'Cultura popular',
                        'Trabalho e indústria'
                      )),
  imagem_url          text not null,
  data_periodo        text not null default '',
  decada              text not null default '',
  bairro              text not null default '',
  descricao           text not null default '',
  autor               text not null default '',
  disponibilizado_por text not null default '',
  creditos            text not null default '',
  fonte               text not null default '',
  tags                text not null default '',
  source_id           bigint references public.sources (id) on delete set null,
  publicado           boolean not null default true,
  ordem               integer not null default 0,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

-- 9. Memórias orais ampliadas
create table if not exists public.memories (
  id                      bigint generated always as identity primary key,
  person_id               bigint references public.people (id) on delete cascade,
  family_id               bigint references public.families (id) on delete set null,
  titulo                  text not null,
  citacao                 text not null default '',
  relato_oral             text not null default '',
  tradicoes_familia       text not null default '',
  culinaria               text not null default '',
  musica                  text not null default '',
  oficios                 text not null default '',
  religiao_fe             text not null default '',
  relacao_nova_serrana    text not null default '',
  audio_url               text not null default '',
  video_url               text not null default '',
  transcricao_textual     text not null default '',
  audiodescricao          text not null default '',
  fonte_creditos          text not null default '',
  source_id               bigint references public.sources (id) on delete set null,
  consentimento_em        date,
  consentimento_obs       text not null default '',
  publicado               boolean not null default false,
  ordem                   integer not null default 0,
  criado_em               timestamptz not null default now(),
  atualizado_em           timestamptz not null default now()
);

-- 10. Mídia e galeria
create table if not exists public.media (
  id               bigint generated always as identity primary key,
  tipo             text not null check (tipo in ('imagem', 'audio', 'video', 'documento')),
  url              text not null,
  legenda          text not null default '',
  creditos         text not null default '',
  memory_id        bigint references public.memories (id) on delete cascade,
  event_id         bigint references public.cultural_events (id) on delete cascade,
  urban_id         bigint references public.urban_memory (id) on delete cascade,
  publicado        boolean not null default true,
  ordem            integer not null default 0,
  criado_em        timestamptz not null default now()
);

-- 11. Conteúdo de Acessibilidade
create table if not exists public.accessibility_content (
  id               bigint generated always as identity primary key,
  recurso_tipo     text not null check (recurso_tipo in ('audiodescricao', 'transcricao', 'legendas', 'guia')),
  tabela_alvo      text not null,
  registro_alvo_id bigint not null,
  conteudo_texto   text not null,
  idioma           text not null default 'pt-BR',
  revisado_por     text not null default '',
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

-- 12. Atualização da tabela de contribuições com novos campos e estados
alter table public.contribuicoes add column if not exists tipo text not null default 'Minha história';
alter table public.contribuicoes add column if not exists telefone text not null default '';
alter table public.contribuicoes add column if not exists email text not null default '';
alter table public.contribuicoes add column if not exists cidade_origem text not null default '';
alter table public.contribuicoes add column if not exists relacao_cidade text not null default '';
alter table public.contribuicoes add column if not exists arquivos_url text not null default '';
alter table public.contribuicoes add column if not exists data_aproximada text not null default '';
alter table public.contribuicoes add column if not exists creditos text not null default '';
alter table public.contribuicoes add column if not exists fonte text not null default '';
alter table public.contribuicoes add column if not exists categoria text not null default '';
alter table public.contribuicoes add column if not exists audiodescricao text not null default '';
alter table public.contribuicoes add column if not exists transcricao text not null default '';
alter table public.contribuicoes add column if not exists tags text not null default '';

-- Atualização das restrições de situação de curadoria:
-- 'rascunho', 'em_analise', 'aguardando_informacoes', 'aprovado', 'publicado', 'arquivado'
alter table public.contribuicoes drop constraint if exists contribuicoes_situacao_valida;
alter table public.contribuicoes add constraint contribuicoes_situacao_valida check (
  situacao in (
    'novo', 'em_analise', 'aproveitado', 'recusado',
    'rascunho', 'aguardando_informacoes', 'aprovado', 'publicado', 'arquivado'
  )
);

-- 13. Habilitar RLS em todas as novas tabelas
alter table public.sources               enable row level security;
alter table public.people                enable row level security;
alter table public.families              enable row level security;
alter table public.neighborhoods         enable row level security;
alter table public.urban_memory          enable row level security;
alter table public.cultural_events       enable row level security;
alter table public.documents             enable row level security;
alter table public.historical_images     enable row level security;
alter table public.memories              enable row level security;
alter table public.media                 enable row level security;
alter table public.accessibility_content enable row level security;

-- 14. Policies padrão: leitura pública do publicado, escrita apenas por editores
do $$
declare
  t text;
begin
  foreach t in array array[
    'sources', 'people', 'families', 'neighborhoods', 'urban_memory',
    'cultural_events', 'documents', 'historical_images', 'memories',
    'media', 'accessibility_content'
  ]
  loop
    execute format('drop policy if exists leitura_do_publicado on public.%I', t);
    execute format(
      'create policy leitura_do_publicado on public.%I
         for select to anon, authenticated using (publicado = true)', t
    );

    execute format('drop policy if exists escrita_editor on public.%I', t);
    execute format(
      'create policy escrita_editor on public.%I
         for all to authenticated
         using (public.e_editor()) with check (public.e_editor())', t
    );

    -- Trigger para tocar atualizado_em quando a tabela possuir a coluna
    if t <> 'media' then
      execute format('drop trigger if exists tocar_atualizado_em on public.%I', t);
      execute format(
        'create trigger tocar_atualizado_em before update on public.%I
           for each row execute function public.tocar_atualizado_em()', t
      );
    end if;

    -- Auditoria de escrita
    execute format('drop trigger if exists auditar on public.%I', t);
    execute format(
      'create trigger auditar after insert or update or delete on public.%I
         for each row execute function public.registrar_auditoria()', t
    );

    execute format('grant select on public.%I to anon', t);
  end loop;
end;
$$;
