-- Script corrigido para criar usuários de exemplo
-- Execute este script no SQL Editor do Supabase APÓS executar o script principal

-- Inserir usuários de exemplo na tabela usuarios
INSERT INTO usuarios (id, email, tipo) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@isabelrh.com', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'candidato@exemplo.com', 'candidato'),
('550e8400-e29b-41d4-a716-446655440003', 'empresa@exemplo.com', 'empresa'),
('550e8400-e29b-41d4-a716-446655440004', 'joao.silva@email.com', 'candidato'),
('550e8400-e29b-41d4-a716-446655440005', 'maria.tech@email.com', 'candidato'),
('550e8400-e29b-41d4-a716-446655440006', 'techcorp@empresa.com', 'empresa'),
('550e8400-e29b-41d4-a716-446655440007', 'inovacao@startup.com', 'empresa')
ON CONFLICT (id) DO NOTHING;

-- Inserir candidatos de exemplo (com campos corretos)
INSERT INTO candidatos (id, nome, telefone, celular, linkedin, github, cidade, estado, nivel_escolaridade, curso, instituicao, ano_formacao, habilidades, areas_interesse, objetivo_profissional, pretensao_salarial, disponibilidade, modalidade_trabalho) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Candidato Exemplo', '(11) 99999-9999', '(11) 99999-9999', 'linkedin.com/in/candidato', 'github.com/candidato', 'São Paulo', 'SP', 'Superior Completo', 'Ciência da Computação', 'USP', '2022', ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript'], ARRAY['Desenvolvimento Web', 'Frontend', 'Full Stack'], 'Desenvolver soluções inovadoras e crescer profissionalmente', 'R$ 5.000 - R$ 8.000', 'Imediata', 'Híbrido'),
('550e8400-e29b-41d4-a716-446655440004', 'João Silva', '(11) 88888-8888', '(11) 88888-8888', 'linkedin.com/in/joaosilva', 'github.com/joaosilva', 'Rio de Janeiro', 'RJ', 'Superior Completo', 'Engenharia de Software', 'UFRJ', '2021', ARRAY['Python', 'Django', 'PostgreSQL', 'Docker'], ARRAY['Backend', 'DevOps', 'Python'], 'Trabalhar com tecnologias modernas e aprender constantemente', 'R$ 6.000 - R$ 9.000', 'Imediata', 'Remoto'),
('550e8400-e29b-41d4-a716-446655440005', 'Maria Tech', '(11) 77777-7777', '(11) 77777-7777', 'linkedin.com/in/mariatech', 'github.com/mariatech', 'Belo Horizonte', 'MG', 'Superior Completo', 'Sistemas de Informação', 'UFMG', '2023', ARRAY['Java', 'Spring Boot', 'React', 'AWS'], ARRAY['Full Stack', 'Java', 'Cloud'], 'Desenvolver aplicações escaláveis e de alta qualidade', 'R$ 7.000 - R$ 10.000', 'Imediata', 'Presencial')
ON CONFLICT (id) DO NOTHING;

-- Inserir empresas de exemplo (com campos corretos)
INSERT INTO empresas (id, nome, cnpj, setor, porte, telefone, website, linkedin, cidade, estado, descricao, numero_funcionarios, ano_fundacao, contato, cargo_contato) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Empresa Exemplo Ltda', '12.345.678/0001-90', 'Tecnologia', 'Médio', '(11) 33333-3333', 'www.empresaexemplo.com', 'linkedin.com/company/empresaexemplo', 'São Paulo', 'SP', 'Empresa de tecnologia focada em inovação e desenvolvimento de software', '50-100', '2018', 'contato@empresaexemplo.com', 'Recursos Humanos'),
('550e8400-e29b-41d4-a716-446655440006', 'TechCorp Solutions', '98.765.432/0001-10', 'Tecnologia', 'Grande', '(11) 22222-2222', 'www.techcorp.com', 'linkedin.com/company/techcorp', 'São Paulo', 'SP', 'Empresa líder em soluções tecnológicas para grandes corporações', '200-500', '2015', 'rh@techcorp.com', 'Gerente de RH'),
('550e8400-e29b-41d4-a716-446655440007', 'Inovação Startup', '11.222.333/0001-44', 'Tecnologia', 'Pequeno', '(11) 11111-1111', 'www.inovacaostartup.com', 'linkedin.com/company/inovacaostartup', 'São Paulo', 'SP', 'Startup inovadora focada em soluções disruptivas', '10-50', '2020', 'contato@inovacaostartup.com', 'CEO')
ON CONFLICT (id) DO NOTHING;

-- Inserir vagas de exemplo (com campos corretos)
INSERT INTO vagas (empresa_id, titulo, descricao, requisitos, area, nivel, tipo_contrato, modalidade, salario, beneficios, cidade, estado, carga_horaria, responsabilidades, diferenciais) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'Desenvolvedor Full Stack Senior', 'Estamos procurando um desenvolvedor Full Stack Senior para se juntar ao nosso time de tecnologia.', 'Experiência com React, Node.js, TypeScript, PostgreSQL. 5+ anos de experiência.', 'Desenvolvimento', 'Senior', 'CLT', 'Híbrido', 'R$ 8.000 - R$ 12.000', ARRAY['Plano de saúde', 'Vale refeição', 'Gympass', 'PLR'], 'São Paulo', 'SP', '40h semanais', 'Desenvolver aplicações web, participar de code reviews, mentorar desenvolvedores júnior', 'Trabalho com tecnologias modernas, ambiente colaborativo'),
('550e8400-e29b-41d4-a716-446655440007', 'Desenvolvedor Backend Python', 'Vaga para desenvolvedor Python para trabalhar em projetos inovadores.', 'Experiência com Python, Django, PostgreSQL, Docker. 3+ anos de experiência.', 'Desenvolvimento', 'Pleno', 'PJ', 'Remoto', 'R$ 6.000 - R$ 9.000', ARRAY['Horário flexível', 'Home office', 'Participação nos lucros'], 'Remoto', 'Remoto', '40h semanais', 'Desenvolver APIs, trabalhar com microsserviços, participar de arquitetura', 'Startup em crescimento, tecnologias modernas'),
('550e8400-e29b-41d4-a716-446655440006', 'Desenvolvedor Frontend React', 'Vaga para desenvolvedor Frontend especializado em React.', 'Experiência com React, TypeScript, CSS, Git. 2+ anos de experiência.', 'Desenvolvimento', 'Júnior', 'CLT', 'Presencial', 'R$ 4.000 - R$ 6.000', ARRAY['Plano de saúde', 'Vale refeição', 'Capacitação'], 'São Paulo', 'SP', '40h semanais', 'Desenvolver interfaces de usuário, trabalhar com design system', 'Aprendizado constante, ambiente jovem');

-- Inserir candidaturas de exemplo
INSERT INTO candidaturas (vaga_id, candidato_id, status, pontuacao, compatibilidade_skills, compatibilidade_disc) VALUES
((SELECT id FROM vagas WHERE titulo = 'Desenvolvedor Full Stack Senior' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 'em_analise', 85, 90, 75),
((SELECT id FROM vagas WHERE titulo = 'Desenvolvedor Backend Python' LIMIT 1), '550e8400-e29b-41d4-a716-446655440004', 'candidatado', 92, 95, 80),
((SELECT id FROM vagas WHERE titulo = 'Desenvolvedor Frontend React' LIMIT 1), '550e8400-e29b-41d4-a716-446655440005', 'aprovada', 88, 85, 70);

-- Inserir serviços de exemplo
INSERT INTO servicos (empresa_id, tipo_servico, descricao, valor, status, observacoes) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'recrutamento', 'Recrutamento de 5 desenvolvedores Full Stack para projeto de 6 meses', 'R$ 25.000', 'em_andamento', 'Projeto em andamento, 3 candidatos já contratados'),
('550e8400-e29b-41d4-a716-446655440007', 'consultoria_rh', 'Consultoria para implementação de políticas de home office', 'R$ 15.000', 'pendente', 'Aguardando aprovação da diretoria');

-- Inserir relatórios de exemplo
INSERT INTO relatorios (tipo, periodo, total_candidatos, total_empresas, total_vagas, total_servicos, faturamento) VALUES
('mensal', 'Janeiro 2024', '150', '25', '45', '12', 'R$ 180.000'),
('trimestral', 'Q4 2023', '420', '68', '120', '35', 'R$ 520.000');

-- Verificar se os dados foram inseridos
SELECT 'Usuários criados:' as info, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Candidatos criados:', COUNT(*) FROM candidatos
UNION ALL
SELECT 'Empresas criadas:', COUNT(*) FROM empresas
UNION ALL
SELECT 'Vagas criadas:', COUNT(*) FROM vagas
UNION ALL
SELECT 'Candidaturas criadas:', COUNT(*) FROM candidaturas
UNION ALL
SELECT 'Serviços criados:', COUNT(*) FROM servicos
UNION ALL
SELECT 'Relatórios criados:', COUNT(*) FROM relatorios; 