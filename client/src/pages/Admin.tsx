import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  Building, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Calendar, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  PieChart,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Shield
} from "lucide-react";
import type { Candidato, Empresa, Vaga, Servico, Proposta, Relatorio } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  const [showNewProposalDialog, setShowNewProposalDialog] = useState(false);
  
  // Check authentication
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");
    if (!storedUser) {
      setLocation("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      if (userData.usuario.tipo !== "admin") {
        setLocation("/login");
        return;
      }
      setUser(userData);
    } catch (error) {
      setLocation("/login");
    }
  }, [setLocation]);

  // Dados administrativos
  const { data: candidatos = [] } = useQuery<Candidato[]>({
    queryKey: ['/api/admin/candidatos'],
    enabled: !!user,
  });

  const { data: empresas = [] } = useQuery<Empresa[]>({
    queryKey: ['/api/admin/empresas'],
    enabled: !!user,
  });

  const { data: vagas = [] } = useQuery<Vaga[]>({
    queryKey: ['/api/vagas'],
    enabled: !!user,
  });

  const { data: servicos = [] } = useQuery<Servico[]>({
    queryKey: ['/api/admin/servicos'],
    enabled: !!user,
  });

  const { data: propostas = [] } = useQuery<Proposta[]>({
    queryKey: ['/api/admin/propostas'],
    enabled: !!user,
  });

  // Estados dos formulários
  const [newService, setNewService] = useState({
    empresaId: "",
    candidatoId: "",
    tipoServico: "",
    descricao: "",
    valor: "",
    observacoes: "",
  });

  const [newProposal, setNewProposal] = useState({
    empresaId: "",
    tipoServico: "",
    descricao: "",
    valorProposto: "",
    prazoEntrega: "",
    observacoes: "",
  });

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/servicos'] });
      toast({ title: "Serviço criado com sucesso!" });
      setShowNewServiceDialog(false);
      setNewService({
        empresaId: "",
        candidatoId: "",
        tipoServico: "",
        descricao: "",
        valor: "",
        observacoes: "",
      });
    },
    onError: () => {
      toast({ 
        title: "Erro ao criar serviço", 
        variant: "destructive" 
      });
    }
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/propostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/propostas'] });
      toast({ title: "Proposta criada com sucesso!" });
      setShowNewProposalDialog(false);
      setNewProposal({
        empresaId: "",
        tipoServico: "",
        descricao: "",
        valorProposto: "",
        prazoEntrega: "",
        observacoes: "",
      });
    },
    onError: () => {
      toast({ 
        title: "Erro ao criar proposta", 
        variant: "destructive" 
      });
    }
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, aprovada }: { id: string; aprovada: string }) => {
      const response = await fetch(`/api/admin/propostas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aprovada }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/propostas'] });
      toast({ title: "Proposta atualizada!" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'candidato' | 'empresa' }) => {
      const response = await fetch(`/api/admin/${type}s/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${variables.type}s`] });
      toast({ title: "Usuário removido com sucesso!" });
    },
  });

  const handleCreateService = () => {
    if (!newService.tipoServico || !newService.descricao) {
      toast({ 
        title: "Preencha os campos obrigatórios", 
        variant: "destructive" 
      });
      return;
    }
    
    // Preparar dados removendo campos vazios
    const serviceData: any = {
      tipoServico: newService.tipoServico,
      descricao: newService.descricao,
    };
    
    if (newService.empresaId) serviceData.empresaId = newService.empresaId;
    if (newService.candidatoId) serviceData.candidatoId = newService.candidatoId;
    if (newService.valor) serviceData.valor = newService.valor;
    if (newService.observacoes) serviceData.observacoes = newService.observacoes;
    
    createServiceMutation.mutate(serviceData);
  };

  const handleCreateProposal = () => {
    if (!newProposal.empresaId || !newProposal.tipoServico || !newProposal.descricao || !newProposal.valorProposto) {
      toast({ 
        title: "Preencha os campos obrigatórios", 
        variant: "destructive" 
      });
      return;
    }
    
    // Preparar dados removendo campos vazios
    const proposalData: any = {
      empresaId: newProposal.empresaId,
      tipoServico: newProposal.tipoServico,
      descricao: newProposal.descricao,
      valorProposto: newProposal.valorProposto,
    };
    
    if (newProposal.prazoEntrega) proposalData.prazoEntrega = newProposal.prazoEntrega;
    if (newProposal.observacoes) proposalData.observacoes = newProposal.observacoes;
    
    createProposalMutation.mutate(proposalData);
  };

  // Estatísticas do dashboard
  const stats = {
    totalCandidatos: candidatos.length,
    totalEmpresas: empresas.length,
    totalVagas: vagas.length,
    totalServicos: servicos.length,
    servicosAtivos: servicos.filter(s => s.status === 'em_andamento').length,
    servicosConcluidos: servicos.filter(s => s.status === 'concluida').length,
    propostas: propostas.length,
    propostasAprovadas: propostas.filter(p => p.aprovada === 'sim').length,
    faturamentoEstimado: servicos
      .filter(s => s.valor)
      .reduce((acc, s) => acc + parseFloat(s.valor?.replace(/[^\d,]/g, '').replace(',', '.') || '0'), 0)
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-isabel-blue">Área Administrativa</h1>
                <p className="text-gray-600 mt-2">Gerencie candidatos, empresas e serviços de consultoria</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    localStorage.removeItem("auth-user");
                    toast({ title: "Logout realizado com sucesso!" });
                    setLocation("/login");
                  }}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
                
                <div className="w-16 h-16 bg-isabel-blue rounded-full flex items-center justify-center">
                  <Shield className="text-white h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
              <TabsTrigger value="propostas">Propostas</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Candidatos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCandidatos}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEmpresas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVagas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento (R$)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.faturamentoEstimado.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status dos Serviços</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm">Em andamento: {stats.servicosAtivos}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Concluídos: {stats.servicosConcluidos}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">Total: {stats.totalServicos}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Propostas Comerciais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Aprovadas: {stats.propostasAprovadas}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm">Pendentes: {stats.propostas - stats.propostasAprovadas}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">Total: {stats.propostas}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Candidatos */}
            <TabsContent value="candidatos">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidatos.map((candidato) => (
                      <div key={candidato.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{candidato.nome}</h3>
                          <p className="text-sm text-gray-500">{candidato.telefone}</p>
                          {candidato.linkedin && (
                            <p className="text-sm text-blue-600">{candidato.linkedin}</p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUserMutation.mutate({ id: candidato.id, type: 'candidato' })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Empresas */}
            <TabsContent value="empresas">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Empresas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {empresas.map((empresa) => (
                      <div key={empresa.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{empresa.nome}</h3>
                          <p className="text-sm text-gray-500">{empresa.cnpj}</p>
                          <p className="text-sm text-gray-500">{empresa.setor}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUserMutation.mutate({ id: empresa.id, type: 'empresa' })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Serviços */}
            <TabsContent value="servicos">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestão de Serviços</CardTitle>
                  <Dialog open={showNewServiceDialog} onOpenChange={setShowNewServiceDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Serviço
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Novo Serviço</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="empresa">Empresa</Label>
                          <Select value={newService.empresaId} onValueChange={(value) => setNewService(prev => ({ ...prev, empresaId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {empresas.map((empresa) => (
                                <SelectItem key={empresa.id} value={empresa.id}>
                                  {empresa.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="tipoServico">Tipo de Serviço *</Label>
                          <Select value={newService.tipoServico} onValueChange={(value) => setNewService(prev => ({ ...prev, tipoServico: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recrutamento">Recrutamento</SelectItem>
                              <SelectItem value="selecao">Seleção</SelectItem>
                              <SelectItem value="consultoria_rh">Consultoria RH</SelectItem>
                              <SelectItem value="treinamento">Treinamento</SelectItem>
                              <SelectItem value="avaliacao">Avaliação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="descricao">Descrição *</Label>
                          <Textarea
                            id="descricao"
                            value={newService.descricao}
                            onChange={(e) => setNewService(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Descreva o serviço..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="valor">Valor</Label>
                          <Input
                            id="valor"
                            type="text"
                            value={newService.valor}
                            onChange={(e) => setNewService(prev => ({ ...prev, valor: e.target.value }))}
                            placeholder="Ex: R$ 5.000,00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="observacoes">Observações</Label>
                          <Textarea
                            id="observacoes"
                            value={newService.observacoes}
                            onChange={(e) => setNewService(prev => ({ ...prev, observacoes: e.target.value }))}
                            placeholder="Observações adicionais..."
                          />
                        </div>

                        <Button onClick={handleCreateService} className="w-full">
                          Criar Serviço
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servicos.map((servico) => (
                      <div key={servico.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium capitalize">{servico.tipoServico.replace('_', ' ')}</h3>
                            <p className="text-sm text-gray-600 mt-1">{servico.descricao}</p>
                            {servico.valor && (
                              <p className="text-sm font-medium text-green-600 mt-2">{servico.valor}</p>
                            )}
                          </div>
                          <Badge variant={
                            servico.status === 'concluida' ? 'default' :
                            servico.status === 'em_andamento' ? 'secondary' : 'outline'
                          }>
                            {servico.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Propostas */}
            <TabsContent value="propostas">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestão de Propostas</CardTitle>
                  <Dialog open={showNewProposalDialog} onOpenChange={setShowNewProposalDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Proposta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Proposta</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="empresa">Empresa *</Label>
                          <Select value={newProposal.empresaId} onValueChange={(value) => setNewProposal(prev => ({ ...prev, empresaId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {empresas.map((empresa) => (
                                <SelectItem key={empresa.id} value={empresa.id}>
                                  {empresa.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="tipoServico">Tipo de Serviço *</Label>
                          <Select value={newProposal.tipoServico} onValueChange={(value) => setNewProposal(prev => ({ ...prev, tipoServico: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recrutamento">Recrutamento</SelectItem>
                              <SelectItem value="selecao">Seleção</SelectItem>
                              <SelectItem value="consultoria_rh">Consultoria RH</SelectItem>
                              <SelectItem value="treinamento">Treinamento</SelectItem>
                              <SelectItem value="avaliacao">Avaliação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="descricao">Descrição *</Label>
                          <Textarea
                            id="descricao"
                            value={newProposal.descricao}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Descreva a proposta..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="valorProposto">Valor Proposto *</Label>
                          <Input
                            id="valorProposto"
                            type="text"
                            value={newProposal.valorProposto}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, valorProposto: e.target.value }))}
                            placeholder="Ex: R$ 5.000,00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="prazoEntrega">Prazo de Entrega</Label>
                          <Input
                            id="prazoEntrega"
                            type="text"
                            value={newProposal.prazoEntrega}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, prazoEntrega: e.target.value }))}
                            placeholder="Ex: 30 dias"
                          />
                        </div>

                        <Button onClick={handleCreateProposal} className="w-full">
                          Criar Proposta
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {propostas.map((proposta) => {
                      const empresa = empresas.find(e => e.id === proposta.empresaId);
                      return (
                        <div key={proposta.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{empresa?.nome}</h3>
                              <p className="text-sm text-gray-600 capitalize">{proposta.tipoServico.replace('_', ' ')}</p>
                              <p className="text-sm text-gray-600 mt-1">{proposta.descricao}</p>
                              <p className="text-sm font-medium text-green-600 mt-2">{proposta.valorProposto}</p>
                              {proposta.prazoEntrega && (
                                <p className="text-sm text-gray-500">Prazo: {proposta.prazoEntrega}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {proposta.aprovada === 'pendente' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateProposalMutation.mutate({ id: proposta.id, aprovada: 'sim' })}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateProposalMutation.mutate({ id: proposta.id, aprovada: 'nao' })}
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <Badge variant={
                                proposta.aprovada === 'sim' ? 'default' :
                                proposta.aprovada === 'nao' ? 'destructive' : 'outline'
                              }>
                                {proposta.aprovada === 'sim' ? 'Aprovada' :
                                 proposta.aprovada === 'nao' ? 'Rejeitada' : 'Pendente'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Relatórios */}
            <TabsContent value="relatorios">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios e Análises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-medium mb-4">Resumo Mensal</h3>
                      <div className="space-y-2">
                        <p className="text-sm">Novos candidatos: {candidatos.length}</p>
                        <p className="text-sm">Novas empresas: {empresas.length}</p>
                        <p className="text-sm">Vagas publicadas: {vagas.length}</p>
                        <p className="text-sm">Serviços concluídos: {stats.servicosConcluidos}</p>
                      </div>
                    </div>

                    <div className="p-6 border rounded-lg">
                      <h3 className="font-medium mb-4">Análise de Performance</h3>
                      <div className="space-y-2">
                        <p className="text-sm">Taxa de aprovação: {stats.propostas > 0 ? Math.round((stats.propostasAprovadas / stats.propostas) * 100) : 0}%</p>
                        <p className="text-sm">Serviços ativos: {stats.servicosAtivos}</p>
                        <p className="text-sm">Faturamento estimado: R$ {stats.faturamentoEstimado.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}