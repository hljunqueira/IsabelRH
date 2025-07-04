import { useState, useEffect, useRef } from "react";
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
  TrendingUp,
  AlertCircle,
  Trophy,
  Zap,
  FileText,
  BarChart3
} from "lucide-react";
import type { Empresa, Vaga, Candidatura, Candidato } from "@shared/schema";
import Layout from "@/components/Layout";
import TalentosCompativeis from "@/components/TalentosCompativeis";
import ChatComponent, { ChatComponentRef } from "@/components/ChatComponent";

export default function AreaEmpresa() {
  console.log('🏢 AreaEmpresa: Componente iniciado');
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  console.log('🏢 AreaEmpresa: user =', user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const chatRef = useRef<ChatComponentRef>(null);
  
  const handleLogout = () => {
    logout();
    toast({ title: "Logout realizado com sucesso!" });
    setLocation("/");
  };

  useEffect(() => {
    if (!user || user.type !== "empresa") {
      setLocation("/login");
    }
  }, [user, setLocation]);

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
  const { data: empresa, isLoading: loadingProfile } = useQuery<Empresa>({
    queryKey: [`/api/empresas/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch company jobs
  const { data: vagas = [], isLoading: loadingVagas } = useQuery({
    queryKey: [`/api/vagas/empresa/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch applications for each job
  const { data: candidaturasData = {} } = useQuery({
    queryKey: ['/api/candidaturas/empresa', user?.id],
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Empresa>) => {
      return await apiRequest("PUT", `/api/empresas/${user?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/empresas/${user?.id}`] });
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
      if (!user?.id) {
        throw new Error("Usuário não identificado");
      }
      return await apiRequest("POST", "/api/vagas", { 
        ...data, 
        empresaId: user.id 
      });
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/vagas/empresa/${user.id}`] });
      }
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
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/vagas/empresa/${user.id}`] });
      }
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

  // Verifica se o perfil está completo
  const isProfileComplete = () => {
    return profileData.nome && 
           profileData.telefone && 
           profileData.cidade && 
           profileData.estado && 
           profileData.endereco &&
           profileData.descricao;
  };

  const handleJobCreate = () => {
    if (!isProfileComplete()) {
      toast({
        title: "Perfil incompleto",
        description: "Por favor, complete seu perfil empresarial antes de publicar vagas.",
        variant: "destructive",
      });
      setActiveTab("perfil");
      return;
    }
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
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-isabel-blue" />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Área da Empresa
                </h1>
                <p className="text-sm sm:text-base text-gray-600 truncate max-w-[200px] sm:max-w-none">
                  Bem-vindo, {empresa?.nome || "Empresa"}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto flex items-center space-x-2 justify-center"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex whitespace-nowrap gap-2 px-1">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="perfil" className="text-xs sm:text-sm">Perfil</TabsTrigger>
              <TabsTrigger value="vagas" className="text-xs sm:text-sm">Vagas</TabsTrigger>
              <TabsTrigger value="candidatos" className="text-xs sm:text-sm">Candidatos</TabsTrigger>
              <TabsTrigger value="ranking" className="text-xs sm:text-sm">Ranking</TabsTrigger>
              <TabsTrigger value="triagem" className="text-xs sm:text-sm">Triagem</TabsTrigger>
              <TabsTrigger value="parsing" className="text-xs sm:text-sm">Parsing</TabsTrigger>
              <TabsTrigger value="relatorios" className="text-xs sm:text-sm">Relatórios</TabsTrigger>
              <TabsTrigger value="chat" className="text-xs sm:text-sm">💬 Chat</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">
                      Aguardando dados
                    </p>
                  </CardContent>
                </Card>
              </div>


            </TabsContent>

            {/* Company Profile Tab */}
            <TabsContent value="perfil" className="space-y-6">
              <Card className="p-3 sm:p-4 text-sm sm:text-base">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="sm:col-span-2">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
              {!isProfileComplete() && (
                <Card className="bg-amber-50 border-amber-300 p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Perfil incompleto</p>
                      <p className="text-sm text-amber-700">Complete seu perfil empresarial para publicar vagas.</p>
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="text-amber-700 underline p-0 h-auto"
                        onClick={() => setActiveTab("perfil")}
                      >
                        Completar perfil agora
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Minhas Vagas</h2>
                <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-isabel-blue hover:bg-isabel-blue/90"
                      disabled={!isProfileComplete()}
                    >
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
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

                          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      <Card key={vaga.id} className="p-3 sm:p-4 text-sm sm:text-base">
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
                        onClick={() => {
                          if (!isProfileComplete()) {
                            toast({
                              title: "Perfil incompleto",
                              description: "Por favor, complete seu perfil empresarial antes de publicar vagas.",
                              variant: "destructive",
                            });
                            setActiveTab("perfil");
                            return;
                          }
                          setShowJobModal(true);
                        }}
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
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Publique vagas para visualizar o pipeline de candidatos</p>
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

            {/* Ranking Inteligente Tab */}
            <TabsContent value="ranking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Ranking Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Sistema de Ranking Inteligente</h3>
                    <p className="text-gray-600 mb-6">
                      Avalie candidatos com base em múltiplos critérios: DISC, habilidades, experiência e localização.
                    </p>
                    <Button 
                      onClick={() => setLocation("/empresa/ranking")}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      Acessar Ranking Inteligente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Triagem Automática Tab */}
            <TabsContent value="triagem" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Triagem Automática
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Zap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Triagem Automática</h3>
                    <p className="text-gray-600 mb-6">
                      Configure filtros inteligentes e ações automáticas para triar candidatos de forma eficiente.
                    </p>
                    <Button 
                      onClick={() => setLocation("/empresa/triagem")}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Acessar Triagem Automática
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parsing de Currículos Tab */}
            <TabsContent value="parsing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    Parsing de Currículos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Parsing de Currículos</h3>
                    <p className="text-gray-600 mb-6">
                      Extraia automaticamente dados de currículos enviados e visualize informações estruturadas.
                    </p>
                    <Button 
                      onClick={() => setLocation("/empresa/parsing")}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Acessar Parsing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Relatórios Tab */}
            <TabsContent value="relatorios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Relatórios & Dashboards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Relatórios & Dashboards</h3>
                    <p className="text-gray-600 mb-6">
                      Visualize KPIs de recrutamento, gráficos de desempenho e relatórios detalhados.
                    </p>
                    <Button 
                      onClick={() => setLocation("/empresa/relatorios")}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Acessar Relatórios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Central de Mensagens
                </h2>
                <p className="text-gray-600">
                  Converse diretamente com candidatos sobre suas candidaturas e processos seletivos
                </p>
              </div>

              {user?.id ? (
                <div className="bg-white rounded-lg shadow">
                  <ChatComponent 
                    ref={chatRef}
                    userId={user.id} 
                    userType="empresa"
                  />
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chat indisponível</h3>
                  <p className="text-gray-600">
                    Faça login para acessar suas conversas
                  </p>
                </Card>
              )}
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
              
              <Tabs defaultValue="aplicados" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="aplicados">Candidatos Aplicados</TabsTrigger>
                  <TabsTrigger value="banco-talentos">Banco de Talentos Compatíveis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="aplicados" className="space-y-4">
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

                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum candidato encontrado para esta vaga</p>
                </div>
                </TabsContent>
                
                <TabsContent value="banco-talentos" className="space-y-4">
                  <TalentosCompativeis vagaArea={selectedVaga?.area} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}