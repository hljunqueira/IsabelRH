import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Trash2,
  File,
  FileImage,
} from 'lucide-react';

interface ArquivoCurriculo {
  id: string;
  nome: string;
  tamanho: number;
  tipo: string;
  arquivo: File;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  progresso: number;
  dadosExtraidos?: {
    nome: string;
    email: string;
    telefone: string;
    experiencia: string[];
    educacao: string[];
    habilidades: string[];
    resumo: string;
  };
  erro?: string;
}

interface CurriculoUploadProps {
  onProcessamentoCompleto: (dados: any) => void;
  multiplos?: boolean;
}

export default function CurriculoUpload({ 
  onProcessamentoCompleto, 
  multiplos = false 
}: CurriculoUploadProps) {
  const [arquivos, setArquivos] = useState<ArquivoCurriculo[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processando, setProcessando] = useState(false);

  const formatarTamanho = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const obterIconeArquivo = (tipo: string) => {
    if (tipo.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (tipo.includes('image')) return <FileImage className="h-8 w-8 text-blue-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    adicionarArquivos(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    adicionarArquivos(files);
  };

  const adicionarArquivos = (files: File[]) => {
    const novosArquivos: ArquivoCurriculo[] = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      nome: file.name,
      tamanho: file.size,
      tipo: file.type,
      arquivo: file,
      status: 'pendente',
      progresso: 0
    }));

    if (multiplos) {
      setArquivos(prev => [...prev, ...novosArquivos]);
    } else {
      setArquivos(novosArquivos);
    }
  };

  const removerArquivo = (id: string) => {
    setArquivos(prev => prev.filter(arquivo => arquivo.id !== id));
  };

  const processarArquivo = async (arquivo: ArquivoCurriculo) => {
    setProcessando(true);
    
    // Simular processamento
    setArquivos(prev => prev.map(a => 
      a.id === arquivo.id 
        ? { ...a, status: 'processando', progresso: 0 }
        : a
    ));

    // Simular progresso
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setArquivos(prev => prev.map(a => 
        a.id === arquivo.id 
          ? { ...a, progresso: i }
          : a
      ));
    }

    // Simular dados extraídos
    const dadosExtraidos = {
      nome: 'João Silva Santos',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      experiencia: [
        'Desenvolvedor Full Stack - TechCorp (2020-2023)',
        'Desenvolvedor Frontend - StartupXYZ (2018-2020)'
      ],
      educacao: [
        'Bacharel em Ciência da Computação - USP (2014-2018)',
        'MBA em Gestão de Projetos - FGV (2019-2021)'
      ],
      habilidades: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL'
      ],
      resumo: 'Desenvolvedor com 5 anos de experiência em desenvolvimento web...'
    };

    setArquivos(prev => prev.map(a => 
      a.id === arquivo.id 
        ? { 
            ...a, 
            status: 'concluido', 
            progresso: 100, 
            dadosExtraidos 
          }
        : a
    ));

    onProcessamentoCompleto(dadosExtraidos);
    setProcessando(false);
  };

  const processarTodos = async () => {
    const arquivosPendentes = arquivos.filter(a => a.status === 'pendente');
    
    for (const arquivo of arquivosPendentes) {
      await processarArquivo(arquivo);
    }
  };

  const visualizarArquivo = (arquivo: ArquivoCurriculo) => {
    const url = URL.createObjectURL(arquivo.arquivo);
    window.open(url, '_blank');
  };

  const baixarArquivo = (arquivo: ArquivoCurriculo) => {
    const url = URL.createObjectURL(arquivo.arquivo);
    const a = document.createElement('a');
    a.href = url;
    a.download = arquivo.nome;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Currículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              Arraste e solte seus currículos aqui
            </h3>
            <p className="text-gray-500 mb-4">
              ou clique para selecionar arquivos
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={processando}
              >
                Selecionar Arquivos
              </Button>
              {arquivos.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={processarTodos}
                  disabled={processando || arquivos.every(a => a.status !== 'pendente')}
                >
                  Processar Todos
                </Button>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              multiple={multiplos}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      {arquivos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Arquivos ({arquivos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {arquivos.map((arquivo) => (
                <div
                  key={arquivo.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {/* Ícone e Info */}
                  <div className="flex items-center gap-3 flex-1">
                    {obterIconeArquivo(arquivo.tipo)}
                    <div className="flex-1">
                      <h4 className="font-medium">{arquivo.nome}</h4>
                      <p className="text-sm text-gray-500">
                        {formatarTamanho(arquivo.tamanho)} • {arquivo.tipo}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {arquivo.status === 'pendente' && (
                      <Badge variant="secondary">Pendente</Badge>
                    )}
                    {arquivo.status === 'processando' && (
                      <Badge variant="default">Processando</Badge>
                    )}
                    {arquivo.status === 'concluido' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    {arquivo.status === 'erro' && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Erro
                      </Badge>
                    )}
                  </div>

                  {/* Progresso */}
                  {arquivo.status === 'processando' && (
                    <div className="w-32">
                      <Progress value={arquivo.progresso} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{arquivo.progresso}%</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    {arquivo.status === 'pendente' && (
                      <Button
                        size="sm"
                        onClick={() => processarArquivo(arquivo)}
                        disabled={processando}
                      >
                        Processar
                      </Button>
                    )}
                    
                    {arquivo.status === 'concluido' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => visualizarArquivo(arquivo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => baixarArquivo(arquivo)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerArquivo(arquivo.id)}
                      disabled={arquivo.status === 'processando'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados Extraídos */}
      {arquivos.some(a => a.status === 'concluido' && a.dadosExtraidos) && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Extraídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {arquivos
                .filter(a => a.status === 'concluido' && a.dadosExtraidos)
                .map((arquivo) => (
                  <div key={arquivo.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{arquivo.nome}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Informações Pessoais</h5>
                        <div className="space-y-1 text-sm">
                          <p><strong>Nome:</strong> {arquivo.dadosExtraidos?.nome}</p>
                          <p><strong>Email:</strong> {arquivo.dadosExtraidos?.email}</p>
                          <p><strong>Telefone:</strong> {arquivo.dadosExtraidos?.telefone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Habilidades</h5>
                        <div className="flex flex-wrap gap-1">
                          {arquivo.dadosExtraidos?.habilidades.map((habilidade, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {habilidade}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Resumo</h5>
                        <p className="text-sm text-gray-600">{arquivo.dadosExtraidos?.resumo}</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Experiência</h5>
                        <ul className="text-sm space-y-1">
                          {arquivo.dadosExtraidos?.experiencia.map((exp, index) => (
                            <li key={index} className="text-gray-600">• {exp}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Educação</h5>
                        <ul className="text-sm space-y-1">
                          {arquivo.dadosExtraidos?.educacao.map((edu, index) => (
                            <li key={index} className="text-gray-600">• {edu}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 