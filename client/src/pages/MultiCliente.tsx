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
  Clock,
  Copy,
  Download
} from 'lucide-react';
import { useLocation } from 'wouter';

interface PlanoEditavel {
  nome: string;
  preco: number;
  usuarios: number;
  vagas: number;
  recursos: string[];
}

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

  const [newClientForm, setNewClientForm] = useState({
    nome: '',
    dominio: '',
    plano: '',
    adminEmail: ''
  });

  // Estado para edição de planos
  const [planosEditaveis, setPlanosEditaveis] = useState<PlanoEditavel[]>([
    {
      nome: 'Básico',
      preco: 500.00,
      usuarios: 5,
      vagas: 10,
      recursos: ['Gestão básica', 'Suporte email', '1 usuário admin']
    },
    {
      nome: 'Premium',
      preco: 2500.00,
      usuarios: 20,
      vagas: 100,
      recursos: ['Gestão completa', 'Suporte prioritário', '5 usuários admin', 'Relatórios avançados', 'API access']
    },
    {
      nome: 'Enterprise',
      preco: 8900.00,
      usuarios: 100,
      vagas: 1000,
      recursos: ['Gestão ilimitada', 'Suporte 24/7', 'Usuários ilimitados', 'White label', 'Custom integrations', 'Dedicated manager']
    }
  ]);

  const [showSqlGenerated, setShowSqlGenerated] = useState(false);

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

  const criarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClientForm.nome || !newClientForm.dominio || !newClientForm.plano || !newClientForm.adminEmail) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/multicliente/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: newClientForm.nome,
          dominio: newClientForm.dominio,
          plano: newClientForm.plano,
          admin_email: newClientForm.adminEmail,
          status: 'ativo'
        })
      });
      
      if (!response.ok) throw new Error('Erro ao criar cliente');
      
      setShowNewClientDialog(false);
      setNewClientForm({ nome: '', dominio: '', plano: '', adminEmail: '' });
      carregarClientes(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      setError('Erro ao criar cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Funções para edição de planos
  const atualizarPlano = (index: number, campo: keyof PlanoEditavel, valor: any) => {
    const novosPlanos = [...planosEditaveis];
    if (campo === 'recursos') {
      novosPlanos[index].recursos = valor.split(',').map((r: string) => r.trim());
    } else if (campo === 'nome') {
      novosPlanos[index].nome = valor;
    } else if (campo === 'preco') {
      novosPlanos[index].preco = parseFloat(valor) || 0;
    } else if (campo === 'usuarios') {
      novosPlanos[index].usuarios = parseInt(valor) || 0;
    } else if (campo === 'vagas') {
      novosPlanos[index].vagas = parseInt(valor) || 0;
    }
    setPlanosEditaveis(novosPlanos);
  };

  const gerarSqlPersonalizado = () => {
    const sqlBase = `-- Script personalizado para criar tabelas do sistema Multi-Cliente
-- Execute este script no Supabase SQL Editor

-- 1. Tabela de planos
CREATE TABLE IF NOT EXISTS planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  usuarios INTEGER NOT NULL DEFAULT 0,
  vagas INTEGER NOT NULL DEFAULT 0,
  recursos JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  dominio VARCHAR(255) UNIQUE NOT NULL,
  plano_id UUID REFERENCES planos(id),
  plano VARCHAR(50) DEFAULT 'basico',
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
  usuarios INTEGER DEFAULT 0,
  limite_usuarios INTEGER DEFAULT 10,
  vagas_usadas INTEGER DEFAULT 0,
  limite_vagas INTEGER DEFAULT 50,
  valor_mensal DECIMAL(10,2) DEFAULT 500.00,
  faturamento VARCHAR(50) DEFAULT 'Mensal',
  admin_email VARCHAR(255),
  configuracoes JSONB DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de usuários dos clientes
CREATE TABLE IF NOT EXISTS usuarios_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  permissao VARCHAR(50) DEFAULT 'usuario' CHECK (permissao IN ('admin', 'usuario', 'viewer')),
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cliente_id, email)
);

-- 4. Tabela de campanhas hunting
CREATE TABLE IF NOT EXISTS campanhas_hunting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'encerrada')),
  total_encontrados INTEGER DEFAULT 0,
  total_contactados INTEGER DEFAULT 0,
  total_interessados INTEGER DEFAULT 0,
  total_contratados INTEGER DEFAULT 0,
  criterios JSONB DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de templates hunting
CREATE TABLE IF NOT EXISTS templates_hunting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  assunto VARCHAR(255),
  conteudo TEXT NOT NULL,
  variaveis JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de integrações hunting
CREATE TABLE IF NOT EXISTS integracoes_hunting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  configuracao JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  ultima_sincronizacao TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Inserir dados personalizados dos planos
INSERT INTO planos (nome, preco, usuarios, vagas, recursos) VALUES 
${planosEditaveis.map(plano => 
  `('${plano.nome}', ${plano.preco}, ${plano.usuarios}, ${plano.vagas}, '${JSON.stringify(plano.recursos)}')`
).join(',\n')}
ON CONFLICT (nome) DO NOTHING;

-- Clientes de exemplo
INSERT INTO clientes (nome, dominio, plano, status, usuarios, limite_usuarios, vagas_usadas, limite_vagas, valor_mensal, admin_email) VALUES 
('Tech Solutions', 'techsolutions.com', 'premium', 'ativo', 1, ${planosEditaveis.find(p => p.nome === 'Premium')?.usuarios || 20}, 5, ${planosEditaveis.find(p => p.nome === 'Premium')?.vagas || 100}, ${planosEditaveis.find(p => p.nome === 'Premium')?.preco || 2500.00}, 'admin@techsolutions.com'),
('StartupXYZ', 'startupxyz.com', 'basico', 'ativo', 1, ${planosEditaveis.find(p => p.nome === 'Básico')?.usuarios || 5}, 2, ${planosEditaveis.find(p => p.nome === 'Básico')?.vagas || 10}, ${planosEditaveis.find(p => p.nome === 'Básico')?.preco || 500.00}, 'admin@startupxyz.com')
ON CONFLICT (dominio) DO NOTHING;

-- Resto do script...
INSERT INTO usuarios_clientes (cliente_id, nome, email, permissao, status) 
SELECT c.id, 'Admin ' || c.nome, c.admin_email, 'admin', 'ativo'
FROM clientes c WHERE c.admin_email IS NOT NULL
ON CONFLICT (cliente_id, email) DO NOTHING;

INSERT INTO campanhas_hunting (nome, descricao, status, total_contactados, total_interessados) VALUES 
('Busca Desenvolvedores Senior', 'Campanha para encontrar desenvolvedores senior', 'ativa', 15, 3),
('Hunting Analistas de Dados', 'Busca de profissionais em análise de dados', 'ativa', 22, 5),
('Especialistas em DevOps', 'Procura por especialistas em DevOps e Cloud', 'pausada', 8, 2)
ON CONFLICT DO NOTHING;

INSERT INTO templates_hunting (nome, tipo, assunto, conteudo, variaveis) VALUES 
('Primeiro Contato LinkedIn', 'linkedin', 'Oportunidade de carreira interessante', 'Olá {{nome}}, vi seu perfil e gostaria de conversar sobre uma oportunidade...', '["nome", "empresa", "cargo"]'),
('Follow-up Email', 'email', 'Sobre nossa conversa - {{empresa}}', 'Olá {{nome}}, dando sequência à nossa conversa...', '["nome", "empresa", "vaga"]'),
('Convite WhatsApp', 'whatsapp', '', 'Oi {{nome}}! Tenho uma oportunidade que pode te interessar...', '["nome", "cargo"]')
ON CONFLICT DO NOTHING;

INSERT INTO integracoes_hunting (nome, tipo, configuracao, ativo) VALUES 
('LinkedIn Sales Navigator', 'linkedin', '{"api_key": "", "configurado": false}', false),
('GitHub Integration', 'github', '{"token": "", "configurado": false}', false),
('Email SMTP', 'email', '{"smtp_host": "", "smtp_port": 587, "configurado": false}', false)
ON CONFLICT DO NOTHING;`;

    return sqlBase;
  };

  const copiarSqlParaClipboard = async () => {
    const sql = gerarSqlPersonalizado();
    try {
      await navigator.clipboard.writeText(sql);
      // Aqui você poderia adicionar um toast de sucesso
      alert('SQL copiado para o clipboard!');
    } catch (err) {
      console.error('Erro ao copiar SQL:', err);
      alert('Erro ao copiar SQL. Use Ctrl+C manualmente.');
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
                    <form onSubmit={criarCliente} className="space-y-4">
                      <div>
                        <Label htmlFor="nomeCliente">Nome da Empresa</Label>
                        <Input 
                          id="nomeCliente" 
                          placeholder="Ex: TechCorp Solutions"
                          value={newClientForm.nome}
                          onChange={(e) => setNewClientForm(prev => ({ ...prev, nome: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dominio">Domínio</Label>
                        <Input 
                          id="dominio" 
                          placeholder="techcorp.com"
                          value={newClientForm.dominio}
                          onChange={(e) => setNewClientForm(prev => ({ ...prev, dominio: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="plano">Plano</Label>
                        <Select value={newClientForm.plano} onValueChange={(value) => setNewClientForm(prev => ({ ...prev, plano: value }))}>
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
                        <Input 
                          id="adminEmail" 
                          type="email" 
                          placeholder="admin@techcorp.com"
                          value={newClientForm.adminEmail}
                          onChange={(e) => setNewClientForm(prev => ({ ...prev, adminEmail: e.target.value }))}
                          required
                        />
                      </div>
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                          {error}
                        </div>
                      )}
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Cliente'}
                      </Button>
                    </form>
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
                              Cliente desde {cliente.criado_em ? new Date(cliente.criado_em).toLocaleDateString('pt-BR') : 'Data não disponível'}
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
                          <div className="font-medium text-blue-700">{cliente.usuarios || 0}/{cliente.limite_usuarios || 0}</div>
                          <div className="text-blue-600">Usuários</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-medium text-green-700">{cliente.vagas_usadas || 0}/{cliente.limite_vagas || 0}</div>
                          <div className="text-green-600">Vagas</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="font-medium text-purple-700">{cliente.faturamento || 'Mensal'}</div>
                          <div className="text-purple-600">Mensal</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium text-gray-700">
                            {cliente.limite_vagas > 0 ? Math.round((cliente.vagas_usadas / cliente.limite_vagas) * 100) : 0}%
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Editor de Planos
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Configure os valores dos planos antes de executar o script SQL.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {planosEditaveis.map((plano, index) => (
                  <div key={plano.nome} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{plano.nome}</h3>
                      <Badge variant={plano.nome === 'Premium' ? 'default' : 'secondary'}>
                        {plano.nome}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`preco-${index}`}>Preço (R$)</Label>
                        <Input
                          id={`preco-${index}`}
                          type="number"
                          step="0.01"
                          value={plano.preco}
                          onChange={(e) => atualizarPlano(index, 'preco', e.target.value)}
                          placeholder="500.00"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`usuarios-${index}`}>Limite de Usuários</Label>
                        <Input
                          id={`usuarios-${index}`}
                          type="number"
                          value={plano.usuarios}
                          onChange={(e) => atualizarPlano(index, 'usuarios', e.target.value)}
                          placeholder="5"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`vagas-${index}`}>Limite de Vagas</Label>
                        <Input
                          id={`vagas-${index}`}
                          type="number"
                          value={plano.vagas}
                          onChange={(e) => atualizarPlano(index, 'vagas', e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`nome-${index}`}>Nome do Plano</Label>
                        <Input
                          id={`nome-${index}`}
                          type="text"
                          value={plano.nome}
                          onChange={(e) => atualizarPlano(index, 'nome', e.target.value)}
                          placeholder="Básico"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`recursos-${index}`}>Recursos (separados por vírgula)</Label>
                      <Input
                        id={`recursos-${index}`}
                        type="text"
                        value={plano.recursos.join(', ')}
                        onChange={(e) => atualizarPlano(index, 'recursos', e.target.value)}
                        placeholder="Gestão básica, Suporte email, 1 usuário admin"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      <strong>Preview:</strong> {plano.nome} - R$ {plano.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                      ({plano.usuarios} usuários, {plano.vagas} vagas)
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-4 pt-6 border-t">
                  <Button onClick={copiarSqlParaClipboard} className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copiar SQL Personalizado
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSqlGenerated(!showSqlGenerated)}
                    className="flex items-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    {showSqlGenerated ? 'Ocultar' : 'Visualizar'} SQL
                  </Button>
                </div>
                
                {showSqlGenerated && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        SQL Gerado Automaticamente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                        <pre>{gerarSqlPersonalizado()}</pre>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <strong>Como usar:</strong>
                            <ol className="list-decimal list-inside mt-1 space-y-1">
                              <li>Copie o SQL acima (botão "Copiar SQL Personalizado")</li>
                              <li>Acesse o Supabase SQL Editor</li>
                              <li>Cole o código e execute</li>
                              <li>Recarregue a página Multi-Cliente</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configurações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moeda">Moeda Padrão</Label>
                    <Select defaultValue="BRL">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select defaultValue="America/Sao_Paulo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium">Notificações por Email</h4>
                    <p className="text-sm text-gray-600">Receber notificações sobre novos clientes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium">Backup Automático</h4>
                    <p className="text-sm text-gray-600">Backup diário dos dados</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <Button className="w-full">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 