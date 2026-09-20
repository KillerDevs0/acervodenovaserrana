export type TipoClassificacaoFonte =
  | 'Fonte documental'
  | 'Relato oral'
  | 'Acervo familiar'
  | 'Imprensa'
  | 'Publicação'
  | 'Registro institucional'

export interface FonteHistorica {
  id: number
  titulo: string
  tipo: TipoClassificacaoFonte
  autor?: string
  entrevistado?: string
  data_registro?: string
  origem_documento?: string
  responsavel_envio?: string
  nivel_confirmacao?: string
  observacoes?: string
  publicado?: boolean
}

export interface BairroLugar {
  id: number
  nome: string
  decada_formacao: string
  fotografia_url: string
  fotografia_alt?: string
  historico: string
  curiosidades: string
  fontes: string
  status_validacao: string
  publicado?: boolean
  ordem?: number
}

export interface AntesDepoisItem {
  id: number
  nome_local: string
  bairro: string
  endereco_referencia: string
  ano_antiga: string
  ano_atual: string
  foto_antiga_url: string
  foto_antiga_alt?: string
  foto_atual_url: string
  foto_atual_alt?: string
  descricao_historica: string
  fonte_fotografia: string
  creditos: string
  tipo_fonte?: TipoClassificacaoFonte
  publicado?: boolean
  ordem?: number
}

export interface MarcoUrbano {
  id: number
  ano: number | string
  titulo: string
  descricao: string
  fotografia_url?: string
  fotografia_alt?: string
  fonte: string
  creditos?: string
  categoria:
    | 'crescimento urbano'
    | 'formação de bairros'
    | 'praças'
    | 'igrejas'
    | 'escolas'
    | 'prédios'
    | 'fábricas'
    | 'comércio'
    | 'indústria calçadista'
    | 'espaços públicos'
    | 'transformações da cidade'
  tipo_fonte?: TipoClassificacaoFonte
  publicado?: boolean
  ordem?: number
}

export type CategoriaAcervoHistorico =
  | 'Fotografias antigas'
  | 'Fotografias atuais'
  | 'Documentos históricos'
  | 'Jornais e recortes'
  | 'Cartazes'
  | 'Fotografias de famílias'
  | 'Fotografias de fábricas'
  | 'Espaços públicos'
  | 'Cultura popular'
  | 'Trabalho e indústria'

export type TipoMaterial = 'Fotografia' | 'Documento' | 'Jornal / Recorte' | 'Cartaz' | 'Outro'

export interface ItemAcervoHistorico {
  id: number
  titulo: string
  imagem_url: string
  imagem_alt?: string
  categoria: CategoriaAcervoHistorico
  tipo_material: TipoMaterial
  data_periodo: string
  decada: string
  bairro?: string
  descricao: string
  origem_material: string
  autor?: string
  pessoa_disponibilizou?: string
  creditos: string
  fonte: string
  tipo_fonte: TipoClassificacaoFonte
  tags: string[]
  audiodescricao?: string
  transcricao?: string
  publicado?: boolean
  ordem?: number
}

export interface DepoimentoEvento {
  autor: string
  relato: string
  relacao: string
}

export interface EventoCultural {
  id: number
  nome: string
  periodo_data: string
  eh_festa_imigrante?: boolean
  descricao: string
  historico?: string
  galeria: { url: string; legenda: string; alt?: string }[]
  videos?: { titulo: string; url: string; audiodescricao?: string }[]
  depoimentos?: DepoimentoEvento[]
  programacao_edicoes?: { edicao: string; ano: number; destaques: string }[]
  manifestacoes_culturais?: string[]
  comunidades_participantes?: string[]
  fontes: string
  creditos: string
  tipo_fonte?: TipoClassificacaoFonte
  publicado?: boolean
  ordem?: number
}

export interface MemoriaOralAmpliada {
  id: number
  nome: string
  cidade_origem: string
  estado_origem: string
  ano_chegada: number
  profissao: string
  foto: string
  foto_alt?: string
  galeria?: { url: string; legenda: string; alt?: string }[]
  audio_url?: string
  video_url?: string
  citacao: string
  relato_completo?: string
  historia_familia?: string
  tradicoes?: string
  culinaria?: string
  musica?: string
  religiao_fe?: string
  oficios?: string
  relacao_nova_serrana?: string
  transcricao?: string
  audiodescricao?: string
  fontes_autorizacao: string
  creditos: string
  tipo_fonte: TipoClassificacaoFonte
  consentimento_em?: string
  consentimento_obs?: string
  publicado?: boolean
  ordem?: number
}
