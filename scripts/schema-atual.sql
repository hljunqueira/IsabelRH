-- Script para criar as tabelas conforme o schema atual do projeto
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar enums
DO $$ BEGIN
    CREATE TYPE tipo_usuario AS ENUM ('candidato', 'empresa', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_consultoria AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_servico AS ENUM ('recrutamento', 'selecao', 'consultoria_rh', 'treinamento', 'avaliacao');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_disc AS ENUM ('dominante', 'influente', 'estavel', 'conscencioso');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255),
    tipo tipo_usuario NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de candidatos
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
    perfil_disc tipo_disc,
    pontuacao_d INTEGER DEFAULT 0,
    pontuacao_i INTEGER DEFAULT 0,
    pontuacao_s INTEGER DEFAULT 0,
    pontuacao_c INTEGER DEFAULT 0,
    data_teste_disc TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de empresas
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

-- Tabela de vagas
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

-- Tabela de candidaturas
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

-- Tabela de banco de talentos
CREATE TABLE IF NOT EXISTS banco_talentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    curriculo_url VARCHAR(500),
    area_interesse VARCHAR(255),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    candidato_id UUID REFERENCES candidatos(id),
    tipo_servico tipo_servico NOT NULL,
    descricao TEXT NOT NULL,
    valor VARCHAR(50),
    status status_consultoria NOT NULL DEFAULT 'pendente',
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_fim TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de propostas
CREATE TABLE IF NOT EXISTS propostas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) NOT NULL,
    tipo_servico tipo_servico NOT NULL,
    descricao TEXT NOT NULL,
    valor_proposto VARCHAR(50) NOT NULL,
    prazo_entrega VARCHAR(100),
    observacoes TEXT,
    aprovada TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de relatórios
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

-- Verificar se as tabelas foram criadas
SELECT 'Schema atual criado com sucesso!' as status; 