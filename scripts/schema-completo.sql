-- =====================================================
-- SCRIPT SQL COMPLETO PARA ISABEL RH
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. CRIAR ENUMS
-- =====================================================
CREATE TYPE IF NOT EXISTS tipo_usuario AS ENUM ('candidato', 'empresa', 'admin');
CREATE TYPE IF NOT EXISTS status_consultoria AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada');
CREATE TYPE IF NOT EXISTS tipo_servico AS ENUM ('recrutamento', 'selecao', 'consultoria_rh', 'treinamento', 'avaliacao');
CREATE TYPE IF NOT EXISTS tipo_disc AS ENUM ('dominante', 'influente', 'estavel', 'conscencioso');
CREATE TYPE IF NOT EXISTS prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- 2. CRIAR TABELAS
-- =====================================================

-- Tabela de usuários (referencia auth.users)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email varchar(255) NOT NULL UNIQUE,
  senha varchar(255),
  tipo tipo_usuario NOT NULL,
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de candidatos
CREATE TABLE IF NOT EXISTS candidatos (
  id uuid PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  nome varchar(255) NOT NULL,
  telefone varchar(20),
  celular varchar(20),
  linkedin varchar(255),
  github varchar(255),
  portfolio varchar(255),
  endereco varchar(500),
  cidade varchar(100),
  estado varchar(50),
  cep varchar(10),
  data_nascimento varchar(10),
  estado_civil varchar(50),
  genero varchar(50),
  pcd varchar(10) DEFAULT 'não',
  nivel_escolaridade varchar(100),
  curso varchar(255),
  instituicao varchar(255),
  ano_formacao varchar(4),
  idiomas text[],
  habilidades text[],
  experiencias text,
  certificacoes text,
  objetivo_profissional text,
  pretensao_salarial varchar(50),
  disponibilidade varchar(100),
  modalidade_trabalho varchar(100),
  curriculo_url varchar(500),
  areas_interesse text[],
  foto_perfil varchar(500),
  perfil_disc tipo_disc,
  pontuacao_d integer DEFAULT 0,
  pontuacao_i integer DEFAULT 0,
  pontuacao_s integer DEFAULT 0,
  pontuacao_c integer DEFAULT 0,
  data_teste_disc timestamp,
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id uuid PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  nome varchar(255) NOT NULL,
  cnpj varchar(18),
  razao_social varchar(255),
  nome_fantasia varchar(255),
  inscricao_estadual varchar(50),
  setor varchar(100),
  porte varchar(50),
  telefone varchar(20),
  celular varchar(20),
  website varchar(255),
  linkedin varchar(255),
  endereco varchar(500),
  cidade varchar(100),
  estado varchar(50),
  cep varchar(10),
  descricao text,
  missao text,
  visao text,
  valores text,
  beneficios text[],
  cultura text,
  numero_funcionarios varchar(50),
  ano_fundacao varchar(4),
  contato varchar(255),
  cargo_contato varchar(100),
  logo_empresa varchar(500),
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de vagas
CREATE TABLE IF NOT EXISTS vagas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  titulo varchar(255) NOT NULL,
  descricao text NOT NULL,
  requisitos text,
  area varchar(100),
  nivel varchar(50),
  tipo_contrato varchar(50),
  modalidade varchar(50),
  salario varchar(100),
  beneficios text[],
  cidade varchar(100),
  estado varchar(50),
  carga_horaria varchar(50),
  responsabilidades text,
  diferenciais text,
  status varchar(20) DEFAULT 'ativa',
  data_encerramento timestamp,
  publicado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de candidaturas
CREATE TABLE IF NOT EXISTS candidaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id uuid NOT NULL REFERENCES vagas(id) ON DELETE CASCADE,
  candidato_id uuid NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  status varchar(50) DEFAULT 'candidatado',
  etapa varchar(100) DEFAULT 'Análise de currículo',
  observacoes text,
  pontuacao integer,
  data_triagem timestamp,
  data_entrevista timestamp,
  feedback_empresa text,
  motivo_reprovacao text,
  compatibilidade_disc integer,
  compatibilidade_skills integer,
  compatibilidade_localizacao boolean DEFAULT true,
  prioridade prioridade DEFAULT 'media',
  tags_filtros text[],
  data_candidatura timestamp DEFAULT now() NOT NULL,
  ultima_atualizacao timestamp DEFAULT now() NOT NULL
);

-- Tabela banco de talentos
CREATE TABLE IF NOT EXISTS banco_talentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  telefone varchar(20),
  curriculo_url varchar(500),
  area_interesse varchar(255),
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  empresa varchar(255),
  mensagem text NOT NULL,
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE SET NULL,
  candidato_id uuid REFERENCES candidatos(id) ON DELETE SET NULL,
  tipo_servico tipo_servico NOT NULL,
  descricao text NOT NULL,
  valor varchar(50),
  status status_consultoria NOT NULL DEFAULT 'pendente',
  data_inicio timestamp,
  data_fim timestamp,
  observacoes text,
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de propostas
CREATE TABLE IF NOT EXISTS propostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_servico tipo_servico NOT NULL,
  descricao text NOT NULL,
  valor_proposto varchar(50) NOT NULL,
  prazo_entrega varchar(100),
  observacoes text,
  aprovada text,
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de relatórios
CREATE TABLE IF NOT EXISTS relatorios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo varchar(100) NOT NULL,
  periodo varchar(50) NOT NULL,
  total_candidatos varchar(20),
  total_empresas varchar(20),
  total_vagas varchar(20),
  total_servicos varchar(20),
  faturamento varchar(50),
  criado_em timestamp DEFAULT now() NOT NULL
);

-- Tabela de testes DISC
CREATE TABLE IF NOT EXISTS testes_disc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id uuid NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  respostas text[] NOT NULL,
  pontuacao_d integer NOT NULL,
  pontuacao_i integer NOT NULL,
  pontuacao_s integer NOT NULL,
  pontuacao_c integer NOT NULL,
  perfil_dominante tipo_disc NOT NULL,
  descricao_perfil text,
  pontos_fortes text[],
  areas_desenvolvimento text[],
  estilo_trabalho text,
  estilo_lideranca text,
  estilo_comunicacao text,
  data_realizacao timestamp DEFAULT now() NOT NULL
);

-- Tabela de filtros salvos
CREATE TABLE IF NOT EXISTS filtros_salvos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome varchar(255) NOT NULL,
  criterios text NOT NULL,
  ativo boolean DEFAULT true,
  criado_em timestamp DEFAULT now() NOT NULL
);

-- 3. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_candidatos_cidade ON candidatos(cidade);
CREATE INDEX IF NOT EXISTS idx_candidatos_estado ON candidatos(estado);
CREATE INDEX IF NOT EXISTS idx_candidatos_areas_interesse ON candidatos USING GIN(areas_interesse);
CREATE INDEX IF NOT EXISTS idx_candidatos_habilidades ON candidatos USING GIN(habilidades);
CREATE INDEX IF NOT EXISTS idx_empresas_cidade ON empresas(cidade);
CREATE INDEX IF NOT EXISTS idx_empresas_setor ON empresas(setor);
CREATE INDEX IF NOT EXISTS idx_vagas_empresa_id ON vagas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_vagas_status ON vagas(status);
CREATE INDEX IF NOT EXISTS idx_vagas_cidade ON vagas(cidade);
CREATE INDEX IF NOT EXISTS idx_candidaturas_vaga_id ON candidaturas(vaga_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_candidato_id ON candidaturas(candidato_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON candidaturas(status);

-- 4. CRIAR POLÍTICAS RLS (Row Level Security)
-- =====================================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE testes_disc ENABLE ROW LEVEL SECURITY;
ALTER TABLE filtros_salvos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver seus próprios dados" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para candidatos
CREATE POLICY "Candidatos podem ver seus próprios dados" ON candidatos
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Candidatos podem atualizar seus próprios dados" ON candidatos
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para empresas
CREATE POLICY "Empresas podem ver seus próprios dados" ON empresas
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Empresas podem atualizar seus próprios dados" ON empresas
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para vagas (empresas podem ver suas vagas, candidatos podem ver vagas ativas)
CREATE POLICY "Empresas podem ver suas vagas" ON vagas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas 
      WHERE empresas.id = auth.uid() 
      AND empresas.id = vagas.empresa_id
    )
  );

CREATE POLICY "Candidatos podem ver vagas ativas" ON vagas
  FOR SELECT USING (status = 'ativa');

-- Políticas para candidaturas
CREATE POLICY "Candidatos podem ver suas candidaturas" ON candidaturas
  FOR SELECT USING (auth.uid() = candidato_id);

CREATE POLICY "Empresas podem ver candidaturas de suas vagas" ON candidaturas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vagas 
      JOIN empresas ON empresas.id = vagas.empresa_id
      WHERE empresas.id = auth.uid() 
      AND vagas.id = candidaturas.vaga_id
    )
  );

-- 5. CRIAR FUNÇÕES ÚTEIS
-- =====================================================

-- Função para calcular compatibilidade DISC
CREATE OR REPLACE FUNCTION calcular_compatibilidade_disc(
  candidato_d integer,
  candidato_i integer,
  candidato_s integer,
  candidato_c integer,
  vaga_d integer,
  vaga_i integer,
  vaga_s integer,
  vaga_c integer
) RETURNS integer AS $$
BEGIN
  -- Cálculo simples de compatibilidade baseado na diferença entre perfis
  RETURN 100 - (
    ABS(candidato_d - vaga_d) + 
    ABS(candidato_i - vaga_i) + 
    ABS(candidato_s - vaga_s) + 
    ABS(candidato_c - vaga_c)
  ) / 4;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar timestamp de última atualização
CREATE OR REPLACE FUNCTION atualizar_ultima_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ultima_atualizacao = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para candidaturas
CREATE TRIGGER trigger_atualizar_candidatura
  BEFORE UPDATE ON candidaturas
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_ultima_atualizacao();

-- 6. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Schema Isabel RH criado com sucesso!';
  RAISE NOTICE 'Tabelas criadas: usuarios, candidatos, empresas, vagas, candidaturas, banco_talentos, contatos, servicos, propostas, relatorios, testes_disc, filtros_salvos';
  RAISE NOTICE 'Enums criados: tipo_usuario, status_consultoria, tipo_servico, tipo_disc, prioridade';
  RAISE NOTICE 'Índices e políticas RLS configurados';
END $$; 