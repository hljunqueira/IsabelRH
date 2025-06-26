import { 
  usuarios, candidatos, empresas, vagas, candidaturas, bancoTalentos, contatos, servicos, propostas, relatorios, testesDisc,
  type Usuario, type InsertUsuario,
  type Candidato, type InsertCandidato,
  type Empresa, type InsertEmpresa,
  type Vaga, type InsertVaga,
  type Candidatura, type InsertCandidatura,
  type BancoTalentos, type InsertBancoTalentos,
  type Contato, type InsertContato,
  type Servico, type InsertServico,
  type Proposta, type InsertProposta,
  type Relatorio, type InsertRelatorio,
  type TesteDisc, type InsertTesteDisc
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Usuario methods
  getUsuario(id: string): Promise<Usuario | undefined>;
  getUsuarioByEmail(email: string): Promise<Usuario | undefined>;
  createUsuario(usuario: InsertUsuario): Promise<Usuario>;
  
  // Candidato methods
  getCandidato(id: string): Promise<Candidato | undefined>;
  createCandidato(candidato: InsertCandidato): Promise<Candidato>;
  updateCandidato(id: string, candidato: Partial<InsertCandidato>): Promise<Candidato | undefined>;
  
  // Empresa methods
  getEmpresa(id: string): Promise<Empresa | undefined>;
  createEmpresa(empresa: InsertEmpresa): Promise<Empresa>;
  updateEmpresa(id: string, empresa: Partial<InsertEmpresa>): Promise<Empresa | undefined>;
  
  // Vaga methods
  getVaga(id: string): Promise<Vaga | undefined>;
  getVagasByEmpresa(empresaId: string): Promise<Vaga[]>;
  getAllVagas(): Promise<Vaga[]>;
  createVaga(vaga: InsertVaga): Promise<Vaga>;
  updateVaga(id: string, vaga: Partial<InsertVaga>): Promise<Vaga | undefined>;
  deleteVaga(id: string): Promise<boolean>;
  
  // Candidatura methods
  getCandidaturasByCandidato(candidatoId: string): Promise<Candidatura[]>;
  getCandidaturasByVaga(vagaId: string): Promise<Candidatura[]>;
  createCandidatura(candidatura: InsertCandidatura): Promise<Candidatura>;
  checkCandidaturaExists(vagaId: string, candidatoId: string): Promise<boolean>;
  
  // Banco de Talentos methods
  createBancoTalentos(talento: InsertBancoTalentos): Promise<BancoTalentos>;
  getAllBancoTalentos(): Promise<BancoTalentos[]>;
  
  // Contato methods
  createContato(contato: InsertContato): Promise<Contato>;
  getAllContatos(): Promise<Contato[]>;
  
  // Admin methods
  getAllCandidatos(): Promise<Candidato[]>;
  getAllEmpresas(): Promise<Empresa[]>;
  deleteCandidato(id: string): Promise<boolean>;
  deleteEmpresa(id: string): Promise<boolean>;
  
  // Servico methods
  createServico(servico: InsertServico): Promise<Servico>;
  getAllServicos(): Promise<Servico[]>;
  updateServico(id: string, servico: Partial<InsertServico>): Promise<Servico | undefined>;
  deleteServico(id: string): Promise<boolean>;
  
  // Proposta methods
  createProposta(proposta: InsertProposta): Promise<Proposta>;
  getAllPropostas(): Promise<Proposta[]>;
  updateProposta(id: string, proposta: Partial<InsertProposta>): Promise<Proposta | undefined>;
  
  // Relatorio methods
  createRelatorio(relatorio: InsertRelatorio): Promise<Relatorio>;
  getAllRelatorios(): Promise<Relatorio[]>;
  
  // DISC Testing methods
  createTesteDISC(teste: InsertTesteDisc): Promise<TesteDisc>;
  getTesteDISCByCandidato(candidatoId: string): Promise<TesteDisc | undefined>;
  updateCandidatoDISC(candidatoId: string, discData: { perfilDisc: string; pontuacaoD: number; pontuacaoI: number; pontuacaoS: number; pontuacaoC: number; dataTesteDISC: Date }): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private usuarios: Map<string, Usuario>;
  private candidatos: Map<string, Candidato>;
  private empresas: Map<string, Empresa>;
  private vagas: Map<string, Vaga>;
  private candidaturas: Map<string, Candidatura>;
  private bancoTalentos: Map<string, BancoTalentos>;
  private contatos: Map<string, Contato>;
  private servicos: Map<string, Servico>;
  private propostas: Map<string, Proposta>;
  private relatorios: Map<string, Relatorio>;
  private testesDisc: Map<string, TesteDisc>;

  constructor() {
    this.usuarios = new Map();
    this.candidatos = new Map();
    this.empresas = new Map();
    this.vagas = new Map();
    this.candidaturas = new Map();
    this.bancoTalentos = new Map();
    this.contatos = new Map();
    this.servicos = new Map();
    this.propostas = new Map();
    this.relatorios = new Map();
    this.testesDisc = new Map();
  }

  async getUsuario(id: string): Promise<Usuario | undefined> {
    return this.usuarios.get(id);
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    return Array.from(this.usuarios.values()).find(user => user.email === email);
  }

  async createUsuario(insertUsuario: InsertUsuario): Promise<Usuario> {
    const id = crypto.randomUUID();
    const usuario: Usuario = {
      ...insertUsuario,
      id,
      criadoEm: new Date(),
    };
    this.usuarios.set(id, usuario);
    return usuario;
  }

  async getCandidato(id: string): Promise<Candidato | undefined> {
    return this.candidatos.get(id);
  }

  async createCandidato(insertCandidato: InsertCandidato): Promise<Candidato> {
    const id = crypto.randomUUID();
    const candidato: Candidato = {
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
      criadoEm: new Date(),
    };
    this.candidatos.set(id, candidato);
    return candidato;
  }

  async updateCandidato(id: string, candidato: Partial<InsertCandidato>): Promise<Candidato | undefined> {
    const existing = this.candidatos.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...candidato };
    this.candidatos.set(id, updated);
    return updated;
  }

  async getEmpresa(id: string): Promise<Empresa | undefined> {
    return this.empresas.get(id);
  }

  async createEmpresa(insertEmpresa: InsertEmpresa): Promise<Empresa> {
    const id = crypto.randomUUID();
    const empresa: Empresa = {
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
      criadoEm: new Date(),
    };
    this.empresas.set(id, empresa);
    return empresa;
  }

  async updateEmpresa(id: string, empresa: Partial<InsertEmpresa>): Promise<Empresa | undefined> {
    const existing = this.empresas.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...empresa };
    this.empresas.set(id, updated);
    return updated;
  }

  async getVaga(id: string): Promise<Vaga | undefined> {
    return this.vagas.get(id);
  }

  async getVagasByEmpresa(empresaId: string): Promise<Vaga[]> {
    return Array.from(this.vagas.values()).filter(vaga => vaga.empresaId === empresaId);
  }

  async getAllVagas(): Promise<Vaga[]> {
    return Array.from(this.vagas.values());
  }

  async createVaga(insertVaga: InsertVaga): Promise<Vaga> {
    const id = crypto.randomUUID();
    const vaga: Vaga = {
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
      publicadoEm: new Date(),
    };
    this.vagas.set(id, vaga);
    return vaga;
  }

  async updateVaga(id: string, vaga: Partial<InsertVaga>): Promise<Vaga | undefined> {
    const existing = this.vagas.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...vaga };
    this.vagas.set(id, updated);
    return updated;
  }

  async deleteVaga(id: string): Promise<boolean> {
    return this.vagas.delete(id);
  }

  async getCandidaturasByCandidato(candidatoId: string): Promise<Candidatura[]> {
    return Array.from(this.candidaturas.values()).filter(c => c.candidatoId === candidatoId);
  }

  async getCandidaturasByVaga(vagaId: string): Promise<Candidatura[]> {
    return Array.from(this.candidaturas.values()).filter(c => c.vagaId === vagaId);
  }

  async createCandidatura(insertCandidatura: InsertCandidatura): Promise<Candidatura> {
    const id = crypto.randomUUID();
    const candidatura: Candidatura = {
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
      dataCandidatura: new Date(),
      ultimaAtualizacao: new Date(),
    };
    this.candidaturas.set(id, candidatura);
    return candidatura;
  }

  async checkCandidaturaExists(vagaId: string, candidatoId: string): Promise<boolean> {
    return Array.from(this.candidaturas.values()).some(
      c => c.vagaId === vagaId && c.candidatoId === candidatoId
    );
  }

  async createBancoTalentos(insertTalento: InsertBancoTalentos): Promise<BancoTalentos> {
    const id = crypto.randomUUID();
    const talento: BancoTalentos = {
      ...insertTalento,
      id,
      criadoEm: new Date(),
      telefone: insertTalento.telefone ?? null,
      curriculoUrl: insertTalento.curriculoUrl ?? null,
      areaInteresse: insertTalento.areaInteresse ?? null,
    };
    this.bancoTalentos.set(id, talento);
    return talento;
  }

  async getAllBancoTalentos(): Promise<BancoTalentos[]> {
    return Array.from(this.bancoTalentos.values());
  }

  async createContato(insertContato: InsertContato): Promise<Contato> {
    const id = crypto.randomUUID();
    const contato: Contato = {
      ...insertContato,
      id,
      criadoEm: new Date(),
      empresa: insertContato.empresa ?? null,
    };
    this.contatos.set(id, contato);
    return contato;
  }

  async getAllContatos(): Promise<Contato[]> {
    return Array.from(this.contatos.values());
  }

  // Admin methods
  async getAllCandidatos(): Promise<Candidato[]> {
    return Array.from(this.candidatos.values());
  }

  async getAllEmpresas(): Promise<Empresa[]> {
    return Array.from(this.empresas.values());
  }

  async deleteCandidato(id: string): Promise<boolean> {
    const deleted = this.candidatos.delete(id);
    if (deleted) {
      this.usuarios.delete(id);
    }
    return deleted;
  }

  async deleteEmpresa(id: string): Promise<boolean> {
    const deleted = this.empresas.delete(id);
    if (deleted) {
      this.usuarios.delete(id);
    }
    return deleted;
  }

  // Servico methods
  async createServico(insertServico: InsertServico): Promise<Servico> {
    const id = crypto.randomUUID();
    const servico: Servico = {
      ...insertServico,
      id,
      criadoEm: new Date(),
      empresaId: insertServico.empresaId ?? null,
      candidatoId: insertServico.candidatoId ?? null,
      valor: insertServico.valor ?? null,
      dataInicio: insertServico.dataInicio ?? null,
      dataFim: insertServico.dataFim ?? null,
      observacoes: insertServico.observacoes ?? null,
      status: insertServico.status ?? 'pendente',
    };
    this.servicos.set(id, servico);
    return servico;
  }

  async getAllServicos(): Promise<Servico[]> {
    return Array.from(this.servicos.values());
  }

  async updateServico(id: string, servico: Partial<InsertServico>): Promise<Servico | undefined> {
    const existing = this.servicos.get(id);
    if (!existing) return undefined;
    
    const updated: Servico = { ...existing, ...servico };
    this.servicos.set(id, updated);
    return updated;
  }

  async deleteServico(id: string): Promise<boolean> {
    return this.servicos.delete(id);
  }

  // Proposta methods
  async createProposta(insertProposta: InsertProposta): Promise<Proposta> {
    const id = crypto.randomUUID();
    const proposta: Proposta = {
      ...insertProposta,
      id,
      criadoEm: new Date(),
      prazoEntrega: insertProposta.prazoEntrega ?? null,
      observacoes: insertProposta.observacoes ?? null,
      aprovada: insertProposta.aprovada ?? null,
    };
    this.propostas.set(id, proposta);
    return proposta;
  }

  async getAllPropostas(): Promise<Proposta[]> {
    return Array.from(this.propostas.values());
  }

  async updateProposta(id: string, proposta: Partial<InsertProposta>): Promise<Proposta | undefined> {
    const existing = this.propostas.get(id);
    if (!existing) return undefined;
    
    const updated: Proposta = { ...existing, ...proposta };
    this.propostas.set(id, updated);
    return updated;
  }

  // Relatorio methods
  async createRelatorio(insertRelatorio: InsertRelatorio): Promise<Relatorio> {
    const id = crypto.randomUUID();
    const relatorio: Relatorio = {
      ...insertRelatorio,
      id,
      criadoEm: new Date(),
      totalCandidatos: insertRelatorio.totalCandidatos ?? null,
      totalEmpresas: insertRelatorio.totalEmpresas ?? null,
      totalVagas: insertRelatorio.totalVagas ?? null,
      totalServicos: insertRelatorio.totalServicos ?? null,
      faturamento: insertRelatorio.faturamento ?? null,
    };
    this.relatorios.set(id, relatorio);
    return relatorio;
  }

  async getAllRelatorios(): Promise<Relatorio[]> {
    return Array.from(this.relatorios.values());
  }

  // DISC Testing methods
  async createTesteDISC(teste: InsertTesteDisc): Promise<TesteDisc> {
    const id = crypto.randomUUID();
    const testeDisc: TesteDisc = {
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
      dataRealizacao: new Date(),
    };
    this.testesDisc.set(id, testeDisc);
    return testeDisc;
  }

  async getTesteDISCByCandidato(candidatoId: string): Promise<TesteDisc | undefined> {
    return Array.from(this.testesDisc.values()).find(t => t.candidatoId === candidatoId);
  }

  async updateCandidatoDISC(candidatoId: string, discData: { perfilDisc: string; pontuacaoD: number; pontuacaoI: number; pontuacaoS: number; pontuacaoC: number; dataTesteDISC: Date }): Promise<boolean> {
    const candidato = this.candidatos.get(candidatoId);
    if (!candidato) return false;
    
    const updated = { 
      ...candidato, 
      perfilDisc: discData.perfilDisc as any,
      pontuacaoD: discData.pontuacaoD,
      pontuacaoI: discData.pontuacaoI,
      pontuacaoS: discData.pontuacaoS,
      pontuacaoC: discData.pontuacaoC,
      dataTesteDISC: discData.dataTesteDISC
    };
    this.candidatos.set(candidatoId, updated);
    return true;
  }
}

// PostgreSQL Storage using Drizzle ORM
export class PostgreSQLStorage implements IStorage {
  private db: any;

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

  async getUsuario(id: string): Promise<Usuario | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting usuario:", error);
      return undefined;
    }
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting usuario by email:", error);
      return undefined;
    }
  }

  async createUsuario(usuario: InsertUsuario): Promise<Usuario> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(usuarios).values(usuario).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating usuario:", error);
      throw error;
    }
  }

  async getCandidato(id: string): Promise<Candidato | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(candidatos).where(eq(candidatos.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting candidato:", error);
      return undefined;
    }
  }

  async createCandidato(candidato: InsertCandidato): Promise<Candidato> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(candidatos).values(candidato).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating candidato:", error);
      throw error;
    }
  }

  async updateCandidato(id: string, candidato: Partial<InsertCandidato>): Promise<Candidato | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.update(candidatos).set(candidato).where(eq(candidatos.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating candidato:", error);
      return undefined;
    }
  }

  async getEmpresa(id: string): Promise<Empresa | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(empresas).where(eq(empresas.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting empresa:", error);
      return undefined;
    }
  }

  async createEmpresa(empresa: InsertEmpresa): Promise<Empresa> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(empresas).values(empresa).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating empresa:", error);
      throw error;
    }
  }

  async updateEmpresa(id: string, empresa: Partial<InsertEmpresa>): Promise<Empresa | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.update(empresas).set(empresa).where(eq(empresas.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating empresa:", error);
      return undefined;
    }
  }

  async getVaga(id: string): Promise<Vaga | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(vagas).where(eq(vagas.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting vaga:", error);
      return undefined;
    }
  }

  async getVagasByEmpresa(empresaId: string): Promise<Vaga[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(vagas).where(eq(vagas.empresaId, empresaId));
      return result;
    } catch (error) {
      console.error("Error getting vagas by empresa:", error);
      return [];
    }
  }

  async getAllVagas(): Promise<Vaga[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(vagas);
      return result;
    } catch (error) {
      console.error("Error getting all vagas:", error);
      return [];
    }
  }

  async createVaga(vaga: InsertVaga): Promise<Vaga> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(vagas).values(vaga).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating vaga:", error);
      throw error;
    }
  }

  async updateVaga(id: string, vaga: Partial<InsertVaga>): Promise<Vaga | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.update(vagas).set(vaga).where(eq(vagas.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating vaga:", error);
      return undefined;
    }
  }

  async deleteVaga(id: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      await this.db.delete(vagas).where(eq(vagas.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting vaga:", error);
      return false;
    }
  }

  async getCandidaturasByCandidato(candidatoId: string): Promise<Candidatura[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(candidaturas).where(eq(candidaturas.candidatoId, candidatoId));
      return result;
    } catch (error) {
      console.error("Error getting candidaturas by candidato:", error);
      return [];
    }
  }

  async getCandidaturasByVaga(vagaId: string): Promise<Candidatura[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(candidaturas).where(eq(candidaturas.vagaId, vagaId));
      return result;
    } catch (error) {
      console.error("Error getting candidaturas by vaga:", error);
      return [];
    }
  }

  async createCandidatura(candidatura: InsertCandidatura): Promise<Candidatura> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(candidaturas).values(candidatura).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating candidatura:", error);
      throw error;
    }
  }

  async checkCandidaturaExists(vagaId: string, candidatoId: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db.select().from(candidaturas)
        .where(and(eq(candidaturas.vagaId, vagaId), eq(candidaturas.candidatoId, candidatoId)))
        .limit(1);
      return result.length > 0;
    } catch (error) {
      console.error("Error checking candidatura exists:", error);
      return false;
    }
  }

  async createBancoTalentos(talento: InsertBancoTalentos): Promise<BancoTalentos> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(bancoTalentos).values(talento).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating banco talentos:", error);
      throw error;
    }
  }

  async getAllBancoTalentos(): Promise<BancoTalentos[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(bancoTalentos);
      return result;
    } catch (error) {
      console.error("Error getting all banco talentos:", error);
      return [];
    }
  }

  async createContato(contato: InsertContato): Promise<Contato> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(contatos).values(contato).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating contato:", error);
      throw error;
    }
  }

  async getAllContatos(): Promise<Contato[]> {
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
  async getAllCandidatos(): Promise<Candidato[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(candidatos);
      return result;
    } catch (error) {
      console.error("Error getting all candidatos:", error);
      return [];
    }
  }

  async getAllEmpresas(): Promise<Empresa[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(empresas);
      return result;
    } catch (error) {
      console.error("Error getting all empresas:", error);
      return [];
    }
  }

  async deleteCandidato(id: string): Promise<boolean> {
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

  async deleteEmpresa(id: string): Promise<boolean> {
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
  async createServico(servico: InsertServico): Promise<Servico> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(servicos).values(servico).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating servico:", error);
      throw error;
    }
  }

  async getAllServicos(): Promise<Servico[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(servicos);
      return result;
    } catch (error) {
      console.error("Error getting all servicos:", error);
      return [];
    }
  }

  async updateServico(id: string, servico: Partial<InsertServico>): Promise<Servico | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.update(servicos).set(servico).where(eq(servicos.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating servico:", error);
      return undefined;
    }
  }

  async deleteServico(id: string): Promise<boolean> {
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
  async createProposta(proposta: InsertProposta): Promise<Proposta> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(propostas).values(proposta).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating proposta:", error);
      throw error;
    }
  }

  async getAllPropostas(): Promise<Proposta[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(propostas);
      return result;
    } catch (error) {
      console.error("Error getting all propostas:", error);
      return [];
    }
  }

  async updateProposta(id: string, proposta: Partial<InsertProposta>): Promise<Proposta | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.update(propostas).set(proposta).where(eq(propostas.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating proposta:", error);
      return undefined;
    }
  }

  // Relatorio methods
  async createRelatorio(relatorio: InsertRelatorio): Promise<Relatorio> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(relatorios).values(relatorio).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating relatorio:", error);
      throw error;
    }
  }

  async getAllRelatorios(): Promise<Relatorio[]> {
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
  async createTesteDISC(teste: InsertTesteDisc): Promise<TesteDisc> {
    if (!this.db) throw new Error("Database not connected");
    try {
      const result = await this.db.insert(testesDisc).values(teste).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating teste DISC:", error);
      throw error;
    }
  }

  async getTesteDISCByCandidato(candidatoId: string): Promise<TesteDisc | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(testesDisc).where(eq(testesDisc.candidatoId, candidatoId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting teste DISC:", error);
      return undefined;
    }
  }

  async updateCandidatoDISC(candidatoId: string, discData: { perfilDisc: string; pontuacaoD: number; pontuacaoI: number; pontuacaoS: number; pontuacaoC: number; dataTesteDISC: Date }): Promise<boolean> {
    if (!this.db) return false;
    try {
      await this.db.update(candidatos).set({
        perfilDisc: discData.perfilDisc as any,
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
}

// Use PostgreSQL if available, fallback to memory storage
const memStorage = new MemStorage();
const pgStorage = new PostgreSQLStorage();

export const storage = process.env.DATABASE_URL ? pgStorage : memStorage;
