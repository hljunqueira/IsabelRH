import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  X, 
  User, 
  Building, 
  Search,
  ChevronDown
} from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImage from "@assets/475938809_597105653108037_9024041851945984459_n_1750906819330.jpg";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, signOut } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/quem-somos", label: "Quem Somos" },
    { path: "/servicos", label: "Serviços" },
    { path: "/contato", label: "Contato" },
  ];

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Buscar em vagas, candidatos e empresas simultaneamente
      const [vagasRes, candidatosRes, empresasRes] = await Promise.all([
        fetch(`/api/vagas?search=${encodeURIComponent(query)}&limit=3`),
        fetch(`/api/admin/candidatos?search=${encodeURIComponent(query)}&limit=2`),
        fetch(`/api/admin/empresas?search=${encodeURIComponent(query)}&limit=2`)
      ]);

      const vagas = vagasRes.ok ? await vagasRes.json() : [];
      const candidatos = candidatosRes.ok ? await candidatosRes.json() : [];
      const empresas = empresasRes.ok ? await empresasRes.json() : [];

      const results = [
        ...vagas.map((item: any) => ({ ...item, type: 'vaga' })),
        ...candidatos.map((item: any) => ({ ...item, type: 'candidato' })),
        ...empresas.map((item: any) => ({ ...item, type: 'empresa' }))
      ];

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Isabel Cunha RH" 
                  className="w-10 h-10 object-cover"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-isabel-blue">Isabel Cunha RH</span>
            </Link>
            <a 
              href="https://instagram.com/isabelcunhaconsutoriarh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-3 p-2 text-isabel-orange hover:text-isabel-orange/80 transition-colors"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar vagas, empresas..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 w-64 bg-white/90 border-gray-200 focus:border-isabel-blue"
                  onFocus={() => setShowSearchResults(searchResults.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                      onClick={() => {
                        if (result.type === 'vaga') {
                          window.location.href = '/candidato';
                        } else if (result.type === 'candidato') {
                          window.location.href = '/admin';
                        } else if (result.type === 'empresa') {
                          window.location.href = '/admin';
                        }
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {result.type === 'vaga' && <Building className="h-4 w-4 text-isabel-blue" />}
                        {result.type === 'candidato' && <User className="h-4 w-4 text-isabel-orange" />}
                        {result.type === 'empresa' && <Building className="h-4 w-4 text-green-600" />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {result.type === 'vaga' ? result.titulo : result.nome || result.nomeEmpresa}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {result.type === 'vaga' && `${result.empresa} - ${result.cidade}`}
                            {result.type === 'candidato' && result.email}
                            {result.type === 'empresa' && result.setor}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {result.type === 'vaga' ? 'Vaga' : result.type === 'candidato' ? 'Candidato' : 'Empresa'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchResults.length > 0 && (
                    <div className="p-3 text-center border-t bg-gray-50">
                      <Link href="/admin">
                        <Button variant="ghost" size="sm" className="text-isabel-blue">
                          Ver todos os resultados
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-gray-600 hover:text-isabel-blue transition-colors duration-200 ${
                  location === item.path ? 'text-isabel-blue font-medium' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* User Menu ou Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={user.type === 'admin' ? '/admin' : user.type === 'empresa' ? '/empresa' : '/candidato'}>
                      Minha Área
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-isabel-orange hover:bg-isabel-orange/90">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full text-left justify-start px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-isabel-orange ${
                    isActive(item.path) 
                      ? "text-isabel-orange bg-isabel-orange/10" 
                      : "text-gray-800"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/login">
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
