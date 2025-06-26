import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function SeedData() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/seed-test-data") as any;
      setSuccess(true);
      toast({
        title: "Dados criados com sucesso!",
        description: `${response.candidatos} candidatos, ${response.empresas} empresas e ${response.vagas} vagas foram criados.`,
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Erro ao criar dados",
        description: error.message || "Não foi possível criar os dados de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Criar Dados de Teste</CardTitle>
          <CardDescription>
            Esta página criará dados de teste para demonstração do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!success ? (
            <>
              <div className="space-y-4 text-sm text-gray-600">
                <p>Serão criados:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>2 candidatos com perfis completos</li>
                  <li>1 empresa com dados corporativos</li>
                  <li>2 vagas de emprego ativas</li>
                  <li>2 candidaturas de exemplo</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Atenção:</strong> Esta ação só pode ser executada uma vez. 
                  Se os dados já existirem, a operação será cancelada.
                </p>
              </div>

              <Button 
                onClick={handleSeedData} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando dados...
                  </>
                ) : (
                  "Criar Dados de Teste"
                )}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Dados criados com sucesso!</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Credenciais de acesso:</strong></p>
                <div className="bg-gray-100 rounded p-3 text-left font-mono text-xs">
                  <p><strong>Admin:</strong></p>
                  <p>isabel@isabelcunha.com.br / admin123</p>
                  <br />
                  <p><strong>Candidatos:</strong></p>
                  <p>joao.silva@email.com / senha123</p>
                  <p>maria.santos@email.com / senha123</p>
                  <br />
                  <p><strong>Empresa:</strong></p>
                  <p>rh@techsolutions.com.br / senha123</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Redirecionando para login em 3 segundos...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}