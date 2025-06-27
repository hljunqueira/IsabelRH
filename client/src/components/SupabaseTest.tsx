import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('loading');
      
      // Testar conexão básica
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      setUserCount(count || 0);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Erro desconhecido');
    }
  };

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      console.log('Auth test:', data);
      alert('Teste de autenticação bem-sucedido!');
    } catch (err: any) {
      alert(`Erro no teste de autenticação: ${err.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔗 Teste de Conexão Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status da Conexão:</span>
          {status === 'loading' && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Testando...</span>
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge variant="outline" className="text-green-600">Conectado</Badge>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <Badge variant="outline" className="text-red-600">Erro</Badge>
            </div>
          )}
        </div>

        {status === 'success' && (
          <div className="text-sm text-gray-600">
            Usuários no banco: <strong>{userCount}</strong>
          </div>
        )}

        {status === 'error' && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            <strong>Erro:</strong> {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            variant="outline" 
            size="sm"
            disabled={status === 'loading'}
          >
            Testar Novamente
          </Button>
          <Button 
            onClick={testAuth} 
            variant="outline" 
            size="sm"
          >
            Testar Auth
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>URL: {import.meta.env.VITE_SUPABASE_URL}</p>
          <p>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'}</p>
        </div>
      </CardContent>
    </Card>
  );
} 