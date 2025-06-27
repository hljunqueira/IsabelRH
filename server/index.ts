import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();

console.log("🎯 Isabel RH v4.0 - Servidor Completo com Frontend");
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

// 🧪 ROTAS DE API
app.get('/api', (req, res) => {
  console.log("🔥 Rota /api acessada!");
  res.json({ 
    message: "🚀 API Isabel RH Online!", 
    status: "success",
    timestamp: new Date().toISOString(),
    routes: ["/api", "/api/test", "/api/health"]
  });
});

app.get('/api/test', (req, res) => {
  console.log("🧪 Rota /api/test acessada!");
  res.json({ 
    message: "✅ Teste realizado com sucesso!", 
    status: "success",
    server: "Railway",
    environment: process.env.NODE_ENV || "production",
    port: process.env.PORT || "unknown"
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
  console.log("🔍 Tentando verificar estrutura de diretórios...");
  
  // Debug: listar arquivos na raiz do projeto
  const rootFiles = fs.readdirSync(process.cwd());
  console.log("📂 Arquivos na raiz:", rootFiles);
  
  // Verificar se existe pasta dist
  const distExists = fs.existsSync(path.resolve(process.cwd(), "dist"));
  console.log("📂 Pasta dist existe?", distExists);
  
  if (distExists) {
    const distFiles = fs.readdirSync(path.resolve(process.cwd(), "dist"));
    console.log("📂 Arquivos em dist:", distFiles);
  }
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
      path: req.originalUrl
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
  console.log("🔗 API disponível em:");
  console.log("   - GET /api");
  console.log("   - GET /api/test");
  console.log("   - GET /api/health");
  console.log("🖥️ Frontend React disponível em: /");
  console.log("✨ Isabel RH pronto para uso!");
});
