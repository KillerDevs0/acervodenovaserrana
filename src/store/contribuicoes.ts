import { supabase } from '../lib/supabase'

/**
 * Envio de contribuições do público (formulário "Enviar Memória").
 *
 * Grava em `contribuicoes`, nunca em `historias`: o que chega pelo site é
 * material bruto para curadoria, não acervo. Ver `supabase/migrations/0004`.
 *
 * A escrita é anônima por design — o RLS permite `insert` e nada mais, então
 * quem envia não relê nem lista o que já foi enviado.
 */

export interface Contribuicao {
  nome: string
  contato: string
  relato: string
  periodo: string
  autorizaContato: boolean
}

/** Limites espelhados da constraint `contribuicoes_tamanhos` na 0004. */
export const LIMITES = {
  nome: { min: 2, max: 120 },
  contato: { min: 5, max: 200 },
  relato: { min: 20, max: 5000 },
  periodo: { max: 60 },
} as const

/**
 * Valida antes de ir ao banco, com as mesmas regras da constraint.
 *
 * Duplicar a regra é deliberado: no banco ela é garantia, aqui é cortesia —
 * o visitante recebe o erro no campo certo em vez de uma mensagem do Postgres.
 *
 * Devolve um mapa campo → mensagem; vazio significa válido.
 */
export function validar(dados: Contribuicao): Record<string, string> {
  const erros: Record<string, string> = {}
  const nome = dados.nome.trim()
  const contato = dados.contato.trim()
  const relato = dados.relato.trim()

  if (nome.length < LIMITES.nome.min) erros.nome = 'Informe seu nome.'
  else if (nome.length > LIMITES.nome.max) erros.nome = 'Nome muito longo.'

  if (contato.length < LIMITES.contato.min) {
    erros.contato = 'Informe um e-mail ou telefone para retorno.'
  } else if (contato.length > LIMITES.contato.max) {
    erros.contato = 'Contato muito longo.'
  }

  if (relato.length < LIMITES.relato.min) {
    erros.relato = `Conte um pouco mais — ao menos ${LIMITES.relato.min} caracteres.`
  } else if (relato.length > LIMITES.relato.max) {
    erros.relato = `Máximo de ${LIMITES.relato.max} caracteres.`
  }

  if (dados.periodo.trim().length > LIMITES.periodo.max) {
    erros.periodo = 'Período muito longo.'
  }

  if (!dados.autorizaContato) {
    erros.autorizaContato = 'Precisamos da sua autorização para entrar em contato.'
  }

  return erros
}

/**
 * A tabela ainda não existe? A 0004 é aplicada à mão no Supabase, então este é
 * o estado esperado até que isso aconteça.
 *
 * Verificado contra o banco em 31/07/2026: o PostgREST responde `PGRST205`
 * ("Could not find the table ... in the schema cache"), não o `42P01` do
 * Postgres — ele nem chega a executar a query. Checar só o código do Postgres
 * deixaria passar o caso real.
 */
function tabelaAusente(error: { code?: string; message?: string }): boolean {
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    /could not find the table/i.test(error.message ?? '')
  )
}

/** Situações possíveis, na ordem da fila de curadoria. */
export const SITUACOES = ['novo', 'em_analise', 'aproveitado', 'recusado'] as const

export type Situacao = (typeof SITUACOES)[number]

export const ROTULO_SITUACAO: Record<Situacao, string> = {
  novo: 'Novo',
  em_analise: 'Em análise',
  aproveitado: 'Aproveitado',
  recusado: 'Recusado',
}

/** Uma contribuição como o painel a vê, com os campos de gestão. */
export interface ContribuicaoRegistro {
  id: number
  nome: string
  contato: string
  relato: string
  periodo: string
  autoriza_contato: boolean
  situacao: Situacao
  notas: string
  criado_em: string
}

/**
 * Lê a fila de curadoria. Exige editor: o RLS recusa leitura anônima, e o
 * conteúdo é dado pessoal de quem escreveu para a Secretaria.
 */
export async function listar(): Promise<ContribuicaoRegistro[]> {
  if (!supabase) throw new Error('Supabase não configurado.')

  const { data, error } = await supabase
    .from('contribuicoes')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) {
    if (tabelaAusente(error)) {
      throw new Error(
        'A tabela de contribuições ainda não existe. Aplique a migration 0004 no SQL Editor do Supabase.',
      )
    }
    throw new Error(`Não foi possível carregar as contribuições: ${error.message}`)
  }

  return (data ?? []) as ContribuicaoRegistro[]
}

/** Atualiza situação e/ou notas de uma contribuição. */
export async function atualizar(
  id: number,
  campos: { situacao?: Situacao; notas?: string },
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.')

  const { error } = await supabase.from('contribuicoes').update(campos).eq('id', id)
  if (error) {
    throw new Error(`Não foi possível salvar: ${error.message}`)
  }
}

export async function enviar(dados: Contribuicao): Promise<void> {
  if (!supabase) {
    throw new Error(
      'O envio pelo site não está disponível nesta instalação. Use o e-mail da Secretaria.',
    )
  }

  const { error } = await supabase.from('contribuicoes').insert({
    nome: dados.nome.trim(),
    contato: dados.contato.trim(),
    relato: dados.relato.trim(),
    periodo: dados.periodo.trim(),
    autoriza_contato: dados.autorizaContato,
  })

  if (error) {
    if (tabelaAusente(error)) {
      throw new Error(
        'O envio pelo site ainda não foi liberado. Use o e-mail da Secretaria, no rodapé.',
      )
    }
    console.error('Falha ao enviar contribuição', error)
    throw new Error('Não foi possível enviar agora. Tente novamente ou use o e-mail do rodapé.')
  }
}
