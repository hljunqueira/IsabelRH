-- Script corrigido para configurar o banco IsabelRH no Supabase
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipo de usuário
CREATE TYPE tipo_usuario AS ENUM ('candidato', 'empresa', 'admin');

-- Enum para status de consultoria
CREATE TYPE status_consultoria AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada');

-- Enum para tipo de serviço
CREATE TYPE tipo_servico AS ENUM ('recrutamento', 'selecao', 'consultoria_rh', 'treinamento', 'avaliacao');

-- Enum para tipo DISC
CREATE TYPE tipo_disc AS ENUM ('dominante', 'influente', 'estavel', 'conscencioso');

-- Enum para prioridade
CREATE TYPE prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- Tabela de usuários (campo senha opcional - gerenciado pelo Supabase Auth)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255), -- Campo opcional, gerenciado pelo Supabase Auth
    tipo tipo_usuario NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de candidatos (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS candidatos (
    id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    celular VARCHAR(20),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio VARCHAR(255),
    endereco VARCHAR(500),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    data_nascimento VARCHAR(10),
    estado_civil VARCHAR(50),
    genero VARCHAR(50),
    pcd VARCHAR(10) DEFAULT 'não',
    nivel_escolaridade VARCHAR(100),
    curso VARCHAR(255),
    instituicao VARCHAR(255),
    ano_formacao VARCHAR(4),
    idiomas TEXT[],
    habilidades TEXT[],
    experiencias TEXT,
    certificacoes TEXT,
    objetivo_profissional TEXT,
    pretensao_salarial VARCHAR(50),
    disponibilidade VARCHAR(100),
    modalidade_trabalho VARCHAR(100),
    curriculo_url VARCHAR(500),
    areas_interesse TEXT[],
    foto_perfil VARCHAR(500),
    -- Teste DISC
    perfil_disc tipo_disc,
    pontuacao_d INTEGER DEFAULT 0,
    pontuacao_i INTEGER DEFAULT 0,
    pontuacao_s INTEGER DEFAULT 0,
    pontuacao_c INTEGER DEFAULT 0,
    data_teste_disc TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de empresas (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    razao_social VARCHAR(255),
    nome_fantasia VARCHAR(255),
    inscricao_estadual VARCHAR(50),
    setor VARCHAR(100),
    porte VARCHAR(50),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    website VARCHAR(255),
    linkedin VARCHAR(255),
    endereco VARCHAR(500),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    descricao TEXT,
    missao TEXT,
    visao TEXT,
    valores TEXT,
    beneficios TEXT[],
    cultura TEXT,
    numero_funcionarios VARCHAR(50),
    ano_fundacao VARCHAR(4),
    contato VARCHAR(255),
    cargo_contato VARCHAR(100),
    logo_empresa VARCHAR(500),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de vagas (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS vagas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    requisitos TEXT,
    area VARCHAR(100),
    nivel VARCHAR(50),
    tipo_contrato VARCHAR(50),
    modalidade VARCHAR(50),
    salario VARCHAR(100),
    beneficios TEXT[],
    cidade VARCHAR(100),
    estado VARCHAR(50),
    carga_horaria VARCHAR(50),
    responsabilidades TEXT,
    diferenciais TEXT,
    status VARCHAR(20) DEFAULT 'ativa',
    data_encerramento TIMESTAMP WITH TIME ZONE,
    publicado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de candidaturas (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS candidaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE NOT NULL,
    candidato_id UUID REFERENCES candidatos(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'candidatado',
    etapa VARCHAR(100) DEFAULT 'Análise de currículo',
    observacoes TEXT,
    pontuacao INTEGER,
    data_triagem TIMESTAMP WITH TIME ZONE,
    data_entrevista TIMESTAMP WITH TIME ZONE,
    feedback_empresa TEXT,
    motivo_reprovacao TEXT,
    compatibilidade_disc INTEGER,
    compatibilidade_skills INTEGER,
    compatibilidade_localizacao BOOLEAN DEFAULT TRUE,
    prioridade prioridade DEFAULT 'media',
    tags_filtros TEXT[],
    data_candidatura TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de banco de talentos (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS banco_talentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    curriculo_url VARCHAR(500),
    area_interesse VARCHAR(255),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de contatos (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS contatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de serviços (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE SET NULL,
    candidato_id UUID REFERENCES candidatos(id) ON DELETE SET NULL,
    tipo_servico tipo_servico NOT NULL,
    descricao TEXT NOT NULL,
    valor VARCHAR(50),
    status status_consultoria NOT NULL DEFAULT 'pendente',
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_fim TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de propostas (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS propostas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE NOT NULL,
    tipo_servico tipo_servico NOT NULL,
    descricao TEXT NOT NULL,
    valor_proposto VARCHAR(50) NOT NULL,
    prazo_entrega VARCHAR(100),
    observacoes TEXT,
    aprovada VARCHAR(10),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de relatórios (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS relatorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    total_candidatos VARCHAR(20),
    total_empresas VARCHAR(20),
    total_vagas VARCHAR(20),
    total_servicos VARCHAR(20),
    faturamento VARCHAR(50),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de testes DISC (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS testes_disc (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidato_id UUID REFERENCES candidatos(id) ON DELETE CASCADE NOT NULL,
    respostas TEXT[] NOT NULL,
    pontuacao_d INTEGER NOT NULL,
    pontuacao_i INTEGER NOT NULL,
    pontuacao_s INTEGER NOT NULL,
    pontuacao_c INTEGER NOT NULL,
    perfil_dominante tipo_disc NOT NULL,
    descricao_perfil TEXT,
    pontos_fortes TEXT[],
    areas_desenvolvimento TEXT[],
    estilo_trabalho TEXT,
    estilo_lideranca TEXT,
    estilo_comunicacao TEXT,
    data_realizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de filtros salvos (exatamente como definido no schema)
CREATE TABLE IF NOT EXISTS filtros_salvos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    criterios JSONB NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);

CREATE INDEX IF NOT EXISTS idx_candidatos_cidade ON candidatos(cidade);
CREATE INDEX IF NOT EXISTS idx_candidatos_estado ON candidatos(estado);
CREATE INDEX IF NOT EXISTS idx_candidatos_habilidades ON candidatos USING GIN(habilidades);
CREATE INDEX IF NOT EXISTS idx_candidatos_areas_interesse ON candidatos USING GIN(areas_interesse);

CREATE INDEX IF NOT EXISTS idx_empresas_setor ON empresas(setor);
CREATE INDEX IF NOT EXISTS idx_empresas_cidade ON empresas(cidade);

CREATE INDEX IF NOT EXISTS idx_vagas_empresa_id ON vagas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_vagas_status ON vagas(status);
CREATE INDEX IF NOT EXISTS idx_vagas_cidade ON vagas(cidade);
CREATE INDEX IF NOT EXISTS idx_vagas_area ON vagas(area);

CREATE INDEX IF NOT EXISTS idx_candidaturas_vaga_id ON candidaturas(vaga_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_candidato_id ON candidaturas(candidato_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON candidaturas(status);

CREATE INDEX IF NOT EXISTS idx_servicos_empresa_id ON servicos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_servicos_status ON servicos(status);

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE testes_disc ENABLE ROW LEVEL SECURITY;
ALTER TABLE filtros_salvos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (você pode ajustar conforme necessário)
CREATE POLICY "Usuários podem ver seus próprios dados" ON usuarios
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Candidatos podem ver seus próprios dados" ON candidatos
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Empresas podem ver seus próprios dados" ON empresas
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Vagas são visíveis para todos" ON vagas
    FOR SELECT USING (true);

CREATE POLICY "Empresas podem gerenciar suas vagas" ON vagas
    FOR ALL USING (auth.uid() = empresa_id);

-- Função para criar usuário automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, tipo)
    VALUES (new.id, new.email, 'candidato');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Comentários para documentação
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema - integrada com Supabase Auth';
COMMENT ON TABLE candidatos IS 'Perfis detalhados dos candidatos';
COMMENT ON TABLE empresas IS 'Perfis detalhados das empresas';
COMMENT ON TABLE vagas IS 'Vagas publicadas pelas empresas';
COMMENT ON TABLE candidaturas IS 'Candidaturas dos candidatos às vagas';
COMMENT ON TABLE servicos IS 'Serviços de consultoria oferecidos';
COMMENT ON TABLE testes_disc IS 'Resultados dos testes DISC dos candidatos';

-- Verificar se as tabelas foram criadas
SELECT 'Tabelas criadas com sucesso!' as status; 