import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Plus, RotateCcw } from 'lucide-react'
import { useConteudo } from '../../store/content'
import { schemas } from '../schemas'
import Confirmacao from '../componentes/Confirmacao'

export default function VisaoGeral() {
  const { conteudo, restaurarPadrao, remoto, carregando, erro } = useConteudo()
  const [confirmarRestauro, setConfirmarRestauro] = useState(false)

  const exportar = () => {
    const blob = new Blob([JSON.stringify(conteudo, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `acervo-nova-serrana-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalItens = schemas.reduce((soma, schema) => soma + conteudo[schema.id].length, 0)

  return (
    <div className="max-w-5xl">
      <header className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Visão geral</p>
        <h1 className="font-serif text-3xl font-bold mb-3">Painel do Acervo</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          {carregando
            ? 'Carregando o acervo…'
            : `${totalItens} ${
                totalItens === 1 ? 'registro publicado' : 'registros publicados'
              } no acervo digital. As alterações aparecem no site imediatamente.`}
        </p>
      </header>

      {erro && (
        <div
          role="alert"
          className="border border-[#c04060] bg-[#c04060]/10 px-4 py-3 mb-8 text-sm"
        >
          {erro}
        </div>
      )}

      {!remoto && (
        <div className="border border-accent/40 bg-accent/5 px-4 py-3 mb-8 text-sm leading-relaxed">
          <strong className="font-semibold">Modo local.</strong> O Supabase não está configurado,
          então o conteúdo é salvo apenas neste navegador. Preencha o <code>.env.local</code> para
          usar o banco.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {schemas.map(({ id, rotulo, descricao, Icone }) => (
          <Link
            key={id}
            to={`/admin/${id}`}
            className="group border border-border bg-card p-6 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-5">
              <Icone size={18} className="text-accent" aria-hidden="true" />
              <span className="font-serif text-3xl font-bold leading-none">
                {conteudo[id].length}
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold mb-1 group-hover:text-accent transition-colors">
              {rotulo}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{descricao}</p>
          </Link>
        ))}
      </div>

      <section className="border border-border bg-card p-7">
        <h2 className="font-serif text-xl font-bold mb-2">Manutenção do acervo</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
          {remoto
            ? 'O acervo está no banco de dados e é compartilhado entre todos os editores. O export em JSON serve como cópia de segurança pontual.'
            : 'O conteúdo é salvo no armazenamento local deste navegador. Exporte um backup em JSON antes de limpar os dados do navegador ou trocar de dispositivo.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportar}
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
          >
            <Download size={13} aria-hidden="true" />
            Exportar JSON
          </button>
          <Link
            to="/admin/documentarios/novo"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-[11px] uppercase tracking-widest font-semibold hover:bg-accent/90 transition-colors"
          >
            <Plus size={13} aria-hidden="true" />
            Novo documentário
          </Link>
          {/* Só no modo local: com o banco, isso apagaria o acervo de todos. */}
          {!remoto && (
            <button
              onClick={() => setConfirmarRestauro(true)}
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-[#e06080] hover:border-[#c04060] transition-colors"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Restaurar conteúdo original
            </button>
          )}
        </div>
      </section>

      {confirmarRestauro && (
        <Confirmacao
          titulo="Restaurar conteúdo original?"
          mensagem="Todas as edições feitas no painel serão descartadas e o acervo voltará ao conteúdo inicial. Esta ação não pode ser desfeita."
          rotuloConfirmar="Restaurar"
          onCancelar={() => setConfirmarRestauro(false)}
          onConfirmar={() => {
            restaurarPadrao()
            setConfirmarRestauro(false)
          }}
        />
      )}
    </div>
  )
}
