import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import QuemSomos from "@/pages/QuemSomos";
import Servicos from "@/pages/Servicos";
import Contato from "@/pages/Contato";
import Login from "@/pages/Login";
import AreaCandidato from "@/pages/AreaCandidato";
import AreaEmpresa from "@/pages/AreaEmpresa";
import BancoTalentos from "@/pages/BancoTalentos";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quem-somos" component={QuemSomos} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/contato" component={Contato} />
      <Route path="/login" component={Login} />
      <Route path="/candidato" component={AreaCandidato} />
      <Route path="/empresa" component={AreaEmpresa} />
      <Route path="/banco-talentos" component={BancoTalentos} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-inter bg-white text-gray-800 min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
