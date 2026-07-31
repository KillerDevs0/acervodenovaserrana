import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { comoRegistros, useConteudo } from '../../store/content'
import { acharSchema } from '../schemas'
import Confirmacao from '../componentes/Confirmacao'

export default function Listagem() {
  const { colecao = '' } = useParams()
  const { conteudo, remover, reordenar, carregando, erro } = useConteudo()
  const [busca, setBusca] = useState('')
  const [aExcluir, setAExcluir] = useState<number | null>(null)
  const [erroAcao, setErroAcao] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const schema = acharSchema(colecao)
  const itens = schema ? comoRegistros(conteudo[schema.id]) : []

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo || !schema) return itens
    return itens.filter((item) =>
      schema.campos.some((campo) => String(item[campo.nome] ?? '').toLowerCase().includes(termo)),
    )
  }, [busca, itens, schema])

  if (!schema) return <Navigate to="/admin" replace />

  const alvo = itens.find((item) => item.id === aExcluir)
  const rotuloAlvo = alvo ? String(alvo[schema.colunas[0]] ?? 'este registro') : ''

  /** Executa uma ação remota mantendo o erro visível em caso de falha. */
  const executar = async (acao: () => Promise<void>) => {
    setOcupado(true)
    setErroAcao(null)
    try {
      await acao()
    } catch (e) {
      setErroAcao(e instanceof Error ? e.message : 'Não foi possível concluir a ação.')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Coleção</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">{schema.rotulo}</h1>
            <p className="text-sm text-muted-foreground">
              {itens.length} {itens.length === 1 ? 'registro' : 'registros'} · {schema.descricao}
            </p>
          </div>
          <Link
            to={`/admin/${schema.id}/novo`}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-[11px] uppercase tracking-widest font-semibold hover:bg-accent/90 transition-colors shrink-0"
          >
            <Plus size={13} aria-hidden="true" />
            Adicionar
          </Link>
        </div>
      </header>

      {schema.dadosPessoais && (
        <div className="border border-accent/40 bg-accent/5 px-4 py-3 mb-5 text-sm leading-relaxed">
          <strong className="font-semibold">Dados pessoais.</strong> Estes registros identificam
          pessoas reais. Só publique com o consentimento do titular registrado, e guarde o termo
          assinado. A pedido do titular, o registro deve ser despublicado ou excluído.
        </div>
      )}

      <div className="relative mb-5 max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={`Buscar em ${schema.rotulo.toLowerCase()}`}
          aria-label={`Buscar em ${schema.rotulo}`}
          className="w-full bg-[#12100c] border border-border pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
        />
      </div>

      {(erro || erroAcao) && (
        <div
          role="alert"
          className="border border-[#c04060] bg-[#c04060]/10 px-4 py-3 mb-5 text-sm"
        >
          {erroAcao ?? erro}
        </div>
      )}

      {carregando ? (
        <div className="border border-border border-dashed p-14 text-center">
          <p className="text-sm text-muted-foreground">Carregando o acervo…</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="border border-border border-dashed p-14 text-center">
          <p className="text-sm text-muted-foreground">
            {busca
              ? `Nenhum resultado para “${busca}”.`
              : `Nenhum ${schema.rotuloSingular} cadastrado ainda.`}
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{schema.rotulo} cadastrados no acervo</caption>
            <thead>
              <tr className="border-b border-border bg-card">
                {schema.campoImagem && <th scope="col" className="w-20 p-3" />}
                {schema.colunas.map((coluna) => (
                  <th
                    key={coluna}
                    scope="col"
                    className="text-left p-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold"
                  >
                    {schema.campos.find((c) => c.nome === coluna)?.rotulo ?? coluna}
                  </th>
                ))}
                <th scope="col" className="text-right p-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => {
                const indice = itens.indexOf(item)
                const id = item.id as number
                return (
                  <tr key={id} className="border-b border-border last:border-b-0 hover:bg-card/60 transition-colors">
                    {schema.campoImagem && (
                      <td className="p-3">
                        <img
                          src={String(item[schema.campoImagem] ?? '')}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="w-14 h-14 object-cover bg-muted"
                        />
                      </td>
                    )}
                    {schema.colunas.map((coluna, i) => {
                      const bruto = item[coluna]
                      // Booleano vira etiqueta: "true" não diz nada a quem cataloga.
                      if (typeof bruto === 'boolean') {
                        return (
                          <td key={coluna} className="p-3 align-middle">
                            <span
                              className={`inline-block text-[10px] uppercase tracking-widest px-2 py-1 border ${
                                bruto
                                  ? 'border-accent/40 text-accent'
                                  : 'border-border text-muted-foreground'
                              }`}
                            >
                              {bruto ? 'Publicado' : 'Rascunho'}
                            </span>
                          </td>
                        )
                      }
                      return (
                        <td
                          key={coluna}
                          className={`p-3 align-middle ${
                            i === 0 ? 'font-medium' : 'text-muted-foreground'
                          }`}
                        >
                          <span className="line-clamp-2">{String(bruto ?? '—') || '—'}</span>
                        </td>
                      )
                    })}
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => void executar(() => reordenar(schema.id, id, -1))}
                          disabled={indice === 0 || ocupado}
                          aria-label="Mover para cima"
                          className="p-2 text-muted-foreground hover:text-accent disabled:opacity-25 disabled:hover:text-muted-foreground transition-colors"
                        >
                          <ChevronUp size={15} />
                        </button>
                        <button
                          onClick={() => void executar(() => reordenar(schema.id, id, 1))}
                          disabled={indice === itens.length - 1 || ocupado}
                          aria-label="Mover para baixo"
                          className="p-2 text-muted-foreground hover:text-accent disabled:opacity-25 disabled:hover:text-muted-foreground transition-colors"
                        >
                          <ChevronDown size={15} />
                        </button>
                        <Link
                          to={`/admin/${schema.id}/${id}`}
                          aria-label={`Editar ${String(item[schema.colunas[0]] ?? '')}`}
                          className="p-2 text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => setAExcluir(id)}
                          disabled={ocupado}
                          aria-label={`Excluir ${String(item[schema.colunas[0]] ?? '')}`}
                          className="p-2 text-muted-foreground hover:text-[#e06080] disabled:opacity-25 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {aExcluir !== null && (
        <Confirmacao
          titulo={`Excluir ${schema.rotuloSingular}?`}
          mensagem={`“${rotuloAlvo}” será removido do acervo e deixará de aparecer no site. Esta ação não pode ser desfeita.`}
          onCancelar={() => setAExcluir(null)}
          onConfirmar={() => {
            const id = aExcluir
            setAExcluir(null)
            void executar(() => remover(schema.id, id))
          }}
        />
      )}
    </div>
  )
}
