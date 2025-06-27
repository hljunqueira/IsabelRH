import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Filter, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useLocation } from 'wouter';

interface FiltroTriagem {
  id: string;
  nome: string;
  tipo: 'score' | 'perfil_disc' | 'localizacao' | 'experiencia' | 'habilidades' | 'salario';
  operador: 'maior_igual' | 'menor_igual' | 'igual' | 'contem' | 'nao_contem';
  valor: string;
  ativo: boolean;
}

interface AcaoTriagem {
  id: string;
  nome: string;
  tipo: 'aprovar' | 'rejeitar' | 'aguardar' | 'enviar_email' | 'marcar_interesse';
  condicao: 'todos_filtros' | 'qualquer_filtro' | 'score_minimo';
  valorCondicao?: number;
  ativo: boolean;
  configuracao?: {
    templateEmail?: string;
    assuntoEmail?: string;
    mensagem?: string;
  };
}

interface EstatisticasTriagem {
  totalCandidatos: number;
  aprovados: number;
  rejeitados: number;
  aguardando: number;
  taxaAprovacao: number;
  tempoMedioProcessamento: number;
}

export default function TriagemAutomatica() {
  const [, setLocation] = useLocation();
  const [vagas, setVagas] = useState<any[]>([]);
  const [vagaSelecionada, setVagaSelecionada] = useState<string>('');
  const [filtros, setFiltros] = useState<FiltroTriagem[]>([]);
  const [acoes, setAcoes] = useState<AcaoTriagem[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasTriagem | null>(null);
  const [triagemAtiva, setTriagemAtiva] = useState(false);
  const [loading, setLoading] = useState(false);
  const [novoFiltro, setNovoFiltro] = useState<Partial<FiltroTriagem>>({
    nome: '',
    tipo: 'score',
    operador: 'maior_igual',
    valor: '',
    ativo: true
  });
  const [novaAcao, setNovaAcao] = useState<Partial<AcaoTriagem>>({
    nome: '',
    tipo: 'aprovar',
    condicao: 'todos_filtros',
    ativo: true
  });

  useEffect(() => {
    carregarVagas();
  }, []);

  useEffect(() => {
    if (vagaSelecionada) {
      carregarConfiguracaoTriagem();
      carregarEstatisticas();
    }
  }, [vagaSelecionada]);

  const carregarVagas = async () => {
    try {
      const response = await fetch('/api/vagas');
      const data = await response.json();
      setVagas(data);
      if (data.length > 0) {
        setVagaSelecionada(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    }
  };

  const carregarConfiguracaoTriagem = async () => {
    try {
      const response = await fetch(`/api/vagas/${vagaSelecionada}/triagem-config`);
      const data = await response.json();
      setFiltros(data.filtros || []);
      setAcoes(data.acoes || []);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await fetch(`/api/vagas/${vagaSelecionada}/triagem-stats`);
      const data = await response.json();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const salvarConfiguracao = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vagas/${vagaSelecionada}/triagem-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filtros, acoes })
      });
      if (response.ok) {
        console.log('Configuração salva com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarFiltro = () => {
    if (!novoFiltro.nome || !novoFiltro.valor) return;
    
    const filtro: FiltroTriagem = {
      id: Date.now().toString(),
      nome: novoFiltro.nome,
      tipo: novoFiltro.tipo!,
      operador: novoFiltro.operador!,
      valor: novoFiltro.valor,
      ativo: novoFiltro.ativo!
    };
    
    setFiltros([...filtros, filtro]);
    setNovoFiltro({
      nome: '',
      tipo: 'score',
      operador: 'maior_igual',
      valor: '',
      ativo: true
    });
  };

  const removerFiltro = (id: string) => {
    setFiltros(filtros.filter(f => f.id !== id));
  };

  const adicionarAcao = () => {
    if (!novaAcao.nome) return;
    
    const acao: AcaoTriagem = {
      id: Date.now().toString(),
      nome: novaAcao.nome,
      tipo: novaAcao.tipo!,
      condicao: novaAcao.condicao!,
      valorCondicao: novaAcao.valorCondicao,
      ativo: novaAcao.ativo!,
      configuracao: novaAcao.configuracao
    };
    
    setAcoes([...acoes, acao]);
    setNovaAcao({
      nome: '',
      tipo: 'aprovar',
      condicao: 'todos_filtros',
      ativo: true
    });
  };

  const removerAcao = (id: string) => {
    setAcoes(acoes.filter(a => a.id !== id));
  };

  const toggleTriagem = async () => {
    try {
      const response = await fetch(`/api/vagas/${vagaSelecionada}/triagem-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !triagemAtiva })
      });
      if (response.ok) {
        setTriagemAtiva(!triagemAtiva);
      }
    } catch (error) {
      console.error('Erro ao alternar triagem:', error);
    }
  };

  const executarTriagem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vagas/${vagaSelecionada}/triagem-executar`, {
        method: 'POST'
      });
      if (response.ok) {
        carregarEstatisticas();
      }
    } catch (error) {
      console.error('Erro ao executar triagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const obterVagaAtual = () => {
    return vagas.find(v => v.id === vagaSelecionada);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/empresa')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <Zap className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Triagem Automática</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Configure filtros inteligentes e ações automáticas para triar candidatos 
            de forma eficiente e consistente, reduzindo o tempo de processamento.
          </p>
        </div>

        {/* Seleção de Vaga */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Selecionar Vaga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="vaga">Vaga</Label>
                <Select value={vagaSelecionada} onValueChange={setVagaSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma vaga" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    {vagas.map((vaga) => (
                      <SelectItem key={vaga.id} value={vaga.id}>
                        {vaga.titulo} - {vaga.empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={salvarConfiguracao}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        {vagaSelecionada && (
          <>
            {/* Status da Triagem */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={triagemAtiva} 
                        onCheckedChange={toggleTriagem}
                      />
                      <Label>Triagem Automática Ativa</Label>
                    </div>
                    <Badge variant={triagemAtiva ? "default" : "secondary"}>
                      {triagemAtiva ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <Button 
                    onClick={executarTriagem}
                    disabled={loading || !triagemAtiva}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Executar Triagem
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            {estatisticas && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Processados</p>
                        <p className="text-2xl font-bold">{estatisticas.totalCandidatos}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Aprovados</p>
                        <p className="text-2xl font-bold">{estatisticas.aprovados}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Rejeitados</p>
                        <p className="text-2xl font-bold">{estatisticas.rejeitados}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Taxa Aprovação</p>
                        <p className="text-2xl font-bold">{estatisticas.taxaAprovacao}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Configuração */}
            <Tabs defaultValue="filtros" className="space-y-6">
              <TabsList>
                <TabsTrigger value="filtros" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </TabsTrigger>
                <TabsTrigger value="acoes" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Ações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="filtros">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros de Triagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Adicionar Novo Filtro */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="nomeFiltro">Nome</Label>
                        <Input
                          id="nomeFiltro"
                          value={novoFiltro.nome}
                          onChange={(e) => setNovoFiltro({ ...novoFiltro, nome: e.target.value })}
                          placeholder="Ex: Score mínimo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoFiltro">Tipo</Label>
                        <Select value={novoFiltro.tipo} onValueChange={(value) => setNovoFiltro({ ...novoFiltro, tipo: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="score">Score</SelectItem>
                            <SelectItem value="perfil_disc">Perfil DISC</SelectItem>
                            <SelectItem value="localizacao">Localização</SelectItem>
                            <SelectItem value="experiencia">Experiência</SelectItem>
                            <SelectItem value="habilidades">Habilidades</SelectItem>
                            <SelectItem value="salario">Salário</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="operadorFiltro">Operador</Label>
                        <Select value={novoFiltro.operador} onValueChange={(value) => setNovoFiltro({ ...novoFiltro, operador: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="maior_igual">≥</SelectItem>
                            <SelectItem value="menor_igual">≤</SelectItem>
                            <SelectItem value="igual">=</SelectItem>
                            <SelectItem value="contem">Contém</SelectItem>
                            <SelectItem value="nao_contem">Não contém</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="valorFiltro">Valor</Label>
                        <Input
                          id="valorFiltro"
                          value={novoFiltro.valor}
                          onChange={(e) => setNovoFiltro({ ...novoFiltro, valor: e.target.value })}
                          placeholder="Ex: 80"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={adicionarFiltro} className="w-full">
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    {/* Lista de Filtros */}
                    <div className="space-y-2">
                      {filtros.map((filtro) => (
                        <div key={filtro.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Switch 
                              checked={filtro.ativo} 
                              onCheckedChange={(checked) => {
                                setFiltros(filtros.map(f => 
                                  f.id === filtro.id ? { ...f, ativo: checked } : f
                                ));
                              }}
                            />
                            <div>
                              <p className="font-medium">{filtro.nome}</p>
                              <p className="text-sm text-gray-500">
                                {filtro.tipo} {filtro.operador} {filtro.valor}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removerFiltro(filtro.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="acoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Automáticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Adicionar Nova Ação */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="nomeAcao">Nome</Label>
                        <Input
                          id="nomeAcao"
                          value={novaAcao.nome}
                          onChange={(e) => setNovaAcao({ ...novaAcao, nome: e.target.value })}
                          placeholder="Ex: Aprovar alto score"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoAcao">Tipo</Label>
                        <Select value={novaAcao.tipo} onValueChange={(value) => setNovaAcao({ ...novaAcao, tipo: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="aprovar">Aprovar</SelectItem>
                            <SelectItem value="rejeitar">Rejeitar</SelectItem>
                            <SelectItem value="aguardar">Aguardar</SelectItem>
                            <SelectItem value="enviar_email">Enviar Email</SelectItem>
                            <SelectItem value="marcar_interesse">Marcar Interesse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="condicaoAcao">Condição</Label>
                        <Select value={novaAcao.condicao} onValueChange={(value) => setNovaAcao({ ...novaAcao, condicao: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="todos_filtros">Todos os filtros</SelectItem>
                            <SelectItem value="qualquer_filtro">Qualquer filtro</SelectItem>
                            <SelectItem value="score_minimo">Score mínimo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={adicionarAcao} className="w-full">
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    {/* Lista de Ações */}
                    <div className="space-y-2">
                      {acoes.map((acao) => (
                        <div key={acao.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Switch 
                              checked={acao.ativo} 
                              onCheckedChange={(checked) => {
                                setAcoes(acoes.map(a => 
                                  a.id === acao.id ? { ...a, ativo: checked } : a
                                ));
                              }}
                            />
                            <div>
                              <p className="font-medium">{acao.nome}</p>
                              <p className="text-sm text-gray-500">
                                {acao.tipo} - {acao.condicao}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removerAcao(acao.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
} 