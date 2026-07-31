import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { LOGO_SRC } from '../../data'
import { useAuth } from '../auth'

export default function Entrar() {
  const { autenticado, entrar } = useAuth()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navegar = useNavigate()

  if (autenticado) return <Navigate to="/admin" replace />

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (entrar(senha)) {
      navegar('/admin', { replace: true })
    } else {
      setErro('Senha incorreta.')
      setSenha('')
    }
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

        <form onSubmit={enviar} className="border border-border bg-card p-7">
          <label htmlFor="senha" className="block text-[11px] uppercase tracking-widest mb-2">
            Senha de acesso
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setErro('')
            }}
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? 'senha-erro' : undefined}
            className={`w-full bg-[#12100c] border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors ${
              erro ? 'border-[#c04060]' : 'border-border'
            }`}
          />
          {erro && (
            <p id="senha-erro" role="alert" className="text-xs text-[#e06080] mt-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-[11px] uppercase tracking-widest font-semibold hover:bg-accent/90 transition-colors"
          >
            <Lock size={13} aria-hidden="true" />
            Entrar
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
          Ambiente de demonstração. A senha é verificada no navegador e o conteúdo fica salvo apenas
          neste dispositivo.
        </p>
      </div>
    </div>
  )
}
