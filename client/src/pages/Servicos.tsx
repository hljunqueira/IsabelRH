import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Search, 
  Settings, 
  Brain, 
  GraduationCap,
  Check,
  Phone
} from "lucide-react";

export default function Servicos() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-isabel-accent to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-isabel-blue mb-4">Nossos Serviços</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em RH para impulsionar o crescimento da sua empresa
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Recrutamento e Seleção */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-2xl text-center text-isabel-blue">
                  Recrutamento e Seleção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-6">
                  Encontramos talentos alinhados com os valores e desafios da sua empresa. 
                  Atuamos em todo o processo: definição do perfil, hunting, triagens, 
                  entrevistas técnicas e comportamentais.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-isabel-blue mb-3">Trabalhamos com:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Sistema ATS (automatização e controle de candidatos)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Análise de Perfil Comportamental (DISC)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Banco de currículos ativo</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Integração com portais de vagas</span>
                    </li>
                  </ul>
                </div>
                
                <Link href="/contato">
                  <Button className="w-full bg-isabel-orange hover:bg-isabel-orange/90">
                    Solicitar Atendimento
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Consultoria Estratégica */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-2xl text-center text-isabel-blue">
                  Consultoria Estratégica de RH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-6">
                  Estruturamos e fortalecemos todos os subsistemas de RH da sua empresa, 
                  criando uma base sólida para o crescimento sustentável.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-isabel-blue mb-3">Nossos serviços incluem:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Diagnóstico organizacional</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Integração e Onboarding</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Avaliação de Desempenho + PDI</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Clima Organizacional e engajamento</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Estruturação de Cargos e Salários</span>
                    </li>
                  </ul>
                </div>
                
                <Link href="/contato">
                  <Button className="w-full bg-isabel-blue hover:bg-isabel-blue/90">
                    Solicitar Atendimento
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Análise Comportamental DISC */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-2xl text-center text-isabel-blue">
                  Análise Comportamental DISC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-6">
                  Utilizamos ferramentas como DISC e técnicas vivenciais para identificar o perfil ideal, 
                  reduzir a rotatividade e facilitar contratações assertivas.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-isabel-blue mb-3">Objetivos:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Selecionar profissionais compatíveis com a vaga e cultura</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Reduzir a rotatividade com contratações assertivas</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Apoiar gestores no desenvolvimento de talentos</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-orange mr-2 h-4 w-4" />
                      <span className="text-gray-700">Aplicação de testes técnicos e dinâmicas</span>
                    </li>
                  </ul>
                </div>
                
                <Link href="/contato">
                  <Button className="w-full bg-isabel-orange hover:bg-isabel-orange/90">
                    Solicitar Atendimento
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Treinamentos sob Medida */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-2xl text-center text-isabel-blue">
                  Treinamentos Sob Medida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-6">
                  Desenvolvemos competências específicas para sua equipe através de treinamentos 
                  personalizados que atendem às necessidades reais da sua empresa.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-isabel-blue mb-3">Áreas de treinamento:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Liderança e gestão de equipes</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Comunicação assertiva</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Trabalho em equipe</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-isabel-blue mr-2 h-4 w-4" />
                      <span className="text-gray-700">Desenvolvimento pessoal e profissional</span>
                    </li>
                  </ul>
                </div>
                
                <Link href="/contato">
                  <Button className="w-full bg-isabel-blue hover:bg-isabel-blue/90">
                    Solicitar Atendimento
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-isabel-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-isabel-blue mb-4">Nosso Processo Seletivo</h2>
            <p className="text-xl text-gray-600">Um processo estruturado para encontrar o candidato ideal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-20 h-20 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <CardTitle className="text-isabel-blue">Alinhamento de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Definimos junto com o cliente o perfil ideal do candidato
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-20 h-20 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <CardTitle className="text-isabel-blue">Hunting e Triagem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Busca ativa de talentos e análise inicial de currículos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-20 h-20 bg-isabel-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <CardTitle className="text-isabel-blue">Análise Comportamental</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Aplicação da metodologia DISC e testes técnicos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-20 h-20 bg-isabel-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <CardTitle className="text-isabel-blue">Apresentação Final</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Entrevista com gestor e aprovação do candidato ideal
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-isabel-blue to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para Transformar seu RH?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato conosco e descubra como podemos ajudar sua empresa a encontrar os melhores talentos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato">
              <Button size="lg" className="bg-isabel-orange hover:bg-isabel-orange/90">
                <Phone className="mr-2 h-5 w-5" />
                Solicitar Consultoria
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-isabel-blue">
              <a href="https://wa.me/5548996332952" target="_blank" rel="noopener noreferrer" className="flex items-center">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
