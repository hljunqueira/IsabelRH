import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";

// Páginas principais - carregamento imediato
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

// Páginas básicas - lazy loading
const QuemSomos = lazy(() => import("@/pages/QuemSomos"));
const Servicos = lazy(() => import("@/pages/Servicos"));
const Contato = lazy(() => import("@/pages/Contato"));
const BancoTalentos = lazy(() => import("@/pages/BancoTalentos"));

// Páginas de usuários - lazy loading
const AreaCandidato = lazy(() => import("@/pages/AreaCandidato"));
const PerfilCandidato = lazy(() => import("@/pages/PerfilCandidato"));
const AreaEmpresa = lazy(() => import("@/pages/AreaEmpresa"));

// Páginas administrativas - lazy loading
const Admin = lazy(() => import("@/pages/Admin"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));

// Páginas avançadas - Empresas - lazy loading
const RankingInteligente = lazy(() => import("@/pages/RankingInteligente"));
const TriagemAutomatica = lazy(() => import("@/pages/TriagemAutomatica"));
const Parsing = lazy(() => import("@/pages/Parsing"));
const Relatorios = lazy(() => import("@/pages/Relatorios"));

// Páginas avançadas - Admin - lazy loading
const Comunicacao = lazy(() => import("@/pages/Comunicacao"));
const Hunting = lazy(() => import("@/pages/Hunting"));
const MultiCliente = lazy(() => import("@/pages/MultiCliente"));

// Página de teste - lazy loading
const TesteForgotPassword = lazy(() => import("@/pages/TesteForgotPassword"));

// Componente de carregamento
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-isabel-accent via-white to-isabel-accent/50 flex items-center justify-center relative overflow-hidden">
    
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-isabel-blue/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-isabel-orange/10 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-3/4 left-3/4 w-16 h-16 bg-isabel-blue/5 rounded-full animate-pulse delay-1000"></div>
    </div>

    <div className="text-center relative z-10">
      
      {/* Main spinner */}
      <div className="relative mb-8">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-isabel-blue/20 border-t-isabel-blue mx-auto"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-isabel-orange/30 mx-auto"></div>
      </div>
      
      {/* Isabel logo placeholder */}
      <div className="w-16 h-16 bg-gradient-to-br from-isabel-orange to-isabel-blue rounded-full mx-auto mb-6 animate-pulse flex items-center justify-center">
        <span className="text-white font-bold text-xl">IC</span>
      </div>
      
      {/* Loading text with animation */}
      <h2 className="text-2xl font-bold text-isabel-blue mb-4 animate-fade-in">
        Isabel Cunha RH
      </h2>
      
      {/* Animated dots */}
      <div className="flex items-center justify-center space-x-1 mb-4">
        <span className="text-gray-600">Carregando</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-isabel-orange rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-isabel-orange rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-isabel-orange rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
      
      {/* Subtitle */}
      <p className="text-gray-500 text-sm animate-fade-in-delayed">
        Conectando pessoas e oportunidades
      </p>
      
      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto mt-6">
        <div className="h-full bg-gradient-to-r from-isabel-blue to-isabel-orange animate-loading-bar"></div>
      </div>
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      {/* Rotas principais - sem lazy loading */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Rotas básicas - com lazy loading */}
      <Route path="/quem-somos">
        <Suspense fallback={<PageLoader />}>
          <QuemSomos />
        </Suspense>
      </Route>
      
      <Route path="/servicos">
        <Suspense fallback={<PageLoader />}>
          <Servicos />
        </Suspense>
      </Route>
      
      <Route path="/contato">
        <Suspense fallback={<PageLoader />}>
          <Contato />
        </Suspense>
      </Route>
      
      <Route path="/banco-talentos">
        <Suspense fallback={<PageLoader />}>
          <BancoTalentos />
        </Suspense>
      </Route>
      
      {/* Rotas de usuários - com lazy loading */}
      <Route path="/candidato">
        <Suspense fallback={<PageLoader />}>
          <AreaCandidato />
        </Suspense>
      </Route>
      
      <Route path="/candidato/perfil">
        <Suspense fallback={<PageLoader />}>
          <PerfilCandidato />
        </Suspense>
      </Route>
      
      <Route path="/empresa">
        <Suspense fallback={<PageLoader />}>
          <AreaEmpresa />
        </Suspense>
      </Route>
      
      {/* Rotas administrativas - com lazy loading */}
      <Route path="/admin">
        <Suspense fallback={<PageLoader />}>
          <Admin />
        </Suspense>
      </Route>
      
      <Route path="/admin-login">
        <Suspense fallback={<PageLoader />}>
          <AdminLogin />
        </Suspense>
      </Route>
      
      {/* Rotas avançadas - Empresas - com lazy loading */}
      <Route path="/empresa/ranking">
        <Suspense fallback={<PageLoader />}>
          <RankingInteligente />
        </Suspense>
      </Route>
      
      <Route path="/empresa/triagem">
        <Suspense fallback={<PageLoader />}>
          <TriagemAutomatica />
        </Suspense>
      </Route>
      
      <Route path="/empresa/parsing">
        <Suspense fallback={<PageLoader />}>
          <Parsing />
        </Suspense>
      </Route>
      
      <Route path="/empresa/relatorios">
        <Suspense fallback={<PageLoader />}>
          <Relatorios />
        </Suspense>
      </Route>
      
      {/* Rotas avançadas - Admin - com lazy loading */}
      <Route path="/comunicacao">
        <Suspense fallback={<PageLoader />}>
          <Comunicacao />
        </Suspense>
      </Route>
      
      <Route path="/hunting">
        <Suspense fallback={<PageLoader />}>
          <Hunting />
        </Suspense>
      </Route>
      
      <Route path="/multi-cliente">
        <Suspense fallback={<PageLoader />}>
          <MultiCliente />
        </Suspense>
      </Route>
      
      {/* Página de teste */}
      <Route path="/teste-forgot-password">
        <Suspense fallback={<PageLoader />}>
          <TesteForgotPassword />
        </Suspense>
      </Route>
      
      {/* Rota 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="font-inter bg-white text-gray-800 min-h-screen">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
