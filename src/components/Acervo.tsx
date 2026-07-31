import { useState } from 'react'
import { ArrowRight, Camera, Film, Play, Users } from 'lucide-react'
import { useConteudo } from '../store/content'

const abas = [
  { id: 'documentarios', rotulo: 'Documentários', Icone: Film },
  { id: 'historias', rotulo: 'Histórias', Icone: Users },
  { id: 'fotografias', rotulo: 'Fotografias', Icone: Camera },
] as const

type AbaId = (typeof abas)[number]['id']

export default function Acervo() {
  const [aba, setAba] = useState<AbaId>('documentarios')
  const { conteudo } = useConteudo()
  const { documentarios, historias, fotos } = conteudo

  return (
    <section className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Acervo Digital</p>
          <h2
            className="font-serif font-bold leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Explore a memória da cidade
          </h2>

          <div className="flex gap-0 border-b border-border overflow-x-auto no-scrollbar">
            {abas.map(({ id, rotulo, Icone }) => {
              const ativa = aba === id
              return (
                <button
                  key={id}
                  onClick={() => setAba(id)}
                  className="flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap"
                  style={{
                    color: ativa ? 'rgb(196, 144, 16)' : 'rgb(138, 127, 110)',
                    borderBottomColor: ativa ? 'rgb(196, 144, 16)' : 'transparent',
                  }}
                >
                  <Icone size={13} />
                  {rotulo}
                </button>
              )
            })}
          </div>
        </div>

        {aba === 'documentarios' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {documentarios.map((d) => (
              <div key={d.id} className="group cursor-pointer">
                <div
                  className="relative overflow-hidden mb-4 bg-card"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={d.thumb}
                    alt={d.titulo}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(15, 13, 10, 0.4)' }}
                  >
                    <div
                      className="w-14 h-14 rounded-full border-2 border-white/70 flex items-center justify-center transition-all duration-300 group-hover:border-accent group-hover:bg-accent/80"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <Play size={18} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-1"
                    style={{ background: 'rgba(0, 0, 0, 0.7)', color: 'rgb(232, 224, 208)' }}
                  >
                    {d.duracao}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest mb-1 text-accent">
                  {d.ano} · {d.diretor}
                </div>
                <h3 className="text-xl font-serif font-bold mb-1">{d.titulo}</h3>
                <p className="text-muted-foreground text-sm">{d.subtitulo}</p>
              </div>
            ))}
          </div>
        )}

        {aba === 'historias' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {historias.map((h) => (
              <div key={h.id} className="group cursor-pointer">
                <div
                  className="relative overflow-hidden mb-4 bg-card"
                  style={{ aspectRatio: '4 / 5' }}
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={h.foto}
                    alt={h.nome}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(15,13,10,0.85) 0%, rgba(15,13,10,0) 60%)',
                    }}
                  />
                  <div
                    className="absolute bottom-3 left-3 text-[10px] font-mono px-2 py-1"
                    style={{ background: 'rgba(0, 0, 0, 0.7)', color: 'rgb(196, 144, 16)' }}
                  >
                    {h.chegada}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest mb-1 text-accent">
                  {h.origem}
                </div>
                <h3 className="text-base font-serif font-bold mb-1 leading-tight">{h.nome}</h3>
                <p className="text-muted-foreground text-xs mb-3 leading-snug">{h.profissao}</p>
                <p className="text-sm italic leading-relaxed border-l-2 border-accent/40 pl-3">
                  “{h.citacao}”
                </p>
              </div>
            ))}
          </div>
        )}

        {aba === 'fotografias' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[220px]">
            {fotos.map((f) => (
              <figure
                key={f.id}
                className={`group relative overflow-hidden bg-card cursor-pointer ${f.span}`}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={f.url}
                  alt={f.leg}
                />
                <figcaption
                  className="absolute bottom-0 left-0 right-0 p-4 text-xs"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(15,13,10,0.9) 0%, rgba(15,13,10,0) 100%)',
                  }}
                >
                  {f.leg}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-3 border border-foreground/20 text-foreground px-10 py-4 font-semibold uppercase tracking-widest text-xs hover:border-accent hover:text-accent transition-all group">
            Ver todo o acervo
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
