import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trophy, 
  Star, 
  Users, 
  Filter, 
  Download, 
  RefreshCw,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Settings,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Briefcase,
  Plus,
  ArrowLeft,
  Search,
  Brain
} from 'lucide-react';
import RankingCandidatos from '@/components/RankingCandidatos';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  area: string;
  status: string;
}

interface EstatisticasRanking {
  totalCandidatos: number;
  mediaScore: number;
  candidatosAltoScore: number;
  candidatosMedioScore: number;
  candidatosBaixoScore: number;
}

export default function RankingInteligente() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('ranking');
  const [vagaSelecionada, setVagaSelecionada] = useState<string>('');
  const [candidatosRanking, setCandidatosRanking] = useState<any[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasRanking | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    scoreMinimo: 0,
    perfilDisc: '',
    localizacao: '',
    experiencia: ''
  });

  const [vagas, setVagas] = useState<any[]>([]);
  const [loadingVagas, setLoadingVagas] = useState(false);
  const [showIAModal, setShowIAModal] = useState(false);
  const [showNovaBuscaModal, setShowNovaBuscaModal] = useState(false);
  const [filtrosBusca, setFiltrosBusca] = useState({
    cargo: '',
    localizacao: '',
    experienciaMin: '',
    salarioMax: '',
    modalidade: '',
    nivel: ''
  });
  const [empresa, setEmpresa] = useState<any>(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);

  // Critérios da vaga baseados na vaga selecionada
  const getCriteriosVaga = () => {
    const vagaAtual = vagas.find(v => v.id === vagaSelecionada);
    if (!vagaAtual) return null;
    
    return {
      titulo: vagaAtual.titulo,
      cidade: vagaAtual.cidade,
      estado: vagaAtual.estado,
      modalidade: vagaAtual.modalidade || 'não informado',
      nivel: vagaAtual.nivel || 'não informado'
    };
  };

  useEffect(() => {
    if (user?.id) {
      carregarVagas();
      carregarEmpresa();
    }
  }, [user?.id]);

  useEffect(() => {
    if (vagaSelecionada) {
      carregarRanking(vagaSelecionada);
    }
  }, [vagaSelecionada]);

  const carregarVagas = async () => {
    if (!user?.id) return;
    
    setLoadingVagas(true);
    try {
      const response = await fetch(`/api/vagas/empresa/${user.id}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setVagas(data);
        // Selecionar a primeira vaga se houver
        if (data.length > 0 && !vagaSelecionada) {
          setVagaSelecionada(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      setVagas([]);
    } finally {
      setLoadingVagas(false);
    }
  };

  const carregarEmpresa = async () => {
    if (!user?.id) return;
    
    setLoadingEmpresa(true);
    try {
      const response = await fetch(`/api/empresas/${user.id}`);
      const data = await response.json();
      setEmpresa(data);
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      setEmpresa(null);
    } finally {
      setLoadingEmpresa(false);
    }
  };

  // Verifica se o perfil está completo
  const isProfileComplete = () => {
    if (!empresa) return false;
    return empresa.nome && 
           empresa.telefone && 
           empresa.cidade && 
           empresa.estado && 
           empresa.endereco &&
           empresa.descricao;
  };

  const handleNovaVaga = () => {
    if (!isProfileComplete()) {
      toast({
        title: "Perfil incompleto",
        description: "Por favor, complete seu perfil empresarial antes de publicar vagas. Clique em 'Voltar' e acesse a aba 'Perfil da Empresa'.",
        variant: "destructive",
      });
      return;
    }
    // Redirecionar para a área da empresa na aba de vagas
    setLocation('/empresa?tab=vagas');
  };

  const carregarRanking = async (vagaId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vagas/${vagaId}/candidatos-ranking`);
      const data = await response.json();
      
      // Verificar se os dados são válidos
      if (Array.isArray(data)) {
        setCandidatosRanking(data);
        calcularEstatisticas(data);
      } else {
        console.warn('Dados recebidos não são um array:', data);
        setCandidatosRanking([]);
        calcularEstatisticas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      setCandidatosRanking([]);
      calcularEstatisticas([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (candidatos: any[]) => {
    if (candidatos.length === 0) {
      setEstatisticas(null);
      return;
    }

    const mediaScore = candidatos.reduce((acc, cand) => acc + cand.score, 0) / candidatos.length;
    const candidatosAltoScore = candidatos.filter(c => c.score >= 80).length;
    const candidatosMedioScore = candidatos.filter(c => c.score >= 60 && c.score < 80).length;
    const candidatosBaixoScore = candidatos.filter(c => c.score < 60).length;

    setEstatisticas({
      totalCandidatos: candidatos.length,
      mediaScore: Math.round(mediaScore),
      candidatosAltoScore,
      candidatosMedioScore,
      candidatosBaixoScore
    });
  };

  const aplicarFiltros = () => {
    // Implementar filtros no frontend ou fazer nova requisição
    console.log('Aplicando filtros:', filtros);
  };

  const exportarRanking = () => {
    const csvContent = candidatosRanking.map(candidato => 
      `${candidato.candidato.nome},${candidato.score},${candidato.classificacao}`
    ).join('\n');
    
    const blob = new Blob([`Nome,Score,Classificação\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ranking-${vagaSelecionada}.csv`;
    a.click();
  };

  const obterVagaAtual = () => {
    return vagas.find(v => v.id === vagaSelecionada);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation('/empresa')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">Ranking Inteligente</h1>
            <p className="text-gray-600">Encontre os melhores candidatos com IA avançada</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Dialog open={showIAModal} onOpenChange={setShowIAModal}>
            <DialogTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-2 cursor-pointer hover:bg-blue-50">
                <Star className="h-4 w-4" />
                IA Avançada
              </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Inteligência Artificial Avançada
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Como Funciona</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• <strong>Análise DISC:</strong> Avalia compatibilidade de perfil</li>
                    <li>• <strong>Match de Habilidades:</strong> Compara competências técnicas</li>
                    <li>• <strong>Análise de Experiência:</strong> Pondera anos de atuação</li>
                    <li>• <strong>Localização:</strong> Considera proximidade geográfica</li>
                    <li>• <strong>Expectativa Salarial:</strong> Analisa compatibilidade financeira</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Benefícios</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Redução de 70% no tempo de triagem</li>
                    <li>• 85% de precisão no match candidato-vaga</li>
                    <li>• Ranking automático por compatibilidade</li>
                    <li>• Análise imparcial e baseada em dados</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNovaBuscaModal} onOpenChange={setShowNovaBuscaModal}>
            <DialogTrigger asChild>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Nova Busca
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-orange-500" />
                  Busca Avançada de Candidatos
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input 
                    id="cargo"
                    placeholder="Ex: Desenvolvedor, Analista..."
                    value={filtrosBusca.cargo}
                    onChange={(e) => setFiltrosBusca({...filtrosBusca, cargo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input 
                    id="localizacao"
                    placeholder="Cidade, Estado"
                    value={filtrosBusca.localizacao}
                    onChange={(e) => setFiltrosBusca({...filtrosBusca, localizacao: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="experiencia">Experiência Mínima</Label>
                  <Select value={filtrosBusca.experienciaMin} onValueChange={(value) => setFiltrosBusca({...filtrosBusca, experienciaMin: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="0">Sem experiência</SelectItem>
                      <SelectItem value="1">1+ anos</SelectItem>
                      <SelectItem value="2">2+ anos</SelectItem>
                      <SelectItem value="3">3+ anos</SelectItem>
                      <SelectItem value="5">5+ anos</SelectItem>
                      <SelectItem value="10">10+ anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salario">Salário Máximo</Label>
                  <Input 
                    id="salario"
                    placeholder="Ex: 5000, 10000"
                    type="number"
                    value={filtrosBusca.salarioMax}
                    onChange={(e) => setFiltrosBusca({...filtrosBusca, salarioMax: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="modalidade">Modalidade</Label>
                  <Select value={filtrosBusca.modalidade} onValueChange={(value) => setFiltrosBusca({...filtrosBusca, modalidade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nivel">Nível</Label>
                  <Select value={filtrosBusca.nivel} onValueChange={(value) => setFiltrosBusca({...filtrosBusca, nivel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="estagio">Estágio</SelectItem>
                      <SelectItem value="junior">Júnior</SelectItem>
                      <SelectItem value="pleno">Pleno</SelectItem>
                      <SelectItem value="senior">Sênior</SelectItem>
                      <SelectItem value="especialista">Especialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowNovaBuscaModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  console.log('Aplicando busca avançada:', filtrosBusca);
                  // Aqui implementaria a busca real
                  setShowNovaBuscaModal(false);
                }}>
                  Buscar Candidatos
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Ranking
          </TabsTrigger>
          <TabsTrigger value="vagas" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Vagas ({vagas.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-6">
          {/* Seletor de Vaga */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Selecionar Vaga para Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingVagas ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : vagas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vagas.map((vaga) => (
                    <div
                      key={vaga.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        vagaSelecionada === vaga.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setVagaSelecionada(vaga.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{vaga.titulo}</h3>
                          <p className="text-sm text-gray-500">{vaga.cidade}, {vaga.estado}</p>
                        </div>
                        <Badge variant="secondary">0 candidatos</Badge>
                      </div>
                      
                      {vagaSelecionada === vaga.id && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Star className="h-4 w-4" />
                            Vaga selecionada
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma vaga publicada encontrada</p>
                  <p className="text-sm">Publique vagas para usar o sistema de ranking</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Critérios da Vaga */}
          {getCriteriosVaga() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Critérios da Vaga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Título</h4>
                    <p className="text-sm text-gray-600">{getCriteriosVaga()?.titulo}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Nível</h4>
                    <p className="text-sm text-gray-600 capitalize">{getCriteriosVaga()?.nivel}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Localização</h4>
                    <p className="text-sm text-gray-600">{getCriteriosVaga()?.cidade}, {getCriteriosVaga()?.estado}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Modalidade</h4>
                    <p className="text-sm text-gray-600 capitalize">{getCriteriosVaga()?.modalidade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ranking de Candidatos */}
          {vagaSelecionada && (
            <RankingCandidatos 
              vagaId={vagaSelecionada}
            />
          )}
        </TabsContent>

        <TabsContent value="vagas" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gerenciar Vagas</h2>
            <div className="flex items-center gap-2">
              {!isProfileComplete() && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  Perfil incompleto
                </Badge>
              )}
              <Button onClick={handleNovaVaga}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Vaga
              </Button>
            </div>
          </div>

          {vagas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vagas.map((vaga) => (
                <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{vaga.titulo}</CardTitle>
                        <p className="text-sm text-gray-500">{vaga.cidade}, {vaga.estado}</p>
                      </div>
                      <Badge variant="outline">0 candidatos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{vaga.cidade}, {vaga.estado}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Modalidade: {vaga.modalidade || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span>Nível: {vaga.nivel || 'Não informado'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setVagaSelecionada(vaga.id);
                          setActiveTab('ranking');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Ranking
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma vaga publicada</p>
              <p className="text-sm">Publique vagas para começar a usar o sistema de ranking</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Total de Candidatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {estatisticas ? estatisticas.totalCandidatos : '-'}
                </div>
                <p className="text-sm text-gray-500">
                  {estatisticas ? 'Candidatos analisados' : 'Aguardando dados'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-500" />
                  Match Alto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {estatisticas ? estatisticas.candidatosAltoScore : '-'}
                </div>
                <p className="text-sm text-gray-500">Score maior que 80%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Vagas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{vagas.length}</div>
                <p className="text-sm text-gray-500">Vagas publicadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Score Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {estatisticas ? `${estatisticas.mediaScore}%` : '-'}
                </div>
                <p className="text-sm text-gray-500">Média dos candidatos</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Habilidades Procuradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Dados insuficientes</p>
                  <p className="text-sm">Publique mais vagas para ver análises de habilidades</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Região</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Dados insuficientes</p>
                  <p className="text-sm">Receba mais candidaturas para ver análises regionais</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Algoritmo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Peso das Habilidades</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="40" 
                    className="w-full mt-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>40%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Peso da Experiência</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="30" 
                    className="w-full mt-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>30%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Peso da Localização</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="20" 
                    className="w-full mt-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>20%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Peso da Educação</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="10" 
                    className="w-full mt-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtros Automáticos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Score Mínimo</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Experiência Mínima</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Localização</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disponibilidade</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expectativa Salarial</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certificações</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Novos Candidatos</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Match Alto</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ranking Atualizado</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Relatórios Semanais</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Exportar Configurações
                </Button>
                <Button variant="outline" className="w-full">
                  Importar Configurações
                </Button>
                <Button variant="outline" className="w-full">
                  Restaurar Padrões
                </Button>
                <Button variant="outline" className="w-full">
                  Backup Completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 