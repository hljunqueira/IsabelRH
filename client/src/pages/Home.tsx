import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  UserPlus
} from "lucide-react";

export default function Home() {
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
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
