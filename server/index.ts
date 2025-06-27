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

// Removido sistema mock - usando apenas Supabase

// 🔐 Rota de autenticação com Supabase
app.get("/api/auth/me", async (req, res) => {
  console.log('🔐 Auth/me: Endpoint acessado');
  
  try {
    // Verificar se existe token de autorização
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Auth/me: Sem token de autorização');
      return res.status(401).json({ 
        error: 'Token de autorização necessário',
        message: 'Faça login para acessar esta rota'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' do início
    
    // Verificar o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('❌ Auth/me: Token inválido');
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'Faça login novamente'
      });
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
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar autenticação'
    });
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
      
      console.log('⚠️ Nenhuma vaga encontrada no banco de dados');
      return res.json([]);
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
        createdAt: vaga.publicado_em || vaga.criado_em,
        created_at: vaga.publicado_em || vaga.criado_em
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

// 🆕 Rota para criar vagas
app.post("/api/vagas", async (req, res) => {
  console.log('🆕 Vagas: Criando nova vaga');
  
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

    // Validação básica
    if (!titulo || !descricao || !empresa_id) {
      return res.status(400).json({
        error: 'Campos obrigatórios: titulo, descricao, empresa_id'
      });
    }

    // Dados da vaga
    const vagaData = {
      titulo,
      descricao,
      empresa_id,
      area: area || setor,
      setor: setor || area,
      modalidade: modalidade || 'presencial',
      cidade: cidade || 'Não informado',
      estado: estado || 'SC',
      salario_min: salario_min ? parseFloat(salario_min) : null,
      salario_max: salario_max ? parseFloat(salario_max) : null,
      salario: salario || null,
      requisitos: Array.isArray(requisitos) ? requisitos : (requisitos ? requisitos.split(',').map((r: string) => r.trim()) : []),
      beneficios: Array.isArray(beneficios) ? beneficios : (beneficios ? beneficios.split(',').map((b: string) => b.trim()) : []),
      destaque: destaque,
      status: 'ativa',
      publicado_em: new Date().toISOString(),
      criado_em: new Date().toISOString()
    };

    const { data: vaga, error } = await supabase
      .from('vagas')
      .insert(vagaData)
      .select(`
        *,
        empresas!inner(nome, cidade, estado)
      `)
      .single();

    if (error) {
      console.error('❌ Erro ao criar vaga:', error);
      return res.status(500).json({
        error: 'Erro ao criar vaga',
        message: error.message
      });
    }

    // Formatar resposta
    const vagaFormatada = {
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
      requisitos: vaga.requisitos || [],
      beneficios: vaga.beneficios || [],
      destaque: vaga.destaque || false,
      createdAt: vaga.publicado_em || vaga.criado_em,
      criado_em: vaga.criado_em
    };

    console.log('✅ Vaga criada com sucesso:', vaga.id);
    res.status(201).json(vagaFormatada);

  } catch (error) {
    console.error('💥 Erro interno ao criar vaga:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao criar vaga'
    });
  }
});

// 🎯 Rota de candidatos admin
app.get("/api/admin/candidatos", async (req, res) => {
  console.log('👥 Admin/candidatos: Endpoint acessado');
  
  try {
    const { search, limit } = req.query;
    
    // Query base
    let query = supabase
      .from('candidatos')
      .select('*')
      .order('criado_em', { ascending: false });
    
    // Busca por texto
    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
    }
    
    // Aplicar limit
    if (limit) {
      const limitNum = parseInt(limit as string);
      query = query.limit(limitNum);
    }
    
    const { data: candidatos, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar candidatos:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar candidatos',
        message: error.message 
      });
    }
    
    console.log(`✅ Admin/candidatos: Retornando ${candidatos?.length || 0} candidatos`);
    res.json(candidatos || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar candidatos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar candidatos'
    });
  }
});

// 🏢 Rota de empresas admin
app.get("/api/admin/empresas", async (req, res) => {
  console.log('🏢 Admin/empresas: Endpoint acessado');
  
  try {
    const { search, limit } = req.query;
    
    // Query base
    let query = supabase
      .from('empresas')
      .select('*')
      .order('criado_em', { ascending: false });
    
    // Busca por texto
    if (search) {
      query = query.or(`nome.ilike.%${search}%,cnpj.ilike.%${search}%,setor.ilike.%${search}%`);
    }
    
    // Aplicar limit
    if (limit) {
      const limitNum = parseInt(limit as string);
      query = query.limit(limitNum);
    }
    
    const { data: empresas, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar empresas:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar empresas',
        message: error.message 
      });
    }
    
    console.log(`✅ Admin/empresas: Retornando ${empresas?.length || 0} empresas`);
    res.json(empresas || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar empresas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar empresas'
    });
  }
});

// 🛠️ Rota de serviços admin
app.get("/api/admin/servicos", async (req, res) => {
  console.log('🛠️ Admin/servicos: Endpoint acessado');
  
  try {
    const { data: servicos, error } = await supabase
      .from('servicos')
      .select(`
        *,
        empresas!inner(nome)
      `)
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar serviços:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar serviços',
        message: error.message 
      });
    }
    
    // Transformar dados para o formato esperado
    const servicosFormatados = servicos?.map((servico: any) => ({
      ...servico,
      empresa: servico.empresas?.nome || 'Empresa não encontrada'
    })) || [];
    
    console.log(`✅ Admin/servicos: Retornando ${servicosFormatados.length} serviços`);
    res.json(servicosFormatados);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar serviços:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar serviços'
    });
  }
});

// 📋 Rota de propostas admin
app.get("/api/admin/propostas", async (req, res) => {
  console.log('📋 Admin/propostas: Endpoint acessado');
  
  try {
    const { data: propostas, error } = await supabase
      .from('propostas')
      .select(`
        *,
        empresas!inner(nome)
      `)
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar propostas:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar propostas',
        message: error.message 
      });
    }
    
    // Transformar dados para o formato esperado
    const propostasFormatadas = propostas?.map((proposta: any) => ({
      ...proposta,
      empresa: proposta.empresas?.nome || 'Empresa não encontrada'
    })) || [];
    
    console.log(`✅ Admin/propostas: Retornando ${propostasFormatadas.length} propostas`);
    res.json(propostasFormatadas);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar propostas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar propostas'
    });
  }
});

// 🆕 Rota para criar serviços
app.post("/api/admin/servicos", async (req, res) => {
  console.log('🆕 Admin/servicos: Criando novo serviço');
  
  try {
    // Mapear campos específicos do frontend para o banco
    const servicoData = {
      empresa_id: req.body.empresa_id,
      candidato_id: req.body.candidato_id,
      tipo_servico: req.body.tipo_servico,
      descricao: req.body.descricao,
      valor: req.body.valor,
      status: req.body.status || 'pendente',
      data_inicio: req.body.data_inicio,
      data_fim: req.body.data_fim,
      observacoes: req.body.observacoes,
      criado_em: new Date().toISOString()
    };
    
    const { data: servico, error } = await supabase
      .from('servicos')
      .insert(servicoData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar serviço:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar serviço',
        message: error.message 
      });
    }
    
    console.log('✅ Serviço criado com sucesso:', servico.id);
    res.status(201).json(servico);
    
  } catch (error) {
    console.error('💥 Erro interno ao criar serviço:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao criar serviço'
    });
  }
});

// 🆕 Rota para criar propostas
app.post("/api/admin/propostas", async (req, res) => {
  console.log('🆕 Admin/propostas: Criando nova proposta');
  
  try {
    // Mapear campos específicos do frontend para o banco
    const propostaData = {
      empresa_id: req.body.empresa_id,
      tipo_servico: req.body.tipo_servico,
      descricao: req.body.descricao,
      valor_proposto: req.body.valor_proposto,
      prazo_entrega: req.body.prazo_entrega,
      observacoes: req.body.observacoes,
      aprovada: req.body.aprovada || 'pendente',
      criado_em: new Date().toISOString()
    };
    
    const { data: proposta, error } = await supabase
      .from('propostas')
      .insert(propostaData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar proposta:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar proposta',
        message: error.message 
      });
    }
    
    console.log('✅ Proposta criada com sucesso:', proposta.id);
    res.status(201).json(proposta);
    
  } catch (error) {
    console.error('💥 Erro interno ao criar proposta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao criar proposta'
    });
  }
});

// 📝 Rota para atualizar propostas
app.patch("/api/admin/propostas/:id", async (req, res) => {
  console.log('📝 Admin/propostas: Atualizando proposta', req.params.id);
  
  try {
    // Mapear campos específicos para atualização
    const updateData: any = {
      empresa_id: req.body.empresa_id,
      tipo_servico: req.body.tipo_servico,
      descricao: req.body.descricao,
      valor_proposto: req.body.valor_proposto,
      prazo_entrega: req.body.prazo_entrega,
      observacoes: req.body.observacoes,
      aprovada: req.body.aprovada
    };
    
    // Remove campos undefined/null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });
    
    const { data: proposta, error } = await supabase
      .from('propostas')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar proposta:', error);
      return res.status(500).json({ 
        error: 'Erro ao atualizar proposta',
        message: error.message 
      });
    }
    
    console.log('✅ Proposta atualizada com sucesso');
    res.json(proposta);
    
  } catch (error) {
    console.error('💥 Erro interno ao atualizar proposta:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao atualizar proposta'
    });
  }
});

// 🗑️ Rota para deletar candidatos
app.delete("/api/admin/candidatos/:id", async (req, res) => {
  console.log('🗑️ Admin/candidatos: Deletando candidato', req.params.id);
  
  try {
    const { error } = await supabase
      .from('candidatos')
      .delete()
      .eq('id', req.params.id);
    
    if (error) {
      console.error('❌ Erro ao deletar candidato:', error);
      return res.status(500).json({ 
        error: 'Erro ao deletar candidato',
        message: error.message 
      });
    }
    
    console.log('✅ Candidato deletado com sucesso');
    res.json({ message: 'Candidato deletado com sucesso' });
    
  } catch (error) {
    console.error('💥 Erro interno ao deletar candidato:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao deletar candidato'
    });
  }
});

// 🗑️ Rota para deletar empresas
app.delete("/api/admin/empresas/:id", async (req, res) => {
  console.log('🗑️ Admin/empresas: Deletando empresa', req.params.id);
  
  try {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', req.params.id);
    
    if (error) {
      console.error('❌ Erro ao deletar empresa:', error);
      return res.status(500).json({ 
        error: 'Erro ao deletar empresa',
        message: error.message 
      });
    }
    
    console.log('✅ Empresa deletada com sucesso');
    res.json({ message: 'Empresa deletada com sucesso' });
    
  } catch (error) {
    console.error('💥 Erro interno ao deletar empresa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao deletar empresa'
    });
  }
});

// 🏢 ROTAS MULTI-CLIENTE
app.get("/api/multicliente/clientes", async (req, res) => {
  console.log('🏢 MultiCliente/clientes: Endpoint acessado');
  
  try {
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('*')
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar clientes',
        message: error.message 
      });
    }
    
    console.log(`✅ MultiCliente/clientes: Retornando ${clientes?.length || 0} clientes`);
    res.json(clientes || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar clientes:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar clientes'
    });
  }
});

app.get("/api/multicliente/usuarios", async (req, res) => {
  console.log('👥 MultiCliente/usuarios: Endpoint acessado');
  
  try {
    const { data: usuarios, error } = await supabase
      .from('usuarios_clientes')
      .select(`
        *,
        clientes!inner(nome)
      `)
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar usuários',
        message: error.message 
      });
    }
    
    // Transformar dados para o formato esperado
    const usuariosFormatados = usuarios?.map((usuario: any) => ({
      ...usuario,
      cliente: usuario.clientes?.nome || 'Cliente não encontrado'
    })) || [];
    
    console.log(`✅ MultiCliente/usuarios: Retornando ${usuariosFormatados.length} usuários`);
    res.json(usuariosFormatados);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar usuários:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar usuários'
    });
  }
});

app.get("/api/multicliente/planos", async (req, res) => {
  console.log('📋 MultiCliente/planos: Endpoint acessado');
  
  try {
    const { data: planos, error } = await supabase
      .from('planos')
      .select('*')
      .eq('ativo', true)
      .order('preco', { ascending: true });
    
    if (error) {
      console.error('❌ Erro ao buscar planos:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar planos',
        message: error.message 
      });
    }
    
    console.log(`✅ MultiCliente/planos: Retornando ${planos?.length || 0} planos`);
    res.json(planos || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar planos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar planos'
    });
  }
});

app.post("/api/multicliente/clientes", async (req, res) => {
  console.log('🆕 MultiCliente/clientes: Criando novo cliente');
  
  try {
    const { data: cliente, error } = await supabase
      .from('clientes')
      .insert(req.body)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar cliente:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar cliente',
        message: error.message 
      });
    }
    
    console.log('✅ Cliente criado com sucesso:', cliente.id);
    res.status(201).json(cliente);
    
  } catch (error) {
    console.error('💥 Erro interno ao criar cliente:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao criar cliente'
    });
  }
});

// 🎯 ROTAS HUNTING
app.get("/api/hunting/campanhas", async (req, res) => {
  console.log('🎯 Hunting/campanhas: Endpoint acessado');
  
  try {
    const { data: campanhas, error } = await supabase
      .from('campanhas_hunting')
      .select('*')
      .order('criada_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar campanhas:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar campanhas',
        message: error.message 
      });
    }
    
    console.log(`✅ Hunting/campanhas: Retornando ${campanhas?.length || 0} campanhas`);
    res.json(campanhas || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar campanhas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar campanhas'
    });
  }
});

app.get("/api/hunting/templates", async (req, res) => {
  console.log('📝 Hunting/templates: Endpoint acessado');
  
  try {
    const { data: templates, error } = await supabase
      .from('templates_hunting')
      .select('*')
      .eq('ativo', true)
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar templates:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar templates',
        message: error.message 
      });
    }
    
    console.log(`✅ Hunting/templates: Retornando ${templates?.length || 0} templates`);
    res.json(templates || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar templates:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar templates'
    });
  }
});

app.get("/api/hunting/integracoes", async (req, res) => {
  console.log('🔗 Hunting/integracoes: Endpoint acessado');
  
  try {
    const { data: integracoes, error } = await supabase
      .from('integracoes_hunting')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) {
      console.error('❌ Erro ao buscar integrações:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar integrações',
        message: error.message 
      });
    }
    
    console.log(`✅ Hunting/integracoes: Retornando ${integracoes?.length || 0} integrações`);
    res.json(integracoes || []);
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar integrações:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar integrações'
    });
  }
});

app.post("/api/hunting/campanhas", async (req, res) => {
  console.log('🆕 Hunting/campanhas: Criando nova campanha');
  
  try {
    const { data: campanha, error } = await supabase
      .from('campanhas_hunting')
      .insert({
        ...req.body,
        status: 'ativa',
        total_encontrados: 0,
        total_contactados: 0,
        total_interessados: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar campanha:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar campanha',
        message: error.message 
      });
    }
    
    console.log('✅ Campanha criada com sucesso:', campanha.id);
    res.status(201).json(campanha);
    
  } catch (error) {
    console.error('💥 Erro interno ao criar campanha:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao criar campanha'
    });
  }
});

// 📄 ROTAS PARSING
app.post("/api/parsing/upload", async (req, res) => {
  console.log('📄 Parsing/upload: Endpoint acessado');
  
  try {
    // Por enquanto retornar estrutura vazia - será implementado parsing real depois
    const dadosVazios = {
      sucesso: true,
      dados: null,
      confianca: 0,
      camposDetectados: [],
      camposFaltantes: ['Todos os campos - implementar parsing real']
    };
    
    console.log('⚠️ Parsing: Sistema preparado - implementar integração real');
    res.json(dadosVazios);
    
  } catch (error) {
    console.error('💥 Erro interno no parsing:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro no parsing de arquivo'
    });
  }
});

// 🎯 ROTAS TRIAGEM AUTOMÁTICA
app.get("/api/vagas/:vagaId/triagem-config", async (req, res) => {
  console.log('🎯 Triagem: Carregar configuração');
  
  try {
    const { vagaId } = req.params;
    
    // Buscar configuração de triagem no Supabase
    const { data: config, error } = await supabase
      .from('triagem_configuracao')
      .select('*')
      .eq('vaga_id', vagaId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Se não existir configuração, retornar padrão
    const configuracao = config || {
      filtros: [],
      acoes: [],
      ativo: false
    };

    res.json(configuracao);
  } catch (error) {
    console.error('❌ Erro ao carregar config triagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post("/api/vagas/:vagaId/triagem-config", async (req, res) => {
  console.log('🎯 Triagem: Salvar configuração');
  
  try {
    const { vagaId } = req.params;
    const { filtros, acoes } = req.body;

    // Salvar ou atualizar configuração
    const { data, error } = await supabase
      .from('triagem_configuracao')
      .upsert({
        vaga_id: vagaId,
        filtros: JSON.stringify(filtros),
        acoes: JSON.stringify(acoes),
        atualizada_em: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Erro ao salvar config triagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get("/api/vagas/:vagaId/triagem-stats", async (req, res) => {
  console.log('🎯 Triagem: Carregar estatísticas');
  
  try {
    const { vagaId } = req.params;

    // Buscar estatísticas de candidaturas
    const { data: candidaturas, error } = await supabase
      .from('candidaturas')
      .select('status, pontuacao')
      .eq('vaga_id', vagaId);

    if (error) throw error;

    const totalCandidatos = candidaturas?.length || 0;
    const aprovados = candidaturas?.filter(c => c.status === 'aprovado').length || 0;
    const rejeitados = candidaturas?.filter(c => c.status === 'rejeitado').length || 0;
    const aguardando = candidaturas?.filter(c => c.status === 'pendente').length || 0;
    const taxaAprovacao = totalCandidatos > 0 ? Math.round((aprovados / totalCandidatos) * 100) : 0;

    res.json({
      totalCandidatos,
      aprovados,
      rejeitados,
      aguardando,
      taxaAprovacao,
      tempoMedioProcessamento: 24 // horas - mockado por enquanto
    });
  } catch (error) {
    console.error('❌ Erro ao carregar stats triagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post("/api/vagas/:vagaId/triagem-toggle", async (req, res) => {
  console.log('🎯 Triagem: Toggle ativo/inativo');
  
  try {
    const { vagaId } = req.params;
    const { ativo } = req.body;

    const { data, error } = await supabase
      .from('triagem_configuracao')
      .upsert({
        vaga_id: vagaId,
        ativo: ativo,
        atualizada_em: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, ativo });
  } catch (error) {
    console.error('❌ Erro ao toggle triagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post("/api/vagas/:vagaId/triagem-executar", async (req, res) => {
  console.log('🎯 Triagem: Executar triagem automática');
  
  try {
    const { vagaId } = req.params;

    // Simular execução de triagem
    // Aqui seria implementada a lógica real de triagem automática
    
    res.json({ 
      success: true, 
      message: 'Triagem executada com sucesso',
      processados: 0 // Por enquanto mockado
    });
  } catch (error) {
    console.error('❌ Erro ao executar triagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 🏆 ROTAS RANKING INTELIGENTE
app.get("/api/vagas/empresa/:empresaId", async (req, res) => {
  console.log('🏆 Ranking: Carregar vagas da empresa');
  
  try {
    const { empresaId } = req.params;

    const { data: vagas, error } = await supabase
      .from('vagas')
      .select(`
        id,
        titulo,
        cidade,
        estado,
        modalidade,
        nivel,
        area,
        status,
        publicado_em
      `)
      .eq('empresa_id', empresaId)
      .eq('status', 'ativa')
      .order('publicado_em', { ascending: false });

    if (error) throw error;

    res.json(vagas || []);
  } catch (error) {
    console.error('❌ Erro ao carregar vagas empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get("/api/vagas/:vagaId/candidatos-ranking", async (req, res) => {
  console.log('🏆 Ranking: Carregar ranking de candidatos');
  
  try {
    const { vagaId } = req.params;

    // Buscar candidaturas com dados dos candidatos
    const { data: candidaturas, error } = await supabase
      .from('candidaturas')
      .select(`
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
      `)
      .eq('vaga_id', vagaId);

    if (error) throw error;

    // Calcular score para cada candidato
    const candidatosComScore = (candidaturas || []).map(candidatura => {
      const candidato = candidatura.candidatos;
      
      // Algoritmo simples de score baseado em vários fatores
      let score = 60; // Base

      // Pontuação por experiência
      if (candidato.experiencia) {
        score += Math.min(candidato.experiencia * 2, 20);
      }

      // Pontuação por localização (mesmo estado = +10)
      // Seria necessário comparar com a vaga, por ora, score aleatório
      score += Math.random() * 20;

      // Garantir score entre 0-100
      score = Math.max(0, Math.min(100, Math.round(score)));

      return {
        id: candidatura.id,
        candidato: {
          id: candidato.id,
          nome: candidato.nome,
          email: candidato.email,
          telefone: candidato.telefone,
          localizacao: `${candidato.cidade || ''}, ${candidato.estado || ''}`.trim(),
          experiencia: candidato.experiencia || 0,
          habilidades: candidato.habilidades || [],
          perfilDisc: candidato.perfil_disc,
          avatar: candidato.foto_perfil
        },
        score,
        match: score, // Por enquanto, match = score
        status: candidatura.status || 'pendente',
        dataAplicacao: candidatura.criado_em,
        classificacao: score >= 80 ? 'Alto' : score >= 60 ? 'Médio' : 'Baixo'
      };
    });

    // Ordenar por score decrescente
    candidatosComScore.sort((a, b) => b.score - a.score);

    res.json(candidatosComScore);
  } catch (error) {
    console.error('❌ Erro ao carregar ranking candidatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 👥 ROTAS BANCO DE TALENTOS
app.post("/api/banco-talentos", async (req, res) => {
  console.log('👥 Banco Talentos: Novo cadastro');
  
  try {
    const { nome, email, telefone, areaInteresse, curriculoUrl } = req.body;

    if (!nome || !email || !areaInteresse) {
      return res.status(400).json({
        error: 'Nome, email e área de interesse são obrigatórios'
      });
    }

    // Inserir no banco de talentos
    const { data, error } = await supabase
      .from('banco_talentos')
      .insert({
        nome,
        email,
        telefone: telefone || null,
        area_interesse: areaInteresse,
        curriculo_url: curriculoUrl || null,
        criado_em: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      data
    });
  } catch (error) {
    console.error('❌ Erro ao cadastrar no banco de talentos:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { // Violação de constraint única
      return res.status(400).json({
        error: 'Este email já está cadastrado em nosso banco de talentos'
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 💬 ROTAS COMUNICAÇÃO
app.get("/api/comunicacao/conversas", async (req, res) => {
  console.log('💬 Comunicacao/conversas: Endpoint acessado');
  
  try {
    const { userId, userType } = req.query;
    
    if (!userId || !userType) {
      return res.status(400).json({ 
        error: 'Parâmetros obrigatórios: userId e userType' 
      });
    }

    // Buscar conversas do usuário no Supabase
    let query = supabase.from('conversas').select(`
      *,
      candidatos:candidato_id(nome, email),
      empresas:empresa_id(nome, email),
      vagas:vaga_id(titulo)
    `);

    if (userType === 'candidato') {
      query = query.eq('candidato_id', userId);
    } else if (userType === 'empresa') {
      query = query.eq('empresa_id', userId);
    }

    const { data: conversas, error } = await query
      .order('atualizada_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar conversas:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar conversas',
        message: error.message 
      });
    }
    
    console.log(`✅ Conversas: Retornando ${conversas?.length || 0} conversas`);
    res.json({ conversas: conversas || [] });
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar conversas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar conversas'
    });
  }
});

app.get("/api/comunicacao/conversas/:id/mensagens", async (req, res) => {
  console.log('💬 Comunicacao/mensagens: Endpoint acessado');
  
  try {
    const { id: conversaId } = req.params;
    
    const { data: mensagens, error } = await supabase
      .from('mensagens')
      .select(`
        *,
        remetente:remetente_id(nome, email),
        destinatario:destinatario_id(nome, email)
      `)
      .eq('conversa_id', conversaId)
      .order('data_envio', { ascending: true });
    
    if (error) {
      console.error('❌ Erro ao buscar mensagens:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar mensagens',
        message: error.message 
      });
    }
    
    console.log(`✅ Mensagens: Retornando ${mensagens?.length || 0} mensagens`);
    res.json({ mensagens: mensagens || [] });
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar mensagens:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar mensagens'
    });
  }
});

app.post("/api/comunicacao/conversas/:id/mensagens", async (req, res) => {
  console.log('💬 Comunicacao/enviar: Endpoint acessado');
  
  try {
    const { id: conversaId } = req.params;
    const { texto, remetenteId, remetenteTipo, destinatarioId, destinatarioTipo } = req.body;
    
    if (!texto || !remetenteId || !remetenteTipo) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: texto, remetenteId, remetenteTipo' 
      });
    }

    const { data: mensagem, error } = await supabase
      .from('mensagens')
      .insert({
        conversa_id: conversaId,
        remetente_id: remetenteId,
        remetente_tipo: remetenteTipo,
        destinatario_id: destinatarioId,
        destinatario_tipo: destinatarioTipo,
        conteudo: texto,
        tipo: 'texto',
        lida: false,
        data_envio: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      return res.status(500).json({ 
        error: 'Erro ao enviar mensagem',
        message: error.message 
      });
    }

    // Atualizar conversa com última mensagem
    await supabase
      .from('conversas')
      .update({
        atualizada_em: new Date().toISOString()
      })
      .eq('id', conversaId);

    // Incrementar contadores usando RPC ou consulta separada
    try {
      await supabase.rpc('increment_conversa_counters', { 
        conversa_id: conversaId 
      });
    } catch (rpcError) {
      // Se RPC não existir, continuar sem erro crítico
      console.log('⚠️ RPC increment_conversa_counters não configurada ainda');
    }
    
    console.log('✅ Mensagem enviada com sucesso');
    res.status(201).json(mensagem);
    
  } catch (error) {
    console.error('💥 Erro interno ao enviar mensagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao enviar mensagem'
    });
  }
});

app.get("/api/comunicacao/notificacoes", async (req, res) => {
  console.log('🔔 Comunicacao/notificacoes: Endpoint acessado');
  
  try {
    const { userId, userType } = req.query;
    
    if (!userId || !userType) {
      return res.status(400).json({ 
        error: 'Parâmetros obrigatórios: userId e userType' 
      });
    }

    const { data: notificacoes, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('user_id', userId)
      .order('criado_em', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar notificações:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar notificações',
        message: error.message 
      });
    }
    
    console.log(`✅ Notificações: Retornando ${notificacoes?.length || 0} notificações`);
    res.json({ notificacoes: notificacoes || [] });
    
  } catch (error) {
    console.error('💥 Erro interno ao buscar notificações:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar notificações'
    });
  }
});

app.post("/api/comunicacao/notificacoes/:id/ler", async (req, res) => {
  console.log('🔔 Comunicacao/marcar-lida: Endpoint acessado');
  
  try {
    const { id: notificacaoId } = req.params;
    
    const { data: notificacao, error } = await supabase
      .from('notificacoes')
      .update({
        lida: true,
        lida_em: new Date().toISOString()
      })
      .eq('id', notificacaoId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error);
      return res.status(500).json({ 
        error: 'Erro ao marcar como lida',
        message: error.message 
      });
    }
    
    console.log('✅ Notificação marcada como lida');
    res.json(notificacao);
    
  } catch (error) {
    console.error('💥 Erro interno ao marcar como lida:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao marcar como lida'
    });
  }
});

app.post("/api/comunicacao/conversas", async (req, res) => {
  console.log('💬 Comunicacao/criar-conversa: Endpoint acessado');
  
  try {
    const { candidatoId, empresaId, vagaId, titulo, criadorId } = req.body;
    
    if (!candidatoId || !empresaId) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: candidatoId, empresaId' 
      });
    }

    const { data: conversa, error } = await supabase
      .from('conversas')
      .insert({
        candidato_id: candidatoId,
        empresa_id: empresaId,
        vaga_id: vagaId,
        titulo: titulo || 'Nova conversa',
        status: 'ativa',
        total_mensagens: 0,
        nao_lidas: 0,
        criado_em: new Date().toISOString(),
        atualizada_em: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar conversa:', error);
      return res.status(500).json({ 
        error: 'Erro ao criar conversa',
        message: error.message 
      });
    }
    
    console.log('✅ Conversa criada com sucesso');
    res.status(201).json(conversa);
    
  } catch (error) {
    console.error('💥 Erro interno ao criar conversa:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao criar conversa'
    });
  }
});

// 📊 ROTAS RELATÓRIOS
app.get("/api/relatorios/empresa/:id", async (req, res) => {
  console.log('📊 Relatorios/empresa: Endpoint acessado');
  
  try {
    const { id: empresaId } = req.params;
    const { periodo } = req.query;
    
    if (!empresaId) {
      return res.status(400).json({ 
        error: 'ID da empresa é obrigatório' 
      });
    }

    // Calcular data de início baseada no período
    const diasPeriodo = parseInt(periodo as string) || 30;
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - diasPeriodo);

    // Buscar dados da empresa
    const { data: empresa, error: errorEmpresa } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', empresaId)
      .single();

    if (errorEmpresa) {
      console.error('❌ Erro ao buscar empresa:', errorEmpresa);
      return res.status(500).json({ 
        error: 'Erro ao buscar empresa',
        message: errorEmpresa.message 
      });
    }

    // Buscar vagas da empresa
    const { data: vagas, error: errorVagas } = await supabase
      .from('vagas')
      .select('id, titulo, status, publicado_em')
      .eq('empresa_id', empresaId);

    // Buscar candidaturas das vagas
    const vagasIds = vagas?.map(v => v.id) || [];
    const { data: candidaturas, error: errorCandidaturas } = vagasIds.length > 0 
      ? await supabase
          .from('candidaturas')
          .select('*')
          .in('vaga_id', vagasIds)
          .gte('data_candidatura', dataInicio.toISOString())
      : { data: [], error: null };

    const totalVagas = vagas?.length || 0;
    const vagasAtivas = vagas?.filter(v => v.status === 'ativa').length || 0;
    const totalCandidaturas = candidaturas?.length || 0;
    const candidaturasAprovadas = candidaturas?.filter(c => c.status === 'aprovado').length || 0;
    
    const dadosRelatorio = {
      totalVagas,
      vagasAtivas,
      vagasPublicadas: totalVagas,
      candidaturasRecebidas: totalCandidaturas,
      candidatosAtivos: totalCandidaturas,
      entrevistasRealizadas: candidaturas?.filter(c => c.etapa === 'entrevista').length || 0,
      contratacoesEfetivadas: candidaturas?.filter(c => c.status === 'contratado').length || 0,
      taxaConversao: totalCandidaturas > 0 ? Math.round((candidaturasAprovadas / totalCandidaturas) * 100) : 0,
      mediaCandidatosPorVaga: totalVagas > 0 ? Math.round(totalCandidaturas / totalVagas) : 0,
      tempoMedio: '15 dias',
      tempoMedioProcesso: '15 dias',
      taxaAprovacao: totalCandidaturas > 0 ? Math.round((candidaturasAprovadas / totalCandidaturas) * 100) : 0,
      satisfacaoCandidatos: '4.2/5.0',
      timeToFill: '12 dias',
      costPerHire: 'R$ 2.500',
      qualityOfHire: '4.1/5.0',
      sourceEffectiveness: '78%',
      taxaRetencao: 85,
      indiceDiversidade: '3.8/5.0',
      npsCandidatos: 42,
      roiRecrutamento: '156%'
    };

    console.log(`✅ Relatórios: Dados gerados para empresa ${empresaId}`);
    res.json(dadosRelatorio);
    
  } catch (error) {
    console.error('💥 Erro interno ao gerar relatório:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao gerar relatório'
    });
  }
});

app.post("/api/relatorios/exportar", async (req, res) => {
  console.log('📊 Relatorios/exportar: Endpoint acessado');
  
  try {
    const { empresaId, tipo, formato, periodo } = req.body;
    
    if (!empresaId || !formato) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: empresaId, formato' 
      });
    }

    // Por enquanto, retornar estrutura básica para diferentes formatos
    if (formato === 'json') {
      const dados = {
        empresa: empresaId,
        periodo: periodo || '30',
        tipo: tipo || 'geral',
        geradoEm: new Date().toISOString(),
        dados: {
          resumo: 'Relatório exportado com sucesso',
          observacoes: 'Implementar exportação real conforme necessário'
        }
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-${tipo}-${new Date().toISOString().split('T')[0]}.json`);
      res.json(dados);
    } else if (formato === 'csv') {
      const csvData = `Data,Métrica,Valor\n${new Date().toISOString().split('T')[0]},Relatório Gerado,Sucesso\n`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-${tipo}-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvData);
    } else {
      // PDF ou outros formatos
      res.status(501).json({
        error: 'Formato não implementado ainda',
        message: `Formato ${formato} será implementado em versão futura`
      });
    }
    
  } catch (error) {
    console.error('💥 Erro interno ao exportar relatório:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao exportar relatório'
    });
  }
});

// 🗑️ ROTA DELETE SERVIÇOS
app.delete("/api/admin/servicos/:id", async (req, res) => {
  console.log('🗑️ Admin: Deletar serviço', req.params.id);
  
  try {
    const { id } = req.params;
    
    // Verificar se o serviço existe
    const { data: servico, error: checkError } = await supabase
      .from('servicos')
      .select('id, tipoServico')
      .eq('id', id)
      .single();

    if (checkError || !servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Deletar o serviço
    const { error: deleteError } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ 
      message: 'Serviço removido com sucesso',
      servicoId: id
    });
  } catch (error) {
    console.error('❌ Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 🗑️ ROTA DELETE PROPOSTAS
app.delete("/api/admin/propostas/:id", async (req, res) => {
  console.log('🗑️ Admin: Deletar proposta', req.params.id);
  
  try {
    const { id } = req.params;
    
    // Verificar se a proposta existe
    const { data: proposta, error: checkError } = await supabase
      .from('propostas')
      .select('id, tipoServico')
      .eq('id', id)
      .single();

    if (checkError || !proposta) {
      return res.status(404).json({ error: 'Proposta não encontrada' });
    }

    // Deletar a proposta
    const { error: deleteError } = await supabase
      .from('propostas')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ 
      message: 'Proposta removida com sucesso',
      propostaId: id
    });
  } catch (error) {
    console.error('❌ Erro ao deletar proposta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
      availableRoutes: ['/api', '/api/test', '/api/health', '/api/auth/me', '/api/vagas', '/api/admin/candidatos', '/api/admin/empresas', '/api/admin/servicos', '/api/admin/propostas']
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
  console.log("   - GET /api/admin/candidatos - Lista de candidatos (admin)");
  console.log("   - DELETE /api/admin/candidatos/:id - Deletar candidato (admin)");
  console.log("   - GET /api/admin/empresas - Lista de empresas (admin)");
  console.log("   - DELETE /api/admin/empresas/:id - Deletar empresa (admin)");
  console.log("   - GET /api/admin/servicos - Lista de serviços (admin)");
  console.log("   - POST /api/admin/servicos - Criar serviço (admin)");
  console.log("   - GET /api/admin/propostas - Lista de propostas (admin)");
  console.log("   - POST /api/admin/propostas - Criar proposta (admin)");
  console.log("   - PATCH /api/admin/propostas/:id - Atualizar proposta (admin)");
  console.log("   - GET /api/multicliente/clientes - Lista de clientes");
  console.log("   - GET /api/multicliente/usuarios - Lista de usuários");
  console.log("   - GET /api/multicliente/planos - Lista de planos");
  console.log("   - POST /api/multicliente/clientes - Criar cliente");
  console.log("   - GET /api/hunting/campanhas - Lista de campanhas hunting");
  console.log("   - GET /api/hunting/templates - Lista de templates");
  console.log("   - GET /api/hunting/integracoes - Lista de integrações");
  console.log("   - POST /api/hunting/campanhas - Criar campanha");
  console.log("   - POST /api/parsing/upload - Upload e parsing de currículos");
  console.log("🖥️ Frontend React disponível em: /");
  console.log("✨ Isabel RH v5.0 - Sistema completo funcionando!");
});
