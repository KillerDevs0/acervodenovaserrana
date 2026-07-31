import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { useConteudo } from '../store/content'

const LARGURA_MARCO = 240

export default function LinhaDoTempo() {
  const trilha = useRef<HTMLDivElement>(null)
  const { conteudo } = useConteudo()
  const { timeline } = conteudo

  const rolar = (direcao: -1 | 1) =>
    trilha.current?.scrollBy({ left: direcao * LARGURA_MARCO, behavior: 'smooth' })

  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
              História da Cidade
            </p>
            <h2
              className="font-serif font-bold leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Linha do Tempo
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => rolar(-1)}
              className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              aria-label="Anterior"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <button
              onClick={() => rolar(1)}
              className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div ref={trilha} className="overflow-x-auto pb-6 no-scrollbar">
          <div className="relative flex gap-0 min-w-max">
            <div
              className="absolute top-4 left-0 h-px"
              style={{
                width: timeline.length * LARGURA_MARCO,
                background: 'rgba(232, 224, 208, 0.1)',
              }}
            />
            {timeline.map((marco) => (
              <div
                key={marco.id}
                className="relative flex flex-col items-start group cursor-default"
                style={{ width: LARGURA_MARCO, paddingRight: 24 }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 border-accent bg-card mb-5 relative z-10 group-hover:bg-accent transition-colors"
                  style={{ marginTop: 9 }}
                />
                <div className="text-2xl font-serif font-bold mb-2 text-accent">{marco.ano}</div>
                <div className="font-semibold text-sm mb-2 leading-tight">{marco.titulo}</div>
                <p className="text-muted-foreground text-xs leading-relaxed">{marco.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
