import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Eye,
  Trash2,
  Download,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  UserCheck,
  LogOut,
  Globe,
  Phone,
  Mail,
  Linkedin,
  Target,
  Award,
  TrendingUp
} from "lucide-react";
import type { Empresa, Vaga, Candidatura, Candidato } from "@shared/schema";
import Layout from "@/components/Layout";

export default function AreaEmpresa() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    if (!user || user.usuario.tipo !== "empresa") {
      setLocation("/login");
    }
  }, [setLocation]);

  const [profileData, setProfileData] = useState({
    nome: "",
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    inscricaoEstadual: "",
    setor: "",
    porte: "",
    telefone: "",
    celular: "",
    website: "",
    linkedin: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    descricao: "",
    missao: "",
    visao: "",
    valores: "",
    beneficios: [] as string[],
    cultura: "",
    numeroFuncionarios: "",
    anoFundacao: "",
    contato: "",
    cargoContato: "",
  });

  const [newJobData, setNewJobData] = useState({
    titulo: "",
    descricao: "",
    requisitos: "",
    area: "",
    nivel: "",
    tipoContrato: "",
    modalidade: "",
    salario: "",
    beneficios: [] as string[],
    cidade: "",
    estado: "",
    cargaHoraria: "",
    responsabilidades: "",
    diferenciais: "",
    dataEncerramento: "",
  });

  // Fetch company profile
  const { data: empresa, isLoading: loadingProfile } = useQuery({
    queryKey: [`/api/empresas/${user?.usuario?.id}`],
    enabled: !!user?.usuario?.id,
  });

  // Fetch company jobs
  const { data: vagas = [], isLoading: loadingVagas } = useQuery({
    queryKey: [`/api/vagas/empresa/${user?.usuario?.id}`],
    enabled: !!user?.usuario?.id,
  });

  // Fetch applications for each job
  const { data: candidaturasData = {} } = useQuery({
    queryKey: ['/api/candidaturas/empresa', user?.usuario?.id],
    enabled: !!user?.usuario?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Empresa>) => {
      return await apiRequest("PUT", `/api/empresas/${user.usuario.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/empresas/${user.usuario.id}`] });
      toast({
        title: "Perfil atualizado!",
        description: "Informações da empresa foram salvas com sucesso.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/vagas", { 
        ...data, 
        empresaId: user.usuario.id 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vagas/empresa/${user.usuario.id}`] });
      toast({
        title: "Vaga criada!",
        description: "A vaga foi publicada com sucesso.",
      });
      setShowJobModal(false);
      resetJobForm();
    },
    onError: () => {
      toast({
        title: "Erro ao criar vaga",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (vagaId: string) => {
      return await apiRequest("DELETE", `/api/vagas/${vagaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vagas/empresa/${user.usuario.id}`] });
      toast({
        title: "Vaga removida!",
        description: "A vaga foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover vaga",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Update profile data when empresa is loaded
  useEffect(() => {
    if (empresa) {
      setProfileData({
        nome: empresa.nome || "",
        cnpj: empresa.cnpj || "",
        razaoSocial: empresa.razaoSocial || "",
        nomeFantasia: empresa.nomeFantasia || "",
        inscricaoEstadual: empresa.inscricaoEstadual || "",
        setor: empresa.setor || "",
        porte: empresa.porte || "",
        telefone: empresa.telefone || "",
        celular: empresa.celular || "",
        website: empresa.website || "",
        linkedin: empresa.linkedin || "",
        endereco: empresa.endereco || "",
        cidade: empresa.cidade || "",
        estado: empresa.estado || "",
        cep: empresa.cep || "",
        descricao: empresa.descricao || "",
        missao: empresa.missao || "",
        visao: empresa.visao || "",
        valores: empresa.valores || "",
        beneficios: empresa.beneficios || [],
        cultura: empresa.cultura || "",
        numeroFuncionarios: empresa.numeroFuncionarios || "",
        anoFundacao: empresa.anoFundacao || "",
        contato: empresa.contato || "",
        cargoContato: empresa.cargoContato || "",
      });
    }
  }, [empresa]);

  // Reset new job form
  const resetJobForm = () => {
    setNewJobData({
      titulo: "",
      descricao: "",
      requisitos: "",
      area: "",
      nivel: "",
      tipoContrato: "",
      modalidade: "",
      salario: "",
      beneficios: [],
      cidade: "",
      estado: "",
      cargaHoraria: "",
      responsabilidades: "",
      diferenciais: "",
      dataEncerramento: "",
    });
  };

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleJobCreate = () => {
    createJobMutation.mutate(newJobData);
  };

  const handleJobDelete = (vagaId: string) => {
    if (confirm("Tem certeza que deseja remover esta vaga?")) {
      deleteJobMutation.mutate(vagaId);
    }
  };

  const addBeneficio = (beneficio: string) => {
    if (beneficio && !profileData.beneficios.includes(beneficio)) {
      setProfileData(prev => ({
        ...prev,
        beneficios: [...prev.beneficios, beneficio]
      }));
    }
  };

  const removeBeneficio = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index)
    }));
  };

  const addJobBeneficio = (beneficio: string) => {
    if (beneficio && !newJobData.beneficios.includes(beneficio)) {
      setNewJobData(prev => ({
        ...prev,
        beneficios: [...prev.beneficios, beneficio]
      }));
    }
  };

  const removeJobBeneficio = (index: number) => {
    setNewJobData(prev => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index)
    }));
  };

  if (loadingProfile) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-isabel-blue" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Área da Empresa
                </h1>
                <p className="text-gray-600">
                  Bem-vindo, {empresa?.nome || "Empresa"}
                </p>
              </div>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="perfil">Perfil da Empresa</TabsTrigger>
              <TabsTrigger value="vagas">Minhas Vagas</TabsTrigger>
              <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
                    <Briefcase className="h-4 w-4 text-isabel-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Array.isArray(vagas) ? vagas.length : 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Vagas publicadas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Candidaturas</CardTitle>
                    <Users className="h-4 w-4 text-isabel-orange" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.values(candidaturasData).flat().length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Candidatos interessados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">75%</div>
                    <p className="text-xs text-muted-foreground">
                      Candidatos aprovados
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-isabel-blue rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nova candidatura recebida</p>
                        <p className="text-xs text-gray-500">João Silva se candidatou para Desenvolvedor React</p>
                      </div>
                      <span className="text-xs text-gray-400">2h atrás</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-isabel-orange rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Vaga publicada com sucesso</p>
                        <p className="text-xs text-gray-500">Analista de Marketing Digital está ativa</p>
                      </div>
                      <span className="text-xs text-gray-400">1 dia atrás</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Profile Tab */}
            <TabsContent value="perfil" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Informações da Empresa</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleProfileSave}
                        disabled={updateProfileMutation.isPending}
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfileMutation.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="basicos" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basicos">Dados Básicos</TabsTrigger>
                      <TabsTrigger value="endereco">Endereço</TabsTrigger>
                      <TabsTrigger value="institucional">Institucional</TabsTrigger>
                      <TabsTrigger value="cultura">Cultura</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basicos" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome da Empresa *</Label>
                          <Input
                            id="nome"
                            value={profileData.nome}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nome da empresa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                          <Input
                            id="nomeFantasia"
                            value={profileData.nomeFantasia}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nome fantasia"
                          />
                        </div>
                        <div>
                          <Label htmlFor="razaoSocial">Razão Social</Label>
                          <Input
                            id="razaoSocial"
                            value={profileData.razaoSocial}
                            onChange={(e) => setProfileData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Razão social"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cnpj">CNPJ</Label>
                          <Input
                            id="cnpj"
                            value={profileData.cnpj}
                            onChange={(e) => setProfileData(prev => ({ ...prev, cnpj: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="00.000.000/0000-00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                          <Input
                            id="inscricaoEstadual"
                            value={profileData.inscricaoEstadual}
                            onChange={(e) => setProfileData(prev => ({ ...prev, inscricaoEstadual: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Inscrição estadual"
                          />
                        </div>
                        <div>
                          <Label htmlFor="setor">Setor</Label>
                          <Select 
                            value={profileData.setor} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, setor: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o setor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tecnologia">Tecnologia</SelectItem>
                              <SelectItem value="financeiro">Financeiro</SelectItem>
                              <SelectItem value="saude">Saúde</SelectItem>
                              <SelectItem value="educacao">Educação</SelectItem>
                              <SelectItem value="industria">Indústria</SelectItem>
                              <SelectItem value="comercio">Comércio</SelectItem>
                              <SelectItem value="servicos">Serviços</SelectItem>
                              <SelectItem value="agronegocio">Agronegócio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="porte">Porte da Empresa</Label>
                          <Select 
                            value={profileData.porte} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, porte: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o porte" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mei">MEI</SelectItem>
                              <SelectItem value="micro">Microempresa</SelectItem>
                              <SelectItem value="pequena">Pequena</SelectItem>
                              <SelectItem value="media">Média</SelectItem>
                              <SelectItem value="grande">Grande</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="numeroFuncionarios">Número de Funcionários</Label>
                          <Select 
                            value={profileData.numeroFuncionarios} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, numeroFuncionarios: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a faixa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1 a 10 funcionários</SelectItem>
                              <SelectItem value="11-50">11 a 50 funcionários</SelectItem>
                              <SelectItem value="51-200">51 a 200 funcionários</SelectItem>
                              <SelectItem value="201-500">201 a 500 funcionários</SelectItem>
                              <SelectItem value="500+">Mais de 500 funcionários</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={profileData.telefone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="(48) 3000-0000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="celular">Celular</Label>
                          <Input
                            id="celular"
                            value={profileData.celular}
                            onChange={(e) => setProfileData(prev => ({ ...prev, celular: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="(48) 99999-9999"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anoFundacao">Ano de Fundação</Label>
                          <Input
                            id="anoFundacao"
                            value={profileData.anoFundacao}
                            onChange={(e) => setProfileData(prev => ({ ...prev, anoFundacao: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="2020"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="https://www.empresa.com.br"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={profileData.linkedin}
                            onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/company/empresa"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="endereco" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="endereco">Endereço</Label>
                          <Input
                            id="endereco"
                            value={profileData.endereco}
                            onChange={(e) => setProfileData(prev => ({ ...prev, endereco: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Rua, número, bairro"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            value={profileData.cep}
                            onChange={(e) => setProfileData(prev => ({ ...prev, cep: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="88000-000"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input
                            id="cidade"
                            value={profileData.cidade}
                            onChange={(e) => setProfileData(prev => ({ ...prev, cidade: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Florianópolis"
                          />
                        </div>
                        <div>
                          <Label htmlFor="estado">Estado</Label>
                          <Select 
                            value={profileData.estado} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, estado: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SC">Santa Catarina</SelectItem>
                              <SelectItem value="SP">São Paulo</SelectItem>
                              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                              <SelectItem value="PR">Paraná</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="institucional" className="space-y-4 mt-6">
                      <div>
                        <Label htmlFor="descricao">Descrição da Empresa</Label>
                        <Textarea
                          id="descricao"
                          value={profileData.descricao}
                          onChange={(e) => setProfileData(prev => ({ ...prev, descricao: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Descreva sua empresa, história e principais atividades..."
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="missao">Missão</Label>
                          <Textarea
                            id="missao"
                            value={profileData.missao}
                            onChange={(e) => setProfileData(prev => ({ ...prev, missao: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nossa missão é..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="visao">Visão</Label>
                          <Textarea
                            id="visao"
                            value={profileData.visao}
                            onChange={(e) => setProfileData(prev => ({ ...prev, visao: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nossa visão é..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="valores">Valores</Label>
                          <Textarea
                            id="valores"
                            value={profileData.valores}
                            onChange={(e) => setProfileData(prev => ({ ...prev, valores: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nossos valores são..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contato">Pessoa de Contato</Label>
                          <Input
                            id="contato"
                            value={profileData.contato}
                            onChange={(e) => setProfileData(prev => ({ ...prev, contato: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nome do responsável"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cargoContato">Cargo do Contato</Label>
                          <Input
                            id="cargoContato"
                            value={profileData.cargoContato}
                            onChange={(e) => setProfileData(prev => ({ ...prev, cargoContato: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Cargo na empresa"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cultura" className="space-y-4 mt-6">
                      <div>
                        <Label htmlFor="cultura">Cultura Organizacional</Label>
                        <Textarea
                          id="cultura"
                          value={profileData.cultura}
                          onChange={(e) => setProfileData(prev => ({ ...prev, cultura: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Descreva a cultura da sua empresa, ambiente de trabalho, práticas..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Benefícios Oferecidos</Label>
                        <div className="space-y-2">
                          {isEditing && (
                            <div className="flex space-x-2">
                              <Select onValueChange={addBeneficio}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Adicionar benefício" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Vale Refeição">Vale Refeição</SelectItem>
                                  <SelectItem value="Vale Transporte">Vale Transporte</SelectItem>
                                  <SelectItem value="Plano de Saúde">Plano de Saúde</SelectItem>
                                  <SelectItem value="Plano Odontológico">Plano Odontológico</SelectItem>
                                  <SelectItem value="Seguro de Vida">Seguro de Vida</SelectItem>
                                  <SelectItem value="Gympass">Gympass</SelectItem>
                                  <SelectItem value="Home Office">Home Office</SelectItem>
                                  <SelectItem value="Horário Flexível">Horário Flexível</SelectItem>
                                  <SelectItem value="Day Off Aniversário">Day Off Aniversário</SelectItem>
                                  <SelectItem value="Participação nos Lucros">Participação nos Lucros</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {profileData.beneficios.map((beneficio, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                <span>{beneficio}</span>
                                {isEditing && (
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => removeBeneficio(index)}
                                  />
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="vagas" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Minhas Vagas</h2>
                <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-isabel-blue hover:bg-isabel-blue/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Vaga
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Vaga</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <Tabs defaultValue="basico" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="basico">Informações Básicas</TabsTrigger>
                          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                          <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basico" className="space-y-4 mt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Label htmlFor="titulo">Título da Vaga *</Label>
                              <Input
                                id="titulo"
                                value={newJobData.titulo}
                                onChange={(e) => setNewJobData(prev => ({ ...prev, titulo: e.target.value }))}
                                placeholder="Ex: Desenvolvedor React Sênior"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="area">Área</Label>
                              <Select value={newJobData.area} onValueChange={(value) => setNewJobData(prev => ({ ...prev, area: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a área" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="vendas">Vendas</SelectItem>
                                  <SelectItem value="financeiro">Financeiro</SelectItem>
                                  <SelectItem value="rh">Recursos Humanos</SelectItem>
                                  <SelectItem value="operacoes">Operações</SelectItem>
                                  <SelectItem value="design">Design</SelectItem>
                                  <SelectItem value="juridico">Jurídico</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="nivel">Nível</Label>
                              <Select value={newJobData.nivel} onValueChange={(value) => setNewJobData(prev => ({ ...prev, nivel: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o nível" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="estagio">Estágio</SelectItem>
                                  <SelectItem value="junior">Júnior</SelectItem>
                                  <SelectItem value="pleno">Pleno</SelectItem>
                                  <SelectItem value="senior">Sênior</SelectItem>
                                  <SelectItem value="especialista">Especialista</SelectItem>
                                  <SelectItem value="coordenacao">Coordenação</SelectItem>
                                  <SelectItem value="gerencia">Gerência</SelectItem>
                                  <SelectItem value="diretoria">Diretoria</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                              <Select value={newJobData.tipoContrato} onValueChange={(value) => setNewJobData(prev => ({ ...prev, tipoContrato: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="clt">CLT</SelectItem>
                                  <SelectItem value="pj">PJ</SelectItem>
                                  <SelectItem value="estagio">Estágio</SelectItem>
                                  <SelectItem value="temporario">Temporário</SelectItem>
                                  <SelectItem value="terceirizado">Terceirizado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="modalidade">Modalidade</Label>
                              <Select value={newJobData.modalidade} onValueChange={(value) => setNewJobData(prev => ({ ...prev, modalidade: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a modalidade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="presencial">Presencial</SelectItem>
                                  <SelectItem value="remoto">Remoto</SelectItem>
                                  <SelectItem value="hibrido">Híbrido</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="cidade">Cidade</Label>
                              <Input
                                id="cidade"
                                value={newJobData.cidade}
                                onChange={(e) => setNewJobData(prev => ({ ...prev, cidade: e.target.value }))}
                                placeholder="Florianópolis"
                              />
                            </div>
                            <div>
                              <Label htmlFor="estado">Estado</Label>
                              <Select value={newJobData.estado} onValueChange={(value) => setNewJobData(prev => ({ ...prev, estado: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SC">Santa Catarina</SelectItem>
                                  <SelectItem value="SP">São Paulo</SelectItem>
                                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                  <SelectItem value="PR">Paraná</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="cargaHoraria">Carga Horária</Label>
                              <Input
                                id="cargaHoraria"
                                value={newJobData.cargaHoraria}
                                onChange={(e) => setNewJobData(prev => ({ ...prev, cargaHoraria: e.target.value }))}
                                placeholder="40h semanais"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="salario">Faixa Salarial</Label>
                              <Input
                                id="salario"
                                value={newJobData.salario}
                                onChange={(e) => setNewJobData(prev => ({ ...prev, salario: e.target.value }))}
                                placeholder="R$ 5.000 - R$ 8.000"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dataEncerramento">Data de Encerramento</Label>
                              <Input
                                id="dataEncerramento"
                                type="date"
                                value={newJobData.dataEncerramento}
                                onChange={(e) => setNewJobData(prev => ({ ...prev, dataEncerramento: e.target.value }))}
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="detalhes" className="space-y-4 mt-6">
                          <div>
                            <Label htmlFor="descricao">Descrição da Vaga *</Label>
                            <Textarea
                              id="descricao"
                              value={newJobData.descricao}
                              onChange={(e) => setNewJobData(prev => ({ ...prev, descricao: e.target.value }))}
                              placeholder="Descreva a vaga, contexto da empresa e oportunidade..."
                              rows={4}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="responsabilidades">Principais Responsabilidades</Label>
                            <Textarea
                              id="responsabilidades"
                              value={newJobData.responsabilidades}
                              onChange={(e) => setNewJobData(prev => ({ ...prev, responsabilidades: e.target.value }))}
                              placeholder="Liste as principais responsabilidades da posição..."
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="requisitos">Requisitos e Qualificações</Label>
                            <Textarea
                              id="requisitos"
                              value={newJobData.requisitos}
                              onChange={(e) => setNewJobData(prev => ({ ...prev, requisitos: e.target.value }))}
                              placeholder="Liste os requisitos necessários, experiência, habilidades..."
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="diferenciais">Diferenciais</Label>
                            <Textarea
                              id="diferenciais"
                              value={newJobData.diferenciais}
                              onChange={(e) => setNewJobData(prev => ({ ...prev, diferenciais: e.target.value }))}
                              placeholder="Requisitos que serão considerados diferenciais..."
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="beneficios" className="space-y-4 mt-6">
                          <div>
                            <Label>Benefícios da Vaga</Label>
                            <div className="space-y-2">
                              <div className="flex space-x-2">
                                <Select onValueChange={addJobBeneficio}>
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Adicionar benefício" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Vale Refeição">Vale Refeição</SelectItem>
                                    <SelectItem value="Vale Transporte">Vale Transporte</SelectItem>
                                    <SelectItem value="Plano de Saúde">Plano de Saúde</SelectItem>
                                    <SelectItem value="Plano Odontológico">Plano Odontológico</SelectItem>
                                    <SelectItem value="Seguro de Vida">Seguro de Vida</SelectItem>
                                    <SelectItem value="Gympass">Gympass</SelectItem>
                                    <SelectItem value="Home Office">Home Office</SelectItem>
                                    <SelectItem value="Horário Flexível">Horário Flexível</SelectItem>
                                    <SelectItem value="Day Off Aniversário">Day Off Aniversário</SelectItem>
                                    <SelectItem value="Participação nos Lucros">Participação nos Lucros</SelectItem>
                                    <SelectItem value="Auxílio Educação">Auxílio Educação</SelectItem>
                                    <SelectItem value="Licença Maternidade/Paternidade Estendida">Licença Maternidade/Paternidade Estendida</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {newJobData.beneficios.map((beneficio, index) => (
                                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                    <span>{beneficio}</span>
                                    <X 
                                      className="h-3 w-3 cursor-pointer" 
                                      onClick={() => removeJobBeneficio(index)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowJobModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleJobCreate}
                          disabled={createJobMutation.isPending}
                          className="bg-isabel-blue hover:bg-isabel-blue/90"
                        >
                          {createJobMutation.isPending ? "Criando..." : "Criar Vaga"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {loadingVagas ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(vagas) && vagas.length > 0 ? (
                    vagas.map((vaga: Vaga) => (
                      <Card key={vaga.id} className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-semibold">{vaga.titulo}</h3>
                              <Badge variant="secondary">{vaga.status || "ativa"}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{vaga.cidade}, {vaga.estado}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Briefcase className="h-4 w-4" />
                                <span>{vaga.modalidade}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Publicado em {new Date(vaga.publicadoEm).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4 line-clamp-2">{vaga.descricao}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="font-medium">Candidaturas: {candidaturasData[vaga.id]?.length || 0}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">Salário: {vaga.salario || "A combinar"}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedVaga(vaga);
                                setShowCandidateModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Candidatos
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleJobDelete(vaga.id)}
                              disabled={deleteJobMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma vaga publicada</h3>
                      <p className="text-gray-600 mb-4">
                        Crie sua primeira vaga para começar a atrair candidatos qualificados.
                      </p>
                      <Button 
                        onClick={() => setShowJobModal(true)}
                        className="bg-isabel-blue hover:bg-isabel-blue/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeira Vaga
                      </Button>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Candidates Tab */}
            <TabsContent value="candidatos" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestão de Candidatos</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pipeline de Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-blue-800">Candidatados</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <div className="text-sm text-yellow-800">Em Triagem</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-purple-800">Entrevista</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-green-800">Aprovados</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">4</div>
                      <div className="text-sm text-red-800">Reprovados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Candidatos por Vaga</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(vagas) && vagas.length > 0 ? (
                      vagas.map((vaga: Vaga) => (
                        <div key={vaga.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{vaga.titulo}</h4>
                            <Badge variant="outline">
                              {candidaturasData[vaga.id]?.length || 0} candidatos
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedVaga(vaga);
                                setShowCandidateModal(true);
                              }}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Ver Candidatos
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Baixar CVs
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Publique vagas para visualizar candidatos</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Candidate Management Modal */}
          <Dialog open={showCandidateModal} onOpenChange={setShowCandidateModal}>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Candidatos - {selectedVaga?.titulo}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Todos os CVs
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar E-mail em Lote
                    </Button>
                  </div>
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="candidatado">Candidatado</SelectItem>
                      <SelectItem value="triagem">Em Triagem</SelectItem>
                      <SelectItem value="entrevista">Entrevista</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="reprovado">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {/* Mock candidate data for demonstration */}
                  {[
                    { 
                      nome: "João Silva", 
                      email: "joao@email.com", 
                      telefone: "(48) 99999-9999",
                      status: "candidatado",
                      pontuacao: 8.5,
                      dataCandidatura: "2024-06-25"
                    },
                    { 
                      nome: "Maria Santos", 
                      email: "maria@email.com", 
                      telefone: "(48) 88888-8888",
                      status: "triagem",
                      pontuacao: 9.2,
                      dataCandidatura: "2024-06-24"
                    },
                    { 
                      nome: "Pedro Costa", 
                      email: "pedro@email.com", 
                      telefone: "(48) 77777-7777",
                      status: "entrevista",
                      pontuacao: 7.8,
                      dataCandidatura: "2024-06-23"
                    }
                  ].map((candidato, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium">{candidato.nome}</h4>
                            <Badge 
                              variant={
                                candidato.status === "aprovado" ? "default" :
                                candidato.status === "reprovado" ? "destructive" :
                                candidato.status === "entrevista" ? "secondary" :
                                "outline"
                              }
                            >
                              {candidato.status}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{candidato.pontuacao}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>{candidato.email}</span>
                            <span>{candidato.telefone}</span>
                            <span>Candidatou-se em {new Date(candidato.dataCandidatura).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar CV
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Mensagem
                          </Button>
                          <Select defaultValue={candidato.status}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="candidatado">Candidatado</SelectItem>
                              <SelectItem value="triagem">Triagem</SelectItem>
                              <SelectItem value="entrevista">Entrevista</SelectItem>
                              <SelectItem value="aprovado">Aprovado</SelectItem>
                              <SelectItem value="reprovado">Reprovado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}