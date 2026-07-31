import { useCallback, useEffect, useState } from 'react'
import { Inbox, Loader2, RefreshCw } from 'lucide-react'
import {
  ROTULO_SITUACAO,
  SITUACOES,
  atualizar,
  listar,
  type ContribuicaoRegistro,
  type Situacao,
} from '../../store/contribuicoes'

/**
 * Fila de curadoria das memórias enviadas pelo site.
 *
 * Estas linhas **não são acervo**: são material bruto, com dados pessoais de
 * quem escreveu para a Secretaria. Aproveitar uma contribuição é criar a
 * história em Histórias à mão, depois de falar com a pessoa e registrar o
 * consentimento — não há botão de "publicar direto" de propósito.
 *
 * Não usa o CRUD dirigido por schema porque não é uma coleção do acervo: não
 * entra no site, não tem ordem de exibição e o fluxo é de triagem, não edição.
 */

const CLASSE_SELECT =
  'bg-[#12100c] border border-border px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors'

/** Cor de cada situação, para a fila ser legível de relance. */
const COR: Record<Situacao, string> = {
  novo: '#c49010',
  em_analise: '#8a7f6e',
  aproveitado: '#4a9060',
  recusado: '#c04060',
}

export default function Contribuicoes() {
  const [itens, setItens] = useState<ContribuicaoRegistro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<Situacao | 'todas'>('todas')
  const [salvando, setSalvando] = useState<number | null>(null)

  const recarregar = useCallback(async () => {
    setCarregando(true)
    try {
      setItens(await listar())
      setErro(null)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void recarregar()
  }, [recarregar])

  const mudarSituacao = async (item: ContribuicaoRegistro, situacao: Situacao) => {
    setSalvando(item.id)
    setErro(null)
    try {
      await atualizar(item.id, { situacao })
      setItens((atual) => atual.map((i) => (i.id === item.id ? { ...i, situacao } : i)))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar.')
    } finally {
      setSalvando(null)
    }
  }

  const salvarNotas = async (item: ContribuicaoRegistro, notas: string) => {
    if (notas === item.notas) return
    setSalvando(item.id)
    setErro(null)
    try {
      await atualizar(item.id, { notas })
      setItens((atual) => atual.map((i) => (i.id === item.id ? { ...i, notas } : i)))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar.')
    } finally {
      setSalvando(null)
    }
  }

  const visiveis = filtro === 'todas' ? itens : itens.filter((i) => i.situacao === filtro)
  const novos = itens.filter((i) => i.situacao === 'novo').length

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <h1 className="text-2xl font-serif font-bold">Contribuições do público</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Memórias enviadas pelo site. {novos > 0 ? `${novos} aguardando triagem.` : 'Nada novo.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void recarregar()}
          className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <RefreshCw size={13} aria-hidden="true" />
          Atualizar
        </button>
      </div>

      <p className="text-xs text-muted-foreground/80 border border-border border-dashed px-4 py-3 my-5 leading-relaxed">
        Estes registros contêm dados pessoais de quem escreveu à Secretaria e não aparecem no site.
        Para aproveitar uma memória, fale com a pessoa, registre o consentimento e cadastre a
        história em <strong className="text-foreground">Histórias</strong> — não há publicação
        automática a partir daqui.
      </p>

      {erro && (
        <div role="alert" className="border border-[#c04060] bg-[#c04060]/10 px-4 py-3 mb-5 text-sm">
          {erro}
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-5">
        {(['todas', ...SITUACOES] as const).map((chave) => {
          const ativo = filtro === chave
          const rotulo = chave === 'todas' ? 'Todas' : ROTULO_SITUACAO[chave]
          const quantas =
            chave === 'todas' ? itens.length : itens.filter((i) => i.situacao === chave).length
          return (
            <button
              key={chave}
              type="button"
              onClick={() => setFiltro(chave)}
              className="border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors"
              style={{
                borderColor: ativo ? 'rgb(196, 144, 16)' : 'rgba(232, 224, 208, 0.1)',
                color: ativo ? 'rgb(196, 144, 16)' : 'rgb(138, 127, 110)',
              }}
            >
              {rotulo} ({quantas})
            </button>
          )
        })}
      </div>

      {carregando ? (
        <div className="border border-border border-dashed p-14 text-center">
          <p className="text-sm text-muted-foreground">Carregando…</p>
        </div>
      ) : visiveis.length === 0 ? (
        <div className="border border-border border-dashed p-14 text-center">
          <Inbox size={22} className="mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {itens.length === 0
              ? 'Nenhuma contribuição recebida até agora.'
              : 'Nenhuma contribuição nesta situação.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visiveis.map((item) => (
            <article key={item.id} className="border border-border bg-card/40 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h2 className="font-semibold">{item.nome}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.contato}
                    {item.periodo && ` · ${item.periodo}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1 font-mono">
                    {new Date(item.criado_em).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {salvando === item.id && (
                    <Loader2 size={13} className="animate-spin text-muted-foreground" />
                  )}
                  <span
                    className="text-[10px] uppercase tracking-widest px-2 py-1 border"
                    style={{ color: COR[item.situacao], borderColor: `${COR[item.situacao]}55` }}
                  >
                    {ROTULO_SITUACAO[item.situacao]}
                  </span>
                  <label className="sr-only" htmlFor={`situacao-${item.id}`}>
                    Situação de {item.nome}
                  </label>
                  <select
                    id={`situacao-${item.id}`}
                    value={item.situacao}
                    onChange={(e) => void mudarSituacao(item, e.target.value as Situacao)}
                    className={CLASSE_SELECT}
                  >
                    {SITUACOES.map((s) => (
                      <option key={s} value={s}>
                        {ROTULO_SITUACAO[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-accent/30 pl-4 mb-4">
                {item.relato}
              </p>

              <div>
                <label
                  htmlFor={`notas-${item.id}`}
                  className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
                >
                  Notas da curadoria
                </label>
                <textarea
                  id={`notas-${item.id}`}
                  rows={2}
                  defaultValue={item.notas}
                  placeholder="Registro interno: contato feito, termo assinado, motivo da recusa…"
                  onBlur={(e) => void salvarNotas(item, e.target.value)}
                  className="w-full bg-[#12100c] border border-border px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y"
                />
                <p className="text-[11px] text-muted-foreground/70 mt-1">
                  Salvo ao sair do campo.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
