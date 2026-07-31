import { Camera, Clock, Film, MapPin, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ColecaoId } from '../store/content'

/**
 * Descrição declarativa de cada coleção do acervo. Formulário, tabela e
 * validação do painel são todos gerados a partir daqui — para adicionar um
 * campo, basta descrevê-lo neste arquivo.
 */

export type TipoCampo = 'texto' | 'textarea' | 'numero' | 'url' | 'cor' | 'select'

export interface Campo {
  nome: string
  rotulo: string
  tipo: TipoCampo
  obrigatorio?: boolean
  ajuda?: string
  /** Usado por `tipo: 'select'`. */
  opcoes?: { valor: string; rotulo: string }[]
  min?: number
  max?: number
}

export interface SchemaColecao {
  id: ColecaoId
  rotulo: string
  rotuloSingular: string
  descricao: string
  Icone: LucideIcon
  /** Campos exibidos como colunas na listagem, na ordem. */
  colunas: string[]
  /** Campo com a imagem de miniatura da listagem, se houver. */
  campoImagem?: string
  campos: Campo[]
}

const ANO_MIN = 1900
const ANO_MAX = 2100

export const schemas: SchemaColecao[] = [
  {
    id: 'documentarios',
    rotulo: 'Documentários',
    rotuloSingular: 'documentário',
    descricao: 'Filmes e registros audiovisuais do acervo.',
    Icone: Film,
    colunas: ['titulo', 'ano', 'diretor', 'duracao'],
    campoImagem: 'thumb',
    campos: [
      { nome: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true },
      { nome: 'subtitulo', rotulo: 'Subtítulo', tipo: 'textarea', obrigatorio: true },
      { nome: 'duracao', rotulo: 'Duração', tipo: 'texto', obrigatorio: true, ajuda: 'Ex.: 34 min' },
      { nome: 'ano', rotulo: 'Ano', tipo: 'numero', obrigatorio: true, min: ANO_MIN, max: ANO_MAX },
      { nome: 'diretor', rotulo: 'Direção', tipo: 'texto', obrigatorio: true },
      {
        nome: 'thumb',
        rotulo: 'Imagem de capa',
        tipo: 'url',
        obrigatorio: true,
        ajuda: 'URL da imagem, proporção 16:9',
      },
    ],
  },
  {
    id: 'historias',
    rotulo: 'Histórias',
    rotuloSingular: 'história',
    descricao: 'Relatos de moradores e memória oral.',
    Icone: Users,
    colunas: ['nome', 'origem', 'chegada'],
    campoImagem: 'foto',
    campos: [
      { nome: 'nome', rotulo: 'Nome', tipo: 'texto', obrigatorio: true },
      {
        nome: 'origem',
        rotulo: 'Origem',
        tipo: 'texto',
        obrigatorio: true,
        ajuda: 'Ex.: Sobral, CE',
      },
      {
        nome: 'chegada',
        rotulo: 'Ano de chegada',
        tipo: 'numero',
        obrigatorio: true,
        min: ANO_MIN,
        max: ANO_MAX,
      },
      { nome: 'profissao', rotulo: 'Profissão / atuação', tipo: 'texto', obrigatorio: true },
      {
        nome: 'foto',
        rotulo: 'Retrato',
        tipo: 'url',
        obrigatorio: true,
        ajuda: 'URL da imagem, proporção 4:5',
      },
      { nome: 'citacao', rotulo: 'Citação', tipo: 'textarea', obrigatorio: true },
    ],
  },
  {
    id: 'fotos',
    rotulo: 'Fotografias',
    rotuloSingular: 'fotografia',
    descricao: 'Galeria fotográfica histórica.',
    Icone: Camera,
    colunas: ['leg', 'span'],
    campoImagem: 'url',
    campos: [
      { nome: 'url', rotulo: 'Imagem', tipo: 'url', obrigatorio: true, ajuda: 'URL da fotografia' },
      { nome: 'leg', rotulo: 'Legenda', tipo: 'texto', obrigatorio: true },
      {
        nome: 'span',
        rotulo: 'Altura na galeria',
        tipo: 'select',
        ajuda: 'Destaque ocupa duas linhas do mosaico',
        opcoes: [
          { valor: '', rotulo: 'Padrão' },
          { valor: 'row-span-2', rotulo: 'Destaque (altura dupla)' },
        ],
      },
    ],
  },
  {
    id: 'timeline',
    rotulo: 'Linha do tempo',
    rotuloSingular: 'marco',
    descricao: 'Marcos históricos do município.',
    Icone: Clock,
    colunas: ['ano', 'titulo'],
    campos: [
      { nome: 'ano', rotulo: 'Ano', tipo: 'numero', obrigatorio: true, min: ANO_MIN, max: ANO_MAX },
      { nome: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true },
      { nome: 'desc', rotulo: 'Descrição', tipo: 'textarea', obrigatorio: true },
    ],
  },
  {
    id: 'estados',
    rotulo: 'Mapa migratório',
    rotuloSingular: 'origem',
    descricao: 'Estados de origem das famílias migrantes.',
    Icone: MapPin,
    colunas: ['estado', 'sigla', 'familias'],
    campos: [
      { nome: 'estado', rotulo: 'Estado / região', tipo: 'texto', obrigatorio: true },
      { nome: 'sigla', rotulo: 'Sigla', tipo: 'texto', obrigatorio: true },
      {
        nome: 'familias',
        rotulo: 'Famílias',
        tipo: 'numero',
        obrigatorio: true,
        min: 0,
        max: 1_000_000,
      },
      { nome: 'cor', rotulo: 'Cor no mapa', tipo: 'cor', obrigatorio: true },
      {
        nome: 'cx',
        rotulo: 'Posição X',
        tipo: 'numero',
        obrigatorio: true,
        min: 0,
        max: 800,
        ajuda: 'Coordenada no SVG do mapa (0–800)',
      },
      {
        nome: 'cy',
        rotulo: 'Posição Y',
        tipo: 'numero',
        obrigatorio: true,
        min: 0,
        max: 500,
        ajuda: 'Coordenada no SVG do mapa (0–500)',
      },
      { nome: 'desc', rotulo: 'Descrição', tipo: 'textarea', obrigatorio: true },
    ],
  },
]

export function acharSchema(id: string): SchemaColecao | undefined {
  return schemas.find((schema) => schema.id === id)
}

export function valorInicial(schema: SchemaColecao): Record<string, unknown> {
  const registro: Record<string, unknown> = {}
  for (const campo of schema.campos) {
    if (campo.tipo === 'numero') {
      registro[campo.nome] = ''
    } else if (campo.tipo === 'cor') {
      registro[campo.nome] = '#c49010'
    } else {
      registro[campo.nome] = ''
    }
  }
  return registro
}

/** Retorna um mapa campo → mensagem de erro; vazio significa válido. */
export function validar(
  schema: SchemaColecao,
  valores: Record<string, unknown>,
): Record<string, string> {
  const erros: Record<string, string> = {}

  for (const campo of schema.campos) {
    const bruto = valores[campo.nome]
    const texto = typeof bruto === 'string' ? bruto.trim() : bruto

    if (campo.obrigatorio && (texto === '' || texto === undefined || texto === null)) {
      erros[campo.nome] = 'Campo obrigatório.'
      continue
    }

    if (texto === '' || texto === undefined || texto === null) continue

    if (campo.tipo === 'numero') {
      const numero = Number(texto)
      if (!Number.isFinite(numero)) {
        erros[campo.nome] = 'Informe um número válido.'
      } else if (campo.min !== undefined && numero < campo.min) {
        erros[campo.nome] = `Valor mínimo: ${campo.min}.`
      } else if (campo.max !== undefined && numero > campo.max) {
        erros[campo.nome] = `Valor máximo: ${campo.max}.`
      }
    }

    if (campo.tipo === 'url' && typeof texto === 'string') {
      const relativa = texto.startsWith('/')
      if (!relativa) {
        try {
          const url = new URL(texto)
          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            erros[campo.nome] = 'Use um endereço http:// ou https://.'
          }
        } catch {
          erros[campo.nome] = 'Endereço inválido.'
        }
      }
    }

    if (campo.tipo === 'cor' && typeof texto === 'string' && !/^#[0-9a-f]{6}$/i.test(texto)) {
      erros[campo.nome] = 'Use uma cor no formato #rrggbb.'
    }
  }

  return erros
}

/** Converte os valores do formulário para os tipos esperados pela coleção. */
export function normalizar(
  schema: SchemaColecao,
  valores: Record<string, unknown>,
): Record<string, unknown> {
  const saida: Record<string, unknown> = {}
  for (const campo of schema.campos) {
    const bruto = valores[campo.nome]
    if (campo.tipo === 'numero') {
      saida[campo.nome] = Number(bruto)
    } else {
      saida[campo.nome] = typeof bruto === 'string' ? bruto.trim() : (bruto ?? '')
    }
  }
  return saida
}
