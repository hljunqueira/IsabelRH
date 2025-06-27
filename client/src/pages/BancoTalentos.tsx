import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import logoImage from "@assets/475938809_597105653108037_9024041851945984459_n_1750906819330.jpg";
import { 
  Users, 
  Upload, 
  CheckCircle, 
  UserPlus,
  Briefcase,
  FileText,
  Send
} from "lucide-react";
import type { InsertBancoTalentos } from "@shared/schema";

export default function BancoTalentos() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    areaInteresse: "",
    curriculoUrl: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertBancoTalentos) => {
      return await apiRequest("POST", "/api/banco-talentos", data);
    },
    onSuccess: () => {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seu perfil foi adicionado ao nosso banco de talentos. Entraremos em contato quando houver oportunidades compatíveis.",
      });
      setIsSubmitted(true);
    },
    onError: () => {
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente mais tarde ou entre em contato conosco.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.areaInteresse) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, email e área de interesse.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const areasInteresse = [
    "Administração",
    "Atendimento ao Cliente",
    "Comercial/Vendas",
    "Comunicação/Marketing",
    "Contabilidade/Finanças",
    "Educação/Treinamento",
    "Engenharia",
    "Gestão/Liderança",
    "Logística",
    "Produção/Operações",
    "Qualidade",
    "Recursos Humanos",
    "Saúde e Segurança",
    "Tecnologia da Informação",
    "Outras áreas"
  ];

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-isabel-accent py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600 h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-isabel-blue mb-4">
                  Cadastro Realizado com Sucesso!
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Obrigada por se cadastrar em nosso banco de talentos! Seu perfil foi registrado 
                  e entraremos em contato sempre que houver oportunidades que correspondam ao seu perfil.
                </p>
                <div className="bg-isabel-orange/10 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-isabel-blue mb-2">Próximos passos:</h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-isabel-orange mr-2">•</span>
                      Mantenha seus dados sempre atualizados
                    </li>
                    <li className="flex items-start">
                      <span className="text-isabel-orange mr-2">•</span>
                      Fique atento ao seu email para novas oportunidades
                    </li>
                    <li className="flex items-start">
                      <span className="text-isabel-orange mr-2">•</span>
                      Siga-nos nas redes sociais para acompanhar vagas
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                  >
                    Cadastrar Outro Perfil
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/"}
                    className="bg-isabel-orange hover:bg-isabel-orange/90"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-isabel-blue to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6">
              <img 
                src={logoImage} 
                alt="Isabel Cunha RH" 
                className="w-20 h-20 object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-[#2b3245]">Banco de Talentos</h1>
            <p className="text-xl max-w-3xl mx-auto text-[#2b3245]">
              Faça parte do nosso banco de talentos e seja contactado para oportunidades 
              exclusivas que combinam com seu perfil profissional
            </p>
          </div>
        </div>
      </section>
      {/* Form Section */}
      <section className="py-20 bg-isabel-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Benefits */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-isabel-blue">Por que se cadastrar?</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-isabel-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-isabel-blue mb-2">Oportunidades Exclusivas</h3>
                      <p className="text-gray-600 text-sm">
                        Receba ofertas de emprego antes que sejam divulgadas publicamente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-isabel-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <UserPlus className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-isabel-blue mb-2">Perfil Direcionado</h3>
                      <p className="text-gray-600 text-sm">
                        Conectamos você apenas com vagas que combinam com seu perfil
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-isabel-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-isabel-blue mb-2">Consultoria Especializada</h3>
                      <p className="text-gray-600 text-sm">
                        Tenha acesso à nossa expertise em RH com mais de 20 anos de experiência
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-isabel-blue">Cadastro no Banco de Talentos</CardTitle>
                  <p className="text-gray-600">
                    Preencha seus dados e entraremos em contato quando houver oportunidades adequadas ao seu perfil.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          type="text"
                          value={formData.nome}
                          onChange={handleInputChange}
                          placeholder="Digite seu nome completo"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone (opcional)</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        placeholder="(48) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="area-interesse">Área de Interesse Principal *</Label>
                      <Select 
                        value={formData.areaInteresse} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, areaInteresse: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua área de interesse" />
                        </SelectTrigger>
                        <SelectContent className="select-content-white bg-white border border-gray-200 shadow-lg">
                          {areasInteresse.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="curriculo-url">Link do Currículo (opcional)</Label>
                      <Input
                        id="curriculo-url"
                        name="curriculoUrl"
                        type="url"
                        value={formData.curriculoUrl}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/... ou linkedin.com/in/seu-perfil"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Você pode compartilhar um link do Google Drive, LinkedIn ou outro serviço online
                      </p>
                    </div>

                    <div className="bg-isabel-orange/10 rounded-lg p-4">
                      <h4 className="font-semibold text-isabel-blue mb-2">
                        <Upload className="inline mr-2 h-4 w-4" />
                        Sobre seus dados
                      </h4>
                      <p className="text-sm text-gray-700">
                        Seus dados serão utilizados exclusivamente para identificar oportunidades 
                        compatíveis com seu perfil. Respeitamos sua privacidade e seguimos a LGPD.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-isabel-orange hover:bg-isabel-orange/90"
                      disabled={submitMutation.isPending}
                      size="lg"
                    >
                      {submitMutation.isPending ? (
                        "Cadastrando..."
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Cadastrar no Banco de Talentos
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-isabel-blue mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Entre em contato conosco e saiba mais sobre como podemos ajudar em sua carreira
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = "/contato"}
            >
              Falar Conosco
            </Button>
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => window.open("https://wa.me/5548996332952", "_blank")}
            >
              WhatsApp Direto
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
