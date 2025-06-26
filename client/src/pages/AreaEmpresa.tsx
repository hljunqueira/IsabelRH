import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Building, 
  Plus, 
  Users, 
  FileText, 
  Calendar, 
  Edit, 
  Trash2,
  Eye,
  MapPin,
  LogOut,
  Settings
} from "lucide-react";
import type { Empresa, Vaga, Candidatura } from "@shared/schema";

export default function AreaEmpresa() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  
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
      if (userData.usuario.tipo !== "empresa") {
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
    cnpj: "",
    setor: "",
  });

  const [newJobData, setNewJobData] = useState({
    titulo: "",
    descricao: "",
    requisitos: "",
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

  // Create new job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/vagas", {
        ...data,
        empresaId: user.usuario.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vagas/empresa/${user.usuario.id}`] });
      toast({
        title: "Vaga criada!",
        description: "Nova vaga foi publicada com sucesso.",
      });
      setNewJobData({ titulo: "", descricao: "", requisitos: "" });
      setShowNewJobDialog(false);
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
        setor: empresa.setor || "",
      });
    }
  }, [empresa]);

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCreateJob = () => {
    if (!newJobData.titulo || !newJobData.descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha título e descrição da vaga.",
        variant: "destructive",
      });
      return;
    }
    createJobMutation.mutate(newJobData);
  };

  const handleDeleteJob = (vagaId: string) => {
    if (window.confirm("Tem certeza que deseja remover esta vaga?")) {
      deleteJobMutation.mutate(vagaId);
    }
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
                <h1 className="text-3xl font-bold text-isabel-blue">Área da Empresa</h1>
                <p className="text-gray-600 mt-2">
                  {empresa?.nome || "Gerencie suas vagas e candidatos"}
                </p>
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
                  <Building className="text-white h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="perfil">Perfil da Empresa</TabsTrigger>
              <TabsTrigger value="vagas">Minhas Vagas</TabsTrigger>
              <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
            </TabsList>

            {/* Company Profile Tab */}
            <TabsContent value="perfil">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-isabel-blue">Informações da Empresa</CardTitle>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                      className={isEditing ? "" : "bg-isabel-blue hover:bg-isabel-blue/90"}
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
                          <Label htmlFor="nome">Nome da Empresa</Label>
                          <Input
                            id="nome"
                            value={profileData.nome}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Digite o nome da empresa"
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
                      </div>

                      <div>
                        <Label htmlFor="setor">Setor de Atuação</Label>
                        <Input
                          id="setor"
                          value={profileData.setor}
                          onChange={(e) => setProfileData(prev => ({ ...prev, setor: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Ex: Tecnologia, Indústria, Serviços"
                        />
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

            {/* Jobs Tab */}
            <TabsContent value="vagas">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-isabel-blue">Minhas Vagas</h2>
                  <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-isabel-orange hover:bg-isabel-orange/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Vaga
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-isabel-blue">Criar Nova Vaga</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="titulo">Título da Vaga *</Label>
                          <Input
                            id="titulo"
                            value={newJobData.titulo}
                            onChange={(e) => setNewJobData(prev => ({ ...prev, titulo: e.target.value }))}
                            placeholder="Ex: Desenvolvedor Full Stack"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="descricao">Descrição da Vaga *</Label>
                          <Textarea
                            id="descricao"
                            value={newJobData.descricao}
                            onChange={(e) => setNewJobData(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Descreva as responsabilidades e atividades da posição..."
                            rows={4}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="requisitos">Requisitos</Label>
                          <Textarea
                            id="requisitos"
                            value={newJobData.requisitos}
                            onChange={(e) => setNewJobData(prev => ({ ...prev, requisitos: e.target.value }))}
                            placeholder="Liste os requisitos técnicos e comportamentais..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <Button
                            onClick={handleCreateJob}
                            disabled={createJobMutation.isPending}
                            className="bg-isabel-orange hover:bg-isabel-orange/90"
                          >
                            {createJobMutation.isPending ? "Criando..." : "Criar Vaga"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowNewJobDialog(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Nenhuma vaga cadastrada
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Crie sua primeira vaga para começar a receber candidaturas.
                      </p>
                      <Button 
                        onClick={() => setShowNewJobDialog(true)}
                        className="bg-isabel-orange hover:bg-isabel-orange/90"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Vaga
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vagas.map((vaga: Vaga) => (
                      <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-isabel-blue">{vaga.titulo}</CardTitle>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteJob(vaga.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
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

                            <div className="flex items-center justify-between pt-3">
                              <Badge className="bg-isabel-blue text-white">
                                <Users className="mr-1 h-3 w-3" />
                                Ativa
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Candidatos
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

            {/* Candidates Tab */}
            <TabsContent value="candidatos">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-isabel-blue">Candidatos</h2>
                  <Badge variant="outline" className="text-isabel-blue border-isabel-blue">
                    Em breve
                  </Badge>
                </div>

                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Gestão de Candidatos
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Esta funcionalidade estará disponível em breve. Você poderá visualizar e gerenciar 
                      todas as candidaturas recebidas para suas vagas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar perfis dos candidatos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="mr-2 h-4 w-4" />
                        Baixar currículos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-2 h-4 w-4" />
                        Gerenciar processo seletivo
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
