import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Users, 
  Shield, 
  CreditCard, 
  Settings, 
  UserPlus,
  ArrowLeft,
  Plus,
  Building,
  Key,
  Database,
  AlertCircle,
  CheckCircle,
  Activity,
  DollarSign,
  Clock
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function MultiCliente() {
  const [, setLocation] = useLocation();
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('clientes');
  
  // Estados para dados reais do Supabase
  const [clientes, setClientes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados quando o componente montar
  useEffect(() => {
    if (activeTab === 'clientes') {
      carregarClientes();
    } else if (activeTab === 'usuarios') {
      carregarUsuarios();
    } else if (activeTab === 'planos') {
      carregarPlanos();
    }
  }, [activeTab]);

  const carregarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/multicliente/clientes');
      if (!response.ok) throw new Error('Erro ao carregar clientes');
      const dados = await response.json();
      setClientes(dados);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar clientes. Tente novamente.');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/multicliente/usuarios');
      if (!response.ok) throw new Error('Erro ao carregar usuários');
      const dados = await response.json();
      setUsuarios(dados);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários. Tente novamente.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const carregarPlanos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/multicliente/planos');
      if (!response.ok) throw new Error('Erro ao carregar planos');
      const dados = await response.json();
      setPlanos(dados);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      setError('Erro ao carregar planos. Tente novamente.');
      setPlanos([]);
    } finally {
      setLoading(false);
    }
  };

  const criarCliente = async (dadosCliente: any) => {
    try {
      const response = await fetch('/api/multicliente/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCliente)
      });
      
      if (!response.ok) throw new Error('Erro ao criar cliente');
      
      setShowNewClientDialog(false);
      carregarClientes(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      setError('Erro ao criar cliente. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Botão de Voltar */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Admin
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestão Multi-Cliente</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Gerencie clientes, permissões, usuários, limites de recursos e faturamento 
            de forma centralizada e segura para múltiplas organizações.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
            <TabsTrigger value="configuracoes">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Clientes Cadastrados</CardTitle>
                <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nomeCliente">Nome da Empresa</Label>
                        <Input id="nomeCliente" placeholder="Ex: TechCorp Solutions" />
                      </div>
                      <div>
                        <Label htmlFor="dominio">Domínio</Label>
                        <Input id="dominio" placeholder="techcorp.com" />
                      </div>
                      <div>
                        <Label htmlFor="plano">Plano</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o plano" />
                          </SelectTrigger>
                          <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
                            <SelectItem value="basico">Básico</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="adminEmail">Email do Admin</Label>
                        <Input id="adminEmail" type="email" placeholder="admin@techcorp.com" />
                      </div>
                      <Button className="w-full">Criar Cliente</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={carregarClientes}
                    >
                      Tentar novamente
                    </Button>
                  </div>
                )}
                
                {!loading && !error && clientes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum cliente cadastrado ainda.</p>
                    <p className="text-sm">Clique em "Novo Cliente" para começar.</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {clientes.map((cliente) => (
                    <div key={cliente.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Building className="h-8 w-8 text-gray-400" />
                          <div>
                            <h3 className="font-medium">{cliente.nome}</h3>
                            <p className="text-sm text-gray-600">{cliente.dominio}</p>
                            <p className="text-xs text-gray-500">
                              Cliente desde {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={cliente.plano === 'Enterprise' ? 'default' : 
                                        cliente.plano === 'Premium' ? 'secondary' : 'outline'}>
                            {cliente.plano}
                          </Badge>
                          <Badge variant={cliente.status === 'ativo' ? 'default' : 'destructive'}>
                            {cliente.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium text-blue-700">{cliente.usuarios}/{cliente.limiteUsuarios}</div>
                          <div className="text-blue-600">Usuários</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-medium text-green-700">{cliente.vagasUsadas}/{cliente.limiteVagas}</div>
                          <div className="text-green-600">Vagas</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="font-medium text-purple-700">{cliente.faturamento}</div>
                          <div className="text-purple-600">Mensal</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium text-gray-700">
                            {Math.round((cliente.vagasUsadas / cliente.limiteVagas) * 100)}%
                          </div>
                          <div className="text-gray-600">Uso</div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">Gerenciar</Button>
                        <Button size="sm" variant="outline">Configurar</Button>
                        <Button size="sm" variant="outline">Relatórios</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Usuários do Sistema</CardTitle>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={carregarUsuarios}
                    >
                      Tentar novamente
                    </Button>
                  </div>
                )}
                
                {!loading && !error && usuarios.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum usuário cadastrado ainda.</p>
                    <p className="text-sm">Clique em "Novo Usuário" para começar.</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{usuario.nome}</h3>
                            <p className="text-sm text-gray-600">{usuario.email}</p>
                            <p className="text-xs text-gray-500">{usuario.cliente}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={usuario.permissao === 'admin' ? 'default' : 'secondary'}>
                            {usuario.permissao}
                          </Badge>
                          <Badge variant={usuario.status === 'ativo' ? 'default' : 'destructive'}>
                            {usuario.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Último acesso: {new Date(usuario.ultimoAcesso).toLocaleString('pt-BR')}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">Editar</Button>
                          <Button size="sm" variant="ghost">Permissões</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planos.map((plano) => (
                <Card key={plano.nome} className={plano.nome === 'Premium' ? 'border-blue-200 bg-blue-50' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plano.nome}
                      {plano.nome === 'Premium' && (
                        <Badge variant="default">Mais Popular</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{plano.preco}</div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usuários:</span>
                        <span className="font-medium">{plano.usuarios}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Vagas:</span>
                        <span className="font-medium">{plano.vagas}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recursos inclusos:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {plano.recursos?.map((recurso: string) => (
                          <li key={recurso} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {recurso}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full" variant={plano.nome === 'Premium' ? 'default' : 'outline'}>
                      Selecionar Plano
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receita Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {clientes.length > 0 
                      ? `R$ ${clientes.filter(c => c.status === 'ativo').reduce((total, cliente) => {
                          const valor = parseFloat(cliente.valor_mensal || 0);
                          return total + valor;
                        }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'R$ 0,00'
                    }
                  </div>
                  <p className="text-sm text-gray-600">Clientes ativos apenas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clientes Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {clientes.filter(c => c.status === 'ativo').length}
                  </div>
                  <p className="text-sm text-gray-600">
                    {clientes.filter(c => c.status !== 'ativo').length} inativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {usuarios.length}
                  </div>
                  <p className="text-sm text-gray-600">Todos os clientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {clientes.length > 0 
                      ? `R$ ${(clientes.filter(c => c.status === 'ativo').reduce((total, cliente) => {
                          const valor = parseFloat(cliente.valor_mensal || 0);
                          return total + valor;
                        }, 0) / Math.max(clientes.filter(c => c.status === 'ativo').length, 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'R$ 0,00'
                    }
                  </div>
                  <p className="text-sm text-gray-600">Por cliente/mês</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Faturamento por Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                {clientes.filter(c => c.status === 'ativo').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum cliente ativo com faturamento.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientes.filter(c => c.status === 'ativo').map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{cliente.nome}</span>
                          <span className="text-sm text-gray-600 ml-2">({cliente.plano || 'Plano não definido'})</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            R$ {parseFloat(cliente.valor_mensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-gray-500">mensal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Globais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Registro de novos clientes</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Aprovação manual de usuários</Label>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Notificações de limite</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limites de Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Limite de tentativas de login</Label>
                    <Input type="number" defaultValue="5" className="mt-1" />
                  </div>
                  <div>
                    <Label>Tempo de sessão (minutos)</Label>
                    <Input type="number" defaultValue="480" className="mt-1" />
                  </div>
                  <div>
                    <Label>Taxa de API (requests/min)</Label>
                    <Input type="number" defaultValue="1000" className="mt-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup e Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="text-sm">Backup automático</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span className="text-sm">SSL/TLS</span>
                    <Badge variant="default">
                      <Shield className="h-3 w-3 mr-1" />
                      Configurado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <span className="text-sm">2FA obrigatório</span>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendente
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monitoramento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime do sistema</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuários online</span>
                    <span className="font-medium text-blue-600">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uso de armazenamento</span>
                    <span className="font-medium text-orange-600">45%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 