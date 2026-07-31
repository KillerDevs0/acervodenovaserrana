import type { ColecaoId } from './content'

/**
 * Ponte entre os nomes usados na aplicação e os do banco.
 *
 * Duas divergências deliberadas (veja supabase/migrations/0001):
 *   · `desc` virou `descricao` — `desc` é palavra reservada em SQL.
 *   · `leg`/`span` viraram `legenda`/`destaque`, mais legíveis numa tabela.
 *
 * A posição de exibição, hoje implícita na ordem do array, vira a coluna
 * `ordem` — por isso toda leitura ordena por ela.
 */

export interface MapaColecao {
  tabela: string
  /** campo na aplicação → coluna no banco. Omitidos têm o mesmo nome. */
  alias: Record<string, string>
}

export const mapas: Record<ColecaoId, MapaColecao> = {
  documentarios: { tabela: 'documentarios', alias: {} },
  historias: { tabela: 'historias', alias: {} },
  fotos: { tabela: 'fotos', alias: { leg: 'legenda', span: 'destaque' } },
  timeline: { tabela: 'marcos_temporais', alias: { desc: 'descricao' } },
  estados: { tabela: 'estados_origem', alias: { desc: 'descricao' } },
}

/** Aplicação → banco. Descarta `id` e `ordem`, controlados pelo repositório. */
export function paraBanco(colecao: ColecaoId, dados: Record<string, unknown>) {
  const { alias } = mapas[colecao]
  const saida: Record<string, unknown> = {}
  for (const [campo, valor] of Object.entries(dados)) {
    if (campo === 'id' || campo === 'ordem') continue
    saida[alias[campo] ?? campo] = valor
  }
  return saida
}

/**
 * Banco → aplicação. Descarta apenas os timestamps, que a UI não usa.
 *
 * `ordem` é preservada de propósito: a reordenação no painel precisa saber a
 * posição atual de cada registro para trocá-la com a do vizinho. Os formulários
 * são gerados a partir de `schema.campos`, então o campo extra não aparece.
 */
export function daBanco(colecao: ColecaoId, linha: Record<string, unknown>) {
  const { alias } = mapas[colecao]
  const inverso = Object.fromEntries(Object.entries(alias).map(([app, db]) => [db, app]))
  const saida: Record<string, unknown> = {}
  for (const [coluna, valor] of Object.entries(linha)) {
    if (coluna === 'criado_em' || coluna === 'atualizado_em') continue
    saida[inverso[coluna] ?? coluna] = valor
  }
  return saida
}
