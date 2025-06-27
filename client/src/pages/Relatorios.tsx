import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  FileBarChart, 
  Download, 
  ArrowLeft, 
  Calendar,
  Filter,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
  FileSpreadsheet,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

export default function Relatorios() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [filtros, setFiltros] = useState({
    periodo: '30',
    tipoRelatorio: 'geral',
    formato: 'pdf'
  });
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      carregarDados();
    }
  }, [user?.id, filtros.periodo]);

  const carregarDados = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/relatorios/empresa/${user.id}?periodo=${filtros.periodo}`);
      const data = await response.json();
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setDados(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportarRelatorio = async () => {
    if (!dados || !user?.id) {
      toast({
        title: "Dados insuficientes",
        description: "Não há dados suficientes para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/relatorios/exportar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId: user.id,
          tipo: filtros.tipoRelatorio,
          formato: filtros.formato,
          periodo: filtros.periodo
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${filtros.tipoRelatorio}-${new Date().toISOString().split('T')[0]}.${filtros.formato}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Relatório exportado",
          description: "Download iniciado com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportarExcel = () => {
    setFiltros({ ...filtros, formato: 'xlsx' });
    handleExportarRelatorio();
  };

  const handleExportarPDF = () => {
    setFiltros({ ...filtros, formato: 'pdf' });
    handleExportarRelatorio();
  };

  const handleExportarCSV = () => {
    setFiltros({ ...filtros, formato: 'csv' });
    handleExportarRelatorio();
  };

  const renderKPICard = (titulo: string, valor: string | number, icone: React.ReactNode, tendencia?: 'up' | 'down' | 'neutral') => {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{titulo}</p>
              <p className="text-2xl font-bold">{valor}</p>
            </div>
            <div className="flex items-center gap-2">
              {tendencia === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {tendencia === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
              {tendencia === 'neutral' && <Minus className="h-4 w-4 text-gray-500" />}
              {icone}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEstadoVazio = (titulo: string, descricao: string, icone: React.ReactNode) => {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="mb-4 flex justify-center">
          {icone}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{titulo}</h3>
        <p className="text-gray-500">{descricao}</p>
      </div>
    );
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
            
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Relatórios & Dashboards</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Visualize KPIs de recrutamento, gráficos de desempenho, relatórios mensais e exporte dados para análise.
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select value={filtros.periodo} onValueChange={(value) => setFiltros({ ...filtros, periodo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 3 meses</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoRelatorio">Tipo de Relatório</Label>
                <Select value={filtros.tipoRelatorio} onValueChange={(value) => setFiltros({ ...filtros, tipoRelatorio: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="geral">Relatório Geral</SelectItem>
                    <SelectItem value="candidatos">Candidatos</SelectItem>
                    <SelectItem value="vagas">Vagas</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={carregarDados} disabled={loading} className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="graficos">Gráficos</TabsTrigger>
            <TabsTrigger value="exportacao">Exportação</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* KPIs Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {renderKPICard(
                "Total de Vagas", 
                dados?.totalVagas || "0", 
                <Briefcase className="h-5 w-5 text-blue-500" />,
                "neutral"
              )}
              {renderKPICard(
                "Candidatos Ativos", 
                dados?.candidatosAtivos || "0", 
                <Users className="h-5 w-5 text-green-500" />,
                "neutral"
              )}
              {renderKPICard(
                "Taxa Conversão", 
                dados?.taxaConversao ? `${dados.taxaConversao}%` : "-", 
                <TrendingUp className="h-5 w-5 text-purple-500" />,
                "neutral"
              )}
              {renderKPICard(
                "Tempo Médio", 
                dados?.tempoMedio || "-", 
                <Calendar className="h-5 w-5 text-orange-500" />,
                "neutral"
              )}
            </div>

            {/* Resumo Rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Período</CardTitle>
              </CardHeader>
              <CardContent>
                {dados ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Principais Métricas</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Vagas publicadas: {dados.vagasPublicadas || 0}</li>
                        <li>• Candidaturas recebidas: {dados.candidaturasRecebidas || 0}</li>
                        <li>• Entrevistas realizadas: {dados.entrevistasRealizadas || 0}</li>
                        <li>• Contratações efetivadas: {dados.contratacoesEfetivadas || 0}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Performance</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Média de candidatos por vaga: {dados.mediaCandidatosPorVaga || "-"}</li>
                        <li>• Tempo médio de processo: {dados.tempoMedioProcesso || "-"}</li>
                        <li>• Taxa de aprovação: {dados.taxaAprovacao ? `${dados.taxaAprovacao}%` : "-"}</li>
                        <li>• Satisfação candidatos: {dados.satisfacaoCandidatos || "-"}</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  renderEstadoVazio(
                    "Dados insuficientes",
                    "Publique vagas e receba candidaturas para visualizar relatórios detalhados.",
                    <BarChart3 className="h-12 w-12 text-gray-400" />
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>KPIs Principais</CardTitle>
                </CardHeader>
                <CardContent>
                  {dados ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Time to Fill</span>
                        <span className="font-bold">{dados.timeToFill || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cost per Hire</span>
                        <span className="font-bold">{dados.costPerHire || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Quality of Hire</span>
                        <span className="font-bold">{dados.qualityOfHire || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Source Effectiveness</span>
                        <span className="font-bold">{dados.sourceEffectiveness || "-"}</span>
                      </div>
                    </div>
                  ) : (
                    renderEstadoVazio(
                      "KPIs indisponíveis",
                      "Dados insuficientes para calcular KPIs de recrutamento.",
                      <PieChart className="h-12 w-12 text-gray-400" />
                    )
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  {dados ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Taxa de Retenção</span>
                        <span className="font-bold">{dados.taxaRetencao ? `${dados.taxaRetencao}%` : "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Diversidade</span>
                        <span className="font-bold">{dados.indiceDiversidade || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>NPS Candidatos</span>
                        <span className="font-bold">{dados.npsCandidatos || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>ROI Recrutamento</span>
                        <span className="font-bold">{dados.roiRecrutamento || "-"}</span>
                      </div>
                    </div>
                  ) : (
                    renderEstadoVazio(
                      "Métricas indisponíveis",
                      "Dados insuficientes para calcular métricas adicionais.",
                      <Activity className="h-12 w-12 text-gray-400" />
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="graficos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Recrutamento</CardTitle>
                </CardHeader>
                <CardContent>
                  {dados ? (
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-600">
                      Gráfico do funil de recrutamento será exibido aqui
                    </div>
                  ) : (
                    renderEstadoVazio(
                      "Funil indisponível",
                      "Dados insuficientes para gerar gráfico do funil.",
                      <BarChart3 className="h-12 w-12 text-gray-400" />
                    )
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  {dados ? (
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-600">
                      Gráfico de performance temporal será exibido aqui
                    </div>
                  ) : (
                    renderEstadoVazio(
                      "Performance indisponível",
                      "Dados insuficientes para gerar gráfico de performance.",
                      <TrendingUp className="h-12 w-12 text-gray-400" />
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exportacao">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="h-5 w-5" />
                  Exportação de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={handleExportarPDF}
                    disabled={loading}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4" />
                    Exportar PDF
                  </Button>
                  
                  <Button 
                    onClick={handleExportarExcel}
                    disabled={loading}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Exportar Excel
                  </Button>
                  
                  <Button 
                    onClick={handleExportarCSV}
                    disabled={loading}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Formatos Disponíveis</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>PDF:</strong> Relatório formatado para impressão e apresentação</li>
                    <li>• <strong>Excel:</strong> Planilha com dados para análise detalhada</li>
                    <li>• <strong>CSV:</strong> Dados brutos para importação em outras ferramentas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 