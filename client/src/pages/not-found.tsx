import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Ops! Esta página saiu para um café... ☕",
    "Parece que você se perdeu no mundo RH... 🗺️",
    "Esta página está procurando emprego... 💼",
    "404: Página não encontrada (mas você encontrou esta animação!) 🎉"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-isabel-accent via-white to-isabel-accent/50 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-isabel-blue/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-isabel-orange/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className={`relative z-10 max-w-2xl mx-4 text-center transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* 404 Number Animation */}
        <div className="mb-8">
          <div className="text-9xl sm:text-[12rem] font-bold text-isabel-blue/20 leading-none select-none animate-bounce">
            4
            <span className="inline-block animate-pulse delay-300">0</span>
            <span className="inline-block animate-bounce delay-500">4</span>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border-2 border-isabel-blue/10 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            
            {/* Animated Icon */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-isabel-orange to-isabel-blue rounded-full flex items-center justify-center animate-spin-slow">
                <Search className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-isabel-blue mb-4 animate-fade-in">
              Página Não Encontrada
            </h1>

            {/* Rotating Messages */}
            <div className="h-16 flex items-center justify-center mb-6">
              <p className={`text-lg text-gray-600 transition-all duration-500 transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                {messages[currentMessage]}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              A página que você está procurando não existe ou foi movida. 
              Que tal explorar nossas oportunidades de carreira?
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-isabel-blue hover:bg-isabel-blue/90 transform hover:scale-105 transition-all duration-200">
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-isabel-orange text-isabel-orange hover:bg-isabel-orange hover:text-white transform hover:scale-105 transition-all duration-200"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Ou explore estas opções:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/candidato">
                  <Button variant="ghost" size="sm" className="text-isabel-blue hover:bg-isabel-blue/10">
                    Área do Candidato
                  </Button>
                </Link>
                <Link href="/empresa">
                  <Button variant="ghost" size="sm" className="text-isabel-blue hover:bg-isabel-blue/10">
                    Área da Empresa
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button variant="ghost" size="sm" className="text-isabel-blue hover:bg-isabel-blue/10">
                    Nossos Serviços
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button variant="ghost" size="sm" className="text-isabel-blue hover:bg-isabel-blue/10">
                    Contato
                  </Button>
                </Link>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Footer Message */}
        <p className="mt-6 text-sm text-gray-500 animate-fade-in-delayed">
          Isabel Cunha RH - Conectando pessoas e oportunidades há mais de 20 anos
        </p>
      </div>
    </div>
  );
}
