import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { LOGO_SRC } from '../../data'
import { useAuth } from '../auth'

const CLASSE_CAMPO =
  'w-full bg-[#12100c] border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors'

export default function Entrar() {
  const { autenticado, verificando, remoto, entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()
  const local = useLocation()

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Verificando sessão…</p>
      </div>
    )
  }

  if (autenticado) {
    const destino = (local.state as { de?: string } | null)?.de ?? '/admin'
    return <Navigate to={destino} replace />
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    const falha = await entrar(email, senha)
    if (falha) {
      setErro(falha)
      setSenha('')
      setEnviando(false)
      return
    }
    navegar((local.state as { de?: string } | null)?.de ?? '/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-9">
          <img src={LOGO_SRC} alt="" className="h-14 w-auto object-contain mb-5" aria-hidden="true" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Área restrita</p>
          <h1 className="font-serif text-2xl font-bold">Painel do Acervo</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gestão de conteúdo do Acervo Cultural de Nova Serrana
          </p>
        </div>

        <form onSubmit={enviar} className="border border-border bg-card p-7 flex flex-col gap-5">
          {remoto && (
            <div>
              <label htmlFor="email" className="block text-[11px] uppercase tracking-widest mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                autoFocus
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErro('')
                }}
                className={`${CLASSE_CAMPO} ${erro ? 'border-[#c04060]' : 'border-border'}`}
              />
            </div>
          )}

          <div>
            <label htmlFor="senha" className="block text-[11px] uppercase tracking-widest mb-2">
              {remoto ? 'Senha' : 'Senha de acesso'}
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              autoFocus={!remoto}
              required
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value)
                setErro('')
              }}
              aria-invalid={erro ? true : undefined}
              aria-describedby={erro ? 'login-erro' : undefined}
              className={`${CLASSE_CAMPO} ${erro ? 'border-[#c04060]' : 'border-border'}`}
            />
          </div>

          {erro && (
            <p id="login-erro" role="alert" className="text-xs text-[#e06080]">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-1 w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-[11px] uppercase tracking-widest font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Lock size={13} aria-hidden="true" />
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {!remoto && (
          <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
            Ambiente de demonstração. A senha é verificada no navegador e o conteúdo fica salvo
            apenas neste dispositivo.
          </p>
        )}
      </div>
    </div>
  )
}
