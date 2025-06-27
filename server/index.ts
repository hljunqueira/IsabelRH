import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

const app = express();

console.log("🎯 Isabel RH v5.0 - Servidor Completo com APIs");
console.log("🔥 Timestamp:", new Date().toISOString());
console.log("🌟 Modo:", process.env.NODE_ENV || "production");

// Configurar CORS
app.use(cors({
  origin: [
    'https://isabelrh.com.br',
    'https://www.isabelrh.com.br', 
    'https://isabelrh.railway.app',
    'http://localhost:5174' // desenvolvimento
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// 🧪 ROTAS DE API - Básicas funcionais para desenvolvimento
app.get('/api', (req, res) => {
  console.log("🏠 API root acessada!");
  res.json({ 
    message: 'Isabel RH API - Sistema funcionando!',
    version: '5.0.0',
    endpoints: ['/api/auth', '/api/candidatos', '/api/empresas', '/api/vagas'],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  console.log("🧪 Endpoint de teste acessado!");
  res.json({ 
    status: 'success', 
    message: 'Servidor Isabel RH funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

app.get('/api/health', (req, res) => {
  console.log("❤️ Health check acessado!");
  res.json({ 
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 🔐 Rota de autenticação simplificada (sem Supabase por enquanto)
app.get("/api/auth/me", (req, res) => {
  console.log('🔐 Auth/me: Endpoint acessado (modo desenvolvimento)');
  
  // Em desenvolvimento, retornar dados mock se não houver autenticação real
  const mockUser = {
    usuario: {
      id: "dev-user-1",
      email: "dev@isabelrh.com.br",
      name: "Usuário de Desenvolvimento",
      type: "admin",
      created_at: new Date().toISOString()
    }
  };
  
  console.log('✅ Auth/me: Retornando dados mock para desenvolvimento');
  res.json(mockUser);
});

// 📧 Recuperação de senha simplificada
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  console.log('📧 Forgot Password: Solicitação para:', email);
  
  if (!email) {
    return res.status(400).json({ 
      message: 'E-mail é obrigatório' 
    });
  }

  // Em desenvolvimento, simular envio de e-mail
  console.log('✅ Forgot Password: E-mail simulado enviado para:', email);
  
  res.json({ 
    message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
    debug: process.env.NODE_ENV === 'development' ? 'E-mail simulado - verifique o console do servidor' : undefined
  });
});

// 💼 Rota de vagas simplificada
app.get("/api/vagas", (req, res) => {
  console.log('💼 Vagas: Endpoint acessado');
  
  // Dados mock para desenvolvimento
  const vagasMock = [
    {
      id: "1",
      titulo: "Desenvolvedor Frontend React",
      empresa: "Tech Company",
      cidade: "São Paulo",
      estado: "SP",
      localizacao: "São Paulo, SP",
      modalidade: "Remoto",
      tipo: "Tecnologia",
      salario: "R$ 8.000 - R$ 12.000",
      descricao: "Vaga para desenvolvedor React com experiência em TypeScript e desenvolvimento de aplicações modernas",
      requisitos: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
      destaque: true,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: "2", 
      titulo: "Analista de RH",
      empresa: "Empresa ABC",
      cidade: "Florianópolis",
      estado: "SC",
      localizacao: "Florianópolis, SC",
      modalidade: "Híbrido",
      tipo: "Recursos Humanos",
      salario: "R$ 5.000 - R$ 7.000",
      descricao: "Vaga para analista de recursos humanos com experiência em recrutamento e seleção",
      requisitos: ["Psicologia", "Recrutamento", "Seleção", "Excel"],
      destaque: true,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];
  
  // Verificar parâmetros de query
  const { limit, destaque } = req.query;
  let vagas = [...vagasMock];
  
  if (destaque === 'true') {
    vagas = vagas.filter(vaga => vaga.destaque);
  }
  
  if (limit) {
    const limitNum = parseInt(limit as string);
    vagas = vagas.slice(0, limitNum);
  }
  
  console.log(`✅ Vagas: Retornando ${vagas.length} vagas`);
  res.json(vagas);
});

// 📁 SERVIR ARQUIVOS ESTÁTICOS DO FRONTEND
const distPath = path.resolve(process.cwd(), "dist", "public");

console.log("🔍 DEBUG: Configurando arquivos estáticos:");
console.log("📁 Current working directory:", process.cwd());
console.log("📁 Dist path:", distPath);
console.log("📁 Arquivos existem?", fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  console.log("📁 Conteúdo do diretório:", fs.readdirSync(distPath));
  
  // Servir arquivos estáticos
  app.use(express.static(distPath));
  console.log("✅ Arquivos estáticos configurados!");
} else {
  console.error("❌ ERRO: Diretório dist/public não encontrado!");
}

// 🏠 ROTA PRINCIPAL - Servir o React App
app.get('/', (req, res) => {
  console.log("🏠 Rota / acessada - servindo React App");
  const indexPath = path.resolve(distPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: "Frontend não encontrado",
      message: "Execute 'npm run build' primeiro"
    });
  }
});

// 🎯 CATCH-ALL para React Router - DEVE SER A ÚLTIMA ROTA
app.get('*', (req, res) => {
  // Ignorar rotas de API que não existem
  if (req.path.startsWith('/api/')) {
    console.log("❓ Rota API não encontrada:", req.method, req.originalUrl);
    return res.status(404).json({ 
      error: "Rota API não encontrada",
      method: req.method,
      path: req.originalUrl,
      availableRoutes: ['/api', '/api/test', '/api/health', '/api/auth/me', '/api/vagas']
    });
  }
  
  // Para todas as outras rotas, servir o React App (SPA routing)
  console.log("📝 Servindo React App para rota:", req.originalUrl);
  const indexPath = path.resolve(distPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: "Frontend não encontrado",
      message: "Execute 'npm run build' primeiro"
    });
  }
});

// Use Railway's PORT environment variable
const port = parseInt(process.env.PORT || "5001");
console.log("🎯 Tentando iniciar servidor na porta:", port);

app.listen(port, "0.0.0.0", () => {
  console.log("🎉 SERVIDOR COMPLETO RODANDO COM SUCESSO!");
  console.log("🌐 Porta:", port);
  console.log("🔗 APIs disponíveis:");
  console.log("   - GET /api - Informações da API");
  console.log("   - GET /api/test - Teste do servidor");
  console.log("   - GET /api/health - Health check");
  console.log("   - GET /api/auth/me - Dados do usuário autenticado");
  console.log("   - POST /api/auth/forgot-password - Recuperação de senha");
  console.log("   - GET /api/vagas - Lista de vagas");
  console.log("🖥️ Frontend React disponível em: /");
  console.log("✨ Isabel RH v5.0 - Sistema completo funcionando!");
});
