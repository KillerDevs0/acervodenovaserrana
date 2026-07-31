import { useEffect, useRef } from 'react'
import { Clock, User, X } from 'lucide-react'
import type { Documentario } from '../data'

/**
 * Ficha de um documentário, aberta ao clicar no card.
 *
 * Os cards tinham `cursor-pointer` e um botão de play sobreposto, mas nada
 * acontecia no clique. `Documentario` não tem campo de vídeo — só `thumb` —
 * então a ficha mostra o que o acervo realmente sabe (sinopse, ano, direção,
 * duração) em vez de prometer um player que não existe. Quando houver
 * `video_url` no banco, o espaço abaixo da capa é onde ele entra.
 *
 * Acessibilidade: o diálogo prende o foco no botão de fechar ao abrir, responde
 * a Esc, e o clique no fundo escuro fecha. `aria-modal` avisa o leitor de tela
 * de que o resto da página está inerte.
 */

interface Props {
  documentario: Documentario
  aoFechar: () => void
}

export default function FichaDocumentario({ documentario, aoFechar }: Props) {
  const fechar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    fechar.current?.focus()

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
    }
    window.addEventListener('keydown', aoTeclar)

    // Sem isso a página de trás rola junto com a roda do mouse sobre o modal.
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [aoFechar])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(15, 13, 10, 0.85)' }}
      onClick={aoFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        className="relative bg-card border border-border max-w-2xl w-full max-h-full overflow-y-auto"
        // O clique dentro da ficha não deve fechá-la.
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={fechar}
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
          style={{ background: 'rgba(15, 13, 10, 0.6)' }}
        >
          <X size={18} />
        </button>

        <div className="overflow-hidden bg-background" style={{ aspectRatio: '16 / 9' }}>
          <img
            className="w-full h-full object-cover"
            src={documentario.thumb}
            alt={documentario.titulo}
          />
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Documentário</p>
          <h3 id="ficha-titulo" className="text-2xl font-serif font-bold mb-3 leading-tight">
            {documentario.titulo}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">{documentario.subtitulo}</p>

          <dl className="grid sm:grid-cols-3 gap-5 border-t border-border pt-6 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Ano
              </dt>
              <dd className="font-mono text-accent">{documentario.ano}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Direção
              </dt>
              <dd className="flex items-center gap-2">
                <User size={13} className="text-muted-foreground shrink-0" />
                {documentario.diretor}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Duração
              </dt>
              <dd className="flex items-center gap-2">
                <Clock size={13} className="text-muted-foreground shrink-0" />
                {documentario.duracao}
              </dd>
            </div>
          </dl>

          <p className="mt-6 pt-5 border-t border-border text-xs text-muted-foreground leading-relaxed">
            A cópia integral deste documentário fica sob guarda da Secretaria Municipal de Cultura.
            Para agendar exibição ou solicitar acesso para pesquisa, procure o setor pelo contato no
            rodapé.
          </p>
        </div>
      </div>
    </div>
  )
}
