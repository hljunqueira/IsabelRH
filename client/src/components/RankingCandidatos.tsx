import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Star, 
  Filter, 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Award,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Download,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatar?: string;
  localizacao: string;
  experiencia: number;
  educacao: string;
  habilidades: string[];
  score: number;
  match: number;
  status: 'disponivel' | 'empregado' | 'em_processo';
  ultimaAtividade: Date;
  curriculo: string;
  linkedin?: string;
  portfolio?: string;
  expectativaSalarial: number;
  disponibilidade: 'imediata' | '15_dias' | '30_dias' | '60_dias';
  preferencias: {
    modalidade: 'presencial' | 'hibrido' | 'remoto';
    tipoContrato: 'clt' | 'pj' | 'freelance';
    setor: string[];
  };
}

interface RankingCandidatosProps {
  vagaId?: string;
  criterios?: {
    habilidades: string[];
    experiencia: number;
    localizacao: string;
    salario: number;
    modalidade: string;
  };
}

export default function RankingCandidatos({ vagaId, criterios }: RankingCandidatosProps) {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
  const [filtros, setFiltros] = useState({
    pesquisa: '',
    scoreMinimo: 70,
    experiencia: [0, 20],
    localizacao: '',
    modalidade: '',
    disponibilidade: '',
    status: ''
  });
  const [ordenacao, setOrdenacao] = useState('score');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCandidatos();
  }, [vagaId, criterios]);

  const carregarCandidatos = async () => {
    setLoading(true);
    try {
      // Simular dados de candidatos
      const candidatosMock: Candidato[] = [
        {
          id: '1',
          nome: 'João Silva Santos',
          email: 'joao.silva@email.com',
          telefone: '(11) 99999-9999',
          avatar: '/avatar1.jpg',
          localizacao: 'São Paulo, SP',
          experiencia: 5,
          educacao: 'Bacharel em Ciência da Computação',
          habilidades: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
          score: 95,
          match: 92,
          status: 'disponivel',
          ultimaAtividade: new Date(Date.now() - 1000 * 60 * 30),
          curriculo: '/curriculo1.pdf',
          linkedin: 'linkedin.com/in/joaosilva',
          portfolio: 'joaosilva.dev',
          expectativaSalarial: 8000,
          disponibilidade: 'imediata',
          preferencias: {
            modalidade: 'hibrido',
            tipoContrato: 'clt',
            setor: ['Tecnologia', 'E-commerce']
          }
        },
        {
          id: '2',
          nome: 'Maria Costa Oliveira',
          email: 'maria.costa@email.com',
          telefone: '(11) 88888-8888',
          avatar: '/avatar2.jpg',
          localizacao: 'Campinas, SP',
          experiencia: 3,
          educacao: 'Tecnólogo em Análise e Desenvolvimento',
          habilidades: ['React', 'Vue.js', 'JavaScript', 'CSS', 'HTML'],
          score: 88,
          match: 85,
          status: 'disponivel',
          ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 2),
          curriculo: '/curriculo2.pdf',
          linkedin: 'linkedin.com/in/mariacosta',
          expectativaSalarial: 6000,
          disponibilidade: '15_dias',
          preferencias: {
            modalidade: 'remoto',
            tipoContrato: 'pj',
            setor: ['Startup', 'Tecnologia']
          }
        },
        {
          id: '3',
          nome: 'Pedro Almeida Lima',
          email: 'pedro.almeida@email.com',
          telefone: '(11) 77777-7777',
          avatar: '/avatar3.jpg',
          localizacao: 'Rio de Janeiro, RJ',
          experiencia: 8,
          educacao: 'Mestrado em Engenharia de Software',
          habilidades: ['Java', 'Spring', 'Microservices', 'AWS', 'Docker'],
          score: 92,
          match: 78,
          status: 'em_processo',
          ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 24),
          curriculo: '/curriculo3.pdf',
          linkedin: 'linkedin.com/in/pedroalmeida',
          expectativaSalarial: 12000,
          disponibilidade: '30_dias',
          preferencias: {
            modalidade: 'presencial',
            tipoContrato: 'clt',
            setor: ['Fintech', 'Tecnologia']
          }
        }
      ];
      setCandidatos(candidatosMock);
    } catch (error) {
      console.error('Erro ao carregar candidatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const candidatosFiltrados = candidatos
    .filter(candidato => {
      const matchPesquisa = candidato.nome.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
                           candidato.habilidades.some(h => h.toLowerCase().includes(filtros.pesquisa.toLowerCase()));
      
      const matchScore = candidato.score >= filtros.scoreMinimo;
      const matchExperiencia = candidato.experiencia >= filtros.experiencia[0] && candidato.experiencia <= filtros.experiencia[1];
      const matchLocalizacao = !filtros.localizacao || candidato.localizacao.toLowerCase().includes(filtros.localizacao.toLowerCase());
      const matchModalidade = !filtros.modalidade || filtros.modalidade === 'all' || candidato.preferencias.modalidade === filtros.modalidade;
      const matchDisponibilidade = !filtros.disponibilidade || filtros.disponibilidade === 'all' || candidato.disponibilidade === filtros.disponibilidade;
      const matchStatus = !filtros.status || filtros.status === 'all' || candidato.status === filtros.status;

      return matchPesquisa && matchScore && matchExperiencia && matchLocalizacao && matchModalidade && matchDisponibilidade && matchStatus;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'score':
          return b.score - a.score;
        case 'match':
          return b.match - a.match;
        case 'experiencia':
          return b.experiencia - a.experiencia;
        case 'atividade':
          return b.ultimaAtividade.getTime() - a.ultimaAtividade.getTime();
        default:
          return b.score - a.score;
      }
    });

  const obterCorScore = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const obterStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case 'empregado':
        return <Badge variant="secondary">Empregado</Badge>;
      case 'em_processo':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Processo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatarDisponibilidade = (disponibilidade: string) => {
    switch (disponibilidade) {
      case 'imediata': return 'Imediata';
      case '15_dias': return '15 dias';
      case '30_dias': return '30 dias';
      case '60_dias': return '60 dias';
      default: return disponibilidade;
    }
  };

  const formatarModalidade = (modalidade: string) => {
    switch (modalidade) {
      case 'presencial': return 'Presencial';
      case 'hibrido': return 'Híbrido';
      case 'remoto': return 'Remoto';
      default: return modalidade;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Filtros */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome ou habilidades..."
                  value={filtros.pesquisa}
                  onChange={(e) => setFiltros(prev => ({ ...prev, pesquisa: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Score Mínimo: {filtros.scoreMinimo}%
              </label>
              <Slider
                value={[filtros.scoreMinimo]}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, scoreMinimo: value[0] }))}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Experiência: {filtros.experiencia[0]} - {filtros.experiencia[1]} anos
              </label>
              <Slider
                value={filtros.experiencia}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, experiencia: value }))}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Localização</label>
              <Input
                placeholder="Cidade, Estado..."
                value={filtros.localizacao}
                onChange={(e) => setFiltros(prev => ({ ...prev, localizacao: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Modalidade</label>
              <Select value={filtros.modalidade} onValueChange={(value) => setFiltros(prev => ({ ...prev, modalidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as modalidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as modalidades</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Disponibilidade</label>
              <Select value={filtros.disponibilidade} onValueChange={(value) => setFiltros(prev => ({ ...prev, disponibilidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualquer disponibilidade</SelectItem>
                  <SelectItem value="imediata">Imediata</SelectItem>
                  <SelectItem value="15_dias">15 dias</SelectItem>
                  <SelectItem value="30_dias">30 dias</SelectItem>
                  <SelectItem value="60_dias">60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="empregado">Empregado</SelectItem>
                  <SelectItem value="em_processo">Em Processo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ordenar por</label>
              <Select value={ordenacao} onValueChange={setOrdenacao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="match">Match</SelectItem>
                  <SelectItem value="experiencia">Experiência</SelectItem>
                  <SelectItem value="atividade">Última Atividade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Candidatos */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ranking de Candidatos ({candidatosFiltrados.length})
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Target className="h-4 w-4" />
                {candidatosFiltrados.length > 0 && (
                  <span>Melhor match: {candidatosFiltrados[0].match}%</span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidatosFiltrados.map((candidato, index) => (
                <div
                  key={candidato.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    candidatoSelecionado?.id === candidato.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setCandidatoSelecionado(candidato)}
                >
                  <div className="flex items-start gap-4">
                    {/* Ranking */}
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      {index < 3 && <Star className="h-3 w-3 text-yellow-500" />}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidato.avatar} />
                      <AvatarFallback className="bg-gray-200">
                        {candidato.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Informações */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{candidato.nome}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {candidato.localizacao}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {candidato.experiencia} anos
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {candidato.educacao}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {obterStatusBadge(candidato.status)}
                          <Badge className={obterCorScore(candidato.score)}>
                            {candidato.score}%
                          </Badge>
                        </div>
                      </div>

                      {/* Habilidades */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidato.habilidades.slice(0, 5).map((habilidade, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {habilidade}
                          </Badge>
                        ))}
                        {candidato.habilidades.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidato.habilidades.length - 5}
                          </Badge>
                        )}
                      </div>

                      {/* Match e Preferências */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Match: {candidato.match}%
                          </span>
                          <span>R$ {candidato.expectativaSalarial.toLocaleString()}</span>
                          <span>{formatarDisponibilidade(candidato.disponibilidade)}</span>
                          <span>{formatarModalidade(candidato.preferencias.modalidade)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {candidatosFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum candidato encontrado com os filtros aplicados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes do Candidato */}
      {candidatoSelecionado && (
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Perfil Detalhado - {candidatoSelecionado.nome}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contatar
                  </Button>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Iniciar Conversa
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Informações Pessoais</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{candidatoSelecionado.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{candidatoSelecionado.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{candidatoSelecionado.localizacao}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Expectativa Salarial</h4>
                    <p className="text-lg font-bold text-green-600">
                      R$ {candidatoSelecionado.expectativaSalarial.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Disponibilidade</h4>
                    <Badge className="bg-blue-100 text-blue-800">
                      {formatarDisponibilidade(candidatoSelecionado.disponibilidade)}
                    </Badge>
                  </div>
                </div>

                {/* Habilidades e Match */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidatoSelecionado.habilidades.map((habilidade, index) => (
                      <Badge key={index} variant="secondary">
                        {habilidade}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Score de Match</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Geral</span>
                        <span className="font-medium">{candidatoSelecionado.score}%</span>
                      </div>
                      <Progress value={candidatoSelecionado.score} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Para esta vaga</span>
                        <span className="font-medium">{candidatoSelecionado.match}%</span>
                      </div>
                      <Progress value={candidatoSelecionado.match} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Preferências */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Preferências</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Modalidade</h4>
                      <Badge variant="outline">
                        {formatarModalidade(candidatoSelecionado.preferencias.modalidade)}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">Tipo de Contrato</h4>
                      <Badge variant="outline">
                        {candidatoSelecionado.preferencias.tipoContrato.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">Setores de Interesse</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidatoSelecionado.preferencias.setor.map((setor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {setor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Links</h4>
                    <div className="space-y-2">
                      {candidatoSelecionado.linkedin && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Award className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                      {candidatoSelecionado.portfolio && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Award className="h-4 w-4 mr-2" />
                          Portfolio
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Currículo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 