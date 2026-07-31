import type { Campo } from '../schemas'

const CLASSE_BASE =
  'w-full bg-[#12100c] border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors'

interface Props {
  campo: Campo
  valor: unknown
  erro?: string
  onChange: (valor: string | boolean) => void
}

export default function CampoFormulario({ campo, valor, erro, onChange }: Props) {
  const id = `campo-${campo.nome}`
  const idAjuda = campo.ajuda ? `${id}-ajuda` : undefined
  const idErro = erro ? `${id}-erro` : undefined
  const descricao = [idErro, idAjuda].filter(Boolean).join(' ') || undefined
  const texto = valor === undefined || valor === null ? '' : String(valor)
  const borda = erro ? 'border-[#c04060]' : 'border-border'

  // Caixa de seleção inverte a ordem: controle antes do rótulo.
  if (campo.tipo === 'booleano') {
    return (
      <div className="border border-border bg-[#12100c] p-4">
        <div className="flex items-start gap-3">
          <input
            id={id}
            type="checkbox"
            checked={valor === true}
            aria-describedby={descricao}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#c49010] cursor-pointer"
          />
          <div className="min-w-0">
            <label htmlFor={id} className="block text-[11px] uppercase tracking-widest cursor-pointer">
              {campo.rotulo}
            </label>
            {campo.ajuda && (
              <p id={idAjuda} className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {campo.ajuda}
              </p>
            )}
          </div>
        </div>
        {erro && (
          <p id={idErro} className="text-xs text-[#e06080] mt-2">
            {erro}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <label htmlFor={id} className="block text-[11px] uppercase tracking-widest mb-2">
        {campo.rotulo}
        {campo.obrigatorio && (
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {campo.tipo === 'textarea' && (
        <textarea
          id={id}
          rows={4}
          className={`${CLASSE_BASE} ${borda} resize-y leading-relaxed`}
          value={texto}
          aria-required={campo.obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {campo.tipo === 'select' && (
        <select
          id={id}
          className={`${CLASSE_BASE} ${borda}`}
          value={texto}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          onChange={(e) => onChange(e.target.value)}
        >
          {campo.opcoes?.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      )}

      {campo.tipo === 'cor' && (
        <div className="flex gap-3">
          <input
            id={id}
            type="color"
            className={`h-10 w-16 bg-[#12100c] border ${borda} p-1 cursor-pointer`}
            value={/^#[0-9a-f]{6}$/i.test(texto) ? texto : '#c49010'}
            aria-describedby={descricao}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            type="text"
            className={`${CLASSE_BASE} ${borda} font-mono flex-1`}
            value={texto}
            aria-label={`${campo.rotulo} em hexadecimal`}
            aria-invalid={erro ? true : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {campo.tipo === 'data' && (
        <input
          id={id}
          type="date"
          // Consentimento não pode ser datado no futuro.
          max={new Date().toISOString().slice(0, 10)}
          className={`${CLASSE_BASE} ${borda}`}
          value={texto}
          aria-required={campo.obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {(campo.tipo === 'texto' || campo.tipo === 'url' || campo.tipo === 'numero') && (
        <input
          id={id}
          type={campo.tipo === 'numero' ? 'number' : 'text'}
          inputMode={campo.tipo === 'numero' ? 'numeric' : undefined}
          min={campo.min}
          max={campo.max}
          className={`${CLASSE_BASE} ${borda} ${campo.tipo === 'url' ? 'font-mono text-xs' : ''}`}
          value={texto}
          aria-required={campo.obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {erro && (
        <p id={idErro} className="text-xs text-[#e06080] mt-1.5">
          {erro}
        </p>
      )}
      {campo.ajuda && !erro && (
        <p id={idAjuda} className="text-xs text-muted-foreground mt-1.5">
          {campo.ajuda}
        </p>
      )}
    </div>
  )
}
