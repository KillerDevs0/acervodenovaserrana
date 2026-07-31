import { Mail, Phone } from 'lucide-react'
import { LOGO_SRC, navItems } from '../data'

export default function Footer() {
  return (
    <footer className="border-t border-border py-14 px-6 lg:px-12 bg-card">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 mb-10">
        <div>
          <img
            className="h-16 w-auto object-contain mb-4"
            src={LOGO_SRC}
            alt="Brasão de Nova Serrana"
          />
          <div className="text-xs text-muted-foreground leading-loose">
            Prefeitura Municipal de Nova Serrana
            <br />
            Secretaria Municipal de Cultura
            <br />
            Rua Presidente Vargas, 100 — Centro
            <br />
            Nova Serrana, MG — CEP 35.519-000
          </div>
        </div>

        <div className="md:text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Realização
          </p>
          <div className="text-base font-serif font-bold mb-1">Acervo Cultural de Nova Serrana</div>
          <div className="text-xs text-muted-foreground">
            Política Nacional Aldir Blanc
            <br />
            Ministério da Cultura · 2024
          </div>
          <div className="mt-6 inline-block border border-accent/30 px-4 py-2">
            <div className="text-[10px] text-accent uppercase tracking-widest">
              PNAB · Lei 14.399/2022
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Navegação
          </p>
          <div className="flex flex-col gap-2 md:items-end">
            {navItems.map((item) => (
              <a
                key={item}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="mt-6 flex gap-4 md:justify-end">
            <a
              className="text-muted-foreground hover:text-accent transition-colors"
              href="mailto:cultura@novaserrana.mg.gov.br"
              aria-label="E-mail"
            >
              <Mail size={16} />
            </a>
            <a
              className="text-muted-foreground hover:text-accent transition-colors"
              href="tel:+5537"
              aria-label="Telefone"
            >
              <Phone size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-muted-foreground">
        <span>© 2024 Prefeitura Municipal de Nova Serrana. Todos os direitos reservados.</span>
        <span>Desenvolvido com apoio da Política Nacional Aldir Blanc</span>
      </div>
    </footer>
  )
}
