import { useState, useEffect, useCallback } from 'react';

interface Mensagem {
  id: string;
  texto: string;
  remetente: {
    id: string;
    nome: string;
    tipo: 'candidato' | 'empresa' | 'admin';
    avatar?: string;
  };
  destinatario: {
    id: string;
    nome: string;
    tipo: 'candidato' | 'empresa' | 'admin';
    avatar?: string;
  };
  timestamp: Date;
  lida: boolean;
  anexos?: Array<{
    id: string;
    nome: string;
    url: string;
    tipo: string;
  }>;
}

interface Conversa {
  id: string;
  participantes: Array<{
    id: string;
    nome: string;
    tipo: 'candidato' | 'empresa' | 'admin';
    avatar?: string;
  }>;
  ultimaMensagem: {
    texto: string;
    timestamp: Date;
    remetente: string;
  };
  naoLidas: number;
  ativa: boolean;
  tipo: 'individual' | 'grupo';
  titulo?: string;
}

interface Notificacao {
  id: string;
  tipo: 'mensagem' | 'vaga' | 'candidatura' | 'sistema';
  titulo: string;
  mensagem: string;
  lida: boolean;
  timestamp: Date;
  acao?: {
    tipo: string;
    dados: any;
  };
}

interface UseComunicacaoProps {
  userId: string;
  userType: 'candidato' | 'empresa' | 'admin';
}

export function useComunicacao({ userId, userType }: UseComunicacaoProps) {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState<Set<string>>(new Set());

  // Carregar conversas
  const carregarConversas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/comunicacao/conversas?userId=${userId}&userType=${userType}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar conversas');
      }
      
      const data = await response.json();
      setConversas(data.conversas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar conversas:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, userType]);

  // Carregar mensagens de uma conversa
  const carregarMensagens = useCallback(async (conversaId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/comunicacao/conversas/${conversaId}/mensagens`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar mensagens');
      }
      
      const data = await response.json();
      setMensagens(data.mensagens);
      
      // Marcar mensagens como lidas
      await marcarComoLidas(conversaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar mensagem
  const enviarMensagem = useCallback(async (
    conversaId: string, 
    texto: string, 
    anexos?: File[]
  ) => {
    if (!texto.trim() && (!anexos || anexos.length === 0)) {
      return;
    }

    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('texto', texto);
      formData.append('remetenteId', userId);
      formData.append('remetenteTipo', userType);
      
      if (anexos) {
        anexos.forEach(anexo => {
          formData.append('anexos', anexo);
        });
      }

      const response = await fetch(`/api/comunicacao/conversas/${conversaId}/mensagens`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }
      
      const novaMensagem = await response.json();
      
      // Adicionar mensagem à lista local
      setMensagens(prev => [...prev, novaMensagem]);
      
      // Atualizar última mensagem na conversa
      setConversas(prev => prev.map(conv => 
        conv.id === conversaId 
          ? { 
              ...conv, 
              ultimaMensagem: { 
                texto: texto, 
                timestamp: new Date(), 
                remetente: userId 
              },
              naoLidas: 0
            }
          : conv
      ));
      
      return novaMensagem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao enviar mensagem:', err);
      throw err;
    }
  }, [userId, userType]);

  // Criar nova conversa
  const criarConversa = useCallback(async (
    participantes: Array<{ id: string; tipo: string }>,
    tipo: 'individual' | 'grupo' = 'individual',
    titulo?: string
  ) => {
    setError(null);
    
    try {
      const response = await fetch('/api/comunicacao/conversas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantes: [...participantes, { id: userId, tipo: userType }],
          tipo,
          titulo,
          criadorId: userId
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar conversa');
      }
      
      const novaConversa = await response.json();
      setConversas(prev => [novaConversa, ...prev]);
      
      return novaConversa;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao criar conversa:', err);
      throw err;
    }
  }, [userId, userType]);

  // Marcar mensagens como lidas
  const marcarComoLidas = useCallback(async (conversaId: string) => {
    try {
      await fetch(`/api/comunicacao/conversas/${conversaId}/ler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          userType
        })
      });
      
      // Atualizar estado local
      setConversas(prev => prev.map(conv => 
        conv.id === conversaId 
          ? { ...conv, naoLidas: 0 }
          : conv
      ));
      
      setMensagens(prev => prev.map(msg => 
        msg.destinatario.id === userId 
          ? { ...msg, lida: true }
          : msg
      ));
    } catch (err) {
      console.error('Erro ao marcar como lidas:', err);
    }
  }, [userId, userType]);

  // Carregar notificações
  const carregarNotificacoes = useCallback(async () => {
    try {
      const response = await fetch(`/api/comunicacao/notificacoes?userId=${userId}&userType=${userType}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar notificações');
      }
      
      const data = await response.json();
      setNotificacoes(data.notificacoes);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  }, [userId, userType]);

  // Marcar notificação como lida
  const marcarNotificacaoComoLida = useCallback(async (notificacaoId: string) => {
    try {
      await fetch(`/api/comunicacao/notificacoes/${notificacaoId}/ler`, {
        method: 'POST'
      });
      
      setNotificacoes(prev => prev.map(notif => 
        notif.id === notificacaoId 
          ? { ...notif, lida: true }
          : notif
      ));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  }, []);

  // Buscar usuários para conversa
  const buscarUsuarios = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/comunicacao/usuarios?q=${encodeURIComponent(query)}&userType=${userType}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      
      const data = await response.json();
      return data.usuarios;
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      return [];
    }
  }, [userType]);

  // Verificar status online
  const verificarStatusOnline = useCallback(async () => {
    try {
      const response = await fetch('/api/comunicacao/status-online');
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status online');
      }
      
      const data = await response.json();
      setOnline(new Set(data.online));
    } catch (err) {
      console.error('Erro ao verificar status online:', err);
    }
  }, []);

  // Enviar mensagem direta
  const enviarMensagemDireta = useCallback(async (
    destinatarioId: string,
    destinatarioTipo: string,
    texto: string,
    anexos?: File[]
  ) => {
    try {
      // Verificar se já existe conversa
      const conversaExistente = conversas.find(conv => 
        conv.tipo === 'individual' && 
        conv.participantes.some(p => p.id === destinatarioId && p.tipo === destinatarioTipo)
      );

      let conversaId = conversaExistente?.id;

      if (!conversaId) {
        // Criar nova conversa
        const novaConversa = await criarConversa([
          { id: destinatarioId, tipo: destinatarioTipo }
        ]);
        conversaId = novaConversa.id;
      }

      // Enviar mensagem
      return await enviarMensagem(conversaId, texto, anexos);
    } catch (err) {
      console.error('Erro ao enviar mensagem direta:', err);
      throw err;
    }
  }, [conversas, criarConversa, enviarMensagem]);

  // Deletar conversa
  const deletarConversa = useCallback(async (conversaId: string) => {
    try {
      const response = await fetch(`/api/comunicacao/conversas/${conversaId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar conversa');
      }
      
      setConversas(prev => prev.filter(conv => conv.id !== conversaId));
      
      if (conversaAtiva?.id === conversaId) {
        setConversaAtiva(null);
        setMensagens([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao deletar conversa:', err);
    }
  }, [conversaAtiva]);

  // Configurar WebSocket para mensagens em tempo real
  useEffect(() => {
    let ws: WebSocket | null = null;

    const conectarWebSocket = () => {
      ws = new WebSocket(`ws://localhost:5000/ws/comunicacao?userId=${userId}&userType=${userType}`);

      ws.onopen = () => {
        console.log('WebSocket conectado');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.tipo) {
          case 'nova_mensagem':
            if (conversaAtiva?.id === data.conversaId) {
              setMensagens(prev => [...prev, data.mensagem]);
            }
            // Atualizar conversas
            setConversas(prev => prev.map(conv => 
              conv.id === data.conversaId 
                ? { 
                    ...conv, 
                    ultimaMensagem: { 
                      texto: data.mensagem.texto, 
                      timestamp: new Date(data.mensagem.timestamp), 
                      remetente: data.mensagem.remetente.id 
                    },
                    naoLidas: conv.naoLidas + 1
                  }
                : conv
            ));
            break;
            
          case 'usuario_online':
            setOnline(prev => new Set([...prev, data.userId]));
            break;
            
          case 'usuario_offline':
            setOnline(prev => {
              const novo = new Set(prev);
              novo.delete(data.userId);
              return novo;
            });
            break;
            
          case 'nova_notificacao':
            setNotificacoes(prev => [data.notificacao, ...prev]);
            break;
        }
      };

      ws.onclose = () => {
        console.log('WebSocket desconectado');
        setTimeout(conectarWebSocket, 3000); // Reconectar após 3 segundos
      };

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
      };
    };

    conectarWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userId, userType, conversaAtiva]);

  // Carregar dados iniciais
  useEffect(() => {
    carregarConversas();
    carregarNotificacoes();
    verificarStatusOnline();
  }, [carregarConversas, carregarNotificacoes, verificarStatusOnline]);

  return {
    // Estado
    conversas,
    conversaAtiva,
    mensagens,
    notificacoes,
    loading,
    error,
    online,
    
    // Ações
    setConversaAtiva,
    carregarConversas,
    carregarMensagens,
    enviarMensagem,
    criarConversa,
    marcarComoLidas,
    carregarNotificacoes,
    marcarNotificacaoComoLida,
    buscarUsuarios,
    verificarStatusOnline,
    enviarMensagemDireta,
    deletarConversa,
    
    // Utilitários
    limparError: () => setError(null)
  };
} 