-- Script simples para criar as tabelas essenciais
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipo de usuário
DO $$ BEGIN
    CREATE TYPE tipo_usuario AS ENUM ('candidato', 'empresa', 'admin');
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

-- Tabela de candidatos (estrutura básica)
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
    perfil_disc VARCHAR(50),
    pontuacao_d INTEGER DEFAULT 0,
    pontuacao_i INTEGER DEFAULT 0,
    pontuacao_s INTEGER DEFAULT 0,
    pontuacao_c INTEGER DEFAULT 0,
    data_teste_disc TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de empresas (estrutura básica)
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

-- Tabela de vagas (estrutura básica)
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

-- Tabela de candidaturas (estrutura básica)
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
    prioridade VARCHAR(20) DEFAULT 'media',
    tags_filtros TEXT[],
    data_candidatura TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Verificar se as tabelas foram criadas
SELECT 'Tabelas criadas com sucesso!' as status;

-- Verificar estrutura da tabela candidatos
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'candidatos'
ORDER BY ordinal_position; 