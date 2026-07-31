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
  /**
   * Colunas que o site público pode ler.
   *
   * `*` entregaria tudo que a tabela tem, e em `historias` isso inclui o
   * registro de consentimento — onde fica anotado o paradeiro do termo assinado
   * e os limites que o titular impôs. Visitante não precisa disso, então a
   * leitura anônima pede colunas nominais.
   */
  colunasPublicas: string
}

/** Colunas de controle presentes em toda tabela do acervo. */
const CONTROLE = 'id, ordem, publicado'

export const mapas: Record<ColecaoId, MapaColecao> = {
  documentarios: {
    tabela: 'documentarios',
    alias: {},
    colunasPublicas: `${CONTROLE}, titulo, subtitulo, duracao, ano, diretor, thumb`,
  },
  historias: {
    tabela: 'historias',
    alias: {},
    // Sem `consentimento_em` nem `consentimento_obs`: são dados de gestão do
    // acervo, não conteúdo editorial.
    colunasPublicas: `${CONTROLE}, nome, origem, chegada, profissao, foto, citacao`,
  },
  fotos: {
    tabela: 'fotos',
    alias: { leg: 'legenda', span: 'destaque' },
    colunasPublicas: `${CONTROLE}, url, legenda, destaque`,
  },
  timeline: {
    tabela: 'marcos_temporais',
    alias: { desc: 'descricao' },
    colunasPublicas: `${CONTROLE}, ano, titulo, descricao`,
  },
  estados: {
    tabela: 'estados_origem',
    alias: { desc: 'descricao' },
    colunasPublicas: `${CONTROLE}, estado, sigla, familias, cor, cx, cy, descricao`,
  },
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
