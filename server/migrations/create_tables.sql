-- Script de criação das tabelas para o IsabelRH
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('candidato', 'empresa', 'admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de candidatos
CREATE TABLE IF NOT EXISTS candidatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    localizacao VARCHAR(255),
    experiencia INTEGER DEFAULT 0,
    educacao TEXT,
    habilidades TEXT[],
    resumo TEXT,
    expectativa_salarial DECIMAL(10,2),
    disponibilidade VARCHAR(50),
    modalidade VARCHAR(20) CHECK (modalidade IN ('presencial', 'hibrido', 'remoto')),
    tipo_contrato VARCHAR(20) CHECK (tipo_contrato IN ('clt', 'pj', 'freelance')),
    setores TEXT[],
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio VARCHAR(255),
    curriculo_url VARCHAR(500),
    score INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('disponivel', 'empregado', 'em_processo')) DEFAULT 'disponivel',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cnpj VARCHAR(18) UNIQUE,
    setor VARCHAR(100),
    tamanho VARCHAR(50),
    localizacao VARCHAR(255),
    website VARCHAR(255),
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vagas
CREATE TABLE IF NOT EXISTS vagas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    requisitos TEXT[],
    beneficios TEXT[],
    salario_min DECIMAL(10,2),
    salario_max DECIMAL(10,2),
    modalidade VARCHAR(20) CHECK (modalidade IN ('presencial', 'hibrido', 'remoto')),
    tipo_contrato VARCHAR(20) CHECK (tipo_contrato IN ('clt', 'pj', 'freelance')),
    localizacao VARCHAR(255),
    experiencia INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('ativa', 'pausada', 'fechada')) DEFAULT 'ativa',
    candidatos_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de candidaturas
CREATE TABLE IF NOT EXISTS candidaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE,
    candidato_id UUID REFERENCES candidatos(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pendente', 'em_analise', 'aprovada', 'rejeitada', 'contratada')) DEFAULT 'pendente',
    score INTEGER DEFAULT 0,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vaga_id, candidato_id)
);

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(20) CHECK (tipo IN ('individual', 'grupo')) DEFAULT 'individual',
    titulo VARCHAR(255),
    participantes UUID[] NOT NULL,
    ultima_mensagem TEXT,
    ultima_mensagem_timestamp TIMESTAMP WITH TIME ZONE,
    nao_lidas INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversa_id UUID REFERENCES conversas(id) ON DELETE CASCADE,
    remetente_id UUID NOT NULL,
    remetente_tipo VARCHAR(20) CHECK (remetente_tipo IN ('candidato', 'empresa', 'admin')),
    texto TEXT NOT NULL,
    anexos TEXT[],
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(20) CHECK (tipo IN ('mensagem', 'vaga', 'candidatura', 'sistema')),
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    acao_tipo VARCHAR(50),
    acao_dados JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de arquivos processados (parsing)
CREATE TABLE IF NOT EXISTS arquivos_processados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    tamanho INTEGER,
    url VARCHAR(500),
    dados_extraidos JSONB,
    status VARCHAR(20) CHECK (status IN ('pendente', 'processando', 'concluido', 'erro')) DEFAULT 'pendente',
    erro TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de rankings
CREATE TABLE IF NOT EXISTS rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE,
    candidato_id UUID REFERENCES candidatos(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    match_percentage DECIMAL(5,2),
    criterios JSONB,
    posicao INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vaga_id, candidato_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_candidatos_user_id ON candidatos(user_id);
CREATE INDEX IF NOT EXISTS idx_candidatos_status ON candidatos(status);
CREATE INDEX IF NOT EXISTS idx_candidatos_localizacao ON candidatos(localizacao);
CREATE INDEX IF NOT EXISTS idx_candidatos_habilidades ON candidatos USING GIN(habilidades);

CREATE INDEX IF NOT EXISTS idx_empresas_user_id ON empresas(user_id);
CREATE INDEX IF NOT EXISTS idx_empresas_setor ON empresas(setor);

CREATE INDEX IF NOT EXISTS idx_vagas_empresa_id ON vagas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_vagas_status ON vagas(status);
CREATE INDEX IF NOT EXISTS idx_vagas_localizacao ON vagas(localizacao);
CREATE INDEX IF NOT EXISTS idx_vagas_modalidade ON vagas(modalidade);

CREATE INDEX IF NOT EXISTS idx_candidaturas_vaga_id ON candidaturas(vaga_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_candidato_id ON candidaturas(candidato_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON candidaturas(status);

CREATE INDEX IF NOT EXISTS idx_mensagens_conversa_id ON mensagens(conversa_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_created_at ON mensagens(created_at);

CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created_at ON notificacoes(created_at);

CREATE INDEX IF NOT EXISTS idx_rankings_vaga_id ON rankings(vaga_id);
CREATE INDEX IF NOT EXISTS idx_rankings_score ON rankings(score DESC);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidatos_updated_at BEFORE UPDATE ON candidatos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vagas_updated_at BEFORE UPDATE ON vagas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidaturas_updated_at BEFORE UPDATE ON candidaturas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversas_updated_at BEFORE UPDATE ON conversas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_arquivos_processados_updated_at BEFORE UPDATE ON arquivos_processados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular score de candidato
CREATE OR REPLACE FUNCTION calcular_score_candidato(
    p_habilidades_vaga TEXT[],
    p_habilidades_candidato TEXT[],
    p_experiencia_vaga INTEGER,
    p_experiencia_candidato INTEGER,
    p_localizacao_vaga TEXT,
    p_localizacao_candidato TEXT
) RETURNS INTEGER AS $$
DECLARE
    score_habilidades INTEGER := 0;
    score_experiencia INTEGER := 0;
    score_localizacao INTEGER := 0;
    habilidade TEXT;
BEGIN
    -- Score por habilidades (40% do total)
    IF p_habilidades_candidato IS NOT NULL AND p_habilidades_vaga IS NOT NULL THEN
        FOREACH habilidade IN ARRAY p_habilidades_vaga
        LOOP
            IF habilidade = ANY(p_habilidades_candidato) THEN
                score_habilidades := score_habilidades + 1;
            END IF;
        END LOOP;
        score_habilidades := (score_habilidades * 100) / array_length(p_habilidades_vaga, 1);
    END IF;
    
    -- Score por experiência (30% do total)
    IF p_experiencia_candidato >= p_experiencia_vaga THEN
        score_experiencia := 100;
    ELSIF p_experiencia_candidato >= (p_experiencia_vaga * 0.7) THEN
        score_experiencia := 80;
    ELSIF p_experiencia_candidato >= (p_experiencia_vaga * 0.5) THEN
        score_experiencia := 60;
    ELSE
        score_experiencia := 40;
    END IF;
    
    -- Score por localização (30% do total)
    IF p_localizacao_candidato ILIKE '%' || p_localizacao_vaga || '%' OR 
       p_localizacao_vaga ILIKE '%' || p_localizacao_candidato || '%' THEN
        score_localizacao := 100;
    ELSE
        score_localizacao := 50;
    END IF;
    
    -- Score final ponderado
    RETURN (score_habilidades * 0.4 + score_experiencia * 0.3 + score_localizacao * 0.3)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo
INSERT INTO users (email, name, type) VALUES
('admin@isabelrh.com', 'Administrador', 'admin'),
('empresa@techcorp.com', 'TechCorp', 'empresa'),
('candidato@joao.com', 'João Silva', 'candidato')
ON CONFLICT (email) DO NOTHING;

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivos_processados ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (serão expandidas conforme necessário)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Candidatos can view their own data" ON candidatos FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Candidatos can update their own data" ON candidatos FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Empresas can view their own data" ON empresas FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Empresas can update their own data" ON empresas FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Política para vagas públicas
CREATE POLICY "Vagas are viewable by all" ON vagas FOR SELECT USING (status = 'ativa');
CREATE POLICY "Empresas can manage their own vagas" ON vagas FOR ALL USING (empresa_id IN (SELECT id FROM empresas WHERE user_id::text = auth.uid()::text)); 