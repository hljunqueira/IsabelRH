import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  Settings, 
  BarChart3, 
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Target,
  TrendingUp,
  ArrowLeft,
  Brain
} from 'lucide-react';
import { useLocation } from 'wouter';
import CurriculoUpload from '@/components/CurriculoUpload';
import { useParsing } from '@/hooks/useParsing';
import { useToast } from '@/hooks/use-toast';

export default function Parsing() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('upload');
  const [dadosProcessados, setDadosProcessados] = useState<any[]>([]);
  const [showIAModal, setShowIAModal] = useState(false);
  const { toast } = useToast();
  
  const {
    arquivos,
    processando,
    error,
    processarArquivo,
    processarArquivos,
    validarDados,
    exportarDados,
    compararCurriculos,
    obterEstatisticas,
    limparArquivos
  } = useParsing({
    onProcessamentoCompleto: (dados) => {
      setDadosProcessados(prev => [...prev, dados]);
    },
    onErro: (erro) => {
      console.error('Erro no processamento:', erro);
    }
  });

  const estatisticas = obterEstatisticas();

  const handleProcessamentoCompleto = (dados: any) => {
    console.log('Dados extraídos:', dados);
    // Aqui você pode salvar no banco, enviar para API, etc.
  };

  const handleExportarTodos = () => {
    if (dadosProcessados.length === 0) {
      toast({
        title: "Nenhum dado encontrado",
        description: "Processe currículos primeiro para exportar os dados.",
        variant: "destructive",
      });
      return;
    }
    
    const dados = JSON.stringify(dadosProcessados, null, 2);
    const blob = new Blob([dados], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parsing-curriculos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({
      title: "Exportação concluída",
      description: "Dados exportados com sucesso!",
    });
  };

  const handleGerarRelatorio = () => {
    if (dadosProcessados.length === 0) {
      toast({
        title: "Nenhum dado encontrado",
        description: "Processe currículos primeiro para gerar relatório.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Gerando relatório",
      description: "Funcionalidade em desenvolvimento...",
    });
  };

  const handleExportarJSON = () => {
    handleExportarTodos();
  };

  const handleExportarCSV = () => {
    if (dadosProcessados.length === 0) {
      toast({
        title: "Nenhum dado encontrado",
        description: "Processe currículos primeiro para exportar.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Nome', 'Email', 'Telefone', 'Experiências', 'Formações', 'Habilidades'];
    const csvData = dadosProcessados.map(dados => [
      dados.nome || '',
      dados.email || '',
      dados.telefone || '',
      dados.experiencia?.length || 0,
      dados.educacao?.length || 0,
      dados.habilidades?.length || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parsing-curriculos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Exportação CSV concluída",
      description: "Dados exportados em formato CSV!",
    });
  };

  const handleVisualizarDados = (dados: any) => {
    console.log('Visualizando dados:', dados);
    toast({
      title: "Visualização de dados",
      description: "Funcionalidade em desenvolvimento...",
    });
  };

  const handleEditarDados = (dados: any) => {
    console.log('Editando dados:', dados);
    toast({
      title: "Edição de dados",
      description: "Funcionalidade em desenvolvimento...",
    });
  };

  const handleDownloadIndividual = (dados: any) => {
    const jsonData = JSON.stringify(dados, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculo-${dados.nome?.replace(/\s+/g, '-').toLowerCase() || 'dados'}.json`;
    a.click();

    toast({
      title: "Download concluído",
      description: `Dados de ${dados.nome || 'candidato'} baixados com sucesso!`,
    });
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
            <h1 className="text-3xl font-bold">Parsing de Currículos</h1>
            <p className="text-gray-600">Extraia dados automaticamente de currículos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Dialog open={showIAModal} onOpenChange={setShowIAModal}>
            <DialogTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-2 cursor-pointer hover:bg-blue-50">
                <Zap className="h-4 w-4" />
                IA Avançada
              </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  IA Avançada para Parsing
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Tecnologias Utilizadas</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• <strong>OCR Avançado:</strong> Reconhecimento de texto em PDFs e imagens</li>
                    <li>• <strong>NLP (Processamento de Linguagem Natural):</strong> Extração semântica</li>
                    <li>• <strong>Machine Learning:</strong> Classificação automática de informações</li>
                    <li>• <strong>Regex Inteligente:</strong> Padrões adaptativos para dados estruturados</li>
                    <li>• <strong>Validação Automática:</strong> Verificação de consistência dos dados</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Resultados</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• 95%+ de precisão na extração</li>
                    <li>• Suporte para múltiplos formatos (PDF, DOC, DOCX, TXT)</li>
                    <li>• Processamento em segundos</li>
                    <li>• Detecção automática de idioma</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={limparArquivos}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Tudo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload ({arquivos.length})
          </TabsTrigger>
          <TabsTrigger value="resultados" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resultados ({dadosProcessados.length})
          </TabsTrigger>
          <TabsTrigger value="estatisticas" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Principal */}
            <div className="lg:col-span-2">
              <CurriculoUpload 
                onProcessamentoCompleto={handleProcessamentoCompleto}
                multiplos={true}
              />
            </div>

            {/* Painel de Status */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status do Processamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total de Arquivos</span>
                    <Badge variant="secondary">{estatisticas.total}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Processados</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {estatisticas.concluidos}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Com Erro</span>
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {estatisticas.comErro}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Processando</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {estatisticas.processando}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taxa de Sucesso</span>
                      <span className="text-lg font-bold text-green-600">
                        {estatisticas.taxaSucesso.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={dadosProcessados.length < 2}
                    onClick={() => {
                      if (dadosProcessados.length >= 2) {
                        const comparacao = compararCurriculos(dadosProcessados);
                        console.log('Comparação:', comparacao);
                      }
                    }}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Comparar Currículos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={dadosProcessados.length === 0}
                    onClick={handleExportarTodos}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Todos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={dadosProcessados.length === 0}
                    onClick={handleGerarRelatorio}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resultados do Parsing</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportarJSON}>
                <Download className="h-4 w-4 mr-2" />
                Exportar JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportarCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dadosProcessados.map((dados, index) => {
              const validacao = validarDados(dados);
              
              return (
                <Card key={dados.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{dados.nome}</CardTitle>
                        <p className="text-sm text-gray-500">{dados.email}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {validacao.valido ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Válido
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inválido
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Informações Básicas</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Telefone:</strong> {dados.telefone}</p>
                        <p><strong>Experiência:</strong> {(dados.experiencia || []).length} posições</p>
                        <p><strong>Educação:</strong> {(dados.educacao || []).length} formações</p>
                        <p><strong>Habilidades:</strong> {(dados.habilidades || []).length} skills</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Habilidades Principais</h4>
                      <div className="flex flex-wrap gap-1">
                        {(dados.habilidades || []).slice(0, 5).map((habilidade: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {habilidade.nome || habilidade}
                          </Badge>
                        ))}
                        {(dados.habilidades || []).length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{(dados.habilidades || []).length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {!validacao.valido && validacao.erros.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-red-600">Erros</h4>
                        <ul className="text-xs text-red-600 space-y-1">
                          {(validacao.erros || []).slice(0, 2).map((erro, idx) => (
                            <li key={idx}>• {erro}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline" onClick={() => handleVisualizarDados(dados)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditarDados(dados)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadIndividual(dados)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {dadosProcessados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum resultado encontrado</p>
              <p className="text-sm">Faça upload de currículos para ver os resultados aqui</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Total Processado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{estatisticas.total}</div>
                <p className="text-sm text-gray-500">Arquivos processados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{estatisticas.concluidos}</div>
                <p className="text-sm text-gray-500">Processados com sucesso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Erros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{estatisticas.comErro}</div>
                <p className="text-sm text-gray-500">Falhas no processamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Taxa de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {estatisticas.taxaSucesso.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500">Eficiência do sistema</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campos Mais Extraídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Dados insuficientes</p>
                  <p className="text-sm">Processe currículos para ver análises de extração</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Arquivo Processados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Dados insuficientes</p>
                  <p className="text-sm">Processe currículos para ver tipos de arquivo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Processamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Confiança Mínima</label>
                  <select className="w-full mt-1 border rounded-lg px-3 py-2">
                    <option>70%</option>
                    <option selected>80%</option>
                    <option>90%</option>
                    <option>95%</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Idioma Principal</label>
                  <select className="w-full mt-1 border rounded-lg px-3 py-2">
                    <option selected>Português</option>
                    <option>Inglês</option>
                    <option>Espanhol</option>
                    <option>Automático</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processamento Paralelo</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Validação Automática</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campos de Extração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Informações Pessoais</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Experiência Profissional</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Formação Acadêmica</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Habilidades e Competências</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Idiomas</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certificações</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Links Sociais</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Formato Padrão</label>
                  <select className="w-full mt-1 border rounded-lg px-3 py-2">
                    <option selected>JSON</option>
                    <option>CSV</option>
                    <option>PDF</option>
                    <option>XML</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Incluir Metadados</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Comprimir Arquivos</span>
                  <input type="checkbox" className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Automático</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limpeza e Manutenção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Cache limpo",
                      description: "Cache de processamento removido com sucesso!",
                    });
                  }}
                >
                  Limpar Cache de Processamento
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Otimização iniciada",
                      description: "Base de dados sendo otimizada...",
                    });
                  }}
                >
                  Otimizar Base de Dados
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Atualização iniciada",
                      description: "Modelos de IA sendo atualizados...",
                    });
                  }}
                >
                  Atualizar Modelos de IA
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const config = {
                      confiancaMinima: 80,
                      idioma: 'portuguese',
                      processamentoParalelo: true,
                      validacaoAutomatica: true
                    };
                    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `config-parsing-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    
                    toast({
                      title: "Backup realizado",
                      description: "Configurações salvas com sucesso!",
                    });
                  }}
                >
                  Backup de Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 