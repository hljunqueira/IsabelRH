import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useLocation } from "wouter";
import { UserRoundCheck, Building, Eye, EyeOff } from "lucide-react";
import logoImage from "@assets/475938809_597105653108037_9024041851945984459_n_1750906819330.jpg";

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
    linkedin: "",
    areasInteresse: [] as string[],
    // Empresa fields
    nomeEmpresa: "",
    cnpj: "",
    setor: "",
  });

  const [adminData, setAdminData] = useState({
    email: "",
    senha: "",
  });

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
    onSuccess: (data) => {
      localStorage.setItem("auth-user", JSON.stringify(data));
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) de volta!",
      });
      
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
        linkedin: registerData.linkedin,
        areasInteresse: registerData.areasInteresse,
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
                      <>
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
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            type="tel"
                            value={registerData.telefone}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, telefone: e.target.value }))}
                            placeholder="(48) 99999-9999"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            type="url"
                            value={registerData.linkedin}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="linkedin.com/in/seu-perfil"
                          />
                        </div>
                      </>
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
                            onChange={(e) => setRegisterData(prev => ({ ...prev, cnpj: e.target.value }))}
                            placeholder="00.000.000/0000-00"
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
                    
                    <div className="bg-isabel-accent p-3 rounded-md">
                      <p className="text-sm text-gray-700 font-medium">Credenciais de teste:</p>
                      <p className="text-xs text-gray-600">Email: isabel@isabelcunharh.com</p>
                      <p className="text-xs text-gray-600">Senha: admin123</p>
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
          
          {/* Acesso Rápido para Teste */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-isabel-blue mb-3">Acesso Rápido para Teste</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  const candidatoUser = {
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
                  localStorage.setItem("auth-user", JSON.stringify(candidatoUser));
                  toast({ title: "Logado como candidato de teste!" });
                  setLocation("/candidato");
                }}
                variant="outline"
                className="w-full h-16 flex flex-col items-center gap-1 border-blue-200 hover:bg-blue-50"
              >
                <UserRoundCheck className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Entrar como Candidato</span>
                <span className="text-xs text-blue-600">João Silva</span>
              </Button>
              
              <Button
                onClick={() => {
                  const empresaUser = {
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
                  localStorage.setItem("auth-user", JSON.stringify(empresaUser));
                  toast({ title: "Logado como empresa de teste!" });
                  setLocation("/empresa");
                }}
                variant="outline"
                className="w-full h-16 flex flex-col items-center gap-1 border-green-200 hover:bg-green-50"
              >
                <Building className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Entrar como Empresa</span>
                <span className="text-xs text-green-600">Tech Solutions LTDA</span>
              </Button>
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Ou use as credenciais acima nas abas Login/Admin para testar o sistema completo
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
