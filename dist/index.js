// server/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
var app = express();
console.log("\u{1F3AF} Isabel RH v5.0 - Servidor Completo com APIs");
console.log("\u{1F525} Timestamp:", (/* @__PURE__ */ new Date()).toISOString());
console.log("\u{1F31F} Modo:", process.env.NODE_ENV || "production");
app.use(cors({
  origin: [
    "https://isabelrh.com.br",
    "https://www.isabelrh.com.br",
    "https://isabelrh.railway.app",
    "http://localhost:5174"
    // desenvolvimento
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.get("/api", (req, res) => {
  console.log("\u{1F3E0} API root acessada!");
  res.json({
    message: "Isabel RH API - Sistema funcionando!",
    version: "5.0.0",
    endpoints: ["/api/auth", "/api/candidatos", "/api/empresas", "/api/vagas"],
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/test", (req, res) => {
  console.log("\u{1F9EA} Endpoint de teste acessado!");
  res.json({
    status: "success",
    message: "Servidor Isabel RH funcionando!",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT
  });
});
app.get("/api/health", (req, res) => {
  console.log("\u2764\uFE0F Health check acessado!");
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/auth/me", (req, res) => {
  console.log("\u{1F510} Auth/me: Endpoint acessado (modo desenvolvimento)");
  const mockUser = {
    usuario: {
      id: "dev-user-1",
      email: "dev@isabelrh.com.br",
      name: "Usu\xE1rio de Desenvolvimento",
      type: "admin",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
  console.log("\u2705 Auth/me: Retornando dados mock para desenvolvimento");
  res.json(mockUser);
});
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  console.log("\u{1F4E7} Forgot Password: Solicita\xE7\xE3o para:", email);
  if (!email) {
    return res.status(400).json({
      message: "E-mail \xE9 obrigat\xF3rio"
    });
  }
  console.log("\u2705 Forgot Password: E-mail simulado enviado para:", email);
  res.json({
    message: "Se o e-mail estiver cadastrado, voc\xEA receber\xE1 instru\xE7\xF5es para redefinir sua senha.",
    debug: process.env.NODE_ENV === "development" ? "E-mail simulado - verifique o console do servidor" : void 0
  });
});
app.get("/api/vagas", (req, res) => {
  console.log("\u{1F4BC} Vagas: Endpoint acessado");
  const vagasMock = [
    {
      id: "1",
      titulo: "Desenvolvedor Frontend React",
      empresa: "Tech Company",
      localizacao: "S\xE3o Paulo, SP",
      modalidade: "Remoto",
      salario: "R$ 8.000 - R$ 12.000",
      descricao: "Vaga para desenvolvedor React com experi\xEAncia em TypeScript",
      destaque: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "2",
      titulo: "Analista de RH",
      empresa: "Empresa ABC",
      localizacao: "Florian\xF3polis, SC",
      modalidade: "H\xEDbrido",
      salario: "R$ 5.000 - R$ 7.000",
      descricao: "Vaga para analista de recursos humanos",
      destaque: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  const { limit, destaque } = req.query;
  let vagas = [...vagasMock];
  if (destaque === "true") {
    vagas = vagas.filter((vaga) => vaga.destaque);
  }
  if (limit) {
    const limitNum = parseInt(limit);
    vagas = vagas.slice(0, limitNum);
  }
  console.log(`\u2705 Vagas: Retornando ${vagas.length} vagas`);
  res.json(vagas);
});
var distPath = path.resolve(process.cwd(), "dist", "public");
console.log("\u{1F50D} DEBUG: Configurando arquivos est\xE1ticos:");
console.log("\u{1F4C1} Current working directory:", process.cwd());
console.log("\u{1F4C1} Dist path:", distPath);
console.log("\u{1F4C1} Arquivos existem?", fs.existsSync(distPath));
if (fs.existsSync(distPath)) {
  console.log("\u{1F4C1} Conte\xFAdo do diret\xF3rio:", fs.readdirSync(distPath));
  app.use(express.static(distPath));
  console.log("\u2705 Arquivos est\xE1ticos configurados!");
} else {
  console.error("\u274C ERRO: Diret\xF3rio dist/public n\xE3o encontrado!");
}
app.get("/", (req, res) => {
  console.log("\u{1F3E0} Rota / acessada - servindo React App");
  const indexPath = path.resolve(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: "Frontend n\xE3o encontrado",
      message: "Execute 'npm run build' primeiro"
    });
  }
});
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    console.log("\u2753 Rota API n\xE3o encontrada:", req.method, req.originalUrl);
    return res.status(404).json({
      error: "Rota API n\xE3o encontrada",
      method: req.method,
      path: req.originalUrl,
      availableRoutes: ["/api", "/api/test", "/api/health", "/api/auth/me", "/api/vagas"]
    });
  }
  console.log("\u{1F4DD} Servindo React App para rota:", req.originalUrl);
  const indexPath = path.resolve(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: "Frontend n\xE3o encontrado",
      message: "Execute 'npm run build' primeiro"
    });
  }
});
var port = parseInt(process.env.PORT || "5001");
console.log("\u{1F3AF} Tentando iniciar servidor na porta:", port);
app.listen(port, "0.0.0.0", () => {
  console.log("\u{1F389} SERVIDOR COMPLETO RODANDO COM SUCESSO!");
  console.log("\u{1F310} Porta:", port);
  console.log("\u{1F517} APIs dispon\xEDveis:");
  console.log("   - GET /api - Informa\xE7\xF5es da API");
  console.log("   - GET /api/test - Teste do servidor");
  console.log("   - GET /api/health - Health check");
  console.log("   - GET /api/auth/me - Dados do usu\xE1rio autenticado");
  console.log("   - POST /api/auth/forgot-password - Recupera\xE7\xE3o de senha");
  console.log("   - GET /api/vagas - Lista de vagas");
  console.log("\u{1F5A5}\uFE0F Frontend React dispon\xEDvel em: /");
  console.log("\u2728 Isabel RH v5.0 - Sistema completo funcionando!");
});
