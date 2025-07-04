import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Award, 
  UserRound, 
  TrendingUp,
  Calendar,
  Briefcase,
  Heart
} from "lucide-react";
import isabelPhoto from "@assets/image_1750906880114.png";

export default function QuemSomos() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-isabel-accent to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-isabel-blue mb-4">Quem Sou Eu</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              
            </p>
          </div>
        </div>
      </section>

      {/* About Isabel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Card className="bg-isabel-orange/10 p-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-isabel-blue">Isabel Cunha</CardTitle>
                  <p className="text-isabel-orange font-semibold">Especialista em Recursos Humanos</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Sou Isabel Cunha, especialista em Recursos Humanos com mais de 20 anos de experiência. 
                    Atuo como parceira estratégica de empresas que buscam estruturar ou fortalecer seu RH com eficiência, cultura organizacional sólida e foco em resultados.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <GraduationCap className="text-isabel-orange mr-3 h-5 w-5" />
                      <span className="text-gray-700">Ciências Contábeis, MBA em Gestão de Pessoas</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="text-isabel-orange mr-3 h-5 w-5" />
                      <span className="text-gray-700">Segunda graduação: MBA em Recrutamento e Seleção e consultoria de RH.</span>
                    </div>
                    <div className="flex items-center">
                      <UserRound className="text-isabel-orange mr-3 h-5 w-5" />
                      <span className="text-gray-700">Coaching Integral Sistêmico - Método CIS</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="text-isabel-orange mr-3 h-5 w-5" />
                      <span className="text-gray-700">Especialista Comportamental DISC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={isabelPhoto} 
                alt="Isabel Cunha - Especialista em RH" 
                className="w-96 h-96 rounded-2xl object-cover object-top shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-20 bg-isabel-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Minha História</h2>
            <p className="text-xl text-gray-600">Uma trajetória de crescimento e aprendizado constante</p>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-isabel-orange">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="text-isabel-orange h-6 w-6" />
                  <CardTitle className="text-isabel-blue">Aos 18 anos - Primeiro Emprego</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Comecei no varejo, um pouco contrariada por ser tímida. Foi aí o "pulo do gato": 
                  me desenvolvi, participei de treinamentos, me tornei uma comunicadora e conquistadora 
                  de clientes e amigos. Foram 4 anos de muito aprendizado e felicidade.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-isabel-blue">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Briefcase className="text-isabel-blue h-6 w-6" />
                  <CardTitle className="text-isabel-blue">Aos 22 anos - Entrada no RH</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Entrei no mundo do RH e toda aquela habilidade de comunicação desenvolvida no varejo 
                  foi fundamental. Acompanhei o crescimento de uma empresa de 70 para mais de 300 colaboradores. 
                  A menina do DP se tornou Gerente de RH. Foram 8 anos de muito desenvolvimento, cursos, 
                  finalizei minha faculdade e MBA na área de Gestão de Pessoas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-isabel-orange">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-isabel-orange h-6 w-6" />
                  <CardTitle className="text-isabel-blue">27 Anos de Experiência</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  19 + 8 = 27. É isso mesmo: 27 anos vivendo o RH nas veias. Trabalhei em diversas áreas: 
                  confecção, calçados, cerâmica, metalurgia, tecnologia. Cada experiência me fortaleceu 
                  e ampliou minha visão estratégica de RH.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-isabel-blue">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="text-isabel-blue h-6 w-6" />
                  <CardTitle className="text-isabel-blue">Outubro 2024 - Empreendedorismo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Decidi empreender e colocar em prática todo esse aprendizado em gestão, liderança, 
                  recrutamento e seleção de pessoas, desenvolvimento de equipes e cultura organizacional. 
                  Hoje, sou @bell_ccunha transformando empresas através do poder das pessoas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personal Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Meus Valores Pessoais</h2>
            <p className="text-xl text-gray-600">Os princípios que orientam minha vida e trabalho</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-bold text-isabel-blue mb-3">Autodeterminação</h3>
                <p className="text-gray-700">
                  Automativada por natureza, minha determinação não deixa nada para amanhã.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-bold text-isabel-blue mb-3">Curiosidade</h3>
                <p className="text-gray-700">
                  Apaixonada pelo novo - novas leituras, novas pessoas, novos desafios.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-bold text-isabel-blue mb-3">Família</h3>
                <p className="text-gray-700">
                  Deus e minha família são meu porto seguro.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-bold text-isabel-orange mb-3">Resiliência</h3>
                <p className="text-gray-700">
                  Minha palavra de ORDEM é resiliência.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-bold text-isabel-blue mb-3">Integridade</h3>
                <p className="text-gray-700">
                  Não aceito injustiças. Valorizo a integridade, a igualdade e o respeito.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-bold text-isabel-orange mb-3">Humanização</h3>
                <p className="text-gray-700">
                  Acredito no poder da humanização nos relacionamentos profissionais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 bg-isabel-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Especializações</h2>
            <p className="text-xl text-gray-600">Áreas de expertise e conhecimento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Badge variant="outline" className="text-center p-4 text-lg border-isabel-orange text-isabel-orange">
              Recrutamento e Seleção
            </Badge>
            <Badge variant="outline" className="text-center p-4 text-lg border-isabel-blue text-isabel-blue">
              Consultoria em RH
            </Badge>
            <Badge variant="outline" className="text-center p-4 text-lg border-isabel-orange text-isabel-orange">
              Análise Comportamental DISC
            </Badge>
            <Badge variant="outline" className="text-center p-4 text-lg border-isabel-blue text-isabel-blue">
              Coaching Integral Sistêmico
            </Badge>
            <Badge variant="outline" className="text-center p-4 text-lg border-isabel-orange text-isabel-orange">
              Gestão de Pessoas
            </Badge>
            <Badge variant="outline" className="text-center p-4 text-lg border-isabel-blue text-isabel-blue">
              Cultura Organizacional
            </Badge>
          </div>
        </div>
      </section>
    </Layout>
  );
}
