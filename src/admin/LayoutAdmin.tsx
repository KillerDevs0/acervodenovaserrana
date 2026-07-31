import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { LOGO_SRC } from '../data'
import { useConteudo } from '../store/content'
import { useAuth } from './auth'
import { schemas } from './schemas'

function classeItem({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-3 px-4 py-2.5 text-[11px] uppercase tracking-widest transition-colors border-l-2',
    isActive
      ? 'border-accent text-accent bg-accent/5'
      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5',
  ].join(' ')
}

export default function LayoutAdmin() {
  const [menuAberto, setMenuAberto] = useState(false)
  const { sair, email } = useAuth()
  const { recarregar, remoto } = useConteudo()
  const navegar = useNavigate()

  // A carga inicial é a pública (o site monta antes do login). Dentro do
  // painel, relê com as colunas de gestão para que o consentimento apareça
  // nos formulários.
  useEffect(() => {
    if (remoto) void recarregar(true)
  }, [remoto, recarregar])

  const aoSair = async () => {
    await sair()
    navegar('/admin/entrar', { replace: true })
  }

  const navegacao = (
    <nav className="flex flex-col gap-1" aria-label="Seções do painel">
      <NavLink to="/admin" end className={classeItem} onClick={() => setMenuAberto(false)}>
        <LayoutDashboard size={14} aria-hidden="true" />
        Visão geral
      </NavLink>

      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 px-4 pt-5 pb-2">
        Coleções
      </p>

      {schemas.map(({ id, rotulo, Icone }) => (
        <NavLink
          key={id}
          to={`/admin/${id}`}
          className={classeItem}
          onClick={() => setMenuAberto(false)}
        >
          <Icone size={14} aria-hidden="true" />
          {rotulo}
        </NavLink>
      ))}

      {/*
        Separado das coleções: contribuição não é acervo, é a caixa de entrada
        do formulário do site, e o que está lá não aparece em página pública.
      */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 px-4 pt-5 pb-2">
        Recebidos
      </p>

      <NavLink to="/admin/contribuicoes" className={classeItem} onClick={() => setMenuAberto(false)}>
        <Inbox size={14} aria-hidden="true" />
        Contribuições
      </NavLink>
    </nav>
  )

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <header className="lg:hidden border-b border-border flex items-center justify-between px-5 h-16 sticky top-0 z-30 bg-background/95 backdrop-blur-md">
        <span className="font-serif font-bold">Painel do Acervo</span>
        <button
          onClick={() => setMenuAberto((v) => !v)}
          aria-label="Menu do painel"
          aria-expanded={menuAberto}
          className="text-foreground"
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <aside
        className={`${
          menuAberto ? 'block' : 'hidden'
        } lg:block lg:w-64 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-border lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto py-6`}
      >
        <div className="hidden lg:flex items-center gap-3 px-5 mb-8">
          <img src={LOGO_SRC} alt="" className="h-9 w-auto object-contain" aria-hidden="true" />
          <div className="leading-tight">
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest">
              Administração
            </div>
            <div className="text-sm font-semibold font-serif">Acervo Cultural</div>
          </div>
        </div>

        {navegacao}

        <div className="mt-8 pt-5 border-t border-border px-4 flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <ExternalLink size={13} aria-hidden="true" />
            Ver o site
          </Link>
          {email && (
            <p className="text-[11px] text-muted-foreground/70 break-all leading-relaxed">{email}</p>
          )}
          <button
            onClick={() => void aoSair()}
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={13} aria-hidden="true" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-5 lg:px-10 py-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  )
}
