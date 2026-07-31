import { useConteudo } from '../store/content'

export default function Sobre() {
  const { conteudoPublico } = useConteudo()
  const { estados, documentarios, historias } = conteudoPublico

  /**
   * Os números vinham fixos no código ("12k+", "340+", "8") e nunca mudavam,
   * então contradiziam o acervo assim que alguém publicava algo pelo painel.
   *
   * Duas contagens saem do próprio conteúdo. "Famílias catalogadas" é a soma de
   * `familias` por estado — o mesmo dado que alimenta o mapa — arredondada para
   * baixo em milhares, porque é estimativa de pesquisa e cravar unidade daria
   * falsa precisão.
   */
  const familias = estados.reduce((total, e) => total + e.familias, 0)
  const stats = [
    {
      valor: familias >= 1000 ? `${Math.floor(familias / 1000)}k+` : String(familias),
      rotulo: 'Famílias Catalogadas',
    },
    {
      valor: String(documentarios.length + historias.length),
      rotulo: 'Registros no Acervo',
    },
    { valor: String(estados.length), rotulo: 'Estados de Origem' },
  ]

  return (
    <section id="sobre" className="py-28 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-5">Sobre o Projeto</p>
          <h2
            className="font-serif font-bold leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Um arquivo que pertence à comunidade
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-5">
            O Acervo Cultural de Nova Serrana é um projeto da Secretaria Municipal de Cultura,
            viabilizado pela Política Nacional Aldir Blanc (PNAB). Reúne documentários, depoimentos,
            fotografias e registros históricos que contam a história de uma cidade construída pelo
            trabalho e pela migração.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12">
            Mais de{' '}
            <strong className="text-foreground">
              {familias.toLocaleString('pt-BR')} famílias migrantes
            </strong>{' '}
            ajudaram a construir Nova Serrana ao longo de sete décadas. Aqui, suas histórias têm
            nome, voz e imagem.
          </p>

          <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.rotulo}>
                <div className="text-3xl font-serif font-bold mb-1 text-accent">{s.valor}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest leading-snug">
                  {s.rotulo}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&h=900&fit=crop&auto=format"
              alt="Arquivos históricos e documentos da cidade"
            />
          </div>
          <div
            className="absolute -bottom-6 -left-6 bg-card border border-border p-6"
            style={{ maxWidth: 200 }}
          >
            <div className="text-4xl font-serif font-bold mb-1 text-accent">1954</div>
            <div className="text-xs text-muted-foreground leading-snug">
              Ano de fundação do Distrito de Nova Serrana
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
