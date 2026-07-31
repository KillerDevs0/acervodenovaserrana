import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase, supabaseConfigurado } from '../lib/supabase'

/**
 * Controle de acesso do painel.
 *
 * Dois modos, espelhando o store de conteúdo:
 *
 *   · **Supabase Auth** — com `.env.local` preenchido. A sessão é emitida e
 *     validada pelo servidor, e é ela que o RLS usa para autorizar escrita.
 *     Burlar o front-end não dá acesso ao banco.
 *   · **Demonstração** — sem as chaves. A senha é comparada aqui no navegador,
 *     o que NÃO protege nada: existe só para o projeto rodar sem
 *     infraestrutura. Como nesse modo o conteúdo também é local, não há o que
 *     proteger.
 */

const SESSAO_DEMO_KEY = 'acervo-ns:sessao-admin'
const SENHA_DEMO = 'acervo2024'

interface ContextoAuth {
  autenticado: boolean
  /** Verdadeiro enquanto a sessão existente é verificada. */
  verificando: boolean
  /** `true` quando o login é validado pelo servidor. */
  remoto: boolean
  /** E-mail do editor logado, quando disponível. */
  email: string | null
  /** Retorna `null` em caso de sucesso, ou a mensagem de erro. */
  entrar: (email: string, senha: string) => Promise<string | null>
  sair: () => Promise<void>
}

const Contexto = createContext<ContextoAuth | null>(null)

/** Traduz os erros mais comuns do Supabase Auth. */
function traduzir(mensagem: string) {
  if (/invalid login credentials/i.test(mensagem)) return 'E-mail ou senha incorretos.'
  if (/email not confirmed/i.test(mensagem)) {
    return 'Confirme o e-mail antes de entrar. Verifique sua caixa de entrada.'
  }
  if (/failed to fetch|network/i.test(mensagem)) {
    return 'Não foi possível falar com o servidor. Verifique sua conexão.'
  }
  return mensagem
}

export function ProvedorAuth({ children }: { children: ReactNode }) {
  const remoto = supabaseConfigurado
  const [autenticado, setAutenticado] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [verificando, setVerificando] = useState(remoto)

  useEffect(() => {
    if (!remoto) {
      // Modo demonstração: a sessão dura a aba.
      try {
        setAutenticado(sessionStorage.getItem(SESSAO_DEMO_KEY) === '1')
      } catch {
        /* armazenamento indisponível */
      }
      return
    }

    const cliente = supabase!
    let ativo = true

    // Uma sessão válida pode já existir (recarregar a página, outra aba).
    void cliente.auth.getSession().then(({ data }) => {
      if (!ativo) return
      setAutenticado(Boolean(data.session))
      setEmail(data.session?.user.email ?? null)
      setVerificando(false)
    })

    // Mantém a UI em sincronia com renovação e expiração do token.
    const { data: inscricao } = cliente.auth.onAuthStateChange((_evento, sessao) => {
      setAutenticado(Boolean(sessao))
      setEmail(sessao?.user.email ?? null)
      setVerificando(false)
    })

    return () => {
      ativo = false
      inscricao.subscription.unsubscribe()
    }
  }, [remoto])

  const entrar = useCallback(
    async (endereco: string, senha: string): Promise<string | null> => {
      if (!remoto) {
        if (senha !== SENHA_DEMO) return 'Senha incorreta.'
        setAutenticado(true)
        try {
          sessionStorage.setItem(SESSAO_DEMO_KEY, '1')
        } catch {
          /* armazenamento indisponível */
        }
        return null
      }

      const { error } = await supabase!.auth.signInWithPassword({
        email: endereco.trim(),
        password: senha,
      })
      if (error) return traduzir(error.message)
      return null
    },
    [remoto],
  )

  const sair = useCallback(async () => {
    if (remoto) {
      await supabase!.auth.signOut()
    } else {
      try {
        sessionStorage.removeItem(SESSAO_DEMO_KEY)
      } catch {
        /* armazenamento indisponível */
      }
    }
    setAutenticado(false)
    setEmail(null)
  }, [remoto])

  const valor = useMemo(
    () => ({ autenticado, verificando, remoto, email, entrar, sair }),
    [autenticado, verificando, remoto, email, entrar, sair],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAuth() {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('useAuth precisa estar dentro de <ProvedorAuth>')
  return contexto
}
