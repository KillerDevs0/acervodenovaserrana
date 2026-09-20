import React from 'react'
import type { TipoClassificacaoFonte } from '../types/memorial'

interface Props {
  tipo?: TipoClassificacaoFonte | string
  fonte?: string
  creditos?: string
  responsavel?: string
  nivelConfirmacao?: string
  segundoRelatoDe?: string
  className?: string
}

export default function BadgeFonte({
  tipo = 'Relato oral',
  fonte,
  creditos,
  responsavel,
  nivelConfirmacao,
  segundoRelatoDe,
  className = '',
}: Props) {
  const getCores = (t: string) => {
    switch (t) {
      case 'Fonte documental':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
      case 'Relato oral':
        return 'bg-amber-950/40 text-amber-300 border-amber-800/60'
      case 'Acervo familiar':
        return 'bg-amber-900/30 text-amber-200 border-amber-700/50'
      case 'Imprensa':
        return 'bg-sky-950/40 text-sky-300 border-sky-800/60'
      case 'Publicação':
        return 'bg-purple-950/40 text-purple-300 border-purple-800/60'
      case 'Registro institucional':
        return 'bg-blue-950/40 text-blue-300 border-blue-800/60'
      default:
        return 'bg-card text-muted-foreground border-border'
    }
  }

  return (
    <div className={`text-xs border border-border/80 bg-card/60 p-3 space-y-1.5 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${getCores(
            tipo,
          )}`}
        >
          {tipo}
        </span>
        {segundoRelatoDe && (
          <span className="text-[11px] text-amber-200/90 italic">
            Segundo relato de {segundoRelatoDe}
          </span>
        )}
        {nivelConfirmacao && (
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-auto">
            {nivelConfirmacao}
          </span>
        )}
      </div>

      {(fonte || creditos || responsavel) && (
        <div className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
          {fonte && (
            <div>
              <strong className="text-foreground/90 font-medium">Fonte:</strong> {fonte}
            </div>
          )}
          {creditos && (
            <div>
              <strong className="text-foreground/90 font-medium">Créditos:</strong> {creditos}
            </div>
          )}
          {responsavel && (
            <div>
              <strong className="text-foreground/90 font-medium">Disponibilizado por:</strong>{' '}
              {responsavel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
