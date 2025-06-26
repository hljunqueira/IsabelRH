import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useLocation } from "wouter";
import { UserRoundCheck, Building, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import logoImage from "@assets/475938809_597105653108037_9024041851945984459_n_1750906819330.jpg";

// Função para formatar CNPJ
const formatCNPJ = (value: string) => {
  const cnpj = value.replace(/\D/g, '');
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
  if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
  if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
};

// Função para formatar telefone
const formatPhone = (value: string) => {
  const phone = value.replace(/\D/g, '');
  if (phone.length <= 2) return phone;
  if (phone.length <= 6) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  if (phone.length <= 10) return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
};

// Função para formatar CEP
const formatCEP = (value: string) => {
  const cep = value.replace(/\D/g, '');
  if (cep.length <= 5) return cep;
  return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
};

// Função para formatar CPF
const formatCPF = (value: string) => {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    senha: "",
    tipo: "" as "candidato" | "empresa" | "",
    // Candidato fields
    nome: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    linkedin: "",
    areasInteresse: [] as string[],
    cidade: "",
    estado: "",
    cep: "",
    endereco: "",
    escolaridade: "",
    experiencia: "",
    objetivos: "",
    // Empresa fields
    nomeEmpresa: "",
    cnpj: "",
    setor: "",
  });

  const [adminData, setAdminData] = useState({
    email: "",
    senha: "",
  });

  const { login: authLogin } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
      // Verificar se são credenciais de teste
      if (data.email === "candidato@teste.com" && data.senha === "123456") {
        return {
          usuario: {
            id: "candidato-teste",
            email: "candidato@teste.com",
            tipo: "candidato",
            criadoEm: new Date(),
          },
          profile: {
            id: "candidato-teste",
            nome: "João Silva",
            telefone: "(48) 99999-9999",
            linkedin: "linkedin.com/in/joao-silva",
            curriculoUrl: null,
            areasInteresse: ["Tecnologia", "Marketing"],
            criadoEm: new Date(),
          },
        };
      }
      
      if (data.email === "empresa@teste.com" && data.senha === "123456") {
        return {
          usuario: {
            id: "empresa-teste",
            email: "empresa@teste.com",
            tipo: "empresa",
            criadoEm: new Date(),
          },
          profile: {
            id: "empresa-teste",
            nome: "Tech Solutions LTDA",
            cnpj: "12.345.678/0001-90",
            setor: "Tecnologia",
            criadoEm: new Date(),
          },
        };
      }
      
      // Se não for usuário de teste, tentar login normal
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: async (data) => {
      // Atualizar o contexto de autenticação
      await authLogin(loginData.email, loginData.senha);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) de volta!",
      });
      
      // Redirecionar após atualizar o contexto
      if (data.usuario.tipo === "candidato") {
        setLocation("/candidato");
      } else if (data.usuario.tipo === "empresa") {
        setLocation("/empresa");
      }
    },
    onError: () => {
      toast({
        title: "Erro no login",
        description: "Email ou senha inválidos.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return await response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("auth-user", JSON.stringify(data));
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo(a) à Isabel Cunha RH!",
      });
      
      if (data.usuario.tipo === "candidato") {
        setLocation("/candidato");
      } else if (data.usuario.tipo === "empresa") {
        setLocation("/empresa");
      }
    },
    onError: () => {
      toast({
        title: "Erro no cadastro",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.senha || !registerData.tipo) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let submitData: any = {
      email: registerData.email,
      senha: registerData.senha,
      tipo: registerData.tipo,
    };

    if (registerData.tipo === "candidato") {
      if (!registerData.nome) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, preencha seu nome.",
          variant: "destructive",
        });
        return;
      }
      submitData = {
        ...submitData,
        nome: registerData.nome,
        telefone: registerData.telefone,
        cpf: registerData.cpf,
        dataNascimento: registerData.dataNascimento,
        linkedin: registerData.linkedin,
        areasInteresse: registerData.areasInteresse,
        cidade: registerData.cidade,
        estado: registerData.estado,
        cep: registerData.cep,
        endereco: registerData.endereco,
        nivelEscolaridade: registerData.escolaridade,
        objetivoProfissional: registerData.objetivos,
        experiencia: registerData.experiencia,
      };
    } else if (registerData.tipo === "empresa") {
      if (!registerData.nomeEmpresa) {
        toast({
          title: "Nome da empresa obrigatório",
          description: "Por favor, preencha o nome da empresa.",
          variant: "destructive",
        });
        return;
      }
      submitData = {
        ...submitData,
        nome: registerData.nomeEmpresa,
        cnpj: registerData.cnpj,
        setor: registerData.setor,
      };
    }

    registerMutation.mutate(submitData);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login simples para admin
    if (adminData.email === "isabel@isabelcunharh.com" && adminData.senha === "admin123") {
      const adminUser = {
        usuario: {
          id: "admin-1",
          email: "isabel@isabelcunharh.com",
          tipo: "admin",
          criadoEm: new Date(),
        },
        profile: null,
      };
      
      localStorage.setItem("auth-user", JSON.stringify(adminUser));
      toast({ title: "Login administrativo realizado com sucesso!" });
      setLocation("/admin");
    } else {
      toast({ 
        title: "Credenciais administrativas inválidas", 
        description: "Email ou senha incorretos",
        variant: "destructive" 
      });
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-isabel-accent min-h-screen">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src={logoImage} 
                alt="Isabel Cunha RH" 
                className="w-20 h-20 object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-isabel-blue">Isabel Cunha RH</h1>
            <p className="text-gray-600 mt-2">Acesse sua área exclusiva</p>
          </div>

          <Card>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardHeader>
                  <CardTitle className="text-isabel-blue">Entre em sua conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">E-mail</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.senha}
                          onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                          placeholder="Digite sua senha"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-isabel-orange hover:bg-isabel-orange/90"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="register">
                <CardHeader>
                  <CardTitle className="text-isabel-blue">Criar nova conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-email">E-mail *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="register-password">Senha *</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.senha}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, senha: e.target.value }))}
                          placeholder="Digite sua senha"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="user-type">Tipo de usuário *</Label>
                      <Select 
                        value={registerData.tipo} 
                        onValueChange={(value: "candidato" | "empresa") => 
                          setRegisterData(prev => ({ ...prev, tipo: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="candidato">
                            <div className="flex items-center">
                              <UserRoundCheck className="mr-2 h-4 w-4" />
                              Candidato
                            </div>
                          </SelectItem>
                          <SelectItem value="empresa">
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Empresa
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Candidato specific fields */}
                    {registerData.tipo === "candidato" && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold text-isabel-blue">Dados Pessoais</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nome">Nome completo *</Label>
                            <Input
                              id="nome"
                              type="text"
                              value={registerData.nome}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, nome: e.target.value }))}
                              placeholder="Digite seu nome completo"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="telefone">Telefone/Celular *</Label>
                            <Input
                              id="telefone"
                              type="tel"
                              value={registerData.telefone || ""}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, telefone: formatPhone(e.target.value) }))}
                              placeholder="(48) 99999-9999"
                              maxLength={15}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                              id="cpf"
                              type="text"
                              value={registerData.cpf || ""}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                              placeholder="000.000.000-00"
                              maxLength={14}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                            <Input
                              id="dataNascimento"
                              type="date"
                              value={registerData.dataNascimento || ""}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                              id="cep"
                              type="text"
                              value={registerData.cep || ""}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, cep: formatCEP(e.target.value) }))}
                              placeholder="00000-000"
                              maxLength={9}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input
                              id="endereco"
                              type="text"
                              value={registerData.endereco || ""}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, endereco: e.target.value }))}
                              placeholder="Rua, número, complemento"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cidade">Cidade *</Label>
                            <Input
                              id="cidade"
                              type="text"
                              value={registerData.cidade || ""}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, cidade: e.target.value }))}
                              placeholder="Sua cidade"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="estado">Estado *</Label>
                            <Select 
                              value={registerData.estado || ""} 
                              onValueChange={(value) => setRegisterData(prev => ({ ...prev, estado: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SC">Santa Catarina</SelectItem>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                <SelectItem value="MG">Minas Gerais</SelectItem>
                                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                <SelectItem value="PR">Paraná</SelectItem>
                                <SelectItem value="BA">Bahia</SelectItem>
                                <SelectItem value="GO">Goiás</SelectItem>
                                <SelectItem value="PE">Pernambuco</SelectItem>
                                <SelectItem value="CE">Ceará</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="escolaridade">Escolaridade *</Label>
                            <Select 
                              value={registerData.escolaridade || ""} 
                              onValueChange={(value) => setRegisterData(prev => ({ ...prev, escolaridade: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione sua escolaridade" />
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
                            <Label htmlFor="experiencia">Experiência Profissional *</Label>
                            <Select 
                              value={registerData.experiencia || ""} 
                              onValueChange={(value) => setRegisterData(prev => ({ ...prev, experiencia: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione sua experiência" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sem-experiencia">Sem experiência</SelectItem>
                                <SelectItem value="ate-1-ano">Até 1 ano</SelectItem>
                                <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
                                <SelectItem value="3-5-anos">3 a 5 anos</SelectItem>
                                <SelectItem value="5-10-anos">5 a 10 anos</SelectItem>
                                <SelectItem value="mais-10-anos">Mais de 10 anos</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            type="url"
                            value={registerData.linkedin || ""}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="https://linkedin.com/in/seu-perfil"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="objetivos">Objetivos Profissionais *</Label>
                          <Textarea
                            id="objetivos"
                            value={registerData.objetivos || ""}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, objetivos: e.target.value }))}
                            placeholder="Descreva brevemente seus objetivos profissionais..."
                            rows={3}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Empresa specific fields */}
                    {registerData.tipo === "empresa" && (
                      <>
                        <div>
                          <Label htmlFor="nome-empresa">Nome da empresa *</Label>
                          <Input
                            id="nome-empresa"
                            type="text"
                            value={registerData.nomeEmpresa}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                            placeholder="Digite o nome da empresa"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cnpj">CNPJ</Label>
                          <Input
                            id="cnpj"
                            type="text"
                            value={registerData.cnpj}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="setor">Setor</Label>
                          <Input
                            id="setor"
                            type="text"
                            value={registerData.setor}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, setor: e.target.value }))}
                            placeholder="Ex: Tecnologia, Indústria, Serviços"
                          />
                        </div>
                      </>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-isabel-blue hover:bg-isabel-blue/90"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Cadastrando..." : "Criar Conta"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="admin">
                <CardHeader>
                  <CardTitle className="text-isabel-blue">Área Administrativa</CardTitle>
                  <p className="text-sm text-gray-600">Acesso exclusivo para administradores</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email">E-mail</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminData.email}
                        onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="isabel@isabelcunharh.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="admin-password">Senha</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminData.senha}
                        onChange={(e) => setAdminData(prev => ({ ...prev, senha: e.target.value }))}
                        placeholder="Digite sua senha"
                        required
                      />
                    </div>
                    

                    
                    <Button 
                      type="submit" 
                      className="w-full bg-isabel-orange hover:bg-isabel-orange/90"
                    >
                      Entrar na Área Administrativa
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
          

        </div>
      </section>
    </Layout>
  );
}
