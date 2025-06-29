-- Script para criar tabelas do sistema Multi-Cliente
-- Execute este script no Supabase SQL Editor

-- 1. Tabela de planos
CREATE TABLE IF NOT EXISTS planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  usuarios INTEGER NOT NULL DEFAULT 0,
  vagas INTEGER NOT NULL DEFAULT 0,
  recursos JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  dominio VARCHAR(255) UNIQUE NOT NULL,
  plano_id UUID REFERENCES planos(id),
  plano VARCHAR(50) DEFAULT 'basico',
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
  usuarios INTEGER DEFAULT 0,
  limite_usuarios INTEGER DEFAULT 10,
  vagas_usadas INTEGER DEFAULT 0,
  limite_vagas INTEGER DEFAULT 50,
  valor_mensal DECIMAL(10,2) DEFAULT 500.00,
  faturamento VARCHAR(50) DEFAULT 'Mensal',
  admin_email VARCHAR(255),
  configuracoes JSONB DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de usuários dos clientes
CREATE TABLE IF NOT EXISTS usuarios_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  permissao VARCHAR(50) DEFAULT 'usuario' CHECK (permissao IN ('admin', 'usuario', 'viewer')),
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cliente_id, email)
);

-- 4. Tabela de campanhas hunting
CREATE TABLE IF NOT EXISTS campanhas_hunting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'encerrada')),
  total_encontrados INTEGER DEFAULT 0,
  total_contactados INTEGER DEFAULT 0,
  total_interessados INTEGER DEFAULT 0,
  total_contratados INTEGER DEFAULT 0,
  criterios JSONB DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de templates hunting
CREATE TABLE IF NOT EXISTS templates_hunting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL, -- 'email', 'linkedin', 'whatsapp'
  assunto VARCHAR(255),
  conteudo TEXT NOT NULL,
  variaveis JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de integrações hunting
CREATE TABLE IF NOT EXISTS integracoes_hunting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL, -- 'linkedin', 'github', 'email'
  configuracao JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  ultima_sincronizacao TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Inserir dados de exemplo

-- Planos padrão
INSERT INTO planos (nome, preco, usuarios, vagas, recursos) VALUES 
('Básico', 500.00, 5, 10, '["Gestão básica", "Suporte email", "1 usuário admin"]'),
('Premium', 2500.00, 20, 100, '["Gestão completa", "Suporte prioritário", "5 usuários admin", "Relatórios avançados", "API access"]'),
('Enterprise', 8900.00, 100, 1000, '["Gestão ilimitada", "Suporte 24/7", "Usuários ilimitados", "White label", "Custom integrations", "Dedicated manager"]')
ON CONFLICT (nome) DO NOTHING;

-- Clientes de exemplo
INSERT INTO clientes (nome, dominio, plano, status, usuarios, limite_usuarios, vagas_usadas, limite_vagas, valor_mensal, admin_email) VALUES 
('Tech Solutions', 'techsolutions.com', 'premium', 'ativo', 1, 20, 5, 100, 2500.00, 'admin@techsolutions.com'),
('StartupXYZ', 'startupxyz.com', 'basico', 'ativo', 1, 5, 2, 10, 500.00, 'admin@startupxyz.com')
ON CONFLICT (dominio) DO NOTHING;

-- Usuários de exemplo
INSERT INTO usuarios_clientes (cliente_id, nome, email, permissao, status) 
SELECT 
  c.id, 
  'Admin ' || c.nome, 
  c.admin_email, 
  'admin', 
  'ativo'
FROM clientes c 
WHERE c.admin_email IS NOT NULL
ON CONFLICT (cliente_id, email) DO NOTHING;

-- Campanhas hunting de exemplo
INSERT INTO campanhas_hunting (nome, descricao, status, total_contactados, total_interessados) VALUES 
('Busca Desenvolvedores Senior', 'Campanha para encontrar desenvolvedores senior', 'ativa', 15, 3),
('Hunting Analistas de Dados', 'Busca de profissionais em análise de dados', 'ativa', 22, 5),
('Especialistas em DevOps', 'Procura por especialistas em DevOps e Cloud', 'pausada', 8, 2)
ON CONFLICT DO NOTHING;

-- Templates hunting de exemplo
INSERT INTO templates_hunting (nome, tipo, assunto, conteudo, variaveis) VALUES 
('Primeiro Contato LinkedIn', 'linkedin', 'Oportunidade de carreira interessante', 'Olá {{nome}}, vi seu perfil e gostaria de conversar sobre uma oportunidade...', '["nome", "empresa", "cargo"]'),
('Follow-up Email', 'email', 'Sobre nossa conversa - {{empresa}}', 'Olá {{nome}}, dando sequência à nossa conversa...', '["nome", "empresa", "vaga"]'),
('Convite WhatsApp', 'whatsapp', '', 'Oi {{nome}}! Tenho uma oportunidade que pode te interessar...', '["nome", "cargo"]')
ON CONFLICT DO NOTHING;

-- Integrações hunting de exemplo
INSERT INTO integracoes_hunting (nome, tipo, configuracao, ativo) VALUES 
('LinkedIn Sales Navigator', 'linkedin', '{"api_key": "", "configurado": false}', false),
('GitHub Integration', 'github', '{"token": "", "configurado": false}', false),
('Email SMTP', 'email', '{"smtp_host": "", "smtp_port": 587, "configurado": false}', false)
ON CONFLICT DO NOTHING;

-- Comentários
COMMENT ON TABLE clientes IS 'Tabela de clientes do sistema multi-cliente';
COMMENT ON TABLE planos IS 'Planos de preços disponíveis';
COMMENT ON TABLE usuarios_clientes IS 'Usuários associados a cada cliente';
COMMENT ON TABLE campanhas_hunting IS 'Campanhas de busca ativa de talentos';
COMMENT ON TABLE templates_hunting IS 'Templates para comunicação em campanhas';
COMMENT ON TABLE integracoes_hunting IS 'Integrações com plataformas externas'; 