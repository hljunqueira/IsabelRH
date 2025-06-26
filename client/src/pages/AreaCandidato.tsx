import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  Settings,
  Upload,
  Star,
  Award,
  BookOpen,
  Languages,
  Cake,
  Phone,
  Mail,
  MapPinIcon
} from "lucide-react";
import type { Candidato, Vaga, Candidatura } from "@shared/schema";

export default function AreaCandidato() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
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
      if (userData.usuario.tipo !== "candidato") {
        setLocation("/login");
        return;
      }
      setUser(userData);
    } catch (error) {
      setLocation("/login");
    }
  }, [setLocation]);

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
    estadoCivil: "",
    genero: "",
    pcd: "não",
    nivelEscolaridade: "",
    curso: "",
    instituicao: "",
    anoFormacao: "",
    idiomas: [] as string[],
    habilidades: [] as string[],
    experiencias: [] as any[],
    certificacoes: [] as any[],
    objetivoProfissional: "",
    pretensaoSalarial: "",
    disponibilidade: "",
    modalidadeTrabalho: "",
    areasInteresse: [] as string[],
    curriculoUrl: "",
  });

  // Fetch candidate profile
  const { data: candidato, isLoading: loadingProfile } = useQuery({
    queryKey: [`/api/candidatos/${user?.usuario?.id}`],
    enabled: !!user?.usuario?.id,
  });

  // Fetch available jobs
  const { data: vagas = [], isLoading: loadingVagas } = useQuery({
    queryKey: ["/api/vagas"],
  });

  // Fetch user applications
  const { data: candidaturas = [], isLoading: loadingCandidaturas } = useQuery({
    queryKey: [`/api/candidaturas/candidato/${user?.usuario?.id}`],
    enabled: !!user?.usuario?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<Candidato>) => {
      return await apiRequest("PUT", `/api/candidatos/${user.usuario.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/candidatos/${user.usuario.id}`] });
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
  const applyToJobMutation = useMutation({
    mutationFn: async (vagaId: string) => {
      return await apiRequest("POST", "/api/candidaturas", {
        vagaId,
        candidatoId: user.usuario.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/candidaturas/candidato/${user.usuario.id}`] });
      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi registrada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na candidatura",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Update profile data when candidato is loaded
  useEffect(() => {
    if (candidato) {
      setProfileData({
        nome: candidato.nome || "",
        telefone: candidato.telefone || "",
        linkedin: candidato.linkedin || "",
        areasInteresse: candidato.areasInteresse || [],
      });
    }
  }, [candidato]);

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleApplyToJob = (vagaId: string) => {
    applyToJobMutation.mutate(vagaId);
  };

  const isAlreadyApplied = (vagaId: string) => {
    return candidaturas.some((c: Candidatura) => c.vagaId === vagaId);
  };

  const addAreaInteresse = (area: string) => {
    if (area && !profileData.areasInteresse.includes(area)) {
      setProfileData(prev => ({
        ...prev,
        areasInteresse: [...prev.areasInteresse, area]
      }));
    }
  };

  const removeAreaInteresse = (area: string) => {
    setProfileData(prev => ({
      ...prev,
      areasInteresse: prev.areasInteresse.filter(a => a !== area)
    }));
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-isabel-accent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-isabel-blue">Área do Candidato</h1>
                <p className="text-gray-600 mt-2">
                  Bem-vindo(a), {candidato?.nome || user.usuario.email}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setLocation("/candidato/perfil")}
                  variant="outline"
                  className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Perfil Completo
                </Button>
                
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
                
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center">
                  <User className="text-white h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
              <TabsTrigger value="vagas">Vagas Disponíveis</TabsTrigger>
              <TabsTrigger value="candidaturas">Minhas Candidaturas</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="perfil">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-isabel-blue">Informações do Perfil</CardTitle>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                      className={isEditing ? "" : "bg-isabel-orange hover:bg-isabel-orange/90"}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loadingProfile ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input
                            id="nome"
                            value={profileData.nome}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Digite seu nome completo"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={profileData.telefone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="(48) 99999-9999"
                          />
                        </div>
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
                        <Label>Áreas de Interesse</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profileData.areasInteresse.map((area, index) => (
                            <Badge 
                              key={index}
                              variant="secondary"
                              className="bg-isabel-orange/10 text-isabel-orange"
                            >
                              {area}
                              {isEditing && (
                                <button
                                  onClick={() => removeAreaInteresse(area)}
                                  className="ml-2 text-isabel-orange hover:text-red-500"
                                >
                                  ×
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="mt-3 flex gap-2">
                            <Input
                              placeholder="Digite uma área de interesse"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addAreaInteresse(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                                if (input?.value) {
                                  addAreaInteresse(input.value);
                                  input.value = '';
                                }
                              }}
                            >
                              Adicionar
                            </Button>
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex gap-4">
                          <Button
                            onClick={handleProfileSave}
                            disabled={updateProfileMutation.isPending}
                            className="bg-isabel-blue hover:bg-isabel-blue/90"
                          >
                            {updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Available Jobs Tab */}
            <TabsContent value="vagas">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-isabel-blue">Vagas Disponíveis</h2>
                  <Badge variant="outline" className="text-isabel-orange border-isabel-orange">
                    {vagas.length} vagas encontradas
                  </Badge>
                </div>

                {loadingVagas ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-4"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : vagas.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Nenhuma vaga disponível no momento
                      </h3>
                      <p className="text-gray-500">
                        Novas oportunidades serão publicadas em breve. Continue acompanhando!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vagas.map((vaga: Vaga) => (
                      <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-isabel-blue flex items-start justify-between">
                            <span>{vaga.titulo}</span>
                            {isAlreadyApplied(vaga.id) && (
                              <Badge className="bg-green-100 text-green-800">
                                Candidatado
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                              <Building className="mr-2 h-4 w-4" />
                              <span className="text-sm">Empresa parceira</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span className="text-sm">
                                Publicado em {new Date(vaga.publicadoEm).toLocaleDateString('pt-BR')}
                              </span>
                            </div>

                            <p className="text-gray-700 text-sm line-clamp-3">
                              {vaga.descricao}
                            </p>

                            {vaga.requisitos && (
                              <div>
                                <h4 className="font-semibold text-isabel-blue text-sm mb-1">
                                  Requisitos:
                                </h4>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {vaga.requisitos}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApplyToJob(vaga.id)}
                                disabled={isAlreadyApplied(vaga.id) || applyToJobMutation.isPending}
                                className="flex-1 bg-isabel-orange hover:bg-isabel-orange/90"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                {isAlreadyApplied(vaga.id) ? "Candidatado" : "Candidatar-se"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="candidaturas">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-isabel-blue">Minhas Candidaturas</h2>
                  <Badge variant="outline" className="text-isabel-blue border-isabel-blue">
                    {candidaturas.length} candidaturas
                  </Badge>
                </div>

                {loadingCandidaturas ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : candidaturas.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Você ainda não se candidatou a nenhuma vaga
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Explore as vagas disponíveis e candidate-se às oportunidades que mais combinam com seu perfil.
                      </p>
                      <Button 
                        onClick={() => {
                          const tabsList = document.querySelector('[role="tablist"]');
                          const vagasTab = tabsList?.querySelector('[value="vagas"]') as HTMLElement;
                          vagasTab?.click();
                        }}
                        className="bg-isabel-orange hover:bg-isabel-orange/90"
                      >
                        Ver Vagas Disponíveis
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {candidaturas.map((candidatura: Candidatura) => {
                      const vaga = vagas.find((v: Vaga) => v.id === candidatura.vagaId);
                      return (
                        <Card key={candidatura.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-isabel-blue mb-2">
                                  {vaga?.titulo || "Vaga não encontrada"}
                                </h3>
                                <div className="flex items-center text-gray-600 mb-2">
                                  <Clock className="mr-2 h-4 w-4" />
                                  <span className="text-sm">
                                    Candidatura enviada em {new Date(candidatura.dataCandidatura).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                {vaga && (
                                  <p className="text-gray-700 text-sm line-clamp-2">
                                    {vaga.descricao}
                                  </p>
                                )}
                              </div>
                              <Badge className="bg-isabel-blue text-white">
                                Em Análise
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
