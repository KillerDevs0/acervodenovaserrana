import { Camera, Clock, Film, MapPin, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ColecaoId } from '../store/content'

/**
 * Descrição declarativa de cada coleção do acervo. Formulário, tabela e
 * validação do painel são todos gerados a partir daqui — para adicionar um
 * campo, basta descrevê-lo neste arquivo.
 */

export type TipoCampo =
  | 'texto'
  | 'textarea'
  | 'numero'
  | 'url'
  | 'cor'
  | 'select'
  | 'booleano'
  | 'data'

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
  /** Valor de um registro novo. Sem isso, campos começam vazios. */
  padrao?: unknown
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
  /** Marca coleções com dados pessoais de terceiros, sujeitas à LGPD. */
  dadosPessoais?: boolean
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
      { nome: 'publicado', rotulo: 'Visível no site', tipo: 'booleano', padrao: true },
    ],
  },
  {
    id: 'historias',
    rotulo: 'Histórias',
    rotuloSingular: 'história',
    descricao: 'Relatos de moradores e memória oral. Contém dados pessoais.',
    Icone: Users,
    colunas: ['nome', 'origem', 'chegada', 'publicado'],
    campoImagem: 'foto',
    dadosPessoais: true,
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
      {
        nome: 'consentimento_em',
        rotulo: 'Data do consentimento',
        tipo: 'data',
        ajuda: 'Quando o titular autorizou a divulgação. Obrigatório para publicar.',
      },
      {
        nome: 'consentimento_obs',
        rotulo: 'Registro do consentimento',
        tipo: 'textarea',
        ajuda: 'Onde está o termo assinado e quais limites o titular impôs ao uso.',
      },
      {
        nome: 'publicado',
        rotulo: 'Visível no site',
        tipo: 'booleano',
        padrao: false,
        ajuda: 'Só publique com o consentimento do titular registrado acima.',
      },
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
      { nome: 'publicado', rotulo: 'Visível no site', tipo: 'booleano', padrao: true },
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
      { nome: 'publicado', rotulo: 'Visível no site', tipo: 'booleano', padrao: true },
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
      { nome: 'publicado', rotulo: 'Visível no site', tipo: 'booleano', padrao: true },
    ],
  },
]

export function acharSchema(id: string): SchemaColecao | undefined {
  return schemas.find((schema) => schema.id === id)
}

export function valorInicial(schema: SchemaColecao): Record<string, unknown> {
  const registro: Record<string, unknown> = {}
  for (const campo of schema.campos) {
    if (campo.padrao !== undefined) {
      registro[campo.nome] = campo.padrao
    } else if (campo.tipo === 'booleano') {
      registro[campo.nome] = false
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

    if (campo.tipo === 'booleano') continue

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

    if (campo.tipo === 'data' && typeof texto === 'string') {
      const data = new Date(`${texto}T00:00:00`)
      if (Number.isNaN(data.getTime())) {
        erros[campo.nome] = 'Informe uma data válida.'
      } else if (data.getTime() > Date.now()) {
        erros[campo.nome] = 'A data não pode estar no futuro.'
      }
    }
  }

  // Espelha a constraint `historias_exige_consentimento` do banco, para que o
  // editor veja o impedimento no formulário em vez de um erro de Postgres.
  if (schema.dadosPessoais && valores.publicado === true && !valores.consentimento_em) {
    erros.consentimento_em =
      'Registre a data do consentimento do titular antes de publicar esta história.'
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
    } else if (campo.tipo === 'booleano') {
      saida[campo.nome] = bruto === true
    } else if (campo.tipo === 'data') {
      // Data vazia é `null` no banco, não string vazia: a coluna é `date`.
      const texto = typeof bruto === 'string' ? bruto.trim() : ''
      saida[campo.nome] = texto === '' ? null : texto
    } else {
      saida[campo.nome] = typeof bruto === 'string' ? bruto.trim() : (bruto ?? '')
    }
  }
  return saida
}
