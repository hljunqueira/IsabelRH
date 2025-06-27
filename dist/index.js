// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import {
  pgTable,
  text,
  uuid,
  timestamp,
  varchar,
  pgEnum,
  boolean,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var tipoUsuarioEnum = pgEnum("tipo_usuario", ["candidato", "empresa", "admin"]);
var statusConsultoriaEnum = pgEnum("status_consultoria", ["pendente", "em_andamento", "concluida", "cancelada"]);
var tipoServicoEnum = pgEnum("tipo_servico", ["recrutamento", "selecao", "consultoria_rh", "treinamento", "avaliacao"]);
var tipoDiscEnum = pgEnum("tipo_disc", ["dominante", "influente", "estavel", "conscencioso"]);
var prioridadeEnum = pgEnum("prioridade", ["baixa", "media", "alta", "urgente"]);
var usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }),
  tipo: tipoUsuarioEnum("tipo").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var candidatos = pgTable("candidatos", {
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
  pcd: varchar("pcd", { length: 10 }).default("n\xE3o"),
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
  // Teste DISC
  perfilDisc: tipoDiscEnum("perfil_disc"),
  pontuacaoD: integer("pontuacao_d").default(0),
  pontuacaoI: integer("pontuacao_i").default(0),
  pontuacaoS: integer("pontuacao_s").default(0),
  pontuacaoC: integer("pontuacao_c").default(0),
  dataTesteDISC: timestamp("data_teste_disc"),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var empresas = pgTable("empresas", {
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
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var vagas = pgTable("vagas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao").notNull(),
  requisitos: text("requisitos"),
  area: varchar("area", { length: 100 }),
  nivel: varchar("nivel", { length: 50 }),
  // Júnior, Pleno, Sênior, Gerencial
  tipoContrato: varchar("tipo_contrato", { length: 50 }),
  // CLT, PJ, Estágio, Temporário
  modalidade: varchar("modalidade", { length: 50 }),
  // Presencial, Remoto, Híbrido
  salario: varchar("salario", { length: 100 }),
  beneficios: text("beneficios").array(),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  cargaHoraria: varchar("carga_horaria", { length: 50 }),
  responsabilidades: text("responsabilidades"),
  diferenciais: text("diferenciais"),
  status: varchar("status", { length: 20 }).default("ativa"),
  // ativa, pausada, encerrada
  dataEncerramento: timestamp("data_encerramento"),
  publicadoEm: timestamp("publicado_em").defaultNow().notNull()
});
var candidaturas = pgTable("candidaturas", {
  id: uuid("id").primaryKey().defaultRandom(),
  vagaId: uuid("vaga_id").references(() => vagas.id).notNull(),
  candidatoId: uuid("candidato_id").references(() => candidatos.id).notNull(),
  status: varchar("status", { length: 50 }).default("candidatado"),
  // candidatado, triagem, entrevista, teste, aprovado, reprovado
  etapa: varchar("etapa", { length: 100 }).default("An\xE1lise de curr\xEDculo"),
  observacoes: text("observacoes"),
  pontuacao: integer("pontuacao"),
  // 1-10 para ranking
  dataTriagem: timestamp("data_triagem"),
  dataEntrevista: timestamp("data_entrevista"),
  feedbackEmpresa: text("feedback_empresa"),
  motivoReprovacao: text("motivo_reprovacao"),
  // Filtros avançados e matching
  compatibilidadeDisc: integer("compatibilidade_disc"),
  // % de compatibilidade DISC
  compatibilidadeSkills: integer("compatibilidade_skills"),
  // % de compatibilidade habilidades
  compatibilidadeLocalizacao: boolean("compatibilidade_localizacao").default(true),
  prioridade: prioridadeEnum("prioridade").default("media"),
  tagsFiltros: text("tags_filtros").array(),
  // tags para filtros customizados
  dataCandidatura: timestamp("data_candidatura").defaultNow().notNull(),
  ultimaAtualizacao: timestamp("ultima_atualizacao").defaultNow().notNull()
});
var bancoTalentos = pgTable("banco_talentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  curriculoUrl: varchar("curriculo_url", { length: 500 }),
  areaInteresse: varchar("area_interesse", { length: 255 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var contatos = pgTable("contatos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  empresa: varchar("empresa", { length: 255 }),
  mensagem: text("mensagem").notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var servicos = pgTable("servicos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id),
  candidatoId: uuid("candidato_id").references(() => candidatos.id),
  tipoServico: tipoServicoEnum("tipo_servico").notNull(),
  descricao: text("descricao").notNull(),
  valor: varchar("valor", { length: 50 }),
  status: statusConsultoriaEnum("status").notNull().default("pendente"),
  dataInicio: timestamp("data_inicio"),
  dataFim: timestamp("data_fim"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var propostas = pgTable("propostas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id).notNull(),
  tipoServico: tipoServicoEnum("tipo_servico").notNull(),
  descricao: text("descricao").notNull(),
  valorProposto: varchar("valor_proposto", { length: 50 }).notNull(),
  prazoEntrega: varchar("prazo_entrega", { length: 100 }),
  observacoes: text("observacoes"),
  aprovada: text("aprovada"),
  // 'sim', 'nao', 'pendente'
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var relatorios = pgTable("relatorios", {
  id: uuid("id").primaryKey().defaultRandom(),
  tipo: varchar("tipo", { length: 100 }).notNull(),
  // 'mensal', 'trimestral', 'anual'
  periodo: varchar("periodo", { length: 50 }).notNull(),
  totalCandidatos: varchar("total_candidatos", { length: 20 }),
  totalEmpresas: varchar("total_empresas", { length: 20 }),
  totalVagas: varchar("total_vagas", { length: 20 }),
  totalServicos: varchar("total_servicos", { length: 20 }),
  faturamento: varchar("faturamento", { length: 50 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var testesDisc = pgTable("testes_disc", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidatoId: uuid("candidato_id").references(() => candidatos.id).notNull(),
  // Respostas do teste (24 perguntas, 4 alternativas cada)
  respostas: text("respostas").array().notNull(),
  // Pontuações calculadas
  pontuacaoD: integer("pontuacao_d").notNull(),
  pontuacaoI: integer("pontuacao_i").notNull(),
  pontuacaoS: integer("pontuacao_s").notNull(),
  pontuacaoC: integer("pontuacao_c").notNull(),
  // Perfil dominante
  perfilDominante: tipoDiscEnum("perfil_dominante").notNull(),
  // Análise detalhada
  descricaoPerfil: text("descricao_perfil"),
  pontosFortes: text("pontos_fortes").array(),
  areasDesenvolvimento: text("areas_desenvolvimento").array(),
  estiloTrabalho: text("estilo_trabalho"),
  estiloLideranca: text("estilo_lideranca"),
  estiloComunitacao: text("estilo_comunicacao"),
  dataRealizacao: timestamp("data_realizacao").defaultNow().notNull()
});
var filtrosSalvos = pgTable("filtros_salvos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  criterios: text("criterios").notNull(),
  // JSON string com critérios
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criado_em").defaultNow().notNull()
});
var insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  criadoEm: true
});
var insertCandidatoSchema = createInsertSchema(candidatos).omit({
  criadoEm: true
});
var insertEmpresaSchema = createInsertSchema(empresas).omit({
  criadoEm: true
});
var insertVagaSchema = createInsertSchema(vagas).omit({
  id: true,
  publicadoEm: true
});
var insertCandidaturaSchema = createInsertSchema(candidaturas).omit({
  id: true,
  dataCandidatura: true
});
var insertBancoTalentosSchema = createInsertSchema(bancoTalentos).omit({
  id: true,
  criadoEm: true
});
var insertContatoSchema = createInsertSchema(contatos).omit({
  id: true,
  criadoEm: true
});
var insertServicoSchema = createInsertSchema(servicos).omit({
  id: true,
  criadoEm: true
});
var insertPropostaSchema = createInsertSchema(propostas).omit({
  id: true,
  criadoEm: true
});
var insertRelatorioSchema = createInsertSchema(relatorios).omit({
  id: true,
  criadoEm: true
});
var insertTestesDiscSchema = createInsertSchema(testesDisc).omit({
  id: true,
  dataRealizacao: true
});
var insertFiltrosSalvosSchema = createInsertSchema(filtrosSalvos).omit({
  id: true,
  criadoEm: true
});

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
var MemStorage = class {
  usuarios;
  candidatos;
  empresas;
  vagas;
  candidaturas;
  bancoTalentos;
  contatos;
  servicos;
  propostas;
  relatorios;
  testesDisc;
  constructor() {
    this.usuarios = /* @__PURE__ */ new Map();
    this.candidatos = /* @__PURE__ */ new Map();
    this.empresas = /* @__PURE__ */ new Map();
    this.vagas = /* @__PURE__ */ new Map();
    this.candidaturas = /* @__PURE__ */ new Map();
    this.bancoTalentos = /* @__PURE__ */ new Map();
    this.contatos = /* @__PURE__ */ new Map();
    this.servicos = /* @__PURE__ */ new Map();
    this.propostas = /* @__PURE__ */ new Map();
    this.relatorios = /* @__PURE__ */ new Map();
    this.testesDisc = /* @__PURE__ */ new Map();
  }
  async getUsuario(id) {
    return this.usuarios.get(id);
  }
  async getUsuarioByEmail(email) {
    return Array.from(this.usuarios.values()).find((user) => user.email === email);
  }
  async createUsuario(insertUsuario) {
    const id = crypto.randomUUID();
    const usuario = {
      ...insertUsuario,
      id,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.usuarios.set(id, usuario);
    return usuario;
  }
  async getCandidato(id) {
    return this.candidatos.get(id);
  }
  async createCandidato(insertCandidato) {
    const id = crypto.randomUUID();
    const candidato = {
      id,
      nome: insertCandidato.nome,
      telefone: insertCandidato.telefone ?? null,
      celular: insertCandidato.celular ?? null,
      linkedin: insertCandidato.linkedin ?? null,
      github: insertCandidato.github ?? null,
      portfolio: insertCandidato.portfolio ?? null,
      endereco: insertCandidato.endereco ?? null,
      cidade: insertCandidato.cidade ?? null,
      estado: insertCandidato.estado ?? null,
      cep: insertCandidato.cep ?? null,
      dataNascimento: insertCandidato.dataNascimento ?? null,
      genero: insertCandidato.genero ?? null,
      estadoCivil: insertCandidato.estadoCivil ?? null,
      pcd: insertCandidato.pcd ?? null,
      nivelEscolaridade: insertCandidato.nivelEscolaridade ?? null,
      curso: insertCandidato.curso ?? null,
      instituicao: insertCandidato.instituicao ?? null,
      anoFormacao: insertCandidato.anoFormacao ?? null,
      idiomas: insertCandidato.idiomas ?? null,
      habilidades: insertCandidato.habilidades ?? null,
      experiencias: insertCandidato.experiencias ?? null,
      certificacoes: insertCandidato.certificacoes ?? null,
      objetivoProfissional: insertCandidato.objetivoProfissional ?? null,
      pretensaoSalarial: insertCandidato.pretensaoSalarial ?? null,
      disponibilidade: insertCandidato.disponibilidade ?? null,
      modalidadeTrabalho: insertCandidato.modalidadeTrabalho ?? null,
      curriculoUrl: insertCandidato.curriculoUrl ?? null,
      areasInteresse: insertCandidato.areasInteresse ?? null,
      fotoPerfil: insertCandidato.fotoPerfil ?? null,
      // Campos DISC
      perfilDisc: null,
      pontuacaoD: 0,
      pontuacaoI: 0,
      pontuacaoS: 0,
      pontuacaoC: 0,
      dataTesteDISC: null,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.candidatos.set(id, candidato);
    return candidato;
  }
  async updateCandidato(id, candidato) {
    const existing = this.candidatos.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...candidato };
    this.candidatos.set(id, updated);
    return updated;
  }
  async getEmpresa(id) {
    return this.empresas.get(id);
  }
  async createEmpresa(insertEmpresa) {
    const id = crypto.randomUUID();
    const empresa = {
      id,
      nome: insertEmpresa.nome,
      telefone: insertEmpresa.telefone ?? null,
      celular: insertEmpresa.celular ?? null,
      linkedin: insertEmpresa.linkedin ?? null,
      endereco: insertEmpresa.endereco ?? null,
      cidade: insertEmpresa.cidade ?? null,
      estado: insertEmpresa.estado ?? null,
      cep: insertEmpresa.cep ?? null,
      cnpj: insertEmpresa.cnpj ?? null,
      razaoSocial: insertEmpresa.razaoSocial ?? null,
      nomeFantasia: insertEmpresa.nomeFantasia ?? null,
      inscricaoEstadual: insertEmpresa.inscricaoEstadual ?? null,
      setor: insertEmpresa.setor ?? null,
      porte: insertEmpresa.porte ?? null,
      website: insertEmpresa.website ?? null,
      descricao: insertEmpresa.descricao ?? null,
      missao: insertEmpresa.missao ?? null,
      visao: insertEmpresa.visao ?? null,
      valores: insertEmpresa.valores ?? null,
      beneficios: insertEmpresa.beneficios ?? null,
      cultura: insertEmpresa.cultura ?? null,
      numeroFuncionarios: insertEmpresa.numeroFuncionarios ?? null,
      anoFundacao: insertEmpresa.anoFundacao ?? null,
      contato: insertEmpresa.contato ?? null,
      cargoContato: insertEmpresa.cargoContato ?? null,
      logoEmpresa: insertEmpresa.logoEmpresa ?? null,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.empresas.set(id, empresa);
    return empresa;
  }
  async updateEmpresa(id, empresa) {
    const existing = this.empresas.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...empresa };
    this.empresas.set(id, updated);
    return updated;
  }
  async getVaga(id) {
    return this.vagas.get(id);
  }
  async getVagasByEmpresa(empresaId) {
    return Array.from(this.vagas.values()).filter((vaga) => vaga.empresaId === empresaId);
  }
  async getAllVagas() {
    return Array.from(this.vagas.values());
  }
  async createVaga(insertVaga) {
    const id = crypto.randomUUID();
    const vaga = {
      id,
      titulo: insertVaga.titulo,
      descricao: insertVaga.descricao,
      empresaId: insertVaga.empresaId,
      cidade: insertVaga.cidade ?? null,
      estado: insertVaga.estado ?? null,
      requisitos: insertVaga.requisitos ?? null,
      area: insertVaga.area ?? null,
      nivel: insertVaga.nivel ?? null,
      tipoContrato: insertVaga.tipoContrato ?? null,
      salario: insertVaga.salario ?? null,
      beneficios: insertVaga.beneficios ?? null,
      status: insertVaga.status ?? null,
      dataEncerramento: insertVaga.dataEncerramento ?? null,
      responsabilidades: insertVaga.responsabilidades ?? null,
      modalidade: insertVaga.modalidade ?? null,
      cargaHoraria: insertVaga.cargaHoraria ?? null,
      diferenciais: insertVaga.diferenciais ?? null,
      publicadoEm: /* @__PURE__ */ new Date()
    };
    this.vagas.set(id, vaga);
    return vaga;
  }
  async updateVaga(id, vaga) {
    const existing = this.vagas.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...vaga };
    this.vagas.set(id, updated);
    return updated;
  }
  async deleteVaga(id) {
    return this.vagas.delete(id);
  }
  async getCandidaturasByCandidato(candidatoId) {
    return Array.from(this.candidaturas.values()).filter((c) => c.candidatoId === candidatoId);
  }
  async getCandidaturasByVaga(vagaId) {
    return Array.from(this.candidaturas.values()).filter((c) => c.vagaId === vagaId);
  }
  async createCandidatura(insertCandidatura) {
    const id = crypto.randomUUID();
    const candidatura = {
      id,
      vagaId: insertCandidatura.vagaId,
      candidatoId: insertCandidatura.candidatoId,
      status: insertCandidatura.status || null,
      prioridade: insertCandidatura.prioridade ?? null,
      etapa: insertCandidatura.etapa ?? null,
      observacoes: insertCandidatura.observacoes ?? null,
      pontuacao: insertCandidatura.pontuacao ?? null,
      dataTriagem: insertCandidatura.dataTriagem ?? null,
      dataEntrevista: insertCandidatura.dataEntrevista ?? null,
      feedbackEmpresa: insertCandidatura.feedbackEmpresa ?? null,
      compatibilidadeDisc: insertCandidatura.compatibilidadeDisc ?? null,
      compatibilidadeSkills: insertCandidatura.compatibilidadeSkills ?? null,
      compatibilidadeLocalizacao: insertCandidatura.compatibilidadeLocalizacao ?? true,
      tagsFiltros: insertCandidatura.tagsFiltros ?? null,
      motivoReprovacao: insertCandidatura.motivoReprovacao ?? null,
      dataCandidatura: /* @__PURE__ */ new Date(),
      ultimaAtualizacao: /* @__PURE__ */ new Date()
    };
    this.candidaturas.set(id, candidatura);
    return candidatura;
  }
  async checkCandidaturaExists(vagaId, candidatoId) {
    return Array.from(this.candidaturas.values()).some(
      (c) => c.vagaId === vagaId && c.candidatoId === candidatoId
    );
  }
  async createBancoTalentos(insertTalento) {
    const id = crypto.randomUUID();
    const talento = {
      ...insertTalento,
      id,
      criadoEm: /* @__PURE__ */ new Date(),
      telefone: insertTalento.telefone ?? null,
      curriculoUrl: insertTalento.curriculoUrl ?? null,
      areaInteresse: insertTalento.areaInteresse ?? null
    };
    this.bancoTalentos.set(id, talento);
    return talento;
  }
  async getAllBancoTalentos() {
    return Array.from(this.bancoTalentos.values());
  }
  async createContato(insertContato) {
    const id = crypto.randomUUID();
    const contato = {
      ...insertContato,
      id,
      criadoEm: /* @__PURE__ */ new Date(),
      empresa: insertContato.empresa ?? null
    };
    this.contatos.set(id, contato);
    return contato;
  }
  async getAllContatos() {
    return Array.from(this.contatos.values());
  }
  // Admin methods
  async getAllCandidatos() {
    return Array.from(this.candidatos.values());
  }
  async getAllEmpresas() {
    return Array.from(this.empresas.values());
  }
  async deleteCandidato(id) {
    const deleted = this.candidatos.delete(id);
    if (deleted) {
      this.usuarios.delete(id);
    }
    return deleted;
  }
  async deleteEmpresa(id) {
    const deleted = this.empresas.delete(id);
    if (deleted) {
      this.usuarios.delete(id);
    }
    return deleted;
  }
  // Servico methods
  async createServico(insertServico) {
    const id = crypto.randomUUID();
    const servico = {
      ...insertServico,
      id,
      criadoEm: /* @__PURE__ */ new Date(),
      empresaId: insertServico.empresaId ?? null,
      candidatoId: insertServico.candidatoId ?? null,
      valor: insertServico.valor ?? null,
      dataInicio: insertServico.dataInicio ?? null,
      dataFim: insertServico.dataFim ?? null,
      observacoes: insertServico.observacoes ?? null,
      status: insertServico.status ?? "pendente"
    };
    this.servicos.set(id, servico);
    return servico;
  }
  async getAllServicos() {
    return Array.from(this.servicos.values());
  }
  async updateServico(id, servico) {
    const existing = this.servicos.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...servico };
    this.servicos.set(id, updated);
    return updated;
  }
  async deleteServico(id) {
    return this.servicos.delete(id);
  }
  // Proposta methods
  async createProposta(insertProposta) {
    const id = crypto.randomUUID();
    const proposta = {
      ...insertProposta,
      id,
      criadoEm: /* @__PURE__ */ new Date(),
      prazoEntrega: insertProposta.prazoEntrega ?? null,
      observacoes: insertProposta.observacoes ?? null,
      aprovada: insertProposta.aprovada ?? null
    };
    this.propostas.set(id, proposta);
    return proposta;
  }
  async getAllPropostas() {
    return Array.from(this.propostas.values());
  }
  async updateProposta(id, proposta) {
    const existing = this.propostas.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...proposta };
    this.propostas.set(id, updated);
    return updated;
  }
  // Relatorio methods
  async createRelatorio(insertRelatorio) {
    const id = crypto.randomUUID();
    const relatorio = {
      ...insertRelatorio,
      id,
      criadoEm: /* @__PURE__ */ new Date(),
      totalCandidatos: insertRelatorio.totalCandidatos ?? null,
      totalEmpresas: insertRelatorio.totalEmpresas ?? null,
      totalVagas: insertRelatorio.totalVagas ?? null,
      totalServicos: insertRelatorio.totalServicos ?? null,
      faturamento: insertRelatorio.faturamento ?? null
    };
    this.relatorios.set(id, relatorio);
    return relatorio;
  }
  async getAllRelatorios() {
    return Array.from(this.relatorios.values());
  }
  // DISC Testing methods
  async createTesteDISC(teste) {
    const id = crypto.randomUUID();
    const testeDisc = {
      id,
      candidatoId: teste.candidatoId,
      respostas: teste.respostas,
      pontuacaoD: teste.pontuacaoD,
      pontuacaoI: teste.pontuacaoI,
      pontuacaoS: teste.pontuacaoS,
      pontuacaoC: teste.pontuacaoC,
      perfilDominante: teste.perfilDominante,
      descricaoPerfil: teste.descricaoPerfil ?? null,
      pontosFortes: teste.pontosFortes ?? null,
      areasDesenvolvimento: teste.areasDesenvolvimento ?? null,
      estiloTrabalho: teste.estiloTrabalho ?? null,
      estiloLideranca: teste.estiloLideranca ?? null,
      estiloComunitacao: teste.estiloComunitacao ?? null,
      dataRealizacao: /* @__PURE__ */ new Date()
    };
    this.testesDisc.set(id, testeDisc);
    return testeDisc;
  }
  async getTesteDISCByCandidato(candidatoId) {
    return Array.from(this.testesDisc.values()).find((t) => t.candidatoId === candidatoId);
  }
  async updateCandidatoDISC(candidatoId, discData) {
    const candidato = this.candidatos.get(candidatoId);
    if (!candidato) return false;
    const updated = {
      ...candidato,
      perfilDisc: discData.perfilDisc,
      pontuacaoD: discData.pontuacaoD,
      pontuacaoI: discData.pontuacaoI,
      pontuacaoS: discData.pontuacaoS,
      pontuacaoC: discData.pontuacaoC,
      dataTesteDISC: discData.dataTesteDISC
    };
    this.candidatos.set(candidatoId, updated);
    return true;
  }
};
var PostgreSQLStorage = class {
  db;
  constructor() {
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        this.db = drizzle(sql);
      } catch (error) {
        console.error("Failed to connect to PostgreSQL, falling back to memory storage:", error);
        this.db = null;
      }
    }
  }
  async getUsuario(id) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting usuario:", error);
      return void 0;
    }
  }
  async getUsuarioByEmail(email) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting usuario by email:", error);
      return void 0;
    }
  }
  async createUsuario(usuario) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(usuarios).values(usuario).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating usuario:", error);
      throw error;
    }
  }
  async getCandidato(id) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.select().from(candidatos).where(eq(candidatos.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting candidato:", error);
      return void 0;
    }
  }
  async createCandidato(candidato) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(candidatos).values(candidato).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating candidato:", error);
      throw error;
    }
  }
  async updateCandidato(id, candidato) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.update(candidatos).set(candidato).where(eq(candidatos.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating candidato:", error);
      return void 0;
    }
  }
  async getEmpresa(id) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.select().from(empresas).where(eq(empresas.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting empresa:", error);
      return void 0;
    }
  }
  async createEmpresa(empresa) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(empresas).values(empresa).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating empresa:", error);
      throw error;
    }
  }
  async updateEmpresa(id, empresa) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.update(empresas).set(empresa).where(eq(empresas.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating empresa:", error);
      return void 0;
    }
  }
  async getVaga(id) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.select().from(vagas).where(eq(vagas.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting vaga:", error);
      return void 0;
    }
  }
  async getVagasByEmpresa(empresaId) {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(vagas).where(eq(vagas.empresaId, empresaId));
      return result;
    } catch (error) {
      console.error("Error getting vagas by empresa:", error);
      return [];
    }
  }
  async getAllVagas() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(vagas);
      return result;
    } catch (error) {
      console.error("Error getting all vagas:", error);
      return [];
    }
  }
  async createVaga(vaga) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(vagas).values(vaga).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating vaga:", error);
      throw error;
    }
  }
  async updateVaga(id, vaga) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.update(vagas).set(vaga).where(eq(vagas.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating vaga:", error);
      return void 0;
    }
  }
  async deleteVaga(id) {
    if (!this.db) return false;
    try {
      await this.db.delete(vagas).where(eq(vagas.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting vaga:", error);
      return false;
    }
  }
  async getCandidaturasByCandidato(candidatoId) {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(candidaturas).where(eq(candidaturas.candidatoId, candidatoId));
      return result;
    } catch (error) {
      console.error("Error getting candidaturas by candidato:", error);
      return [];
    }
  }
  async getCandidaturasByVaga(vagaId) {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(candidaturas).where(eq(candidaturas.vagaId, vagaId));
      return result;
    } catch (error) {
      console.error("Error getting candidaturas by vaga:", error);
      return [];
    }
  }
  async createCandidatura(candidatura) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(candidaturas).values(candidatura).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating candidatura:", error);
      throw error;
    }
  }
  async checkCandidaturaExists(vagaId, candidatoId) {
    if (!this.db) return false;
    try {
      const result = await this.db.select().from(candidaturas).where(and(eq(candidaturas.vagaId, vagaId), eq(candidaturas.candidatoId, candidatoId))).limit(1);
      return result.length > 0;
    } catch (error) {
      console.error("Error checking candidatura exists:", error);
      return false;
    }
  }
  async createBancoTalentos(talento) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(bancoTalentos).values(talento).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating banco talentos:", error);
      throw error;
    }
  }
  async getAllBancoTalentos() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(bancoTalentos);
      return result;
    } catch (error) {
      console.error("Error getting all banco talentos:", error);
      return [];
    }
  }
  async createContato(contato) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(contatos).values(contato).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating contato:", error);
      throw error;
    }
  }
  async getAllContatos() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(contatos);
      return result;
    } catch (error) {
      console.error("Error getting all contatos:", error);
      return [];
    }
  }
  // Admin methods
  async getAllCandidatos() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(candidatos);
      return result;
    } catch (error) {
      console.error("Error getting all candidatos:", error);
      return [];
    }
  }
  async getAllEmpresas() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(empresas);
      return result;
    } catch (error) {
      console.error("Error getting all empresas:", error);
      return [];
    }
  }
  async deleteCandidato(id) {
    if (!this.db) return false;
    try {
      await this.db.delete(candidatos).where(eq(candidatos.id, id));
      await this.db.delete(usuarios).where(eq(usuarios.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting candidato:", error);
      return false;
    }
  }
  async deleteEmpresa(id) {
    if (!this.db) return false;
    try {
      await this.db.delete(empresas).where(eq(empresas.id, id));
      await this.db.delete(usuarios).where(eq(usuarios.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting empresa:", error);
      return false;
    }
  }
  // Servico methods
  async createServico(servico) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(servicos).values(servico).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating servico:", error);
      throw error;
    }
  }
  async getAllServicos() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(servicos);
      return result;
    } catch (error) {
      console.error("Error getting all servicos:", error);
      return [];
    }
  }
  async updateServico(id, servico) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.update(servicos).set(servico).where(eq(servicos.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating servico:", error);
      return void 0;
    }
  }
  async deleteServico(id) {
    if (!this.db) return false;
    try {
      await this.db.delete(servicos).where(eq(servicos.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting servico:", error);
      return false;
    }
  }
  // Proposta methods
  async createProposta(proposta) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(propostas).values(proposta).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating proposta:", error);
      throw error;
    }
  }
  async getAllPropostas() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(propostas);
      return result;
    } catch (error) {
      console.error("Error getting all propostas:", error);
      return [];
    }
  }
  async updateProposta(id, proposta) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.update(propostas).set(proposta).where(eq(propostas.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating proposta:", error);
      return void 0;
    }
  }
  // Relatorio methods
  async createRelatorio(relatorio) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(relatorios).values(relatorio).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating relatorio:", error);
      throw error;
    }
  }
  async getAllRelatorios() {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(relatorios);
      return result;
    } catch (error) {
      console.error("Error getting all relatorios:", error);
      return [];
    }
  }
  // DISC Testing methods
  async createTesteDISC(teste) {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(testesDisc).values(teste).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating teste DISC:", error);
      throw error;
    }
  }
  async getTesteDISCByCandidato(candidatoId) {
    if (!this.db) return void 0;
    try {
      const result = await this.db.select().from(testesDisc).where(eq(testesDisc.candidatoId, candidatoId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting teste DISC:", error);
      return void 0;
    }
  }
  async updateCandidatoDISC(candidatoId, discData) {
    if (!this.db) return false;
    try {
      await this.db.update(candidatos).set({
        perfilDisc: discData.perfilDisc,
        pontuacaoD: discData.pontuacaoD,
        pontuacaoI: discData.pontuacaoI,
        pontuacaoS: discData.pontuacaoS,
        pontuacaoC: discData.pontuacaoC,
        dataTesteDISC: discData.dataTesteDISC
      }).where(eq(candidatos.id, candidatoId));
      return true;
    } catch (error) {
      console.error("Error updating candidato DISC:", error);
      return false;
    }
  }
};
var memStorage = new MemStorage();
var pgStorage = new PostgreSQLStorage();
var storage = process.env.DATABASE_URL ? pgStorage : memStorage;

// server/routes.ts
import bcrypt from "bcrypt";

// server/ranking.ts
var CONFIGURACAO_PADRAO = {
  pesoDisc: 30,
  pesoHabilidades: 30,
  pesoExperiencia: 20,
  pesoLocalizacao: 10,
  pesoSalaario: 10
};
var COMPATIBILIDADE_DISC = {
  "dominante": ["dominante", "influente"],
  "influente": ["influente", "dominante", "estavel"],
  "estavel": ["estavel", "influente", "conscencioso"],
  "conscencioso": ["conscencioso", "estavel", "dominante"]
};
function calcularScoreCandidato(candidato, vaga, configuracao = CONFIGURACAO_PADRAO) {
  const detalhes = {
    disc: calcularScoreDisc(candidato, vaga, configuracao.pesoDisc),
    habilidades: calcularScoreHabilidades(candidato, vaga, configuracao.pesoHabilidades),
    experiencia: calcularScoreExperiencia(candidato, vaga, configuracao.pesoExperiencia),
    localizacao: calcularScoreLocalizacao(candidato, vaga, configuracao.pesoLocalizacao),
    salario: calcularScoreSalario(candidato, vaga, configuracao.pesoSalaario)
  };
  const scoreTotal = Object.values(detalhes).reduce((total, criterio) => total + criterio.score, 0);
  return {
    candidato,
    candidatura: {},
    // Será preenchido depois
    score: Math.round(scoreTotal),
    detalhes
  };
}
function calcularScoreDisc(candidato, vaga, pesoMaximo) {
  if (!candidato.perfilDisc) {
    return { score: 0, max: pesoMaximo, descricao: "Perfil DISC n\xE3o dispon\xEDvel" };
  }
  const perfilCandidato = candidato.perfilDisc.toLowerCase();
  let perfilDesejado = "dominante";
  if (vaga.area?.toLowerCase().includes("rh") || vaga.area?.toLowerCase().includes("recursos humanos")) {
    perfilDesejado = "influente";
  } else if (vaga.area?.toLowerCase().includes("tecnologia") || vaga.area?.toLowerCase().includes("ti")) {
    perfilDesejado = "conscencioso";
  } else if (vaga.area?.toLowerCase().includes("vendas") || vaga.area?.toLowerCase().includes("comercial")) {
    perfilDesejado = "dominante";
  }
  if (perfilCandidato === perfilDesejado) {
    return { score: pesoMaximo, max: pesoMaximo, descricao: "Perfil DISC perfeito" };
  }
  const perfisCompativeis = COMPATIBILIDADE_DISC[perfilDesejado] || [];
  if (perfisCompativeis.includes(perfilCandidato)) {
    return { score: pesoMaximo * 0.7, max: pesoMaximo, descricao: "Perfil DISC compat\xEDvel" };
  }
  return { score: pesoMaximo * 0.3, max: pesoMaximo, descricao: "Perfil DISC diferente" };
}
function calcularScoreHabilidades(candidato, vaga, pesoMaximo) {
  if (!candidato.habilidades || !vaga.requisitos) {
    return { score: 0, max: pesoMaximo, descricao: "Habilidades n\xE3o dispon\xEDveis" };
  }
  const habilidadesCandidato = candidato.habilidades.map((h) => h.toLowerCase());
  const requisitosVaga = vaga.requisitos.toLowerCase();
  const palavrasChave = requisitosVaga.split(/[,\s]+/).filter((p) => p.length > 2);
  const habilidadesMatch = palavrasChave.filter(
    (palavra) => habilidadesCandidato.some((hab) => hab.includes(palavra) || palavra.includes(hab))
  );
  const percentualMatch = palavrasChave.length > 0 ? habilidadesMatch.length / palavrasChave.length : 0;
  const score = percentualMatch * pesoMaximo;
  return {
    score: Math.round(score),
    max: pesoMaximo,
    descricao: `${habilidadesMatch.length}/${palavrasChave.length} habilidades compat\xEDveis`
  };
}
function calcularScoreExperiencia(candidato, vaga, pesoMaximo) {
  const experiencias = candidato.experiencias || "";
  const anosExperiencia = extrairAnosExperiencia(experiencias);
  let experienciaMinima = 0;
  if (vaga.nivel === "junior") experienciaMinima = 1;
  else if (vaga.nivel === "pleno") experienciaMinima = 3;
  else if (vaga.nivel === "senior") experienciaMinima = 5;
  else experienciaMinima = 2;
  if (anosExperiencia >= experienciaMinima) {
    const multiplicador = Math.min(1.5, anosExperiencia / experienciaMinima);
    const score2 = Math.min(pesoMaximo, pesoMaximo * multiplicador);
    return {
      score: Math.round(score2),
      max: pesoMaximo,
      descricao: `${anosExperiencia} anos de experi\xEAncia (m\xEDnimo: ${experienciaMinima})`
    };
  }
  const percentual = anosExperiencia / experienciaMinima;
  const score = percentual * pesoMaximo * 0.5;
  return {
    score: Math.round(score),
    max: pesoMaximo,
    descricao: `${anosExperiencia} anos de experi\xEAncia (m\xEDnimo: ${experienciaMinima})`
  };
}
function extrairAnosExperiencia(experiencias) {
  const regex = /(\d+)\s*(anos?|years?)/i;
  const match = experiencias.match(regex);
  return match ? parseInt(match[1]) : 0;
}
function calcularScoreLocalizacao(candidato, vaga, pesoMaximo) {
  const cidadeCandidato = candidato.cidade?.toLowerCase();
  const estadoCandidato = candidato.estado?.toLowerCase();
  const cidadeVaga = vaga.cidade?.toLowerCase();
  const estadoVaga = vaga.estado?.toLowerCase();
  if (cidadeCandidato === cidadeVaga) {
    return { score: pesoMaximo, max: pesoMaximo, descricao: "Mesma cidade" };
  }
  if (estadoCandidato === estadoVaga) {
    return { score: pesoMaximo * 0.7, max: pesoMaximo, descricao: "Mesmo estado" };
  }
  if (vaga.modalidade === "remoto") {
    return { score: pesoMaximo * 0.8, max: pesoMaximo, descricao: "Vaga remota" };
  }
  return { score: pesoMaximo * 0.3, max: pesoMaximo, descricao: "Localiza\xE7\xE3o diferente" };
}
function calcularScoreSalario(candidato, vaga, pesoMaximo) {
  const pretensaoCandidato = extrairValorSalario(candidato.pretensaoSalarial || "");
  const salarioVaga = extrairValorSalario(vaga.salario || "");
  if (pretensaoCandidato <= salarioVaga) {
    return { score: pesoMaximo, max: pesoMaximo, descricao: "Pretens\xE3o dentro da faixa" };
  }
  const percentualExcedente = salarioVaga > 0 ? (pretensaoCandidato - salarioVaga) / salarioVaga : 0;
  if (percentualExcedente <= 0.1) {
    return { score: pesoMaximo * 0.7, max: pesoMaximo, descricao: "Pretens\xE3o ligeiramente acima" };
  }
  if (percentualExcedente <= 0.2) {
    return { score: pesoMaximo * 0.4, max: pesoMaximo, descricao: "Pretens\xE3o acima da faixa" };
  }
  return { score: pesoMaximo * 0.1, max: pesoMaximo, descricao: "Pretens\xE3o muito acima" };
}
function extrairValorSalario(salario) {
  const regex = /R?\$?\s*([\d.,]+)/g;
  const match = regex.exec(salario);
  if (!match) return 0;
  const valor = match[1].replace(/\./g, "").replace(",", ".");
  return parseFloat(valor) || 0;
}
async function obterCandidatosRanking(vagaId) {
  try {
    const candidaturas2 = await storage.getCandidaturasByVaga(vagaId);
    const vaga = await storage.getVaga(vagaId);
    if (!vaga) {
      throw new Error("Vaga n\xE3o encontrada");
    }
    const candidatosComScore = [];
    for (const candidatura of candidaturas2) {
      const candidato = await storage.getCandidato(candidatura.candidatoId);
      if (candidato) {
        const scoreCandidato = calcularScoreCandidato(candidato, vaga);
        scoreCandidato.candidatura = candidatura;
        candidatosComScore.push(scoreCandidato);
      }
    }
    return candidatosComScore.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Erro ao obter candidatos ranking:", error);
    throw error;
  }
}
function obterClassificacaoScore(score) {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muito Bom";
  if (score >= 70) return "Bom";
  if (score >= 60) return "Regular";
  if (score >= 50) return "Abaixo da M\xE9dia";
  return "Baixo";
}

// server/triagem.ts
var SistemaTriagem = class {
  filtros = /* @__PURE__ */ new Map();
  constructor() {
    this.carregarFiltros();
  }
  async carregarFiltros() {
    const filtrosPadrao = [
      {
        id: "filtro-padrao",
        vagaId: "todas",
        nome: "Filtro Padr\xE3o",
        criterios: {
          scoreMinimo: 60,
          experienciaMinima: 1,
          pretensaoMaxima: 15e3
        },
        acoes: {
          scoreAlto: "entrevista",
          scoreMedio: "triagem",
          scoreBaixo: "reprovado"
        },
        ativo: true,
        criadoEm: /* @__PURE__ */ new Date()
      }
    ];
    filtrosPadrao.forEach((filtro) => {
      this.filtros.set(filtro.id, filtro);
    });
  }
  async criarFiltro(filtro) {
    const id = crypto.randomUUID();
    const novoFiltro = {
      ...filtro,
      id,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.filtros.set(id, novoFiltro);
    return novoFiltro;
  }
  async obterFiltros(vagaId) {
    const filtros = Array.from(this.filtros.values());
    if (vagaId) {
      return filtros.filter((f) => f.vagaId === vagaId || f.vagaId === "todas");
    }
    return filtros;
  }
  async aplicarTriagemAutomatica(vagaId) {
    try {
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      const filtros = await this.obterFiltros(vagaId);
      if (filtros.length === 0) {
        console.log("Nenhum filtro encontrado para a vaga:", vagaId);
        return [];
      }
      const resultados = [];
      for (const candidatoComScore of candidatosComScore) {
        for (const filtro of filtros) {
          if (!filtro.ativo) continue;
          const resultado = await this.aplicarFiltro(
            candidatoComScore,
            filtro
          );
          if (resultado) {
            resultados.push(resultado);
            await this.atualizarStatusCandidatura(
              resultado.candidaturaId,
              resultado.statusNovo,
              resultado.motivo
            );
            if (resultado.aprovadoAutomaticamente) {
              await this.enviarNotificacaoAprovacao(resultado);
            }
          }
        }
      }
      return resultados;
    } catch (error) {
      console.error("Erro ao aplicar triagem autom\xE1tica:", error);
      throw error;
    }
  }
  async aplicarFiltro(candidatoComScore, filtro) {
    const { candidato, candidatura, score, classificacao } = candidatoComScore;
    const { criterios, acoes } = filtro;
    if (score < criterios.scoreMinimo) {
      return this.criarResultado(
        candidatura.id,
        candidato.id,
        candidatura.vagaId,
        score,
        classificacao,
        candidatura.status,
        acoes.scoreBaixo,
        `Score ${score} abaixo do m\xEDnimo ${criterios.scoreMinimo}`,
        [filtro.nome]
      );
    }
    if (criterios.perfilDiscDesejado && candidato.perfilDisc) {
      if (!criterios.perfilDiscDesejado.includes(candidato.perfilDisc)) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          "reprovado",
          `Perfil DISC ${candidato.perfilDisc} n\xE3o compat\xEDvel`,
          [filtro.nome]
        );
      }
    }
    if (criterios.habilidadesObrigatorias && candidato.habilidades) {
      const habilidadesFaltantes = criterios.habilidadesObrigatorias.filter(
        (hab) => !candidato.habilidades.some(
          (candHab) => candHab.toLowerCase().includes(hab.toLowerCase())
        )
      );
      if (habilidadesFaltantes.length > 0) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          "reprovado",
          `Habilidades obrigat\xF3rias n\xE3o encontradas: ${habilidadesFaltantes.join(", ")}`,
          [filtro.nome]
        );
      }
    }
    if (criterios.experienciaMinima) {
      const experiencias = candidato.experiencias || "";
      const anosExperiencia = this.extrairAnosExperiencia(experiencias);
      if (anosExperiencia < criterios.experienciaMinima) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          "reprovado",
          `${anosExperiencia} anos de experi\xEAncia (m\xEDnimo: ${criterios.experienciaMinima})`,
          [filtro.nome]
        );
      }
    }
    if (criterios.pretensaoMaxima && candidato.pretensaoSalarial) {
      const pretensao = this.extrairValorSalario(candidato.pretensaoSalarial);
      if (pretensao > criterios.pretensaoMaxima) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          "reprovado",
          `Pretens\xE3o salarial R$ ${pretensao} acima do m\xE1ximo R$ ${criterios.pretensaoMaxima}`,
          [filtro.nome]
        );
      }
    }
    let novaAcao;
    if (score >= 80) {
      novaAcao = acoes.scoreAlto;
    } else if (score >= 60) {
      novaAcao = acoes.scoreMedio;
    } else {
      novaAcao = acoes.scoreBaixo;
    }
    return this.criarResultado(
      candidatura.id,
      candidato.id,
      candidatura.vagaId,
      score,
      classificacao,
      candidatura.status,
      novaAcao,
      `Triagem autom\xE1tica aplicada - Score: ${score}`,
      [filtro.nome],
      novaAcao === "aprovado" || novaAcao === "entrevista"
    );
  }
  criarResultado(candidaturaId, candidatoId, vagaId, score, classificacao, statusAnterior, statusNovo, motivo, filtrosAplicados, aprovadoAutomaticamente = false) {
    return {
      candidaturaId,
      candidatoId,
      vagaId,
      score,
      classificacao,
      statusAnterior,
      statusNovo,
      motivo,
      filtrosAplicados,
      aprovadoAutomaticamente,
      dataTriagem: /* @__PURE__ */ new Date()
    };
  }
  async atualizarStatusCandidatura(candidaturaId, novoStatus, motivo) {
    try {
      console.log(`Atualizando candidatura ${candidaturaId} para status: ${novoStatus}`);
    } catch (error) {
      console.error("Erro ao atualizar status da candidatura:", error);
    }
  }
  async enviarNotificacaoAprovacao(resultado) {
    try {
      console.log(`Notifica\xE7\xE3o enviada para candidato ${resultado.candidatoId}: ${resultado.motivo}`);
      const template = {
        para: "candidato@email.com",
        assunto: "Parab\xE9ns! Sua candidatura foi aprovada na triagem",
        corpo: `
          Ol\xE1!
          
          Sua candidatura foi aprovada na triagem autom\xE1tica com score de ${resultado.score}%.
          
          Pr\xF3ximos passos: ${resultado.statusNovo === "entrevista" ? "Entrevista" : "Teste t\xE9cnico"}
          
          Boa sorte!
        `
      };
    } catch (error) {
      console.error("Erro ao enviar notifica\xE7\xE3o:", error);
    }
  }
  extrairAnosExperiencia(experiencias) {
    const regex = /(\d+)\s*(anos?|years?)/i;
    const match = experiencias.match(regex);
    return match ? parseInt(match[1]) : 0;
  }
  extrairValorSalario(salario) {
    const regex = /R?\$?\s*([\d.,]+)/g;
    const match = regex.exec(salario);
    if (!match) return 0;
    const valor = match[1].replace(/\./g, "").replace(",", ".");
    return parseFloat(valor) || 0;
  }
  async obterEstatisticasTriagem(vagaId) {
    try {
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      const estatisticas = {
        totalCandidatos: candidatosComScore.length,
        aprovados: 0,
        reprovados: 0,
        emTriagem: 0,
        entrevistas: 0,
        mediaScore: 0
      };
      let totalScore = 0;
      candidatosComScore.forEach((candidato) => {
        totalScore += candidato.score;
        if (candidato.score >= 80) {
          estatisticas.aprovados++;
        } else if (candidato.score >= 60) {
          estatisticas.emTriagem++;
        } else {
          estatisticas.reprovados++;
        }
      });
      estatisticas.mediaScore = candidatosComScore.length > 0 ? Math.round(totalScore / candidatosComScore.length) : 0;
      return estatisticas;
    } catch (error) {
      console.error("Erro ao obter estat\xEDsticas:", error);
      throw error;
    }
  }
};
var sistemaTriagem = new SistemaTriagem();

// server/comunicacao.ts
var SistemaComunicacao = class {
  conversas = /* @__PURE__ */ new Map();
  mensagens = /* @__PURE__ */ new Map();
  templates = /* @__PURE__ */ new Map();
  notificacoes = /* @__PURE__ */ new Map();
  constructor() {
    this.carregarTemplates();
  }
  carregarTemplates() {
    const templatesPadrao = [
      {
        id: "template-aprovacao",
        nome: "Candidatura Aprovada",
        categoria: "aprovacao",
        assunto: "Parab\xE9ns! Sua candidatura foi aprovada",
        conteudo: `Ol\xE1 {{nome_candidato}}!

Parab\xE9ns! Sua candidatura para a vaga de {{titulo_vaga}} foi aprovada na triagem inicial.

Score obtido: {{score}}%
Classifica\xE7\xE3o: {{classificacao}}

Pr\xF3ximos passos: {{proximos_passos}}

Aguarde nosso contato para agendamento da {{proxima_etapa}}.

Atenciosamente,
Equipe de RH`,
        variaveis: ["nome_candidato", "titulo_vaga", "score", "classificacao", "proximos_passos", "proxima_etapa"],
        ativo: true,
        criadoEm: /* @__PURE__ */ new Date()
      },
      {
        id: "template-reprovacao",
        nome: "Candidatura N\xE3o Aprovada",
        categoria: "reprovacao",
        assunto: "Atualiza\xE7\xE3o sobre sua candidatura",
        conteudo: `Ol\xE1 {{nome_candidato}},

Obrigado pelo interesse na vaga de {{titulo_vaga}}.

Infelizmente, sua candidatura n\xE3o foi aprovada nesta etapa.

Score obtido: {{score}}%
Motivo: {{motivo}}

Mantenha seu perfil atualizado para futuras oportunidades.

Atenciosamente,
Equipe de RH`,
        variaveis: ["nome_candidato", "titulo_vaga", "score", "motivo"],
        ativo: true,
        criadoEm: /* @__PURE__ */ new Date()
      },
      {
        id: "template-entrevista",
        nome: "Agendamento de Entrevista",
        categoria: "entrevista",
        assunto: "Agendamento de Entrevista",
        conteudo: `Ol\xE1 {{nome_candidato}}!

Sua candidatura para {{titulo_vaga}} foi selecionada para entrevista.

Data: {{data_entrevista}}
Hor\xE1rio: {{horario_entrevista}}
Local: {{local_entrevista}}
Tipo: {{tipo_entrevista}}

Por favor, confirme sua presen\xE7a respondendo esta mensagem.

Atenciosamente,
{{nome_recrutador}}
{{cargo_recrutador}}`,
        variaveis: ["nome_candidato", "titulo_vaga", "data_entrevista", "horario_entrevista", "local_entrevista", "tipo_entrevista", "nome_recrutador", "cargo_recrutador"],
        ativo: true,
        criadoEm: /* @__PURE__ */ new Date()
      }
    ];
    templatesPadrao.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }
  async criarConversa(candidatoId, empresaId, vagaId, titulo) {
    const id = crypto.randomUUID();
    const conversa = {
      id,
      candidatoId,
      empresaId,
      vagaId,
      titulo: titulo || "Nova conversa",
      status: "ativa",
      totalMensagens: 0,
      naoLidas: 0,
      criadaEm: /* @__PURE__ */ new Date(),
      atualizadaEm: /* @__PURE__ */ new Date()
    };
    this.conversas.set(id, conversa);
    return conversa;
  }
  async obterConversas(usuarioId, tipo) {
    const conversas = Array.from(this.conversas.values());
    if (tipo === "candidato") {
      return conversas.filter((c) => c.candidatoId === usuarioId);
    } else {
      return conversas.filter((c) => c.empresaId === usuarioId);
    }
  }
  async enviarMensagem(conversaId, remetenteId, remetenteTipo, destinatarioId, destinatarioTipo, conteudo, tipo = "texto", templateId) {
    const id = crypto.randomUUID();
    const mensagem = {
      id,
      conversaId,
      remetenteId,
      remetenteTipo,
      destinatarioId,
      destinatarioTipo,
      conteudo,
      tipo,
      templateId,
      lida: false,
      dataEnvio: /* @__PURE__ */ new Date()
    };
    this.mensagens.set(id, mensagem);
    const conversa = this.conversas.get(conversaId);
    if (conversa) {
      conversa.ultimaMensagem = mensagem;
      conversa.totalMensagens++;
      conversa.naoLidas++;
      conversa.atualizadaEm = /* @__PURE__ */ new Date();
    }
    await this.criarNotificacao(
      destinatarioId,
      "mensagem",
      "Nova mensagem",
      `Voc\xEA recebeu uma nova mensagem na conversa "${conversa?.titulo || "Nova conversa"}"`,
      { conversaId, mensagemId: id }
    );
    return mensagem;
  }
  async enviarMensagemTemplate(conversaId, remetenteId, remetenteTipo, destinatarioId, destinatarioTipo, templateId, variaveis) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error("Template n\xE3o encontrado");
    }
    let conteudo = template.conteudo;
    Object.entries(variaveis).forEach(([chave, valor]) => {
      const regex = new RegExp(`{{${chave}}}`, "g");
      conteudo = conteudo.replace(regex, valor);
    });
    return this.enviarMensagem(
      conversaId,
      remetenteId,
      remetenteTipo,
      destinatarioId,
      destinatarioTipo,
      conteudo,
      "template",
      templateId
    );
  }
  async obterMensagens(conversaId) {
    const mensagens = Array.from(this.mensagens.values());
    return mensagens.filter((m) => m.conversaId === conversaId).sort((a, b) => a.dataEnvio.getTime() - b.dataEnvio.getTime());
  }
  async marcarComoLida(mensagemId) {
    const mensagem = this.mensagens.get(mensagemId);
    if (mensagem && !mensagem.lida) {
      mensagem.lida = true;
      mensagem.dataLeitura = /* @__PURE__ */ new Date();
      const conversa = this.conversas.get(mensagem.conversaId);
      if (conversa && conversa.naoLidas > 0) {
        conversa.naoLidas--;
      }
    }
  }
  async marcarConversaComoLida(conversaId, usuarioId) {
    const mensagens = await this.obterMensagens(conversaId);
    const mensagensNaoLidas = mensagens.filter(
      (m) => !m.lida && m.destinatarioId === usuarioId
    );
    for (const mensagem of mensagensNaoLidas) {
      await this.marcarComoLida(mensagem.id);
    }
  }
  async obterTemplates(categoria) {
    const templates = Array.from(this.templates.values());
    if (categoria) {
      return templates.filter((t) => t.categoria === categoria && t.ativo);
    }
    return templates.filter((t) => t.ativo);
  }
  async criarTemplate(template) {
    const id = crypto.randomUUID();
    const novoTemplate = {
      ...template,
      id,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.templates.set(id, novoTemplate);
    return novoTemplate;
  }
  async criarNotificacao(usuarioId, tipo, titulo, mensagem, dados) {
    const id = crypto.randomUUID();
    const notificacao = {
      id,
      usuarioId,
      tipo,
      titulo,
      mensagem,
      dados,
      lida: false,
      criadaEm: /* @__PURE__ */ new Date()
    };
    this.notificacoes.set(id, notificacao);
    return notificacao;
  }
  async obterNotificacoes(usuarioId, naoLidas) {
    const notificacoes = Array.from(this.notificacoes.values()).filter((n) => n.usuarioId === usuarioId);
    if (naoLidas !== void 0) {
      return notificacoes.filter((n) => n.lida === !naoLidas);
    }
    return notificacoes.sort((a, b) => b.criadaEm.getTime() - a.criadaEm.getTime());
  }
  async marcarNotificacaoComoLida(notificacaoId) {
    const notificacao = this.notificacoes.get(notificacaoId);
    if (notificacao && !notificacao.lida) {
      notificacao.lida = true;
      notificacao.lidaEm = /* @__PURE__ */ new Date();
    }
  }
  async obterEstatisticasComunicacao(usuarioId) {
    const conversas = await this.obterConversas(usuarioId, "candidato");
    const notificacoes = await this.obterNotificacoes(usuarioId, true);
    return {
      totalConversas: conversas.length,
      mensagensNaoLidas: conversas.reduce((total, c) => total + c.naoLidas, 0),
      notificacoesNaoLidas: notificacoes.length,
      conversasAtivas: conversas.filter((c) => c.status === "ativa").length
    };
  }
  async enviarNotificacaoCandidatura(candidatoId, tipo, dados) {
    const templates = {
      aprovacao: "template-aprovacao",
      reprovacao: "template-reprovacao",
      entrevista: "template-entrevista",
      teste: "template-entrevista"
    };
    const templateId = templates[tipo];
    if (!templateId) return;
    const conversas = await this.obterConversas(candidatoId, "candidato");
    let conversa = conversas.find((c) => c.vagaId === dados.vagaId);
    if (!conversa) {
      conversa = await this.criarConversa(
        candidatoId,
        dados.empresaId,
        dados.vagaId,
        `Candidatura - ${dados.tituloVaga}`
      );
    }
    await this.enviarMensagemTemplate(
      conversa.id,
      dados.empresaId,
      "empresa",
      candidatoId,
      "candidato",
      templateId,
      dados
    );
    await this.criarNotificacao(
      candidatoId,
      "candidatura",
      `Atualiza\xE7\xE3o da candidatura - ${dados.tituloVaga}`,
      `Sua candidatura foi ${tipo === "aprovacao" ? "aprovada" : tipo === "reprovacao" ? "n\xE3o aprovada" : "selecionada para " + tipo}`,
      { vagaId: dados.vagaId, tipo }
    );
  }
};
var sistemaComunicacao = new SistemaComunicacao();

// server/parsing.ts
var SistemaParsing = class {
  habilidadesComuns = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "PHP",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "Google Cloud",
    "Linux",
    "Windows",
    "MacOS",
    "Agile",
    "Scrum",
    "Kanban",
    "JIRA",
    "Confluence",
    "Slack",
    "Excel",
    "PowerPoint",
    "Word",
    "Photoshop",
    "Illustrator",
    "Figma",
    "Ingl\xEAs",
    "Espanhol",
    "Franc\xEAs",
    "Alem\xE3o",
    "Italiano"
  ];
  niveisEscolaridade = [
    "Ensino Fundamental",
    "Ensino M\xE9dio",
    "T\xE9cnico",
    "Gradua\xE7\xE3o",
    "P\xF3s-gradua\xE7\xE3o",
    "Mestrado",
    "Doutorado"
  ];
  estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ];
  async processarCurriculo(conteudo, candidatoId) {
    try {
      const dados = {};
      const erros = [];
      const avisos = [];
      let confianca = 0;
      const nome = this.extrairNome(conteudo);
      if (nome) {
        dados.nome = nome;
        confianca += 10;
      } else {
        erros.push("Nome n\xE3o encontrado");
      }
      const email = this.extrairEmail(conteudo);
      if (email) {
        dados.email = email;
        confianca += 15;
      } else {
        erros.push("Email n\xE3o encontrado");
      }
      const telefone = this.extrairTelefone(conteudo);
      if (telefone) {
        dados.telefone = telefone;
        confianca += 10;
      } else {
        avisos.push("Telefone n\xE3o encontrado");
      }
      const linkedin = this.extrairLinkedIn(conteudo);
      if (linkedin) {
        dados.linkedin = linkedin;
        confianca += 5;
      }
      const github = this.extrairGitHub(conteudo);
      if (github) {
        dados.github = github;
        confianca += 5;
      }
      const portfolio = this.extrairPortfolio(conteudo);
      if (portfolio) {
        dados.portfolio = portfolio;
        confianca += 5;
      }
      const endereco = this.extrairEndereco(conteudo);
      if (endereco) {
        dados.endereco = endereco.endereco;
        dados.cidade = endereco.cidade;
        dados.estado = endereco.estado;
        dados.cep = endereco.cep;
        confianca += 10;
      }
      const dataNascimento = this.extrairDataNascimento(conteudo);
      if (dataNascimento) {
        dados.dataNascimento = dataNascimento;
        confianca += 5;
      }
      const estadoCivil = this.extrairEstadoCivil(conteudo);
      if (estadoCivil) {
        dados.estadoCivil = estadoCivil;
        confianca += 3;
      }
      const genero = this.extrairGenero(conteudo);
      if (genero) {
        dados.genero = genero;
        confianca += 3;
      }
      const formacao = this.extrairFormacaoAcademica(conteudo);
      if (formacao) {
        dados.nivelEscolaridade = formacao.nivel;
        dados.curso = formacao.curso;
        dados.instituicao = formacao.instituicao;
        dados.anoFormacao = formacao.ano;
        confianca += 15;
      }
      const idiomas = this.extrairIdiomas(conteudo);
      if (idiomas.length > 0) {
        dados.idiomas = idiomas;
        confianca += 8;
      }
      const habilidades = this.extrairHabilidades(conteudo);
      if (habilidades.length > 0) {
        dados.habilidades = habilidades;
        confianca += 12;
      }
      const experiencias = this.extrairExperiencias(conteudo);
      if (experiencias) {
        dados.experiencias = experiencias;
        confianca += 10;
      }
      const certificacoes = this.extrairCertificacoes(conteudo);
      if (certificacoes) {
        dados.certificacoes = certificacoes;
        confianca += 5;
      }
      const objetivo = this.extrairObjetivoProfissional(conteudo);
      if (objetivo) {
        dados.objetivoProfissional = objetivo;
        confianca += 5;
      }
      const pretensao = this.extrairPretensaoSalarial(conteudo);
      if (pretensao) {
        dados.pretensaoSalarial = pretensao;
        confianca += 5;
      }
      const disponibilidade = this.extrairDisponibilidade(conteudo);
      if (disponibilidade) {
        dados.disponibilidade = disponibilidade;
        confianca += 3;
      }
      const modalidade = this.extrairModalidadeTrabalho(conteudo);
      if (modalidade) {
        dados.modalidadeTrabalho = modalidade;
        confianca += 3;
      }
      const areasInteresse = this.extrairAreasInteresse(conteudo);
      if (areasInteresse.length > 0) {
        dados.areasInteresse = areasInteresse;
        confianca += 5;
      }
      return {
        sucesso: confianca >= 30,
        dados,
        confianca: Math.min(confianca, 100),
        erros,
        avisos
      };
    } catch (error) {
      console.error("Erro ao processar curr\xEDculo:", error);
      return {
        sucesso: false,
        dados: {},
        confianca: 0,
        erros: ["Erro interno no processamento"],
        avisos: []
      };
    }
  }
  async aplicarDadosExtraidos(candidatoId, dados) {
    try {
      const candidato = await storage.getCandidato(candidatoId);
      if (!candidato) {
        throw new Error("Candidato n\xE3o encontrado");
      }
      const dadosAtualizacao = {};
      if (dados.nome && !candidato.nome) dadosAtualizacao.nome = dados.nome;
      if (dados.telefone && !candidato.telefone) dadosAtualizacao.telefone = dados.telefone;
      if (dados.linkedin && !candidato.linkedin) dadosAtualizacao.linkedin = dados.linkedin;
      if (dados.github && !candidato.github) dadosAtualizacao.github = dados.github;
      if (dados.portfolio && !candidato.portfolio) dadosAtualizacao.portfolio = dados.portfolio;
      if (dados.endereco && !candidato.endereco) dadosAtualizacao.endereco = dados.endereco;
      if (dados.cidade && !candidato.cidade) dadosAtualizacao.cidade = dados.cidade;
      if (dados.estado && !candidato.estado) dadosAtualizacao.estado = dados.estado;
      if (dados.cep && !candidato.cep) dadosAtualizacao.cep = dados.cep;
      if (dados.dataNascimento && !candidato.dataNascimento) dadosAtualizacao.dataNascimento = dados.dataNascimento;
      if (dados.estadoCivil && !candidato.estadoCivil) dadosAtualizacao.estadoCivil = dados.estadoCivil;
      if (dados.genero && !candidato.genero) dadosAtualizacao.genero = dados.genero;
      if (dados.nivelEscolaridade && !candidato.nivelEscolaridade) dadosAtualizacao.nivelEscolaridade = dados.nivelEscolaridade;
      if (dados.curso && !candidato.curso) dadosAtualizacao.curso = dados.curso;
      if (dados.instituicao && !candidato.instituicao) dadosAtualizacao.instituicao = dados.instituicao;
      if (dados.anoFormacao && !candidato.anoFormacao) dadosAtualizacao.anoFormacao = dados.anoFormacao;
      if (dados.idiomas && (!candidato.idiomas || candidato.idiomas.length === 0)) dadosAtualizacao.idiomas = dados.idiomas;
      if (dados.habilidades && (!candidato.habilidades || candidato.habilidades.length === 0)) dadosAtualizacao.habilidades = dados.habilidades;
      if (dados.experiencias && !candidato.experiencias) dadosAtualizacao.experiencias = dados.experiencias;
      if (dados.certificacoes && !candidato.certificacoes) dadosAtualizacao.certificacoes = dados.certificacoes;
      if (dados.objetivoProfissional && !candidato.objetivoProfissional) dadosAtualizacao.objetivoProfissional = dados.objetivoProfissional;
      if (dados.pretensaoSalarial && !candidato.pretensaoSalarial) dadosAtualizacao.pretensaoSalarial = dados.pretensaoSalarial;
      if (dados.disponibilidade && !candidato.disponibilidade) dadosAtualizacao.disponibilidade = dados.disponibilidade;
      if (dados.modalidadeTrabalho && !candidato.modalidadeTrabalho) dadosAtualizacao.modalidadeTrabalho = dados.modalidadeTrabalho;
      if (dados.areasInteresse && (!candidato.areasInteresse || candidato.areasInteresse.length === 0)) dadosAtualizacao.areasInteresse = dados.areasInteresse;
      await storage.updateCandidato(candidatoId, dadosAtualizacao);
      return true;
    } catch (error) {
      console.error("Erro ao aplicar dados extra\xEDdos:", error);
      return false;
    }
  }
  extrairNome(conteudo) {
    const linhas = conteudo.split("\n").slice(0, 10);
    for (const linha of linhas) {
      const nome = linha.trim();
      if (nome.length > 3 && nome.length < 100 && /^[A-ZÀ-Ú][a-zà-ú\s]+$/.test(nome)) {
        return nome;
      }
    }
    return null;
  }
  extrairEmail(conteudo) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = conteudo.match(emailRegex);
    return emails ? emails[0] : null;
  }
  extrairTelefone(conteudo) {
    const telefoneRegex = /\(?([0-9]{2})\)?[\s-]?([0-9]{4,5})[\s-]?([0-9]{4})/g;
    const telefones = conteudo.match(telefoneRegex);
    return telefones ? telefones[0] : null;
  }
  extrairLinkedIn(conteudo) {
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
    const linkedins = conteudo.match(linkedinRegex);
    return linkedins ? linkedins[0] : null;
  }
  extrairGitHub(conteudo) {
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi;
    const githubs = conteudo.match(githubRegex);
    return githubs ? githubs[0] : null;
  }
  extrairPortfolio(conteudo) {
    const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|dev|io|net|org)/gi;
    const portfolios = conteudo.match(portfolioRegex);
    return portfolios ? portfolios[0] : null;
  }
  extrairEndereco(conteudo) {
    const enderecoRegex = /([^,]+),\s*([^,]+),\s*([A-Z]{2})\s*-\s*CEP:\s*(\d{5}-?\d{3})/i;
    const match = conteudo.match(enderecoRegex);
    if (match) {
      return {
        endereco: match[1].trim(),
        cidade: match[2].trim(),
        estado: match[3].trim(),
        cep: match[4].trim()
      };
    }
    return null;
  }
  extrairDataNascimento(conteudo) {
    const dataRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/g;
    const datas = conteudo.match(dataRegex);
    return datas ? datas[0] : null;
  }
  extrairEstadoCivil(conteudo) {
    const estados = ["solteiro", "casado", "divorciado", "vi\xFAvo", "separado"];
    const conteudoLower = conteudo.toLowerCase();
    for (const estado of estados) {
      if (conteudoLower.includes(estado)) {
        return estado.charAt(0).toUpperCase() + estado.slice(1);
      }
    }
    return null;
  }
  extrairGenero(conteudo) {
    const generos = ["masculino", "feminino", "n\xE3o bin\xE1rio"];
    const conteudoLower = conteudo.toLowerCase();
    for (const genero of generos) {
      if (conteudoLower.includes(genero)) {
        return genero.charAt(0).toUpperCase() + genero.slice(1);
      }
    }
    return null;
  }
  extrairFormacaoAcademica(conteudo) {
    const formacaoRegex = /(?:Graduação|Bacharelado|Licenciatura|Técnico|Mestrado|Doutorado)[^:]*:\s*([^,]+),\s*([^,]+),\s*(\d{4})/i;
    const match = conteudo.match(formacaoRegex);
    if (match) {
      return {
        nivel: match[0].split(":")[0].trim(),
        curso: match[1].trim(),
        instituicao: match[2].trim(),
        ano: match[3].trim()
      };
    }
    return null;
  }
  extrairIdiomas(conteudo) {
    const idiomas = [];
    const conteudoLower = conteudo.toLowerCase();
    const idiomasComuns = ["ingl\xEAs", "espanhol", "franc\xEAs", "alem\xE3o", "italiano", "portugu\xEAs"];
    for (const idioma of idiomasComuns) {
      if (conteudoLower.includes(idioma)) {
        idiomas.push(idioma.charAt(0).toUpperCase() + idioma.slice(1));
      }
    }
    return idiomas;
  }
  extrairHabilidades(conteudo) {
    const habilidades = [];
    const conteudoLower = conteudo.toLowerCase();
    for (const habilidade of this.habilidadesComuns) {
      if (conteudoLower.includes(habilidade.toLowerCase())) {
        habilidades.push(habilidade);
      }
    }
    return habilidades;
  }
  extrairExperiencias(conteudo) {
    const experienciaRegex = /(?:experiência|experience)[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)/i;
    const match = conteudo.match(experienciaRegex);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
  extrairCertificacoes(conteudo) {
    const certificacaoRegex = /(?:certificações|certifications)[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)/i;
    const match = conteudo.match(certificacaoRegex);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
  extrairObjetivoProfissional(conteudo) {
    const objetivoRegex = /(?:objetivo|objective)[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)/i;
    const match = conteudo.match(objetivoRegex);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
  extrairPretensaoSalarial(conteudo) {
    const pretensaoRegex = /(?:pretensão|pretensão|salário|salary)[^:]*:\s*R?\$?\s*([\d.,]+)/i;
    const match = conteudo.match(pretensaoRegex);
    if (match) {
      return `R$ ${match[1]}`;
    }
    return null;
  }
  extrairDisponibilidade(conteudo) {
    const disponibilidadeRegex = /(?:disponibilidade|availability)[^:]*:\s*([^,\n]+)/i;
    const match = conteudo.match(disponibilidadeRegex);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
  extrairModalidadeTrabalho(conteudo) {
    const modalidades = ["presencial", "remoto", "h\xEDbrido", "hibrido"];
    const conteudoLower = conteudo.toLowerCase();
    for (const modalidade of modalidades) {
      if (conteudoLower.includes(modalidade)) {
        return modalidade.charAt(0).toUpperCase() + modalidade.slice(1);
      }
    }
    return null;
  }
  extrairAreasInteresse(conteudo) {
    const areas = [];
    const areasComuns = ["desenvolvimento", "marketing", "vendas", "rh", "recursos humanos", "financeiro", "administrativo"];
    const conteudoLower = conteudo.toLowerCase();
    for (const area of areasComuns) {
      if (conteudoLower.includes(area)) {
        areas.push(area.charAt(0).toUpperCase() + area.slice(1));
      }
    }
    return areas;
  }
};
var sistemaParsing = new SistemaParsing();

// server/relatorios.ts
var SistemaRelatorios = class {
  async obterMetricasProcessoSeletivo(vagaId) {
    try {
      const vaga = await storage.getVaga(vagaId);
      if (!vaga) {
        throw new Error("Vaga n\xE3o encontrada");
      }
      const candidaturas2 = await storage.getCandidaturasByVaga(vagaId);
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      const totalCandidatos = candidaturas2.length;
      let candidatosAprovados = 0;
      let candidatosReprovados = 0;
      let candidatosEmTriagem = 0;
      let candidatosEntrevistados = 0;
      let totalScore = 0;
      candidaturas2.forEach((candidatura) => {
        switch (candidatura.status) {
          case "aprovado":
            candidatosAprovados++;
            break;
          case "reprovado":
            candidatosReprovados++;
            break;
          case "triagem":
            candidatosEmTriagem++;
            break;
          case "entrevista":
            candidatosEntrevistados++;
            break;
        }
      });
      candidatosComScore.forEach((candidato) => {
        totalScore += candidato.score;
      });
      const mediaScore = totalCandidatos > 0 ? Math.round(totalScore / totalCandidatos) : 0;
      const taxaConversao = totalCandidatos > 0 ? candidatosAprovados / totalCandidatos * 100 : 0;
      const tempoMedioProcesso = this.calcularTempoMedioProcesso(candidaturas2);
      const custoPorContratacao = this.calcularCustoContratacao(candidatosAprovados);
      const fonteCandidatos = {
        plataforma: Math.round(totalCandidatos * 0.6),
        linkedin: Math.round(totalCandidatos * 0.25),
        indica\u00E7\u00E3o: Math.round(totalCandidatos * 0.1),
        outros: Math.round(totalCandidatos * 0.05)
      };
      return {
        vagaId,
        tituloVaga: vaga.titulo,
        totalCandidatos,
        candidatosAprovados,
        candidatosReprovados,
        candidatosEmTriagem,
        candidatosEntrevistados,
        mediaScore,
        tempoMedioProcesso,
        taxaConversao,
        custoPorContratacao,
        fonteCandidatos
      };
    } catch (error) {
      console.error("Erro ao obter m\xE9tricas do processo seletivo:", error);
      throw error;
    }
  }
  async obterKPIRecrutamento() {
    try {
      const vagas2 = await storage.getAllVagas();
      const candidatos2 = await storage.getAllCandidatos();
      const empresas2 = await storage.getAllEmpresas();
      const totalVagas = vagas2.length;
      const vagasAtivas = vagas2.filter((v) => v.status === "ativa").length;
      const vagasEncerradas = vagas2.filter((v) => v.status === "encerrada").length;
      let totalCandidaturas = 0;
      let totalAprovados = 0;
      let totalEntrevistas = 0;
      for (const vaga of vagas2) {
        const candidaturas2 = await storage.getCandidaturasByVaga(vaga.id);
        totalCandidaturas += candidaturas2.length;
        candidaturas2.forEach((candidatura) => {
          if (candidatura.status === "aprovado") totalAprovados++;
          if (candidatura.status === "entrevista") totalEntrevistas++;
        });
      }
      const totalCandidatos = candidatos2.length;
      const mediaCandidatosPorVaga = totalVagas > 0 ? totalCandidaturas / totalVagas : 0;
      const taxaAprovacao = totalCandidaturas > 0 ? totalAprovados / totalCandidaturas * 100 : 0;
      const tempoMedioContratacao = this.calcularTempoMedioContratacao(vagas2);
      const custoMedioContratacao = this.calcularCustoMedioContratacao(totalAprovados);
      const satisfacaoEmpresas = 85;
      const satisfacaoCandidatos = 78;
      return {
        totalVagas,
        vagasAtivas,
        vagasEncerradas,
        totalCandidatos,
        totalCandidaturas,
        mediaCandidatosPorVaga: Math.round(mediaCandidatosPorVaga * 100) / 100,
        taxaAprovacao: Math.round(taxaAprovacao * 100) / 100,
        tempoMedioContratacao,
        custoMedioContratacao,
        satisfacaoEmpresas,
        satisfacaoCandidatos
      };
    } catch (error) {
      console.error("Erro ao obter KPIs de recrutamento:", error);
      throw error;
    }
  }
  async obterRelatorioMensal(mes, ano) {
    try {
      const vagas2 = await storage.getAllVagas();
      const candidatos2 = await storage.getAllCandidatos();
      const vagasDoMes = vagas2.filter((vaga) => {
        const dataVaga = new Date(vaga.publicadoEm);
        return dataVaga.getMonth() === mes - 1 && dataVaga.getFullYear() === ano;
      });
      let candidaturasRecebidas = 0;
      let entrevistasRealizadas = 0;
      let contratacoesEfetivadas = 0;
      for (const vaga of vagasDoMes) {
        const candidaturas2 = await storage.getCandidaturasByVaga(vaga.id);
        candidaturasRecebidas += candidaturas2.length;
        candidaturas2.forEach((candidatura) => {
          if (candidatura.status === "entrevista") entrevistasRealizadas++;
          if (candidatura.status === "aprovado") contratacoesEfetivadas++;
        });
      }
      const metricasPorVaga = [];
      for (const vaga of vagasDoMes) {
        const metrica = await this.obterMetricasProcessoSeletivo(vaga.id);
        metricasPorVaga.push(metrica);
      }
      const faturamento = contratacoesEfetivadas * 5e3;
      const custos = candidaturasRecebidas * 50;
      const lucro = faturamento - custos;
      const nomesMeses = [
        "Janeiro",
        "Fevereiro",
        "Mar\xE7o",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];
      return {
        mes: nomesMeses[mes - 1],
        ano,
        vagasPublicadas: vagasDoMes.length,
        candidaturasRecebidas,
        entrevistasRealizadas,
        contratacoesEfetivadas,
        faturamento,
        custos,
        lucro,
        metricasPorVaga
      };
    } catch (error) {
      console.error("Erro ao obter relat\xF3rio mensal:", error);
      throw error;
    }
  }
  async obterDadosGraficoCandidaturasPorMes(meses = 12) {
    try {
      const dados = [];
      const hoje = /* @__PURE__ */ new Date();
      for (let i = meses - 1; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mes = data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        let candidaturas2 = 0;
        const vagas2 = await storage.getAllVagas();
        for (const vaga of vagas2) {
          const candidaturasVaga = await storage.getCandidaturasByVaga(vaga.id);
          candidaturas2 += candidaturasVaga.length;
        }
        dados.push({ mes, candidaturas: candidaturas2 });
      }
      return {
        labels: dados.map((d) => d.mes),
        datasets: [{
          label: "Candidaturas",
          data: dados.map((d) => d.candidaturas),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2
        }]
      };
    } catch (error) {
      console.error("Erro ao obter dados do gr\xE1fico:", error);
      throw error;
    }
  }
  async obterDadosGraficoStatusCandidaturas() {
    try {
      const vagas2 = await storage.getAllVagas();
      let candidatado = 0;
      let triagem = 0;
      let entrevista = 0;
      let aprovado = 0;
      let reprovado = 0;
      for (const vaga of vagas2) {
        const candidaturas2 = await storage.getCandidaturasByVaga(vaga.id);
        candidaturas2.forEach((candidatura) => {
          switch (candidatura.status) {
            case "candidatado":
              candidatado++;
              break;
            case "triagem":
              triagem++;
              break;
            case "entrevista":
              entrevista++;
              break;
            case "aprovado":
              aprovado++;
              break;
            case "reprovado":
              reprovado++;
              break;
          }
        });
      }
      return {
        labels: ["Candidatado", "Triagem", "Entrevista", "Aprovado", "Reprovado"],
        datasets: [{
          label: "Candidaturas por Status",
          data: [candidatado, triagem, entrevista, aprovado, reprovado],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(239, 68, 68, 0.8)"
          ]
        }]
      };
    } catch (error) {
      console.error("Erro ao obter dados do gr\xE1fico de status:", error);
      throw error;
    }
  }
  async obterDadosGraficoAreasMaisProcuradas() {
    try {
      const vagas2 = await storage.getAllVagas();
      const areas = {};
      vagas2.forEach((vaga) => {
        if (vaga.area) {
          areas[vaga.area] = (areas[vaga.area] || 0) + 1;
        }
      });
      const areasOrdenadas = Object.entries(areas).sort(([, a], [, b]) => b - a).slice(0, 10);
      return {
        labels: areasOrdenadas.map(([area]) => area),
        datasets: [{
          label: "Vagas por \xC1rea",
          data: areasOrdenadas.map(([, count]) => count),
          backgroundColor: "rgba(147, 51, 234, 0.8)",
          borderColor: "rgba(147, 51, 234, 1)",
          borderWidth: 1
        }]
      };
    } catch (error) {
      console.error("Erro ao obter dados do gr\xE1fico de \xE1reas:", error);
      throw error;
    }
  }
  async exportarRelatorioPDF(dados, tipo) {
    try {
      console.log(`Exportando relat\xF3rio ${tipo} para PDF...`);
      const nomeArquivo = `relatorio_${tipo}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`;
      return nomeArquivo;
    } catch (error) {
      console.error("Erro ao exportar relat\xF3rio PDF:", error);
      throw error;
    }
  }
  async exportarRelatorioExcel(dados, tipo) {
    try {
      console.log(`Exportando relat\xF3rio ${tipo} para Excel...`);
      const nomeArquivo = `relatorio_${tipo}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.xlsx`;
      return nomeArquivo;
    } catch (error) {
      console.error("Erro ao exportar relat\xF3rio Excel:", error);
      throw error;
    }
  }
  calcularTempoMedioProcesso(candidaturas2) {
    return Math.round(Math.random() * 30) + 15;
  }
  calcularCustoContratacao(aprovados) {
    return aprovados > 0 ? Math.round(Math.random() * 2e3 + 3e3) : 0;
  }
  calcularTempoMedioContratacao(vagas2) {
    return Math.round(Math.random() * 20) + 25;
  }
  calcularCustoMedioContratacao(aprovados) {
    return aprovados > 0 ? Math.round(Math.random() * 1500 + 2500) : 0;
  }
};
var sistemaRelatorios = new SistemaRelatorios();

// server/hunting.ts
var SistemaHunting = class {
  campanhas = /* @__PURE__ */ new Map();
  perfis = /* @__PURE__ */ new Map();
  templates = /* @__PURE__ */ new Map();
  constructor() {
    this.carregarTemplates();
  }
  carregarTemplates() {
    const templatesPadrao = [
      {
        id: "template-hunting-1",
        nome: "Primeiro Contato - Desenvolvedor",
        assunto: "Oportunidade de Desenvolvimento - {{empresa}}",
        mensagem: `Ol\xE1 {{nome}}!

Vi seu perfil no LinkedIn e fiquei impressionado com sua experi\xEAncia em {{habilidades}}.

Estamos buscando um {{cargo}} para nossa equipe em {{empresa}}. A vaga oferece:

\u2022 {{beneficios}}
\u2022 {{salario}}
\u2022 {{modalidade}}

Gostaria de conversar sobre essa oportunidade? Podemos agendar uma call para discutir mais detalhes.

Atenciosamente,
{{recrutador}}
{{empresa}}`,
        variaveis: ["nome", "habilidades", "cargo", "empresa", "beneficios", "salario", "modalidade", "recrutador"],
        ativo: true,
        criadoEm: /* @__PURE__ */ new Date()
      },
      {
        id: "template-hunting-2",
        nome: "Follow-up - Interesse",
        assunto: "Re: Oportunidade {{empresa}} - Pr\xF3ximos Passos",
        mensagem: `Ol\xE1 {{nome}}!

Obrigado pelo interesse na oportunidade de {{cargo}} na {{empresa}}!

Gostaria de agendar uma conversa para discutir:

\u2022 Detalhes da vaga e responsabilidades
\u2022 Cultura da empresa e valores
\u2022 Processo seletivo
\u2022 Suas expectativas e objetivos

Qual hor\xE1rio seria melhor para voc\xEA? Sugest\xF5es:
\u2022 Segunda-feira, 14h
\u2022 Ter\xE7a-feira, 10h
\u2022 Quarta-feira, 16h

Aguardo seu retorno!

{{recrutador}}
{{empresa}}`,
        variaveis: ["nome", "cargo", "empresa", "recrutador"],
        ativo: true,
        criadoEm: /* @__PURE__ */ new Date()
      }
    ];
    templatesPadrao.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }
  async criarCampanha(campanha) {
    const id = crypto.randomUUID();
    const novaCampanha = {
      ...campanha,
      id,
      totalEncontrados: 0,
      totalContatados: 0,
      totalInteressados: 0,
      totalContratados: 0,
      criadaEm: /* @__PURE__ */ new Date(),
      atualizadaEm: /* @__PURE__ */ new Date()
    };
    this.campanhas.set(id, novaCampanha);
    return novaCampanha;
  }
  async obterCampanhas(vagaId) {
    const campanhas = Array.from(this.campanhas.values());
    if (vagaId) {
      return campanhas.filter((c) => c.vagaId === vagaId);
    }
    return campanhas;
  }
  async buscarTalentos(campanhaId) {
    try {
      const campanha = this.campanhas.get(campanhaId);
      if (!campanha) {
        throw new Error("Campanha n\xE3o encontrada");
      }
      const inicioBusca = Date.now();
      const perfisEncontrados = [];
      const perfisLinkedIn = await this.buscarNoLinkedIn(campanha.criterios);
      const perfisGitHub = await this.buscarNoGitHub(campanha.criterios);
      const perfisPortfolio = await this.buscarEmPortfolios(campanha.criterios);
      const todosPerfis = [...perfisLinkedIn, ...perfisGitHub, ...perfisPortfolio];
      const perfisUnicos = this.removerDuplicatas(todosPerfis);
      const perfisFiltrados = this.aplicarFiltros(perfisUnicos, campanha.criterios);
      const vaga = await storage.getVaga(campanha.vagaId);
      if (vaga) {
        perfisFiltrados.forEach((perfil) => {
          perfil.scoreCompatibilidade = this.calcularScoreCompatibilidade(perfil, vaga);
          perfil.campanhaId = campanhaId;
        });
      }
      perfisFiltrados.sort((a, b) => (b.scoreCompatibilidade || 0) - (a.scoreCompatibilidade || 0));
      perfisFiltrados.forEach((perfil) => {
        this.perfis.set(perfil.id, perfil);
      });
      campanha.totalEncontrados = perfisFiltrados.length;
      campanha.atualizadaEm = /* @__PURE__ */ new Date();
      const tempoBusca = Date.now() - inicioBusca;
      return {
        perfis: perfisFiltrados,
        totalEncontrados: perfisFiltrados.length,
        tempoBusca,
        filtrosAplicados: this.obterFiltrosAplicados(campanha.criterios)
      };
    } catch (error) {
      console.error("Erro ao buscar talentos:", error);
      throw error;
    }
  }
  async contatarTalento(perfilId, templateId, variaveis) {
    try {
      const perfil = this.perfis.get(perfilId);
      const template = this.templates.get(templateId);
      if (!perfil || !template) {
        throw new Error("Perfil ou template n\xE3o encontrado");
      }
      let mensagem = template.mensagem;
      Object.entries(variaveis).forEach(([chave, valor]) => {
        const regex = new RegExp(`{{${chave}}}`, "g");
        mensagem = mensagem.replace(regex, valor);
      });
      console.log(`Enviando mensagem para ${perfil.nome} (${perfil.email}):`);
      console.log(`Assunto: ${template.assunto}`);
      console.log(`Mensagem: ${mensagem}`);
      perfil.status = "contatado";
      perfil.dataContato = /* @__PURE__ */ new Date();
      const campanhas = Array.from(this.campanhas.values());
      const campanha = campanhas.find((c) => c.id === perfil.campanhaId);
      if (campanha) {
        campanha.totalContatados++;
        campanha.atualizadaEm = /* @__PURE__ */ new Date();
      }
      return true;
    } catch (error) {
      console.error("Erro ao contatar talento:", error);
      return false;
    }
  }
  async atualizarStatusPerfil(perfilId, status, observacoes) {
    const perfil = this.perfis.get(perfilId);
    if (perfil) {
      perfil.status = status;
      if (observacoes) {
        perfil.observacoes = observacoes;
      }
      const campanhas = Array.from(this.campanhas.values());
      const campanha = campanhas.find((c) => c.id === perfil.campanhaId);
      if (campanha) {
        switch (status) {
          case "interessado":
            campanha.totalInteressados++;
            break;
          case "contratado":
            campanha.totalContratados++;
            break;
        }
        campanha.atualizadaEm = /* @__PURE__ */ new Date();
      }
    }
  }
  async obterPerfis(campanhaId, status) {
    const perfis = Array.from(this.perfis.values());
    let filtrados = perfis;
    if (campanhaId) {
      filtrados = filtrados.filter((p) => p.campanhaId === campanhaId);
    }
    if (status) {
      filtrados = filtrados.filter((p) => p.status === status);
    }
    return filtrados.sort((a, b) => (b.scoreCompatibilidade || 0) - (a.scoreCompatibilidade || 0));
  }
  async obterTemplatesContato() {
    return Array.from(this.templates.values()).filter((t) => t.ativo);
  }
  async criarTemplateContato(template) {
    const id = crypto.randomUUID();
    const novoTemplate = {
      ...template,
      id,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.templates.set(id, novoTemplate);
    return novoTemplate;
  }
  async obterEstatisticasHunting(campanhaId) {
    const perfis = await this.obterPerfis(campanhaId);
    const totalPerfis = perfis.length;
    const perfisContatados = perfis.filter((p) => p.status === "contatado" || p.status === "interessado" || p.status === "contratado").length;
    const perfisInteressados = perfis.filter((p) => p.status === "interessado" || p.status === "contratado").length;
    const perfisContratados = perfis.filter((p) => p.status === "contratado").length;
    const taxaResposta = perfisContatados > 0 ? perfisInteressados / perfisContatados * 100 : 0;
    const taxaConversao = totalPerfis > 0 ? perfisContratados / totalPerfis * 100 : 0;
    return {
      totalPerfis,
      perfisContatados,
      perfisInteressados,
      perfisContratados,
      taxaResposta: Math.round(taxaResposta * 100) / 100,
      taxaConversao: Math.round(taxaConversao * 100) / 100
    };
  }
  async buscarNoLinkedIn(criterios) {
    const perfis = [];
    const nomes = ["Jo\xE3o Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Ferreira"];
    const empresas2 = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"];
    const cargos = ["Desenvolvedor Senior", "Tech Lead", "Arquiteto de Software", "Engenheiro de Software"];
    for (let i = 0; i < 10; i++) {
      const perfil = {
        id: crypto.randomUUID(),
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        email: `candidato${i}@email.com`,
        linkedin: `https://linkedin.com/in/candidato${i}`,
        empresaAtual: empresas2[Math.floor(Math.random() * empresas2.length)],
        cargoAtual: cargos[Math.floor(Math.random() * cargos.length)],
        localizacao: "S\xE3o Paulo, SP",
        habilidades: criterios.habilidades.slice(0, Math.floor(Math.random() * 3) + 1),
        experiencia: Math.floor(Math.random() * 10) + 2,
        status: "disponivel",
        fonte: "linkedin",
        criadoEm: /* @__PURE__ */ new Date()
      };
      perfis.push(perfil);
    }
    return perfis;
  }
  async buscarNoGitHub(criterios) {
    const perfis = [];
    const nomes = ["Dev Silva", "Code Santos", "Tech Oliveira", "Hack Costa", "Bug Ferreira"];
    for (let i = 0; i < 5; i++) {
      const perfil = {
        id: crypto.randomUUID(),
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        github: `https://github.com/dev${i}`,
        empresaAtual: "Freelancer",
        cargoAtual: "Desenvolvedor Full Stack",
        localizacao: "Rio de Janeiro, RJ",
        habilidades: criterios.habilidades.slice(0, Math.floor(Math.random() * 2) + 1),
        experiencia: Math.floor(Math.random() * 8) + 1,
        status: "disponivel",
        fonte: "github",
        criadoEm: /* @__PURE__ */ new Date()
      };
      perfis.push(perfil);
    }
    return perfis;
  }
  async buscarEmPortfolios(criterios) {
    const perfis = [];
    const nomes = ["Port Silva", "Folio Santos", "Work Oliveira", "Show Costa", "Case Ferreira"];
    for (let i = 0; i < 3; i++) {
      const perfil = {
        id: crypto.randomUUID(),
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        portfolio: `https://portfolio${i}.dev`,
        empresaAtual: "Startup",
        cargoAtual: "Desenvolvedor Frontend",
        localizacao: "Belo Horizonte, MG",
        habilidades: criterios.habilidades.slice(0, Math.floor(Math.random() * 2) + 1),
        experiencia: Math.floor(Math.random() * 6) + 1,
        status: "disponivel",
        fonte: "portfolio",
        criadoEm: /* @__PURE__ */ new Date()
      };
      perfis.push(perfil);
    }
    return perfis;
  }
  removerDuplicatas(perfis) {
    const unicos = /* @__PURE__ */ new Map();
    perfis.forEach((perfil) => {
      const chave = perfil.email || perfil.linkedin || perfil.github || perfil.portfolio || perfil.nome;
      if (!unicos.has(chave)) {
        unicos.set(chave, perfil);
      }
    });
    return Array.from(unicos.values());
  }
  aplicarFiltros(perfis, criterios) {
    return perfis.filter((perfil) => {
      if (perfil.experiencia && perfil.experiencia < criterios.experienciaMinima) {
        return false;
      }
      if (criterios.experienciaMaxima && perfil.experiencia && perfil.experiencia > criterios.experienciaMaxima) {
        return false;
      }
      if (criterios.localizacao && criterios.localizacao.length > 0) {
        if (!perfil.localizacao || !criterios.localizacao.some(
          (loc) => perfil.localizacao?.toLowerCase().includes(loc.toLowerCase())
        )) {
          return false;
        }
      }
      if (criterios.empresasExcluidas && criterios.empresasExcluidas.length > 0) {
        if (perfil.empresaAtual && criterios.empresasExcluidas.some(
          (emp) => perfil.empresaAtual?.toLowerCase().includes(emp.toLowerCase())
        )) {
          return false;
        }
      }
      return true;
    });
  }
  calcularScoreCompatibilidade(perfil, vaga) {
    let score = 0;
    if (perfil.habilidades && vaga.requisitos) {
      const requisitos = vaga.requisitos.toLowerCase();
      const habilidadesMatch = perfil.habilidades.filter(
        (hab) => requisitos.includes(hab.toLowerCase())
      );
      score += habilidadesMatch.length / perfil.habilidades.length * 40;
    }
    if (perfil.experiencia) {
      if (perfil.experiencia >= 5) score += 30;
      else if (perfil.experiencia >= 3) score += 20;
      else if (perfil.experiencia >= 1) score += 10;
    }
    if (perfil.localizacao && vaga.cidade) {
      if (perfil.localizacao.toLowerCase().includes(vaga.cidade.toLowerCase())) {
        score += 20;
      } else if (perfil.localizacao.toLowerCase().includes(vaga.estado?.toLowerCase() || "")) {
        score += 10;
      }
    }
    if (perfil.empresaAtual) {
      const empresasTop = ["google", "microsoft", "amazon", "meta", "apple", "netflix"];
      if (empresasTop.some((emp) => perfil.empresaAtual?.toLowerCase().includes(emp))) {
        score += 10;
      }
    }
    return Math.min(score, 100);
  }
  obterFiltrosAplicados(criterios) {
    const filtros = [];
    if (criterios.habilidades.length > 0) {
      filtros.push(`Habilidades: ${criterios.habilidades.join(", ")}`);
    }
    if (criterios.experienciaMinima > 0) {
      filtros.push(`Experi\xEAncia m\xEDnima: ${criterios.experienciaMinima} anos`);
    }
    if (criterios.localizacao && criterios.localizacao.length > 0) {
      filtros.push(`Localiza\xE7\xE3o: ${criterios.localizacao.join(", ")}`);
    }
    return filtros;
  }
};
var sistemaHunting = new SistemaHunting();

// server/multicliente.ts
var SistemaMultiCliente = class {
  clientes = /* @__PURE__ */ new Map();
  usuariosClientes = /* @__PURE__ */ new Map();
  faturamentos = /* @__PURE__ */ new Map();
  constructor() {
    this.carregarClientesExemplo();
  }
  carregarClientesExemplo() {
    const clientesExemplo = [
      {
        id: "cliente-1",
        nome: "TechCorp Solutions",
        razaoSocial: "TechCorp Solutions Ltda",
        cnpj: "12.345.678/0001-90",
        email: "contato@techcorp.com",
        telefone: "(11) 99999-9999",
        endereco: "Rua das Tecnologias, 123",
        cidade: "S\xE3o Paulo",
        estado: "SP",
        cep: "01234-567",
        responsavel: "Jo\xE3o Silva",
        cargoResponsavel: "Diretor de RH",
        plano: "profissional",
        status: "ativo",
        dataContrato: /* @__PURE__ */ new Date("2024-01-01"),
        dataVencimento: /* @__PURE__ */ new Date("2024-12-31"),
        limiteUsuarios: 10,
        limiteVagas: 50,
        recursosAtivos: ["ranking", "triagem", "comunicacao", "relatorios"],
        configuracoes: {
          tema: "claro",
          idioma: "pt-BR",
          fusoHorario: "America/Sao_Paulo",
          formatoData: "dd/MM/yyyy",
          formatoMoeda: "BRL",
          notificacoes: {
            email: true,
            push: true,
            sms: false
          },
          integracoes: {
            linkedin: true,
            indeed: false,
            glassdoor: false,
            zapier: false
          },
          personalizacao: {
            cores: {
              primaria: "#3B82F6",
              secundaria: "#1E40AF",
              acento: "#F59E0B"
            }
          },
          permissoes: {
            criarVagas: true,
            editarVagas: true,
            excluirVagas: true,
            visualizarCandidatos: true,
            editarCandidatos: true,
            excluirCandidatos: false,
            gerarRelatorios: true,
            configurarSistema: false,
            gerenciarUsuarios: true,
            hunting: true,
            parsing: true
          }
        },
        criadoEm: /* @__PURE__ */ new Date("2024-01-01"),
        atualizadoEm: /* @__PURE__ */ new Date()
      },
      {
        id: "cliente-2",
        nome: "Startup Inovadora",
        razaoSocial: "Startup Inovadora Ltda",
        cnpj: "98.765.432/0001-10",
        email: "rh@startupinovadora.com",
        telefone: "(21) 88888-8888",
        endereco: "Av. da Inova\xE7\xE3o, 456",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "20000-000",
        responsavel: "Maria Santos",
        cargoResponsavel: "Head de People",
        plano: "basico",
        status: "ativo",
        dataContrato: /* @__PURE__ */ new Date("2024-02-01"),
        dataVencimento: /* @__PURE__ */ new Date("2024-12-31"),
        limiteUsuarios: 5,
        limiteVagas: 20,
        recursosAtivos: ["ranking", "triagem"],
        configuracoes: {
          tema: "escuro",
          idioma: "pt-BR",
          fusoHorario: "America/Sao_Paulo",
          formatoData: "dd/MM/yyyy",
          formatoMoeda: "BRL",
          notificacoes: {
            email: true,
            push: false,
            sms: false
          },
          integracoes: {
            linkedin: false,
            indeed: false,
            glassdoor: false,
            zapier: false
          },
          personalizacao: {
            cores: {
              primaria: "#10B981",
              secundaria: "#059669",
              acento: "#F59E0B"
            }
          },
          permissoes: {
            criarVagas: true,
            editarVagas: true,
            excluirVagas: false,
            visualizarCandidatos: true,
            editarCandidatos: false,
            excluirCandidatos: false,
            gerarRelatorios: false,
            configurarSistema: false,
            gerenciarUsuarios: false,
            hunting: false,
            parsing: false
          }
        },
        criadoEm: /* @__PURE__ */ new Date("2024-02-01"),
        atualizadoEm: /* @__PURE__ */ new Date()
      }
    ];
    clientesExemplo.forEach((cliente) => {
      this.clientes.set(cliente.id, cliente);
    });
  }
  async criarCliente(cliente) {
    const id = crypto.randomUUID();
    const novoCliente = {
      ...cliente,
      id,
      criadoEm: /* @__PURE__ */ new Date(),
      atualizadoEm: /* @__PURE__ */ new Date()
    };
    this.clientes.set(id, novoCliente);
    return novoCliente;
  }
  async obterCliente(clienteId) {
    return this.clientes.get(clienteId) || null;
  }
  async obterTodosClientes() {
    return Array.from(this.clientes.values());
  }
  async atualizarCliente(clienteId, dados) {
    const cliente = this.clientes.get(clienteId);
    if (!cliente) return null;
    const clienteAtualizado = {
      ...cliente,
      ...dados,
      atualizadoEm: /* @__PURE__ */ new Date()
    };
    this.clientes.set(clienteId, clienteAtualizado);
    return clienteAtualizado;
  }
  async adicionarUsuarioCliente(usuarioCliente) {
    const id = crypto.randomUUID();
    const novoUsuario = {
      ...usuarioCliente,
      id,
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.usuariosClientes.set(id, novoUsuario);
    return novoUsuario;
  }
  async obterUsuariosCliente(clienteId) {
    const usuarios2 = Array.from(this.usuariosClientes.values());
    return usuarios2.filter((u) => u.clienteId === clienteId);
  }
  async obterUsuarioCliente(usuarioId) {
    const usuarios2 = Array.from(this.usuariosClientes.values());
    return usuarios2.find((u) => u.usuarioId === usuarioId) || null;
  }
  async verificarPermissao(usuarioId, permissao) {
    const usuarioCliente = await this.obterUsuarioCliente(usuarioId);
    if (!usuarioCliente) return false;
    const cliente = await this.obterCliente(usuarioCliente.clienteId);
    if (!cliente) return false;
    if (!cliente.recursosAtivos.includes(permissao)) {
      return false;
    }
    if (usuarioCliente.permissoes.includes(permissao)) {
      return true;
    }
    switch (usuarioCliente.perfil) {
      case "admin":
        return true;
      case "gerente":
        return ["criarVagas", "editarVagas", "visualizarCandidatos", "editarCandidatos", "gerarRelatorios", "gerenciarUsuarios"].includes(permissao);
      case "recrutador":
        return ["criarVagas", "editarVagas", "visualizarCandidatos", "editarCandidatos"].includes(permissao);
      case "visualizador":
        return ["visualizarCandidatos", "gerarRelatorios"].includes(permissao);
      default:
        return false;
    }
  }
  async obterConfiguracaoCliente(clienteId) {
    const cliente = await this.obterCliente(clienteId);
    return cliente?.configuracoes || null;
  }
  async atualizarConfiguracaoCliente(clienteId, configuracao) {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) return null;
    const configuracaoAtualizada = {
      ...cliente.configuracoes,
      ...configuracao
    };
    await this.atualizarCliente(clienteId, { configuracoes: configuracaoAtualizada });
    return configuracaoAtualizada;
  }
  async obterEstatisticasCliente(clienteId) {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) {
      throw new Error("Cliente n\xE3o encontrado");
    }
    const usuarios2 = await this.obterUsuariosCliente(clienteId);
    const empresas2 = await storage.getAllEmpresas();
    const empresasCliente = empresas2.filter((e) => e.clienteId === clienteId);
    const totalVagas = Math.floor(Math.random() * cliente.limiteVagas);
    const vagasAtivas = Math.floor(totalVagas * 0.7);
    const totalCandidatos = Math.floor(Math.random() * 1e3);
    const totalCandidaturas = Math.floor(totalCandidatos * 0.3);
    const contratacoesMes = Math.floor(Math.random() * 20);
    const faturamentoMes = contratacoesMes * 5e3;
    const usoRecursos = {};
    cliente.recursosAtivos.forEach((recurso) => {
      usoRecursos[recurso] = Math.floor(Math.random() * 100);
    });
    return {
      totalUsuarios: usuarios2.length,
      usuariosAtivos: usuarios2.filter((u) => u.status === "ativo").length,
      totalVagas,
      vagasAtivas,
      totalCandidatos,
      totalCandidaturas,
      contratacoesMes,
      faturamentoMes,
      usoRecursos
    };
  }
  async gerarFaturamento(clienteId, mes, ano) {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) {
      throw new Error("Cliente n\xE3o encontrado");
    }
    const id = crypto.randomUUID();
    const valorPlano = this.obterValorPlano(cliente.plano);
    const dataVencimento = new Date(ano, mes - 1, 10);
    const faturamento = {
      id,
      clienteId,
      mes,
      ano,
      valor: valorPlano,
      status: "pendente",
      dataVencimento,
      itens: [
        {
          descricao: `Plano ${cliente.plano} - ${mes}/${ano}`,
          quantidade: 1,
          valorUnitario: valorPlano,
          valorTotal: valorPlano
        }
      ],
      criadoEm: /* @__PURE__ */ new Date()
    };
    this.faturamentos.set(id, faturamento);
    return faturamento;
  }
  async obterFaturamentosCliente(clienteId) {
    const faturamentos = Array.from(this.faturamentos.values());
    return faturamentos.filter((f) => f.clienteId === clienteId);
  }
  async marcarFaturamentoComoPago(faturamentoId) {
    const faturamento = this.faturamentos.get(faturamentoId);
    if (faturamento) {
      faturamento.status = "pago";
      faturamento.dataPagamento = /* @__PURE__ */ new Date();
    }
  }
  async verificarLimitesCliente(clienteId, tipo) {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) {
      throw new Error("Cliente n\xE3o encontrado");
    }
    if (tipo === "usuarios") {
      const usuarios2 = await this.obterUsuariosCliente(clienteId);
      return {
        dentroLimite: usuarios2.length < cliente.limiteUsuarios,
        atual: usuarios2.length,
        limite: cliente.limiteUsuarios
      };
    } else {
      const empresas2 = await storage.getAllEmpresas();
      const empresasCliente = empresas2.filter((e) => e.clienteId === clienteId);
      const totalVagas = empresasCliente.reduce((total, empresa) => total + (empresa.totalVagas || 0), 0);
      return {
        dentroLimite: totalVagas < cliente.limiteVagas,
        atual: totalVagas,
        limite: cliente.limiteVagas
      };
    }
  }
  async obterClientesVencendo() {
    const hoje = /* @__PURE__ */ new Date();
    const clientes = Array.from(this.clientes.values());
    return clientes.filter((cliente) => {
      const diasParaVencimento = Math.ceil((cliente.dataVencimento.getTime() - hoje.getTime()) / (1e3 * 60 * 60 * 24));
      return diasParaVencimento <= 30 && cliente.status === "ativo";
    });
  }
  async obterClientesInativos() {
    const clientes = Array.from(this.clientes.values());
    return clientes.filter((cliente) => cliente.status === "inativo" || cliente.status === "suspenso");
  }
  obterValorPlano(plano) {
    switch (plano) {
      case "basico":
        return 299;
      case "profissional":
        return 599;
      case "enterprise":
        return 1299;
      default:
        return 299;
    }
  }
};
var sistemaMultiCliente = new SistemaMultiCliente();

// server/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}
var supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
var supabasePublic = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY
);
var authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token de autentica\xE7\xE3o n\xE3o fornecido" });
    }
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: "Token inv\xE1lido" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Erro na autentica\xE7\xE3o:", error);
    return res.status(401).json({ message: "Erro na autentica\xE7\xE3o" });
  }
};
var getAuthenticatedUser = (req) => {
  return req.user;
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, senha, tipo, ...userData } = req.body;
      const usuarioData = insertUsuarioSchema.parse({ email, senha, tipo });
      const existingUser = await storage.getUsuarioByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email j\xE1 cadastrado" });
      }
      const hashedPassword = await bcrypt.hash(senha, 10);
      const usuario = await storage.createUsuario({
        ...usuarioData,
        senha: hashedPassword
      });
      if (tipo === "candidato") {
        const candidatoData = insertCandidatoSchema.parse({ id: usuario.id, ...userData });
        const candidato = await storage.createCandidato(candidatoData);
        return res.json({ usuario, profile: candidato });
      } else if (tipo === "empresa") {
        const empresaData = insertEmpresaSchema.parse({ id: usuario.id, ...userData });
        const empresa = await storage.createEmpresa(empresaData);
        return res.json({ usuario, profile: empresa });
      }
      res.json({ usuario });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Erro no cadastro" });
    }
  });
  app2.get("/api/auth/me", authenticateUser, async (req, res) => {
    try {
      console.log("\u{1F510} Auth/me: Iniciando verifica\xE7\xE3o de usu\xE1rio...");
      const user = getAuthenticatedUser(req);
      if (!user || !user.id) {
        console.error("\u274C Auth/me: Usu\xE1rio n\xE3o encontrado no token");
        return res.status(401).json({ message: "Token inv\xE1lido - usu\xE1rio n\xE3o encontrado" });
      }
      console.log("\u{1F464} Auth/me: Buscando usu\xE1rio ID:", user.id);
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("\u274C Auth/me: Vari\xE1veis de ambiente do Supabase n\xE3o configuradas");
        return res.status(500).json({
          message: "Configura\xE7\xE3o do Supabase ausente",
          details: "Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env"
        });
      }
      const { data: usuario, error: usuarioError } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (usuarioError) {
        console.error("\u274C Auth/me: Erro ao buscar usu\xE1rio no Supabase:", usuarioError);
        if (usuarioError.code === "42P01") {
          return res.status(500).json({
            message: "Tabela 'usuarios' n\xE3o existe no Supabase",
            details: "Execute o script SQL fornecido no arquivo CONFIGURE-SUPABASE.md"
          });
        }
        return res.status(500).json({
          message: "Erro no banco de dados",
          details: usuarioError.message,
          code: usuarioError.code
        });
      }
      if (!usuario) {
        console.error("\u274C Auth/me: Usu\xE1rio n\xE3o encontrado na base de dados:", user.id);
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado na base de dados" });
      }
      console.log("\u2705 Auth/me: Usu\xE1rio encontrado:", usuario.email, "Tipo:", usuario.type);
      let profile = null;
      if (usuario.type === "candidato") {
        console.log("\u{1F4C4} Auth/me: Buscando perfil de candidato...");
        const { data: candidato, error: candidatoError } = await supabase.from("candidatos").select("*").eq("id", usuario.id).single();
        if (candidatoError && candidatoError.code !== "PGRST116") {
          console.error("\u274C Auth/me: Erro ao buscar candidato:", candidatoError);
        }
        profile = candidato;
      } else if (usuario.type === "empresa") {
        console.log("\u{1F3E2} Auth/me: Buscando perfil de empresa...");
        const { data: empresa, error: empresaError } = await supabase.from("empresas").select("*").eq("id", usuario.id).single();
        if (empresaError && empresaError.code !== "PGRST116") {
          console.error("\u274C Auth/me: Erro ao buscar empresa:", empresaError);
        }
        profile = empresa;
      }
      console.log("\u{1F389} Auth/me: Dados retornados com sucesso");
      res.json({
        usuario: { ...usuario, senha: void 0 },
        profile
      });
    } catch (error) {
      console.error("\u{1F4A5} Auth/me: Erro geral:", error);
      if (error.message?.includes("connect ECONNREFUSED")) {
        return res.status(500).json({
          message: "Erro de conex\xE3o com Supabase",
          details: "Verifique se o SUPABASE_URL est\xE1 correto e se o projeto est\xE1 ativo"
        });
      }
      res.status(500).json({
        message: "Erro interno do servidor",
        details: error.message || "Erro desconhecido"
      });
    }
  });
  app2.get("/api/candidatos/:id", async (req, res) => {
    try {
      const candidato = await storage.getCandidato(req.params.id);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato n\xE3o encontrado" });
      }
      res.json(candidato);
    } catch (error) {
      console.error("Get candidato error:", error);
      res.status(500).json({ message: "Erro ao buscar candidato" });
    }
  });
  app2.put("/api/candidatos/:id", async (req, res) => {
    try {
      const candidatoData = insertCandidatoSchema.partial().parse(req.body);
      const candidato = await storage.updateCandidato(req.params.id, candidatoData);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato n\xE3o encontrado" });
      }
      res.json(candidato);
    } catch (error) {
      console.error("Update candidato error:", error);
      res.status(400).json({ message: "Erro ao atualizar candidato" });
    }
  });
  app2.get("/api/empresas/:id", async (req, res) => {
    try {
      const empresa = await storage.getEmpresa(req.params.id);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa n\xE3o encontrada" });
      }
      res.json(empresa);
    } catch (error) {
      console.error("Get empresa error:", error);
      res.status(500).json({ message: "Erro ao buscar empresa" });
    }
  });
  app2.put("/api/empresas/:id", async (req, res) => {
    try {
      const empresaData = insertEmpresaSchema.partial().parse(req.body);
      const empresa = await storage.updateEmpresa(req.params.id, empresaData);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa n\xE3o encontrada" });
      }
      res.json(empresa);
    } catch (error) {
      console.error("Update empresa error:", error);
      res.status(400).json({ message: "Erro ao atualizar empresa" });
    }
  });
  app2.get("/api/vagas", async (req, res) => {
    try {
      const vagas2 = await storage.getAllVagas();
      res.json(vagas2);
    } catch (error) {
      console.error("Get vagas error:", error);
      res.status(500).json({ message: "Erro ao buscar vagas" });
    }
  });
  app2.get("/api/vagas/empresa/:empresaId", async (req, res) => {
    try {
      const vagas2 = await storage.getVagasByEmpresa(req.params.empresaId);
      res.json(vagas2);
    } catch (error) {
      console.error("Get vagas by empresa error:", error);
      res.status(500).json({ message: "Erro ao buscar vagas da empresa" });
    }
  });
  app2.post("/api/vagas", async (req, res) => {
    try {
      const vagaData = insertVagaSchema.parse(req.body);
      const vaga = await storage.createVaga(vagaData);
      res.json(vaga);
    } catch (error) {
      console.error("Create vaga error:", error);
      res.status(400).json({ message: "Erro ao criar vaga" });
    }
  });
  app2.put("/api/vagas/:id", async (req, res) => {
    try {
      const vagaData = insertVagaSchema.partial().parse(req.body);
      const vaga = await storage.updateVaga(req.params.id, vagaData);
      if (!vaga) {
        return res.status(404).json({ message: "Vaga n\xE3o encontrada" });
      }
      res.json(vaga);
    } catch (error) {
      console.error("Update vaga error:", error);
      res.status(400).json({ message: "Erro ao atualizar vaga" });
    }
  });
  app2.delete("/api/vagas/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVaga(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Vaga n\xE3o encontrada" });
      }
      res.json({ message: "Vaga deletada com sucesso" });
    } catch (error) {
      console.error("Delete vaga error:", error);
      res.status(500).json({ message: "Erro ao deletar vaga" });
    }
  });
  app2.get("/api/candidaturas/candidato/:candidatoId", async (req, res) => {
    try {
      const candidaturas2 = await storage.getCandidaturasByCandidato(req.params.candidatoId);
      res.json(candidaturas2);
    } catch (error) {
      console.error("Get candidaturas error:", error);
      res.status(500).json({ message: "Erro ao buscar candidaturas" });
    }
  });
  app2.get("/api/candidaturas/vaga/:vagaId", async (req, res) => {
    try {
      const candidaturas2 = await storage.getCandidaturasByVaga(req.params.vagaId);
      res.json(candidaturas2);
    } catch (error) {
      console.error("Get candidaturas by vaga error:", error);
      res.status(500).json({ message: "Erro ao buscar candidaturas da vaga" });
    }
  });
  app2.post("/api/candidaturas", async (req, res) => {
    try {
      const candidaturaData = insertCandidaturaSchema.parse(req.body);
      const exists = await storage.checkCandidaturaExists(
        candidaturaData.vagaId,
        candidaturaData.candidatoId
      );
      if (exists) {
        return res.status(400).json({ message: "Voc\xEA j\xE1 se candidatou a esta vaga" });
      }
      const candidatura = await storage.createCandidatura(candidaturaData);
      res.json(candidatura);
    } catch (error) {
      console.error("Create candidatura error:", error);
      res.status(400).json({ message: "Erro ao se candidatar" });
    }
  });
  app2.post("/api/banco-talentos", async (req, res) => {
    try {
      const talentoData = insertBancoTalentosSchema.parse(req.body);
      const talento = await storage.createBancoTalentos(talentoData);
      res.json(talento);
    } catch (error) {
      console.error("Create banco talentos error:", error);
      res.status(400).json({ message: "Erro ao cadastrar no banco de talentos" });
    }
  });
  app2.get("/api/banco-talentos", async (req, res) => {
    try {
      const talentos = await storage.getAllBancoTalentos();
      res.json(talentos);
    } catch (error) {
      console.error("Get banco talentos error:", error);
      res.status(500).json({ message: "Erro ao buscar talentos" });
    }
  });
  app2.get("/api/banco-talentos/compativel/:area", async (req, res) => {
    try {
      const { area } = req.params;
      const todosTalentos = await storage.getAllBancoTalentos();
      const talentosCompativeis = todosTalentos.filter(
        (talento) => talento.areaInteresse?.toLowerCase() === area.toLowerCase()
      );
      res.json(talentosCompativeis);
    } catch (error) {
      console.error("Get compatible talents error:", error);
      res.status(500).json({ message: "Erro ao buscar talentos compat\xEDveis" });
    }
  });
  app2.post("/api/contatos", async (req, res) => {
    try {
      const contatoData = insertContatoSchema.parse(req.body);
      const contato = await storage.createContato(contatoData);
      res.json(contato);
    } catch (error) {
      console.error("Create contato error:", error);
      res.status(400).json({ message: "Erro ao enviar mensagem" });
    }
  });
  app2.get("/api/contatos", async (req, res) => {
    try {
      const contatos2 = await storage.getAllContatos();
      res.json(contatos2);
    } catch (error) {
      console.error("Get contatos error:", error);
      res.status(500).json({ message: "Erro ao buscar contatos" });
    }
  });
  app2.get("/api/admin/candidatos", async (req, res) => {
    try {
      const candidatos2 = await storage.getAllCandidatos();
      res.json(candidatos2);
    } catch (error) {
      console.error("Get all candidatos error:", error);
      res.status(500).json({ message: "Erro ao buscar candidatos" });
    }
  });
  app2.get("/api/admin/empresas", async (req, res) => {
    try {
      const empresas2 = await storage.getAllEmpresas();
      res.json(empresas2);
    } catch (error) {
      console.error("Get all empresas error:", error);
      res.status(500).json({ message: "Erro ao buscar empresas" });
    }
  });
  app2.delete("/api/admin/candidatos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCandidato(id);
      if (deleted) {
        res.json({ message: "Candidato removido com sucesso" });
      } else {
        res.status(404).json({ message: "Candidato n\xE3o encontrado" });
      }
    } catch (error) {
      console.error("Delete candidato error:", error);
      res.status(500).json({ message: "Erro ao remover candidato" });
    }
  });
  app2.delete("/api/admin/empresas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEmpresa(id);
      if (deleted) {
        res.json({ message: "Empresa removida com sucesso" });
      } else {
        res.status(404).json({ message: "Empresa n\xE3o encontrada" });
      }
    } catch (error) {
      console.error("Delete empresa error:", error);
      res.status(500).json({ message: "Erro ao remover empresa" });
    }
  });
  app2.post("/api/admin/servicos", async (req, res) => {
    try {
      const servicoData = insertServicoSchema.parse(req.body);
      const servico = await storage.createServico(servicoData);
      res.json(servico);
    } catch (error) {
      console.error("Create servico error:", error);
      res.status(400).json({ message: "Erro ao criar servi\xE7o" });
    }
  });
  app2.get("/api/admin/servicos", async (req, res) => {
    try {
      const servicos2 = await storage.getAllServicos();
      res.json(servicos2);
    } catch (error) {
      console.error("Get servicos error:", error);
      res.status(500).json({ message: "Erro ao buscar servi\xE7os" });
    }
  });
  app2.patch("/api/admin/servicos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const servico = await storage.updateServico(id, updateData);
      if (servico) {
        res.json(servico);
      } else {
        res.status(404).json({ message: "Servi\xE7o n\xE3o encontrado" });
      }
    } catch (error) {
      console.error("Update servico error:", error);
      res.status(400).json({ message: "Erro ao atualizar servi\xE7o" });
    }
  });
  app2.delete("/api/admin/servicos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteServico(id);
      if (deleted) {
        res.json({ message: "Servi\xE7o removido com sucesso" });
      } else {
        res.status(404).json({ message: "Servi\xE7o n\xE3o encontrado" });
      }
    } catch (error) {
      console.error("Delete servico error:", error);
      res.status(500).json({ message: "Erro ao remover servi\xE7o" });
    }
  });
  app2.post("/api/admin/propostas", async (req, res) => {
    try {
      const propostaData = insertPropostaSchema.parse(req.body);
      const proposta = await storage.createProposta(propostaData);
      res.json(proposta);
    } catch (error) {
      console.error("Create proposta error:", error);
      res.status(400).json({ message: "Erro ao criar proposta" });
    }
  });
  app2.get("/api/admin/propostas", async (req, res) => {
    try {
      const propostas2 = await storage.getAllPropostas();
      res.json(propostas2);
    } catch (error) {
      console.error("Get propostas error:", error);
      res.status(500).json({ message: "Erro ao buscar propostas" });
    }
  });
  app2.patch("/api/admin/propostas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const proposta = await storage.updateProposta(id, updateData);
      if (proposta) {
        res.json(proposta);
      } else {
        res.status(404).json({ message: "Proposta n\xE3o encontrada" });
      }
    } catch (error) {
      console.error("Update proposta error:", error);
      res.status(400).json({ message: "Erro ao atualizar proposta" });
    }
  });
  app2.post("/api/admin/relatorios", async (req, res) => {
    try {
      const relatorioData = insertRelatorioSchema.parse(req.body);
      const relatorio = await storage.createRelatorio(relatorioData);
      res.json(relatorio);
    } catch (error) {
      console.error("Create relatorio error:", error);
      res.status(400).json({ message: "Erro ao criar relat\xF3rio" });
    }
  });
  app2.get("/api/admin/relatorios", async (req, res) => {
    try {
      const relatorios2 = await storage.getAllRelatorios();
      res.json(relatorios2);
    } catch (error) {
      console.error("Get relatorios error:", error);
      res.status(500).json({ message: "Erro ao buscar relat\xF3rios" });
    }
  });
  app2.post("/api/testes-disc", async (req, res) => {
    try {
      const testeData = insertTestesDiscSchema.parse(req.body);
      const teste = await storage.createTesteDISC(testeData);
      await storage.updateCandidatoDISC(testeData.candidatoId, {
        perfilDisc: testeData.perfilDominante,
        pontuacaoD: testeData.pontuacaoD,
        pontuacaoI: testeData.pontuacaoI,
        pontuacaoS: testeData.pontuacaoS,
        pontuacaoC: testeData.pontuacaoC,
        dataTesteDISC: /* @__PURE__ */ new Date()
      });
      res.json(teste);
    } catch (error) {
      console.error("Create teste DISC error:", error);
      res.status(400).json({ message: "Erro ao salvar teste DISC" });
    }
  });
  app2.get("/api/testes-disc/candidato/:candidatoId", async (req, res) => {
    try {
      const { candidatoId } = req.params;
      const teste = await storage.getTesteDISCByCandidato(candidatoId);
      if (teste) {
        res.json(teste);
      } else {
        res.status(404).json({ message: "Teste DISC n\xE3o encontrado" });
      }
    } catch (error) {
      console.error("Get teste DISC error:", error);
      res.status(500).json({ message: "Erro ao buscar teste DISC" });
    }
  });
  app2.post("/api/seed-test-data", async (req, res) => {
    try {
      const existingCandidatos = await storage.getAllCandidatos();
      if (existingCandidatos.length > 0) {
        return res.status(400).json({ message: "Dados de teste j\xE1 existem" });
      }
      const candidatos2 = [];
      const joaoUser = await storage.createUsuario({
        email: "joao.silva@email.com",
        senha: await bcrypt.hash("senha123", 10),
        tipo: "candidato"
      });
      const joao = await storage.createCandidato({
        id: joaoUser.id,
        nome: "Jo\xE3o Carlos Silva",
        telefone: "(47) 98765-4321",
        cidade: "Blumenau",
        estado: "SC",
        linkedin: "https://linkedin.com/in/joaosilva",
        github: "https://github.com/joaosilva",
        portfolio: "https://joaosilva.dev",
        sobre: "Desenvolvedor Full Stack com 5 anos de experi\xEAncia em React, Node.js e PostgreSQL.",
        experiencia: "Desenvolvedor S\xEAnior na Tech Solutions (2020-presente)",
        educacao: "Bacharelado em Ci\xEAncia da Computa\xE7\xE3o - FURB (2014-2018)",
        habilidades: "JavaScript, TypeScript, React, Node.js, PostgreSQL",
        fotoPerfil: "https://ui-avatars.com/api/?name=Joao+Silva&background=0D8ABC&color=fff",
        perfilDisc: "dominante",
        pontuacaoD: 85,
        pontuacaoI: 65,
        pontuacaoS: 45,
        pontuacaoC: 75,
        dataTesteDISC: /* @__PURE__ */ new Date("2024-01-15")
      });
      candidatos2.push(joao);
      const mariaUser = await storage.createUsuario({
        email: "maria.santos@email.com",
        senha: await bcrypt.hash("senha123", 10),
        tipo: "candidato"
      });
      const maria = await storage.createCandidato({
        id: mariaUser.id,
        nome: "Maria Fernanda Santos",
        telefone: "(47) 99876-5432",
        cidade: "Joinville",
        estado: "SC",
        linkedin: "https://linkedin.com/in/mariasantos",
        sobre: "Analista de RH com especializa\xE7\xE3o em Recrutamento e Sele\xE7\xE3o.",
        experiencia: "Analista de RH S\xEAnior - Grupo Industrial ABC (2019-presente)",
        educacao: "Psicologia - UNIVILLE (2012-2016)",
        habilidades: "Recrutamento e Sele\xE7\xE3o, Gest\xE3o de Talentos",
        fotoPerfil: "https://ui-avatars.com/api/?name=Maria+Santos&background=FF6B6B&color=fff",
        perfilDisc: "influente",
        pontuacaoD: 55,
        pontuacaoI: 90,
        pontuacaoS: 75,
        pontuacaoC: 60,
        dataTesteDISC: /* @__PURE__ */ new Date("2024-01-20")
      });
      candidatos2.push(maria);
      const empresas2 = [];
      const techUser = await storage.createUsuario({
        email: "rh@techsolutions.com.br",
        senha: await bcrypt.hash("senha123", 10),
        tipo: "empresa"
      });
      const techSolutions = await storage.createEmpresa({
        id: techUser.id,
        nome: "Tech Solutions Brasil",
        cnpj: "12.345.678/0001-90",
        telefone: "(47) 3333-4444",
        site: "https://techsolutions.com.br",
        linkedin: "https://linkedin.com/company/techsolutions",
        sobre: "Empresa l\xEDder em solu\xE7\xF5es tecnol\xF3gicas para o mercado B2B.",
        endereco: "Rua das Palmeiras, 123",
        cidade: "Blumenau",
        estado: "SC",
        cep: "89010-000",
        nomeResponsavel: "Ana Paula Mendes",
        emailResponsavel: "ana.mendes@techsolutions.com.br",
        cargoResponsavel: "Gerente de RH",
        numeroFuncionarios: "150",
        setorAtuacao: "Tecnologia da Informa\xE7\xE3o",
        missao: "Transformar neg\xF3cios atrav\xE9s da tecnologia",
        visao: "Ser refer\xEAncia nacional em desenvolvimento de software",
        valores: "Inova\xE7\xE3o, Qualidade, \xC9tica",
        logoEmpresa: "https://ui-avatars.com/api/?name=Tech+Solutions&background=1E40AF&color=fff"
      });
      empresas2.push(techSolutions);
      const vagas2 = [];
      const vaga1 = await storage.createVaga({
        empresaId: techSolutions.id,
        titulo: "Desenvolvedor Full Stack S\xEAnior",
        descricao: "Buscamos desenvolvedor Full Stack experiente para liderar projetos.",
        requisitos: "5+ anos de experi\xEAncia, React, Node.js, PostgreSQL",
        beneficios: ["Vale Alimenta\xE7\xE3o", "Vale Refei\xE7\xE3o", "Plano de Sa\xFAde", "Home Office"],
        salario: "R$ 12.000 - R$ 18.000",
        cidade: "Blumenau",
        estado: "SC",
        tipoContrato: "CLT",
        area: "Tecnologia",
        nivel: "senior",
        modalidade: "hibrido",
        dataPublicacao: /* @__PURE__ */ new Date(),
        ativo: true
      });
      vagas2.push(vaga1);
      const vaga2 = await storage.createVaga({
        empresaId: techSolutions.id,
        titulo: "Analista de RH Pleno",
        descricao: "Vaga para profissional de RH com foco em recrutamento.",
        requisitos: "Experi\xEAncia em R&S, Excel avan\xE7ado",
        beneficios: ["Vale Alimenta\xE7\xE3o", "Plano de Sa\xFAde", "Gympass"],
        salario: "R$ 4.000 - R$ 6.000",
        cidade: "Blumenau",
        estado: "SC",
        tipoContrato: "CLT",
        area: "Recursos Humanos",
        nivel: "pleno",
        modalidade: "presencial",
        dataPublicacao: /* @__PURE__ */ new Date(),
        ativo: true
      });
      vagas2.push(vaga2);
      await storage.createCandidatura({
        vagaId: vaga1.id,
        candidatoId: joao.id,
        dataCandidatura: /* @__PURE__ */ new Date(),
        status: "em_analise",
        compatibilidadeDisc: 85
      });
      await storage.createCandidatura({
        vagaId: vaga2.id,
        candidatoId: maria.id,
        dataCandidatura: /* @__PURE__ */ new Date(),
        status: "em_analise",
        compatibilidadeDisc: 92
      });
      res.json({
        message: "Dados de teste criados com sucesso!",
        candidatos: candidatos2.length,
        empresas: empresas2.length,
        vagas: vagas2.length
      });
    } catch (error) {
      console.error("Erro ao criar dados de teste:", error);
      res.status(500).json({ message: "Erro ao criar dados de teste" });
    }
  });
  app2.get("/api/vagas/:vagaId/candidatos-ranking", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      const candidatosComClassificacao = candidatosComScore.map((candidato) => ({
        ...candidato,
        classificacao: obterClassificacaoScore(candidato.score)
      }));
      res.json(candidatosComClassificacao);
    } catch (error) {
      console.error("Get candidatos ranking error:", error);
      res.status(500).json({ message: "Erro ao obter ranking de candidatos" });
    }
  });
  app2.post("/api/vagas/:vagaId/triagem-automatica", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const resultados = await sistemaTriagem.aplicarTriagemAutomatica(vagaId);
      res.json({
        message: "Triagem autom\xE1tica aplicada com sucesso",
        resultados,
        totalProcessados: resultados.length
      });
    } catch (error) {
      console.error("Apply automatic screening error:", error);
      res.status(500).json({ message: "Erro ao aplicar triagem autom\xE1tica" });
    }
  });
  app2.get("/api/vagas/:vagaId/estatisticas-triagem", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const estatisticas = await sistemaTriagem.obterEstatisticasTriagem(vagaId);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get screening statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estat\xEDsticas de triagem" });
    }
  });
  app2.post("/api/filtros-triagem", async (req, res) => {
    try {
      const filtroData = req.body;
      const novoFiltro = await sistemaTriagem.criarFiltro(filtroData);
      res.json(novoFiltro);
    } catch (error) {
      console.error("Create screening filter error:", error);
      res.status(400).json({ message: "Erro ao criar filtro de triagem" });
    }
  });
  app2.get("/api/filtros-triagem", async (req, res) => {
    try {
      const { vagaId } = req.query;
      const filtros = await sistemaTriagem.obterFiltros(vagaId);
      res.json(filtros);
    } catch (error) {
      console.error("Get screening filters error:", error);
      res.status(500).json({ message: "Erro ao obter filtros de triagem" });
    }
  });
  app2.get("/api/conversas/:usuarioId", async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { tipo } = req.query;
      if (!tipo || tipo !== "candidato" && tipo !== "empresa") {
        return res.status(400).json({ message: "Tipo de usu\xE1rio deve ser 'candidato' ou 'empresa'" });
      }
      const conversas = await sistemaComunicacao.obterConversas(usuarioId, tipo);
      res.json(conversas);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Erro ao obter conversas" });
    }
  });
  app2.get("/api/conversas/:conversaId/mensagens", async (req, res) => {
    try {
      const { conversaId } = req.params;
      const mensagens = await sistemaComunicacao.obterMensagens(conversaId);
      res.json(mensagens);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Erro ao obter mensagens" });
    }
  });
  app2.post("/api/conversas/:conversaId/mensagens", async (req, res) => {
    try {
      const { conversaId } = req.params;
      const { remetenteId, remetenteTipo, destinatarioId, destinatarioTipo, conteudo, tipo, templateId } = req.body;
      const mensagem = await sistemaComunicacao.enviarMensagem(
        conversaId,
        remetenteId,
        remetenteTipo,
        destinatarioId,
        destinatarioTipo,
        conteudo,
        tipo,
        templateId
      );
      res.json(mensagem);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(400).json({ message: "Erro ao enviar mensagem" });
    }
  });
  app2.post("/api/conversas/:conversaId/template", async (req, res) => {
    try {
      const { conversaId } = req.params;
      const { remetenteId, remetenteTipo, destinatarioId, destinatarioTipo, templateId, variaveis } = req.body;
      const mensagem = await sistemaComunicacao.enviarMensagemTemplate(
        conversaId,
        remetenteId,
        remetenteTipo,
        destinatarioId,
        destinatarioTipo,
        templateId,
        variaveis
      );
      res.json(mensagem);
    } catch (error) {
      console.error("Send template message error:", error);
      res.status(400).json({ message: "Erro ao enviar mensagem template" });
    }
  });
  app2.patch("/api/mensagens/:mensagemId/lida", async (req, res) => {
    try {
      const { mensagemId } = req.params;
      await sistemaComunicacao.marcarComoLida(mensagemId);
      res.json({ message: "Mensagem marcada como lida" });
    } catch (error) {
      console.error("Mark message as read error:", error);
      res.status(500).json({ message: "Erro ao marcar mensagem como lida" });
    }
  });
  app2.get("/api/templates-mensagem", async (req, res) => {
    try {
      const { categoria } = req.query;
      const templates = await sistemaComunicacao.obterTemplates(categoria);
      res.json(templates);
    } catch (error) {
      console.error("Get message templates error:", error);
      res.status(500).json({ message: "Erro ao obter templates de mensagem" });
    }
  });
  app2.post("/api/templates-mensagem", async (req, res) => {
    try {
      const templateData = req.body;
      const novoTemplate = await sistemaComunicacao.criarTemplate(templateData);
      res.json(novoTemplate);
    } catch (error) {
      console.error("Create message template error:", error);
      res.status(400).json({ message: "Erro ao criar template de mensagem" });
    }
  });
  app2.get("/api/notificacoes/:usuarioId", async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { naoLidas } = req.query;
      const notificacoes = await sistemaComunicacao.obterNotificacoes(
        usuarioId,
        naoLidas === "true"
      );
      res.json(notificacoes);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Erro ao obter notifica\xE7\xF5es" });
    }
  });
  app2.patch("/api/notificacoes/:notificacaoId/lida", async (req, res) => {
    try {
      const { notificacaoId } = req.params;
      await sistemaComunicacao.marcarNotificacaoComoLida(notificacaoId);
      res.json({ message: "Notifica\xE7\xE3o marcada como lida" });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ message: "Erro ao marcar notifica\xE7\xE3o como lida" });
    }
  });
  app2.get("/api/comunicacao/estatisticas/:usuarioId", async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const estatisticas = await sistemaComunicacao.obterEstatisticasComunicacao(usuarioId);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get communication statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estat\xEDsticas de comunica\xE7\xE3o" });
    }
  });
  app2.post("/api/parsing/curriculo", async (req, res) => {
    try {
      const { conteudo, candidatoId } = req.body;
      if (!conteudo) {
        return res.status(400).json({ message: "Conte\xFAdo do curr\xEDculo \xE9 obrigat\xF3rio" });
      }
      const resultado = await sistemaParsing.processarCurriculo(conteudo, candidatoId);
      res.json(resultado);
    } catch (error) {
      console.error("Process resume error:", error);
      res.status(500).json({ message: "Erro ao processar curr\xEDculo" });
    }
  });
  app2.post("/api/parsing/aplicar/:candidatoId", async (req, res) => {
    try {
      const { candidatoId } = req.params;
      const { dados } = req.body;
      if (!dados) {
        return res.status(400).json({ message: "Dados extra\xEDdos s\xE3o obrigat\xF3rios" });
      }
      const sucesso = await sistemaParsing.aplicarDadosExtraidos(candidatoId, dados);
      if (sucesso) {
        res.json({ message: "Dados aplicados com sucesso" });
      } else {
        res.status(400).json({ message: "Erro ao aplicar dados" });
      }
    } catch (error) {
      console.error("Apply extracted data error:", error);
      res.status(500).json({ message: "Erro ao aplicar dados extra\xEDdos" });
    }
  });
  app2.get("/api/relatorios/kpi", async (req, res) => {
    try {
      const kpi = await sistemaRelatorios.obterKPIRecrutamento();
      res.json(kpi);
    } catch (error) {
      console.error("Get recruitment KPIs error:", error);
      res.status(500).json({ message: "Erro ao obter KPIs de recrutamento" });
    }
  });
  app2.get("/api/relatorios/vagas/:vagaId/metricas", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const metricas = await sistemaRelatorios.obterMetricasProcessoSeletivo(vagaId);
      res.json(metricas);
    } catch (error) {
      console.error("Get process selection metrics error:", error);
      res.status(500).json({ message: "Erro ao obter m\xE9tricas do processo seletivo" });
    }
  });
  app2.get("/api/relatorios/mensal/:mes/:ano", async (req, res) => {
    try {
      const { mes, ano } = req.params;
      const relatorio = await sistemaRelatorios.obterRelatorioMensal(parseInt(mes), parseInt(ano));
      res.json(relatorio);
    } catch (error) {
      console.error("Get monthly report error:", error);
      res.status(500).json({ message: "Erro ao obter relat\xF3rio mensal" });
    }
  });
  app2.get("/api/relatorios/graficos/candidaturas-mes", async (req, res) => {
    try {
      const { meses } = req.query;
      const dados = await sistemaRelatorios.obterDadosGraficoCandidaturasPorMes(
        meses ? parseInt(meses) : 12
      );
      res.json(dados);
    } catch (error) {
      console.error("Get applications by month chart error:", error);
      res.status(500).json({ message: "Erro ao obter dados do gr\xE1fico" });
    }
  });
  app2.get("/api/relatorios/graficos/status-candidaturas", async (req, res) => {
    try {
      const dados = await sistemaRelatorios.obterDadosGraficoStatusCandidaturas();
      res.json(dados);
    } catch (error) {
      console.error("Get application status chart error:", error);
      res.status(500).json({ message: "Erro ao obter dados do gr\xE1fico de status" });
    }
  });
  app2.get("/api/relatorios/graficos/areas-procuradas", async (req, res) => {
    try {
      const dados = await sistemaRelatorios.obterDadosGraficoAreasMaisProcuradas();
      res.json(dados);
    } catch (error) {
      console.error("Get most sought after areas chart error:", error);
      res.status(500).json({ message: "Erro ao obter dados do gr\xE1fico de \xE1reas" });
    }
  });
  app2.post("/api/relatorios/exportar/pdf", async (req, res) => {
    try {
      const { dados, tipo } = req.body;
      const nomeArquivo = await sistemaRelatorios.exportarRelatorioPDF(dados, tipo);
      res.json({ nomeArquivo, url: `/downloads/${nomeArquivo}` });
    } catch (error) {
      console.error("Export report to PDF error:", error);
      res.status(500).json({ message: "Erro ao exportar relat\xF3rio PDF" });
    }
  });
  app2.post("/api/relatorios/exportar/excel", async (req, res) => {
    try {
      const { dados, tipo } = req.body;
      const nomeArquivo = await sistemaRelatorios.exportarRelatorioExcel(dados, tipo);
      res.json({ nomeArquivo, url: `/downloads/${nomeArquivo}` });
    } catch (error) {
      console.error("Export report to Excel error:", error);
      res.status(500).json({ message: "Erro ao exportar relat\xF3rio Excel" });
    }
  });
  app2.post("/api/hunting/campanhas", async (req, res) => {
    try {
      const campanhaData = req.body;
      const novaCampanha = await sistemaHunting.criarCampanha(campanhaData);
      res.json(novaCampanha);
    } catch (error) {
      console.error("Create hunting campaign error:", error);
      res.status(400).json({ message: "Erro ao criar campanha de hunting" });
    }
  });
  app2.get("/api/hunting/campanhas", async (req, res) => {
    try {
      const { vagaId } = req.query;
      const campanhas = await sistemaHunting.obterCampanhas(vagaId);
      res.json(campanhas);
    } catch (error) {
      console.error("Get hunting campaigns error:", error);
      res.status(500).json({ message: "Erro ao obter campanhas de hunting" });
    }
  });
  app2.post("/api/hunting/campanhas/:campanhaId/buscar", async (req, res) => {
    try {
      const { campanhaId } = req.params;
      const resultado = await sistemaHunting.buscarTalentos(campanhaId);
      res.json(resultado);
    } catch (error) {
      console.error("Search talents error:", error);
      res.status(500).json({ message: "Erro ao buscar talentos" });
    }
  });
  app2.post("/api/hunting/perfis/:perfilId/contatar", async (req, res) => {
    try {
      const { perfilId } = req.params;
      const { templateId, variaveis } = req.body;
      const sucesso = await sistemaHunting.contatarTalento(perfilId, templateId, variaveis);
      if (sucesso) {
        res.json({ message: "Talento contatado com sucesso" });
      } else {
        res.status(400).json({ message: "Erro ao contatar talento" });
      }
    } catch (error) {
      console.error("Contact talent error:", error);
      res.status(500).json({ message: "Erro ao contatar talento" });
    }
  });
  app2.patch("/api/hunting/perfis/:perfilId/status", async (req, res) => {
    try {
      const { perfilId } = req.params;
      const { status, observacoes } = req.body;
      await sistemaHunting.atualizarStatusPerfil(perfilId, status, observacoes);
      res.json({ message: "Status atualizado com sucesso" });
    } catch (error) {
      console.error("Update profile status error:", error);
      res.status(500).json({ message: "Erro ao atualizar status do perfil" });
    }
  });
  app2.get("/api/hunting/perfis", async (req, res) => {
    try {
      const { campanhaId, status } = req.query;
      const perfis = await sistemaHunting.obterPerfis(
        campanhaId,
        status
      );
      res.json(perfis);
    } catch (error) {
      console.error("Get hunting profiles error:", error);
      res.status(500).json({ message: "Erro ao obter perfis de hunting" });
    }
  });
  app2.get("/api/hunting/templates", async (req, res) => {
    try {
      const templates = await sistemaHunting.obterTemplatesContato();
      res.json(templates);
    } catch (error) {
      console.error("Get contact templates error:", error);
      res.status(500).json({ message: "Erro ao obter templates de contato" });
    }
  });
  app2.post("/api/hunting/templates", async (req, res) => {
    try {
      const templateData = req.body;
      const novoTemplate = await sistemaHunting.criarTemplateContato(templateData);
      res.json(novoTemplate);
    } catch (error) {
      console.error("Create contact template error:", error);
      res.status(400).json({ message: "Erro ao criar template de contato" });
    }
  });
  app2.get("/api/hunting/estatisticas", async (req, res) => {
    try {
      const { campanhaId } = req.query;
      const estatisticas = await sistemaHunting.obterEstatisticasHunting(campanhaId);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get hunting statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estat\xEDsticas de hunting" });
    }
  });
  app2.get("/api/clientes", async (req, res) => {
    try {
      const clientes = await sistemaMultiCliente.obterTodosClientes();
      res.json(clientes);
    } catch (error) {
      console.error("Get all clients error:", error);
      res.status(500).json({ message: "Erro ao obter clientes" });
    }
  });
  app2.get("/api/clientes/:clienteId", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const cliente = await sistemaMultiCliente.obterCliente(clienteId);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente n\xE3o encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      console.error("Get client error:", error);
      res.status(500).json({ message: "Erro ao obter cliente" });
    }
  });
  app2.post("/api/clientes", async (req, res) => {
    try {
      const clienteData = req.body;
      const novoCliente = await sistemaMultiCliente.criarCliente(clienteData);
      res.json(novoCliente);
    } catch (error) {
      console.error("Create client error:", error);
      res.status(400).json({ message: "Erro ao criar cliente" });
    }
  });
  app2.put("/api/clientes/:clienteId", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const dados = req.body;
      const clienteAtualizado = await sistemaMultiCliente.atualizarCliente(clienteId, dados);
      if (!clienteAtualizado) {
        return res.status(404).json({ message: "Cliente n\xE3o encontrado" });
      }
      res.json(clienteAtualizado);
    } catch (error) {
      console.error("Update client error:", error);
      res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
  });
  app2.get("/api/clientes/:clienteId/usuarios", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const usuarios2 = await sistemaMultiCliente.obterUsuariosCliente(clienteId);
      res.json(usuarios2);
    } catch (error) {
      console.error("Get client users error:", error);
      res.status(500).json({ message: "Erro ao obter usu\xE1rios do cliente" });
    }
  });
  app2.post("/api/clientes/:clienteId/usuarios", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const usuarioData = req.body;
      const novoUsuario = await sistemaMultiCliente.adicionarUsuarioCliente({
        ...usuarioData,
        clienteId
      });
      res.json(novoUsuario);
    } catch (error) {
      console.error("Add user to client error:", error);
      res.status(400).json({ message: "Erro ao adicionar usu\xE1rio ao cliente" });
    }
  });
  app2.get("/api/permissoes/verificar/:usuarioId/:permissao", async (req, res) => {
    try {
      const { usuarioId, permissao } = req.params;
      const temPermissao = await sistemaMultiCliente.verificarPermissao(usuarioId, permissao);
      res.json({ temPermissao });
    } catch (error) {
      console.error("Check permission error:", error);
      res.status(500).json({ message: "Erro ao verificar permiss\xE3o" });
    }
  });
  app2.get("/api/clientes/:clienteId/configuracao", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const configuracao = await sistemaMultiCliente.obterConfiguracaoCliente(clienteId);
      if (!configuracao) {
        return res.status(404).json({ message: "Configura\xE7\xE3o n\xE3o encontrada" });
      }
      res.json(configuracao);
    } catch (error) {
      console.error("Get client configuration error:", error);
      res.status(500).json({ message: "Erro ao obter configura\xE7\xE3o do cliente" });
    }
  });
  app2.put("/api/clientes/:clienteId/configuracao", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const configuracao = req.body;
      const configuracaoAtualizada = await sistemaMultiCliente.atualizarConfiguracaoCliente(clienteId, configuracao);
      if (!configuracaoAtualizada) {
        return res.status(404).json({ message: "Cliente n\xE3o encontrado" });
      }
      res.json(configuracaoAtualizada);
    } catch (error) {
      console.error("Update client configuration error:", error);
      res.status(500).json({ message: "Erro ao atualizar configura\xE7\xE3o do cliente" });
    }
  });
  app2.get("/api/clientes/:clienteId/estatisticas", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const estatisticas = await sistemaMultiCliente.obterEstatisticasCliente(clienteId);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get client statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estat\xEDsticas do cliente" });
    }
  });
  app2.post("/api/clientes/:clienteId/faturamento", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const { mes, ano } = req.body;
      const faturamento = await sistemaMultiCliente.gerarFaturamento(clienteId, mes, ano);
      res.json(faturamento);
    } catch (error) {
      console.error("Generate client billing error:", error);
      res.status(500).json({ message: "Erro ao gerar faturamento" });
    }
  });
  app2.get("/api/clientes/:clienteId/faturamentos", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const faturamentos = await sistemaMultiCliente.obterFaturamentosCliente(clienteId);
      res.json(faturamentos);
    } catch (error) {
      console.error("Get client billings error:", error);
      res.status(500).json({ message: "Erro ao obter faturamentos do cliente" });
    }
  });
  app2.patch("/api/faturamentos/:faturamentoId/pago", async (req, res) => {
    try {
      const { faturamentoId } = req.params;
      await sistemaMultiCliente.marcarFaturamentoComoPago(faturamentoId);
      res.json({ message: "Faturamento marcado como pago" });
    } catch (error) {
      console.error("Mark billing as paid error:", error);
      res.status(500).json({ message: "Erro ao marcar faturamento como pago" });
    }
  });
  app2.get("/api/clientes/:clienteId/limites/:tipo", async (req, res) => {
    try {
      const { clienteId, tipo } = req.params;
      const limites = await sistemaMultiCliente.verificarLimitesCliente(clienteId, tipo);
      res.json(limites);
    } catch (error) {
      console.error("Check client limits error:", error);
      res.status(500).json({ message: "Erro ao verificar limites do cliente" });
    }
  });
  app2.get("/api/clientes/vencendo", async (req, res) => {
    try {
      const clientes = await sistemaMultiCliente.obterClientesVencendo();
      res.json(clientes);
    } catch (error) {
      console.error("Get expiring clients error:", error);
      res.status(500).json({ message: "Erro ao obter clientes vencendo" });
    }
  });
  app2.get("/api/clientes/inativos", async (req, res) => {
    try {
      const clientes = await sistemaMultiCliente.obterClientesInativos();
      res.json(clientes);
    } catch (error) {
      console.error("Get inactive clients error:", error);
      res.status(500).json({ message: "Erro ao obter clientes inativos" });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      console.log("\u{1F4E7} Forgot Password: Solicita\xE7\xE3o para:", email);
      if (!email) {
        return res.status(400).json({
          message: "E-mail \xE9 obrigat\xF3rio"
        });
      }
      const { data: user, error: userError } = await supabase.from("users").select("id, email, name").eq("email", email).single();
      if (userError || !user) {
        console.log("\u274C Forgot Password: Usu\xE1rio n\xE3o encontrado:", email);
        return res.json({
          message: "Se o e-mail estiver cadastrado, voc\xEA receber\xE1 instru\xE7\xF5es para redefinir sua senha."
        });
      }
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetExpires = new Date(Date.now() + 36e5);
      console.log("\u{1F511} Reset Token gerado para", email, ":", resetToken);
      console.log("\u23F0 Token expira em:", resetExpires);
      console.log(`
\u{1F4E7} E-MAIL DE RECUPERA\xC7\xC3O DE SENHA (SIMULADO)
Para: ${email}
Assunto: Redefinir senha - Isabel Cunha RH

Ol\xE1 ${user.name},

Voc\xEA solicitou a redefini\xE7\xE3o de sua senha na plataforma Isabel Cunha RH.

Clique no link abaixo para redefinir sua senha:
${process.env.FRONTEND_URL || "http://localhost:5174"}/reset-password?token=${resetToken}

Este link expira em 1 hora.

Se voc\xEA n\xE3o solicitou esta redefini\xE7\xE3o, ignore este e-mail.

Atenciosamente,
Equipe Isabel Cunha RH
      `);
      res.json({
        message: "Se o e-mail estiver cadastrado, voc\xEA receber\xE1 instru\xE7\xF5es para redefinir sua senha.",
        // Em desenvolvimento, incluir o token para facilitar testes
        ...process.env.NODE_ENV === "development" && { resetToken, resetExpires }
      });
    } catch (error) {
      console.error("\u{1F4A5} Erro na recupera\xE7\xE3o de senha:", error);
      res.status(500).json({
        message: "Erro interno do servidor"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    port: 5174,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import cors from "cors";
var app = express2();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "file://",
    // Permitir arquivos locais
    "null"
    // Permitir origin null (arquivos locais)
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"]
}));
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5001;
  server.listen({
    port,
    host: "0.0.0.0"
    // Mudança: permitir acesso de qualquer IP
  }, () => {
    log(`serving on port ${port}`);
  });
})();
