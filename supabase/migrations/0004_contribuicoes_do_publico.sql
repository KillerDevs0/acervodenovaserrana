-- ---------------------------------------------------------------------------
-- 0004 — Contribuições enviadas pelo público
--
-- O botão "Enviar Memória" não fazia nada. Esta migration cria a caixa de
-- entrada onde o formulário do site grava.
--
-- DECISÃO CENTRAL: o público NÃO escreve em `historias`.
--
-- `historias` é o acervo publicado, com dados pessoais de terceiros já
-- verificados e consentimento registrado. Se o formulário gravasse lá, um
-- visitante anônimo passaria a inserir linhas numa tabela que o site lê — e
-- qualquer erro de policy viraria conteúdo publicado sem curadoria, com nome de
-- gente real. Contribuições ficam em tabela separada, invisível ao público, e um
-- editor copia para o acervo à mão depois de conferir e colher o termo.
--
-- LGPD: o formulário coleta dados de quem envia (nome, contato) e possivelmente
-- de terceiros citados no relato. Base legal aqui é o consentimento do próprio
-- remetente, que precisa marcar a caixa antes de enviar — `autoriza_contato`.
-- Nada disso aparece no site em nenhuma hipótese: não há grant de leitura para
-- `anon`, e é de propósito.
-- ---------------------------------------------------------------------------

create table if not exists public.contribuicoes (
  id             bigint generated always as identity primary key,
  -- Quem enviou. `contato` é livre para aceitar e-mail ou telefone: exigir
  -- formato afasta quem só tem WhatsApp, e a Secretaria vai responder por lá.
  nome           text not null,
  contato        text not null,
  relato         text not null,
  -- Opcional: nem todo mundo sabe o ano, e chute vira dado errado no acervo.
  periodo        text not null default '',
  -- Consentimento do remetente para a Secretaria entrar em contato. Sem isso o
  -- envio não é aceito (constraint abaixo).
  autoriza_contato boolean not null default false,
  -- Fila de curadoria: 'novo' → 'em_analise' → 'aproveitado' | 'recusado'.
  situacao       text not null default 'novo',
  -- Anotações internas da curadoria. Nunca sai do painel.
  notas          text not null default '',
  criado_em      timestamptz not null default now(),

  constraint contribuicoes_situacao_valida
    check (situacao in ('novo', 'em_analise', 'aproveitado', 'recusado')),
  -- Espelha a validação do formulário: envio sem autorização não entra.
  constraint contribuicoes_exige_autorizacao
    check (autoriza_contato = true),
  -- Limites de tamanho como defesa contra abuso: sem isso, um POST solto enche
  -- a tabela com megabytes de texto.
  constraint contribuicoes_tamanhos check (
    length(nome) between 2 and 120
    and length(contato) between 5 and 200
    and length(relato) between 20 and 5000
    and length(periodo) <= 60
  )
);

comment on table public.contribuicoes is
  'Caixa de entrada do formulário público. Não é acervo: um editor revisa e '
  'copia para `historias` depois de colher o consentimento do titular.';

create index if not exists contribuicoes_situacao_idx
  on public.contribuicoes (situacao, criado_em desc);

alter table public.contribuicoes enable row level security;

-- O público insere e nada mais: sem policy de select, o próprio remetente não
-- relê o que enviou. Ler é privilégio de editor.
drop policy if exists contribuicoes_publico_envia on public.contribuicoes;
create policy contribuicoes_publico_envia on public.contribuicoes
  for insert to anon, authenticated
  with check (true);

drop policy if exists contribuicoes_editor_le on public.contribuicoes;
create policy contribuicoes_editor_le on public.contribuicoes
  for select to authenticated
  using (public.e_editor());

drop policy if exists contribuicoes_editor_gerencia on public.contribuicoes;
create policy contribuicoes_editor_gerencia on public.contribuicoes
  for update to authenticated
  using (public.e_editor())
  with check (public.e_editor());

-- Excluir é só de admin: apagar uma contribuição destrói o registro de que
-- alguém confiou uma memória ao município.
drop policy if exists contribuicoes_admin_exclui on public.contribuicoes;
create policy contribuicoes_admin_exclui on public.contribuicoes
  for delete to authenticated
  using (public.e_admin());

-- Grant mínimo: `anon` insere colunas específicas e não lê nada.
--
-- Sem a lista de colunas, um POST poderia definir `situacao` ou `notas` e
-- mexer na fila de curadoria. `id`, `criado_em` e as colunas de gestão ficam
-- fora do alcance de quem envia.
revoke all on public.contribuicoes from anon;
grant insert (nome, contato, relato, periodo, autoriza_contato)
  on public.contribuicoes to anon;

grant select, insert, update, delete on public.contribuicoes to authenticated;
-- Coluna `identity` não precisa de grant na sequência: o Postgres a alimenta
-- internamente, sem checar permissão de quem insere.

-- A trilha de auditoria vale aqui também: mudança de situação e exclusão
-- precisam de responsável registrado.
drop trigger if exists auditar on public.contribuicoes;
create trigger auditar
  after insert or update or delete on public.contribuicoes
  for each row execute function public.registrar_auditoria();
