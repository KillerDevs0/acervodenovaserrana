import { supabase } from '../lib/supabase'
import type { ColecaoId, Conteudo, RegistroGenerico } from './content'
import { daBanco, mapas, paraBanco } from './mapeamento'

/**
 * Acesso ao acervo no Supabase.
 *
 * Toda função aqui assume `supabase` não nulo — quem chama verifica
 * `supabaseConfigurado` antes. As mensagens de erro sobem para a UI, então
 * ficam em português e sem jargão de Postgres.
 */

const COLECOES: ColecaoId[] = ['documentarios', 'historias', 'fotos', 'timeline', 'estados']

function exigirCliente() {
  if (!supabase) {
    throw new Error('Supabase não configurado.')
  }
  return supabase
}

/**
 * Lê as cinco coleções em paralelo, já ordenadas para exibição.
 *
 * `completo` pede todas as colunas, inclusive o registro de consentimento das
 * histórias — use apenas no painel, com editor logado. A leitura do site pede
 * colunas nominais para não trafegar dados de gestão até o navegador de
 * visitantes.
 */
export async function buscarTudo(completo = false): Promise<Conteudo> {
  const cliente = exigirCliente()

  const respostas = await Promise.all(
    COLECOES.map((colecao) =>
      cliente
        .from(mapas[colecao].tabela)
        .select(completo ? '*' : mapas[colecao].colunasPublicas)
        .order('ordem', { ascending: true })
        .order('id', { ascending: true }),
    ),
  )

  const conteudo = {} as Conteudo
  respostas.forEach((resposta, i) => {
    const colecao = COLECOES[i]
    if (resposta.error) {
      throw new Error(`Não foi possível carregar ${colecao}: ${resposta.error.message}`)
    }
    // A lista de colunas é montada em tempo de execução, então o supabase-js
    // não consegue inferir a forma da linha — daí o passo por `unknown`.
    const linhas = (resposta.data ?? []) as unknown as Record<string, unknown>[]
    conteudo[colecao] = linhas.map((linha) => daBanco(colecao, linha)) as never
  })

  return conteudo
}

/** Insere no fim da coleção e devolve o registro criado, com o id do banco. */
export async function inserir(
  colecao: ColecaoId,
  dados: Record<string, unknown>,
): Promise<RegistroGenerico> {
  const cliente = exigirCliente()
  const tabela = mapas[colecao].tabela

  // Nova entrada vai para o fim da lista.
  const { data: ultimo, error: erroOrdem } = await cliente
    .from(tabela)
    .select('ordem')
    .order('ordem', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (erroOrdem) {
    throw new Error(`Não foi possível determinar a posição: ${erroOrdem.message}`)
  }

  const ordem = ((ultimo?.ordem as number | undefined) ?? 0) + 1

  const { data, error } = await cliente
    .from(tabela)
    .insert({ ...paraBanco(colecao, dados), ordem })
    .select()
    .single()

  if (error) {
    throw new Error(`Não foi possível salvar: ${error.message}`)
  }

  return daBanco(colecao, data as Record<string, unknown>) as RegistroGenerico
}

export async function editar(
  colecao: ColecaoId,
  id: number,
  dados: Record<string, unknown>,
): Promise<RegistroGenerico> {
  const cliente = exigirCliente()

  const { data, error } = await cliente
    .from(mapas[colecao].tabela)
    .update(paraBanco(colecao, dados))
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Não foi possível salvar as alterações: ${error.message}`)
  }

  return daBanco(colecao, data as Record<string, unknown>) as RegistroGenerico
}

export async function excluir(colecao: ColecaoId, id: number): Promise<void> {
  const cliente = exigirCliente()
  const { error } = await cliente.from(mapas[colecao].tabela).delete().eq('id', id)
  if (error) {
    throw new Error(`Não foi possível excluir: ${error.message}`)
  }
}

/**
 * Troca a posição de dois registros. Sem transação no client, as duas escritas
 * são sequenciais: se a segunda falhar, a primeira é revertida.
 */
export async function trocarOrdem(
  colecao: ColecaoId,
  a: { id: number; ordem: number },
  b: { id: number; ordem: number },
): Promise<void> {
  const cliente = exigirCliente()
  const tabela = mapas[colecao].tabela

  const primeira = await cliente.from(tabela).update({ ordem: b.ordem }).eq('id', a.id)
  if (primeira.error) {
    throw new Error(`Não foi possível reordenar: ${primeira.error.message}`)
  }

  const segunda = await cliente.from(tabela).update({ ordem: a.ordem }).eq('id', b.id)
  if (segunda.error) {
    await cliente.from(tabela).update({ ordem: a.ordem }).eq('id', a.id)
    throw new Error(`Não foi possível reordenar: ${segunda.error.message}`)
  }
}
