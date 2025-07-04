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
  const { user, signOut } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/quem-somos", label: "Quem Somos" },
    { path: "/servicos", label: "Serviços" },
    { path: "/contato", label: "Contato" },
  ];

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
                <DropdownMenuContent align="end" className="w-48 dropdown-menu-content-white bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link href={user.type === 'admin' ? '/admin' : user.type === 'empresa' ? '/empresa' : '/candidato'}>
                      Minha Área
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 hover:bg-red-50">
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
            
            {user ? (
              <div className="pt-2 border-t">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Olá, {user.name}
                </div>
                <Link href={user.type === 'admin' ? '/admin' : user.type === 'empresa' ? '/empresa' : '/candidato'}>
                  <Button
                    variant="ghost"
                    className="w-full text-left justify-start px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-isabel-orange"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Minha Área
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
