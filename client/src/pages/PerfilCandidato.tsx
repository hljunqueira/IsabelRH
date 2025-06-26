import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  GraduationCap,
  Award,
  Briefcase,
  Languages,
  Target,
  DollarSign,
  Clock,
  FileText
} from "lucide-react";

export default function PerfilCandidato() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
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
    // Dados Pessoais
    nome: "",
    email: "",
    telefone: "",
    celular: "",
    dataNascimento: "",
    estadoCivil: "",
    genero: "",
    pcd: "não",
    
    // Endereço
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    
    // Redes Sociais/Links
    linkedin: "",
    github: "",
    portfolio: "",
    
    // Formação Acadêmica
    nivelEscolaridade: "",
    curso: "",
    instituicao: "",
    anoFormacao: "",
    
    // Habilidades e Competências
    idiomas: [] as string[],
    habilidades: [] as string[],
    certificacoes: [] as any[],
    
    // Experiência Profissional
    experiencias: [] as any[],
    
    // Objetivos Profissionais
    objetivoProfissional: "",
    areasInteresse: [] as string[],
    pretensaoSalarial: "",
    disponibilidade: "",
    modalidadeTrabalho: "",
    
    // Currículo
    curriculoUrl: "",
  });

  const [novaExperiencia, setNovaExperiencia] = useState({
    empresa: "",
    cargo: "",
    dataInicio: "",
    dataFim: "",
    atual: false,
    descricao: "",
  });

  const [novaCertificacao, setNovaCertificacao] = useState({
    nome: "",
    instituicao: "",
    dataObtencao: "",
    validade: "",
  });

  const [novoIdioma, setNovoIdioma] = useState("");
  const [novaHabilidade, setNovaHabilidade] = useState("");

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/candidatos/${user.usuario.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const dataToSave = {
      ...profileData,
      experiencias: JSON.stringify(profileData.experiencias),
      certificacoes: JSON.stringify(profileData.certificacoes),
    };
    updateProfileMutation.mutate(dataToSave);
  };

  const adicionarExperiencia = () => {
    if (novaExperiencia.empresa && novaExperiencia.cargo) {
      setProfileData(prev => ({
        ...prev,
        experiencias: [...prev.experiencias, { ...novaExperiencia, id: Date.now() }]
      }));
      setNovaExperiencia({
        empresa: "",
        cargo: "",
        dataInicio: "",
        dataFim: "",
        atual: false,
        descricao: "",
      });
    }
  };

  const removerExperiencia = (id: number) => {
    setProfileData(prev => ({
      ...prev,
      experiencias: prev.experiencias.filter(exp => exp.id !== id)
    }));
  };

  const adicionarCertificacao = () => {
    if (novaCertificacao.nome && novaCertificacao.instituicao) {
      setProfileData(prev => ({
        ...prev,
        certificacoes: [...prev.certificacoes, { ...novaCertificacao, id: Date.now() }]
      }));
      setNovaCertificacao({
        nome: "",
        instituicao: "",
        dataObtencao: "",
        validade: "",
      });
    }
  };

  const removerCertificacao = (id: number) => {
    setProfileData(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.filter(cert => cert.id !== id)
    }));
  };

  const adicionarIdioma = () => {
    if (novoIdioma && !profileData.idiomas.includes(novoIdioma)) {
      setProfileData(prev => ({
        ...prev,
        idiomas: [...prev.idiomas, novoIdioma]
      }));
      setNovoIdioma("");
    }
  };

  const removerIdioma = (idioma: string) => {
    setProfileData(prev => ({
      ...prev,
      idiomas: prev.idiomas.filter(i => i !== idioma)
    }));
  };

  const adicionarHabilidade = () => {
    if (novaHabilidade && !profileData.habilidades.includes(novaHabilidade)) {
      setProfileData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, novaHabilidade]
      }));
      setNovaHabilidade("");
    }
  };

  const removerHabilidade = (habilidade: string) => {
    setProfileData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter(h => h !== habilidade)
    }));
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/candidato")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-isabel-blue">Meu Perfil</h1>
              <p className="text-gray-600">Complete suas informações para aumentar suas chances</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="bg-isabel-orange hover:bg-isabel-orange/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProfileMutation.isPending ? "Salvando..." : "Salvar Perfil"}
          </Button>
        </div>

        <Tabs defaultValue="pessoais" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pessoais" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Pessoais
            </TabsTrigger>
            <TabsTrigger value="endereco" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </TabsTrigger>
            <TabsTrigger value="formacao" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formação
            </TabsTrigger>
            <TabsTrigger value="experiencia" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência
            </TabsTrigger>
            <TabsTrigger value="habilidades" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="objetivos" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Objetivos
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="pessoais">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-isabel-blue" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={profileData.nome}
                      onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={profileData.telefone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(48) 3333-3333"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="celular">Celular *</Label>
                    <Input
                      id="celular"
                      value={profileData.celular}
                      onChange={(e) => setProfileData(prev => ({ ...prev, celular: e.target.value }))}
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
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Select 
                      value={profileData.estadoCivil} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, estadoCivil: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao-estavel">União Estável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="genero">Gênero</Label>
                    <Select 
                      value={profileData.genero} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, genero: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="nao-binario">Não-binário</SelectItem>
                        <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="pcd">Pessoa com Deficiência</Label>
                    <Select 
                      value={profileData.pcd} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, pcd: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="não">Não</SelectItem>
                        <SelectItem value="sim">Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-isabel-blue">Redes Sociais e Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="linkedin.com/in/seu-perfil"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={profileData.github}
                        onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                        placeholder="github.com/seu-usuario"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="portfolio">Portfólio</Label>
                      <Input
                        id="portfolio"
                        value={profileData.portfolio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, portfolio: e.target.value }))}
                        placeholder="www.seuportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endereço */}
          <TabsContent value="endereco">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-isabel-blue" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      value={profileData.endereco}
                      onChange={(e) => setProfileData(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={profileData.cidade}
                      onChange={(e) => setProfileData(prev => ({ ...prev, cidade: e.target.value }))}
                      placeholder="Sua cidade"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={profileData.estado} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, estado: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={profileData.cep}
                      onChange={(e) => setProfileData(prev => ({ ...prev, cep: e.target.value }))}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formação */}
          <TabsContent value="formacao">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-isabel-blue" />
                  Formação Acadêmica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nivelEscolaridade">Nível de Escolaridade</Label>
                    <Select 
                      value={profileData.nivelEscolaridade} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, nivelEscolaridade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ensino-fundamental">Ensino Fundamental</SelectItem>
                        <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="superior-incompleto">Superior Incompleto</SelectItem>
                        <SelectItem value="superior-completo">Superior Completo</SelectItem>
                        <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
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
                      placeholder="Nome do curso"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instituicao">Instituição</Label>
                    <Input
                      id="instituicao"
                      value={profileData.instituicao}
                      onChange={(e) => setProfileData(prev => ({ ...prev, instituicao: e.target.value }))}
                      placeholder="Nome da instituição"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="anoFormacao">Ano de Formação</Label>
                    <Input
                      id="anoFormacao"
                      value={profileData.anoFormacao}
                      onChange={(e) => setProfileData(prev => ({ ...prev, anoFormacao: e.target.value }))}
                      placeholder="2024"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experiência */}
          <TabsContent value="experiencia">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-isabel-blue" />
                  Experiência Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lista de experiências */}
                {profileData.experiencias.map((exp, index) => (
                  <div key={exp.id || index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-isabel-blue">{exp.cargo}</h4>
                        <p className="text-gray-600">{exp.empresa}</p>
                        <p className="text-sm text-gray-500">
                          {exp.dataInicio} - {exp.atual ? "Atual" : exp.dataFim}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerExperiencia(exp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {exp.descricao && (
                      <p className="text-gray-700 text-sm">{exp.descricao}</p>
                    )}
                  </div>
                ))}

                {/* Adicionar nova experiência */}
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <h4 className="font-semibold mb-4">Adicionar Experiência</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Empresa</Label>
                      <Input
                        value={novaExperiencia.empresa}
                        onChange={(e) => setNovaExperiencia(prev => ({ ...prev, empresa: e.target.value }))}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    
                    <div>
                      <Label>Cargo</Label>
                      <Input
                        value={novaExperiencia.cargo}
                        onChange={(e) => setNovaExperiencia(prev => ({ ...prev, cargo: e.target.value }))}
                        placeholder="Seu cargo"
                      />
                    </div>
                    
                    <div>
                      <Label>Data de Início</Label>
                      <Input
                        type="date"
                        value={novaExperiencia.dataInicio}
                        onChange={(e) => setNovaExperiencia(prev => ({ ...prev, dataInicio: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Data de Fim</Label>
                      <Input
                        type="date"
                        value={novaExperiencia.dataFim}
                        onChange={(e) => setNovaExperiencia(prev => ({ ...prev, dataFim: e.target.value }))}
                        disabled={novaExperiencia.atual}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="atual"
                          checked={novaExperiencia.atual}
                          onCheckedChange={(checked) => setNovaExperiencia(prev => ({ 
                            ...prev, 
                            atual: checked as boolean,
                            dataFim: checked ? "" : prev.dataFim 
                          }))}
                        />
                        <Label htmlFor="atual">Trabalho atualmente nesta empresa</Label>
                      </div>
                      
                      <Label>Descrição das Atividades</Label>
                      <Textarea
                        value={novaExperiencia.descricao}
                        onChange={(e) => setNovaExperiencia(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descreva suas principais atividades e responsabilidades..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={adicionarExperiencia}
                    className="mt-4 bg-isabel-orange hover:bg-isabel-orange/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Experiência
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Habilidades */}
          <TabsContent value="habilidades">
            <div className="space-y-6">
              {/* Idiomas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-isabel-blue" />
                    Idiomas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profileData.idiomas.map((idioma, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {idioma}
                        <button 
                          onClick={() => removerIdioma(idioma)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={novoIdioma}
                      onChange={(e) => setNovoIdioma(e.target.value)}
                      placeholder="Ex: Inglês - Avançado"
                      onKeyPress={(e) => e.key === 'Enter' && adicionarIdioma()}
                    />
                    <Button onClick={adicionarIdioma}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Habilidades */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-isabel-blue" />
                    Habilidades e Competências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profileData.habilidades.map((habilidade, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {habilidade}
                        <button 
                          onClick={() => removerHabilidade(habilidade)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={novaHabilidade}
                      onChange={(e) => setNovaHabilidade(e.target.value)}
                      placeholder="Ex: JavaScript, Liderança, Excel..."
                      onKeyPress={(e) => e.key === 'Enter' && adicionarHabilidade()}
                    />
                    <Button onClick={adicionarHabilidade}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Certificações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-isabel-blue" />
                    Certificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de certificações */}
                  {profileData.certificacoes.map((cert, index) => (
                    <div key={cert.id || index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-isabel-blue">{cert.nome}</h4>
                          <p className="text-gray-600">{cert.instituicao}</p>
                          <p className="text-sm text-gray-500">
                            Obtida em: {cert.dataObtencao}
                            {cert.validade && ` | Válida até: ${cert.validade}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerCertificacao(cert.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Adicionar nova certificação */}
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <h4 className="font-semibold mb-4">Adicionar Certificação</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome da Certificação</Label>
                        <Input
                          value={novaCertificacao.nome}
                          onChange={(e) => setNovaCertificacao(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: AWS Cloud Practitioner"
                        />
                      </div>
                      
                      <div>
                        <Label>Instituição</Label>
                        <Input
                          value={novaCertificacao.instituicao}
                          onChange={(e) => setNovaCertificacao(prev => ({ ...prev, instituicao: e.target.value }))}
                          placeholder="Ex: Amazon Web Services"
                        />
                      </div>
                      
                      <div>
                        <Label>Data de Obtenção</Label>
                        <Input
                          type="date"
                          value={novaCertificacao.dataObtencao}
                          onChange={(e) => setNovaCertificacao(prev => ({ ...prev, dataObtencao: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Validade (opcional)</Label>
                        <Input
                          type="date"
                          value={novaCertificacao.validade}
                          onChange={(e) => setNovaCertificacao(prev => ({ ...prev, validade: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={adicionarCertificacao}
                      className="mt-4 bg-isabel-orange hover:bg-isabel-orange/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Certificação
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Objetivos */}
          <TabsContent value="objetivos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-isabel-blue" />
                  Objetivos Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="objetivoProfissional">Objetivo Profissional</Label>
                  <Textarea
                    id="objetivoProfissional"
                    value={profileData.objetivoProfissional}
                    onChange={(e) => setProfileData(prev => ({ ...prev, objetivoProfissional: e.target.value }))}
                    placeholder="Descreva seus objetivos profissionais, o que busca em sua carreira..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pretensaoSalarial">Pretensão Salarial</Label>
                    <Select 
                      value={profileData.pretensaoSalarial} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, pretensaoSalarial: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ate-2000">Até R$ 2.000</SelectItem>
                        <SelectItem value="2000-3000">R$ 2.000 - R$ 3.000</SelectItem>
                        <SelectItem value="3000-4000">R$ 3.000 - R$ 4.000</SelectItem>
                        <SelectItem value="4000-5000">R$ 4.000 - R$ 5.000</SelectItem>
                        <SelectItem value="5000-7000">R$ 5.000 - R$ 7.000</SelectItem>
                        <SelectItem value="7000-10000">R$ 7.000 - R$ 10.000</SelectItem>
                        <SelectItem value="acima-10000">Acima de R$ 10.000</SelectItem>
                        <SelectItem value="a-combinar">A combinar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="disponibilidade">Disponibilidade</Label>
                    <Select 
                      value={profileData.disponibilidade} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, disponibilidade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imediata">Imediata</SelectItem>
                        <SelectItem value="15-dias">15 dias</SelectItem>
                        <SelectItem value="30-dias">30 dias</SelectItem>
                        <SelectItem value="45-dias">45 dias</SelectItem>
                        <SelectItem value="60-dias">60 dias</SelectItem>
                        <SelectItem value="a-combinar">A combinar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="modalidadeTrabalho">Modalidade de Trabalho</Label>
                    <Select 
                      value={profileData.modalidadeTrabalho} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, modalidadeTrabalho: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="remoto">Remoto</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                        <SelectItem value="qualquer">Qualquer modalidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Áreas de Interesse</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Tecnologia", "Marketing", "Vendas", "Recursos Humanos", "Financeiro", "Operações", "Design", "Educação", "Saúde", "Direito"].map((area) => (
                      <Badge
                        key={area}
                        variant={profileData.areasInteresse.includes(area) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          profileData.areasInteresse.includes(area) 
                            ? "bg-isabel-orange hover:bg-isabel-orange/90" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setProfileData(prev => ({
                            ...prev,
                            areasInteresse: prev.areasInteresse.includes(area)
                              ? prev.areasInteresse.filter(a => a !== area)
                              : [...prev.areasInteresse, area]
                          }));
                        }}
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="curriculoUrl">Upload do Currículo</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Arraste seu currículo aqui ou clique para selecionar</p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC ou DOCX até 5MB</p>
                    <Button variant="outline" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}