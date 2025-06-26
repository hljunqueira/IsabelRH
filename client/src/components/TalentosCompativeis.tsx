import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, FileText, UserPlus } from "lucide-react";
import type { BancoTalentos } from "@shared/schema";

interface TalentosCompativeisProps {
  vagaArea?: string | null;
}

export default function TalentosCompativeis({ vagaArea }: TalentosCompativeisProps) {
  const { data: talentos = [], isLoading } = useQuery<BancoTalentos[]>({
    queryKey: [`/api/banco-talentos/compativel/${vagaArea}`],
    enabled: !!vagaArea,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!vagaArea) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Selecione uma vaga para ver talentos compatíveis</p>
      </div>
    );
  }

  if (talentos.length === 0) {
    return (
      <div className="text-center py-8">
        <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Nenhum talento compatível encontrado</p>
        <p className="text-sm text-gray-500">
          Não há candidatos no banco de talentos interessados em {vagaArea}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          Talentos do Banco de Talentos
        </h4>
        <p className="text-sm text-blue-800">
          Estes candidatos demonstraram interesse em vagas de {vagaArea} e podem ser contatados 
          para esta oportunidade.
        </p>
      </div>

      {talentos.map((talento) => (
        <Card key={talento.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-medium">{talento.nome}</h4>
                <Badge variant="secondary">Banco de Talentos</Badge>
                <Badge variant="outline">{talento.areaInteresse}</Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {talento.email}
                </span>
                {talento.telefone && (
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {talento.telefone}
                  </span>
                )}
              </div>

              {talento.curriculoUrl && (
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-1" />
                  <a 
                    href={talento.curriculoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver currículo
                  </a>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
              {talento.curriculoUrl && (
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver CV
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Dica:</strong> Ao entrar em contato com candidatos do banco de talentos, 
          mencione a vaga específica e por que o perfil deles se encaixa na oportunidade.
        </p>
      </div>
    </div>
  );
}