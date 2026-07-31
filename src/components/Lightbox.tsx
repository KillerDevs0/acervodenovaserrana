import { useEffect, useRef } from 'react'
import { ChevronRight, X } from 'lucide-react'
import type { FotoRegistro } from '../store/content'

/**
 * Ampliação das fotografias do acervo.
 *
 * Os cards da aba Fotografias tinham `cursor-pointer` e nada acontecia. Numa
 * grade de miniaturas recortadas em 220px de altura, ver a imagem inteira é o
 * mínimo que o clique deve entregar — a legenda muitas vezes é o único registro
 * de data e lugar, então ela vem junto.
 *
 * Setas e Esc funcionam; o foco fica preso nos controles enquanto está aberto.
 */

interface Props {
  fotos: FotoRegistro[]
  indice: number
  aoNavegar: (indice: number) => void
  aoFechar: () => void
}

export default function Lightbox({ fotos, indice, aoNavegar, aoFechar }: Props) {
  const fechar = useRef<HTMLButtonElement>(null)
  const foto = fotos[indice]

  useEffect(() => {
    fechar.current?.focus()

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflowAnterior
    }
  }, [])

  // Depende de `indice`: o passo é calculado a partir da posição atual.
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return aoFechar()
      const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
      if (passo === undefined) return
      e.preventDefault()
      aoNavegar((indice + passo + fotos.length) % fotos.length)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [indice, fotos.length, aoNavegar, aoFechar])

  if (!foto) return null

  const ir = (passo: number) => aoNavegar((indice + passo + fotos.length) % fotos.length)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografia ${indice + 1} de ${fotos.length}: ${foto.leg}`}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: 'rgba(15, 13, 10, 0.94)' }}
      onClick={aoFechar}
    >
      <div className="flex items-center justify-between gap-4 p-4 shrink-0">
        <span className="text-xs font-mono text-muted-foreground">
          {indice + 1} / {fotos.length}
        </span>
        <button
          ref={fechar}
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4 min-h-0">
        {fotos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              ir(-1)
            }}
            aria-label="Fotografia anterior"
            className="shrink-0 w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            style={{ background: 'rgba(15, 13, 10, 0.6)' }}
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
        )}

        <img
          src={foto.url}
          alt={foto.leg}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain"
        />

        {fotos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              ir(1)
            }}
            aria-label="Próxima fotografia"
            className="shrink-0 w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            style={{ background: 'rgba(15, 13, 10, 0.6)' }}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <figcaption className="shrink-0 p-5 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        {foto.leg}
      </figcaption>
    </div>
  )
}
