import { 
  usuarios, candidatos, empresas, vagas, candidaturas, bancoTalentos, contatos,
  type Usuario, type InsertUsuario,
  type Candidato, type InsertCandidato,
  type Empresa, type InsertEmpresa,
  type Vaga, type InsertVaga,
  type Candidatura, type InsertCandidatura,
  type BancoTalentos, type InsertBancoTalentos,
  type Contato, type InsertContato
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private usuarios: Map<string, Usuario>;
  private candidatos: Map<string, Candidato>;
  private empresas: Map<string, Empresa>;
  private vagas: Map<string, Vaga>;
  private candidaturas: Map<string, Candidatura>;
  private bancoTalentos: Map<string, BancoTalentos>;
  private contatos: Map<string, Contato>;

  constructor() {
    this.usuarios = new Map();
    this.candidatos = new Map();
    this.empresas = new Map();
    this.vagas = new Map();
    this.candidaturas = new Map();
    this.bancoTalentos = new Map();
    this.contatos = new Map();
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
    const candidato: Candidato = {
      ...insertCandidato,
      criadoEm: new Date(),
    };
    this.candidatos.set(candidato.id, candidato);
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
    const empresa: Empresa = {
      ...insertEmpresa,
      criadoEm: new Date(),
    };
    this.empresas.set(empresa.id, empresa);
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
      ...insertVaga,
      id,
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
      ...insertCandidatura,
      id,
      dataCandidatura: new Date(),
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
    };
    this.contatos.set(id, contato);
    return contato;
  }

  async getAllContatos(): Promise<Contato[]> {
    return Array.from(this.contatos.values());
  }
}

export const storage = new MemStorage();
