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

  return server;
}
