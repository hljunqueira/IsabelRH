import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wqifsgaxevfdwmfkihhg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkxMDI5MywiZXhwIjoyMDY2NDg2MjkzfQ.X7xux96O-P36SiEEBBWBebh30oqd5T1JiBC1LhC1SEA';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Missing Supabase environment variables - using fallback configuration');
}

// Cliente do servidor com permissões completas
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cliente público para operações básicas
export const supabasePublic = createClient(
  supabaseUrl, 
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MTY3OTUsImV4cCI6MjA1MTA5Mjc5NX0.UeXsYJvG4_B4F3xvlb8_o2WQjqJrJX7r6H7qZ8Z-XUw'
);

// Tipos para as tabelas
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          type: 'candidato' | 'empresa' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          type: 'candidato' | 'empresa' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          type?: 'candidato' | 'empresa' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      candidatos: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          email: string;
          telefone: string;
          localizacao: string;
          experiencia: number;
          educacao: string;
          habilidades: string[];
          resumo: string;
          expectativa_salarial: number;
          disponibilidade: string;
          modalidade: 'presencial' | 'hibrido' | 'remoto';
          tipo_contrato: 'clt' | 'pj' | 'freelance';
          setores: string[];
          linkedin?: string;
          github?: string;
          portfolio?: string;
          curriculo_url?: string;
          score: number;
          status: 'disponivel' | 'empregado' | 'em_processo';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          email: string;
          telefone: string;
          localizacao: string;
          experiencia: number;
          educacao: string;
          habilidades: string[];
          resumo: string;
          expectativa_salarial: number;
          disponibilidade: string;
          modalidade: 'presencial' | 'hibrido' | 'remoto';
          tipo_contrato: 'clt' | 'pj' | 'freelance';
          setores: string[];
          linkedin?: string;
          github?: string;
          portfolio?: string;
          curriculo_url?: string;
          score?: number;
          status?: 'disponivel' | 'empregado' | 'em_processo';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          email?: string;
          telefone?: string;
          localizacao?: string;
          experiencia?: number;
          educacao?: string;
          habilidades?: string[];
          resumo?: string;
          expectativa_salarial?: number;
          disponibilidade?: string;
          modalidade?: 'presencial' | 'hibrido' | 'remoto';
          tipo_contrato?: 'clt' | 'pj' | 'freelance';
          setores?: string[];
          linkedin?: string;
          github?: string;
          portfolio?: string;
          curriculo_url?: string;
          score?: number;
          status?: 'disponivel' | 'empregado' | 'em_processo';
          created_at?: string;
          updated_at?: string;
        };
      };
      empresas: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          email: string;
          telefone: string;
          cnpj: string;
          setor: string;
          tamanho: string;
          localizacao: string;
          website?: string;
          descricao: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          email: string;
          telefone: string;
          cnpj: string;
          setor: string;
          tamanho: string;
          localizacao: string;
          website?: string;
          descricao: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          email?: string;
          telefone?: string;
          cnpj?: string;
          setor?: string;
          tamanho?: string;
          localizacao?: string;
          website?: string;
          descricao?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vagas: {
        Row: {
          id: string;
          empresa_id: string;
          titulo: string;
          descricao: string;
          requisitos: string[];
          beneficios: string[];
          salario_min: number;
          salario_max: number;
          modalidade: 'presencial' | 'hibrido' | 'remoto';
          tipo_contrato: 'clt' | 'pj' | 'freelance';
          localizacao: string;
          experiencia: number;
          status: 'ativa' | 'pausada' | 'fechada';
          candidatos_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          empresa_id: string;
          titulo: string;
          descricao: string;
          requisitos: string[];
          beneficios: string[];
          salario_min: number;
          salario_max: number;
          modalidade: 'presencial' | 'hibrido' | 'remoto';
          tipo_contrato: 'clt' | 'pj' | 'freelance';
          localizacao: string;
          experiencia: number;
          status?: 'ativa' | 'pausada' | 'fechada';
          candidatos_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          empresa_id?: string;
          titulo?: string;
          descricao?: string;
          requisitos?: string[];
          beneficios?: string[];
          salario_min?: number;
          salario_max?: number;
          modalidade?: 'presencial' | 'hibrido' | 'remoto';
          tipo_contrato?: 'clt' | 'pj' | 'freelance';
          localizacao?: string;
          experiencia?: number;
          status?: 'ativa' | 'pausada' | 'fechada';
          candidatos_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      candidaturas: {
        Row: {
          id: string;
          vaga_id: string;
          candidato_id: string;
          status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'contratada';
          score: number;
          feedback?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vaga_id: string;
          candidato_id: string;
          status?: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'contratada';
          score?: number;
          feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vaga_id?: string;
          candidato_id?: string;
          status?: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'contratada';
          score?: number;
          feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      mensagens: {
        Row: {
          id: string;
          conversa_id: string;
          remetente_id: string;
          remetente_tipo: 'candidato' | 'empresa' | 'admin';
          texto: string;
          anexos?: string[];
          lida: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversa_id: string;
          remetente_id: string;
          remetente_tipo: 'candidato' | 'empresa' | 'admin';
          texto: string;
          anexos?: string[];
          lida?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversa_id?: string;
          remetente_id?: string;
          remetente_tipo?: 'candidato' | 'empresa' | 'admin';
          texto?: string;
          anexos?: string[];
          lida?: boolean;
          created_at?: string;
        };
      };
      conversas: {
        Row: {
          id: string;
          tipo: 'individual' | 'grupo';
          titulo?: string;
          participantes: string[];
          ultima_mensagem?: string;
          ultima_mensagem_timestamp?: string;
          nao_lidas: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tipo: 'individual' | 'grupo';
          titulo?: string;
          participantes: string[];
          ultima_mensagem?: string;
          ultima_mensagem_timestamp?: string;
          nao_lidas?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tipo?: 'individual' | 'grupo';
          titulo?: string;
          participantes?: string[];
          ultima_mensagem?: string;
          ultima_mensagem_timestamp?: string;
          nao_lidas?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      notificacoes: {
        Row: {
          id: string;
          user_id: string;
          tipo: 'mensagem' | 'vaga' | 'candidatura' | 'sistema';
          titulo: string;
          mensagem: string;
          lida: boolean;
          acao_tipo?: string;
          acao_dados?: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tipo: 'mensagem' | 'vaga' | 'candidatura' | 'sistema';
          titulo: string;
          mensagem: string;
          lida?: boolean;
          acao_tipo?: string;
          acao_dados?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tipo?: 'mensagem' | 'vaga' | 'candidatura' | 'sistema';
          titulo?: string;
          mensagem?: string;
          lida?: boolean;
          acao_tipo?: string;
          acao_dados?: any;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables = Database['public']['Tables'];
export type Row<T extends keyof Tables> = Tables[T]['Row'];
export type InsertDto<T extends keyof Tables> = Tables[T]['Insert'];
export type UpdateDto<T extends keyof Tables> = Tables[T]['Update'];

// Middleware para validar JWT do Supabase
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' do início
    
    // Verificar o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Adicionar o usuário autenticado ao request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ message: 'Erro na autenticação' });
  }
};

// Função para obter usuário autenticado
export const getAuthenticatedUser = (req: Request) => {
  return (req as any).user;
}; 