import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";
import { UserRoundCheck } from "lucide-react";
import logoImage from "@assets/475938809_597105653108037_9024041851945984459_n_1750906819330.jpg";

export default function AdminLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login simples para admin (você pode melhorar a segurança depois)
    if (loginData.email === "isabel@isabelcunharh.com" && loginData.senha === "admin123") {
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
      toast({ title: "Login realizado com sucesso!" });
      setLocation("/admin");
    } else {
      toast({ 
        title: "Credenciais inválidas", 
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
            <h1 className="text-3xl font-bold text-isabel-blue">Área Administrativa</h1>
            <p className="text-gray-600 mt-2">Acesso exclusivo para administradores</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-isabel-blue">Login Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">E-mail</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="isabel@isabelcunharh.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="admin-password">Senha</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={loginData.senha}
                    onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
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
          </Card>
        </div>
      </section>
    </Layout>
  );
}