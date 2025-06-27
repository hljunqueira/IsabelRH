// server/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
var app = express();
console.log("\u{1F3AF} Isabel RH v4.0 - Servidor Completo com Frontend");
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
  console.log("\u{1F525} Rota /api acessada!");
  res.json({
    message: "\u{1F680} API Isabel RH Online!",
    status: "success",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    routes: ["/api", "/api/test", "/api/health"]
  });
});
app.get("/api/test", (req, res) => {
  console.log("\u{1F9EA} Rota /api/test acessada!");
  res.json({
    message: "\u2705 Teste realizado com sucesso!",
    status: "success",
    server: "Railway",
    environment: process.env.NODE_ENV || "production",
    port: process.env.PORT || "unknown"
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
  console.log("\u{1F50D} Tentando verificar estrutura de diret\xF3rios...");
  const rootFiles = fs.readdirSync(process.cwd());
  console.log("\u{1F4C2} Arquivos na raiz:", rootFiles);
  const distExists = fs.existsSync(path.resolve(process.cwd(), "dist"));
  console.log("\u{1F4C2} Pasta dist existe?", distExists);
  if (distExists) {
    const distFiles = fs.readdirSync(path.resolve(process.cwd(), "dist"));
    console.log("\u{1F4C2} Arquivos em dist:", distFiles);
  }
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
      path: req.originalUrl
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
  console.log("\u{1F517} API dispon\xEDvel em:");
  console.log("   - GET /api");
  console.log("   - GET /api/test");
  console.log("   - GET /api/health");
  console.log("\u{1F5A5}\uFE0F Frontend React dispon\xEDvel em: /");
  console.log("\u2728 Isabel RH pronto para uso!");
});
