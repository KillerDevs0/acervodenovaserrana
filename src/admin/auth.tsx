import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Controle de acesso do painel — DEMONSTRAÇÃO APENAS.
 *
 * A senha é comparada no navegador e a sessão fica em sessionStorage, ou seja:
 * qualquer pessoa com acesso ao JavaScript da página consegue contornar esta
 * verificação. Ela serve para desenhar o fluxo do painel, não para proteger
 * conteúdo real.
 *
 * Antes de publicar, mova a autenticação para o servidor: sessão em cookie
 * httpOnly, hash de senha no backend e verificação em todas as rotas de
 * escrita da API. Enquanto o conteúdo vive em localStorage, não há nada
 * no servidor para proteger — e nada que impeça a edição direta pelo console.
 */

const SESSAO_KEY = 'acervo-ns:sessao-admin'
const SENHA_DEMO = 'acervo2024'

interface ContextoAuth {
  autenticado: boolean
  entrar: (senha: string) => boolean
  sair: () => void
}

const Contexto = createContext<ContextoAuth | null>(null)

export function ProvedorAuth({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(() => {
    try {
      return sessionStorage.getItem(SESSAO_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      if (autenticado) sessionStorage.setItem(SESSAO_KEY, '1')
      else sessionStorage.removeItem(SESSAO_KEY)
    } catch {
      /* armazenamento indisponível: a sessão dura só a navegação atual */
    }
  }, [autenticado])

  const entrar = useCallback((senha: string) => {
    const ok = senha === SENHA_DEMO
    if (ok) setAutenticado(true)
    return ok
  }, [])

  const sair = useCallback(() => setAutenticado(false), [])

  const valor = useMemo(() => ({ autenticado, entrar, sair }), [autenticado, entrar, sair])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAuth() {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('useAuth precisa estar dentro de <ProvedorAuth>')
  return contexto
}
