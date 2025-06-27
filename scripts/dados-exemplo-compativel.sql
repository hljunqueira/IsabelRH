-- Script para inserir dados de exemplo compatível com a estrutura real da tabela candidatos
-- Execute este script APÓS executar o schema-atual.sql

-- Inserir usuários de exemplo
INSERT INTO usuarios (id, email, senha, tipo) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'joao.silva@email.com', '$2a$10$hash', 'candidato'),
('550e8400-e29b-41d4-a716-446655440002', 'maria.santos@email.com', '$2a$10$hash', 'candidato'),
('550e8400-e29b-41d4-a716-446655440003', 'techcorp@empresa.com', '$2a$10$hash', 'empresa'),
('550e8400-e29b-41d4-a716-446655440004', 'admin@isabelrh.com', '$2a$10$hash', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir candidatos (estrutura compatível com a tabela real)
INSERT INTO candidatos (id, user_id, nome, email, telefone, localizacao, experiencia, educacao, habilidades, resumo, expectativa_salarial, disponibilidade, modalidade, tipo_contrato, setores, linkedin, github, portfolio, curriculo_url, score, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@email.com', '(11) 99999-9999', 'São Paulo, SP', 5, 'Ciência da Computação - USP (2015)', ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript'], 'Desenvolvedor full-stack com 5 anos de experiência em aplicações web modernas. Especializado em React, Node.js e TypeScript.', 8000.00, 'Imediata', 'remoto', 'clt', ARRAY['Desenvolvimento Web', 'Mobile'], 'linkedin.com/in/joaosilva', 'github.com/joaosilva', 'joaosilva.dev', 'https://storage.googleapis.com/curriculos/joao-silva.pdf', 85, 'disponivel'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria.santos@email.com', '(11) 88888-8888', 'São Paulo, SP', 8, 'Engenharia de Software - UNICAMP (2012)', ARRAY['Python', 'Django', 'PostgreSQL', 'Docker'], 'Engenheira de software com 8 anos de experiência em desenvolvimento backend e arquitetura de sistemas. Especializada em Python, Django e cloud computing.', 12000.00, '30 dias', 'hibrido', 'clt', ARRAY['Backend', 'DevOps'], 'linkedin.com/in/mariasantos', 'github.com/mariasantos', 'mariasantos.dev', 'https://storage.googleapis.com/curriculos/maria-santos.pdf', 92, 'disponivel')
ON CONFLICT (id) DO NOTHING;

-- Inserir empresas
INSERT INTO empresas (id, nome, cnpj, razao_social, nome_fantasia, inscricao_estadual, setor, porte, telefone, celular, website, linkedin, endereco, cidade, estado, cep, descricao, missao, visao, valores, beneficios, cultura, numero_funcionarios, ano_fundacao, contato, cargo_contato, logo_empresa) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'TechCorp Solutions', '12.345.678/0001-90', 'TechCorp Solutions Ltda', 'TechCorp', '123.456.789.012', 'Tecnologia', 'Médio', '(11) 3333-3333', '(11) 99999-7777', 'techcorp.com.br', 'linkedin.com/company/techcorp', 'Rua Augusta, 789', 'São Paulo', 'SP', '01212-000', 'Empresa de tecnologia focada em soluções inovadoras', 'Transformar o mundo através da tecnologia', 'Ser referência em inovação tecnológica', 'Inovação, Qualidade, Transparência', ARRAY['Plano de saúde', 'Vale refeição', 'Gympass', 'PLR'], 'Cultura colaborativa e inovadora', '150-200', '2018', 'Ana Costa', 'Recursos Humanos', 'https://storage.googleapis.com/logos/techcorp.png')
ON CONFLICT (id) DO NOTHING;

-- Inserir vagas
INSERT INTO vagas (id, empresa_id, titulo, descricao, requisitos, area, nivel, tipo_contrato, modalidade, salario, beneficios, cidade, estado, carga_horaria, responsabilidades, diferenciais, status, data_encerramento, publicado_em) VALUES
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Desenvolvedor Full-Stack Sênior', 'Estamos procurando um desenvolvedor full-stack sênior para se juntar ao nosso time de desenvolvimento.', 'Experiência mínima de 5 anos em desenvolvimento web\nConhecimento em React, Node.js e TypeScript\nExperiência com bancos de dados PostgreSQL\nConhecimento em Docker e AWS', 'Desenvolvimento', 'Sênior', 'CLT', 'Híbrido', 'R$ 8.000,00 - R$ 12.000,00', ARRAY['Plano de saúde', 'Vale refeição', 'Gympass'], 'São Paulo', 'SP', '40h semanais', 'Desenvolver aplicações web\nParticipar de code reviews\nMentoria para desenvolvedores júnior', 'Trabalho com tecnologias de ponta\nAmbiente colaborativo', 'ativa', NOW() + INTERVAL '30 days', NOW()),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Arquiteta de Software', 'Procuramos uma arquiteta de software para liderar projetos de grande escala.', 'Experiência mínima de 8 anos em desenvolvimento\nConhecimento em arquitetura de microserviços\nExperiência com cloud computing (AWS/GCP)\nConhecimento em Python e Django', 'Arquitetura', 'Sênior', 'CLT', 'Remoto', 'R$ 12.000,00 - R$ 18.000,00', ARRAY['Plano de saúde', 'Vale refeição', 'PLR'], 'São Paulo', 'SP', '40h semanais', 'Definir arquitetura de sistemas\nLiderar equipes técnicas\nOtimizar performance de aplicações', 'Projetos desafiadores\nCrescimento profissional', 'ativa', NOW() + INTERVAL '45 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir candidaturas
INSERT INTO candidaturas (id, vaga_id, candidato_id, status, etapa, observacoes, pontuacao, data_triagem, data_entrevista, feedback_empresa, motivo_reprovacao, compatibilidade_disc, compatibilidade_skills, compatibilidade_localizacao, prioridade, tags_filtros, data_candidatura, ultima_atualizacao) VALUES
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'triagem', 'Teste técnico', 'Candidato com perfil muito forte', 8, NOW(), NULL, 'Perfil muito interessante', NULL, 85, 90, true, 'alta', ARRAY['senior', 'fullstack', 'react'], NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'entrevista', 'Entrevista final', 'Excelente perfil para arquitetura', 9, NOW(), NOW() + INTERVAL '7 days', 'Perfil excepcional', NULL, 90, 95, true, 'urgente', ARRAY['senior', 'arquiteto', 'python'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir banco de talentos
INSERT INTO banco_talentos (id, nome, email, telefone, curriculo_url, area_interesse, criado_em) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 77777-7777', 'https://storage.googleapis.com/curriculos/pedro-oliveira.pdf', 'Desenvolvimento Mobile', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Ana Costa', 'ana.costa@email.com', '(11) 66666-6666', 'https://storage.googleapis.com/curriculos/ana-costa.pdf', 'UX/UI Design', NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir contatos
INSERT INTO contatos (id, nome, email, empresa, mensagem, criado_em) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Carlos Mendes', 'carlos.mendes@empresa.com', 'Mendes Consultoria', 'Gostaria de saber mais sobre os serviços de recrutamento', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Fernanda Lima', 'fernanda.lima@startup.com', 'StartupXYZ', 'Precisamos de ajuda para contratar desenvolvedores', NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir serviços
INSERT INTO servicos (id, empresa_id, candidato_id, tipo_servico, descricao, valor, status, data_inicio, data_fim, observacoes, criado_em) VALUES
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', NULL, 'recrutamento', 'Recrutamento de 5 desenvolvedores full-stack', 'R$ 25.000,00', 'em_andamento', NOW(), NOW() + INTERVAL '30 days', 'Projeto em andamento com bons resultados', NOW()),
('550e8400-e29b-41d4-a716-446655440014', NULL, '550e8400-e29b-41d4-a716-446655440001', 'consultoria_rh', 'Consultoria de carreira e desenvolvimento profissional', 'R$ 2.500,00', 'pendente', NULL, NULL, 'Aguardando confirmação do candidato', NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir propostas
INSERT INTO propostas (id, empresa_id, tipo_servico, descricao, valor_proposto, prazo_entrega, observacoes, aprovada, criado_em) VALUES
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440003', 'treinamento', 'Treinamento em metodologias ágeis para equipe de desenvolvimento', 'R$ 15.000,00', '30 dias', 'Proposta personalizada para a equipe', 'pendente', NOW()),
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440003', 'avaliacao', 'Avaliação DISC para equipe de liderança', 'R$ 8.000,00', '15 dias', 'Avaliação completa com relatório detalhado', 'sim', NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir relatórios
INSERT INTO relatorios (id, tipo, periodo, total_candidatos, total_empresas, total_vagas, total_servicos, faturamento, criado_em) VALUES
('550e8400-e29b-41d4-a716-446655440017', 'mensal', 'Janeiro 2024', '150', '25', '45', '12', 'R$ 85.000,00', NOW()),
('550e8400-e29b-41d4-a716-446655440018', 'trimestral', 'Q1 2024', '450', '75', '120', '35', 'R$ 250.000,00', NOW())
ON CONFLICT (id) DO NOTHING;

-- Verificar dados inseridos
SELECT 'Dados de exemplo inseridos com sucesso!' as status; 