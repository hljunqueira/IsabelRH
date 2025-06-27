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
  insertContatoSchema,
  insertServicoSchema,
  insertPropostaSchema,
  insertRelatorioSchema,
  insertTestesDiscSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import { obterCandidatosRanking, obterClassificacaoScore } from "./ranking";
import { sistemaTriagem } from "./triagem";
import { sistemaComunicacao } from "./comunicacao";
import { sistemaParsing } from "./parsing";
import { sistemaRelatorios } from "./relatorios";
import { sistemaHunting } from "./hunting";
import { sistemaMultiCliente } from "./multicliente";
import { authenticateUser, getAuthenticatedUser, supabase } from "./lib/supabase";

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

  // ROTA DE LOGIN DESABILITADA - Use Supabase Auth no frontend
  // A autenticação deve ser feita via supabase.auth.signInWithPassword no frontend
  // Esta rota foi mantida apenas para referência, mas não deve ser usada
  /*
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
  */

  // Rota para obter dados do usuário autenticado (requer JWT do Supabase)
  app.get("/api/auth/me", authenticateUser, async (req, res) => {
    try {
      console.log('🔐 Auth/me: Iniciando verificação de usuário...');
      const user = getAuthenticatedUser(req);
      
      if (!user || !user.id) {
        console.error('❌ Auth/me: Usuário não encontrado no token');
        return res.status(401).json({ message: "Token inválido - usuário não encontrado" });
      }
      
      console.log('👤 Auth/me: Buscando usuário ID:', user.id);
      
      // Verificar se Supabase está configurado
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Auth/me: Variáveis de ambiente do Supabase não configuradas');
        return res.status(500).json({ 
          message: "Configuração do Supabase ausente",
          details: "Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env"
        });
      }
      
      // Buscar dados diretamente do Supabase Auth
      const { data: usuario, error: usuarioError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (usuarioError) {
        console.error('❌ Auth/me: Erro ao buscar usuário no Supabase:', usuarioError);
        
        if (usuarioError.code === '42P01') {
          return res.status(500).json({ 
            message: "Tabela 'usuarios' não existe no Supabase",
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
        console.error('❌ Auth/me: Usuário não encontrado na base de dados:', user.id);
        return res.status(404).json({ message: "Usuário não encontrado na base de dados" });
      }
      
      console.log('✅ Auth/me: Usuário encontrado:', usuario.email, 'Tipo:', usuario.type);
      
      // Get profile based on user type
      let profile = null;
      if (usuario.type === "candidato") {
        console.log('📄 Auth/me: Buscando perfil de candidato...');
        const { data: candidato, error: candidatoError } = await supabase
          .from('candidatos')
          .select('*')
          .eq('id', usuario.id)
          .single();
        
        if (candidatoError && candidatoError.code !== 'PGRST116') {
          console.error('❌ Auth/me: Erro ao buscar candidato:', candidatoError);
        }
        profile = candidato;
      } else if (usuario.type === "empresa") {
        console.log('🏢 Auth/me: Buscando perfil de empresa...');
        const { data: empresa, error: empresaError } = await supabase
          .from('empresas')
          .select('*')
          .eq('id', usuario.id)
          .single();
        
        if (empresaError && empresaError.code !== 'PGRST116') {
          console.error('❌ Auth/me: Erro ao buscar empresa:', empresaError);
        }
        profile = empresa;
      }
      
      console.log('🎉 Auth/me: Dados retornados com sucesso');
      
      res.json({ 
        usuario: { ...usuario, senha: undefined },
        profile 
      });
    } catch (error) {
      console.error("💥 Auth/me: Erro geral:", error);
      
      if (error.message?.includes('connect ECONNREFUSED')) {
        return res.status(500).json({ 
          message: "Erro de conexão com Supabase",
          details: "Verifique se o SUPABASE_URL está correto e se o projeto está ativo"
        });
      }
      
      res.status(500).json({ 
        message: "Erro interno do servidor", 
        details: error.message || "Erro desconhecido" 
      });
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

  // Get compatible talents for a specific job area
  app.get("/api/banco-talentos/compativel/:area", async (req, res) => {
    try {
      const { area } = req.params;
      const todosTalentos = await storage.getAllBancoTalentos();
      
      // Filter talents that match the job area
      const talentosCompativeis = todosTalentos.filter(talento => 
        talento.areaInteresse?.toLowerCase() === area.toLowerCase()
      );
      
      res.json(talentosCompativeis);
    } catch (error) {
      console.error("Get compatible talents error:", error);
      res.status(500).json({ message: "Erro ao buscar talentos compatíveis" });
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

  // Admin routes
  app.get("/api/admin/candidatos", async (req, res) => {
    try {
      const candidatos = await storage.getAllCandidatos();
      res.json(candidatos);
    } catch (error) {
      console.error("Get all candidatos error:", error);
      res.status(500).json({ message: "Erro ao buscar candidatos" });
    }
  });

  app.get("/api/admin/empresas", async (req, res) => {
    try {
      const empresas = await storage.getAllEmpresas();
      res.json(empresas);
    } catch (error) {
      console.error("Get all empresas error:", error);
      res.status(500).json({ message: "Erro ao buscar empresas" });
    }
  });

  app.delete("/api/admin/candidatos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCandidato(id);
      if (deleted) {
        res.json({ message: "Candidato removido com sucesso" });
      } else {
        res.status(404).json({ message: "Candidato não encontrado" });
      }
    } catch (error) {
      console.error("Delete candidato error:", error);
      res.status(500).json({ message: "Erro ao remover candidato" });
    }
  });

  app.delete("/api/admin/empresas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEmpresa(id);
      if (deleted) {
        res.json({ message: "Empresa removida com sucesso" });
      } else {
        res.status(404).json({ message: "Empresa não encontrada" });
      }
    } catch (error) {
      console.error("Delete empresa error:", error);
      res.status(500).json({ message: "Erro ao remover empresa" });
    }
  });

  // Servicos routes
  app.post("/api/admin/servicos", async (req, res) => {
    try {
      const servicoData = insertServicoSchema.parse(req.body);
      const servico = await storage.createServico(servicoData);
      res.json(servico);
    } catch (error) {
      console.error("Create servico error:", error);
      res.status(400).json({ message: "Erro ao criar serviço" });
    }
  });

  app.get("/api/admin/servicos", async (req, res) => {
    try {
      const servicos = await storage.getAllServicos();
      res.json(servicos);
    } catch (error) {
      console.error("Get servicos error:", error);
      res.status(500).json({ message: "Erro ao buscar serviços" });
    }
  });

  app.patch("/api/admin/servicos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const servico = await storage.updateServico(id, updateData);
      if (servico) {
        res.json(servico);
      } else {
        res.status(404).json({ message: "Serviço não encontrado" });
      }
    } catch (error) {
      console.error("Update servico error:", error);
      res.status(400).json({ message: "Erro ao atualizar serviço" });
    }
  });

  app.delete("/api/admin/servicos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteServico(id);
      if (deleted) {
        res.json({ message: "Serviço removido com sucesso" });
      } else {
        res.status(404).json({ message: "Serviço não encontrado" });
      }
    } catch (error) {
      console.error("Delete servico error:", error);
      res.status(500).json({ message: "Erro ao remover serviço" });
    }
  });

  // Propostas routes
  app.post("/api/admin/propostas", async (req, res) => {
    try {
      const propostaData = insertPropostaSchema.parse(req.body);
      const proposta = await storage.createProposta(propostaData);
      res.json(proposta);
    } catch (error) {
      console.error("Create proposta error:", error);
      res.status(400).json({ message: "Erro ao criar proposta" });
    }
  });

  app.get("/api/admin/propostas", async (req, res) => {
    try {
      const propostas = await storage.getAllPropostas();
      res.json(propostas);
    } catch (error) {
      console.error("Get propostas error:", error);
      res.status(500).json({ message: "Erro ao buscar propostas" });
    }
  });

  app.patch("/api/admin/propostas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const proposta = await storage.updateProposta(id, updateData);
      if (proposta) {
        res.json(proposta);
      } else {
        res.status(404).json({ message: "Proposta não encontrada" });
      }
    } catch (error) {
      console.error("Update proposta error:", error);
      res.status(400).json({ message: "Erro ao atualizar proposta" });
    }
  });

  // Relatorios routes
  app.post("/api/admin/relatorios", async (req, res) => {
    try {
      const relatorioData = insertRelatorioSchema.parse(req.body);
      const relatorio = await storage.createRelatorio(relatorioData);
      res.json(relatorio);
    } catch (error) {
      console.error("Create relatorio error:", error);
      res.status(400).json({ message: "Erro ao criar relatório" });
    }
  });

  app.get("/api/admin/relatorios", async (req, res) => {
    try {
      const relatorios = await storage.getAllRelatorios();
      res.json(relatorios);
    } catch (error) {
      console.error("Get relatorios error:", error);
      res.status(500).json({ message: "Erro ao buscar relatórios" });
    }
  });

  // DISC Testing routes
  app.post("/api/testes-disc", async (req, res) => {
    try {
      const testeData = insertTestesDiscSchema.parse(req.body);
      const teste = await storage.createTesteDISC(testeData);
      
      // Update candidato with DISC profile
      await storage.updateCandidatoDISC(testeData.candidatoId, {
        perfilDisc: testeData.perfilDominante,
        pontuacaoD: testeData.pontuacaoD,
        pontuacaoI: testeData.pontuacaoI,
        pontuacaoS: testeData.pontuacaoS,
        pontuacaoC: testeData.pontuacaoC,
        dataTesteDISC: new Date()
      });
      
      res.json(teste);
    } catch (error) {
      console.error("Create teste DISC error:", error);
      res.status(400).json({ message: "Erro ao salvar teste DISC" });
    }
  });

  app.get("/api/testes-disc/candidato/:candidatoId", async (req, res) => {
    try {
      const { candidatoId } = req.params;
      const teste = await storage.getTesteDISCByCandidato(candidatoId);
      if (teste) {
        res.json(teste);
      } else {
        res.status(404).json({ message: "Teste DISC não encontrado" });
      }
    } catch (error) {
      console.error("Get teste DISC error:", error);
      res.status(500).json({ message: "Erro ao buscar teste DISC" });
    }
  });

  // Temporary endpoint to seed test data
  app.post("/api/seed-test-data", async (req, res) => {
    try {
      // Check if data already exists
      const existingCandidatos = await storage.getAllCandidatos();
      if (existingCandidatos.length > 0) {
        return res.status(400).json({ message: "Dados de teste já existem" });
      }

      // Create test candidates
      const candidatos = [];
      
      // João Silva - Developer
      const joaoUser = await storage.createUsuario({
        email: 'joao.silva@email.com',
        senha: await bcrypt.hash('senha123', 10),
        tipo: 'candidato'
      });
      
      const joao = await storage.createCandidato({
        id: joaoUser.id,
        nome: 'João Carlos Silva',
        telefone: '(47) 98765-4321',
        cidade: 'Blumenau',
        estado: 'SC',
        linkedin: 'https://linkedin.com/in/joaosilva',
        github: 'https://github.com/joaosilva',
        portfolio: 'https://joaosilva.dev',
        sobre: 'Desenvolvedor Full Stack com 5 anos de experiência em React, Node.js e PostgreSQL.',
        experiencia: 'Desenvolvedor Sênior na Tech Solutions (2020-presente)',
        educacao: 'Bacharelado em Ciência da Computação - FURB (2014-2018)',
        habilidades: 'JavaScript, TypeScript, React, Node.js, PostgreSQL',
        fotoPerfil: 'https://ui-avatars.com/api/?name=Joao+Silva&background=0D8ABC&color=fff',
        perfilDisc: 'dominante',
        pontuacaoD: 85,
        pontuacaoI: 65,
        pontuacaoS: 45,
        pontuacaoC: 75,
        dataTesteDISC: new Date('2024-01-15')
      });
      candidatos.push(joao);

      // Maria Santos - HR
      const mariaUser = await storage.createUsuario({
        email: 'maria.santos@email.com',
        senha: await bcrypt.hash('senha123', 10),
        tipo: 'candidato'
      });
      
      const maria = await storage.createCandidato({
        id: mariaUser.id,
        nome: 'Maria Fernanda Santos',
        telefone: '(47) 99876-5432',
        cidade: 'Joinville',
        estado: 'SC',
        linkedin: 'https://linkedin.com/in/mariasantos',
        sobre: 'Analista de RH com especialização em Recrutamento e Seleção.',
        experiencia: 'Analista de RH Sênior - Grupo Industrial ABC (2019-presente)',
        educacao: 'Psicologia - UNIVILLE (2012-2016)',
        habilidades: 'Recrutamento e Seleção, Gestão de Talentos',
        fotoPerfil: 'https://ui-avatars.com/api/?name=Maria+Santos&background=FF6B6B&color=fff',
        perfilDisc: 'influente',
        pontuacaoD: 55,
        pontuacaoI: 90,
        pontuacaoS: 75,
        pontuacaoC: 60,
        dataTesteDISC: new Date('2024-01-20')
      });
      candidatos.push(maria);

      // Create test companies
      const empresas = [];
      
      // Tech Solutions
      const techUser = await storage.createUsuario({
        email: 'rh@techsolutions.com.br',
        senha: await bcrypt.hash('senha123', 10),
        tipo: 'empresa'
      });
      
      const techSolutions = await storage.createEmpresa({
        id: techUser.id,
        nome: 'Tech Solutions Brasil',
        cnpj: '12.345.678/0001-90',
        telefone: '(47) 3333-4444',
        site: 'https://techsolutions.com.br',
        linkedin: 'https://linkedin.com/company/techsolutions',
        sobre: 'Empresa líder em soluções tecnológicas para o mercado B2B.',
        endereco: 'Rua das Palmeiras, 123',
        cidade: 'Blumenau',
        estado: 'SC',
        cep: '89010-000',
        nomeResponsavel: 'Ana Paula Mendes',
        emailResponsavel: 'ana.mendes@techsolutions.com.br',
        cargoResponsavel: 'Gerente de RH',
        numeroFuncionarios: '150',
        setorAtuacao: 'Tecnologia da Informação',
        missao: 'Transformar negócios através da tecnologia',
        visao: 'Ser referência nacional em desenvolvimento de software',
        valores: 'Inovação, Qualidade, Ética',
        logoEmpresa: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=1E40AF&color=fff'
      });
      empresas.push(techSolutions);

      // Create test jobs
      const vagas = [];
      
      const vaga1 = await storage.createVaga({
        empresaId: techSolutions.id,
        titulo: 'Desenvolvedor Full Stack Sênior',
        descricao: 'Buscamos desenvolvedor Full Stack experiente para liderar projetos.',
        requisitos: '5+ anos de experiência, React, Node.js, PostgreSQL',
        beneficios: ['Vale Alimentação', 'Vale Refeição', 'Plano de Saúde', 'Home Office'],
        salario: 'R$ 12.000 - R$ 18.000',
        cidade: 'Blumenau',
        estado: 'SC',
        tipoContrato: 'CLT',
        area: 'Tecnologia',
        nivel: 'senior',
        modalidade: 'hibrido',
        dataPublicacao: new Date(),
        ativo: true
      });
      vagas.push(vaga1);

      const vaga2 = await storage.createVaga({
        empresaId: techSolutions.id,
        titulo: 'Analista de RH Pleno',
        descricao: 'Vaga para profissional de RH com foco em recrutamento.',
        requisitos: 'Experiência em R&S, Excel avançado',
        beneficios: ['Vale Alimentação', 'Plano de Saúde', 'Gympass'],
        salario: 'R$ 4.000 - R$ 6.000',
        cidade: 'Blumenau',
        estado: 'SC',
        tipoContrato: 'CLT',
        area: 'Recursos Humanos',
        nivel: 'pleno',
        modalidade: 'presencial',
        dataPublicacao: new Date(),
        ativo: true
      });
      vagas.push(vaga2);

      // Create test applications
      await storage.createCandidatura({
        vagaId: vaga1.id,
        candidatoId: joao.id,
        dataCandidatura: new Date(),
        status: 'em_analise',
        compatibilidadeDisc: 85
      });

      await storage.createCandidatura({
        vagaId: vaga2.id,
        candidatoId: maria.id,
        dataCandidatura: new Date(),
        status: 'em_analise',
        compatibilidadeDisc: 92
      });

      res.json({
        message: "Dados de teste criados com sucesso!",
        candidatos: candidatos.length,
        empresas: empresas.length,
        vagas: vagas.length
      });
    } catch (error) {
      console.error("Erro ao criar dados de teste:", error);
      res.status(500).json({ message: "Erro ao criar dados de teste" });
    }
  });

  // Get candidates with ranking for a specific job
  app.get("/api/vagas/:vagaId/candidatos-ranking", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      
      // Adicionar classificação ao resultado
      const candidatosComClassificacao = candidatosComScore.map(candidato => ({
        ...candidato,
        classificacao: obterClassificacaoScore(candidato.score)
      }));
      
      res.json(candidatosComClassificacao);
    } catch (error) {
      console.error("Get candidatos ranking error:", error);
      res.status(500).json({ message: "Erro ao obter ranking de candidatos" });
    }
  });

  // Apply automatic screening for a job
  app.post("/api/vagas/:vagaId/triagem-automatica", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const resultados = await sistemaTriagem.aplicarTriagemAutomatica(vagaId);
      
      res.json({
        message: "Triagem automática aplicada com sucesso",
        resultados,
        totalProcessados: resultados.length
      });
    } catch (error) {
      console.error("Apply automatic screening error:", error);
      res.status(500).json({ message: "Erro ao aplicar triagem automática" });
    }
  });

  // Get screening statistics for a job
  app.get("/api/vagas/:vagaId/estatisticas-triagem", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const estatisticas = await sistemaTriagem.obterEstatisticasTriagem(vagaId);
      
      res.json(estatisticas);
    } catch (error) {
      console.error("Get screening statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estatísticas de triagem" });
    }
  });

  // Create new screening filter
  app.post("/api/filtros-triagem", async (req, res) => {
    try {
      const filtroData = req.body;
      const novoFiltro = await sistemaTriagem.criarFiltro(filtroData);
      
      res.json(novoFiltro);
    } catch (error) {
      console.error("Create screening filter error:", error);
      res.status(400).json({ message: "Erro ao criar filtro de triagem" });
    }
  });

  // Get screening filters
  app.get("/api/filtros-triagem", async (req, res) => {
    try {
      const { vagaId } = req.query;
      const filtros = await sistemaTriagem.obterFiltros(vagaId as string);
      
      res.json(filtros);
    } catch (error) {
      console.error("Get screening filters error:", error);
      res.status(500).json({ message: "Erro ao obter filtros de triagem" });
    }
  });

  // Communication endpoints
  // Get conversations for user
  app.get("/api/conversas/:usuarioId", async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { tipo } = req.query;
      
      if (!tipo || (tipo !== 'candidato' && tipo !== 'empresa')) {
        return res.status(400).json({ message: "Tipo de usuário deve ser 'candidato' ou 'empresa'" });
      }
      
      const conversas = await sistemaComunicacao.obterConversas(usuarioId, tipo as 'candidato' | 'empresa');
      res.json(conversas);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Erro ao obter conversas" });
    }
  });

  // Get messages for conversation
  app.get("/api/conversas/:conversaId/mensagens", async (req, res) => {
    try {
      const { conversaId } = req.params;
      const mensagens = await sistemaComunicacao.obterMensagens(conversaId);
      res.json(mensagens);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Erro ao obter mensagens" });
    }
  });

  // Send message
  app.post("/api/conversas/:conversaId/mensagens", async (req, res) => {
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

  // Send template message
  app.post("/api/conversas/:conversaId/template", async (req, res) => {
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

  // Mark message as read
  app.patch("/api/mensagens/:mensagemId/lida", async (req, res) => {
    try {
      const { mensagemId } = req.params;
      await sistemaComunicacao.marcarComoLida(mensagemId);
      res.json({ message: "Mensagem marcada como lida" });
    } catch (error) {
      console.error("Mark message as read error:", error);
      res.status(500).json({ message: "Erro ao marcar mensagem como lida" });
    }
  });

  // Get message templates
  app.get("/api/templates-mensagem", async (req, res) => {
    try {
      const { categoria } = req.query;
      const templates = await sistemaComunicacao.obterTemplates(categoria as string);
      res.json(templates);
    } catch (error) {
      console.error("Get message templates error:", error);
      res.status(500).json({ message: "Erro ao obter templates de mensagem" });
    }
  });

  // Create message template
  app.post("/api/templates-mensagem", async (req, res) => {
    try {
      const templateData = req.body;
      const novoTemplate = await sistemaComunicacao.criarTemplate(templateData);
      res.json(novoTemplate);
    } catch (error) {
      console.error("Create message template error:", error);
      res.status(400).json({ message: "Erro ao criar template de mensagem" });
    }
  });

  // Get notifications
  app.get("/api/notificacoes/:usuarioId", async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { naoLidas } = req.query;
      
      const notificacoes = await sistemaComunicacao.obterNotificacoes(
        usuarioId, 
        naoLidas === 'true'
      );
      
      res.json(notificacoes);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Erro ao obter notificações" });
    }
  });

  // Mark notification as read
  app.patch("/api/notificacoes/:notificacaoId/lida", async (req, res) => {
    try {
      const { notificacaoId } = req.params;
      await sistemaComunicacao.marcarNotificacaoComoLida(notificacaoId);
      res.json({ message: "Notificação marcada como lida" });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ message: "Erro ao marcar notificação como lida" });
    }
  });

  // Get communication statistics
  app.get("/api/comunicacao/estatisticas/:usuarioId", async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const estatisticas = await sistemaComunicacao.obterEstatisticasComunicacao(usuarioId);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get communication statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estatísticas de comunicação" });
    }
  });

  // Resume parsing endpoints
  // Process resume content
  app.post("/api/parsing/curriculo", async (req, res) => {
    try {
      const { conteudo, candidatoId } = req.body;
      
      if (!conteudo) {
        return res.status(400).json({ message: "Conteúdo do currículo é obrigatório" });
      }
      
      const resultado = await sistemaParsing.processarCurriculo(conteudo, candidatoId);
      res.json(resultado);
    } catch (error) {
      console.error("Process resume error:", error);
      res.status(500).json({ message: "Erro ao processar currículo" });
    }
  });

  // Apply extracted data to candidate profile
  app.post("/api/parsing/aplicar/:candidatoId", async (req, res) => {
    try {
      const { candidatoId } = req.params;
      const { dados } = req.body;
      
      if (!dados) {
        return res.status(400).json({ message: "Dados extraídos são obrigatórios" });
      }
      
      const sucesso = await sistemaParsing.aplicarDadosExtraidos(candidatoId, dados);
      
      if (sucesso) {
        res.json({ message: "Dados aplicados com sucesso" });
      } else {
        res.status(400).json({ message: "Erro ao aplicar dados" });
      }
    } catch (error) {
      console.error("Apply extracted data error:", error);
      res.status(500).json({ message: "Erro ao aplicar dados extraídos" });
    }
  });

  // Reports and dashboards endpoints
  // Get recruitment KPIs
  app.get("/api/relatorios/kpi", async (req, res) => {
    try {
      const kpi = await sistemaRelatorios.obterKPIRecrutamento();
      res.json(kpi);
    } catch (error) {
      console.error("Get recruitment KPIs error:", error);
      res.status(500).json({ message: "Erro ao obter KPIs de recrutamento" });
    }
  });

  // Get process selection metrics for a job
  app.get("/api/relatorios/vagas/:vagaId/metricas", async (req, res) => {
    try {
      const { vagaId } = req.params;
      const metricas = await sistemaRelatorios.obterMetricasProcessoSeletivo(vagaId);
      res.json(metricas);
    } catch (error) {
      console.error("Get process selection metrics error:", error);
      res.status(500).json({ message: "Erro ao obter métricas do processo seletivo" });
    }
  });

  // Get monthly report
  app.get("/api/relatorios/mensal/:mes/:ano", async (req, res) => {
    try {
      const { mes, ano } = req.params;
      const relatorio = await sistemaRelatorios.obterRelatorioMensal(parseInt(mes), parseInt(ano));
      res.json(relatorio);
    } catch (error) {
      console.error("Get monthly report error:", error);
      res.status(500).json({ message: "Erro ao obter relatório mensal" });
    }
  });

  // Get chart data for applications by month
  app.get("/api/relatorios/graficos/candidaturas-mes", async (req, res) => {
    try {
      const { meses } = req.query;
      const dados = await sistemaRelatorios.obterDadosGraficoCandidaturasPorMes(
        meses ? parseInt(meses as string) : 12
      );
      res.json(dados);
    } catch (error) {
      console.error("Get applications by month chart error:", error);
      res.status(500).json({ message: "Erro ao obter dados do gráfico" });
    }
  });

  // Get chart data for application status
  app.get("/api/relatorios/graficos/status-candidaturas", async (req, res) => {
    try {
      const dados = await sistemaRelatorios.obterDadosGraficoStatusCandidaturas();
      res.json(dados);
    } catch (error) {
      console.error("Get application status chart error:", error);
      res.status(500).json({ message: "Erro ao obter dados do gráfico de status" });
    }
  });

  // Get chart data for most sought after areas
  app.get("/api/relatorios/graficos/areas-procuradas", async (req, res) => {
    try {
      const dados = await sistemaRelatorios.obterDadosGraficoAreasMaisProcuradas();
      res.json(dados);
    } catch (error) {
      console.error("Get most sought after areas chart error:", error);
      res.status(500).json({ message: "Erro ao obter dados do gráfico de áreas" });
    }
  });

  // Export report to PDF
  app.post("/api/relatorios/exportar/pdf", async (req, res) => {
    try {
      const { dados, tipo } = req.body;
      const nomeArquivo = await sistemaRelatorios.exportarRelatorioPDF(dados, tipo);
      res.json({ nomeArquivo, url: `/downloads/${nomeArquivo}` });
    } catch (error) {
      console.error("Export report to PDF error:", error);
      res.status(500).json({ message: "Erro ao exportar relatório PDF" });
    }
  });

  // Export report to Excel
  app.post("/api/relatorios/exportar/excel", async (req, res) => {
    try {
      const { dados, tipo } = req.body;
      const nomeArquivo = await sistemaRelatorios.exportarRelatorioExcel(dados, tipo);
      res.json({ nomeArquivo, url: `/downloads/${nomeArquivo}` });
    } catch (error) {
      console.error("Export report to Excel error:", error);
      res.status(500).json({ message: "Erro ao exportar relatório Excel" });
    }
  });

  // Talent hunting endpoints
  // Create hunting campaign
  app.post("/api/hunting/campanhas", async (req, res) => {
    try {
      const campanhaData = req.body;
      const novaCampanha = await sistemaHunting.criarCampanha(campanhaData);
      res.json(novaCampanha);
    } catch (error) {
      console.error("Create hunting campaign error:", error);
      res.status(400).json({ message: "Erro ao criar campanha de hunting" });
    }
  });

  // Get hunting campaigns
  app.get("/api/hunting/campanhas", async (req, res) => {
    try {
      const { vagaId } = req.query;
      const campanhas = await sistemaHunting.obterCampanhas(vagaId as string);
      res.json(campanhas);
    } catch (error) {
      console.error("Get hunting campaigns error:", error);
      res.status(500).json({ message: "Erro ao obter campanhas de hunting" });
    }
  });

  // Search for talents
  app.post("/api/hunting/campanhas/:campanhaId/buscar", async (req, res) => {
    try {
      const { campanhaId } = req.params;
      const resultado = await sistemaHunting.buscarTalentos(campanhaId);
      res.json(resultado);
    } catch (error) {
      console.error("Search talents error:", error);
      res.status(500).json({ message: "Erro ao buscar talentos" });
    }
  });

  // Contact talent
  app.post("/api/hunting/perfis/:perfilId/contatar", async (req, res) => {
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

  // Update profile status
  app.patch("/api/hunting/perfis/:perfilId/status", async (req, res) => {
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

  // Get hunting profiles
  app.get("/api/hunting/perfis", async (req, res) => {
    try {
      const { campanhaId, status } = req.query;
      const perfis = await sistemaHunting.obterPerfis(
        campanhaId as string,
        status as any
      );
      res.json(perfis);
    } catch (error) {
      console.error("Get hunting profiles error:", error);
      res.status(500).json({ message: "Erro ao obter perfis de hunting" });
    }
  });

  // Get contact templates
  app.get("/api/hunting/templates", async (req, res) => {
    try {
      const templates = await sistemaHunting.obterTemplatesContato();
      res.json(templates);
    } catch (error) {
      console.error("Get contact templates error:", error);
      res.status(500).json({ message: "Erro ao obter templates de contato" });
    }
  });

  // Create contact template
  app.post("/api/hunting/templates", async (req, res) => {
    try {
      const templateData = req.body;
      const novoTemplate = await sistemaHunting.criarTemplateContato(templateData);
      res.json(novoTemplate);
    } catch (error) {
      console.error("Create contact template error:", error);
      res.status(400).json({ message: "Erro ao criar template de contato" });
    }
  });

  // Get hunting statistics
  app.get("/api/hunting/estatisticas", async (req, res) => {
    try {
      const { campanhaId } = req.query;
      const estatisticas = await sistemaHunting.obterEstatisticasHunting(campanhaId as string);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get hunting statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estatísticas de hunting" });
    }
  });

  // Multi-client endpoints
  // Get all clients
  app.get("/api/clientes", async (req, res) => {
    try {
      const clientes = await sistemaMultiCliente.obterTodosClientes();
      res.json(clientes);
    } catch (error) {
      console.error("Get all clients error:", error);
      res.status(500).json({ message: "Erro ao obter clientes" });
    }
  });

  // Get specific client
  app.get("/api/clientes/:clienteId", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const cliente = await sistemaMultiCliente.obterCliente(clienteId);
      
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      res.json(cliente);
    } catch (error) {
      console.error("Get client error:", error);
      res.status(500).json({ message: "Erro ao obter cliente" });
    }
  });

  // Create new client
  app.post("/api/clientes", async (req, res) => {
    try {
      const clienteData = req.body;
      const novoCliente = await sistemaMultiCliente.criarCliente(clienteData);
      res.json(novoCliente);
    } catch (error) {
      console.error("Create client error:", error);
      res.status(400).json({ message: "Erro ao criar cliente" });
    }
  });

  // Update client
  app.put("/api/clientes/:clienteId", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const dados = req.body;
      
      const clienteAtualizado = await sistemaMultiCliente.atualizarCliente(clienteId, dados);
      
      if (!clienteAtualizado) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      res.json(clienteAtualizado);
    } catch (error) {
      console.error("Update client error:", error);
      res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
  });

  // Get client users
  app.get("/api/clientes/:clienteId/usuarios", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const usuarios = await sistemaMultiCliente.obterUsuariosCliente(clienteId);
      res.json(usuarios);
    } catch (error) {
      console.error("Get client users error:", error);
      res.status(500).json({ message: "Erro ao obter usuários do cliente" });
    }
  });

  // Add user to client
  app.post("/api/clientes/:clienteId/usuarios", async (req, res) => {
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
      res.status(400).json({ message: "Erro ao adicionar usuário ao cliente" });
    }
  });

  // Check user permission
  app.get("/api/permissoes/verificar/:usuarioId/:permissao", async (req, res) => {
    try {
      const { usuarioId, permissao } = req.params;
      const temPermissao = await sistemaMultiCliente.verificarPermissao(usuarioId, permissao);
      res.json({ temPermissao });
    } catch (error) {
      console.error("Check permission error:", error);
      res.status(500).json({ message: "Erro ao verificar permissão" });
    }
  });

  // Get client configuration
  app.get("/api/clientes/:clienteId/configuracao", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const configuracao = await sistemaMultiCliente.obterConfiguracaoCliente(clienteId);
      
      if (!configuracao) {
        return res.status(404).json({ message: "Configuração não encontrada" });
      }
      
      res.json(configuracao);
    } catch (error) {
      console.error("Get client configuration error:", error);
      res.status(500).json({ message: "Erro ao obter configuração do cliente" });
    }
  });

  // Update client configuration
  app.put("/api/clientes/:clienteId/configuracao", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const configuracao = req.body;
      
      const configuracaoAtualizada = await sistemaMultiCliente.atualizarConfiguracaoCliente(clienteId, configuracao);
      
      if (!configuracaoAtualizada) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      res.json(configuracaoAtualizada);
    } catch (error) {
      console.error("Update client configuration error:", error);
      res.status(500).json({ message: "Erro ao atualizar configuração do cliente" });
    }
  });

  // Get client statistics
  app.get("/api/clientes/:clienteId/estatisticas", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const estatisticas = await sistemaMultiCliente.obterEstatisticasCliente(clienteId);
      res.json(estatisticas);
    } catch (error) {
      console.error("Get client statistics error:", error);
      res.status(500).json({ message: "Erro ao obter estatísticas do cliente" });
    }
  });

  // Generate client billing
  app.post("/api/clientes/:clienteId/faturamento", async (req, res) => {
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

  // Get client billings
  app.get("/api/clientes/:clienteId/faturamentos", async (req, res) => {
    try {
      const { clienteId } = req.params;
      const faturamentos = await sistemaMultiCliente.obterFaturamentosCliente(clienteId);
      res.json(faturamentos);
    } catch (error) {
      console.error("Get client billings error:", error);
      res.status(500).json({ message: "Erro ao obter faturamentos do cliente" });
    }
  });

  // Mark billing as paid
  app.patch("/api/faturamentos/:faturamentoId/pago", async (req, res) => {
    try {
      const { faturamentoId } = req.params;
      await sistemaMultiCliente.marcarFaturamentoComoPago(faturamentoId);
      res.json({ message: "Faturamento marcado como pago" });
    } catch (error) {
      console.error("Mark billing as paid error:", error);
      res.status(500).json({ message: "Erro ao marcar faturamento como pago" });
    }
  });

  // Check client limits
  app.get("/api/clientes/:clienteId/limites/:tipo", async (req, res) => {
    try {
      const { clienteId, tipo } = req.params;
      const limites = await sistemaMultiCliente.verificarLimitesCliente(clienteId, tipo as 'usuarios' | 'vagas');
      res.json(limites);
    } catch (error) {
      console.error("Check client limits error:", error);
      res.status(500).json({ message: "Erro ao verificar limites do cliente" });
    }
  });

  // Get clients expiring soon
  app.get("/api/clientes/vencendo", async (req, res) => {
    try {
      const clientes = await sistemaMultiCliente.obterClientesVencendo();
      res.json(clientes);
    } catch (error) {
      console.error("Get expiring clients error:", error);
      res.status(500).json({ message: "Erro ao obter clientes vencendo" });
    }
  });

  // Get inactive clients
  app.get("/api/clientes/inativos", async (req, res) => {
    try {
      const clientes = await sistemaMultiCliente.obterClientesInativos();
      res.json(clientes);
    } catch (error) {
      console.error("Get inactive clients error:", error);
      res.status(500).json({ message: "Erro ao obter clientes inativos" });
    }
  });

  // Recuperação de senha
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      console.log('📧 Forgot Password: Solicitação para:', email);
      
      if (!email) {
        return res.status(400).json({ 
          message: 'E-mail é obrigatório' 
        });
      }

      // VERSÃO ATUAL - SIMPLES (DESENVOLVIMENTO)
      // Verificar se usuário existe
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('email', email)
        .single();

      if (userError || !user) {
        console.log('❌ Forgot Password: Usuário não encontrado:', email);
        // Por segurança, retornamos sucesso mesmo se o e-mail não existir
        return res.json({ 
          message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.' 
        });
      }

      // Gerar token de recuperação (simples para demonstração)
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetExpires = new Date(Date.now() + 3600000); // 1 hora

      // Salvar token na base de dados (aqui vamos simular o envio)
      console.log('🔑 Reset Token gerado para', email, ':', resetToken);
      console.log('⏰ Token expira em:', resetExpires);

      // Em produção, aqui você enviaria um e-mail real
      // Para esta demonstração, apenas logamos
      console.log(`
📧 E-MAIL DE RECUPERAÇÃO DE SENHA (SIMULADO)
Para: ${email}
Assunto: Redefinir senha - Isabel Cunha RH

Olá ${user.name},

Você solicitou a redefinição de sua senha na plataforma Isabel Cunha RH.

Clique no link abaixo para redefinir sua senha:
${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}

Este link expira em 1 hora.

Se você não solicitou esta redefinição, ignore este e-mail.

Atenciosamente,
Equipe Isabel Cunha RH
      `);

      res.json({ 
        message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
        // Em desenvolvimento, incluir o token para facilitar testes
        ...(process.env.NODE_ENV === 'development' && { resetToken, resetExpires })
      });

      // VERSÃO SUPABASE AUTH NATIVA (COMENTADA - PRODUÇÃO)
      /*
      // Esta seria a implementação com Supabase Auth nativo:
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password`
      });

      if (error) {
        console.log('❌ Supabase Auth Error:', error.message);
        return res.status(400).json({ 
          message: 'Erro ao enviar e-mail de recuperação. Tente novamente.' 
        });
      }

      console.log('✅ Supabase enviou e-mail de recuperação para:', email);
      res.json({ 
        message: 'E-mail de recuperação enviado com sucesso!' 
      });
      */

    } catch (error) {
      console.error('💥 Erro na recuperação de senha:', error);
      res.status(500).json({ 
        message: 'Erro interno do servidor' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
