import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Briefcase, 
  Link, 
  FileText, 
  Users, 
  Target, 
  ArrowLeft,
  Plus,
  Eye,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function Hunting() {
  const [, setLocation] = useLocation();
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('campanhas');

  // Dados simulados de campanhas
  const campanhas = [
    {
      id: '1',
      nome: 'Desenvolvedores React Senior',
      empresa: 'TechCorp',
      status: 'ativa',
      candidatos: 15,
      contactados: 8,
      interessados: 3,
      criadaEm: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Analistas de Dados',
      empresa: 'DataSolutions',
      status: 'pausada',
      candidatos: 22,
      contactados: 12,
      interessados: 5,
      criadaEm: '2024-01-10'
    }
  ];

  const templates = [
    {
      id: '1',
      nome: 'Convite Inicial LinkedIn',
      assunto: 'Oportunidade interessante na {EMPRESA}',
      conteudo: 'Olá {NOME}, vi seu perfil e acredito que você seria um ótimo fit para uma posição que estamos recrutando...',
      canal: 'linkedin'
    },
    {
      id: '2',
      nome: 'Follow-up Email',
      assunto: 'Seguimento da oportunidade - {VAGA}',
      conteudo: 'Oi {NOME}, espero que esteja bem! Gostaria de dar seguimento à nossa conversa...',
      canal: 'email'
    }
  ];

  const integracoes = [
    { nome: 'LinkedIn', status: 'conectado', tipo: 'social' },
    { nome: 'GitHub', status: 'desconectado', tipo: 'portfolio' },
    { nome: 'Behance', status: 'desconectado', tipo: 'portfolio' },
    { nome: 'Stack Overflow', status: 'desconectado', tipo: 'portfolio' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Botão de Voltar */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Admin
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-8 w-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Hunting</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Gerencie campanhas de busca ativa, integre com redes sociais e portfolios, 
            utilize templates personalizados e acompanhe o engajamento dos talentos.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="integracoes">Integrações</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="campanhas" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Campanhas de Hunting</CardTitle>
                <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Campanha
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Nova Campanha</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome da Campanha</Label>
                        <Input id="nome" placeholder="Ex: Desenvolvedores React Senior" />
                      </div>
                      <div>
                        <Label htmlFor="empresa">Empresa</Label>
                        <Input id="empresa" placeholder="Nome da empresa cliente" />
                      </div>
                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea id="descricao" placeholder="Descreva o perfil buscado..." />
                      </div>
                      <div>
                        <Label htmlFor="palavrasChave">Palavras-chave</Label>
                        <Input id="palavrasChave" placeholder="react, javascript, senior" />
                      </div>
                      <Button className="w-full">Criar Campanha</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campanhas.map((campanha) => (
                    <div key={campanha.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{campanha.nome}</h3>
                          <p className="text-sm text-gray-600">{campanha.empresa}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Criada em {new Date(campanha.criadaEm).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant={campanha.status === 'ativa' ? 'default' : 'secondary'}>
                          {campanha.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium text-blue-700">{campanha.candidatos}</div>
                          <div className="text-blue-600">Candidatos</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                          <div className="font-medium text-yellow-700">{campanha.contactados}</div>
                          <div className="text-yellow-600">Contactados</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-medium text-green-700">{campanha.interessados}</div>
                          <div className="text-green-600">Interessados</div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Enviar Mensagem
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Templates de Contato</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{template.nome}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.assunto}</p>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {template.conteudo}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {template.canal}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="outline">Usar Template</Button>
                        <Button size="sm" variant="outline">Duplicar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integracoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações com Plataformas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integracoes.map((integracao) => (
                    <div key={integracao.nome} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ExternalLink className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{integracao.nome}</h3>
                            <p className="text-sm text-gray-600 capitalize">{integracao.tipo}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {integracao.status === 'conectado' ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Conectado
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <XCircle className="h-3 w-3 mr-1" />
                              Desconectado
                            </Badge>
                          )}
                          
                          <Button size="sm" variant="ghost">
                            {integracao.status === 'conectado' ? 'Configurar' : 'Conectar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Taxa de Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">32%</div>
                  <p className="text-sm text-gray-600">Últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidatos Contactados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">127</div>
                  <p className="text-sm text-gray-600">Este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">8</div>
                  <p className="text-sm text-gray-600">Candidatos interessados</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">LinkedIn</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">65 contactados</span>
                      <Badge variant="default">45% resposta</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Email</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">38 contactados</span>
                      <Badge variant="secondary">22% resposta</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">GitHub</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">24 contactados</span>
                      <Badge variant="outline">15% resposta</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 