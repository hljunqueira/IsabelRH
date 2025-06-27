import { type Express } from "express";
import { createServer, type Server } from "http";
import { sistemaTriagem } from "./triagem";
import { sistemaComunicacao } from "./comunicacao";
import { sistemaHunting } from "./hunting";
import { sistemaMultiCliente } from "./multicliente";
import { authenticateUser, getAuthenticatedUser, supabase } from "./lib/supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  
  // 🧪 ENDPOINT DE TESTE - Para verificar se o servidor está funcionando
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

  // 🏠 ENDPOINT ROOT - Para testar rota raiz da API  
  app.get('/api', (req, res) => {
    console.log("🏠 API root acessada!");
    res.json({ 
      message: 'Isabel RH API - Sistema funcionando!',
      version: '1.0.0',
      endpoints: ['/api/auth', '/api/candidatos', '/api/empresas', '/api/vagas']
    });
  });

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
      console.log('🎉 Auth/me: Dados retornados com sucesso');
      
      res.json({ 
        usuario: { ...usuario, senha: undefined }
      });
    } catch (error) {
      console.error("💥 Auth/me: Erro geral:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor", 
        details: error instanceof Error ? error.message : "Erro desconhecido" 
      });
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

    } catch (error) {
      console.error('💥 Erro na recuperação de senha:', error);
      res.status(500).json({ 
        message: 'Erro interno do servidor' 
      });
    }
  });

  // Vaga routes básicas
  app.get("/api/vagas", async (req, res) => {
    try {
      // Retorna array vazio por enquanto - será implementado com storage
      res.json([]);
    } catch (error) {
      console.error("Get vagas error:", error);
      res.status(500).json({ message: "Erro ao buscar vagas" });
    }
  });

  return server;
}
