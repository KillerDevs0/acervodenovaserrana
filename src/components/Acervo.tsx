import { useEffect, useState } from 'react'
import { ArrowRight, Camera, Film, Play, Users } from 'lucide-react'
import { useConteudo } from '../store/content'
import type { AbaAcervo } from '../data'
import { ID_ACERVO, ehAbaAcervo, hashAtual, rolarPara } from '../lib/navegacao'
import EstadoConteudo from './EstadoConteudo'
import FichaDocumentario from './FichaDocumentario'
import Lightbox from './Lightbox'

const abas = [
  { id: 'documentarios', rotulo: 'Documentários', Icone: Film },
  { id: 'historias', rotulo: 'Histórias', Icone: Users },
  { id: 'fotografias', rotulo: 'Fotografias', Icone: Camera },
] as const

type AbaId = AbaAcervo

export default function Acervo() {
  // Chegando por `#historias`, a aba correspondente já abre selecionada.
  const [aba, setAba] = useState<AbaId>(() => {
    const inicial = hashAtual()
    return ehAbaAcervo(inicial) ? inicial : 'documentarios'
  })
  const [documentarioAberto, setDocumentarioAberto] = useState<number | null>(null)
  /** Índice na lista de fotos, não `id`: o lightbox navega por posição. */
  const [fotoAberta, setFotoAberta] = useState<number | null>(null)
  const { conteudoPublico, carregando, erro } = useConteudo()
  const { documentarios, historias, fotos } = conteudoPublico

  /**
   * Navegar para `#historias` troca a aba e rola até o acervo.
   *
   * A rolagem tem de ser nossa: `#historias` é nome de aba, não de elemento, e
   * o navegador não acha alvo para ancorar. Isso vale para o menu, o rodapé e o
   * botão do Hero — todos apontam para a aba, e todos passam por aqui.
   */
  useEffect(() => {
    const sincronizar = () => {
      const alvo = hashAtual()
      if (!ehAbaAcervo(alvo)) return
      setAba(alvo)
      rolarPara(ID_ACERVO)
    }

    // Abrir o site já em `#historias` não dispara `hashchange`, então a
    // primeira sincronização é manual. Depois da pintura, senão a seção ainda
    // não está no documento para receber a rolagem.
    const inicial = requestAnimationFrame(sincronizar)

    window.addEventListener('hashchange', sincronizar)
    return () => {
      cancelAnimationFrame(inicial)
      window.removeEventListener('hashchange', sincronizar)
    }
  }, [])

  // Uma aba só é exibida por vez, então o aviso de vazio/erro descreve a ativa.
  const ativa = {
    documentarios: { total: documentarios.length, rotulo: 'documentários' },
    historias: { total: historias.length, rotulo: 'histórias' },
    fotografias: { total: fotos.length, rotulo: 'fotografias' },
  }[aba]

  /** Próxima aba na sequência, circulando de volta à primeira no fim. */
  const proxima = abas[(abas.findIndex((a) => a.id === aba) + 1) % abas.length]

  /**
   * Setas percorrem as abas, Home/End vão aos extremos. Trocar a aba move o
   * foco junto, senão o teclado fica preso na aba que saiu de cena.
   */
  const aoTeclarNasAbas = (e: React.KeyboardEvent) => {
    const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    const atual = abas.findIndex((a) => a.id === aba)

    let alvo: number | undefined
    if (passo !== undefined) alvo = (atual + passo + abas.length) % abas.length
    else if (e.key === 'Home') alvo = 0
    else if (e.key === 'End') alvo = abas.length - 1
    if (alvo === undefined) return

    e.preventDefault()
    const { id } = abas[alvo]
    setAba(id)
    document.getElementById(`aba-${id}`)?.focus()
  }

  const documentario = documentarios.find((d) => d.id === documentarioAberto)

  return (
    <section id="acervo" className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Acervo Digital</p>
          <h2
            className="font-serif font-bold leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Explore a memória da cidade
          </h2>

          {/*
            Abas de verdade, não só botões estilizados: `tablist` + setas do
            teclado é o que o leitor de tela espera de uma navegação por abas.
          */}
          <div
            role="tablist"
            aria-label="Seções do acervo"
            onKeyDown={aoTeclarNasAbas}
            className="flex gap-0 border-b border-border overflow-x-auto no-scrollbar"
          >
            {abas.map(({ id, rotulo, Icone }) => {
              const selecionada = aba === id
              return (
                <button
                  key={id}
                  id={`aba-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={selecionada}
                  aria-controls={`painel-${id}`}
                  // Só a aba ativa entra na ordem de tabulação; as setas
                  // percorrem as demais, como manda o padrão de abas.
                  tabIndex={selecionada ? 0 : -1}
                  onClick={() => setAba(id)}
                  className="flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  style={{
                    color: selecionada ? 'rgb(196, 144, 16)' : 'rgb(138, 127, 110)',
                    borderBottomColor: selecionada ? 'rgb(196, 144, 16)' : 'transparent',
                  }}
                >
                  <Icone size={13} />
                  {rotulo}
                </button>
              )
            })}
          </div>
        </div>

        <EstadoConteudo
          carregando={carregando}
          erro={erro}
          total={ativa.total}
          rotulo={ativa.rotulo}
        >
          {aba === 'documentarios' && (
            <div
              id="painel-documentarios"
              role="tabpanel"
              aria-labelledby="aba-documentarios"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {documentarios.map((d) => (
                // `button`, não `div` com cursor: o card é acionável pelo
                // teclado e anunciado como controle pelo leitor de tela.
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDocumentarioAberto(d.id)}
                  aria-label={`Ver ficha do documentário ${d.titulo}`}
                  className="group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
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
                </button>
              ))}
            </div>
          )}

          {aba === 'historias' && (
            <div
              id="painel-historias"
              role="tabpanel"
              aria-labelledby="aba-historias"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7"
            >
              {historias.map((h) => (
                // Sem `cursor-pointer`: o card já mostra tudo que o acervo
                // guarda desta pessoa, então não há ficha para abrir. Mão de
                // clique prometeria um detalhe que não existe.
                <div key={h.id} className="group">
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
            <div
              id="painel-fotografias"
              role="tabpanel"
              aria-labelledby="aba-fotografias"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[220px]"
            >
              {fotos.map((f, i) => (
                <figure key={f.id} className={`group relative bg-card ${f.span}`}>
                  {/*
                    A miniatura é recortada em 220px de altura; o clique abre a
                    imagem inteira. `button` cobrindo a figura para o cartão
                    todo ser acionável, inclusive pelo teclado.
                  */}
                  <button
                    type="button"
                    onClick={() => setFotoAberta(i)}
                    aria-label={`Ampliar fotografia: ${f.leg}`}
                    className="absolute inset-0 w-full h-full overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={f.url}
                      alt={f.leg}
                    />
                  </button>
                  <figcaption
                    className="absolute bottom-0 left-0 right-0 p-4 text-xs pointer-events-none"
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
        </EstadoConteudo>

        {/*
          Era "Ver todo o acervo" sem ação — e não existe página com o acervo
          inteiro para onde levar. Em vez de inventar uma, o botão avança para a
          próxima aba e diz para onde vai.
        */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setAba(proxima.id)}
            className="inline-flex items-center gap-3 border border-foreground/20 text-foreground px-10 py-4 font-semibold uppercase tracking-widest text-xs hover:border-accent hover:text-accent transition-all group"
          >
            Ver {proxima.rotulo.toLowerCase()}
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {documentario && (
        <FichaDocumentario
          documentario={documentario}
          aoFechar={() => setDocumentarioAberto(null)}
        />
      )}

      {fotoAberta !== null && (
        <Lightbox
          fotos={fotos}
          indice={fotoAberta}
          aoNavegar={setFotoAberta}
          aoFechar={() => setFotoAberta(null)}
        />
      )}
    </section>
  )
}
