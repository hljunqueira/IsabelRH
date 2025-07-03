import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente ou fallback para desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Verificar se as configurações estão presentes
if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn('⚠️ Supabase não configurado! Crie os arquivos .env com as chaves corretas.');
  console.warn('📋 Instruções: Veja o README ou contate o administrador');
}

// Cliente público para o frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas (alinhados com o servidor)
export interface User {
  id: string;
  email: string;
  name?: string;
  type: 'candidato' | 'empresa' | 'admin';
  created_at?: string;
  senha?: string; // Nunca enviado do servidor
}

export interface Candidato {
  id: string;
  nome: string;
  telefone?: string;
  celular?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  genero?: string;
  pcd?: string;
  nivelEscolaridade?: string;
  curso?: string;
  instituicao?: string;
  anoFormacao?: string;
  idiomas?: string[];
  habilidades?: string[];
  experiencias?: string;
  certificacoes?: string;
  objetivoProfissional?: string;
  pretensaoSalarial?: string;
  disponibilidade?: string;
  modalidadeTrabalho?: string;
  curriculoUrl?: string;
  areasInteresse?: string[];
  fotoPerfil?: string;
  perfilDisc?: string;
  pontuacaoD?: number;
  pontuacaoI?: number;
  pontuacaoS?: number;
  pontuacaoC?: number;
  dataTesteDISC?: string;
  criadoEm?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  setor?: string;
  porte?: string;
  telefone?: string;
  celular?: string;
  website?: string;
  linkedin?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  descricao?: string;
  missao?: string;
  visao?: string;
  valores?: string;
  beneficios?: string[];
  cultura?: string;
  numeroFuncionarios?: string;
  anoFundacao?: string;
  contato?: string;
  cargoContato?: string;
  logoEmpresa?: string;
  criadoEm?: string;
}

export interface Vaga {
  id: string;
  empresaId: string;
  titulo: string;
  descricao: string;
  requisitos?: string;
  area?: string;
  nivel?: string;
  tipoContrato?: string;
  modalidade?: string;
  salario?: string;
  beneficios?: string[];
  cidade?: string;
  estado?: string;
  cargaHoraria?: string;
  responsabilidades?: string;
  diferenciais?: string;
  status?: string;
  dataEncerramento?: string;
  publicadoEm?: string;
}

export interface Candidatura {
  id: string;
  vagaId: string;
  candidatoId: string;
  status?: string;
  etapa?: string;
  observacoes?: string;
  pontuacao?: number;
  dataTriagem?: string;
  dataEntrevista?: string;
  feedbackEmpresa?: string;
  motivoReprovacao?: string;
  compatibilidadeDisc?: number;
  compatibilidadeSkills?: number;
  compatibilidadeLocalizacao?: boolean;
  prioridade?: string;
  tagsFiltros?: string[];
  dataCandidatura?: string;
  ultimaAtualizacao?: string;
}

// Função de teste de conectividade
export const testSupabaseConnection = async () => {
  try {
    // Teste básico de conectividade
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro de conexão Supabase:', error.message);
      return { connected: false, error: error.message };
    }
    
    console.log('✅ Supabase conectado com sucesso');
    return { connected: true, session: data.session };
  } catch (error: any) {
    console.error('❌ Erro crítico Supabase:', error.message);
    return { connected: false, error: error.message };
  }
};

// Hooks personalizados simplificados
export const useSupabase = () => {
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    supabase,
    getCurrentUser,
    signIn,
    signUp,
    signOut
  };
};

// API simplificada para integração com backend
export const api = {
  // Função genérica para chamadas API
  async request(endpoint: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Adicionar token se disponível
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  },

  // Métodos HTTP simplificados
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

/**
 * Faz upload de um arquivo de certificado para o Supabase Storage e retorna a URL pública
 * @param file Arquivo a ser enviado
 * @param userId ID do usuário/candidato para organizar no bucket
 * @returns URL pública do arquivo
 */
export async function uploadCertificado(file: File, userId: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const filePath = `${userId}/${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage.from('certificados').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  });
  if (error) {
    console.error('Erro ao fazer upload do certificado:', error.message);
    return null;
  }
  // Gerar URL pública
  const { data: publicUrlData } = supabase.storage.from('certificados').getPublicUrl(filePath);
  return publicUrlData?.publicUrl || null;
} 