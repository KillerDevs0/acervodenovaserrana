import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { CONTATO, LOGO_SRC, navItems } from '../data'
import type { ItemNav } from '../data'
import { hashAtual, rolarPara } from '../lib/navegacao'

export default function Nav() {
  const [open, setOpen] = useState(false)

  /**
   * O destino de cada item: a aba do acervo quando existe, senão a seção.
   * Aba e seção compartilham o mesmo espaço de hash — ver `lib/navegacao.ts`.
   */
  const destino = (item: ItemNav) => `#${item.aba ?? item.secao}`

  /**
   * Clicar no item que já é o hash atual não muda a URL, e sem mudança de hash
   * o navegador não rola. Nesse caso rolamos à mão.
   */
  const aoClicar = (item: ItemNav) => {
    setOpen(false)
    if (hashAtual() === (item.aba ?? item.secao)) rolarPara(item.secao)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 lg:px-12 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-auto object-contain"
            src={LOGO_SRC}
            alt="Brasão Municipal de Nova Serrana"
          />
          <div className="leading-tight">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Prefeitura Municipal
            </div>
            <div className="text-base font-semibold font-serif">Nova Serrana</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.rotulo}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
              href={destino(item)}
              onClick={() => aoClicar(item)}
            >
              {item.rotulo}
            </a>
          ))}
          <span className="inline-block h-4 w-px bg-border" />
          <a
            className="text-xs px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all uppercase tracking-widest"
            href={CONTATO.pnab}
            target="_blank"
            rel="noopener noreferrer"
          >
            PNAB
          </a>
          <Link
            className="text-xs text-muted-foreground hover:text-accent transition-colors uppercase tracking-widest"
            to="/admin"
          >
            Painel
          </Link>
        </div>

        <button
          className="lg:hidden text-foreground"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-5 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.rotulo}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                href={destino(item)}
                onClick={() => aoClicar(item)}
              >
                {item.rotulo}
              </a>
            ))}
            <a
              className="text-xs px-4 py-2 border border-accent text-accent text-center uppercase tracking-widest"
              href={CONTATO.pnab}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              PNAB
            </a>
            <Link
              className="text-xs text-muted-foreground uppercase tracking-widest"
              to="/admin"
              onClick={() => setOpen(false)}
            >
              Painel
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
