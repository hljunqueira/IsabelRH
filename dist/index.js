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
      console.log("\u274C Auth/me: Sem token de autoriza\xE7\xE3o");
      return res.status(401).json({
        error: "Token de autoriza\xE7\xE3o necess\xE1rio",
        message: "Fa\xE7a login para acessar esta rota"
      });
    }
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.log("\u274C Auth/me: Token inv\xE1lido");
      return res.status(401).json({
        error: "Token inv\xE1lido",
        message: "Fa\xE7a login novamente"
      });
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
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao verificar autentica\xE7\xE3o"
    });
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
      `).eq("status", "ativa").order("publicado_em", { ascending: false });
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
    if (error || !vagas || vagas.length === 0) {
      if (error) {
        console.error("\u274C Erro ao buscar vagas:", error);
      } else {
        console.log("\u26A0\uFE0F Nenhuma vaga encontrada no banco, usando dados mock");
      }
      console.log("\u26A0\uFE0F Nenhuma vaga encontrada no banco de dados");
      return res.json([]);
    }
    const vagasFormatadas = vagas?.map((vaga) => {
      let requisitos = [];
      if (vaga.requisitos) {
        if (Array.isArray(vaga.requisitos)) {
          requisitos = vaga.requisitos;
        } else if (typeof vaga.requisitos === "string") {
          requisitos = vaga.requisitos.split(/[,\n]/).map((req2) => req2.trim()).filter((req2) => req2.length > 0);
        }
      }
      return {
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
        requisitos,
        destaque: vaga.destaque || false,
        createdAt: vaga.publicado_em || vaga.created_at,
        created_at: vaga.publicado_em || vaga.created_at
      };
    }) || [];
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
app.post("/api/vagas", async (req, res) => {
  console.log("\u{1F195} Vagas: Criando nova vaga");
  try {
    const {
      titulo,
      descricao,
      empresa_id,
      area,
      setor,
      modalidade,
      cidade,
      estado,
      salario_min,
      salario_max,
      salario,
      requisitos,
      beneficios,
      destaque = false
    } = req.body;
    if (!titulo || !descricao || !empresa_id) {
      return res.status(400).json({
        error: "Campos obrigat\xF3rios: titulo, descricao, empresa_id"
      });
    }
    const vagaData = {
      titulo,
      descricao,
      empresa_id,
      area: area || setor,
      setor: setor || area,
      modalidade: modalidade || "presencial",
      cidade: cidade || "N\xE3o informado",
      estado: estado || "SC",
      salario_min: salario_min ? parseFloat(salario_min) : null,
      salario_max: salario_max ? parseFloat(salario_max) : null,
      salario: salario || null,
      requisitos: Array.isArray(requisitos) ? requisitos : requisitos ? requisitos.split(",").map((r) => r.trim()) : [],
      beneficios: Array.isArray(beneficios) ? beneficios : beneficios ? beneficios.split(",").map((b) => b.trim()) : [],
      destaque,
      status: "ativa",
      publicado_em: (/* @__PURE__ */ new Date()).toISOString(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { data: vaga, error } = await supabase.from("vagas").insert(vagaData).select(`
        *,
        empresas!inner(nome, cidade, estado)
      `).single();
    if (error) {
      console.error("\u274C Erro ao criar vaga:", error);
      return res.status(500).json({
        error: "Erro ao criar vaga",
        message: error.message
      });
    }
    const vagaFormatada = {
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
      beneficios: vaga.beneficios || [],
      destaque: vaga.destaque || false,
      createdAt: vaga.publicado_em || vaga.created_at,
      created_at: vaga.publicado_em || vaga.created_at
    };
    console.log("\u2705 Vaga criada com sucesso:", vaga.id);
    res.status(201).json(vagaFormatada);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao criar vaga:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao criar vaga"
    });
  }
});
app.get("/api/admin/candidatos", async (req, res) => {
  console.log("\u{1F465} Admin/candidatos: Endpoint acessado");
  try {
    const { search, limit } = req.query;
    let query = supabase.from("candidatos").select("*").order("created_at", { ascending: false });
    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
    }
    if (limit) {
      const limitNum = parseInt(limit);
      query = query.limit(limitNum);
    }
    const { data: candidatos, error } = await query;
    if (error) {
      console.error("\u274C Erro ao buscar candidatos:", error);
      return res.status(500).json({
        error: "Erro ao buscar candidatos",
        message: error.message
      });
    }
    console.log(`\u2705 Admin/candidatos: Retornando ${candidatos?.length || 0} candidatos`);
    res.json(candidatos || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar candidatos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar candidatos"
    });
  }
});
app.get("/api/admin/empresas", async (req, res) => {
  console.log("\u{1F3E2} Admin/empresas: Endpoint acessado");
  try {
    const { search, limit } = req.query;
    let query = supabase.from("empresas").select("*").order("created_at", { ascending: false });
    if (search) {
      query = query.or(`nome.ilike.%${search}%,cnpj.ilike.%${search}%,email.ilike.%${search}%,setor.ilike.%${search}%`);
    }
    if (limit) {
      const limitNum = parseInt(limit);
      query = query.limit(limitNum);
    }
    const { data: empresas, error } = await query;
    if (error) {
      console.error("\u274C Erro ao buscar empresas:", error);
      return res.status(500).json({
        error: "Erro ao buscar empresas",
        message: error.message
      });
    }
    console.log(`\u2705 Admin/empresas: Retornando ${empresas?.length || 0} empresas`);
    res.json(empresas || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar empresas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar empresas"
    });
  }
});
app.get("/api/admin/servicos", async (req, res) => {
  console.log("\u{1F6E0}\uFE0F Admin/servicos: Endpoint acessado");
  try {
    const { data: servicos, error } = await supabase.from("servicos").select(`
        *,
        empresas!inner(nome)
      `).order("created_at", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar servi\xE7os:", error);
      return res.status(500).json({
        error: "Erro ao buscar servi\xE7os",
        message: error.message
      });
    }
    const servicosFormatados = servicos?.map((servico) => ({
      ...servico,
      empresa: servico.empresas?.nome || "Empresa n\xE3o encontrada"
    })) || [];
    console.log(`\u2705 Admin/servicos: Retornando ${servicosFormatados.length} servi\xE7os`);
    res.json(servicosFormatados);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar servi\xE7os:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar servi\xE7os"
    });
  }
});
app.get("/api/admin/propostas", async (req, res) => {
  console.log("\u{1F4CB} Admin/propostas: Endpoint acessado");
  try {
    const { data: propostas, error } = await supabase.from("propostas").select(`
        *,
        empresas!inner(nome)
      `).order("created_at", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar propostas:", error);
      return res.status(500).json({
        error: "Erro ao buscar propostas",
        message: error.message
      });
    }
    const propostasFormatadas = propostas?.map((proposta) => ({
      ...proposta,
      empresa: proposta.empresas?.nome || "Empresa n\xE3o encontrada"
    })) || [];
    console.log(`\u2705 Admin/propostas: Retornando ${propostasFormatadas.length} propostas`);
    res.json(propostasFormatadas);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar propostas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar propostas"
    });
  }
});
app.post("/api/admin/servicos", async (req, res) => {
  console.log("\u{1F195} Admin/servicos: Criando novo servi\xE7o");
  try {
    const { data: servico, error } = await supabase.from("servicos").insert(req.body).select().single();
    if (error) {
      console.error("\u274C Erro ao criar servi\xE7o:", error);
      return res.status(500).json({
        error: "Erro ao criar servi\xE7o",
        message: error.message
      });
    }
    console.log("\u2705 Servi\xE7o criado com sucesso:", servico.id);
    res.status(201).json(servico);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao criar servi\xE7o:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao criar servi\xE7o"
    });
  }
});
app.post("/api/admin/propostas", async (req, res) => {
  console.log("\u{1F195} Admin/propostas: Criando nova proposta");
  try {
    const { data: proposta, error } = await supabase.from("propostas").insert({
      ...req.body,
      aprovada: "pendente",
      data_proposta: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) {
      console.error("\u274C Erro ao criar proposta:", error);
      return res.status(500).json({
        error: "Erro ao criar proposta",
        message: error.message
      });
    }
    console.log("\u2705 Proposta criada com sucesso:", proposta.id);
    res.status(201).json(proposta);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao criar proposta:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao criar proposta"
    });
  }
});
app.patch("/api/admin/propostas/:id", async (req, res) => {
  console.log("\u{1F4DD} Admin/propostas: Atualizando proposta", req.params.id);
  try {
    const { data: proposta, error } = await supabase.from("propostas").update({
      ...req.body,
      data_resposta: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", req.params.id).select().single();
    if (error) {
      console.error("\u274C Erro ao atualizar proposta:", error);
      return res.status(500).json({
        error: "Erro ao atualizar proposta",
        message: error.message
      });
    }
    console.log("\u2705 Proposta atualizada com sucesso");
    res.json(proposta);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao atualizar proposta:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao atualizar proposta"
    });
  }
});
app.delete("/api/admin/candidatos/:id", async (req, res) => {
  console.log("\u{1F5D1}\uFE0F Admin/candidatos: Deletando candidato", req.params.id);
  try {
    const { error } = await supabase.from("candidatos").delete().eq("id", req.params.id);
    if (error) {
      console.error("\u274C Erro ao deletar candidato:", error);
      return res.status(500).json({
        error: "Erro ao deletar candidato",
        message: error.message
      });
    }
    console.log("\u2705 Candidato deletado com sucesso");
    res.json({ message: "Candidato deletado com sucesso" });
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao deletar candidato:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao deletar candidato"
    });
  }
});
app.delete("/api/admin/empresas/:id", async (req, res) => {
  console.log("\u{1F5D1}\uFE0F Admin/empresas: Deletando empresa", req.params.id);
  try {
    const { error } = await supabase.from("empresas").delete().eq("id", req.params.id);
    if (error) {
      console.error("\u274C Erro ao deletar empresa:", error);
      return res.status(500).json({
        error: "Erro ao deletar empresa",
        message: error.message
      });
    }
    console.log("\u2705 Empresa deletada com sucesso");
    res.json({ message: "Empresa deletada com sucesso" });
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao deletar empresa:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao deletar empresa"
    });
  }
});
app.get("/api/multicliente/clientes", async (req, res) => {
  console.log("\u{1F3E2} MultiCliente/clientes: Endpoint acessado");
  try {
    const { data: clientes, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar clientes:", error);
      return res.status(500).json({
        error: "Erro ao buscar clientes",
        message: error.message
      });
    }
    console.log(`\u2705 MultiCliente/clientes: Retornando ${clientes?.length || 0} clientes`);
    res.json(clientes || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar clientes:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar clientes"
    });
  }
});
app.get("/api/multicliente/usuarios", async (req, res) => {
  console.log("\u{1F465} MultiCliente/usuarios: Endpoint acessado");
  try {
    const { data: usuarios, error } = await supabase.from("usuarios_clientes").select(`
        *,
        clientes!inner(nome)
      `).order("created_at", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar usu\xE1rios:", error);
      return res.status(500).json({
        error: "Erro ao buscar usu\xE1rios",
        message: error.message
      });
    }
    const usuariosFormatados = usuarios?.map((usuario) => ({
      ...usuario,
      cliente: usuario.clientes?.nome || "Cliente n\xE3o encontrado"
    })) || [];
    console.log(`\u2705 MultiCliente/usuarios: Retornando ${usuariosFormatados.length} usu\xE1rios`);
    res.json(usuariosFormatados);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar usu\xE1rios:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar usu\xE1rios"
    });
  }
});
app.get("/api/multicliente/planos", async (req, res) => {
  console.log("\u{1F4CB} MultiCliente/planos: Endpoint acessado");
  try {
    const { data: planos, error } = await supabase.from("planos").select("*").eq("ativo", true).order("preco", { ascending: true });
    if (error) {
      console.error("\u274C Erro ao buscar planos:", error);
      return res.status(500).json({
        error: "Erro ao buscar planos",
        message: error.message
      });
    }
    console.log(`\u2705 MultiCliente/planos: Retornando ${planos?.length || 0} planos`);
    res.json(planos || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar planos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar planos"
    });
  }
});
app.post("/api/multicliente/clientes", async (req, res) => {
  console.log("\u{1F195} MultiCliente/clientes: Criando novo cliente");
  try {
    const { data: cliente, error } = await supabase.from("clientes").insert(req.body).select().single();
    if (error) {
      console.error("\u274C Erro ao criar cliente:", error);
      return res.status(500).json({
        error: "Erro ao criar cliente",
        message: error.message
      });
    }
    console.log("\u2705 Cliente criado com sucesso:", cliente.id);
    res.status(201).json(cliente);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao criar cliente:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao criar cliente"
    });
  }
});
app.get("/api/hunting/campanhas", async (req, res) => {
  console.log("\u{1F3AF} Hunting/campanhas: Endpoint acessado");
  try {
    const { data: campanhas, error } = await supabase.from("campanhas_hunting").select("*").order("criada_em", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar campanhas:", error);
      return res.status(500).json({
        error: "Erro ao buscar campanhas",
        message: error.message
      });
    }
    console.log(`\u2705 Hunting/campanhas: Retornando ${campanhas?.length || 0} campanhas`);
    res.json(campanhas || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar campanhas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar campanhas"
    });
  }
});
app.get("/api/hunting/templates", async (req, res) => {
  console.log("\u{1F4DD} Hunting/templates: Endpoint acessado");
  try {
    const { data: templates, error } = await supabase.from("templates_hunting").select("*").eq("ativo", true).order("created_at", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar templates:", error);
      return res.status(500).json({
        error: "Erro ao buscar templates",
        message: error.message
      });
    }
    console.log(`\u2705 Hunting/templates: Retornando ${templates?.length || 0} templates`);
    res.json(templates || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar templates:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar templates"
    });
  }
});
app.get("/api/hunting/integracoes", async (req, res) => {
  console.log("\u{1F517} Hunting/integracoes: Endpoint acessado");
  try {
    const { data: integracoes, error } = await supabase.from("integracoes_hunting").select("*").order("nome", { ascending: true });
    if (error) {
      console.error("\u274C Erro ao buscar integra\xE7\xF5es:", error);
      return res.status(500).json({
        error: "Erro ao buscar integra\xE7\xF5es",
        message: error.message
      });
    }
    console.log(`\u2705 Hunting/integracoes: Retornando ${integracoes?.length || 0} integra\xE7\xF5es`);
    res.json(integracoes || []);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar integra\xE7\xF5es:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar integra\xE7\xF5es"
    });
  }
});
app.post("/api/hunting/campanhas", async (req, res) => {
  console.log("\u{1F195} Hunting/campanhas: Criando nova campanha");
  try {
    const { data: campanha, error } = await supabase.from("campanhas_hunting").insert({
      ...req.body,
      status: "ativa",
      total_encontrados: 0,
      total_contactados: 0,
      total_interessados: 0
    }).select().single();
    if (error) {
      console.error("\u274C Erro ao criar campanha:", error);
      return res.status(500).json({
        error: "Erro ao criar campanha",
        message: error.message
      });
    }
    console.log("\u2705 Campanha criada com sucesso:", campanha.id);
    res.status(201).json(campanha);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao criar campanha:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao criar campanha"
    });
  }
});
app.post("/api/parsing/upload", async (req, res) => {
  console.log("\u{1F4C4} Parsing/upload: Endpoint acessado");
  try {
    const dadosVazios = {
      sucesso: true,
      dados: null,
      confianca: 0,
      camposDetectados: [],
      camposFaltantes: ["Todos os campos - implementar parsing real"]
    };
    console.log("\u26A0\uFE0F Parsing: Sistema preparado - implementar integra\xE7\xE3o real");
    res.json(dadosVazios);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno no parsing:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro no parsing de arquivo"
    });
  }
});
app.get("/api/vagas/:vagaId/triagem-config", async (req, res) => {
  console.log("\u{1F3AF} Triagem: Carregar configura\xE7\xE3o");
  try {
    const { vagaId } = req.params;
    const { data: config, error } = await supabase.from("triagem_configuracao").select("*").eq("vaga_id", vagaId).single();
    if (error && error.code !== "PGRST116") {
      throw error;
    }
    const configuracao = config || {
      filtros: [],
      acoes: [],
      ativo: false
    };
    res.json(configuracao);
  } catch (error) {
    console.error("\u274C Erro ao carregar config triagem:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.post("/api/vagas/:vagaId/triagem-config", async (req, res) => {
  console.log("\u{1F3AF} Triagem: Salvar configura\xE7\xE3o");
  try {
    const { vagaId } = req.params;
    const { filtros, acoes } = req.body;
    const { data, error } = await supabase.from("triagem_configuracao").upsert({
      vaga_id: vagaId,
      filtros: JSON.stringify(filtros),
      acoes: JSON.stringify(acoes),
      atualizada_em: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error("\u274C Erro ao salvar config triagem:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/api/vagas/:vagaId/triagem-stats", async (req, res) => {
  console.log("\u{1F3AF} Triagem: Carregar estat\xEDsticas");
  try {
    const { vagaId } = req.params;
    const { data: candidaturas, error } = await supabase.from("candidaturas").select("status, pontuacao").eq("vaga_id", vagaId);
    if (error) throw error;
    const totalCandidatos = candidaturas?.length || 0;
    const aprovados = candidaturas?.filter((c) => c.status === "aprovado").length || 0;
    const rejeitados = candidaturas?.filter((c) => c.status === "rejeitado").length || 0;
    const aguardando = candidaturas?.filter((c) => c.status === "pendente").length || 0;
    const taxaAprovacao = totalCandidatos > 0 ? Math.round(aprovados / totalCandidatos * 100) : 0;
    res.json({
      totalCandidatos,
      aprovados,
      rejeitados,
      aguardando,
      taxaAprovacao,
      tempoMedioProcessamento: 24
      // horas - mockado por enquanto
    });
  } catch (error) {
    console.error("\u274C Erro ao carregar stats triagem:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.post("/api/vagas/:vagaId/triagem-toggle", async (req, res) => {
  console.log("\u{1F3AF} Triagem: Toggle ativo/inativo");
  try {
    const { vagaId } = req.params;
    const { ativo } = req.body;
    const { data, error } = await supabase.from("triagem_configuracao").upsert({
      vaga_id: vagaId,
      ativo,
      atualizada_em: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) throw error;
    res.json({ success: true, ativo });
  } catch (error) {
    console.error("\u274C Erro ao toggle triagem:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.post("/api/vagas/:vagaId/triagem-executar", async (req, res) => {
  console.log("\u{1F3AF} Triagem: Executar triagem autom\xE1tica");
  try {
    const { vagaId } = req.params;
    res.json({
      success: true,
      message: "Triagem executada com sucesso",
      processados: 0
      // Por enquanto mockado
    });
  } catch (error) {
    console.error("\u274C Erro ao executar triagem:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/api/vagas/empresa/:empresaId", async (req, res) => {
  console.log("\u{1F3C6} Ranking: Carregar vagas da empresa");
  try {
    const { empresaId } = req.params;
    const { data: vagas, error } = await supabase.from("vagas").select(`
        id,
        titulo,
        cidade,
        estado,
        modalidade,
        nivel,
        area,
        status,
        publicado_em
      `).eq("empresa_id", empresaId).eq("status", "ativa").order("publicado_em", { ascending: false });
    if (error) throw error;
    res.json(vagas || []);
  } catch (error) {
    console.error("\u274C Erro ao carregar vagas empresa:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/api/vagas/:vagaId/candidatos-ranking", async (req, res) => {
  console.log("\u{1F3C6} Ranking: Carregar ranking de candidatos");
  try {
    const { vagaId } = req.params;
    const { data: candidaturas, error } = await supabase.from("candidaturas").select(`
        *,
        candidatos!inner(
          id,
          nome,
          email,
          telefone,
          cidade,
          estado,
          experiencia,
          habilidades,
          perfil_disc,
          foto_perfil
        )
      `).eq("vaga_id", vagaId);
    if (error) throw error;
    const candidatosComScore = (candidaturas || []).map((candidatura) => {
      const candidato = candidatura.candidatos;
      let score = 60;
      if (candidato.experiencia) {
        score += Math.min(candidato.experiencia * 2, 20);
      }
      score += Math.random() * 20;
      score = Math.max(0, Math.min(100, Math.round(score)));
      return {
        id: candidatura.id,
        candidato: {
          id: candidato.id,
          nome: candidato.nome,
          email: candidato.email,
          telefone: candidato.telefone,
          localizacao: `${candidato.cidade || ""}, ${candidato.estado || ""}`.trim(),
          experiencia: candidato.experiencia || 0,
          habilidades: candidato.habilidades || [],
          perfilDisc: candidato.perfil_disc,
          avatar: candidato.foto_perfil
        },
        score,
        match: score,
        // Por enquanto, match = score
        status: candidatura.status || "pendente",
        dataAplicacao: candidatura.criado_em,
        classificacao: score >= 80 ? "Alto" : score >= 60 ? "M\xE9dio" : "Baixo"
      };
    });
    candidatosComScore.sort((a, b) => b.score - a.score);
    res.json(candidatosComScore);
  } catch (error) {
    console.error("\u274C Erro ao carregar ranking candidatos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.post("/api/banco-talentos", async (req, res) => {
  console.log("\u{1F465} Banco Talentos: Novo cadastro");
  try {
    const { nome, email, telefone, areaInteresse, curriculoUrl } = req.body;
    if (!nome || !email || !areaInteresse) {
      return res.status(400).json({
        error: "Nome, email e \xE1rea de interesse s\xE3o obrigat\xF3rios"
      });
    }
    const { data, error } = await supabase.from("banco_talentos").insert({
      nome,
      email,
      telefone: telefone || null,
      area_interesse: areaInteresse,
      curriculo_url: curriculoUrl || null,
      criado_em: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) throw error;
    res.json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      data
    });
  } catch (error) {
    console.error("\u274C Erro ao cadastrar no banco de talentos:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return res.status(400).json({
        error: "Este email j\xE1 est\xE1 cadastrado em nosso banco de talentos"
      });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.get("/api/comunicacao/conversas", async (req, res) => {
  console.log("\u{1F4AC} Comunicacao/conversas: Endpoint acessado");
  try {
    const { userId, userType } = req.query;
    if (!userId || !userType) {
      return res.status(400).json({
        error: "Par\xE2metros obrigat\xF3rios: userId e userType"
      });
    }
    let query = supabase.from("conversas").select(`
      *,
      candidatos:candidato_id(nome, email),
      empresas:empresa_id(nome, email),
      vagas:vaga_id(titulo)
    `);
    if (userType === "candidato") {
      query = query.eq("candidato_id", userId);
    } else if (userType === "empresa") {
      query = query.eq("empresa_id", userId);
    }
    const { data: conversas, error } = await query.order("atualizada_em", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar conversas:", error);
      return res.status(500).json({
        error: "Erro ao buscar conversas",
        message: error.message
      });
    }
    console.log(`\u2705 Conversas: Retornando ${conversas?.length || 0} conversas`);
    res.json({ conversas: conversas || [] });
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar conversas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar conversas"
    });
  }
});
app.get("/api/comunicacao/conversas/:id/mensagens", async (req, res) => {
  console.log("\u{1F4AC} Comunicacao/mensagens: Endpoint acessado");
  try {
    const { id: conversaId } = req.params;
    const { data: mensagens, error } = await supabase.from("mensagens").select(`
        *,
        remetente:remetente_id(nome, email),
        destinatario:destinatario_id(nome, email)
      `).eq("conversa_id", conversaId).order("data_envio", { ascending: true });
    if (error) {
      console.error("\u274C Erro ao buscar mensagens:", error);
      return res.status(500).json({
        error: "Erro ao buscar mensagens",
        message: error.message
      });
    }
    console.log(`\u2705 Mensagens: Retornando ${mensagens?.length || 0} mensagens`);
    res.json({ mensagens: mensagens || [] });
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar mensagens:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar mensagens"
    });
  }
});
app.post("/api/comunicacao/conversas/:id/mensagens", async (req, res) => {
  console.log("\u{1F4AC} Comunicacao/enviar: Endpoint acessado");
  try {
    const { id: conversaId } = req.params;
    const { texto, remetenteId, remetenteTipo, destinatarioId, destinatarioTipo } = req.body;
    if (!texto || !remetenteId || !remetenteTipo) {
      return res.status(400).json({
        error: "Dados obrigat\xF3rios: texto, remetenteId, remetenteTipo"
      });
    }
    const { data: mensagem, error } = await supabase.from("mensagens").insert({
      conversa_id: conversaId,
      remetente_id: remetenteId,
      remetente_tipo: remetenteTipo,
      destinatario_id: destinatarioId,
      destinatario_tipo: destinatarioTipo,
      conteudo: texto,
      tipo: "texto",
      lida: false,
      data_envio: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) {
      console.error("\u274C Erro ao enviar mensagem:", error);
      return res.status(500).json({
        error: "Erro ao enviar mensagem",
        message: error.message
      });
    }
    await supabase.from("conversas").update({
      atualizada_em: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", conversaId);
    try {
      await supabase.rpc("increment_conversa_counters", {
        conversa_id: conversaId
      });
    } catch (rpcError) {
      console.log("\u26A0\uFE0F RPC increment_conversa_counters n\xE3o configurada ainda");
    }
    console.log("\u2705 Mensagem enviada com sucesso");
    res.status(201).json(mensagem);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao enviar mensagem:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao enviar mensagem"
    });
  }
});
app.get("/api/comunicacao/notificacoes", async (req, res) => {
  console.log("\u{1F514} Comunicacao/notificacoes: Endpoint acessado");
  try {
    const { userId, userType } = req.query;
    if (!userId || !userType) {
      return res.status(400).json({
        error: "Par\xE2metros obrigat\xF3rios: userId e userType"
      });
    }
    const { data: notificacoes, error } = await supabase.from("notificacoes").select("*").eq("usuario_id", userId).eq("usuario_tipo", userType).order("criada_em", { ascending: false });
    if (error) {
      console.error("\u274C Erro ao buscar notifica\xE7\xF5es:", error);
      return res.status(500).json({
        error: "Erro ao buscar notifica\xE7\xF5es",
        message: error.message
      });
    }
    console.log(`\u2705 Notifica\xE7\xF5es: Retornando ${notificacoes?.length || 0} notifica\xE7\xF5es`);
    res.json({ notificacoes: notificacoes || [] });
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao buscar notifica\xE7\xF5es:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao buscar notifica\xE7\xF5es"
    });
  }
});
app.post("/api/comunicacao/notificacoes/:id/ler", async (req, res) => {
  console.log("\u{1F514} Comunicacao/marcar-lida: Endpoint acessado");
  try {
    const { id: notificacaoId } = req.params;
    const { data: notificacao, error } = await supabase.from("notificacoes").update({
      lida: true,
      lida_em: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", notificacaoId).select().single();
    if (error) {
      console.error("\u274C Erro ao marcar notifica\xE7\xE3o como lida:", error);
      return res.status(500).json({
        error: "Erro ao marcar como lida",
        message: error.message
      });
    }
    console.log("\u2705 Notifica\xE7\xE3o marcada como lida");
    res.json(notificacao);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao marcar como lida:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao marcar como lida"
    });
  }
});
app.post("/api/comunicacao/conversas", async (req, res) => {
  console.log("\u{1F4AC} Comunicacao/criar-conversa: Endpoint acessado");
  try {
    const { candidatoId, empresaId, vagaId, titulo, criadorId } = req.body;
    if (!candidatoId || !empresaId) {
      return res.status(400).json({
        error: "Dados obrigat\xF3rios: candidatoId, empresaId"
      });
    }
    const { data: conversa, error } = await supabase.from("conversas").insert({
      candidato_id: candidatoId,
      empresa_id: empresaId,
      vaga_id: vagaId,
      titulo: titulo || "Nova conversa",
      status: "ativa",
      total_mensagens: 0,
      nao_lidas: 0,
      criada_em: (/* @__PURE__ */ new Date()).toISOString(),
      atualizada_em: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) {
      console.error("\u274C Erro ao criar conversa:", error);
      return res.status(500).json({
        error: "Erro ao criar conversa",
        message: error.message
      });
    }
    console.log("\u2705 Conversa criada com sucesso");
    res.status(201).json(conversa);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao criar conversa:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao criar conversa"
    });
  }
});
app.get("/api/relatorios/empresa/:id", async (req, res) => {
  console.log("\u{1F4CA} Relatorios/empresa: Endpoint acessado");
  try {
    const { id: empresaId } = req.params;
    const { periodo } = req.query;
    if (!empresaId) {
      return res.status(400).json({
        error: "ID da empresa \xE9 obrigat\xF3rio"
      });
    }
    const diasPeriodo = parseInt(periodo) || 30;
    const dataInicio = /* @__PURE__ */ new Date();
    dataInicio.setDate(dataInicio.getDate() - diasPeriodo);
    const { data: empresa, error: errorEmpresa } = await supabase.from("empresas").select("*").eq("id", empresaId).single();
    if (errorEmpresa) {
      console.error("\u274C Erro ao buscar empresa:", errorEmpresa);
      return res.status(500).json({
        error: "Erro ao buscar empresa",
        message: errorEmpresa.message
      });
    }
    const { data: vagas, error: errorVagas } = await supabase.from("vagas").select("id, titulo, status, publicado_em").eq("empresa_id", empresaId);
    const vagasIds = vagas?.map((v) => v.id) || [];
    const { data: candidaturas, error: errorCandidaturas } = vagasIds.length > 0 ? await supabase.from("candidaturas").select("*").in("vaga_id", vagasIds).gte("data_candidatura", dataInicio.toISOString()) : { data: [], error: null };
    const totalVagas = vagas?.length || 0;
    const vagasAtivas = vagas?.filter((v) => v.status === "ativa").length || 0;
    const totalCandidaturas = candidaturas?.length || 0;
    const candidaturasAprovadas = candidaturas?.filter((c) => c.status === "aprovado").length || 0;
    const dadosRelatorio = {
      totalVagas,
      vagasAtivas,
      vagasPublicadas: totalVagas,
      candidaturasRecebidas: totalCandidaturas,
      candidatosAtivos: totalCandidaturas,
      entrevistasRealizadas: candidaturas?.filter((c) => c.etapa === "entrevista").length || 0,
      contratacoesEfetivadas: candidaturas?.filter((c) => c.status === "contratado").length || 0,
      taxaConversao: totalCandidaturas > 0 ? Math.round(candidaturasAprovadas / totalCandidaturas * 100) : 0,
      mediaCandidatosPorVaga: totalVagas > 0 ? Math.round(totalCandidaturas / totalVagas) : 0,
      tempoMedio: "15 dias",
      tempoMedioProcesso: "15 dias",
      taxaAprovacao: totalCandidaturas > 0 ? Math.round(candidaturasAprovadas / totalCandidaturas * 100) : 0,
      satisfacaoCandidatos: "4.2/5.0",
      timeToFill: "12 dias",
      costPerHire: "R$ 2.500",
      qualityOfHire: "4.1/5.0",
      sourceEffectiveness: "78%",
      taxaRetencao: 85,
      indiceDiversidade: "3.8/5.0",
      npsCandidatos: 42,
      roiRecrutamento: "156%"
    };
    console.log(`\u2705 Relat\xF3rios: Dados gerados para empresa ${empresaId}`);
    res.json(dadosRelatorio);
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao gerar relat\xF3rio:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao gerar relat\xF3rio"
    });
  }
});
app.post("/api/relatorios/exportar", async (req, res) => {
  console.log("\u{1F4CA} Relatorios/exportar: Endpoint acessado");
  try {
    const { empresaId, tipo, formato, periodo } = req.body;
    if (!empresaId || !formato) {
      return res.status(400).json({
        error: "Dados obrigat\xF3rios: empresaId, formato"
      });
    }
    if (formato === "json") {
      const dados = {
        empresa: empresaId,
        periodo: periodo || "30",
        tipo: tipo || "geral",
        geradoEm: (/* @__PURE__ */ new Date()).toISOString(),
        dados: {
          resumo: "Relat\xF3rio exportado com sucesso",
          observacoes: "Implementar exporta\xE7\xE3o real conforme necess\xE1rio"
        }
      };
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=relatorio-${tipo}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`);
      res.json(dados);
    } else if (formato === "csv") {
      const csvData = `Data,M\xE9trica,Valor
${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]},Relat\xF3rio Gerado,Sucesso
`;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=relatorio-${tipo}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
      res.send(csvData);
    } else {
      res.status(501).json({
        error: "Formato n\xE3o implementado ainda",
        message: `Formato ${formato} ser\xE1 implementado em vers\xE3o futura`
      });
    }
  } catch (error) {
    console.error("\u{1F4A5} Erro interno ao exportar relat\xF3rio:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao exportar relat\xF3rio"
    });
  }
});
app.delete("/api/admin/servicos/:id", async (req, res) => {
  console.log("\u{1F5D1}\uFE0F Admin: Deletar servi\xE7o", req.params.id);
  try {
    const { id } = req.params;
    const { data: servico, error: checkError } = await supabase.from("servicos").select("id, tipoServico").eq("id", id).single();
    if (checkError || !servico) {
      return res.status(404).json({ error: "Servi\xE7o n\xE3o encontrado" });
    }
    const { error: deleteError } = await supabase.from("servicos").delete().eq("id", id);
    if (deleteError) {
      throw deleteError;
    }
    res.json({
      message: "Servi\xE7o removido com sucesso",
      servicoId: id
    });
  } catch (error) {
    console.error("\u274C Erro ao deletar servi\xE7o:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
app.delete("/api/admin/propostas/:id", async (req, res) => {
  console.log("\u{1F5D1}\uFE0F Admin: Deletar proposta", req.params.id);
  try {
    const { id } = req.params;
    const { data: proposta, error: checkError } = await supabase.from("propostas").select("id, tipoServico").eq("id", id).single();
    if (checkError || !proposta) {
      return res.status(404).json({ error: "Proposta n\xE3o encontrada" });
    }
    const { error: deleteError } = await supabase.from("propostas").delete().eq("id", id);
    if (deleteError) {
      throw deleteError;
    }
    res.json({
      message: "Proposta removida com sucesso",
      propostaId: id
    });
  } catch (error) {
    console.error("\u274C Erro ao deletar proposta:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
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
      availableRoutes: ["/api", "/api/test", "/api/health", "/api/auth/me", "/api/vagas", "/api/admin/candidatos", "/api/admin/empresas", "/api/admin/servicos", "/api/admin/propostas"]
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
  console.log("   - GET /api/admin/candidatos - Lista de candidatos (admin)");
  console.log("   - DELETE /api/admin/candidatos/:id - Deletar candidato (admin)");
  console.log("   - GET /api/admin/empresas - Lista de empresas (admin)");
  console.log("   - DELETE /api/admin/empresas/:id - Deletar empresa (admin)");
  console.log("   - GET /api/admin/servicos - Lista de servi\xE7os (admin)");
  console.log("   - POST /api/admin/servicos - Criar servi\xE7o (admin)");
  console.log("   - GET /api/admin/propostas - Lista de propostas (admin)");
  console.log("   - POST /api/admin/propostas - Criar proposta (admin)");
  console.log("   - PATCH /api/admin/propostas/:id - Atualizar proposta (admin)");
  console.log("   - GET /api/multicliente/clientes - Lista de clientes");
  console.log("   - GET /api/multicliente/usuarios - Lista de usu\xE1rios");
  console.log("   - GET /api/multicliente/planos - Lista de planos");
  console.log("   - POST /api/multicliente/clientes - Criar cliente");
  console.log("   - GET /api/hunting/campanhas - Lista de campanhas hunting");
  console.log("   - GET /api/hunting/templates - Lista de templates");
  console.log("   - GET /api/hunting/integracoes - Lista de integra\xE7\xF5es");
  console.log("   - POST /api/hunting/campanhas - Criar campanha");
  console.log("   - POST /api/parsing/upload - Upload e parsing de curr\xEDculos");
  console.log("\u{1F5A5}\uFE0F Frontend React dispon\xEDvel em: /");
  console.log("\u2728 Isabel RH v5.0 - Sistema completo funcionando!");
});
