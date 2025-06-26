import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  User, 
  Briefcase, 
  FileText, 
  Clock, 
  MapPin, 
  Building,
  Send,
  Edit,
  Eye,
  Calendar,
  LogOut,
  Upload,
  Star,
  Award,
  BookOpen,
  Languages,
  Cake,
  Phone,
  Mail,
  MapPinIcon,
  Camera,
  Save,
  X,
  Plus,
  Trash2,
  Brain
} from "lucide-react";
import type { Candidato, Vaga, Candidatura } from "@shared/schema";
import TesteDISC from "@/components/TesteDISC";

export default function AreaCandidato() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRetakeTest, setShowRetakeTest] = useState(false);
  
  useEffect(() => {
    if (!user || user.usuario.tipo !== "candidato") {
      setLocation("/login");
    }
  }, [setLocation]);
  
  const handleLogout = () => {
    logout();
    toast({ title: "Logout realizado com sucesso!" });
    setLocation("/");
  };

  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    telefone: "",
    celular: "",
    linkedin: "",
    github: "",
    portfolio: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    dataNascimento: "",
    genero: "",
    pcd: "",
    nivelEscolaridade: "",
    curso: "",
    instituicao: "",
    anoFormacao: "",
    idiomas: [] as string[],
    habilidades: [] as string[],
    experiencias: "",
    certificacoes: "",
    objetivoProfissional: "",
    pretensaoSalarial: "",
    disponibilidade: "",
    modalidadeTrabalho: "",
    curriculoUrl: "",
    areasInteresse: [] as string[],
    fotoPerfil: "",
  });

  // Fetch candidate profile
  const { data: candidato, isLoading: loadingProfile } = useQuery<Candidato>({
    queryKey: [`/api/candidatos/${user?.usuario?.id}`],
    enabled: !!user?.usuario?.id,
  });

  // Fetch available jobs
  const { data: vagas = [], isLoading: loadingVagas } = useQuery({
    queryKey: ['/api/vagas'],
    enabled: !!user?.usuario?.id,
  });

  // Fetch my applications
  const { data: candidaturas = [], isLoading: loadingCandidaturas } = useQuery({
    queryKey: [`/api/candidaturas/candidato/${user?.usuario?.id}`],
    enabled: !!user?.usuario?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Candidato>) => {
      return await apiRequest("PUT", `/api/candidatos/${user?.usuario?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/candidatos/${user?.usuario?.id}`] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
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

  // Apply to job mutation
  const applyJobMutation = useMutation({
    mutationFn: async (vagaId: string) => {
      return await apiRequest("POST", "/api/candidaturas", {
        vagaId,
        candidatoId: user?.usuario.id || '',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/candidaturas/candidato/${user?.usuario.id || ''}`] });
      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi enviada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar candidatura",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Load profile data when candidato is loaded
  useEffect(() => {
    if (candidato) {
      setProfileData({
        nome: candidato.nome || "",
        email: user?.usuario?.email || "",
        telefone: candidato.telefone || "",
        celular: candidato.celular || "",
        linkedin: candidato.linkedin || "",
        github: candidato.github || "",
        portfolio: candidato.portfolio || "",
        endereco: candidato.endereco || "",
        cidade: candidato.cidade || "",
        estado: candidato.estado || "",
        cep: candidato.cep || "",
        dataNascimento: candidato.dataNascimento || "",
        genero: candidato.genero || "",
        pcd: candidato.pcd || "",
        nivelEscolaridade: candidato.nivelEscolaridade || "",
        curso: candidato.curso || "",
        instituicao: candidato.instituicao || "",
        anoFormacao: candidato.anoFormacao || "",
        idiomas: candidato.idiomas || [],
        habilidades: candidato.habilidades || [],
        experiencias: candidato.experiencias || "",
        certificacoes: candidato.certificacoes || "",
        objetivoProfissional: candidato.objetivoProfissional || "",
        pretensaoSalarial: candidato.pretensaoSalarial || "",
        disponibilidade: candidato.disponibilidade || "",
        modalidadeTrabalho: candidato.modalidadeTrabalho || "",
        curriculoUrl: candidato.curriculoUrl || "",
        areasInteresse: candidato.areasInteresse || [],
        fotoPerfil: candidato.fotoPerfil || "",
      });
    }
  }, [candidato, user]);

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  // Verifica se o perfil está completo
  const isProfileComplete = () => {
    return profileData.nome && 
           profileData.telefone && 
           profileData.cidade && 
           profileData.estado && 
           profileData.experiencias &&
           profileData.objetivoProfissional &&
           profileData.nivelEscolaridade;
  };

  const handleJobApply = (vagaId: string) => {
    if (!isProfileComplete()) {
      toast({
        title: "Perfil incompleto",
        description: "Por favor, complete seu perfil antes de se candidatar às vagas.",
        variant: "destructive",
      });
      setActiveTab("perfil");
      return;
    }
    
    if (isAlreadyApplied(vagaId)) {
      toast({
        title: "Já candidatado",
        description: "Você já se candidatou para esta vaga.",
        variant: "destructive",
      });
      return;
    }
    applyJobMutation.mutate(vagaId);
  };

  const isAlreadyApplied = (vagaId: string) => {
    return Array.isArray(candidaturas) && candidaturas.some((c: Candidatura) => c.vagaId === vagaId);
  };

  const addHabilidade = (habilidade: string) => {
    if (habilidade && !profileData.habilidades.includes(habilidade)) {
      setProfileData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, habilidade]
      }));
    }
  };

  const removeHabilidade = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index)
    }));
  };

  const addIdioma = (idioma: string) => {
    if (idioma && !profileData.idiomas.includes(idioma)) {
      setProfileData(prev => ({
        ...prev,
        idiomas: [...prev.idiomas, idioma]
      }));
    }
  };

  const removeIdioma = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      idiomas: prev.idiomas.filter((_, i) => i !== index)
    }));
  };

  const addAreaInteresse = (area: string) => {
    if (area && !profileData.areasInteresse.includes(area)) {
      setProfileData(prev => ({
        ...prev,
        areasInteresse: [...prev.areasInteresse, area]
      }));
    }
  };

  const removeAreaInteresse = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      areasInteresse: prev.areasInteresse.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'curriculo') => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a cloud storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'foto') {
          setProfileData(prev => ({ ...prev, fotoPerfil: result }));
        } else {
          setProfileData(prev => ({ ...prev, curriculoUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
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
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profileData.fotoPerfil} alt={profileData.nome} />
                  <AvatarFallback className="bg-isabel-orange text-white text-lg">
                    {profileData.nome ? profileData.nome.charAt(0).toUpperCase() : 'C'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-isabel-blue text-white rounded-full p-1 cursor-pointer hover:bg-isabel-blue/80">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'foto')}
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Área do Candidato
                </h1>
                <p className="text-gray-600">
                  Bem-vindo(a), {profileData.nome || user?.usuario?.email}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
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
              <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
              <TabsTrigger value="vagas">Vagas Disponíveis</TabsTrigger>
              <TabsTrigger value="disc">Teste DISC</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Candidaturas Enviadas</CardTitle>
                    <Send className="h-4 w-4 text-isabel-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Array.isArray(candidaturas) ? candidaturas.length : 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de candidaturas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vagas Disponíveis</CardTitle>
                    <Briefcase className="h-4 w-4 text-isabel-orange" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Array.isArray(vagas) ? vagas.length : 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Oportunidades ativas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Perfil Completo</CardTitle>
                    <User className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">
                      Completude do perfil
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Candidaturas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(candidaturas) && candidaturas.length > 0 ? (
                      candidaturas.slice(0, 5).map((candidatura: Candidatura) => {
                        const vaga = Array.isArray(vagas) ? vagas.find((v: Vaga) => v.id === candidatura.vagaId) : null;
                        return (
                          <div key={candidatura.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{vaga?.titulo || "Vaga não encontrada"}</h4>
                              <p className="text-sm text-gray-600">
                                Candidatado em {new Date(candidatura.dataCandidatura).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {candidatura.status || "Pendente"}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhuma candidatura enviada ainda</p>
                        <Button 
                          onClick={() => setActiveTab("vagas")}
                          className="mt-4 bg-isabel-blue hover:bg-isabel-blue/90"
                        >
                          Ver Vagas Disponíveis
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="perfil" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Meu Perfil</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
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
                  <Tabs defaultValue="pessoais" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="pessoais">Pessoais</TabsTrigger>
                      <TabsTrigger value="endereco">Endereço</TabsTrigger>
                      <TabsTrigger value="formacao">Formação</TabsTrigger>
                      <TabsTrigger value="experiencia">Experiência</TabsTrigger>
                      <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
                      <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pessoais" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome Completo *</Label>
                          <Input
                            id="nome"
                            value={profileData.nome}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            value={profileData.email}
                            disabled={true}
                            placeholder="seu@email.com"
                          />
                        </div>
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
                          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                          <Input
                            id="dataNascimento"
                            type="date"
                            value={profileData.dataNascimento}
                            onChange={(e) => setProfileData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="genero">Gênero</Label>
                          <Select 
                            value={profileData.genero} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, genero: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                              <SelectItem value="nao_informar">Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="pcd">Pessoa com Deficiência</Label>
                          <Select 
                            value={profileData.pcd} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, pcd: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nao">Não</SelectItem>
                              <SelectItem value="sim">Sim</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={profileData.linkedin}
                            onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="linkedin.com/in/seu-perfil"
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={profileData.github}
                            onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="github.com/seu-usuario"
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio">Portfólio</Label>
                          <Input
                            id="portfolio"
                            value={profileData.portfolio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, portfolio: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="www.seuportfolio.com"
                          />
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div>
                          <Label>Currículo (PDF)</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, 'curriculo')}
                              className="flex-1"
                            />
                            <Upload className="h-4 w-4 text-gray-400" />
                          </div>
                          {profileData.curriculoUrl && (
                            <p className="text-sm text-green-600 mt-1">Currículo carregado com sucesso</p>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="endereco" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </TabsContent>

                    <TabsContent value="formacao" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nivelEscolaridade">Nível de Escolaridade</Label>
                          <Select 
                            value={profileData.nivelEscolaridade} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, nivelEscolaridade: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ensino_medio">Ensino Médio</SelectItem>
                              <SelectItem value="ensino_tecnico">Ensino Técnico</SelectItem>
                              <SelectItem value="ensino_superior">Ensino Superior</SelectItem>
                              <SelectItem value="pos_graduacao">Pós-Graduação</SelectItem>
                              <SelectItem value="mestrado">Mestrado</SelectItem>
                              <SelectItem value="doutorado">Doutorado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="curso">Curso</Label>
                          <Input
                            id="curso"
                            value={profileData.curso}
                            onChange={(e) => setProfileData(prev => ({ ...prev, curso: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nome do curso"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instituicao">Instituição</Label>
                          <Input
                            id="instituicao"
                            value={profileData.instituicao}
                            onChange={(e) => setProfileData(prev => ({ ...prev, instituicao: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Nome da instituição"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anoFormacao">Ano de Formação</Label>
                          <Input
                            id="anoFormacao"
                            value={profileData.anoFormacao}
                            onChange={(e) => setProfileData(prev => ({ ...prev, anoFormacao: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="2024"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="certificacoes">Certificações</Label>
                        <Textarea
                          id="certificacoes"
                          value={profileData.certificacoes}
                          onChange={(e) => setProfileData(prev => ({ ...prev, certificacoes: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Liste suas certificações, cursos complementares..."
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="experiencia" className="space-y-4 mt-6">
                      <div>
                        <Label htmlFor="experiencias">Experiência Profissional</Label>
                        <Textarea
                          id="experiencias"
                          value={profileData.experiencias}
                          onChange={(e) => setProfileData(prev => ({ ...prev, experiencias: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Descreva sua experiência profissional, cargos ocupados, principais responsabilidades..."
                          rows={6}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="habilidades" className="space-y-4 mt-6">
                      <div>
                        <Label>Habilidades Técnicas</Label>
                        <div className="space-y-2">
                          {isEditing && (
                            <div className="flex space-x-2">
                              <Select onValueChange={addHabilidade}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Adicionar habilidade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                                  <SelectItem value="Python">Python</SelectItem>
                                  <SelectItem value="React">React</SelectItem>
                                  <SelectItem value="Node.js">Node.js</SelectItem>
                                  <SelectItem value="SQL">SQL</SelectItem>
                                  <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                                  <SelectItem value="Excel Avançado">Excel Avançado</SelectItem>
                                  <SelectItem value="Adobe Photoshop">Adobe Photoshop</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {profileData.habilidades.map((habilidade, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                <span>{habilidade}</span>
                                {isEditing && (
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => removeHabilidade(index)}
                                  />
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Idiomas</Label>
                        <div className="space-y-2">
                          {isEditing && (
                            <div className="flex space-x-2">
                              <Select onValueChange={addIdioma}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Adicionar idioma" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Inglês - Básico">Inglês - Básico</SelectItem>
                                  <SelectItem value="Inglês - Intermediário">Inglês - Intermediário</SelectItem>
                                  <SelectItem value="Inglês - Avançado">Inglês - Avançado</SelectItem>
                                  <SelectItem value="Inglês - Fluente">Inglês - Fluente</SelectItem>
                                  <SelectItem value="Espanhol - Básico">Espanhol - Básico</SelectItem>
                                  <SelectItem value="Espanhol - Intermediário">Espanhol - Intermediário</SelectItem>
                                  <SelectItem value="Espanhol - Avançado">Espanhol - Avançado</SelectItem>
                                  <SelectItem value="Francês - Básico">Francês - Básico</SelectItem>
                                  <SelectItem value="Alemão - Básico">Alemão - Básico</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {profileData.idiomas.map((idioma, index) => (
                              <Badge key={index} variant="outline" className="flex items-center space-x-1">
                                <span>{idioma}</span>
                                {isEditing && (
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => removeIdioma(index)}
                                  />
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="objetivos" className="space-y-4 mt-6">
                      <div>
                        <Label htmlFor="objetivoProfissional">Objetivo Profissional</Label>
                        <Textarea
                          id="objetivoProfissional"
                          value={profileData.objetivoProfissional}
                          onChange={(e) => setProfileData(prev => ({ ...prev, objetivoProfissional: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Descreva seus objetivos profissionais, carreira desejada..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="pretensaoSalarial">Pretensão Salarial</Label>
                          <Input
                            id="pretensaoSalarial"
                            value={profileData.pretensaoSalarial}
                            onChange={(e) => setProfileData(prev => ({ ...prev, pretensaoSalarial: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="R$ 5.000 - R$ 8.000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="disponibilidade">Disponibilidade</Label>
                          <Select 
                            value={profileData.disponibilidade} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, disponibilidade: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="imediata">Imediata</SelectItem>
                              <SelectItem value="15_dias">15 dias</SelectItem>
                              <SelectItem value="30_dias">30 dias</SelectItem>
                              <SelectItem value="60_dias">60 dias</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="modalidadeTrabalho">Modalidade de Trabalho</Label>
                          <Select 
                            value={profileData.modalidadeTrabalho} 
                            onValueChange={(value) => setProfileData(prev => ({ ...prev, modalidadeTrabalho: value }))}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="presencial">Presencial</SelectItem>
                              <SelectItem value="remoto">Remoto</SelectItem>
                              <SelectItem value="hibrido">Híbrido</SelectItem>
                              <SelectItem value="qualquer">Qualquer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Áreas de Interesse</Label>
                        <div className="space-y-2">
                          {isEditing && (
                            <div className="flex space-x-2">
                              <Select onValueChange={addAreaInteresse}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Adicionar área de interesse" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                                  <SelectItem value="Marketing">Marketing</SelectItem>
                                  <SelectItem value="Vendas">Vendas</SelectItem>
                                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                                  <SelectItem value="Design">Design</SelectItem>
                                  <SelectItem value="Educação">Educação</SelectItem>
                                  <SelectItem value="Saúde">Saúde</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {profileData.areasInteresse.map((area, index) => (
                              <Badge key={index} variant="default" className="flex items-center space-x-1">
                                <span>{area}</span>
                                {isEditing && (
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => removeAreaInteresse(index)}
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
                    <Star className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Perfil incompleto</p>
                      <p className="text-sm text-amber-700">Complete seu perfil para se candidatar às vagas.</p>
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
                <h2 className="text-2xl font-bold">Vagas Disponíveis</h2>
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
                            <h3 className="text-xl font-semibold mb-2">{vaga.titulo}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <Building className="h-4 w-4" />
                                <span>Empresa</span>
                              </div>
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
                              <span className="font-medium">Salário: {vaga.salario || "A combinar"}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">Nível: {vaga.nivel}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                            <Button 
                              onClick={() => handleJobApply(vaga.id)}
                              disabled={isAlreadyApplied(vaga.id) || applyJobMutation.isPending}
                              className={isAlreadyApplied(vaga.id) ? "" : "bg-isabel-blue hover:bg-isabel-blue/90"}
                              variant={isAlreadyApplied(vaga.id) ? "outline" : "default"}
                              size="sm"
                            >
                              {isAlreadyApplied(vaga.id) ? (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Já Candidatado
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  {applyJobMutation.isPending ? "Enviando..." : "Candidatar-se"}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma vaga disponível</h3>
                      <p className="text-gray-600">
                        Não há vagas disponíveis no momento. Volte em breve para conferir novas oportunidades.
                      </p>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* DISC Test Tab */}
            <TabsContent value="disc" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Avaliação de Perfil Comportamental DISC
                  </h2>
                  <p className="text-gray-600">
                    Descubra seu perfil comportamental e aumente suas chances de encontrar a vaga ideal
                  </p>
                </div>
                
                {candidato?.perfilDisc && !showRetakeTest ? (
                  <Card className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Brain className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="text-lg font-semibold">Teste já realizado</h3>
                        <p className="text-gray-600">
                          Seu perfil: <span className="font-semibold">{candidato.perfilDisc}</span>
                        </p>
                        {candidato.dataTesteDISC && (
                          <p className="text-sm text-gray-500">
                            Realizado em: {new Date(candidato.dataTesteDISC).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => setActiveTab("perfil")}
                        variant="outline"
                        className="w-full"
                      >
                        Ver detalhes do perfil
                      </Button>
                      <Button 
                        onClick={() => setShowRetakeTest(true)}
                        variant="secondary"
                        className="w-full"
                      >
                        Refazer o teste
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <TesteDISC 
                    candidatoId={user?.usuario?.id || ''} 
                    onTesteConcluido={() => {
                      queryClient.invalidateQueries({ 
                        queryKey: [`/api/candidatos/${user?.usuario?.id}`] 
                      });
                      setShowRetakeTest(false);
                    }}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}