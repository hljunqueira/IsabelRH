import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Users, 
  Bell, 
  Settings, 
  Plus,
  Search,
  Filter,
  Archive,
  Trash2,
  Star,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import ChatComponent from '@/components/ChatComponent';
import { useComunicacao } from '@/hooks/useComunicacao';
import { useLocation } from 'wouter';

export default function Comunicacao() {
  const [activeTab, setActiveTab] = useState('chat');
  const [, setLocation] = useLocation();
  
  // Simular dados do usuário logado
  const userId = '1';
  const userType = 'empresa' as const;
  
  const {
    conversas,
    notificacoes,
    loading,
    error,
    online,
    carregarConversas,
    carregarNotificacoes,
    marcarNotificacaoComoLida
  } = useComunicacao({ userId, userType });

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Botão de Voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Admin
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Comunicação</h1>
          <p className="text-gray-600">Gerencie comunicação entre candidatos e empresas</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {online.size} usuários online
          </Badge>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat ({conversas.length})
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
            {notificacoesNaoLidas > 0 && (
              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                {notificacoesNaoLidas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Estatísticas */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversas Ativas</span>
                    <Badge variant="secondary">{conversas.filter(c => c.ativa).length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mensagens Não Lidas</span>
                    <Badge variant="destructive">
                      {conversas.reduce((total, conv) => total + conv.naoLidas, 0)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Empresas Conectadas</span>
                    <Badge variant="outline">{Math.floor(online.size / 2)}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Candidatos Online</span>
                    <Badge variant="outline">{Math.ceil(online.size / 2)}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Criar Grupo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Archive className="h-4 w-4 mr-2" />
                    Arquivar Conversas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Histórico
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Chat Principal */}
            <div className="lg:col-span-3">
              <ChatComponent userId={userId} userType={userType} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                Marcar Todas como Lidas
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar notificações..."
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            {notificacoes.map((notificacao) => (
              <Card key={notificacao.id} className={`${!notificacao.lida ? 'border-blue-200 bg-blue-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{notificacao.titulo}</h4>
                        {!notificacao.lida && (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            Nova
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {notificacao.tipo}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{notificacao.mensagem}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {new Date(notificacao.timestamp).toLocaleString('pt-BR')}
                        </span>
                        {notificacao.acao && (
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            Ver detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notificacao.lida && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => marcarNotificacaoComoLida(notificacao.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {notificacoes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma notificação encontrada</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notificações por Email</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notificações Push</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Som de Notificação</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mostrar Status Online</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confirmar Leitura</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Histórico de Mensagens</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Chat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tamanho da Fonte</label>
                  <select className="w-full mt-1 border rounded-lg px-3 py-2">
                    <option>Pequeno</option>
                    <option selected>Médio</option>
                    <option>Grande</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tema</label>
                  <select className="w-full mt-1 border rounded-lg px-3 py-2">
                    <option selected>Claro</option>
                    <option>Escuro</option>
                    <option>Sistema</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportar Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Exportar Histórico de Conversas
                </Button>
                <Button variant="outline" className="w-full">
                  Exportar Notificações
                </Button>
                <Button variant="outline" className="w-full">
                  Backup Completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 