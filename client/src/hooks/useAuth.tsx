import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, User, api, testSupabaseConnection } from '../lib/supabase';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Manter nomes consistentes para React Fast Refresh
useAuth.displayName = 'useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = React.memo(({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [, setLocation] = useLocation();

  // Verificar configuração do Supabase
  useEffect(() => {
    const checkConfiguration = async () => {
      console.log('🔧 Verificando configuração do Supabase...');
      const { connected } = await testSupabaseConnection();
      setIsConfigured(connected);
      
      if (!connected) {
        console.warn('⚠️ Supabase não configurado corretamente');
        setLoading(false);
        return;
      }
      
      console.log('✅ Supabase configurado e conectado');
    };

    checkConfiguration();
  }, []);

  // Função para buscar dados do usuário via backend
  const fetchUserData = async (session: any) => {
    if (!isConfigured) {
      console.warn('⚠️ Supabase não configurado - pulando busca de dados');
      setUser(null);
      return;
    }

    try {
      console.log('👤 Buscando dados do usuário...');
      
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dados do usuário obtidos:', data.usuario?.email);
        setUser(data.usuario);
        
        // Salvar no localStorage para páginas que precisam (como Admin)
        localStorage.setItem("auth-user", JSON.stringify(data));
      } else {
        const errorText = await response.text();
        console.error('❌ Erro ao buscar dados do usuário:', response.status, errorText);
        
        // Se for erro 500, pode ser configuração
        if (response.status === 500) {
          console.error('💡 Dica: Verifique se o Supabase está configurado no servidor (.env)');
        }
        
        setUser(null);
        localStorage.removeItem("auth-user");
      }
    } catch (error) {
      console.error('❌ Erro de rede ao buscar dados do usuário:', error);
      setUser(null);
      localStorage.removeItem("auth-user");
    }
  };

  useEffect(() => {
    if (!isConfigured) return;

    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('🔐 Sessão encontrada, buscando dados...');
          await fetchUserData(session);
        } else {
          console.log('ℹ️ Nenhuma sessão ativa');
          setUser(null);
          localStorage.removeItem("auth-user");
        }
      } catch (error) {
        console.error('❌ Erro crítico ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Estado de auth mudou:', event);
        
        if (session?.user) {
          await fetchUserData(session);
        } else {
          setUser(null);
          localStorage.removeItem("auth-user");
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Tentando login para:', email);
      
      if (!isConfigured) {
        throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session || !data.user) {
        console.log('❌ Login falhou:', error?.message || 'Credenciais inválidas');
        throw new Error(error?.message || 'Credenciais inválidas');
      }

      console.log('✅ Login Supabase bem-sucedido');
      
      // Buscar dados do usuário do backend
      await fetchUserData(data.session);
      
      // Aguardar um pouco para garantir que os dados foram salvos
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('🎯 Login concluído com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no processo de login:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (!isConfigured) {
      throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.');
    }

    try {
      setLoading(true);
      console.log('📝 Tentando cadastro para:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error.message);
        throw error;
      }

      if (data.user) {
        console.log('✅ Cadastro realizado, criando perfil...');
        
        // Usar API do backend para criar usuário
        try {
          await api.post('/auth/register', {
            email,
            senha: password,
            type: userData.type || 'candidato',
            ...userData
          });
          console.log('✅ Perfil criado no backend');
        } catch (backendError) {
          console.warn('⚠️ Erro ao criar perfil no backend:', backendError);
          // Não falha o cadastro por causa do backend
        }

        // Se a sessão foi criada automaticamente, buscar dados
        if (data.session) {
          await fetchUserData(data.session);
        }
      }
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erro no logout:', error.message);
        throw error;
      }
      
      console.log('✅ Logout realizado');
      setUser(null);
      localStorage.removeItem("auth-user");
      
      // Redirecionar para home
      setLocation('/');
    } catch (error: any) {
      console.error('❌ Erro no logout:', error.message);
      // Força limpeza mesmo com erro
      setUser(null);
      localStorage.removeItem("auth-user");
      setLocation('/');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setLoading(true);
      console.log('🔄 Atualizando perfil...');
      
      // Usar API do backend para atualizar
      const updatedUser = await api.put(`/usuarios/${user.id}`, updates);
      
      setUser({ ...user, ...updatedUser });
      console.log('✅ Perfil atualizado');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    logout: signOut,
    updateProfile,
    isConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
});

// Adicionar displayName para melhor debugging
AuthProvider.displayName = 'AuthProvider';