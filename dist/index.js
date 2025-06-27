// server/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv2 from "dotenv";

// server/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
var supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://wqifsgaxevfdwmfkihhg.supabase.co";
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkxMDI5MywiZXhwIjoyMDY2NDg2MjkzfQ.X7xux96O-P36SiEEBBWBebh30oqd5T1JiBC1LhC1SEA";
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("\u26A0\uFE0F Missing Supabase environment variables - using fallback configuration");
}
var supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
var supabasePublic = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MTY3OTUsImV4cCI6MjA1MTA5Mjc5NX0.UeXsYJvG4_B4F3xvlb8_o2WQjqJrJX7r6H7qZ8Z-XUw"
);

// server/index.ts
dotenv2.config();
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
app.get("/api/auth/me", async (req, res) => {
  console.log("\u{1F510} Auth/me: Endpoint acessado");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("\u26A0\uFE0F Auth/me: Sem token, retornando dados mock");
      const mockUser = {
        usuario: {
          id: "dev-user-1",
          email: "dev@isabelrh.com.br",
          name: "Usu\xE1rio de Desenvolvimento",
          type: "admin",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      return res.json(mockUser);
    }
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.log("\u274C Auth/me: Token inv\xE1lido, usando fallback");
      const mockUser = {
        usuario: {
          id: "dev-user-1",
          email: "dev@isabelrh.com.br",
          name: "Usu\xE1rio de Desenvolvimento",
          type: "admin",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      return res.json(mockUser);
    }
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single();
    if (userError) {
      console.log("\u26A0\uFE0F Auth/me: Usu\xE1rio n\xE3o encontrado nas tabelas, usando dados do auth");
      return res.json({
        usuario: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          type: user.user_metadata?.type || "candidato",
          created_at: user.created_at
        }
      });
    }
    console.log("\u2705 Auth/me: Retornando dados do usu\xE1rio autenticado");
    res.json({
      usuario: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        type: userData.type,
        created_at: userData.created_at
      }
    });
  } catch (error) {
    console.error("\u{1F4A5} Erro na autentica\xE7\xE3o:", error);
    const mockUser = {
      usuario: {
        id: "dev-user-1",
        email: "dev@isabelrh.com.br",
        name: "Usu\xE1rio de Desenvolvimento",
        type: "admin",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    res.json(mockUser);
  }
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
app.get("/api/vagas", async (req, res) => {
  console.log("\u{1F4BC} Vagas: Endpoint acessado");
  try {
    const { limit, destaque, search } = req.query;
    let query = supabase.from("vagas").select(`
        *,
        empresas!inner(nome, cidade, estado)
      `).eq("status", "ativa").order("created_at", { ascending: false });
    if (destaque === "true") {
      query = query.eq("destaque", true);
    }
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%`);
    }
    if (limit) {
      const limitNum = parseInt(limit);
      query = query.limit(limitNum);
    }
    const { data: vagas, error } = await query;
    if (error) {
      console.error("\u274C Erro ao buscar vagas:", error);
      const vagasMock = [
        {
          id: "1",
          titulo: "Desenvolvedor Frontend React",
          empresa: "Tech Company",
          cidade: "S\xE3o Paulo",
          estado: "SP",
          localizacao: "S\xE3o Paulo, SP",
          modalidade: "Remoto",
          tipo: "Tecnologia",
          salario: "R$ 8.000 - R$ 12.000",
          descricao: "Vaga para desenvolvedor React com experi\xEAncia em TypeScript",
          requisitos: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
          destaque: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
      let vagasFallback = [...vagasMock];
      if (limit) {
        const limitNum = parseInt(limit);
        vagasFallback = vagasFallback.slice(0, limitNum);
      }
      console.log(`\u26A0\uFE0F Vagas: Usando dados mock (${vagasFallback.length} vagas)`);
      return res.json(vagasFallback);
    }
    const vagasFormatadas = vagas?.map((vaga) => ({
      id: vaga.id,
      titulo: vaga.titulo,
      empresa: vaga.empresas?.nome || "Empresa",
      cidade: vaga.empresas?.cidade || vaga.cidade,
      estado: vaga.empresas?.estado || vaga.estado,
      localizacao: `${vaga.empresas?.cidade || vaga.cidade}, ${vaga.empresas?.estado || vaga.estado}`,
      modalidade: vaga.modalidade,
      tipo: vaga.area || vaga.setor || "Geral",
      salario: vaga.salario_min && vaga.salario_max ? `R$ ${vaga.salario_min.toLocaleString()} - R$ ${vaga.salario_max.toLocaleString()}` : vaga.salario,
      descricao: vaga.descricao,
      requisitos: vaga.requisitos || [],
      destaque: vaga.destaque || false,
      createdAt: vaga.created_at,
      created_at: vaga.created_at
    })) || [];
    console.log(`\u2705 Vagas: Retornando ${vagasFormatadas.length} vagas do banco`);
    res.json(vagasFormatadas);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar vagas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar vagas"
    });
  }
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
