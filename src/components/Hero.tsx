import { ArrowRight, Play } from 'lucide-react'

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pt-16 overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&auto=format"
          alt="Vista das montanhas e paisagem de Minas Gerais"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgb(15, 13, 10) 30%, rgba(15, 13, 10, 0.65) 70%, rgba(15, 13, 10, 0.3) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: NOISE_SVG }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 w-full">
        <div className="inline-flex items-center gap-2 text-accent text-[10px] uppercase tracking-[0.3em] mb-8 border border-accent/30 px-3 py-1.5">
          <span className="w-4 h-px bg-accent inline-block" />
          Acervo Cultural Digital · Política Nacional Aldir Blanc 2024
        </div>

        <h1
          className="font-serif font-bold leading-[0.9] mb-7"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          Memória
          <br />
          <em className="not-italic text-accent">Viva</em> de
          <br />
          Nova Serrana
        </h1>

        <p className="text-muted-foreground text-lg max-w-lg leading-relaxed mb-10">
          Um arquivo digital da história, das pessoas e da cultura de Nova Serrana — construído com e
          para a comunidade que ergueu esta cidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center gap-3 bg-accent text-accent-foreground px-8 py-4 font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity group">
            Explorar o Acervo
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center justify-center gap-3 border border-foreground/25 text-foreground px-8 py-4 font-semibold uppercase tracking-widest text-xs hover:border-foreground/50 transition-colors">
            <Play size={13} />
            Ver Documentário
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden sm:flex flex-col items-center gap-2 text-muted-foreground opacity-60">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-muted-foreground" />
        <span className="text-[10px] uppercase tracking-[0.3em] mt-2">Rolar</span>
      </div>
    </section>
  )
}
