import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Key,
  RefreshCw
} from "lucide-react";

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function TesteForgotPassword() {
  const [email, setEmail] = useState('admin@isabelrh.com.br');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  const { success, error, warning, info } = useToast();

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setLastResult(null);
  };

  const testBackendConnection = async () => {
    addLog('🔍 Testando conexão com backend...', 'info');
    
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.status === 401) {
        addLog('✅ Backend respondendo corretamente (401 esperado)', 'success');
        return true;
      } else {
        addLog(`⚠️ Backend respondeu com status: ${response.status}`, 'warning');
        return true;
      }
    } catch (err) {
      addLog(`❌ Erro ao conectar com backend: ${err}`, 'error');
      return false;
    }
  };

  const testForgotPassword = async () => {
    if (!email.trim()) {
      warning('E-mail obrigatório', 'Por favor, digite um e-mail válido');
      return;
    }

    setLoading(true);
    addLog(`📧 Iniciando teste de recuperação para: ${email}`, 'info');

    try {
      // Primeiro testar conexão
      const connected = await testBackendConnection();
      if (!connected) {
        setLoading(false);
        return;
      }

      addLog('📡 Enviando requisição POST /api/auth/forgot-password', 'info');

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      addLog(`📊 Status HTTP: ${response.status}`, response.ok ? 'success' : 'error');
      addLog(`📄 Resposta recebida: ${JSON.stringify(data, null, 2)}`, 'info');

      setLastResult({ status: response.status, data });

      if (response.ok) {
        success('✅ Recuperação enviada!', data.message);
        
        if (data.resetToken) {
          addLog(`🔑 Token gerado: ${data.resetToken}`, 'success');
          addLog(`⏰ Expira em: ${new Date(data.resetExpires).toLocaleString('pt-BR')}`, 'info');
        }
      } else {
        error('❌ Erro na recuperação', data.message || 'Erro desconhecido');
      }

    } catch (err: any) {
      addLog(`💥 Erro na requisição: ${err.message}`, 'error');
      error('Erro de conexão', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Mail className="h-4 w-4 text-blue-600" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-700 bg-green-50';
      case 'error': return 'text-red-700 bg-red-50';
      case 'warning': return 'text-yellow-700 bg-yellow-50';
      default: return 'text-blue-700 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-isabel-accent via-white to-isabel-accent/50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-isabel-blue mb-2">
            🔐 Teste - Recuperação de Senha
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de Teste Integrado - Isabel Cunha RH
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Painel de Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-isabel-orange" />
                <span>Painel de Teste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Informações do usuário */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  👩‍💼 Usuário de Teste da Isabel
                </h3>
                <div className="space-y-1 text-sm text-yellow-700">
                  <p><strong>E-mail:</strong> <code>admin@isabelrh.com.br</code></p>
                  <p><strong>Senha atual:</strong> <code>123456</code></p>
                  <p><strong>Tipo:</strong> Administrador</p>
                </div>
              </div>

              {/* Formulário de teste */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail para recuperação:
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite o e-mail cadastrado"
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={testForgotPassword}
                    disabled={loading}
                    className="flex-1 bg-isabel-orange hover:bg-isabel-orange/90"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Testar Recuperação
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearLogs}
                    variant="outline"
                    className="border-isabel-blue text-isabel-blue hover:bg-isabel-blue hover:text-white"
                  >
                    Limpar Logs
                  </Button>
                </div>
              </div>

              {/* Resultado do último teste */}
              {lastResult && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">📊 Último Resultado:</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={lastResult.status === 200 ? "default" : "destructive"}>
                        Status: {lastResult.status}
                      </Badge>
                    </div>
                    <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                      {JSON.stringify(lastResult.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logs em Tempo Real */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-isabel-blue" />
                  <span>Logs em Tempo Real</span>
                </div>
                <Badge variant="outline">
                  {logs.length} entradas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto text-sm font-mono">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    🚀 Aguardando teste...<br />
                    Clique em "Testar Recuperação" para começar
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs ${getLogColor(log.type)}`}
                      >
                        <div className="flex items-start space-x-2">
                          {getLogIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs opacity-75">[{log.timestamp}]</span>
                            <div className="mt-1 break-words">{log.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações sobre implementação */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-isabel-blue mb-2">🔧 Implementação Atual</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Verificação no Supabase se usuário existe</li>
                  <li>• Geração de token único com expiração</li>
                  <li>• E-mail simulado (logs no console do servidor)</li>
                  <li>• Retorno seguro independente do resultado</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-isabel-blue mb-2">🚀 Próximos Passos</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Migração para Supabase Auth nativo</li>
                  <li>• E-mails reais com templates</li>
                  <li>• Página de redefinição de senha</li>
                  <li>• Rate limiting e segurança avançada</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 