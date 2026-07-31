import { useState } from 'react'
import { MapPin, Users } from 'lucide-react'
import { brasilPath, novaSerrana, type EstadoMigracao } from '../data'
import { useConteudo } from '../store/content'

export default function MapaInterativo() {
  const [hover, setHover] = useState<number | null>(null)
  const [fixado, setFixado] = useState<number | null>(null)
  const { conteudoPublico } = useConteudo()
  const { estados } = conteudoPublico

  // Bubble size scales with the number of migrant families.
  const maxFamilias = estados.reduce((maior, e) => Math.max(maior, e.familias), 0)
  const raio = (familias: number) => (maxFamilias > 0 ? 5 + 9 * (familias / maxFamilias) : 5)

  const ativoId = hover ?? fixado
  const ativo: EstadoMigracao | undefined = estados.find((e) => e.id === ativoId)

  const alternarFixado = (id: number) => setFixado((atual) => (atual === id ? null : id))

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Mapa Interativo</p>
          <h2
            className="font-serif font-bold leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            De onde veio nossa gente
          </h2>
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
            Passe o mouse sobre os estados para conhecer os fluxos migratórios que formaram Nova
            Serrana. Clique para fixar e explorar as histórias de cada região.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div className="relative border border-border bg-background/50 overflow-hidden">
            <div className="absolute top-3 left-3 text-[9px] text-muted-foreground uppercase tracking-widest opacity-60">
              Representação artística · fluxos migratórios
            </div>

            <svg className="w-full h-auto" viewBox="0 0 560 475" style={{ maxHeight: '55vh' }}>
              <path
                d={brasilPath}
                fill="#1c1914"
                stroke="rgba(232,224,208,0.06)"
                strokeWidth="1"
              />

              {/* Pulsing rings around Nova Serrana */}
              {[
                { r: 20, begin: '0s' },
                { r: 32, begin: '1s' },
                { r: 44, begin: '2s' },
              ].map((anel) => (
                <circle
                  key={anel.begin}
                  cx={novaSerrana.cx}
                  cy={novaSerrana.cy}
                  r={anel.r}
                  fill="none"
                  stroke="#c49010"
                  strokeWidth="0.8"
                  opacity="0"
                >
                  <animate
                    attributeName="opacity"
                    values="0;0.4;0"
                    dur="3s"
                    begin={anel.begin}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values={`8;${anel.r}`}
                    dur="3s"
                    begin={anel.begin}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              <circle cx={novaSerrana.cx} cy={novaSerrana.cy} r="7" fill="#c49010" />
              <circle cx={novaSerrana.cx} cy={novaSerrana.cy} r="4" fill="#0f0d0a" />
              <text
                x={novaSerrana.cx + 11}
                y={novaSerrana.cy - 10}
                fill="#c49010"
                fontSize="8.5"
                fontFamily="'Source Sans 3', sans-serif"
                fontWeight="600"
                letterSpacing="1"
              >
                NOVA SERRANA
              </text>

              {/* Migration flow lines */}
              {estados.map((e) => {
                const destacado = ativoId === e.id
                return (
                  <line
                    key={`linha-${e.id}`}
                    x1={e.cx}
                    y1={e.cy}
                    x2={novaSerrana.cx}
                    y2={novaSerrana.cy}
                    stroke={destacado ? e.cor : 'rgba(196,144,16,0.12)'}
                    strokeWidth={destacado ? 1.5 : 0.7}
                    strokeDasharray="5 3"
                    style={{ transition: '0.3s' }}
                  />
                )
              })}

              {/* State bubbles */}
              {estados.map((e) => {
                const destacado = ativoId === e.id
                const r = raio(e.familias)
                return (
                  <g
                    key={e.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHover(e.id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => alternarFixado(e.id)}
                  >
                    <circle cx={e.cx} cy={e.cy} r={r + 10} fill="transparent" />
                    <circle
                      cx={e.cx}
                      cy={e.cy}
                      r={r}
                      fill={destacado ? e.cor : '#1a2d6b'}
                      stroke={destacado ? '#c49010' : 'rgba(196,144,16,0.3)'}
                      strokeWidth="1.5"
                      style={{ transition: '0.25s' }}
                    />
                    <text
                      x={e.cx}
                      y={e.cy + r + 12}
                      textAnchor="middle"
                      fill={destacado ? '#e8e0d0' : 'rgba(232,224,208,0.5)'}
                      fontSize="7.5"
                      fontFamily="'Source Sans 3', sans-serif"
                      fontWeight="600"
                      letterSpacing="0.5"
                      style={{ transition: '0.25s', pointerEvents: 'none' }}
                    >
                      {e.sigla}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex flex-col gap-5">
            <div
              className="border p-6 min-h-[180px] transition-all duration-300"
              style={{
                borderColor: ativo ? `${ativo.cor}66` : 'rgba(232, 224, 208, 0.1)',
                background: 'rgba(232, 224, 208, 0.03)',
              }}
            >
              {ativo ? (
                <div className="flex flex-col h-full gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-serif text-xl font-bold" style={{ color: ativo.cor }}>
                      {ativo.estado}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {ativo.sigla}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={15} className="text-muted-foreground" />
                    <span className="font-mono">{ativo.familias.toLocaleString('pt-BR')}</span>
                    <span className="text-muted-foreground text-xs">famílias</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{ativo.desc}</p>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-center items-start gap-3">
                  <MapPin size={22} className="text-muted-foreground" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Selecione um estado no mapa para ver dados de migração e histórias das famílias
                    que vieram para Nova Serrana.
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Principais origens
              </p>
              <div className="flex flex-col">
                {estados.map((e, i) => {
                  const destacado = ativoId === e.id
                  return (
                    <button
                      key={e.id}
                      className="flex items-center gap-3 px-3 py-2.5 text-left transition-all border-l-2"
                      style={{
                        borderLeftColor: destacado ? e.cor : 'transparent',
                        background: destacado ? 'rgba(232, 224, 208, 0.04)' : 'transparent',
                      }}
                      onMouseEnter={() => setHover(e.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => alternarFixado(e.id)}
                    >
                      <span className="text-[10px] text-muted-foreground w-3">{i + 1}</span>
                      <span className="flex-1 text-sm">{e.estado}</span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: destacado ? e.cor : 'rgb(138, 127, 110)' }}
                      >
                        {e.familias.toLocaleString('pt-BR')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
