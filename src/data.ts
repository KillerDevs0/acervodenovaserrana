export interface EstadoMigracao {
  id: number
  estado: string
  sigla: string
  familias: number
  cx: number
  cy: number
  cor: string
  desc: string
}

export interface Documentario {
  id: number
  titulo: string
  subtitulo: string
  duracao: string
  ano: number
  diretor: string
  thumb: string
}

export interface Historia {
  id: number
  nome: string
  origem: string
  chegada: number
  profissao: string
  foto: string
  citacao: string
}

export interface Foto {
  url: string
  leg: string
  span: string
}

export interface MarcoTemporal {
  ano: number
  titulo: string
  desc: string
}

export const LOGO_SRC = '/logo-nova-serrana.png'

export const estados: EstadoMigracao[] = [
  {
    id: 1,
    estado: 'Bahia',
    sigla: 'BA',
    familias: 2840,
    cx: 430,
    cy: 262,
    cor: '#d4a017',
    desc: 'Do sertão e do litoral baiano, famílias inteiras viajavam dias em busca de trabalho nas fábricas de calçados. Hoje, traços da culinária e da musicalidade baiana estão presentes em toda a cidade.',
  },
  {
    id: 2,
    estado: 'Vale do Jequitinhonha',
    sigla: 'MG*',
    familias: 1980,
    cx: 388,
    cy: 305,
    cor: '#a0c050',
    desc: 'A migração interna do Vale do Jequitinhonha — um dos mais pobres do estado — foi em volume a maior de todas. Esses mineiros carregavam tradições do campo que enriqueceram o tecido cultural da cidade.',
  },
  {
    id: 3,
    estado: 'Ceará',
    sigla: 'CE',
    familias: 1640,
    cx: 462,
    cy: 128,
    cor: '#e07030',
    desc: 'Cearenses trouxeram consigo a cultura nordestina, o forró, o artesanato em couro e a devoção dos festejos religiosos. São um dos grupos mais presentes nos bairros históricos da cidade.',
  },
  {
    id: 4,
    estado: 'Pernambuco',
    sigla: 'PE',
    familias: 1210,
    cx: 492,
    cy: 190,
    cor: '#c04060',
    desc: 'Pernambucanos foram fundamentais na fundação das primeiras associações de trabalhadores e na organização sindical da cidade. Muitos vieram fugindo da seca das décadas de 60 e 70.',
  },
  {
    id: 5,
    estado: 'Maranhão',
    sigla: 'MA',
    familias: 890,
    cx: 355,
    cy: 95,
    cor: '#5080d0',
    desc: 'Maranhenses estabeleceram-se nos bairros mais antigos e trouxeram as rezas de São João e as festas do bumba meu boi, que ainda hoje animam o calendário cultural de Nova Serrana.',
  },
  {
    id: 6,
    estado: 'Piauí',
    sigla: 'PI',
    familias: 720,
    cx: 398,
    cy: 120,
    cor: '#a060c0',
    desc: 'Piauienses chegaram em levas nos anos 70 e 80. Trouxeram tradições culinárias como a buchada e o sarapatel, e um forte espírito de solidariedade comunitária.',
  },
  {
    id: 7,
    estado: 'Paraíba',
    sigla: 'PB',
    familias: 680,
    cx: 500,
    cy: 163,
    cor: '#40a090',
    desc: 'Da Paraíba vieram famílias que se tornaram referência na produção artesanal de calçados. Muitos dos mestres sapateiros reconhecidos pela cidade são de origem paraibana.',
  },
  {
    id: 8,
    estado: 'Goiás',
    sigla: 'GO',
    familias: 450,
    cx: 268,
    cy: 240,
    cor: '#d08040',
    desc: 'Goianos migraram especialmente nas décadas de 1970 e 1980, atraídos pelo crescimento industrial. Trouxeram a viola caipira e a culinária do cerrado para a mesa serranense.',
  },
]

export const novaSerrana = { cx: 342, cy: 318 }

export const documentarios: Documentario[] = [
  {
    id: 1,
    titulo: 'As Mãos que Constroem',
    subtitulo: 'A história da indústria calçadista e as famílias migrantes',
    duracao: '34 min',
    ano: 2021,
    diretor: 'Carlos Mendonça',
    thumb: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=400&fit=crop&auto=format',
  },
  {
    id: 2,
    titulo: 'Raízes de Serrana',
    subtitulo: 'O caminho de fé e trabalho dos primeiros moradores',
    duracao: '51 min',
    ano: 2022,
    diretor: 'Ana Luísa Braga',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&h=400&fit=crop&auto=format',
  },
  {
    id: 3,
    titulo: 'Vozes do Jequitinhonha',
    subtitulo: 'Relatos de quem deixou o vale e encontrou uma nova casa',
    duracao: '28 min',
    ano: 2023,
    diretor: 'Mônica Leal',
    thumb: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&h=400&fit=crop&auto=format',
  },
]

export const historias: Historia[] = [
  {
    id: 1,
    nome: 'Sebastião Ferreira dos Santos',
    origem: 'Feira de Santana, BA',
    chegada: 1978,
    profissao: 'Sapateiro · Fundador da Associação dos Artesãos',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format',
    citacao: 'Cheguei com uma mala e dois sonhos. Nova Serrana me deu muito mais.',
  },
  {
    id: 2,
    nome: 'Maria das Dores Rodrigues',
    origem: 'Sobral, CE',
    chegada: 1983,
    profissao: 'Bordadeira · Mestra Cultural do município',
    foto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&auto=format',
    citacao: 'Trouxe as receitas da minha mãe, o bordado e o terço. Isso nunca deixei para trás.',
  },
  {
    id: 3,
    nome: 'José Airton de Lima',
    origem: 'Salinas, MG',
    chegada: 1971,
    profissao: 'Primeiro vereador eleito · Ex-presidente da Câmara',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format',
    citacao: 'A gente veio para fazer uma cidade. E fez.',
  },
  {
    id: 4,
    nome: 'Nazaré Alves Pereira',
    origem: 'Caxias, MA',
    chegada: 1990,
    profissao: 'Professora · Pesquisadora da memória oral',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&auto=format',
    citacao: 'Minha avó dizia: onde se planta amizade, brota comunidade.',
  },
]

export const fotos: Foto[] = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop&auto=format', leg: 'Vista da Serra, anos 1970', span: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=350&fit=crop&auto=format', leg: 'Trabalhadores da fábrica, 1982', span: '' },
  { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=350&fit=crop&auto=format', leg: 'Festa junina no centro, 1985', span: '' },
  { url: 'https://images.unsplash.com/photo-1488116908155-a11cede7c3d7?w=600&h=500&fit=crop&auto=format', leg: 'Artesã em seu ateliê, 1994', span: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&h=350&fit=crop&auto=format', leg: 'Mercado municipal, anos 1980', span: '' },
  { url: 'https://images.unsplash.com/photo-1504387432042-8aca549e4729?w=600&h=350&fit=crop&auto=format', leg: 'Crianças na praça central, 1988', span: '' },
]

export const timeline: MarcoTemporal[] = [
  { ano: 1954, titulo: 'Fundação do Distrito', desc: 'Nova Serrana é criada como distrito de Divinópolis, com os primeiros moradores fixos estabelecidos na serra.' },
  { ano: 1962, titulo: 'Emancipação Municipal', desc: 'A cidade torna-se município autônomo, com sua primeira prefeitura eleita democraticamente.' },
  { ano: 1970, titulo: 'Chegada dos Migrantes', desc: 'Início do grande fluxo migratório do Nordeste e do Vale do Jequitinhonha, atraídos pela expansão calçadista.' },
  { ano: 1982, titulo: 'Polo Calçadista', desc: 'Nova Serrana é reconhecida como o maior polo produtor de tênis esportivos da América Latina.' },
  { ano: 1995, titulo: 'Centro Cultural', desc: 'Inauguração do primeiro centro cultural e da biblioteca pública municipal, com acervo de memória local.' },
  { ano: 2008, titulo: 'Patrimônio Imaterial', desc: 'O saber-fazer dos artesãos sapateiros é reconhecido e registrado como patrimônio cultural municipal.' },
  { ano: 2024, titulo: 'Acervo Cultural Digital', desc: 'Lançamento do acervo digital em parceria com a Política Nacional Aldir Blanc — PNAB.' },
]

/**
 * Destinos da navegação — usados pelo menu do topo e pelo rodapé.
 *
 * Antes era uma lista de rótulos com `href="#"`, então nenhum item levava a
 * lugar algum. Cada destino agora aponta para o `id` de uma seção; três deles
 * ("Documentários", "Histórias", "Fotografias") não são seções próprias, e sim
 * abas dentro do Acervo — daí o campo `aba`, que o Nav usa para abrir a aba
 * certa antes de rolar.
 */
export type AbaAcervo = 'documentarios' | 'historias' | 'fotografias'

export interface ItemNav {
  rotulo: string
  /** `id` da seção de destino, sem `#`. */
  secao: string
  /** Quando o destino é o Acervo, qual aba abrir. */
  aba?: AbaAcervo
}

export const navItems: ItemNav[] = [
  { rotulo: 'Início', secao: 'inicio' },
  { rotulo: 'O Acervo', secao: 'acervo' },
  { rotulo: 'Mapa', secao: 'mapa' },
  { rotulo: 'Documentários', secao: 'acervo', aba: 'documentarios' },
  { rotulo: 'Histórias', secao: 'acervo', aba: 'historias' },
  { rotulo: 'Linha do Tempo', secao: 'linha-do-tempo' },
]

/** Endereços reais da Secretaria, usados pelos botões de contato e pelo rodapé. */
export const CONTATO = {
  email: 'cultura@novaserrana.mg.gov.br',
  // O rodapé trazia `tel:+5537` truncado, que abre o discador vazio.
  telefone: '+553733242000',
  telefoneVisivel: '(37) 3324-2000',
  pnab: 'https://www.gov.br/cultura/pt-br/assuntos/pnab',
}

export const brasilPath = `
  M 270,28 L 310,15 L 360,18 L 405,38 L 440,48 L 468,42 L 495,52
  L 510,68 L 500,85 L 478,92 L 455,98 L 438,108 L 420,106
  L 432,126 L 448,148 L 465,162 L 488,170 L 505,192
  L 508,215 L 498,238 L 493,262 L 486,285 L 476,308 L 464,328
  L 450,348 L 438,368 L 425,388 L 410,406 L 393,420 L 372,432
  L 348,440 L 322,445 L 296,440 L 275,428 L 256,412 L 238,393
  L 224,370 L 213,344 L 205,315 L 198,285 L 192,254 L 186,222
  L 180,192 L 174,162 L 168,132 L 160,102 L 150,76 L 140,55
  L 138,42 L 155,36 L 182,30 L 215,26 L 245,26
  Z
`
