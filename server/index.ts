import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

console.log("🎯 VERSÃO ULTRA-SIMPLES - Isabel RH v3.0 - TESTE RAILWAY");
console.log("🔥 Timestamp:", new Date().toISOString());
console.log("🌟 Testando Railway com servidor minimalista");

// Configurar CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// 🧪 ROTAS DE TESTE SUPER SIMPLES
app.get('/', (req, res) => {
  console.log("🏠 Rota / acessada!");
  res.json({ 
    message: "🎉 Isabel RH - Servidor funcionando!", 
    status: "success",
    timestamp: new Date().toISOString(),
    version: "3.0"
  });
});

app.get('/api', (req, res) => {
  console.log("🔥 Rota /api acessada!");
  res.json({ 
    message: "🚀 API Isabel RH Online!", 
    status: "success",
    timestamp: new Date().toISOString(),
    routes: ["/", "/api", "/api/test", "/api/health"]
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

// Catch all para debug
app.use('*', (req, res) => {
  console.log("❓ Rota não encontrada:", req.method, req.originalUrl);
  res.status(404).json({ 
    error: "Rota não encontrada",
    method: req.method,
    path: req.originalUrl,
    message: "Verifique as rotas disponíveis: /, /api, /api/test, /api/health"
  });
});

// Use Railway's PORT environment variable
const port = parseInt(process.env.PORT || "5001");
console.log("🎯 Tentando iniciar servidor na porta:", port);

app.listen(port, "0.0.0.0", () => {
  console.log("🎉 SERVIDOR ULTRA-SIMPLES RODANDO COM SUCESSO!");
  console.log("🌐 Porta:", port);
  console.log("🔗 Rotas disponíveis:");
  console.log("   - GET /");
  console.log("   - GET /api");
  console.log("   - GET /api/test");
  console.log("   - GET /api/health");
});
