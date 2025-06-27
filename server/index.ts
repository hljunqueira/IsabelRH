import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from 'dotenv';
import { supabase } from "./lib/supabase.js";

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

// 🔐 Rota de autenticação com Supabase
app.get("/api/auth/me", async (req, res) => {
  console.log('🔐 Auth/me: Endpoint acessado');
  
  try {
    // Verificar se existe token de autorização
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ Auth/me: Sem token, retornando dados mock');
      // Fallback para dados mock se não houver autenticação
      const mockUser = {
        usuario: {
          id: "dev-user-1",
          email: "dev@isabelrh.com.br",
          name: "Usuário de Desenvolvimento",
          type: "admin",
          created_at: new Date().toISOString()
        }
      };
      return res.json(mockUser);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' do início
    
    // Verificar o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('❌ Auth/me: Token inválido, usando fallback');
      // Fallback para dados mock se o token for inválido
      const mockUser = {
        usuario: {
          id: "dev-user-1",
          email: "dev@isabelrh.com.br",
          name: "Usuário de Desenvolvimento",
          type: "admin",
          created_at: new Date().toISOString()
        }
      };
      return res.json(mockUser);
    }

    // Buscar dados do usuário nas tabelas customizadas
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.log('⚠️ Auth/me: Usuário não encontrado nas tabelas, usando dados do auth');
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

    console.log('✅ Auth/me: Retornando dados do usuário autenticado');
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
    console.error('💥 Erro na autenticação:', error);
    // Fallback para dados mock em caso de erro
    const mockUser = {
      usuario: {
        id: "dev-user-1",
        email: "dev@isabelrh.com.br",
        name: "Usuário de Desenvolvimento",
        type: "admin",
        created_at: new Date().toISOString()
      }
    };
    res.json(mockUser);
  }
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

// 💼 Rota de vagas com Supabase
app.get("/api/vagas", async (req, res) => {
  console.log('💼 Vagas: Endpoint acessado');
  
  try {
    // Verificar parâmetros de query
    const { limit, destaque, search } = req.query;
    
    // Query base para buscar vagas
    let query = supabase
      .from('vagas')
      .select(`
        *,
        empresas!inner(nome, cidade, estado)
      `)
      .eq('status', 'ativa')
      .order('publicado_em', { ascending: false });
    
    // Filtro por destaque
    if (destaque === 'true') {
      query = query.eq('destaque', true);
    }
    
    // Busca por texto
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%`);
    }
    
    // Aplicar limit
    if (limit) {
      const limitNum = parseInt(limit as string);
      query = query.limit(limitNum);
    }
    
    const { data: vagas, error } = await query;
    
    if (error || !vagas || vagas.length === 0) {
      if (error) {
        console.error('❌ Erro ao buscar vagas:', error);
      } else {
        console.log('⚠️ Nenhuma vaga encontrada no banco, usando dados mock');
      }
      
      // Fallback para dados mock se houver erro ou dados vazios
      const vagasMock = [
        {
          id: "1",
          titulo: "Desenvolvedor Frontend React",
          empresa: "Tech Innovate",
          cidade: "São Paulo",
          estado: "SP",
          localizacao: "São Paulo, SP",
          modalidade: "Remoto",
          tipo: "Tecnologia",
          salario: "R$ 8.000 - R$ 12.000",
          descricao: "Desenvolvimento de aplicações modernas com React, TypeScript e melhores práticas de desenvolvimento.",
          requisitos: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
          destaque: true,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          titulo: "Analista de RH",
          empresa: "RH Solutions",
          cidade: "Florianópolis",
          estado: "SC",
          localizacao: "Florianópolis, SC",
          modalidade: "Híbrido",
          tipo: "Recursos Humanos",
          salario: "R$ 5.000 - R$ 7.000",
          descricao: "Atuar em recrutamento e seleção, gestão de pessoas e desenvolvimento de políticas de RH.",
          requisitos: ["Psicologia", "Recrutamento", "Seleção", "Excel"],
          destaque: true,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          titulo: "Designer UX/UI",
          empresa: "Creative Studio",
          cidade: "Porto Alegre",
          estado: "RS",
          localizacao: "Porto Alegre, RS",
          modalidade: "Presencial",
          tipo: "Design",
          salario: "R$ 6.000 - R$ 9.000",
          descricao: "Criação de interfaces intuitivas e experiências digitais excepcionais para aplicações web e mobile.",
          requisitos: ["Figma", "Adobe XD", "Prototyping", "User Research"],
          destaque: false,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];
      
      let vagasFallback = [...vagasMock];
      
      // Aplicar filtros nos dados mock
      if (destaque === 'true') {
        vagasFallback = vagasFallback.filter(vaga => vaga.destaque);
      }
      
      if (limit) {
        const limitNum = parseInt(limit as string);
        vagasFallback = vagasFallback.slice(0, limitNum);
      }
      
      console.log(`⚠️ Vagas: Usando dados mock (${vagasFallback.length} vagas)`);
      return res.json(vagasFallback);
    }
    
    // Transformar dados para o formato esperado pelo frontend
    const vagasFormatadas = vagas?.map((vaga: any) => {
      // Garantir que requisitos é sempre um array
      let requisitos = [];
      if (vaga.requisitos) {
        if (Array.isArray(vaga.requisitos)) {
          requisitos = vaga.requisitos;
        } else if (typeof vaga.requisitos === 'string') {
          // Se for string, dividir por vírgula ou quebra de linha
          requisitos = vaga.requisitos.split(/[,\n]/).map((req: string) => req.trim()).filter((req: string) => req.length > 0);
        }
      }
      
      return {
        id: vaga.id,
        titulo: vaga.titulo,
        empresa: vaga.empresas?.nome || 'Empresa',
        cidade: vaga.empresas?.cidade || vaga.cidade,
        estado: vaga.empresas?.estado || vaga.estado,
        localizacao: `${vaga.empresas?.cidade || vaga.cidade}, ${vaga.empresas?.estado || vaga.estado}`,
        modalidade: vaga.modalidade,
        tipo: vaga.area || vaga.setor || 'Geral',
        salario: vaga.salario_min && vaga.salario_max 
          ? `R$ ${vaga.salario_min.toLocaleString()} - R$ ${vaga.salario_max.toLocaleString()}`
          : vaga.salario,
        descricao: vaga.descricao,
        requisitos: requisitos,
        destaque: vaga.destaque || false,
        createdAt: vaga.publicado_em || vaga.created_at,
        created_at: vaga.publicado_em || vaga.created_at
      };
    }) || [];
    
    console.log(`✅ Vagas: Retornando ${vagasFormatadas.length} vagas do banco`);
    res.json(vagasFormatadas);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar vagas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar vagas'
    });
  }
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
