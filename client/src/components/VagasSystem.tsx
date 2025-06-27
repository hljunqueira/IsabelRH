import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Heart, 
  Building, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  Star,
  Target,
  SlidersHorizontal,
  Clock,
  X
} from "lucide-react";
import type { Candidato, Vaga, Candidatura } from "@shared/schema";

interface VagasSystemProps {
  user: any;
  candidato: Candidato | undefined;
  candidaturas: Candidatura[];
  isProfileComplete: boolean;
  onJobApply: (vagaId: string) => void;
  isAlreadyApplied: (vagaId: string) => boolean;
  applyJobMutation: any;
  setActiveTab: (tab: string) => void;
}

export default function VagasSystem({
  user,
  candidato,
  candidaturas,
  isProfileComplete,
  onJobApply,
  isAlreadyApplied,
  applyJobMutation,
  setActiveTab
}: VagasSystemProps) {
  const { toast } = useToast();
  
  // Estados de filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: "",
    cidade: "",
    modalidade: "",
    salarioMin: "",
    salarioMax: "",
    nivel: "",
    apenas_destaque: false
  });
  const [sortBy, setSortBy] = useState("data_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [favoriteVagas, setFavoriteVagas] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("todas");
  
  const itemsPerPage = 6;

  // Buscar vagas
  const { data: vagas = [], isLoading: loadingVagas } = useQuery({
    queryKey: ['/api/vagas', searchTerm, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.area) params.append('area', filters.area);
      if (filters.cidade) params.append('cidade', filters.cidade);
      if (filters.modalidade) params.append('modalidade', filters.modalidade);
      if (filters.apenas_destaque) params.append('destaque', 'true');
      
      const response = await fetch(`/api/vagas?${params.toString()}`);
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Carregar favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`favoriteVagas_${user?.id}`);
    if (saved) {
      setFavoriteVagas(JSON.parse(saved));
    }
  }, [user?.id]);

  // Salvar favoritos
  const toggleFavorite = (vagaId: string) => {
    const newFavorites = favoriteVagas.includes(vagaId)
      ? favoriteVagas.filter(id => id !== vagaId)
      : [...favoriteVagas, vagaId];
    
    setFavoriteVagas(newFavorites);
    localStorage.setItem(`favoriteVagas_${user?.id}`, JSON.stringify(newFavorites));
    
    toast({
      title: favoriteVagas.includes(vagaId) ? "Vaga removida dos favoritos" : "Vaga favoritada!",
      description: favoriteVagas.includes(vagaId) ? 
        "A vaga foi removida da sua lista de favoritos." : 
        "A vaga foi adicionada aos seus favoritos.",
    });
  };

  // Filtrar vagas
  const filteredVagas = useMemo(() => {
    let result = [...vagas];

    // Filtrar por tab
    if (currentTab === "favoritas") {
      result = result.filter(vaga => favoriteVagas.includes(vaga.id));
    } else if (currentTab === "candidatadas") {
      result = result.filter(vaga => isAlreadyApplied(vaga.id));
    } else if (currentTab === "recomendadas") {
      // Recomendar baseado no perfil do candidato
      if (candidato?.areasInteresse?.length) {
        result = result.filter(vaga => 
          candidato.areasInteresse.some(area => 
            vaga.area?.toLowerCase().includes(area.toLowerCase()) ||
            vaga.titulo?.toLowerCase().includes(area.toLowerCase())
          )
        );
      }
    }

    // Ordenar
    switch (sortBy) {
      case "data_desc":
        result.sort((a, b) => new Date(b.createdAt || b.publicadoEm).getTime() - new Date(a.createdAt || a.publicadoEm).getTime());
        break;
      case "data_asc":
        result.sort((a, b) => new Date(a.createdAt || a.publicadoEm).getTime() - new Date(b.createdAt || b.publicadoEm).getTime());
        break;
      case "titulo_asc":
        result.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
    }

    return result;
  }, [vagas, currentTab, favoriteVagas, candidato, isAlreadyApplied, sortBy]);

  // Paginação
  const totalPages = Math.ceil(filteredVagas.length / itemsPerPage);
  const currentVagas = filteredVagas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, currentTab, sortBy]);

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      area: "",
      cidade: "",
      modalidade: "",
      salarioMin: "",
      salarioMax: "",
      nivel: "",
      apenas_destaque: false
    });
    setSearchTerm("");
    setSortBy("data_desc");
  };

  const areas = [
    "Tecnologia", "Marketing", "Vendas", "Financeiro", "Recursos Humanos", 
    "Design", "Educação", "Saúde", "Administração", "Engenharia"
  ];

  const cidades = [
    "Florianópolis", "São Paulo", "Rio de Janeiro", "Belo Horizonte", 
    "Porto Alegre", "Curitiba", "Brasília", "Salvador", "Recife", "Fortaleza"
  ];

  const modalidades = ["Presencial", "Remoto", "Híbrido"];

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Disponíveis</CardTitle>
            <Briefcase className="h-4 w-4 text-isabel-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vagas.length}</div>
            <p className="text-xs text-muted-foreground">Total de oportunidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritas</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteVagas.length}</div>
            <p className="text-xs text-muted-foreground">Vagas favoritadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
            <Send className="h-4 w-4 text-isabel-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidaturas.length}</div>
            <p className="text-xs text-muted-foreground">Enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recomendadas</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidato?.areasInteresse?.length ? 
                vagas.filter(vaga => 
                  candidato.areasInteresse.some(area => 
                    vaga.area?.toLowerCase().includes(area.toLowerCase()) ||
                    vaga.titulo?.toLowerCase().includes(area.toLowerCase())
                  )
                ).length : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">Para seu perfil</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cargo, empresa ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {Object.values(filters).some(f => f !== "" && f !== false) && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(f => f !== "" && f !== false).length}
                  </Badge>
                )}
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="data_desc">Mais recentes</SelectItem>
                  <SelectItem value="data_asc">Mais antigas</SelectItem>
                  <SelectItem value="titulo_asc">Título A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Painel de Filtros */}
        {showFilters && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Área</Label>
                <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({...prev, area: value}))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as áreas" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="">Todas as áreas</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Cidade</Label>
                <Select value={filters.cidade} onValueChange={(value) => setFilters(prev => ({...prev, cidade: value}))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as cidades" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="">Todas as cidades</SelectItem>
                    {cidades.map(cidade => (
                      <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Modalidade</Label>
                <Select value={filters.modalidade} onValueChange={(value) => setFilters(prev => ({...prev, modalidade: value}))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="">Todas</SelectItem>
                    {modalidades.map(modalidade => (
                      <SelectItem key={modalidade} value={modalidade}>{modalidade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Apenas destaque</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.apenas_destaque}
                    onCheckedChange={(checked) => setFilters(prev => ({...prev, apenas_destaque: checked}))}
                  />
                  <span className="text-sm">Vagas em destaque</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabs de categorias */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">
            Todas ({vagas.length})
          </TabsTrigger>
          <TabsTrigger value="recomendadas">
            Recomendadas ({candidato?.areasInteresse?.length ? 
              vagas.filter(vaga => 
                candidato.areasInteresse.some(area => 
                  vaga.area?.toLowerCase().includes(area.toLowerCase()) ||
                  vaga.titulo?.toLowerCase().includes(area.toLowerCase())
                )
              ).length : 0
            })
          </TabsTrigger>
          <TabsTrigger value="favoritas">
            Favoritas ({favoriteVagas.length})
          </TabsTrigger>
          <TabsTrigger value="candidatadas">
            Candidatadas ({candidaturas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {/* Lista de Vagas */}
          {loadingVagas ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse h-40 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : filteredVagas.length > 0 ? (
            <>
              <div className="grid gap-6">
                {currentVagas.map((vaga: Vaga) => (
                  <VagaCard 
                    key={vaga.id}
                    vaga={vaga}
                    isFavorite={favoriteVagas.includes(vaga.id)}
                    isApplied={isAlreadyApplied(vaga.id)}
                    onToggleFavorite={() => toggleFavorite(vaga.id)}
                    onApply={() => onJobApply(vaga.id)}
                    onViewDetails={() => setSelectedVaga(vaga)}
                    applyJobMutation={applyJobMutation}
                    isProfileComplete={isProfileComplete}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "bg-isabel-blue" : ""}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))
                    }
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                {currentTab === "favoritas" && (
                  <>
                    <Heart className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium">Nenhuma vaga favoritada</h3>
                    <p className="text-gray-600">
                      Clique no ❤️ das vagas que mais te interessam para salvá-las aqui.
                    </p>
                  </>
                )}
                {currentTab === "candidatadas" && (
                  <>
                    <Send className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium">Nenhuma candidatura enviada</h3>
                    <p className="text-gray-600">
                      Candidate-se às vagas que combinam com o seu perfil.
                    </p>
                  </>
                )}
                {currentTab === "recomendadas" && (
                  <>
                    <Target className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium">Nenhuma vaga recomendada</h3>
                    <p className="text-gray-600 mb-4">
                      Complete suas áreas de interesse no perfil para receber recomendações personalizadas.
                    </p>
                    <Button onClick={() => setActiveTab("perfil")}>
                      Completar perfil
                    </Button>
                  </>
                )}
                {currentTab === "todas" && (
                  <>
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium">Nenhuma vaga encontrada</h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros ou termos de busca para encontrar mais oportunidades.
                    </p>
                    {Object.values(filters).some(f => f !== "" && f !== false) && (
                      <Button variant="outline" onClick={clearFilters}>
                        Limpar filtros
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes da Vaga */}
      {selectedVaga && (
        <Dialog open={!!selectedVaga} onOpenChange={() => setSelectedVaga(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-isabel-blue" />
                    {selectedVaga.titulo}
                    {selectedVaga.destaque && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </DialogTitle>
                  <p className="text-lg text-gray-600 mt-1">{selectedVaga.empresa}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(selectedVaga.id)}
                    className={favoriteVagas.includes(selectedVaga.id) ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`h-5 w-5 ${favoriteVagas.includes(selectedVaga.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Localização</Label>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-isabel-orange" />
                    {selectedVaga.cidade}, {selectedVaga.estado}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Modalidade</Label>
                  <p className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-isabel-blue" />
                    {selectedVaga.modalidade}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Salário</Label>
                  <p className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {selectedVaga.salario || "A combinar"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Publicado em</Label>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {new Date(selectedVaga.createdAt || selectedVaga.publicadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Descrição */}
              <div>
                <Label className="text-lg font-semibold text-gray-900">Descrição da Vaga</Label>
                <div className="mt-2 prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedVaga.descricao}</p>
                </div>
              </div>
              
              {/* Requisitos */}
              {selectedVaga.requisitos && Array.isArray(selectedVaga.requisitos) && selectedVaga.requisitos.length > 0 && (
                <div>
                  <Label className="text-lg font-semibold text-gray-900">Requisitos</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedVaga.requisitos.map((req, index) => (
                      <Badge key={index} variant="secondary">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Benefícios */}
              {selectedVaga.beneficios && Array.isArray(selectedVaga.beneficios) && selectedVaga.beneficios.length > 0 && (
                <div>
                  <Label className="text-lg font-semibold text-gray-900">Benefícios</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedVaga.beneficios.map((beneficio, index) => (
                      <Badge key={index} variant="outline" className="border-green-300 text-green-700">
                        {beneficio}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ações */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {isAlreadyApplied(selectedVaga.id) && (
                    <p className="flex items-center gap-1 text-green-600">
                      <Send className="h-4 w-4" />
                      Você já se candidatou para esta vaga
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(selectedVaga.id)}
                    className={favoriteVagas.includes(selectedVaga.id) ? 
                      "border-red-300 text-red-600 hover:bg-red-50" : 
                      "border-gray-300"}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${favoriteVagas.includes(selectedVaga.id) ? "fill-current" : ""}`} />
                    {favoriteVagas.includes(selectedVaga.id) ? "Remover dos favoritos" : "Favoritar"}
                  </Button>
                  <Button 
                    onClick={() => onJobApply(selectedVaga.id)}
                    disabled={isAlreadyApplied(selectedVaga.id) || applyJobMutation.isPending || !isProfileComplete}
                    className={isAlreadyApplied(selectedVaga.id) ? "" : "bg-isabel-blue hover:bg-isabel-blue/90"}
                    variant={isAlreadyApplied(selectedVaga.id) ? "outline" : "default"}
                  >
                    {isAlreadyApplied(selectedVaga.id) ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Já Candidatado
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {applyJobMutation.isPending ? "Enviando..." : "Candidatar-se"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente Card de Vaga
interface VagaCardProps {
  vaga: Vaga;
  isFavorite: boolean;
  isApplied: boolean;
  onToggleFavorite: () => void;
  onApply: () => void;
  onViewDetails: () => void;
  applyJobMutation: any;
  isProfileComplete: boolean;
}

function VagaCard({ 
  vaga, 
  isFavorite, 
  isApplied, 
  onToggleFavorite, 
  onApply, 
  onViewDetails,
  applyJobMutation,
  isProfileComplete
}: VagaCardProps) {
  const daysAgo = Math.floor((Date.now() - new Date(vaga.createdAt || vaga.publicadoEm).getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-isabel-orange">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-isabel-blue transition-colors line-clamp-2">
                  {vaga.titulo}
                  {vaga.destaque && (
                    <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                </h3>
                <p className="text-lg text-gray-600 font-medium">{vaga.empresa}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className={`${isFavorite ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
            
            {/* Informações */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-isabel-orange" />
                <span>{vaga.cidade}, {vaga.estado}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-isabel-blue" />
                <span>{vaga.modalidade}</span>
              </div>
              {vaga.salario && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{vaga.salario}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{daysAgo === 0 ? "Hoje" : `${daysAgo} dias atrás`}</span>
              </div>
            </div>
            
            {/* Descrição */}
            <p className="text-gray-700 line-clamp-2">{vaga.descricao}</p>
            
            {/* Tags de requisitos */}
            {vaga.requisitos && Array.isArray(vaga.requisitos) && vaga.requisitos.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {vaga.requisitos.slice(0, 4).map((req, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {vaga.requisitos.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{vaga.requisitos.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Ações */}
          <div className="flex flex-col gap-2 min-w-fit">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="hover:bg-isabel-blue hover:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
            <Button 
              onClick={onApply}
              disabled={isApplied || applyJobMutation.isPending || !isProfileComplete}
              className={isApplied ? 
                "bg-green-600 hover:bg-green-700" : 
                "bg-isabel-blue hover:bg-isabel-blue/90"
              }
              size="sm"
            >
              {isApplied ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Candidatado
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {applyJobMutation.isPending ? "Enviando..." : "Candidatar-se"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 