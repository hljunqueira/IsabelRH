import { Link } from "wouter";
import { UserRoundCheck, Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-isabel-orange rounded-full flex items-center justify-center mr-3">
                <UserRoundCheck className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold">Isabel Cunha RH</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Transformando o RH em um diferencial estratégico há mais de 20 anos. 
              Conectamos empresas e pessoas certas, criando equipes de alta performance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/isabelcunhaconsutoriarh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-isabel-orange transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/in/isabelcunharh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-isabel-orange transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="https://wa.me/5548996332952" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-isabel-orange transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-isabel-orange transition-colors">Início</Link></li>
              <li><Link href="/quem-somos" className="hover:text-isabel-orange transition-colors">Quem Somos</Link></li>
              <li><Link href="/servicos" className="hover:text-isabel-orange transition-colors">Serviços</Link></li>
              <li><Link href="/contato" className="hover:text-isabel-orange transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Recrutamento e Seleção</li>
              <li>Consultoria Estratégica</li>
              <li>Análise DISC</li>
              <li>Treinamentos</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Isabel Cunha RH. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Desenvolvido com ❤️ para transformar o RH brasileiro. Dev Henrique Junqueira</p>
        </div>
      </div>
    </footer>
  );
}
