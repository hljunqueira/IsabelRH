import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UserRoundCheck, Menu, X } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { useState } from "react";
import logoImage from "@assets/475938809_597105653108037_9024041851945984459_n_1750906819330.jpg";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={logoImage} 
                alt="Isabel Cunha RH" 
                className="w-10 h-10 object-cover"
              />
            </div>
            <span className="ml-2 text-xl font-bold text-isabel-blue">Isabel Cunha RH</span>
            <a 
              href="https://instagram.com/isabelcunhaconsutoriarh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-3 p-2 text-isabel-orange hover:text-isabel-orange/80 transition-colors"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-isabel-orange ${
                      isActive(item.path) 
                        ? "text-isabel-orange" 
                        : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
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
