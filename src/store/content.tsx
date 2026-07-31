import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  documentarios as seedDocumentarios,
  estados as seedEstados,
  fotos as seedFotos,
  historias as seedHistorias,
  timeline as seedTimeline,
} from '../data'
import type { Documentario, EstadoMigracao, Foto, Historia, MarcoTemporal } from '../data'
import { supabaseConfigurado } from '../lib/supabase'
import * as repo from './repositorio'

/**
 * Camada de conteúdo do acervo.
 *
 * Opera em dois modos, decididos por `supabaseConfigurado`:
 *
 *   · **Supabase** — quando `.env.local` está preenchido. Fonte de verdade é o
 *     banco; a escrita exige sessão autenticada por conta do RLS.
 *   · **Local** — sem as chaves. Conteúdo em localStorage, semeado de
 *     `src/data.ts`. Serve para rodar o projeto sem infraestrutura, mas as
 *     edições não saem do navegador.
 *
 * As operações são assíncronas nos dois modos, para que a UI tenha um caminho
 * só. No modo local elas resolvem de imediato.
 */

export const STORAGE_KEY = 'acervo-ns:conteudo:v1'

/** Fotos e marcos temporais não têm id na origem; normalizamos para o CRUD. */
export interface FotoRegistro extends Foto {
  id: number
}

export interface MarcoRegistro extends MarcoTemporal {
  id: number
}

export interface Conteudo {
  documentarios: Documentario[]
  historias: Historia[]
  fotos: FotoRegistro[]
  timeline: MarcoRegistro[]
  estados: EstadoMigracao[]
}

export type ColecaoId = keyof Conteudo

/** Registro genérico: toda coleção tem `id` numérico. */
export type Registro = Conteudo[ColecaoId][number]

/**
 * Visão de uma coleção como registros de chave/valor, para o CRUD dirigido por
 * schema. As interfaces do acervo não têm index signature, então a leitura
 * genérica por nome de campo passa por aqui em vez de espalhar casts.
 */
export type RegistroGenerico = Record<string, unknown> & { id: number }

export function comoRegistros(itens: readonly Registro[]): RegistroGenerico[] {
  return itens as unknown as RegistroGenerico[]
}

const COLECOES: ColecaoId[] = ['documentarios', 'historias', 'fotos', 'timeline', 'estados']

function conteudoInicial(): Conteudo {
  return {
    documentarios: seedDocumentarios.map((d) => ({ ...d })),
    historias: seedHistorias.map((h) => ({ ...h })),
    fotos: seedFotos.map((f, i) => ({ ...f, id: i + 1 })),
    timeline: seedTimeline.map((m, i) => ({ ...m, id: i + 1 })),
    estados: seedEstados.map((e) => ({ ...e })),
  }
}

function carregarLocal(): Conteudo {
  const base = conteudoInicial()
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return base
    const salvo = JSON.parse(bruto) as Partial<Conteudo>
    // Mescla por coleção: um schema novo continua funcionando com dados antigos.
    for (const chave of COLECOES) {
      const valor = salvo[chave]
      if (Array.isArray(valor)) {
        base[chave] = valor as never
      }
    }
    return base
  } catch {
    return base
  }
}

function persistirLocal(conteudo: Conteudo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conteudo))
  } catch (erro) {
    console.error('Falha ao salvar o conteúdo localmente', erro)
  }
}

function proximoId(itens: { id: number }[]) {
  return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1
}

function mensagem(erro: unknown) {
  return erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.'
}

interface ContextoConteudo {
  conteudo: Conteudo
  /** Verdadeiro durante a carga inicial do banco. */
  carregando: boolean
  /** Erro da última leitura do banco, se houver. */
  erro: string | null
  /** `false` quando rodando em localStorage. */
  remoto: boolean
  recarregar: () => Promise<void>
  criar: (colecao: ColecaoId, dados: Record<string, unknown>) => Promise<void>
  atualizar: (colecao: ColecaoId, id: number, dados: Record<string, unknown>) => Promise<void>
  remover: (colecao: ColecaoId, id: number) => Promise<void>
  reordenar: (colecao: ColecaoId, id: number, direcao: -1 | 1) => Promise<void>
  restaurarPadrao: () => void
}

const Contexto = createContext<ContextoConteudo | null>(null)

export function ProvedorConteudo({ children }: { children: ReactNode }) {
  const remoto = supabaseConfigurado
  const [conteudo, setConteudo] = useState<Conteudo>(() =>
    remoto
      ? { documentarios: [], historias: [], fotos: [], timeline: [], estados: [] }
      : carregarLocal(),
  )
  const [carregando, setCarregando] = useState(remoto)
  const [erro, setErro] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    if (!remoto) return
    setCarregando(true)
    try {
      setConteudo(await repo.buscarTudo())
      setErro(null)
    } catch (e) {
      setErro(mensagem(e))
    } finally {
      setCarregando(false)
    }
  }, [remoto])

  useEffect(() => {
    void recarregar()
  }, [recarregar])

  // No modo local, cada mudança é espelhada no localStorage.
  useEffect(() => {
    if (!remoto) persistirLocal(conteudo)
  }, [conteudo, remoto])

  const criar = useCallback(
    async (colecao: ColecaoId, dados: Record<string, unknown>) => {
      if (remoto) {
        const criado = await repo.inserir(colecao, dados)
        setConteudo((atual) => ({
          ...atual,
          [colecao]: [...comoRegistros(atual[colecao]), criado] as never,
        }))
        return
      }
      setConteudo((atual) => {
        const itens = atual[colecao] as { id: number }[]
        return {
          ...atual,
          [colecao]: [...itens, { ...dados, id: proximoId(itens) }] as never,
        }
      })
    },
    [remoto],
  )

  const atualizar = useCallback(
    async (colecao: ColecaoId, id: number, dados: Record<string, unknown>) => {
      if (remoto) {
        const salvo = await repo.editar(colecao, id, dados)
        setConteudo((atual) => ({
          ...atual,
          [colecao]: comoRegistros(atual[colecao]).map((item) =>
            item.id === id ? salvo : item,
          ) as never,
        }))
        return
      }
      setConteudo((atual) => ({
        ...atual,
        [colecao]: (atual[colecao] as { id: number }[]).map((item) =>
          item.id === id ? { ...item, ...dados, id } : item,
        ) as never,
      }))
    },
    [remoto],
  )

  const remover = useCallback(
    async (colecao: ColecaoId, id: number) => {
      if (remoto) await repo.excluir(colecao, id)
      setConteudo((atual) => ({
        ...atual,
        [colecao]: (atual[colecao] as { id: number }[]).filter((item) => item.id !== id) as never,
      }))
    },
    [remoto],
  )

  const reordenar = useCallback(
    async (colecao: ColecaoId, id: number, direcao: -1 | 1) => {
      const itens = comoRegistros(conteudo[colecao])
      const de = itens.findIndex((item) => item.id === id)
      const para = de + direcao
      if (de < 0 || para < 0 || para >= itens.length) return

      if (remoto) {
        const a = itens[de]
        const b = itens[para]
        await repo.trocarOrdem(
          colecao,
          { id: a.id, ordem: a.ordem as number },
          { id: b.id, ordem: b.ordem as number },
        )
        // Espelha a troca localmente: cada registro assume a posição do outro,
        // e a lista é reordenada para refletir a nova sequência.
        setConteudo((atual) => {
          const lista = [...comoRegistros(atual[colecao])]
          lista[de] = { ...b, ordem: a.ordem }
          lista[para] = { ...a, ordem: b.ordem }
          return { ...atual, [colecao]: lista as never }
        })
        return
      }

      setConteudo((atual) => {
        const lista = [...(atual[colecao] as { id: number }[])]
        ;[lista[de], lista[para]] = [lista[para], lista[de]]
        return { ...atual, [colecao]: lista as never }
      })
    },
    [conteudo, remoto],
  )

  /**
   * Só existe no modo local, onde o conteúdo é do navegador e descartável.
   * Com o banco como fonte de verdade, "restaurar o original" seria apagar o
   * acervo de todos — uma operação destrutiva que não cabe num botão de painel.
   */
  const restaurarPadrao = useCallback(() => {
    if (remoto) return
    setConteudo(conteudoInicial())
  }, [remoto])

  const valor = useMemo(
    () => ({
      conteudo,
      carregando,
      erro,
      remoto,
      recarregar,
      criar,
      atualizar,
      remover,
      reordenar,
      restaurarPadrao,
    }),
    [
      conteudo,
      carregando,
      erro,
      remoto,
      recarregar,
      criar,
      atualizar,
      remover,
      reordenar,
      restaurarPadrao,
    ],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useConteudo() {
  const contexto = useContext(Contexto)
  if (!contexto) {
    throw new Error('useConteudo precisa estar dentro de <ProvedorConteudo>')
  }
  return contexto
}
