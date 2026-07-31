import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  titulo: string
  mensagem: string
  rotuloConfirmar?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export default function Confirmacao({
  titulo,
  mensagem,
  rotuloConfirmar = 'Excluir',
  onConfirmar,
  onCancelar,
}: Props) {
  const refCancelar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    refCancelar.current?.focus()
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onCancelar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(15, 13, 10, 0.8)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmacao-titulo"
        aria-describedby="confirmacao-mensagem"
        className="bg-card border border-border max-w-md w-full p-7"
      >
        <div className="flex items-start gap-4 mb-5">
          <AlertTriangle size={20} className="text-[#e06080] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 id="confirmacao-titulo" className="font-serif text-xl font-bold mb-2">
              {titulo}
            </h2>
            <p id="confirmacao-mensagem" className="text-sm text-muted-foreground leading-relaxed">
              {mensagem}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            ref={refCancelar}
            type="button"
            onClick={onCancelar}
            className="px-5 py-2.5 text-[11px] uppercase tracking-widest border border-border hover:border-foreground/40 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="px-5 py-2.5 text-[11px] uppercase tracking-widest bg-[#c04060] text-white hover:bg-[#a03050] transition-colors"
          >
            {rotuloConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
