import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  User,
  Building,
  MessageSquare
} from 'lucide-react';

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
}

interface ChatComponentProps {
  userId: string;
  userType: 'candidato' | 'empresa' | 'admin';
}

export default function ChatComponent({ userId, userType }: ChatComponentProps) {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarConversas();
  }, [userId]);

  useEffect(() => {
    if (conversaAtiva) {
      carregarMensagens(conversaAtiva.id);
    }
  }, [conversaAtiva]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const carregarConversas = async () => {
    setLoading(true);
    try {
      // Simular dados de conversas
      const conversasMock: Conversa[] = [
        {
          id: '1',
          participantes: [
            { id: userId, nome: 'Você', tipo: userType },
            { id: '2', nome: 'João Silva', tipo: 'candidato', avatar: '/avatar1.jpg' }
          ],
          ultimaMensagem: {
            texto: 'Obrigado pela oportunidade!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
            remetente: '2'
          },
          naoLidas: 2,
          ativa: true
        },
        {
          id: '2',
          participantes: [
            { id: userId, nome: 'Você', tipo: userType },
            { id: '3', nome: 'TechCorp', tipo: 'empresa', avatar: '/avatar2.jpg' }
          ],
          ultimaMensagem: {
            texto: 'Quando podemos agendar a entrevista?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
            remetente: userId
          },
          naoLidas: 0,
          ativa: false
        }
      ];
      setConversas(conversasMock);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarMensagens = async (conversaId: string) => {
    try {
      // Simular mensagens
      const mensagensMock: Mensagem[] = [
        {
          id: '1',
          texto: 'Olá! Vi sua vaga e gostaria de me candidatar.',
          remetente: { id: '2', nome: 'João Silva', tipo: 'candidato' },
          destinatario: { id: userId, nome: 'Você', tipo: userType },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          lida: true
        },
        {
          id: '2',
          texto: 'Oi João! Obrigado pelo interesse. Pode me enviar seu currículo?',
          remetente: { id: userId, nome: 'Você', tipo: userType },
          destinatario: { id: '2', nome: 'João Silva', tipo: 'candidato' },
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          lida: true
        },
        {
          id: '3',
          texto: 'Claro! Já enviei por email. Obrigado pela oportunidade!',
          remetente: { id: '2', nome: 'João Silva', tipo: 'candidato' },
          destinatario: { id: userId, nome: 'Você', tipo: userType },
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          lida: false
        }
      ];
      setMensagens(mensagensMock);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversaAtiva) return;

    const novaMsg: Mensagem = {
      id: Date.now().toString(),
      texto: novaMensagem,
      remetente: { id: userId, nome: 'Você', tipo: userType },
      destinatario: conversaAtiva.participantes.find(p => p.id !== userId)!,
      timestamp: new Date(),
      lida: false
    };

    setMensagens(prev => [...prev, novaMsg]);
    setNovaMensagem('');

    // Atualizar última mensagem na conversa
    setConversas(prev => prev.map(conv => 
      conv.id === conversaAtiva.id 
        ? { 
            ...conv, 
            ultimaMensagem: { 
              texto: novaMensagem, 
              timestamp: new Date(), 
              remetente: userId 
            },
            naoLidas: 0
          }
        : conv
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const obterIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatarHora = (data: Date) => {
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const conversasFiltradas = conversas.filter(conv =>
    conv.participantes.some(p => 
      p.id !== userId && p.nome.toLowerCase().includes(pesquisa.toLowerCase())
    )
  );

  return (
    <div className="flex h-[600px] bg-white rounded-lg border">
      {/* Lista de Conversas */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar conversas..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="border-0 focus:ring-0"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(600px-80px)]">
          <div className="p-2">
            {conversasFiltradas.map((conversa) => {
              const outroParticipante = conversa.participantes.find(p => p.id !== userId)!;
              return (
                <div
                  key={conversa.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    conversaAtiva?.id === conversa.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => setConversaAtiva(conversa)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={outroParticipante.avatar} />
                      <AvatarFallback className="bg-gray-200">
                        {outroParticipante.tipo === 'candidato' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Building className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {conversa.ativa && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{outroParticipante.nome}</h4>
                      <span className="text-xs text-gray-500">
                        {formatarHora(conversa.ultimaMensagem.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {conversa.ultimaMensagem.remetente === userId ? 'Você: ' : ''}
                      {conversa.ultimaMensagem.texto}
                    </p>
                  </div>
                  
                  {conversa.naoLidas > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                      {conversa.naoLidas}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Janela de Chat */}
      <div className="flex-1 flex flex-col">
        {conversaAtiva ? (
          <>
            {/* Header da Conversa */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={conversaAtiva.participantes.find(p => p.id !== userId)?.avatar} />
                  <AvatarFallback className="bg-gray-200">
                    {conversaAtiva.participantes.find(p => p.id !== userId)?.tipo === 'candidato' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Building className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {conversaAtiva.participantes.find(p => p.id !== userId)?.nome}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {conversaAtiva.ativa ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mensagens.map((mensagem) => {
                  const isOwn = mensagem.remetente.id === userId;
                  return (
                    <div
                      key={mensagem.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwn && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={mensagem.remetente.avatar} />
                            <AvatarFallback className="bg-gray-200 text-xs">
                              {obterIniciais(mensagem.remetente.nome)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`rounded-lg px-3 py-2 ${
                          isOwn 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{mensagem.texto}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            isOwn ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-xs opacity-70">
                              {formatarHora(mensagem.timestamp)}
                            </span>
                            {isOwn && (
                              <span className="text-xs opacity-70">
                                {mensagem.lida ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de Mensagem */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Digite sua mensagem..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={enviarMensagem}
                  disabled={!novaMensagem.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 