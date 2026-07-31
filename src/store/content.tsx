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

/**
 * Camada de conteúdo do acervo.
 *
 * Não existe backend neste projeto: o conteúdo editado no painel administrativo
 * é persistido em localStorage e semeado a partir de `src/data.ts` no primeiro
 * acesso. Ao plugar uma API, troque `carregar`/`persistir` por chamadas HTTP —
 * o restante da aplicação consome apenas o hook `useConteudo`.
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

function conteudoInicial(): Conteudo {
  return {
    documentarios: seedDocumentarios.map((d) => ({ ...d })),
    historias: seedHistorias.map((h) => ({ ...h })),
    fotos: seedFotos.map((f, i) => ({ ...f, id: i + 1 })),
    timeline: seedTimeline.map((m, i) => ({ ...m, id: i + 1 })),
    estados: seedEstados.map((e) => ({ ...e })),
  }
}

const COLECOES: ColecaoId[] = ['documentarios', 'historias', 'fotos', 'timeline', 'estados']

function carregar(): Conteudo {
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

function persistir(conteudo: Conteudo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conteudo))
  } catch (erro) {
    console.error('Falha ao salvar o conteúdo localmente', erro)
  }
}

function proximoId(itens: { id: number }[]) {
  return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1
}

interface ContextoConteudo {
  conteudo: Conteudo
  criar: (colecao: ColecaoId, dados: Record<string, unknown>) => number
  atualizar: (colecao: ColecaoId, id: number, dados: Record<string, unknown>) => void
  remover: (colecao: ColecaoId, id: number) => void
  reordenar: (colecao: ColecaoId, id: number, direcao: -1 | 1) => void
  restaurarPadrao: () => void
}

const Contexto = createContext<ContextoConteudo | null>(null)

export function ProvedorConteudo({ children }: { children: ReactNode }) {
  const [conteudo, setConteudo] = useState<Conteudo>(carregar)

  useEffect(() => {
    persistir(conteudo)
  }, [conteudo])

  const criar = useCallback((colecao: ColecaoId, dados: Record<string, unknown>) => {
    let id = 0
    setConteudo((atual) => {
      const itens = atual[colecao] as { id: number }[]
      id = proximoId(itens)
      return { ...atual, [colecao]: [...itens, { ...dados, id }] as never }
    })
    return id
  }, [])

  const atualizar = useCallback(
    (colecao: ColecaoId, id: number, dados: Record<string, unknown>) => {
      setConteudo((atual) => ({
        ...atual,
        [colecao]: (atual[colecao] as { id: number }[]).map((item) =>
          item.id === id ? { ...item, ...dados, id } : item,
        ) as never,
      }))
    },
    [],
  )

  const remover = useCallback((colecao: ColecaoId, id: number) => {
    setConteudo((atual) => ({
      ...atual,
      [colecao]: (atual[colecao] as { id: number }[]).filter((item) => item.id !== id) as never,
    }))
  }, [])

  const reordenar = useCallback((colecao: ColecaoId, id: number, direcao: -1 | 1) => {
    setConteudo((atual) => {
      const itens = [...(atual[colecao] as { id: number }[])]
      const de = itens.findIndex((item) => item.id === id)
      const para = de + direcao
      if (de < 0 || para < 0 || para >= itens.length) return atual
      ;[itens[de], itens[para]] = [itens[para], itens[de]]
      return { ...atual, [colecao]: itens as never }
    })
  }, [])

  const restaurarPadrao = useCallback(() => {
    setConteudo(conteudoInicial())
  }, [])

  const valor = useMemo(
    () => ({ conteudo, criar, atualizar, remover, reordenar, restaurarPadrao }),
    [conteudo, criar, atualizar, remover, reordenar, restaurarPadrao],
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
