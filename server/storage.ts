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
    const id = crypto.randomUUID();
    const candidato: Candidato = {
      ...insertCandidato,
      id,
      criadoEm: new Date(),
      telefone: insertCandidato.telefone ?? null,
      linkedin: insertCandidato.linkedin ?? null,
      curriculoUrl: insertCandidato.curriculoUrl ?? null,
      areasInteresse: insertCandidato.areasInteresse ?? null,
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
      ...insertEmpresa,
      id,
      criadoEm: new Date(),
      cnpj: insertEmpresa.cnpj ?? null,
      setor: insertEmpresa.setor ?? null,
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
      ...insertVaga,
      id,
      publicadoEm: new Date(),
      requisitos: insertVaga.requisitos ?? null,
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
}

// Use PostgreSQL if available, fallback to memory storage
const memStorage = new MemStorage();
const pgStorage = new PostgreSQLStorage();

export const storage = process.env.DATABASE_URL ? pgStorage : memStorage;
