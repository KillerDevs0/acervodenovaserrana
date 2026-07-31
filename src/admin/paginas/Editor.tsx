import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { comoRegistros, useConteudo } from '../../store/content'
import { acharSchema, normalizar, validar, valorInicial } from '../schemas'
import CampoFormulario from '../componentes/Campos'

export default function Editor() {
  const { colecao = '', id } = useParams()
  const { conteudo, criar, atualizar } = useConteudo()
  const navegar = useNavigate()

  const schema = acharSchema(colecao)
  const novo = id === 'novo'
  const registro =
    schema && !novo
      ? comoRegistros(conteudo[schema.id]).find((item) => item.id === Number(id))
      : undefined

  const [valores, setValores] = useState<Record<string, unknown>>(() => {
    if (!schema) return {}
    if (novo) return valorInicial(schema)
    return registro ? { ...registro } : valorInicial(schema)
  })
  const [erros, setErros] = useState<Record<string, string>>({})

  if (!schema) return <Navigate to="/admin" replace />
  if (!novo && !registro) return <Navigate to={`/admin/${schema.id}`} replace />

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const encontrados = validar(schema, valores)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) {
      const primeiro = schema.campos.find((campo) => encontrados[campo.nome])
      if (primeiro) document.getElementById(`campo-${primeiro.nome}`)?.focus()
      return
    }

    const dados = normalizar(schema, valores)
    if (novo) criar(schema.id, dados)
    else atualizar(schema.id, Number(id), dados)
    navegar(`/admin/${schema.id}`)
  }

  const previa = schema.campoImagem ? String(valores[schema.campoImagem] ?? '') : ''

  return (
    <div className="max-w-2xl">
      <Link
        to={`/admin/${schema.id}`}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-7"
      >
        <ArrowLeft size={13} aria-hidden="true" />
        {schema.rotulo}
      </Link>

      <header className="mb-9">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
          {novo ? 'Novo registro' : 'Editando'}
        </p>
        <h1 className="font-serif text-3xl font-bold">
          {novo
            ? `Adicionar ${schema.rotuloSingular}`
            : String(registro?.[schema.colunas[0]] ?? `Editar ${schema.rotuloSingular}`)}
        </h1>
      </header>

      <form onSubmit={enviar} noValidate>
        {Object.keys(erros).length > 0 && (
          <div role="alert" className="border border-[#c04060] bg-[#c04060]/10 px-4 py-3 mb-7 text-sm">
            Revise os campos destacados antes de salvar.
          </div>
        )}

        <div className="flex flex-col gap-6">
          {schema.campos.map((campo) => (
            <CampoFormulario
              key={campo.nome}
              campo={campo}
              valor={valores[campo.nome]}
              erro={erros[campo.nome]}
              onChange={(valor) => {
                setValores((atual) => ({ ...atual, [campo.nome]: valor }))
                setErros((atual) => {
                  if (!atual[campo.nome]) return atual
                  const { [campo.nome]: _, ...resto } = atual
                  return resto
                })
              }}
            />
          ))}
        </div>

        {previa && (
          <figure className="mt-7">
            <figcaption className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
              Prévia da imagem
            </figcaption>
            <img
              src={previa}
              alt=""
              aria-hidden="true"
              className="max-h-56 w-auto object-contain border border-border bg-muted"
            />
          </figure>
        )}

        <div className="flex flex-wrap gap-3 mt-9 pt-7 border-t border-border">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-[11px] uppercase tracking-widest font-semibold hover:bg-accent/90 transition-colors"
          >
            <Check size={13} aria-hidden="true" />
            {novo ? 'Publicar' : 'Salvar alterações'}
          </button>
          <Link
            to={`/admin/${schema.id}`}
            className="inline-flex items-center px-6 py-3 text-[11px] uppercase tracking-widest border border-border hover:border-foreground/40 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
