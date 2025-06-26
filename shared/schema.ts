import { 
  pgTable, 
  text, 
  serial, 
  uuid, 
  timestamp, 
  varchar,
  pgEnum,
  boolean,
  integer 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tipoUsuarioEnum = pgEnum('tipo_usuario', ['candidato', 'empresa', 'admin']);
export const statusConsultoriaEnum = pgEnum('status_consultoria', ['pendente', 'em_andamento', 'concluida', 'cancelada']);
export const tipoServicoEnum = pgEnum('tipo_servico', ['recrutamento', 'selecao', 'consultoria_rh', 'treinamento', 'avaliacao']);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }).notNull(),
  tipo: tipoUsuarioEnum("tipo").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const candidatos = pgTable("candidatos", {
  id: uuid("id").primaryKey().references(() => usuarios.id),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  linkedin: varchar("linkedin", { length: 255 }),
  github: varchar("github", { length: 255 }),
  portfolio: varchar("portfolio", { length: 255 }),
  endereco: varchar("endereco", { length: 500 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  cep: varchar("cep", { length: 10 }),
  dataNascimento: varchar("data_nascimento", { length: 10 }),
  estadoCivil: varchar("estado_civil", { length: 50 }),
  genero: varchar("genero", { length: 50 }),
  pcd: varchar("pcd", { length: 10 }).default("não"),
  nivelEscolaridade: varchar("nivel_escolaridade", { length: 100 }),
  curso: varchar("curso", { length: 255 }),
  instituicao: varchar("instituicao", { length: 255 }),
  anoFormacao: varchar("ano_formacao", { length: 4 }),
  idiomas: text("idiomas").array(),
  habilidades: text("habilidades").array(),
  experiencias: text("experiencias"),
  certificacoes: text("certificacoes"),
  objetivoProfissional: text("objetivo_profissional"),
  pretensaoSalarial: varchar("pretensao_salarial", { length: 50 }),
  disponibilidade: varchar("disponibilidade", { length: 100 }),
  modalidadeTrabalho: varchar("modalidade_trabalho", { length: 100 }),
  curriculoUrl: varchar("curriculo_url", { length: 500 }),
  areasInteresse: text("areas_interesse").array(),
  fotoPerfil: varchar("foto_perfil", { length: 500 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const empresas = pgTable("empresas", {
  id: uuid("id").primaryKey().references(() => usuarios.id),
  nome: varchar("nome", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }),
  razaoSocial: varchar("razao_social", { length: 255 }),
  nomeFantasia: varchar("nome_fantasia", { length: 255 }),
  inscricaoEstadual: varchar("inscricao_estadual", { length: 50 }),
  setor: varchar("setor", { length: 100 }),
  porte: varchar("porte", { length: 50 }),
  telefone: varchar("telefone", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  website: varchar("website", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  endereco: varchar("endereco", { length: 500 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  cep: varchar("cep", { length: 10 }),
  descricao: text("descricao"),
  missao: text("missao"),
  visao: text("visao"),
  valores: text("valores"),
  beneficios: text("beneficios").array(),
  cultura: text("cultura"),
  numeroFuncionarios: varchar("numero_funcionarios", { length: 50 }),
  anoFundacao: varchar("ano_fundacao", { length: 4 }),
  contato: varchar("contato", { length: 255 }),
  cargoContato: varchar("cargo_contato", { length: 100 }),
  logoEmpresa: varchar("logo_empresa", { length: 500 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const vagas = pgTable("vagas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao").notNull(),
  requisitos: text("requisitos"),
  area: varchar("area", { length: 100 }),
  nivel: varchar("nivel", { length: 50 }), // Júnior, Pleno, Sênior, Gerencial
  tipoContrato: varchar("tipo_contrato", { length: 50 }), // CLT, PJ, Estágio, Temporário
  modalidade: varchar("modalidade", { length: 50 }), // Presencial, Remoto, Híbrido
  salario: varchar("salario", { length: 100 }),
  beneficios: text("beneficios").array(),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  cargaHoraria: varchar("carga_horaria", { length: 50 }),
  responsabilidades: text("responsabilidades"),
  diferenciais: text("diferenciais"),
  status: varchar("status", { length: 20 }).default("ativa"), // ativa, pausada, encerrada
  dataEncerramento: timestamp("data_encerramento"),
  publicadoEm: timestamp("publicado_em").defaultNow().notNull(),
});

export const candidaturas = pgTable("candidaturas", {
  id: uuid("id").primaryKey().defaultRandom(),
  vagaId: uuid("vaga_id").references(() => vagas.id).notNull(),
  candidatoId: uuid("candidato_id").references(() => candidatos.id).notNull(),
  status: varchar("status", { length: 50 }).default("candidatado"), // candidatado, triagem, entrevista, teste, aprovado, reprovado
  etapa: varchar("etapa", { length: 100 }).default("Análise de currículo"),
  observacoes: text("observacoes"),
  pontuacao: integer("pontuacao"), // 1-10 para ranking
  dataTriagem: timestamp("data_triagem"),
  dataEntrevista: timestamp("data_entrevista"),
  feedbackEmpresa: text("feedback_empresa"),
  motivoReprovacao: text("motivo_reprovacao"),
  dataCandidatura: timestamp("data_candidatura").defaultNow().notNull(),
  ultimaAtualizacao: timestamp("ultima_atualizacao").defaultNow().notNull(),
});

export const bancoTalentos = pgTable("banco_talentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  curriculoUrl: varchar("curriculo_url", { length: 500 }),
  areaInteresse: varchar("area_interesse", { length: 255 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const contatos = pgTable("contatos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  empresa: varchar("empresa", { length: 255 }),
  mensagem: text("mensagem").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const servicos = pgTable("servicos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id),
  candidatoId: uuid("candidato_id").references(() => candidatos.id),
  tipoServico: tipoServicoEnum("tipo_servico").notNull(),
  descricao: text("descricao").notNull(),
  valor: varchar("valor", { length: 50 }),
  status: statusConsultoriaEnum("status").notNull().default('pendente'),
  dataInicio: timestamp("data_inicio"),
  dataFim: timestamp("data_fim"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const propostas = pgTable("propostas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id).notNull(),
  tipoServico: tipoServicoEnum("tipo_servico").notNull(),
  descricao: text("descricao").notNull(),
  valorProposto: varchar("valor_proposto", { length: 50 }).notNull(),
  prazoEntrega: varchar("prazo_entrega", { length: 100 }),
  observacoes: text("observacoes"),
  aprovada: text("aprovada"), // 'sim', 'nao', 'pendente'
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export const relatorios = pgTable("relatorios", {
  id: uuid("id").primaryKey().defaultRandom(),
  tipo: varchar("tipo", { length: 100 }).notNull(), // 'mensal', 'trimestral', 'anual'
  periodo: varchar("periodo", { length: 50 }).notNull(),
  totalCandidatos: varchar("total_candidatos", { length: 20 }),
  totalEmpresas: varchar("total_empresas", { length: 20 }),
  totalVagas: varchar("total_vagas", { length: 20 }),
  totalServicos: varchar("total_servicos", { length: 20 }),
  faturamento: varchar("faturamento", { length: 50 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

// Insert schemas
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  criadoEm: true,
});

export const insertCandidatoSchema = createInsertSchema(candidatos).omit({
  id: true,
  criadoEm: true,
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({
  id: true,
  criadoEm: true,
});

export const insertVagaSchema = createInsertSchema(vagas).omit({
  id: true,
  publicadoEm: true,
});

export const insertCandidaturaSchema = createInsertSchema(candidaturas).omit({
  id: true,
  dataCandidatura: true,
});

export const insertBancoTalentosSchema = createInsertSchema(bancoTalentos).omit({
  id: true,
  criadoEm: true,
});

export const insertContatoSchema = createInsertSchema(contatos).omit({
  id: true,
  criadoEm: true,
});

export const insertServicoSchema = createInsertSchema(servicos).omit({
  id: true,
  criadoEm: true,
});

export const insertPropostaSchema = createInsertSchema(propostas).omit({
  id: true,
  criadoEm: true,
});

export const insertRelatorioSchema = createInsertSchema(relatorios).omit({
  id: true,
  criadoEm: true,
});

// Types
export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Candidato = typeof candidatos.$inferSelect;
export type InsertCandidato = z.infer<typeof insertCandidatoSchema>;
export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Vaga = typeof vagas.$inferSelect;
export type InsertVaga = z.infer<typeof insertVagaSchema>;
export type Candidatura = typeof candidaturas.$inferSelect;
export type InsertCandidatura = z.infer<typeof insertCandidaturaSchema>;
export type BancoTalentos = typeof bancoTalentos.$inferSelect;
export type InsertBancoTalentos = z.infer<typeof insertBancoTalentosSchema>;
export type Contato = typeof contatos.$inferSelect;
export type InsertContato = z.infer<typeof insertContatoSchema>;
export type Servico = typeof servicos.$inferSelect;
export type InsertServico = z.infer<typeof insertServicoSchema>;
export type Proposta = typeof propostas.$inferSelect;
export type InsertProposta = z.infer<typeof insertPropostaSchema>;
export type Relatorio = typeof relatorios.$inferSelect;
export type InsertRelatorio = z.infer<typeof insertRelatorioSchema>;
