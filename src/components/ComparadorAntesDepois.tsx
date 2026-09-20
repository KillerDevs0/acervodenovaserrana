import React, { useState, useRef, useCallback } from 'react'
import type { AntesDepoisItem } from '../types/memorial'
import BadgeFonte from './BadgeFonte'
import { AVISO_CONTEUDO } from '../dataMemorial'

interface Props {
  itens: AntesDepoisItem[]
}

export default function ComparadorAntesDepois({ itens }: Props) {
  const [selecionadoIdx, setSelecionadoIdx] = useState(0)
  const [posicao, setPosicao] = useState(50)
  const [orientacao, setOrientacao] = useState<'horizontal' | 'vertical'>('horizontal')
  const containerRef = useRef<HTMLDivElement>(null)
  const arrastando = useRef(false)

  const itemAtual = itens[selecionadoIdx]

  const atualizarPosicao = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (orientacao === 'horizontal') {
      const x = clientX - rect.left
      const novaPos = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setPosicao(novaPos)
    } else {
      const y = clientY - rect.top
      const novaPos = Math.max(0, Math.min(100, (y / rect.height) * 100))
      setPosicao(novaPos)
    }
  }, [orientacao])

  const onPointerDown = () => {
    arrastando.current = true
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastando.current) return
    atualizarPosicao(e.clientX, e.clientY)
  }

  const onPointerUp = () => {
    arrastando.current = false
  }

  if (!itens || itens.length === 0) {
    return (
      <div className="border border-border/80 border-dashed p-10 text-center bg-card/40 my-6">
        <p className="text-sm text-accent mb-2 font-serif font-semibold">Antes e Depois</p>
        <p className="text-sm text-muted-foreground">{AVISO_CONTEUDO}</p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Comparações fotográficas de logradouros, praças e prédios históricos de Nova Serrana estão sendo catalogadas e georreferenciadas.
        </p>
      </div>
    )
  }

  return (
    <article className="border border-border bg-card p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-accent font-semibold block mb-1">
            Transformações Urbanas
          </span>
          <h3 className="font-serif text-2xl font-bold">{itemAtual.nome_local}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {itemAtual.bairro} {itemAtual.endereco_referencia && `• ${itemAtual.endereco_referencia}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="orientacao-comparador" className="text-xs text-muted-foreground">
            Eixo:
          </label>
          <select
            id="orientacao-comparador"
            value={orientacao}
            onChange={(e) => setOrientacao(e.target.value as 'horizontal' | 'vertical')}
            className="bg-[#12100c] border border-border px-2.5 py-1 text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="horizontal">Divisão Vertical (Lado a lado)</option>
            <option value="vertical">Divisão Horizontal (Cima e baixo)</option>
          </select>
        </div>
      </div>

      {itens.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar" role="tablist" aria-label="Locais com antes e depois">
          {itens.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => {
                setSelecionadoIdx(idx)
                setPosicao(50)
              }}
              className={`px-3 py-1.5 text-xs whitespace-nowrap border transition-colors ${
                idx === selecionadoIdx
                  ? 'border-accent text-accent bg-accent/10 font-medium'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {it.nome_local}
            </button>
          ))}
        </div>
      )}

      {/* Container comparador */}
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative select-none overflow-hidden aspect-[16/10] bg-black border border-border/80 cursor-ew-resize touch-none"
        aria-label={`Comparador visual de ${itemAtual.nome_local}`}
      >
        {/* Foto atual (base inferior) */}
        <img
          src={itemAtual.foto_atual_url}
          alt={itemAtual.foto_atual_alt || `Foto atual de ${itemAtual.nome_local} (${itemAtual.ano_atual})`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-sm px-2.5 py-1 border border-border/60 text-[11px] font-mono text-foreground">
          Atual: {itemAtual.ano_atual}
        </div>

        {/* Foto antiga (camada superior recortada) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath:
              orientacao === 'horizontal'
                ? `inset(0 ${100 - posicao}% 0 0)`
                : `inset(0 0 ${100 - posicao}% 0)`,
          }}
        >
          <img
            src={itemAtual.foto_antiga_url}
            alt={itemAtual.foto_antiga_alt || `Foto histórica de ${itemAtual.nome_local} (${itemAtual.ano_antiga})`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-sm px-2.5 py-1 border border-accent/60 text-[11px] font-mono text-accent">
            Antiga: ~{itemAtual.ano_antiga}
          </div>
        </div>

        {/* Divisor / Alça */}
        <div
          onPointerDown={onPointerDown}
          className="absolute z-20 flex items-center justify-center pointer-events-auto"
          style={
            orientacao === 'horizontal'
              ? {
                  left: `${posicao}%`,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  backgroundColor: '#c49010',
                  transform: 'translateX(-50%)',
                }
              : {
                  top: `${posicao}%`,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#c49010',
                  transform: 'translateY(-50%)',
                }
          }
        >
          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg border border-black text-xs font-bold font-mono">
            {orientacao === 'horizontal' ? '⇄' : '⇅'}
          </div>
        </div>
      </div>

      {/* Controles acessíveis para navegação por teclado / slider */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-3 bg-background/60 border border-border/50 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor={`slider-comparador-${itemAtual.id}`} className="text-muted-foreground whitespace-nowrap">
            Deslizar comparação:
          </label>
          <input
            id={`slider-comparador-${itemAtual.id}`}
            type="range"
            min="0"
            max="100"
            value={posicao}
            onChange={(e) => setPosicao(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(posicao)}
            aria-label={`Ajustar proporção visível entre foto antiga e atual de ${itemAtual.nome_local}`}
            className="w-44 accent-accent cursor-pointer"
          />
          <span className="font-mono text-muted-foreground">{Math.round(posicao)}%</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPosicao(100)}
            className="px-2 py-1 text-[11px] border border-border hover:border-accent"
          >
            Apenas Antiga
          </button>
          <button
            type="button"
            onClick={() => setPosicao(50)}
            className="px-2 py-1 text-[11px] border border-border hover:border-accent"
          >
            Meio a meio
          </button>
          <button
            type="button"
            onClick={() => setPosicao(0)}
            className="px-2 py-1 text-[11px] border border-border hover:border-accent"
          >
            Apenas Atual
          </button>
        </div>
      </div>

      {/* Detalhes históricos e créditos */}
      <div className="mt-6 space-y-4 text-sm leading-relaxed border-t border-border pt-4">
        <div>
          <h4 className="font-serif font-bold text-base mb-1">Contexto Histórico</h4>
          <p className="text-muted-foreground">{itemAtual.descricao_historica}</p>
        </div>

        <BadgeFonte
          tipo={itemAtual.tipo_fonte || 'Fonte documental'}
          fonte={itemAtual.fonte_fotografia}
          creditos={itemAtual.creditos}
        />
      </div>
    </article>
  )
}
