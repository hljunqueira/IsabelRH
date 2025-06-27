-- =====================================================
-- SCRIPT PARA ADICIONAR DADOS DE EXEMPLO
-- Execute este script após criar as tabelas e adicionar os usuários
-- =====================================================

-- 1. DADOS DE EXEMPLO PARA CANDIDATOS
-- =====================================================

-- Candidato 1 - Desenvolvedor Full Stack
INSERT INTO candidatos (
  id, nome, telefone, celular, linkedin, github, portfolio,
  endereco, cidade, estado, cep, data_nascimento, estado_civil, genero,
  nivel_escolaridade, curso, instituicao, ano_formacao,
  idiomas, habilidades, experiencias, certificacoes, objetivo_profissional,
  pretensao_salarial, disponibilidade, modalidade_trabalho,
  areas_interesse, perfil_disc, pontuacao_d, pontuacao_i, pontuacao_s, pontuacao_c
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Substitua pelo UID real do candidato
  'João Silva Santos',
  '(11) 99999-1111',
  '(11) 98888-1111',
  'linkedin.com/in/joaosilva',
  'github.com/joaosilva',
  'joaosilva.dev',
  'Rua das Flores, 123 - Centro',
  'São Paulo',
  'SP',
  '01234-567',
  '1990-05-15',
  'solteiro',
  'masculino',
  'Superior Completo',
  'Sistemas de Informação',
  'Universidade de São Paulo',
  '2015',
  ARRAY['Português', 'Inglês', 'Espanhol'],
  ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  '5 anos de experiência em desenvolvimento web, com foco em aplicações React e Node.js. Trabalhei em startups e empresas de médio porte.',
  'AWS Certified Developer, React Certification',
  'Busco oportunidades para crescer como desenvolvedor full stack, contribuindo com projetos desafiadores e inovadores.',
  'R$ 8.000 - R$ 12.000',
  'Imediata',
  'Híbrido',
  ARRAY['Desenvolvimento Web', 'Full Stack', 'Frontend', 'Backend'],
  'dominante',
  8, 6, 4, 2
) ON CONFLICT (id) DO NOTHING;

-- Candidato 2 - UX/UI Designer
INSERT INTO candidatos (
  id, nome, telefone, celular, linkedin, github, portfolio,
  endereco, cidade, estado, cep, data_nascimento, estado_civil, genero,
  nivel_escolaridade, curso, instituicao, ano_formacao,
  idiomas, habilidades, experiencias, certificacoes, objetivo_profissional,
  pretensao_salarial, disponibilidade, modalidade_trabalho,
  areas_interesse, perfil_disc, pontuacao_d, pontuacao_i, pontuacao_s, pontuacao_c
) VALUES (
  '00000000-0000-0000-0000-000000000002', -- Substitua pelo UID real do candidato
  'Maria Oliveira Costa',
  '(11) 99999-2222',
  '(11) 98888-2222',
  'linkedin.com/in/mariaoliveira',
  'github.com/mariaoliveira',
  'mariaoliveira.design',
  'Av. Paulista, 456 - Bela Vista',
  'São Paulo',
  'SP',
  '01310-100',
  '1992-08-20',
  'casada',
  'feminino',
  'Superior Completo',
  'Design Gráfico',
  'Escola Superior de Propaganda e Marketing',
  '2016',
  ARRAY['Português', 'Inglês'],
  ARRAY['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision', 'Principle'],
  '4 anos de experiência em design de interfaces, trabalhando com metodologias ágeis e design thinking.',
  'Google UX Design Certificate, Figma Master',
  'Busco oportunidades para criar experiências digitais impactantes e centradas no usuário.',
  'R$ 6.000 - R$ 9.000',
  '15 dias',
  'Remoto',
  ARRAY['UX/UI Design', 'Design de Produto', 'Design System'],
  'influente',
  3, 9, 5, 3
) ON CONFLICT (id) DO NOTHING;

-- Candidato 3 - Analista de Dados
INSERT INTO candidatos (
  id, nome, telefone, celular, linkedin, github, portfolio,
  endereco, cidade, estado, cep, data_nascimento, estado_civil, genero,
  nivel_escolaridade, curso, instituicao, ano_formacao,
  idiomas, habilidades, experiencias, certificacoes, objetivo_profissional,
  pretensao_salarial, disponibilidade, modalidade_trabalho,
  areas_interesse, perfil_disc, pontuacao_d, pontuacao_i, pontuacao_s, pontuacao_c
) VALUES (
  '00000000-0000-0000-0000-000000000003', -- Substitua pelo UID real do candidato
  'Carlos Eduardo Lima',
  '(11) 99999-3333',
  '(11) 98888-3333',
  'linkedin.com/in/carloseduardo',
  'github.com/carloseduardo',
  'carloseduardo.analytics',
  'Rua Augusta, 789 - Consolação',
  'São Paulo',
  'SP',
  '01212-000',
  '1988-12-10',
  'solteiro',
  'masculino',
  'Pós-Graduação',
  'Estatística',
  'Universidade Estadual de Campinas',
  '2018',
  ARRAY['Português', 'Inglês', 'Francês'],
  ARRAY['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel Avançado', 'Machine Learning'],
  '6 anos de experiência em análise de dados e business intelligence, com foco em insights para tomada de decisão.',
  'Google Data Analytics Certificate, Microsoft Power BI Certification',
  'Busco oportunidades para aplicar conhecimentos em análise de dados para gerar valor para a empresa.',
  'R$ 7.000 - R$ 11.000',
  'Imediata',
  'Presencial',
  ARRAY['Análise de Dados', 'Business Intelligence', 'Machine Learning'],
  'conscencioso',
  2, 3, 4, 11
) ON CONFLICT (id) DO NOTHING;

-- 2. DADOS DE EXEMPLO PARA EMPRESAS
-- =====================================================

-- Empresa 1 - Startup de Tecnologia
INSERT INTO empresas (
  id, nome, cnpj, razao_social, nome_fantasia, inscricao_estadual,
  setor, porte, telefone, celular, website, linkedin,
  endereco, cidade, estado, cep, descricao, missao, visao, valores,
  beneficios, cultura, numero_funcionarios, ano_fundacao,
  contato, cargo_contato
) VALUES (
  '00000000-0000-0000-0000-000000000004', -- Substitua pelo UID real da empresa
  'TechStart Solutions',
  '12.345.678/0001-90',
  'TechStart Solutions Ltda',
  'TechStart',
  '123.456.789.012',
  'Tecnologia',
  'Pequena',
  '(11) 3333-4444',
  '(11) 97777-4444',
  'techstart.com.br',
  'linkedin.com/company/techstart',
  'Av. Brigadeiro Faria Lima, 1000 - Itaim Bibi',
  'São Paulo',
  'SP',
  '04538-100',
  'Startup inovadora focada em soluções digitais para pequenas e médias empresas.',
  'Democratizar o acesso à tecnologia para empresas de todos os portes.',
  'Ser referência em soluções digitais acessíveis e eficientes.',
  'Inovação, Transparência, Colaboração, Excelência',
  ARRAY['Plano de saúde', 'Vale refeição', 'Gympass', 'Horário flexível', 'Home office'],
  'Cultura jovem e dinâmica, com foco em inovação e colaboração.',
  '15-50',
  '2020',
  'Ana Paula Silva',
  'CEO'
) ON CONFLICT (id) DO NOTHING;

-- Empresa 2 - Empresa de Consultoria
INSERT INTO empresas (
  id, nome, cnpj, razao_social, nome_fantasia, inscricao_estadual,
  setor, porte, telefone, celular, website, linkedin,
  endereco, cidade, estado, cep, descricao, missao, visao, valores,
  beneficios, cultura, numero_funcionarios, ano_fundacao,
  contato, cargo_contato
) VALUES (
  '00000000-0000-0000-0000-000000000005', -- Substitua pelo UID real da empresa
  'Consultoria RH Pro',
  '98.765.432/0001-10',
  'Consultoria RH Pro Ltda',
  'RH Pro',
  '987.654.321.098',
  'Consultoria',
  'Média',
  '(11) 4444-5555',
  '(11) 96666-5555',
  'rhpro.com.br',
  'linkedin.com/company/rhpro',
  'Rua Oscar Freire, 500 - Jardins',
  'São Paulo',
  'SP',
  '01426-000',
  'Empresa especializada em consultoria em recursos humanos e gestão de pessoas.',
  'Desenvolver pessoas e organizações através de soluções inovadoras em RH.',
  'Ser a consultoria mais respeitada em gestão de pessoas no Brasil.',
  'Ética, Profissionalismo, Inovação, Resultados',
  ARRAY['Plano de saúde', 'Vale alimentação', 'PLR', 'Capacitação contínua'],
  'Cultura profissional e focada em resultados, com ambiente colaborativo.',
  '50-200',
  '2015',
  'Roberto Mendes',
  'Diretor de RH'
) ON CONFLICT (id) DO NOTHING;

-- 3. DADOS DE EXEMPLO PARA VAGAS
-- =====================================================

-- Vaga 1 - Desenvolvedor Full Stack
INSERT INTO vagas (
  empresa_id, titulo, descricao, requisitos, area, nivel, tipo_contrato,
  modalidade, salario, beneficios, cidade, estado, carga_horaria,
  responsabilidades, diferenciais, status
) VALUES (
  '00000000-0000-0000-0000-000000000004', -- UID da TechStart
  'Desenvolvedor Full Stack Pleno',
  'Estamos procurando um desenvolvedor full stack para integrar nosso time de desenvolvimento.',
  'Conhecimento sólido em JavaScript/TypeScript, React, Node.js, PostgreSQL. Experiência com metodologias ágeis.',
  'Desenvolvimento',
  'Pleno',
  'CLT',
  'Híbrido',
  'R$ 8.000 - R$ 12.000',
  ARRAY['Plano de saúde', 'Vale refeição', 'Gympass', 'Horário flexível'],
  'São Paulo',
  'SP',
  '40h semanais',
  'Desenvolver aplicações web, participar de code reviews, colaborar com o time de produto.',
  'Conhecimento em Docker, AWS, testes automatizados.',
  'ativa'
) ON CONFLICT DO NOTHING;

-- Vaga 2 - UX/UI Designer
INSERT INTO vagas (
  empresa_id, titulo, descricao, requisitos, area, nivel, tipo_contrato,
  modalidade, salario, beneficios, cidade, estado, carga_horaria,
  responsabilidades, diferenciais, status
) VALUES (
  '00000000-0000-0000-0000-000000000004', -- UID da TechStart
  'UX/UI Designer',
  'Procuramos um designer apaixonado por criar experiências digitais incríveis.',
  'Experiência com Figma, Adobe XD, metodologias de design thinking, portfólio com projetos web.',
  'Design',
  'Pleno',
  'CLT',
  'Remoto',
  'R$ 6.000 - R$ 9.000',
  ARRAY['Plano de saúde', 'Vale refeição', 'Gympass', 'Horário flexível'],
  'São Paulo',
  'SP',
  '40h semanais',
  'Criar interfaces intuitivas, realizar pesquisas com usuários, colaborar com desenvolvedores.',
  'Conhecimento em design system, animações, prototipagem.',
  'ativa'
) ON CONFLICT DO NOTHING;

-- Vaga 3 - Analista de RH
INSERT INTO vagas (
  empresa_id, titulo, descricao, requisitos, area, nivel, tipo_contrato,
  modalidade, salario, beneficios, cidade, estado, carga_horaria,
  responsabilidades, diferenciais, status
) VALUES (
  '00000000-0000-0000-0000-000000000005', -- UID da RH Pro
  'Analista de Recursos Humanos',
  'Vaga para analista de RH com foco em recrutamento e seleção.',
  'Formação em Psicologia, Administração ou áreas afins. Experiência em R&S.',
  'Recursos Humanos',
  'Júnior',
  'CLT',
  'Presencial',
  'R$ 4.000 - R$ 6.000',
  ARRAY['Plano de saúde', 'Vale alimentação', 'PLR'],
  'São Paulo',
  'SP',
  '40h semanais',
  'Conduzir processos seletivos, entrevistas, avaliações psicológicas.',
  'Conhecimento em ferramentas de R&S, testes psicológicos.',
  'ativa'
) ON CONFLICT DO NOTHING;

-- 4. DADOS DE EXEMPLO PARA CANDIDATURAS
-- =====================================================

-- Candidatura 1
INSERT INTO candidaturas (
  vaga_id, candidato_id, status, etapa, pontuacao,
  compatibilidade_disc, compatibilidade_skills, prioridade
) VALUES (
  (SELECT id FROM vagas WHERE titulo = 'Desenvolvedor Full Stack Pleno' LIMIT 1),
  '00000000-0000-0000-0000-000000000001', -- UID do João Silva
  'triagem',
  'Avaliação técnica',
  85,
  75,
  90,
  'alta'
) ON CONFLICT DO NOTHING;

-- Candidatura 2
INSERT INTO candidaturas (
  vaga_id, candidato_id, status, etapa, pontuacao,
  compatibilidade_disc, compatibilidade_skills, prioridade
) VALUES (
  (SELECT id FROM vagas WHERE titulo = 'UX/UI Designer' LIMIT 1),
  '00000000-0000-0000-0000-000000000002', -- UID da Maria Oliveira
  'entrevista',
  'Entrevista com gestor',
  92,
  80,
  95,
  'alta'
) ON CONFLICT DO NOTHING;

-- Candidatura 3
INSERT INTO candidaturas (
  vaga_id, candidato_id, status, etapa, pontuacao,
  compatibilidade_disc, compatibilidade_skills, prioridade
) VALUES (
  (SELECT id FROM vagas WHERE titulo = 'Analista de Recursos Humanos' LIMIT 1),
  '00000000-0000-0000-0000-000000000003', -- UID do Carlos Eduardo
  'candidatado',
  'Análise de currículo',
  78,
  65,
  70,
  'media'
) ON CONFLICT DO NOTHING;

-- 5. DADOS DE EXEMPLO PARA BANCO DE TALENTOS
-- =====================================================

INSERT INTO banco_talentos (nome, email, telefone, area_interesse) VALUES
('Pedro Santos', 'pedro.santos@email.com', '(11) 99999-6666', 'Desenvolvimento Mobile'),
('Ana Costa', 'ana.costa@email.com', '(11) 99999-7777', 'Marketing Digital'),
('Lucas Ferreira', 'lucas.ferreira@email.com', '(11) 99999-8888', 'Vendas'),
('Juliana Lima', 'juliana.lima@email.com', '(11) 99999-9999', 'Design Gráfico'),
('Rafael Silva', 'rafael.silva@email.com', '(11) 99999-0000', 'Análise de Dados')
ON CONFLICT DO NOTHING;

-- 6. DADOS DE EXEMPLO PARA CONTATOS
-- =====================================================

INSERT INTO contatos (nome, email, empresa, mensagem) VALUES
('João da Silva', 'joao.silva@empresa.com', 'Empresa ABC', 'Gostaria de saber mais sobre os serviços de recrutamento.'),
('Maria Oliveira', 'maria.oliveira@startup.com', 'Startup XYZ', 'Interessada em parceria para contratação de desenvolvedores.'),
('Carlos Santos', 'carlos.santos@consultoria.com', 'Consultoria 123', 'Preciso de orientação sobre gestão de equipes.'),
('Ana Costa', 'ana.costa@tech.com', 'Tech Solutions', 'Busco candidatos para vaga de product manager.'),
('Pedro Lima', 'pedro.lima@rh.com', 'RH Pro', 'Quero informações sobre treinamentos corporativos.')
ON CONFLICT DO NOTHING;

-- 7. DADOS DE EXEMPLO PARA SERVIÇOS
-- =====================================================

INSERT INTO servicos (empresa_id, tipo_servico, descricao, valor, status) VALUES
('00000000-0000-0000-0000-000000000005', 'recrutamento', 'Recrutamento de 5 desenvolvedores full stack', 'R$ 15.000', 'em_andamento'),
('00000000-0000-0000-0000-000000000005', 'consultoria_rh', 'Reestruturação do setor de RH', 'R$ 25.000', 'pendente'),
('00000000-0000-0000-0000-000000000005', 'treinamento', 'Treinamento em liderança para 20 gestores', 'R$ 8.000', 'concluida')
ON CONFLICT DO NOTHING;

-- 8. DADOS DE EXEMPLO PARA RELATÓRIOS
-- =====================================================

INSERT INTO relatorios (tipo, periodo, total_candidatos, total_empresas, total_vagas, total_servicos, faturamento) VALUES
('mensal', 'Janeiro 2024', '150', '25', '45', '12', 'R$ 180.000'),
('mensal', 'Fevereiro 2024', '180', '30', '52', '15', 'R$ 220.000'),
('trimestral', 'Q1 2024', '450', '75', '140', '42', 'R$ 650.000')
ON CONFLICT DO NOTHING;

-- 9. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Dados de exemplo adicionados com sucesso!';
  RAISE NOTICE 'Candidatos: 3';
  RAISE NOTICE 'Empresas: 2';
  RAISE NOTICE 'Vagas: 3';
  RAISE NOTICE 'Candidaturas: 3';
  RAISE NOTICE 'Banco de Talentos: 5';
  RAISE NOTICE 'Contatos: 5';
  RAISE NOTICE 'Serviços: 3';
  RAISE NOTICE 'Relatórios: 3';
END $$; 