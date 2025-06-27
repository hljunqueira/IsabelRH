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
  Shield,
  MessageCircle,
  Search,
  Users as UsersIcon
} from "lucide-react";
import type { Candidato, Empresa, Vaga, Servico, Proposta, Relatorio } from "@shared/schema";
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner, { PageLoader } from '@/components/LoadingSpinner';

export default function Admin() {
  console.log('🛠️ Admin: Componente iniciado');
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  const [showNewProposalDialog, setShowNewProposalDialog] = useState(false);
  
  // Check authentication
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    console.log('🛠️ Admin: Verificando autenticação...');
    const storedUser = localStorage.getItem("auth-user");
    console.log('��️ Admin: storedUser existe =', !!storedUser);
    
    if (!storedUser) {
      console.log('🛠️ Admin: Sem usuário, redirecionando para admin-login');
      setLocation("/admin-login");
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      console.log('🛠️ Admin: userData completo =', userData);
      
      // Verificar diferentes estruturas possíveis
      const userType = userData.usuario?.type || userData.usuario?.tipo || userData.type || userData.tipo;
      console.log('🛠️ Admin: Tipo de usuário detectado =', userType);
      
      if (userType !== "admin") {
        console.log('🛠️ Admin: Usuário não é admin, redirecionando para admin-login');
        toast({
          title: "Acesso negado",
          description: "Você precisa ser um administrador para acessar esta área.",
          variant: "destructive"
        });
        setLocation("/admin-login");
        return;
      }
      
      console.log('🛠️ Admin: Usuário admin autenticado com sucesso!');
      setUser(userData);
    } catch (error) {
      console.log('🛠️ Admin: Erro ao parsear userData, redirecionando para admin-login');
      setLocation("/admin-login");
    }
  }, [setLocation, toast]);

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

  // Estados dos filtros
  const [candidatoFilter, setCandidatoFilter] = useState("");
  const [candidatoFilterCity, setCandidatoFilterCity] = useState("all");
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [empresaFilterSetor, setEmpresaFilterSetor] = useState("all");

  // Estados de confirmação
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    action: () => {},
    variant: "destructive" as const,
    icon: "delete" as const,
    loading: false
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

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/servicos/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/servicos'] });
      toast({ title: "Serviço removido com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao remover serviço", 
        variant: "destructive" 
      });
    }
  });

  const deleteProposalMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/propostas/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/propostas'] });
      toast({ title: "Proposta removida com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao remover proposta", 
        variant: "destructive" 
      });
    }
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

  // Filtros de candidatos e empresas
  const filteredCandidatos = candidatos.filter(candidato => {
    const matchesName = candidato.nome?.toLowerCase().includes(candidatoFilter.toLowerCase()) ?? false;
    const matchesPhone = candidato.telefone?.toLowerCase().includes(candidatoFilter.toLowerCase()) ?? false;
    const matchesSearch = candidatoFilter === "" || matchesName || matchesPhone;
    const matchesCity = candidatoFilterCity === "all" || candidato.cidade === candidatoFilterCity;
    return matchesSearch && matchesCity;
  });

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesName = empresa.nome?.toLowerCase().includes(empresaFilter.toLowerCase()) ?? false;
    const matchesCnpj = empresa.cnpj?.toLowerCase().includes(empresaFilter.toLowerCase()) ?? false;
    const matchesSearch = empresaFilter === "" || matchesName || matchesCnpj;
    const matchesSetor = empresaFilterSetor === "all" || empresa.setor === empresaFilterSetor;
    return matchesSearch && matchesSetor;
  });

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
      .reduce((acc, s) => {
        const valorStr = typeof s.valor === 'string' ? s.valor : String(s.valor || '0');
        return acc + parseFloat(valorStr.replace(/[^\d,]/g, '').replace(',', '.') || '0');
      }, 0)
  };

  // Função para mostrar confirmação de delete
  const showDeleteConfirmation = (id: string, type: 'candidato' | 'empresa', name: string) => {
    setConfirmDialog({
      open: true,
      title: `Remover ${type === 'candidato' ? 'Candidato' : 'Empresa'}`,
      description: `Tem certeza que deseja remover "${name}"? Esta ação não pode ser desfeita.`,
      action: () => {
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        deleteUserMutation.mutate({ id, type }, {
          onSettled: () => {
            setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
          }
        });
      },
      variant: "destructive",
      icon: type === 'candidato' ? 'delete' : 'delete',
      loading: false
    });
  };

  const showServiceDeleteConfirmation = (id: string, name: string) => {
    setConfirmDialog({
      open: true,
      title: "Remover Serviço",
      description: `Tem certeza que deseja remover o serviço "${name}"? Esta ação não pode ser desfeita.`,
      action: () => {
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        deleteServiceMutation.mutate(id, {
          onSettled: () => {
            setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
          }
        });
      },
      variant: "destructive",
      icon: 'delete',
      loading: false
    });
  };

  const showProposalDeleteConfirmation = (id: string, empresa: string) => {
    setConfirmDialog({
      open: true,
      title: "Remover Proposta",
      description: `Tem certeza que deseja remover a proposta para "${empresa}"? Esta ação não pode ser desfeita.`,
      action: () => {
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        deleteProposalMutation.mutate(id, {
          onSettled: () => {
            setConfirmDialog(prev => ({ ...prev, open: false, loading: false }));
          }
        });
      },
      variant: "destructive",
      icon: 'delete',
      loading: false
    });
  };

  if (!user) {
    return <PageLoader text="Carregando área administrativa..." />;
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
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
              <TabsTrigger value="propostas">Propostas</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
              <TabsTrigger value="hunting">Hunting</TabsTrigger>
              <TabsTrigger value="multi-cliente">Multi-Cliente</TabsTrigger>
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestão de Candidatos</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar candidatos..."
                        className="pl-8 w-64"
                        value={candidatoFilter}
                        onChange={(e) => setCandidatoFilter(e.target.value)}
                      />
                    </div>
                    <Select value={candidatoFilterCity} onValueChange={setCandidatoFilterCity}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por cidade" />
                      </SelectTrigger>
                      <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">Todas as cidades</SelectItem>
                        {Array.from(new Set(candidatos.map(c => c.cidade).filter(Boolean))).map((cidade) => (
                          <SelectItem key={cidade} value={cidade || ""}>
                            {cidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCandidatos.map((candidato) => (
                      <div key={candidato.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{candidato.nome}</h3>
                              <p className="text-sm text-gray-500">{candidato.telefone}</p>
                              {candidato.cidade && (
                                <p className="text-sm text-gray-400">📍 {candidato.cidade}</p>
                              )}
                              {candidato.linkedin && (
                                <p className="text-sm text-blue-600">LinkedIn: {candidato.linkedin}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/candidato/${candidato.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => showDeleteConfirmation(candidato.id, 'candidato', candidato.nome)}
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredCandidatos.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum candidato encontrado</p>
                        {candidatoFilter && (
                          <p className="text-sm">Tente ajustar os filtros de busca</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Empresas */}
            <TabsContent value="empresas">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestão de Empresas</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar empresas..."
                        className="pl-8 w-64"
                        value={empresaFilter}
                        onChange={(e) => setEmpresaFilter(e.target.value)}
                      />
                    </div>
                    <Select value={empresaFilterSetor} onValueChange={setEmpresaFilterSetor}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por setor" />
                      </SelectTrigger>
                      <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">Todos os setores</SelectItem>
                        {Array.from(new Set(empresas.map(e => e.setor).filter(Boolean))).map((setor) => (
                          <SelectItem key={setor} value={setor || ""}>
                            {setor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEmpresas.map((empresa) => (
                      <div key={empresa.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Building className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{empresa.nome}</h3>
                              <p className="text-sm text-gray-500">CNPJ: {empresa.cnpj}</p>
                              {empresa.setor && (
                                <p className="text-sm text-gray-400">🏢 {empresa.setor}</p>
                              )}
                              {empresa.cidade && (
                                <p className="text-sm text-gray-400">📍 {empresa.cidade}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/empresa/${empresa.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => showDeleteConfirmation(empresa.id, 'empresa', empresa.nome)}
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredEmpresas.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma empresa encontrada</p>
                        {empresaFilter && (
                          <p className="text-sm">Tente ajustar os filtros de busca</p>
                        )}
                      </div>
                    )}
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
                            <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
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
                            <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
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

                        <Button 
                          onClick={handleCreateService} 
                          className="w-full"
                          disabled={createServiceMutation.isPending}
                        >
                          {createServiceMutation.isPending ? (
                            <LoadingSpinner size="sm" text="Criando..." />
                          ) : (
                            "Criar Serviço"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servicos.map((servico) => (
                      <div key={servico.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium capitalize">{String(servico.tipoServico || '').replace('_', ' ')}</h3>
                            <p className="text-sm text-gray-600 mt-1">{servico.descricao}</p>
                            {servico.valor && (
                              <p className="text-sm font-medium text-green-600 mt-2">{servico.valor}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              servico.status === 'concluida' ? 'default' :
                              servico.status === 'em_andamento' ? 'secondary' : 'outline'
                            }>
                              {String(servico.status || '').replace('_', ' ')}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Funcionalidade de editar - pode ser implementada depois
                                toast({ 
                                  title: "Funcionalidade de edição", 
                                  description: "Em desenvolvimento. Use 'Novo Serviço' por enquanto.",
                                  variant: "default"
                                });
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => showServiceDeleteConfirmation(
                                servico.id, 
                                String(servico.tipoServico || '').replace('_', ' ')
                              )}
                              disabled={deleteServiceMutation.isPending}
                            >
                              {deleteServiceMutation.isPending ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {servicos.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum serviço cadastrado ainda.</p>
                        <p className="text-sm">Clique em "Novo Serviço" para começar.</p>
                      </div>
                    )}
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
                            <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
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
                            <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
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

                        <Button 
                          onClick={handleCreateProposal} 
                          className="w-full"
                          disabled={createProposalMutation.isPending}
                        >
                          {createProposalMutation.isPending ? (
                            <LoadingSpinner size="sm" text="Criando..." />
                          ) : (
                            "Criar Proposta"
                          )}
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
                        <div key={proposta.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{empresa?.nome}</h3>
                              <p className="text-sm text-gray-600 capitalize">{String(proposta.tipoServico || '').replace('_', ' ')}</p>
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
                                    title="Aprovar proposta"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateProposalMutation.mutate({ id: proposta.id, aprovada: 'nao' })}
                                    title="Rejeitar proposta"
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Funcionalidade de editar - pode ser implementada depois
                                  toast({ 
                                    title: "Funcionalidade de edição", 
                                    description: "Em desenvolvimento. Use 'Nova Proposta' por enquanto.",
                                    variant: "default"
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => showProposalDeleteConfirmation(
                                  proposta.id, 
                                  empresa?.nome || 'Empresa'
                                )}
                                disabled={deleteProposalMutation.isPending}
                              >
                                {deleteProposalMutation.isPending ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
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
                    {propostas.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma proposta cadastrada ainda.</p>
                        <p className="text-sm">Clique em "Nova Proposta" para começar.</p>
                      </div>
                    )}
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

            {/* Comunicação */}
            <TabsContent value="comunicacao" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Sistema de Comunicação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Comunicação Integrada</h3>
                      <p className="text-gray-600">
                        Sistema completo de comunicação entre candidatos e empresas com chat em tempo real, 
                        notificações push e templates personalizados.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">24</div>
                          <div className="text-sm text-blue-700">Conversas Ativas</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">89</div>
                          <div className="text-sm text-green-700">Mensagens Hoje</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Recursos Disponíveis:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Chat em tempo real</li>
                          <li>• Notificações push</li>
                          <li>• Templates de mensagens</li>
                          <li>• Histórico de conversas</li>
                          <li>• Status online/offline</li>
                          <li>• Integração com área empresa</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <MessageCircle className="h-12 w-12 mb-3 opacity-80" />
                        <h3 className="text-lg font-semibold mb-2">Acesse o Sistema</h3>
                        <p className="text-blue-100 text-sm mb-4">
                          Gerencie todas as comunicações do sistema de forma centralizada.
                        </p>
                        <Button 
                          onClick={() => setLocation("/comunicacao")}
                          className="bg-white text-blue-600 hover:bg-blue-50 w-full"
                        >
                          Abrir Comunicação
                        </Button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Integração com Área Empresa</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          O sistema de comunicação está completamente integrado com a área empresa, 
                          permitindo que empresas se comuniquem diretamente com candidatos.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation("/empresa")}
                        >
                          Ver Área Empresa
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hunting */}
            <TabsContent value="hunting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-pink-500" />
                    Sistema de Hunting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Busca Ativa de Talentos</h3>
                      <p className="text-gray-600">
                        Plataforma completa para hunting de candidatos com integração a LinkedIn, 
                        GitHub e outras redes profissionais.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-pink-50 rounded-lg">
                          <div className="text-2xl font-bold text-pink-600">2</div>
                          <div className="text-sm text-pink-700">Campanhas Ativas</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">37</div>
                          <div className="text-sm text-green-700">Candidatos Contactados</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Funcionalidades:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Campanhas de hunting</li>
                          <li>• Templates personalizados</li>
                          <li>• Integração LinkedIn/GitHub</li>
                          <li>• Relatórios de performance</li>
                          <li>• Acompanhamento de status</li>
                          <li>• Taxa de conversão</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                        <Search className="h-12 w-12 mb-3 opacity-80" />
                        <h3 className="text-lg font-semibold mb-2">Acesse o Hunting</h3>
                        <p className="text-pink-100 text-sm mb-4">
                          Gerencie campanhas de busca ativa e integre com plataformas externas.
                        </p>
                        <Button 
                          onClick={() => setLocation("/hunting")}
                          className="bg-white text-pink-600 hover:bg-pink-50 w-full"
                        >
                          Abrir Hunting
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium">LinkedIn</span>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Conectado
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium">GitHub</span>
                          <Badge variant="outline">Desconectado</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Multi-Cliente */}
            <TabsContent value="multi-cliente" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-orange-500" />
                    Gestão Multi-Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Plataforma Multi-Tenant</h3>
                      <p className="text-gray-600">
                        Sistema completo para gerenciar múltiplos clientes com isolamento de dados, 
                        permissões personalizadas e billing automatizado.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">3</div>
                          <div className="text-sm text-orange-700">Clientes Ativos</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">R$ 11.9k</div>
                          <div className="text-sm text-green-700">Receita Mensal</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Recursos Disponíveis:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Gestão de clientes</li>
                          <li>• Controle de permissões</li>
                          <li>• Limites de recursos</li>
                          <li>• Faturamento automático</li>
                          <li>• Relatórios por cliente</li>
                          <li>• Backup e segurança</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                        <UsersIcon className="h-12 w-12 mb-3 opacity-80" />
                        <h3 className="text-lg font-semibold mb-2">Acesse Multi-Cliente</h3>
                        <p className="text-orange-100 text-sm mb-4">
                          Gerencie todos os clientes, planos e faturamento de forma centralizada.
                        </p>
                        <Button 
                          onClick={() => setLocation("/multi-cliente")}
                          className="bg-white text-orange-600 hover:bg-orange-50 w-full"
                        >
                          Abrir Multi-Cliente
                        </Button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Planos Disponíveis</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Básico</span>
                            <span className="font-medium">R$ 500,00</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Premium</span>
                            <span className="font-medium">R$ 2.500,00</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Enterprise</span>
                            <span className="font-medium">R$ 8.900,00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText="Sim, remover"
        cancelText="Cancelar"
        variant={confirmDialog.variant}
        icon={confirmDialog.icon}
        onConfirm={confirmDialog.action}
        loading={confirmDialog.loading}
      />
    </Layout>
  );
}