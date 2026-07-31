-- Endurecimento do acervo: autorização por lista e proteção de dados pessoais
--
-- Rode depois de 0001 e 0002, no SQL Editor do Supabase.
--
-- Três problemas que este arquivo corrige:
--
--   1. AUTORIZAÇÃO. As policies de 0001 liberam escrita para a role
--      `authenticated`, que vale para qualquer conta cadastrada. Com o cadastro
--      público aberto, isso é uma porta de entrada. Passa a valer a pertinência
--      a `public.editores` — quem não está na tabela não escreve, mesmo logado.
--
--   2. DADOS PESSOAIS. `historias` guarda nome, origem, profissão, foto e
--      citação de pessoas reais. Sob a LGPD isso é dado pessoal, tratado com
--      base no consentimento do titular (art. 7º, I) para finalidade de memória
--      e pesquisa cultural. Nada fica visível ao público sem `publicado = true`,
--      e a publicação exige registro de consentimento.
--
--   3. RASTREABILIDADE. Sem trilha de auditoria não há como responder quem
--      alterou o quê — necessário para prestar contas ao titular e ao órgão de
--      controle. `public.auditoria` registra toda escrita nas tabelas do acervo.

-- ---------------------------------------------------------------------------
-- 1. Editores autorizados
-- ---------------------------------------------------------------------------

create table if not exists public.editores (
  usuario_id  uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  nome        text not null default '',
  -- 'editor' cataloga o acervo; 'admin' também gerencia a lista de editores.
  papel       text not null default 'editor',
  criado_em   timestamptz not null default now(),
  constraint editores_papel_valido check (papel in ('editor', 'admin'))
);

comment on table public.editores is
  'Quem pode escrever no acervo. Estar autenticado não basta: é preciso constar aqui.';

/**
 * Verifica se o usuário da requisição é editor.
 *
 * SECURITY DEFINER de propósito: a função precisa ler `editores` sem passar
 * pelo RLS da própria tabela, senão a policy que a usa entra em recursão.
 * `search_path` vazio evita captura por schema malicioso — toda referência é
 * qualificada.
 */
create or replace function public.e_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.editores
    where usuario_id = (select auth.uid())
  );
$$;

create or replace function public.e_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.editores
    where usuario_id = (select auth.uid()) and papel = 'admin'
  );
$$;

revoke all on function public.e_editor() from anon;
revoke all on function public.e_admin() from anon;
grant execute on function public.e_editor() to authenticated;
grant execute on function public.e_admin() to authenticated;

alter table public.editores enable row level security;

-- Um editor vê a própria linha; admin vê e gerencia todas. Visitante não vê
-- nada: a lista de editores é, ela mesma, um dado pessoal (e-mail e nome).
drop policy if exists editores_le_proprio on public.editores;
create policy editores_le_proprio on public.editores
  for select to authenticated
  using (usuario_id = (select auth.uid()) or public.e_admin());

drop policy if exists editores_admin_gerencia on public.editores;
create policy editores_admin_gerencia on public.editores
  for all to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- ---------------------------------------------------------------------------
-- 2. Consentimento e publicação
--
-- `publicado` vale para todas as coleções: nada aparece no site antes de uma
-- decisão explícita. Em `historias`, publicar exige consentimento registrado.
-- ---------------------------------------------------------------------------

alter table public.documentarios    add column if not exists publicado boolean not null default true;
alter table public.fotos            add column if not exists publicado boolean not null default true;
alter table public.marcos_temporais add column if not exists publicado boolean not null default true;
alter table public.estados_origem   add column if not exists publicado boolean not null default true;

alter table public.historias add column if not exists publicado boolean not null default false;
alter table public.historias add column if not exists consentimento_em date;
alter table public.historias add column if not exists consentimento_obs text not null default '';

comment on column public.historias.consentimento_em is
  'Data em que o titular autorizou a divulgação. Sem isso o registro não pode ser publicado.';
comment on column public.historias.consentimento_obs is
  'Onde está o termo assinado, e limites que o titular impôs ao uso.';

-- O banco recusa publicar história sem consentimento registrado. Esquecer de
-- preencher o campo passa a ser um erro, não uma exposição silenciosa.
alter table public.historias drop constraint if exists historias_exige_consentimento;
alter table public.historias add constraint historias_exige_consentimento
  check (publicado = false or consentimento_em is not null);

-- As histórias do seed inicial são conteúdo de demonstração, não pessoas com
-- consentimento colhido — ficam despublicadas até que isso seja verificado.
update public.historias set publicado = false where consentimento_em is null;

-- ---------------------------------------------------------------------------
-- 3. Policies do acervo
--
-- Leitura pública apenas do que está publicado; editor vê tudo, inclusive
-- rascunhos. Escrita só para editor.
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'documentarios', 'historias', 'fotos', 'marcos_temporais', 'estados_origem'
  ]
  loop
    -- Remove as policies permissivas de 0001.
    execute format('drop policy if exists leitura_publica on public.%I', t);
    execute format('drop policy if exists escrita_autenticada on public.%I', t);

    execute format(
      'create policy leitura_do_publicado on public.%I
         for select to anon, authenticated using (publicado = true)', t
    );

    execute format(
      'create policy leitura_completa_editor on public.%I
         for select to authenticated using (public.e_editor())', t
    );

    execute format(
      'create policy escrita_editor on public.%I
         for all to authenticated
         using (public.e_editor()) with check (public.e_editor())', t
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Auditoria
-- ---------------------------------------------------------------------------

create table if not exists public.auditoria (
  id          bigint generated always as identity primary key,
  tabela      text not null,
  registro_id bigint,
  operacao    text not null,
  usuario_id  uuid,
  email       text,
  antes       jsonb,
  depois      jsonb,
  em          timestamptz not null default now()
);

create index if not exists auditoria_tabela_idx on public.auditoria (tabela, em desc);
create index if not exists auditoria_usuario_idx on public.auditoria (usuario_id, em desc);

comment on table public.auditoria is
  'Trilha de escrita no acervo. Append-only: ninguém edita nem apaga por aqui.';

create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  atual   uuid := (select auth.uid());
  quem    text;
  v_antes jsonb;
  v_depois jsonb;
  v_id    bigint;
begin
  select e.email into quem from public.editores e where e.usuario_id = atual;

  -- OLD e NEW não existem em toda operação: referenciar o ausente aborta a
  -- escrita, então cada caso é tratado separadamente.
  if tg_op = 'INSERT' then
    v_depois := to_jsonb(new);
    v_id := new.id;
  elsif tg_op = 'UPDATE' then
    v_antes := to_jsonb(old);
    v_depois := to_jsonb(new);
    v_id := new.id;
  else
    v_antes := to_jsonb(old);
    v_id := old.id;
  end if;

  insert into public.auditoria (tabela, registro_id, operacao, usuario_id, email, antes, depois)
  values (tg_table_name, v_id, tg_op, atual, quem, v_antes, v_depois);

  return null; -- trigger AFTER: o retorno é ignorado
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
    execute format('drop trigger if exists auditar on public.%I', t);
    execute format(
      'create trigger auditar after insert or update or delete on public.%I
         for each row execute function public.registrar_auditoria()', t
    );
  end loop;
end;
$$;

alter table public.auditoria enable row level security;

-- Só admin lê a trilha, e ninguém a altera: sem policy de insert/update/delete,
-- o RLS recusa tudo. O trigger grava porque é SECURITY DEFINER.
drop policy if exists auditoria_admin_le on public.auditoria;
create policy auditoria_admin_le on public.auditoria
  for select to authenticated
  using (public.e_admin());

-- ---------------------------------------------------------------------------
-- 5. Superfície exposta
--
-- Por padrão o PostgREST expõe tudo que a role tem grant. Reduzimos ao mínimo:
-- visitante apenas lê o acervo; nada de funções ou tabelas de controle.
-- ---------------------------------------------------------------------------

revoke all on public.editores from anon;
revoke all on public.auditoria from anon;

do $$
declare
  t text;
begin
  foreach t in array array[
    'documentarios', 'historias', 'fotos', 'marcos_temporais', 'estados_origem'
  ]
  loop
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select on public.%I to anon', t);
  end loop;
end;
$$;
