import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUsuarioSchema,
  insertCandidatoSchema, 
  insertEmpresaSchema,
  insertVagaSchema,
  insertCandidaturaSchema,
  insertBancoTalentosSchema,
  insertContatoSchema
} from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, senha, tipo, ...userData } = req.body;
      
      // Validate user data
      const usuarioData = insertUsuarioSchema.parse({ email, senha, tipo });
      
      // Check if user already exists
      const existingUser = await storage.getUsuarioByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      // Create user
      const usuario = await storage.createUsuario({
        ...usuarioData,
        senha: hashedPassword,
      });
      
      // Create profile based on user type
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

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, senha } = req.body;
      
      const usuario = await storage.getUsuarioByEmail(email);
      if (!usuario) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }
      
      const isValidPassword = await bcrypt.compare(senha, usuario.senha);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }
      
      // Get profile based on user type
      let profile = null;
      if (usuario.tipo === "candidato") {
        profile = await storage.getCandidato(usuario.id);
      } else if (usuario.tipo === "empresa") {
        profile = await storage.getEmpresa(usuario.id);
      }
      
      res.json({ 
        usuario: { ...usuario, senha: undefined },
        profile 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Erro no login" });
    }
  });

  // Candidato routes
  app.get("/api/candidatos/:id", async (req, res) => {
    try {
      const candidato = await storage.getCandidato(req.params.id);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato não encontrado" });
      }
      res.json(candidato);
    } catch (error) {
      console.error("Get candidato error:", error);
      res.status(500).json({ message: "Erro ao buscar candidato" });
    }
  });

  app.put("/api/candidatos/:id", async (req, res) => {
    try {
      const candidatoData = insertCandidatoSchema.partial().parse(req.body);
      const candidato = await storage.updateCandidato(req.params.id, candidatoData);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato não encontrado" });
      }
      res.json(candidato);
    } catch (error) {
      console.error("Update candidato error:", error);
      res.status(400).json({ message: "Erro ao atualizar candidato" });
    }
  });

  // Empresa routes
  app.get("/api/empresas/:id", async (req, res) => {
    try {
      const empresa = await storage.getEmpresa(req.params.id);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada" });
      }
      res.json(empresa);
    } catch (error) {
      console.error("Get empresa error:", error);
      res.status(500).json({ message: "Erro ao buscar empresa" });
    }
  });

  app.put("/api/empresas/:id", async (req, res) => {
    try {
      const empresaData = insertEmpresaSchema.partial().parse(req.body);
      const empresa = await storage.updateEmpresa(req.params.id, empresaData);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada" });
      }
      res.json(empresa);
    } catch (error) {
      console.error("Update empresa error:", error);
      res.status(400).json({ message: "Erro ao atualizar empresa" });
    }
  });

  // Vaga routes
  app.get("/api/vagas", async (req, res) => {
    try {
      const vagas = await storage.getAllVagas();
      res.json(vagas);
    } catch (error) {
      console.error("Get vagas error:", error);
      res.status(500).json({ message: "Erro ao buscar vagas" });
    }
  });

  app.get("/api/vagas/empresa/:empresaId", async (req, res) => {
    try {
      const vagas = await storage.getVagasByEmpresa(req.params.empresaId);
      res.json(vagas);
    } catch (error) {
      console.error("Get vagas by empresa error:", error);
      res.status(500).json({ message: "Erro ao buscar vagas da empresa" });
    }
  });

  app.post("/api/vagas", async (req, res) => {
    try {
      const vagaData = insertVagaSchema.parse(req.body);
      const vaga = await storage.createVaga(vagaData);
      res.json(vaga);
    } catch (error) {
      console.error("Create vaga error:", error);
      res.status(400).json({ message: "Erro ao criar vaga" });
    }
  });

  app.put("/api/vagas/:id", async (req, res) => {
    try {
      const vagaData = insertVagaSchema.partial().parse(req.body);
      const vaga = await storage.updateVaga(req.params.id, vagaData);
      if (!vaga) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }
      res.json(vaga);
    } catch (error) {
      console.error("Update vaga error:", error);
      res.status(400).json({ message: "Erro ao atualizar vaga" });
    }
  });

  app.delete("/api/vagas/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVaga(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }
      res.json({ message: "Vaga deletada com sucesso" });
    } catch (error) {
      console.error("Delete vaga error:", error);
      res.status(500).json({ message: "Erro ao deletar vaga" });
    }
  });

  // Candidatura routes
  app.get("/api/candidaturas/candidato/:candidatoId", async (req, res) => {
    try {
      const candidaturas = await storage.getCandidaturasByCandidato(req.params.candidatoId);
      res.json(candidaturas);
    } catch (error) {
      console.error("Get candidaturas error:", error);
      res.status(500).json({ message: "Erro ao buscar candidaturas" });
    }
  });

  app.get("/api/candidaturas/vaga/:vagaId", async (req, res) => {
    try {
      const candidaturas = await storage.getCandidaturasByVaga(req.params.vagaId);
      res.json(candidaturas);
    } catch (error) {
      console.error("Get candidaturas by vaga error:", error);
      res.status(500).json({ message: "Erro ao buscar candidaturas da vaga" });
    }
  });

  app.post("/api/candidaturas", async (req, res) => {
    try {
      const candidaturaData = insertCandidaturaSchema.parse(req.body);
      
      // Check if candidatura already exists
      const exists = await storage.checkCandidaturaExists(
        candidaturaData.vagaId, 
        candidaturaData.candidatoId
      );
      
      if (exists) {
        return res.status(400).json({ message: "Você já se candidatou a esta vaga" });
      }
      
      const candidatura = await storage.createCandidatura(candidaturaData);
      res.json(candidatura);
    } catch (error) {
      console.error("Create candidatura error:", error);
      res.status(400).json({ message: "Erro ao se candidatar" });
    }
  });

  // Banco de Talentos routes
  app.post("/api/banco-talentos", async (req, res) => {
    try {
      const talentoData = insertBancoTalentosSchema.parse(req.body);
      const talento = await storage.createBancoTalentos(talentoData);
      res.json(talento);
    } catch (error) {
      console.error("Create banco talentos error:", error);
      res.status(400).json({ message: "Erro ao cadastrar no banco de talentos" });
    }
  });

  app.get("/api/banco-talentos", async (req, res) => {
    try {
      const talentos = await storage.getAllBancoTalentos();
      res.json(talentos);
    } catch (error) {
      console.error("Get banco talentos error:", error);
      res.status(500).json({ message: "Erro ao buscar talentos" });
    }
  });

  // Contato routes
  app.post("/api/contatos", async (req, res) => {
    try {
      const contatoData = insertContatoSchema.parse(req.body);
      const contato = await storage.createContato(contatoData);
      res.json(contato);
    } catch (error) {
      console.error("Create contato error:", error);
      res.status(400).json({ message: "Erro ao enviar mensagem" });
    }
  });

  app.get("/api/contatos", async (req, res) => {
    try {
      const contatos = await storage.getAllContatos();
      res.json(contatos);
    } catch (error) {
      console.error("Get contatos error:", error);
      res.status(500).json({ message: "Erro ao buscar contatos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
