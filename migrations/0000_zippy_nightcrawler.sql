CREATE TYPE "public"."prioridade" AS ENUM('baixa', 'media', 'alta', 'urgente');--> statement-breakpoint
CREATE TYPE "public"."status_consultoria" AS ENUM('pendente', 'em_andamento', 'concluida', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."tipo_disc" AS ENUM('dominante', 'influente', 'estavel', 'conscencioso');--> statement-breakpoint
CREATE TYPE "public"."tipo_servico" AS ENUM('recrutamento', 'selecao', 'consultoria_rh', 'treinamento', 'avaliacao');--> statement-breakpoint
CREATE TYPE "public"."tipo_usuario" AS ENUM('candidato', 'empresa', 'admin');--> statement-breakpoint
CREATE TABLE "banco_talentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefone" varchar(20),
	"curriculo_url" varchar(500),
	"area_interesse" varchar(255),
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidatos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"telefone" varchar(20),
	"celular" varchar(20),
	"linkedin" varchar(255),
	"github" varchar(255),
	"portfolio" varchar(255),
	"endereco" varchar(500),
	"cidade" varchar(100),
	"estado" varchar(50),
	"cep" varchar(10),
	"data_nascimento" varchar(10),
	"estado_civil" varchar(50),
	"genero" varchar(50),
	"pcd" varchar(10) DEFAULT 'não',
	"nivel_escolaridade" varchar(100),
	"curso" varchar(255),
	"instituicao" varchar(255),
	"ano_formacao" varchar(4),
	"idiomas" text[],
	"habilidades" text[],
	"experiencias" text,
	"certificacoes" text,
	"objetivo_profissional" text,
	"pretensao_salarial" varchar(50),
	"disponibilidade" varchar(100),
	"modalidade_trabalho" varchar(100),
	"curriculo_url" varchar(500),
	"areas_interesse" text[],
	"foto_perfil" varchar(500),
	"perfil_disc" "tipo_disc",
	"pontuacao_d" integer DEFAULT 0,
	"pontuacao_i" integer DEFAULT 0,
	"pontuacao_s" integer DEFAULT 0,
	"pontuacao_c" integer DEFAULT 0,
	"data_teste_disc" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidaturas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vaga_id" uuid NOT NULL,
	"candidato_id" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'candidatado',
	"etapa" varchar(100) DEFAULT 'Análise de currículo',
	"observacoes" text,
	"pontuacao" integer,
	"data_triagem" timestamp,
	"data_entrevista" timestamp,
	"feedback_empresa" text,
	"motivo_reprovacao" text,
	"compatibilidade_disc" integer,
	"compatibilidade_skills" integer,
	"compatibilidade_localizacao" boolean DEFAULT true,
	"prioridade" "prioridade" DEFAULT 'media',
	"tags_filtros" text[],
	"data_candidatura" timestamp DEFAULT now() NOT NULL,
	"ultima_atualizacao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contatos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"empresa" varchar(255),
	"mensagem" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresas" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cnpj" varchar(18),
	"razao_social" varchar(255),
	"nome_fantasia" varchar(255),
	"inscricao_estadual" varchar(50),
	"setor" varchar(100),
	"porte" varchar(50),
	"telefone" varchar(20),
	"celular" varchar(20),
	"website" varchar(255),
	"linkedin" varchar(255),
	"endereco" varchar(500),
	"cidade" varchar(100),
	"estado" varchar(50),
	"cep" varchar(10),
	"descricao" text,
	"missao" text,
	"visao" text,
	"valores" text,
	"beneficios" text[],
	"cultura" text,
	"numero_funcionarios" varchar(50),
	"ano_fundacao" varchar(4),
	"contato" varchar(255),
	"cargo_contato" varchar(100),
	"logo_empresa" varchar(500),
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "filtros_salvos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"criterios" text NOT NULL,
	"ativo" boolean DEFAULT true,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "propostas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"tipo_servico" "tipo_servico" NOT NULL,
	"descricao" text NOT NULL,
	"valor_proposto" varchar(50) NOT NULL,
	"prazo_entrega" varchar(100),
	"observacoes" text,
	"aprovada" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relatorios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo" varchar(100) NOT NULL,
	"periodo" varchar(50) NOT NULL,
	"total_candidatos" varchar(20),
	"total_empresas" varchar(20),
	"total_vagas" varchar(20),
	"total_servicos" varchar(20),
	"faturamento" varchar(50),
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid,
	"candidato_id" uuid,
	"tipo_servico" "tipo_servico" NOT NULL,
	"descricao" text NOT NULL,
	"valor" varchar(50),
	"status" "status_consultoria" DEFAULT 'pendente' NOT NULL,
	"data_inicio" timestamp,
	"data_fim" timestamp,
	"observacoes" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testes_disc" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidato_id" uuid NOT NULL,
	"respostas" text[] NOT NULL,
	"pontuacao_d" integer NOT NULL,
	"pontuacao_i" integer NOT NULL,
	"pontuacao_s" integer NOT NULL,
	"pontuacao_c" integer NOT NULL,
	"perfil_dominante" "tipo_disc" NOT NULL,
	"descricao_perfil" text,
	"pontos_fortes" text[],
	"areas_desenvolvimento" text[],
	"estilo_trabalho" text,
	"estilo_lideranca" text,
	"estilo_comunicacao" text,
	"data_realizacao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha" varchar(255) NOT NULL,
	"tipo" "tipo_usuario" NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vagas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"descricao" text NOT NULL,
	"requisitos" text,
	"area" varchar(100),
	"nivel" varchar(50),
	"tipo_contrato" varchar(50),
	"modalidade" varchar(50),
	"salario" varchar(100),
	"beneficios" text[],
	"cidade" varchar(100),
	"estado" varchar(50),
	"carga_horaria" varchar(50),
	"responsabilidades" text,
	"diferenciais" text,
	"status" varchar(20) DEFAULT 'ativa',
	"data_encerramento" timestamp,
	"publicado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_id_usuarios_id_fk" FOREIGN KEY ("id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidaturas" ADD CONSTRAINT "candidaturas_vaga_id_vagas_id_fk" FOREIGN KEY ("vaga_id") REFERENCES "public"."vagas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidaturas" ADD CONSTRAINT "candidaturas_candidato_id_candidatos_id_fk" FOREIGN KEY ("candidato_id") REFERENCES "public"."candidatos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_usuarios_id_fk" FOREIGN KEY ("id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "filtros_salvos" ADD CONSTRAINT "filtros_salvos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_candidato_id_candidatos_id_fk" FOREIGN KEY ("candidato_id") REFERENCES "public"."candidatos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testes_disc" ADD CONSTRAINT "testes_disc_candidato_id_candidatos_id_fk" FOREIGN KEY ("candidato_id") REFERENCES "public"."candidatos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;