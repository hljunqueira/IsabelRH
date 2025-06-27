import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const { toast } = useToast();

  useEffect(() => {
    fetchVagasDestaque();
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-isabel-accent to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-isabel-blue leading-tight mb-6">
                Transformando o RH em um{" "}
                <span className="text-isabel-orange">diferencial estratégico</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Mais de 20 anos conectando empresas e pessoas certas, criando equipes de alta performance através de consultoria especializada em RH.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/candidato">
                  <Button size="lg" className="bg-isabel-orange hover:bg-isabel-orange/90 text-white font-semibold">
                    Área do Candidato
                  </Button>
                </Link>
                <Link href="/empresa">
                  <Button size="lg" variant="outline" className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white font-semibold">
                    Área da Empresa
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-isabel-orange">20+</div>
                  <div className="text-sm text-gray-600">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-isabel-orange">300+</div>
                  <div className="text-sm text-gray-600">Empresas Atendidas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-isabel-orange">DISC</div>
                  <div className="text-sm text-gray-600">Especialista</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={GNjPnSHd4wX4gM2H2En8qf} 
                alt="Isabel Cunha - Especialista em RH" 
                className="w-80 h-80 rounded-full object-cover shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Services Preview */}
      <section className="py-20 bg-isabel-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em RH para impulsionar o crescimento da sua empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Vagas em Destaque</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                      
                      <div className="flex gap-2">
                        <Link href={`/candidato?highlight=${vaga.id}`} className="flex-1">
                          <Button className="w-full bg-isabel-orange hover:bg-isabel-orange/90">
                            Candidatar-se
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white px-3"
                          onClick={() => {
                            // Por enquanto, mostrar detalhes da vaga em um toast ou modal
                            alert(`Detalhes da vaga:\n\n${vaga.titulo}\n${vaga.empresa}\n\n${vaga.descricao}\n\nRequisitos:\n${vaga.requisitos.join(', ')}`);
                          }}
                        >
                          Ver mais
                          <ChevronRight className="h-4 w-4 ml-1" />
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
      
      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Nossa Essência</h2>
            <p className="text-xl text-gray-600">Os valores que guiam nossa atuação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gradient-to-br from-isabel-orange/10 to-isabel-orange/5">
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
