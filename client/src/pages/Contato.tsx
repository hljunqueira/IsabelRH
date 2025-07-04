import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Instagram,
  Linkedin,
  MessageCircle
} from "lucide-react";
import type { InsertContato } from "@shared/schema";

export default function Contato() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    mensagem: "",
  });

  const contatoMutation = useMutation({
    mutationFn: async (data: InsertContato) => {
      return await apiRequest("POST", "/api/contatos", data);
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Recebemos sua mensagem. Entraremos em contato em breve!",
      });
      setFormData({ nome: "", email: "", empresa: "", mensagem: "" });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, email e mensagem.",
        variant: "destructive",
      });
      return;
    }
    contatoMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-isabel-blue to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-isabel-blue">Vamos Trabalhar Juntos?</h1>
            <p className="text-xl text-isabel-orange">
              Entre em contato e descubra como podemos transformar seu RH
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-isabel-blue">Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  
                  <div>
                    <Label htmlFor="empresa">Empresa (opcional)</Label>
                    <Input
                      id="empresa"
                      name="empresa"
                      type="text"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      placeholder="Conte-nos sobre suas necessidades em RH..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-isabel-orange hover:bg-isabel-orange/90"
                    disabled={contatoMutation.isPending}
                  >
                    {contatoMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-isabel-blue mb-6">Informações de Contato</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-isabel-orange rounded-full flex items-center justify-center mr-4">
                      <Phone className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-isabel-blue">Telefone</p>
                      <p className="text-gray-600">(48) 99633-2952</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-isabel-orange rounded-full flex items-center justify-center mr-4">
                      <Mail className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-isabel-blue">E-mail</p>
                      <p className="text-gray-600">isabelcunharecrutamentos@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-isabel-orange rounded-full flex items-center justify-center mr-4">
                      <MapPin className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-isabel-blue">Localização</p>
                      <p className="text-gray-600">Santa Catarina, Brasil</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-xl font-bold text-isabel-blue mb-4">Redes Sociais</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/isabelcunhaconsutoriarh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-isabel-orange/10 rounded-full flex items-center justify-center hover:bg-isabel-orange hover:text-white transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/isabelcunharh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-isabel-blue/10 rounded-full flex items-center justify-center hover:bg-isabel-blue hover:text-white transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://wa.me/5548996332952" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <Card className="bg-isabel-accent">
                <CardHeader>
                  <CardTitle className="flex items-center text-isabel-blue">
                    <Clock className="mr-2 h-5 w-5" />
                    Horário de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-700">
                    <p>Segunda a Sexta: 9h às 18h</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-16 bg-isabel-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-isabel-blue mb-4">
            Precisa de uma resposta rápida?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Entre em contato conosco e descubra como podemos ajudar sua empresa a encontrar os melhores talentos!
          </p>
          <a 
            href="https://wa.me/5548996332952?text=Olá! Gostaria de saber mais sobre os serviços de RH da Isabel Cunha." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-isabel-orange hover:bg-isabel-orange/90 text-white">
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Consultoria
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  );
}
