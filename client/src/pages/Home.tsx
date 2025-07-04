import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { 
  Search, 
  Settings, 
  Brain, 
  GraduationCap, 
  Target, 
  Eye, 
  Heart,
  Users,
  Building,
  UserPlus,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Share2,
  Copy,
  Mail,
  MessageCircle
} from "lucide-react";
import { SiLinkedin, SiFacebook, SiX, SiWhatsapp } from "react-icons/si";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import CurriculoUpload from "@/components/CurriculoUpload";

import GNjPnSHd4wX4gM2H2En8qf from "@assets/GNjPnSHd4wX4gM2H2En8qf.png";

interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  cidade: string;
  estado: string;
  salario?: string;
  tipo: string;
  descricao: string;
  requisitos: string[];
  createdAt: string;
}

export default function Home() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingBancoTalentos, setSubmittingBancoTalentos] = useState(false);
  const { toast } = useToast();
  const [curriculoFileUrl, setCurriculoFileUrl] = useState("");

  useEffect(() => {
    fetchVagasDestaque();
    if (window.location.hash === "#vagas") {
      setTimeout(() => {
        const vagasSection = document.querySelector('[data-section="vagas"]');
        if (vagasSection) {
          vagasSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }, []);

  const fetchVagasDestaque = async () => {
    try {
      const response = await fetch('/api/vagas?limit=6&destaque=true');
      if (response.ok) {
        const data = await response.json();
        setVagas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para compartilhar vaga
  const shareVaga = (vaga: Vaga, platform: string) => {
    const baseUrl = window.location.origin;
    const vagaUrl = `${baseUrl}/candidato?highlight=${vaga.id}`;
    const shareText = `🚀 Oportunidade de emprego: ${vaga.titulo} na ${vaga.empresa}! 💼\n\n📍 ${vaga.cidade}, ${vaga.estado}\n💰 ${vaga.salario || 'Salário a combinar'}\n\n${vaga.descricao.substring(0, 100)}...\n\nCandidature-se em:`;
    
    const shareData = {
      title: `${vaga.titulo} - ${vaga.empresa}`,
      text: shareText,
      url: vagaUrl
    };

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${vagaUrl}`)}`, '_blank');
        break;
      
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(vagaUrl)}`, '_blank');
        break;
      
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vagaUrl)}`, '_blank');
        break;
      
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(vagaUrl)}`, '_blank');
        break;
      
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareText}\n\n${vagaUrl}`)}`, '_blank');
        break;
      
      case 'copy':
        navigator.clipboard.writeText(vagaUrl).then(() => {
          toast({
            title: "Link copiado!",
            description: "O link da vaga foi copiado para a área de transferência.",
          });
        }).catch(() => {
          toast({
            title: "Erro ao copiar",
            description: "Não foi possível copiar o link.",
            variant: "destructive",
          });
        });
        break;
      
      case 'native':
        if (navigator.share) {
          navigator.share(shareData).catch(() => {
            // Fallback para copiar link
            shareVaga(vaga, 'copy');
          });
        } else {
          shareVaga(vaga, 'copy');
        }
        break;
      
      default:
        break;
    }
    
    toast({
      title: "Vaga compartilhada!",
      description: `A vaga foi compartilhada via ${platform}.`,
    });
  };

  // Adicionar função para upload do currículo
  const handleCurriculoUpload = async (dados: any) => {
    // Se o backend de upload retornar uma URL, salve-a
    if (dados && dados.url) {
      setCurriculoFileUrl(dados.url);
    }
  };

  // Função para cadastrar no banco de talentos
  const handleBancoTalentosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingBancoTalentos) return;
    setSubmittingBancoTalentos(true);
    try {
      const nome = (document.getElementById('bt-nome') as HTMLInputElement)?.value;
      const email = (document.getElementById('bt-email') as HTMLInputElement)?.value;
      const telefone = (document.getElementById('bt-telefone') as HTMLInputElement)?.value;
      const areaInteresse = (document.getElementById('bt-area') as HTMLSelectElement)?.value;
      const curriculoUrl = (document.getElementById('bt-curriculo') as HTMLInputElement)?.value;
      // Usa a URL do arquivo anexado, se houver
      const curriculoFinalUrl = curriculoFileUrl || curriculoUrl;
      if (!nome || !email || !areaInteresse) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha nome, e-mail e área de interesse.",
          variant: "destructive",
        });
        return;
      }
      const response = await fetch('/api/banco-talentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          areaInteresse,
          curriculoUrl: curriculoFinalUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar no banco de talentos');
      }
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você foi adicionado ao nosso banco de talentos. Em breve entraremos em contato!",
      });
      (document.getElementById('banco-talentos-form') as HTMLFormElement)?.reset();
      setCurriculoFileUrl("");
    } catch (error: any) {
      console.error('Erro ao cadastrar no banco de talentos:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSubmittingBancoTalentos(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-isabel-accent to-white py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-isabel-blue leading-tight mb-4 sm:mb-6">
                Transformando o RH em um{" "}
                <span className="text-isabel-orange">diferencial estratégico</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Mais de 20 anos conectando empresas e pessoas, desenvolvendo equipes de alta performance através de consultoria especializada.              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="/candidato">
                  <Button size="default" className="w-full sm:w-auto bg-isabel-orange hover:bg-isabel-orange/90 text-white font-semibold text-sm sm:text-base">
                    Área do Candidato
                  </Button>
                </Link>
                <Link href="/empresa">
                  <Button size="default" variant="outline" className="w-full sm:w-auto border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white font-semibold text-sm sm:text-base">
                    Área da Empresa
                  </Button>
                </Link>
                <Button
                  size="default"
                  variant="outline"
                  className="w-full sm:w-auto border-isabel-orange text-isabel-orange hover:bg-isabel-orange hover:text-white font-semibold text-sm sm:text-base"
                  onClick={() => {
                    const section = document.getElementById('banco-talentos-section');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Banco de Talentos
                </Button>
              </div>
              <div className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-isabel-orange">20+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-isabel-orange">300+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Empresas Atendidas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-isabel-orange">DISC</div>
                  <div className="text-xs sm:text-sm text-gray-600">Especialista</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center order-1 lg:order-2">
              <img 
                src={GNjPnSHd4wX4gM2H2En8qf} 
                alt="Isabel Cunha - Especialista em RH" 
                className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full object-cover shadow-2xl border-4 sm:border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Services Preview */}
      <section className="py-12 sm:py-16 lg:py-20 bg-isabel-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-isabel-blue mb-4">Nossos Serviços</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em RH para impulsionar o crescimento da sua empresa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-center text-isabel-blue">
                  Recrutamento e Seleção
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Encontramos talentos alinhados com os valores da sua empresa
                </p>
                <Link href="/servicos">
                  <Button className="bg-isabel-orange hover:bg-isabel-orange/90">
                    Saiba Mais
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-center text-isabel-blue">
                  Consultoria Estratégica
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Estruturamos todos os subsistemas de RH da sua empresa
                </p>
                <Link href="/servicos">
                  <Button variant="outline" className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white">
                    Saiba Mais
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-center text-isabel-blue">
                  Análise DISC
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Identificamos perfis ideais e reduzimos a rotatividade
                </p>
                <Link href="/servicos">
                  <Button className="bg-isabel-orange hover:bg-isabel-orange/90">
                    Saiba Mais
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-center text-isabel-blue">
                  Treinamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Desenvolvemos competências específicas para sua equipe
                </p>
                <Link href="/servicos">
                  <Button variant="outline" className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white">
                    Saiba Mais
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Vagas em Destaque */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white" data-section="vagas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-isabel-blue mb-4">Vagas em Destaque</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Oportunidades exclusivas para impulsionar sua carreira
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isabel-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando vagas...</p>
            </div>
          ) : vagas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {vagas.map((vaga) => (
                  <Card key={vaga.id} className="hover:shadow-xl transition-shadow border-l-4 border-isabel-orange">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-isabel-blue border-isabel-blue">
                          {vaga.tipo}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(vaga.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-isabel-blue line-clamp-2">
                        {vaga.titulo}
                      </CardTitle>
                      <p className="text-gray-600 font-medium">{vaga.empresa}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-isabel-orange" />
                          <span className="text-sm">{vaga.cidade}, {vaga.estado}</span>
                        </div>
                        {vaga.salario && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2 text-isabel-orange" />
                            <span className="text-sm">{vaga.salario}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-isabel-orange" />
                          <span className="text-sm">Publicada há {Math.floor((Date.now() - new Date(vaga.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {vaga.descricao}
                      </p>
                      
                      {vaga.requisitos && vaga.requisitos.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-isabel-blue mb-2">Principais requisitos:</h4>
                          <div className="flex flex-wrap gap-1">
                            {vaga.requisitos.slice(0, 3).map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {vaga.requisitos.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{vaga.requisitos.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/candidato?highlight=${vaga.id}`} className="flex-1">
                          <Button className="w-full bg-isabel-orange hover:bg-isabel-orange/90 text-sm">
                            Candidatar-se
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white px-3 text-xs sm:text-sm"
                          onClick={() => {
                            // Por enquanto, mostrar detalhes da vaga em um toast ou modal
                            alert(`Detalhes da vaga:\n\n${vaga.titulo}\n${vaga.empresa}\n\n${vaga.descricao}\n\nRequisitos:\n${vaga.requisitos.join(', ')}`);
                          }}
                        >
                          <span className="hidden sm:inline">Ver mais</span>
                          <span className="sm:hidden">Detalhes</span>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </Button>
                        
                        {/* Botão de Compartilhamento */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-300 text-gray-600 hover:bg-gray-50 px-3"
                              title="Compartilhar vaga"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'whatsapp')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-green-50"
                            >
                              <SiWhatsapp className="h-4 w-4 text-green-600" />
                              <span>WhatsApp</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'linkedin')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                            >
                              <SiLinkedin className="h-4 w-4 text-blue-600" />
                              <span>LinkedIn</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'facebook')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                            >
                              <SiFacebook className="h-4 w-4 text-blue-700" />
                              <span>Facebook</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'twitter')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                            >
                              <SiX className="h-4 w-4 text-gray-800" />
                              <span>X (Twitter)</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'email')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                            >
                              <Mail className="h-4 w-4 text-gray-600" />
                              <span>E-mail</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'copy')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                            >
                              <Copy className="h-4 w-4 text-gray-600" />
                              <span>Copiar link</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => shareVaga(vaga, 'native')}
                              className="flex items-center gap-2 cursor-pointer hover:bg-isabel-orange/10"
                            >
                              <MessageCircle className="h-4 w-4 text-isabel-orange" />
                              <span>Compartilhar...</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/candidato">
                  <Button size="lg" className="bg-isabel-blue hover:bg-isabel-blue/90">
                    Ver Todas as Vagas
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma vaga disponível</h3>
              <p className="text-gray-600 mb-6">Cadastre-se para ser notificado sobre novas oportunidades!</p>
              <Link href="/candidato">
                <Button className="bg-isabel-orange hover:bg-isabel-orange/90">
                  Cadastrar-se como Candidato
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Banco de Talentos */}
      <section id="banco-talentos-section" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-isabel-blue to-isabel-blue/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
              Faça Parte do Nosso Banco de Talentos
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-black max-w-3xl mx-auto">
              Cadastre-se gratuitamente e seja notificado sobre oportunidades exclusivas que combinam com seu perfil
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-6 sm:p-8">
                <form id="banco-talentos-form" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bt-nome" className="text-isabel-blue font-medium">
                        Nome Completo *
                      </Label>
                      <Input
                        id="bt-nome"
                        type="text"
                        placeholder="Seu nome completo"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bt-email" className="text-isabel-blue font-medium">
                        E-mail *
                      </Label>
                      <Input
                        id="bt-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bt-telefone" className="text-isabel-blue font-medium">
                        Telefone
                      </Label>
                      <Input
                        id="bt-telefone"
                        type="tel"
                        placeholder="(47) 99999-9999"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bt-area" className="text-isabel-blue font-medium">
                        Área de Interesse *
                      </Label>
                      <select
                        id="bt-area"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-isabel-blue focus:border-transparent"
                        required
                      >
                        <option value="">Selecione uma área</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="vendas">Vendas</option>
                        <option value="marketing">Marketing</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="rh">Recursos Humanos</option>
                        <option value="operacoes">Operações</option>
                        <option value="logistica">Logística</option>
                        <option value="juridico">Jurídico</option>
                        <option value="educacao">Educação</option>
                        <option value="saude">Saúde</option>
                        <option value="design">Design</option>
                        <option value="engenharia">Engenharia</option>
                        <option value="consultoria">Consultoria</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bt-curriculo" className="text-isabel-blue font-medium">
                      Link do Currículo (LinkedIn, Google Drive, etc.)
                    </Label>
                    <Input
                      id="bt-curriculo"
                      type="url"
                      placeholder="https://linkedin.com/in/seuperfil ou link do seu currículo"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-isabel-blue font-medium mb-1 block">Anexar Currículo (PDF, DOC, JPG, PNG)</Label>
                    <CurriculoUpload onProcessamentoCompleto={handleCurriculoUpload} multiplos={false} />
                    {curriculoFileUrl && (
                      <p className="text-xs text-green-600 mt-1">Arquivo anexado com sucesso!</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-isabel-orange hover:bg-isabel-orange/90 text-white font-semibold py-3"
                      onClick={(e) => handleBancoTalentosSubmit(e)}
                      disabled={submittingBancoTalentos}
                    >
                      {submittingBancoTalentos ? "Cadastrando..." : "Cadastrar no Banco de Talentos"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="sm:w-auto border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white"
                      onClick={() => {
                        const vagasSection = document.querySelector('[data-section="vagas"]');
                        if (vagasSection) {
                          vagasSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Ver Vagas Abertas
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="sm:w-auto border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white"
                      onClick={() => window.location.href = '/candidato'}
                    >
                      Cadastrar como Candidato
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 text-center mt-4">
                    * Campos obrigatórios. Seus dados são protegidos pela LGPD.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="text-isabel-blue">
                <Target className="h-8 w-8 mx-auto mb-3 text-isabel-orange" />
                <h3 className="text-lg font-semibold mb-2">Oportunidades Exclusivas</h3>
                <p className="text-sm">
                  Receba ofertas personalizadas antes mesmo delas serem publicadas
                </p>
              </div>
              <div className="text-isabel-blue">
                <Eye className="h-8 w-8 mx-auto mb-3 text-isabel-orange" />
                <h3 className="text-lg font-semibold mb-2">Visibilidade Profissional</h3>
                <p className="text-sm">
                  Seu perfil fica visível para empresas que buscam profissionais como você
                </p>
              </div>
              <div className="text-isabel-blue">
                <Heart className="h-8 w-8 mx-auto mb-3 text-isabel-orange" />
                <h3 className="text-lg font-semibold mb-2">Suporte Especializado</h3>
                <p className="text-sm">
                  Conte com nossa consultoria especializada durante todo o processo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-isabel-blue mb-4">Nossa Essência</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">Os valores que guiam nossa atuação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center p-6 sm:p-8 bg-gradient-to-br from-isabel-orange/10 to-isabel-orange/5">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-isabel-blue">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Conectar empresas e pessoas certas, criando equipes de alta performance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-isabel-blue/10 to-isabel-blue/5">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-isabel-blue">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Ser referência em consultoria estratégica de RH no Sul do Brasil
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-isabel-orange/10 to-isabel-orange/5">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-isabel-blue">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Integridade, resiliência, respeito e atendimento humanizado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* User Areas CTA */}
      <section className="py-20 bg-gradient-to-br from-isabel-accent to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Acesse Sua Área</h2>
            <p className="text-xl text-gray-600">Entre na sua área exclusiva para gerenciar vagas e candidaturas</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-24 h-24 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white h-12 w-12" />
                </div>
                <CardTitle className="text-2xl text-isabel-blue">Área do Candidato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Cadastre seu perfil, envie seu currículo e candidate-se às vagas disponíveis
                </p>
                <Link href="/candidato">
                  <Button className="w-full bg-isabel-orange hover:bg-isabel-orange/90">
                    Acessar Área do Candidato
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-24 h-24 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="text-white h-12 w-12" />
                </div>
                <CardTitle className="text-2xl text-isabel-blue">Área da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Cadastre sua empresa, publique vagas e gerencie o processo seletivo
                </p>
                <Link href="/empresa">
                  <Button className="w-full bg-isabel-blue hover:bg-isabel-blue/90">
                    Acessar Área da Empresa
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-24 h-24 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="text-white h-12 w-12" />
                </div>
                <CardTitle className="text-2xl text-isabel-blue">Banco de Talentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Faça parte do nosso banco de talentos e seja contactado para oportunidades futuras
                </p>
                <Link href="/banco-talentos">
                  <Button className="w-full bg-isabel-orange hover:bg-isabel-orange/90">
                    Cadastrar no Banco de Talentos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
