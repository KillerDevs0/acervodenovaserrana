import { useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { CONTATO } from '../data'
import { LIMITES, enviar, validar, type Contribuicao } from '../store/contribuicoes'

/**
 * Formulário "Enviar Memória", aberto pelo botão da seção Participe.
 *
 * O que é enviado vai para `contribuicoes` — caixa de entrada da curadoria —
 * e nunca direto para o acervo. O texto do formulário diz isso ao remetente:
 * prometer publicação imediata seria falso, já que toda história publicada
 * precisa de consentimento verificado antes.
 *
 * A caixa de autorização não é enfeite: é a base legal para a Secretaria
 * guardar o contato e responder. Sem ela o envio não sai daqui, e o banco
 * recusaria de todo modo (constraint `contribuicoes_exige_autorizacao`).
 */

const CLASSE_CAMPO =
  'w-full bg-[#12100c] border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors'

const VAZIO: Contribuicao = {
  nome: '',
  contato: '',
  relato: '',
  periodo: '',
  autorizaContato: false,
}

interface Props {
  aoFechar: () => void
}

export default function FormularioMemoria({ aoFechar }: Props) {
  const [dados, setDados] = useState<Contribuicao>(VAZIO)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)
  const [falha, setFalha] = useState('')
  const [pronto, setPronto] = useState(false)

  const alterar = <C extends keyof Contribuicao>(campo: C, valor: Contribuicao[C]) => {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    // Corrigir o campo limpa o erro dele na hora, sem esperar novo envio.
    setErros((atual) => {
      if (!atual[campo]) return atual
      const { [campo]: _, ...resto } = atual
      return resto
    })
  }

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault()
    setFalha('')

    const encontrados = validar(dados)
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados)
      // Leva o foco ao primeiro campo com problema.
      document.getElementById(`memoria-${Object.keys(encontrados)[0]}`)?.focus()
      return
    }

    setEnviando(true)
    try {
      await enviar(dados)
      setPronto(true)
    } catch (erro) {
      setFalha(erro instanceof Error ? erro.message : 'Não foi possível enviar.')
    } finally {
      setEnviando(false)
    }
  }

  const erroDe = (campo: string) =>
    erros[campo] ? (
      <p id={`memoria-${campo}-erro`} role="alert" className="mt-1.5 text-xs text-[#e06080]">
        {erros[campo]}
      </p>
    ) : null

  const bordaDe = (campo: string) => (erros[campo] ? 'border-[#c04060]' : 'border-border')

  const atributosDe = (campo: string) => ({
    id: `memoria-${campo}`,
    'aria-invalid': erros[campo] ? true : undefined,
    'aria-describedby': erros[campo] ? `memoria-${campo}-erro` : undefined,
  })

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ background: 'rgba(15, 13, 10, 0.85)' }}
      onClick={aoFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memoria-titulo"
        className="relative bg-card border border-border max-w-xl w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {pronto ? (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-accent/40 flex items-center justify-center">
              <Check size={22} className="text-accent" />
            </div>
            <h3 id="memoria-titulo" className="text-xl font-serif font-bold mb-3">
              Recebemos sua memória
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              A equipe da Secretaria de Cultura vai ler com atenção e entrar em contato pelo dado
              que você deixou. Nada é publicado no acervo antes dessa conversa e da sua autorização
              por escrito.
            </p>
            <button
              type="button"
              onClick={aoFechar}
              className="bg-accent text-accent-foreground px-8 py-3 font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={submeter} className="p-6 sm:p-8" noValidate>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Faça Parte</p>
            <h3 id="memoria-titulo" className="text-2xl font-serif font-bold mb-3 leading-tight">
              Enviar uma memória
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-7">
              Conte o que você lembra, ou o que ouviu de quem veio antes. A Secretaria entra em
              contato para conversar sobre o material antes de qualquer publicação.
            </p>

            {falha && (
              <div
                role="alert"
                className="border border-[#c04060] bg-[#c04060]/10 px-4 py-3 mb-5 text-sm"
              >
                {falha}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="memoria-nome" className="block text-xs mb-1.5">
                  Seu nome <span className="text-accent">*</span>
                </label>
                <input
                  {...atributosDe('nome')}
                  type="text"
                  value={dados.nome}
                  maxLength={LIMITES.nome.max}
                  onChange={(e) => alterar('nome', e.target.value)}
                  className={`${CLASSE_CAMPO} ${bordaDe('nome')}`}
                />
                {erroDe('nome')}
              </div>

              <div>
                <label htmlFor="memoria-contato" className="block text-xs mb-1.5">
                  E-mail ou telefone <span className="text-accent">*</span>
                </label>
                <input
                  {...atributosDe('contato')}
                  type="text"
                  value={dados.contato}
                  maxLength={LIMITES.contato.max}
                  onChange={(e) => alterar('contato', e.target.value)}
                  className={`${CLASSE_CAMPO} ${bordaDe('contato')}`}
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Como a Secretaria pode falar com você. WhatsApp serve.
                </p>
                {erroDe('contato')}
              </div>

              <div>
                <label htmlFor="memoria-periodo" className="block text-xs mb-1.5">
                  Época a que se refere
                </label>
                <input
                  {...atributosDe('periodo')}
                  type="text"
                  value={dados.periodo}
                  maxLength={LIMITES.periodo.max}
                  placeholder="Ex.: anos 1970, ou 1982"
                  onChange={(e) => alterar('periodo', e.target.value)}
                  className={`${CLASSE_CAMPO} ${bordaDe('periodo')} placeholder:text-muted-foreground/50`}
                />
                {erroDe('periodo')}
              </div>

              <div>
                <label htmlFor="memoria-relato" className="block text-xs mb-1.5">
                  Sua memória <span className="text-accent">*</span>
                </label>
                <textarea
                  {...atributosDe('relato')}
                  rows={6}
                  value={dados.relato}
                  maxLength={LIMITES.relato.max}
                  onChange={(e) => alterar('relato', e.target.value)}
                  className={`${CLASSE_CAMPO} ${bordaDe('relato')} resize-y`}
                />
                <div className="mt-1.5 flex justify-between gap-3 text-[11px] text-muted-foreground">
                  <span>Se tiver fotos ou documentos, conte aqui — combinamos o envio depois.</span>
                  <span className="font-mono shrink-0">
                    {dados.relato.length}/{LIMITES.relato.max}
                  </span>
                </div>
                {erroDe('relato')}
              </div>

              <div className="border-t border-border pt-5">
                <label className="flex gap-3 items-start cursor-pointer">
                  <input
                    {...atributosDe('autorizaContato')}
                    type="checkbox"
                    checked={dados.autorizaContato}
                    onChange={(e) => alterar('autorizaContato', e.target.checked)}
                    className="mt-0.5 accent-[#c49010] shrink-0"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Autorizo a Secretaria Municipal de Cultura a guardar meu nome e contato para
                    falar comigo sobre esta memória. Entendo que{' '}
                    <strong className="text-foreground">
                      nada será publicado no acervo sem minha autorização por escrito
                    </strong>
                    , e que posso pedir a exclusão dos meus dados a qualquer momento pelo e-mail{' '}
                    <a
                      href={`mailto:${CONTATO.email}`}
                      className="text-accent hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {CONTATO.email}
                    </a>
                    .
                  </span>
                </label>
                {erroDe('autorizaContato')}
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {enviando && <Loader2 size={14} className="animate-spin" />}
                {enviando ? 'Enviando…' : 'Enviar memória'}
              </button>
              <button
                type="button"
                onClick={aoFechar}
                className="px-8 py-3.5 border border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/40 font-semibold uppercase tracking-widest text-xs transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
