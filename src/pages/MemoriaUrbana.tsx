import { useEffect, useMemo, useState } from 'react'
import { Clock, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AVISO_CONTEUDO, AVISO_VALIDACAO, antesDepois, bairrosLugares, marcosUrbanos } from '../dataMemorial'
import ComparadorAntesDepois from '../components/ComparadorAntesDepois'
import BadgeFonte from '../components/BadgeFonte'

const categoriasUnicas = [
  'todas',
  'crescimento urbano',
  'formação de bairros',
  'praças',
  'igrejas',
  'escolas',
  'prédios',
  'fábricas',
  'comércio',
  'indústria calçadista',
  'espaços públicos',
  'transformações da cidade',
]

export default function MemoriaUrbana() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [marcoSelecionadoId, setMarcoSelecionadoId] = useState<number | null>(null)

  const marcosFiltrados = useMemo(
    () =>
      categoriaFiltro === 'todas'
        ? marcosUrbanos
        : marcosUrbanos.filter((m) => m.categoria === categoriaFiltro),
    [categoriaFiltro],
  )

  const marcoAtivo = useMemo(
    () => marcosFiltrados.find((m) => m.id === marcoSelecionadoId) ?? marcosFiltrados[0],
    [marcosFiltrados, marcoSelecionadoId],
  )

  useEffect(() => {
    setMarcoSelecionadoId(null)
  }, [categoriaFiltro])

  return (
    <main className="pt-28 pb-24 px-6 lg:px-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-accent text-[10px] uppercase tracking-[0.3em] mb-6 border border-accent/30 px-3 py-1.5">
            <MapPin size={12} />
            Memória Urbana
          </div>
          <h1 className="font-serif font-bold leading-tight mb-5" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            A cidade em <em className="not-italic text-accent">transformação</em>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Registros da evolução urbana de Nova Serrana: formação de bairros, prédios históricos, praças, igrejas, escolas e o crescimento da indústria calçadista.
          </p>
        </header>

        {/* Linha do Tempo Urbana */}
        <section aria-labelledby="titulo-linha-tempo-urbana" className="mb-24">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-accent text-[10px] uppercase tracking-widest font-semibold mb-2">
                <Clock size={12} />
                Evolução Temporal
              </div>
              <h2 id="titulo-linha-tempo-urbana" className="font-serif text-3xl font-bold">
                Linha do Tempo de Nova Serrana
              </h2>
            </div>

            <div>
              <label htmlFor="filtro-categoria-urbana" className="sr-only">
                Filtrar marcos por categoria
              </label>
              <select
                id="filtro-categoria-urbana"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="bg-[#12100c] border border-border px-3 py-2 text-xs focus:ring-1 focus:ring-accent focus:border-accent"
              >
                {categoriasUnicas.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'todas' ? 'Todas as categorias' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {marcosFiltrados.length === 0 ? (
            <div className="border border-border/80 border-dashed p-12 text-center bg-card/40">
              <p className="text-sm text-muted-foreground mb-2">{AVISO_CONTEUDO}</p>
              <p className="text-xs text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
                Estamos levantando e validando registros sobre a evolução urbana municipal. O sistema já está pronto para receber fotos, documentos e fontes de bairros, praças, igrejas, fábricas, comércio e espaços públicos.
              </p>
            </div>
          ) : (
            <>
              <div className="relative mb-10 overflow-x-auto pb-4 no-scrollbar">
                <div className="min-w-max flex items-center relative px-4">
                  <div className="absolute left-0 right-0 h-px bg-border/80 top-4" />
                  {marcosFiltrados.map((marco, idx) => {
                    const ativo = marcoAtivo?.id === marco.id
                    return (
                      <button
                        key={marco.id}
                        onClick={() => setMarcoSelecionadoId(marco.id)}
                        className={`relative flex flex-col items-center px-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent transition-all ${
                          ativo ? 'z-10' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 mb-3 transition-colors ${
                            ativo ? 'bg-accent border-accent scale-125' : 'bg-card border-accent/40'
                          }`}
                        />
                        <span
                          className={`text-sm font-mono font-bold ${ativo ? 'text-accent' : 'text-muted-foreground'}`}
                        >
                          {String(marco.ano)}
                        </span>
                        <span className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          {marco.titulo}
                        </span>
                        <span className="sr-only">
                          {idx + 1} de {marcosFiltrados.length}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {marcoAtivo && (
                <article className="grid lg:grid-cols-[1fr_400px] gap-10 border border-border bg-card p-6 lg:p-10">
                  <div className="space-y-6">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider border border-accent/40 text-accent mb-3">
                        {marcoAtivo.categoria}
                      </span>
                      <h3 className="font-serif text-3xl font-bold mb-4">{marcoAtivo.titulo}</h3>
                      <p className="text-muted-foreground leading-relaxed">{marcoAtivo.descricao}</p>
                    </div>

                    <BadgeFonte
                      tipo={marcoAtivo.tipo_fonte || 'Registro institucional'}
                      fonte={marcoAtivo.fonte}
                      creditos={marcoAtivo.creditos}
                      nivelConfirmacao={AVISO_VALIDACAO}
                      className="max-w-md"
                    />
                  </div>

                  <figure className="border border-border bg-background overflow-hidden">
                    {marcoAtivo.fotografia_url ? (
                      <img
                        src={marcoAtivo.fotografia_url}
                        alt={marcoAtivo.fotografia_alt || marcoAtivo.titulo}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-card border-b border-border">
                        <Sparkles className="text-accent/40 mb-3" size={28} />
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                          Sem registro visual
                        </span>
                      </div>
                    )}
                    <figcaption className="p-4 text-xs text-muted-foreground leading-relaxed">
                      {marcoAtivo.fotografia_url
                        ? 'Imagem cedida ao acervo para fins de documentação urbana.'
                        : AVISO_CONTEUDO}
                    </figcaption>
                  </figure>
                </article>
              )}
            </>
          )}
        </section>

        {/* Antes e Depois */}
        <section aria-labelledby="titulo-antes-depois" className="mb-24">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-accent text-[10px] uppercase tracking-widest font-semibold mb-2">
              <Sparkles size={12} />
              Comparativo Visual
            </div>
            <h2 id="titulo-antes-depois" className="font-serif text-3xl font-bold">
              Antes e Depois
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Arraste a divisória, ou use o controle de deslizamento, para comparar fotografias históricas e imagens atuais dos mesmos locais.
            </p>
          </div>
          <ComparadorAntesDepois itens={antesDepois} />
        </section>

        {/* Bairros e Lugares */}
        <section aria-labelledby="titulo-bairros" className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-accent text-[10px] uppercase tracking-widest font-semibold mb-2">
              <MapPin size={12} />
              Territórios da Cidade
            </div>
            <h2 id="titulo-bairros" className="font-serif text-3xl font-bold">
              Bairros e Lugares
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Pequenos histórios, curiosidades e referências de origem dos bairros e pontos significativos de Nova Serrana.
            </p>
          </div>

          {bairrosLugares.length === 0 ? (
            <div className="border border-border/80 border-dashed p-12 text-center bg-card/40">
              <p className="text-sm text-muted-foreground mb-2">{AVISO_CONTEUDO}</p>
              <p className="text-xs text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
                O cadastro de bairros e lugares históricos está aberto para colaboração comunitária e validação documental.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {bairrosLugares.map((bairro) => (
                <article key={bairro.id} className="border border-border bg-card overflow-hidden group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {bairro.fotografia_url ? (
                      <img
                        src={bairro.fotografia_url}
                        alt={bairro.fotografia_alt || bairro.nome}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                          {AVISO_CONTEUDO}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-accent border border-accent/50">
                      {bairro.decada_formacao || 'Década não registrada'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-bold mb-2">{bairro.nome}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{bairro.historico}</p>
                    {bairro.curiosidades && (
                      <div className="pt-3 border-t border-border/60">
                        <strong className="text-[10px] uppercase tracking-widest text-accent block mb-1.5">
                          Curiosidades
                        </strong>
                        <p className="text-xs text-muted-foreground leading-relaxed">{bairro.curiosidades}</p>
                      </div>
                    )}
                    <BadgeFonte
                      fonte={bairro.fontes}
                      tipo="Fonte documental"
                      nivelConfirmacao={bairro.status_validacao}
                      className="mt-4"
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="border border-accent/30 bg-accent/5 p-8 text-center">
          <h2 className="font-serif text-xl font-bold mb-2">Possui fotografias antigas ou informações sobre esses locais?</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Sua contribuição ajuda a documentar a transformação urbana de Nova Serrana. Todo material passa por curadoria antes da publicação.
          </p>
          <Link
            to="/contribua"
            className="inline-block bg-accent text-accent-foreground px-8 py-3 font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
          >
            Contribuir com este acervo
          </Link>
        </div>
      </div>
    </main>
  )
}
