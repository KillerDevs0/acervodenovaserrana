-- Conteúdo inicial do acervo, migrado de src/data.ts.
--
-- Rode depois de 0001_estrutura_inicial.sql. É idempotente: se as tabelas já
-- tiverem registros, nada é inserido — então rodar duas vezes não duplica nada.

-- Documentários -------------------------------------------------------------
insert into public.documentarios (titulo, subtitulo, duracao, ano, diretor, thumb, ordem)
select * from (values
  ('As Mãos que Constroem', 'A história da indústria calçadista e as famílias migrantes', '34 min', 2021, 'Carlos Mendonça', 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=400&fit=crop&auto=format', 1),
  ('Raízes de Serrana', 'O caminho de fé e trabalho dos primeiros moradores', '51 min', 2022, 'Ana Luísa Braga', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&h=400&fit=crop&auto=format', 2),
  ('Vozes do Jequitinhonha', 'Relatos de quem deixou o vale e encontrou uma nova casa', '28 min', 2023, 'Mônica Leal', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&h=400&fit=crop&auto=format', 3)
) as novos
where not exists (select 1 from public.documentarios);

-- Histórias -----------------------------------------------------------------
insert into public.historias (nome, origem, chegada, profissao, foto, citacao, ordem)
select * from (values
  ('Sebastião Ferreira dos Santos', 'Feira de Santana, BA', 1978, 'Sapateiro · Fundador da Associação dos Artesãos', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format', 'Cheguei com uma mala e dois sonhos. Nova Serrana me deu muito mais.', 1),
  ('Maria das Dores Rodrigues', 'Sobral, CE', 1983, 'Bordadeira · Mestra Cultural do município', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&auto=format', 'Trouxe as receitas da minha mãe, o bordado e o terço. Isso nunca deixei para trás.', 2),
  ('José Airton de Lima', 'Salinas, MG', 1971, 'Primeiro vereador eleito · Ex-presidente da Câmara', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format', 'A gente veio para fazer uma cidade. E fez.', 3),
  ('Nazaré Alves Pereira', 'Caxias, MA', 1990, 'Professora · Pesquisadora da memória oral', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&auto=format', 'Minha avó dizia: onde se planta amizade, brota comunidade.', 4)
) as novos
where not exists (select 1 from public.historias);

-- Fotografias ---------------------------------------------------------------
insert into public.fotos (url, legenda, destaque, ordem)
select * from (values
  ('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop&auto=format', 'Vista da Serra, anos 1970', 'row-span-2', 1),
  ('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=350&fit=crop&auto=format', 'Trabalhadores da fábrica, 1982', '', 2),
  ('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=350&fit=crop&auto=format', 'Festa junina no centro, 1985', '', 3),
  ('https://images.unsplash.com/photo-1488116908155-a11cede7c3d7?w=600&h=500&fit=crop&auto=format', 'Artesã em seu ateliê, 1994', 'row-span-2', 4),
  ('https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&h=350&fit=crop&auto=format', 'Mercado municipal, anos 1980', '', 5),
  ('https://images.unsplash.com/photo-1504387432042-8aca549e4729?w=600&h=350&fit=crop&auto=format', 'Crianças na praça central, 1988', '', 6)
) as novos
where not exists (select 1 from public.fotos);

-- Linha do tempo ------------------------------------------------------------
insert into public.marcos_temporais (ano, titulo, descricao, ordem)
select * from (values
  (1954, 'Fundação do Distrito', 'Nova Serrana é criada como distrito de Divinópolis, com os primeiros moradores fixos estabelecidos na serra.', 1),
  (1962, 'Emancipação Municipal', 'A cidade torna-se município autônomo, com sua primeira prefeitura eleita democraticamente.', 2),
  (1970, 'Chegada dos Migrantes', 'Início do grande fluxo migratório do Nordeste e do Vale do Jequitinhonha, atraídos pela expansão calçadista.', 3),
  (1982, 'Polo Calçadista', 'Nova Serrana é reconhecida como o maior polo produtor de tênis esportivos da América Latina.', 4),
  (1995, 'Centro Cultural', 'Inauguração do primeiro centro cultural e da biblioteca pública municipal, com acervo de memória local.', 5),
  (2008, 'Patrimônio Imaterial', 'O saber-fazer dos artesãos sapateiros é reconhecido e registrado como patrimônio cultural municipal.', 6),
  (2024, 'Acervo Cultural Digital', 'Lançamento do acervo digital em parceria com a Política Nacional Aldir Blanc — PNAB.', 7)
) as novos
where not exists (select 1 from public.marcos_temporais);

-- Estados de origem ---------------------------------------------------------
insert into public.estados_origem (estado, sigla, familias, cor, cx, cy, descricao, ordem)
select * from (values
  ('Bahia', 'BA', 2840, '#d4a017', 430, 262, 'Do sertão e do litoral baiano, famílias inteiras viajavam dias em busca de trabalho nas fábricas de calçados. Hoje, traços da culinária e da musicalidade baiana estão presentes em toda a cidade.', 1),
  ('Vale do Jequitinhonha', 'MG*', 1980, '#a0c050', 388, 305, 'A migração interna do Vale do Jequitinhonha — um dos mais pobres do estado — foi em volume a maior de todas. Esses mineiros carregavam tradições do campo que enriqueceram o tecido cultural da cidade.', 2),
  ('Ceará', 'CE', 1640, '#e07030', 462, 128, 'Cearenses trouxeram consigo a cultura nordestina, o forró, o artesanato em couro e a devoção dos festejos religiosos. São um dos grupos mais presentes nos bairros históricos da cidade.', 3),
  ('Pernambuco', 'PE', 1210, '#c04060', 492, 190, 'Pernambucanos foram fundamentais na fundação das primeiras associações de trabalhadores e na organização sindical da cidade. Muitos vieram fugindo da seca das décadas de 60 e 70.', 4),
  ('Maranhão', 'MA', 890, '#5080d0', 355, 95, 'Maranhenses estabeleceram-se nos bairros mais antigos e trouxeram as rezas de São João e as festas do bumba meu boi, que ainda hoje animam o calendário cultural de Nova Serrana.', 5),
  ('Piauí', 'PI', 720, '#a060c0', 398, 120, 'Piauienses chegaram em levas nos anos 70 e 80. Trouxeram tradições culinárias como a buchada e o sarapatel, e um forte espírito de solidariedade comunitária.', 6),
  ('Paraíba', 'PB', 680, '#40a090', 500, 163, 'Da Paraíba vieram famílias que se tornaram referência na produção artesanal de calçados. Muitos dos mestres sapateiros reconhecidos pela cidade são de origem paraibana.', 7),
  ('Goiás', 'GO', 450, '#d08040', 268, 240, 'Goianos migraram especialmente nas décadas de 1970 e 1980, atraídos pelo crescimento industrial. Trouxeram a viola caipira e a culinária do cerrado para a mesa serranense.', 8)
) as novos
where not exists (select 1 from public.estados_origem);
