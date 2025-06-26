import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Perguntas do teste DISC
const perguntasDisc = [
  {
    pergunta: "Em uma situação de trabalho em grupo, eu prefiro:",
    opcoes: [
      { texto: "Tomar a liderança e definir diretrizes", tipo: "D" },
      { texto: "Motivar e inspirar a equipe", tipo: "I" },
      { texto: "Apoiar e colaborar com todos", tipo: "S" },
      { texto: "Organizar e estruturar as tarefas", tipo: "C" }
    ]
  },
  {
    pergunta: "Quando preciso tomar uma decisão importante:",
    opcoes: [
      { texto: "Decido rapidamente com base nos fatos", tipo: "D" },
      { texto: "Consulto outras pessoas para obter perspectivas", tipo: "I" },
      { texto: "Analiso cuidadosamente todas as opções", tipo: "S" },
      { texto: "Pesquiso detalhadamente antes de decidir", tipo: "C" }
    ]
  },
  {
    pergunta: "Em reuniões, eu geralmente:",
    opcoes: [
      { texto: "Vou direto ao ponto e foco nos resultados", tipo: "D" },
      { texto: "Compartilho ideias e mantenho o ambiente animado", tipo: "I" },
      { texto: "Escuto atentamente antes de opinar", tipo: "S" },
      { texto: "Faço perguntas detalhadas e analíticas", tipo: "C" }
    ]
  },
  {
    pergunta: "Meu estilo de comunicação é mais:",
    opcoes: [
      { texto: "Direto e objetivo", tipo: "D" },
      { texto: "Expressivo e entusiasta", tipo: "I" },
      { texto: "Paciente e acolhedor", tipo: "S" },
      { texto: "Preciso e factual", tipo: "C" }
    ]
  },
  {
    pergunta: "Diante de mudanças no trabalho:",
    opcoes: [
      { texto: "Abraço rapidamente e busco oportunidades", tipo: "D" },
      { texto: "Me adapto facilmente e vejo o lado positivo", tipo: "I" },
      { texto: "Preciso de tempo para me ajustar", tipo: "S" },
      { texto: "Analiso os impactos antes de aceitar", tipo: "C" }
    ]
  },
  {
    pergunta: "Minha abordagem para resolver problemas:",
    opcoes: [
      { texto: "Foco na solução mais eficiente", tipo: "D" },
      { texto: "Busco soluções criativas e inovadoras", tipo: "I" },
      { texto: "Considero o impacto nas pessoas", tipo: "S" },
      { texto: "Analiso sistematicamente todas as variáveis", tipo: "C" }
    ]
  },
  {
    pergunta: "Em ambiente de trabalho, eu valorizo mais:",
    opcoes: [
      { texto: "Autonomia e controle", tipo: "D" },
      { texto: "Reconhecimento e interação social", tipo: "I" },
      { texto: "Estabilidade e cooperação", tipo: "S" },
      { texto: "Qualidade e precisão", tipo: "C" }
    ]
  },
  {
    pergunta: "Quando trabalho sob pressão:",
    opcoes: [
      { texto: "Mantenho o foco e acelero o ritmo", tipo: "D" },
      { texto: "Busco apoio da equipe e mantenho o otimismo", tipo: "I" },
      { texto: "Preciso de apoio para manter a qualidade", tipo: "S" },
      { texto: "Organizo prioridades e trabalho metodicamente", tipo: "C" }
    ]
  },
  {
    pergunta: "Meu ponto forte em equipes é:",
    opcoes: [
      { texto: "Impulsionar resultados e superar obstáculos", tipo: "D" },
      { texto: "Motivar pessoas e gerar ideias", tipo: "I" },
      { texto: "Mediar conflitos e manter harmonia", tipo: "S" },
      { texto: "Garantir qualidade e atenção aos detalhes", tipo: "C" }
    ]
  },
  {
    pergunta: "Prefiro trabalhar em projetos que:",
    opcoes: [
      { texto: "Tenham metas desafiadoras e resultados claros", tipo: "D" },
      { texto: "Sejam inovadores e permitam criatividade", tipo: "I" },
      { texto: "Beneficiem pessoas e tenham propósito", tipo: "S" },
      { texto: "Exijam análise profunda e precisão", tipo: "C" }
    ]
  }
];

interface TesteDISCProps {
  candidatoId: string;
  onTesteConcluido?: () => void;
}

export default function TesteDISC({ candidatoId, onTesteConcluido }: TesteDISCProps) {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [respostaSelecionada, setRespostaSelecionada] = useState("");
  const [testeConcluido, setTesteConcluido] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const { toast } = useToast();

  const calcularResultado = (respostasCompletas: string[]) => {
    const pontuacoes = { D: 0, I: 0, S: 0, C: 0 };
    
    respostasCompletas.forEach(resposta => {
      pontuacoes[resposta as keyof typeof pontuacoes]++;
    });

    const total = respostasCompletas.length;
    const percentuais = {
      D: Math.round((pontuacoes.D / total) * 100),
      I: Math.round((pontuacoes.I / total) * 100),
      S: Math.round((pontuacoes.S / total) * 100),
      C: Math.round((pontuacoes.C / total) * 100)
    };

    const perfilDominante = Object.entries(percentuais).reduce((a, b) => 
      percentuais[a[0] as keyof typeof percentuais] > percentuais[b[0] as keyof typeof percentuais] ? a : b
    )[0];

    return {
      pontuacoes: pontuacoes,
      percentuais,
      perfilDominante,
      respostas: respostasCompletas
    };
  };

  const salvarTesteMutation = useMutation({
    mutationFn: async (dadosTeste: any) => {
      const response = await apiRequest("POST", "/api/testes-disc", dadosTeste);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Teste DISC concluído!",
        description: "Seu perfil comportamental foi salvo com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/candidatos/${candidatoId}`] });
      onTesteConcluido?.();
    },
    onError: () => {
      toast({
        title: "Erro ao salvar teste",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const proximaPergunta = () => {
    if (!respostaSelecionada) return;

    const novasRespostas = [...respostas, respostaSelecionada];
    setRespostas(novasRespostas);
    setRespostaSelecionada("");

    if (perguntaAtual < perguntasDisc.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      // Teste concluído
      const resultadoFinal = calcularResultado(novasRespostas);
      setResultado(resultadoFinal);
      setTesteConcluido(true);

      // Salvar no banco
      const dadosTeste = {
        candidatoId,
        respostas: novasRespostas,
        pontuacaoD: resultadoFinal.pontuacoes.D,
        pontuacaoI: resultadoFinal.pontuacoes.I,
        pontuacaoS: resultadoFinal.pontuacoes.S,
        pontuacaoC: resultadoFinal.pontuacoes.C,
        perfilDominante: resultadoFinal.perfilDominante,
        descricaoPerfil: getDescricaoPerfil(resultadoFinal.perfilDominante),
        pontosFortes: getPontosFortes(resultadoFinal.perfilDominante),
        areasDesenvolvimento: getAreasDesenvolvimento(resultadoFinal.perfilDominante),
        estiloTrabalho: getEstiloTrabalho(resultadoFinal.perfilDominante),
        estiloLideranca: getEstiloLideranca(resultadoFinal.perfilDominante),
        estiloComunitacao: getEstiloComunicacao(resultadoFinal.perfilDominante)
      };

      salvarTesteMutation.mutate(dadosTeste);
    }
  };

  const reiniciarTeste = () => {
    setPerguntaAtual(0);
    setRespostas([]);
    setRespostaSelecionada("");
    setTesteConcluido(false);
    setResultado(null);
  };

  const getDescricaoPerfil = (perfil: string) => {
    const descricoes = {
      D: "Dominante - Pessoa orientada para resultados, direta e decidida. Gosta de desafios e toma decisões rapidamente.",
      I: "Influente - Pessoa comunicativa, otimista e persuasiva. Trabalha bem em equipe e gosta de reconhecimento social.",
      S: "Estável - Pessoa paciente, leal e confiável. Valoriza estabilidade e harmonia no ambiente de trabalho.",
      C: "Consciencioso - Pessoa analítica, precisa e sistemática. Foca na qualidade e atenção aos detalhes."
    };
    return descricoes[perfil as keyof typeof descricoes];
  };

  const getPontosFortes = (perfil: string) => {
    const fortes = {
      D: ["Liderança natural", "Tomada de decisão rápida", "Foco em resultados", "Competitividade saudável"],
      I: ["Comunicação eficaz", "Motivação de equipes", "Criatividade", "Adaptabilidade"],
      S: ["Trabalho em equipe", "Paciência", "Lealdade", "Mediação de conflitos"],
      C: ["Atenção aos detalhes", "Análise crítica", "Organização", "Qualidade técnica"]
    };
    return fortes[perfil as keyof typeof fortes];
  };

  const getAreasDesenvolvimento = (perfil: string) => {
    const areas = {
      D: ["Paciência", "Escuta ativa", "Diplomacia", "Trabalho em equipe"],
      I: ["Foco em detalhes", "Planejamento", "Análise crítica", "Disciplina"],
      S: ["Assertividade", "Adaptação a mudanças", "Tomada de decisão", "Autoconfiança"],
      C: ["Flexibilidade", "Comunicação interpessoal", "Tomada de risco", "Velocidade de execução"]
    };
    return areas[perfil as keyof typeof areas];
  };

  const getEstiloTrabalho = (perfil: string) => {
    const estilos = {
      D: "Trabalha melhor com autonomia, metas claras e desafios. Prefere ambiente dinâmico e competitivo.",
      I: "Trabalha melhor em equipe, com variedade de tarefas e reconhecimento. Prefere ambiente social e colaborativo.",
      S: "Trabalha melhor com estabilidade, processos claros e apoio da equipe. Prefere ambiente harmonioso e previsível.",
      C: "Trabalha melhor com tempo para análise, padrões de qualidade e autonomia técnica. Prefere ambiente estruturado e preciso."
    };
    return estilos[perfil as keyof typeof estilos];
  };

  const getEstiloLideranca = (perfil: string) => {
    const lideranca = {
      D: "Liderança diretiva e orientada para resultados. Toma decisões rapidamente e delega com autonomia.",
      I: "Liderança inspiradora e motivacional. Engaja equipes e promove ambiente positivo e criativo.",
      S: "Liderança participativa e colaborativa. Busca consenso e mantém harmonia na equipe.",
      C: "Liderança técnica e baseada em competência. Foca na qualidade e desenvolvimento de habilidades."
    };
    return lideranca[perfil as keyof typeof lideranca];
  };

  const getEstiloComunicacao = (perfil: string) => {
    const comunicacao = {
      D: "Comunicação direta, objetiva e focada em resultados. Prefere conversas práticas e eficientes.",
      I: "Comunicação expressiva, entusiasta e persuasiva. Gosta de interação social e feedback positivo.",
      S: "Comunicação paciente, acolhedora e empática. Prefere diálogo e busca compreender diferentes perspectivas.",
      C: "Comunicação precisa, detalhada e factual. Prefere informações completas e análises fundamentadas."
    };
    return comunicacao[perfil as keyof typeof comunicacao];
  };

  const getCorPerfil = (perfil: string) => {
    const cores = {
      D: "bg-red-500",
      I: "bg-yellow-500", 
      S: "bg-green-500",
      C: "bg-blue-500"
    };
    return cores[perfil as keyof typeof cores];
  };

  const getNomePerfil = (perfil: string) => {
    const nomes = {
      D: "Dominante",
      I: "Influente",
      S: "Estável", 
      C: "Consciencioso"
    };
    return nomes[perfil as keyof typeof nomes];
  };

  if (testeConcluido && resultado) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <CardTitle className="text-2xl">Teste DISC Concluído!</CardTitle>
          </div>
          <p className="text-gray-600">Seu perfil comportamental foi analisado</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Perfil Dominante */}
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <Badge className={`${getCorPerfil(resultado.perfilDominante)} text-white text-lg px-4 py-2 mb-4`}>
              Perfil {getNomePerfil(resultado.perfilDominante)} ({resultado.perfilDominante})
            </Badge>
            <p className="text-gray-700 leading-relaxed">{getDescricaoPerfil(resultado.perfilDominante)}</p>
          </div>

          {/* Pontuações */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(resultado.percentuais).map(([tipo, percentual]) => (
              <div key={tipo} className="text-center p-4 border rounded-lg">
                <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-xl ${getCorPerfil(tipo)}`}>
                  {tipo}
                </div>
                <p className="font-semibold">{String(percentual)}%</p>
                <p className="text-sm text-gray-600">{getNomePerfil(tipo)}</p>
              </div>
            ))}
          </div>

          {/* Pontos Fortes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700">Pontos Fortes</h3>
              <ul className="space-y-2">
                {getPontosFortes(resultado.perfilDominante).map((ponto, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-700">Áreas de Desenvolvimento</h3>
              <ul className="space-y-2">
                {getAreasDesenvolvimento(resultado.perfilDominante).map((area, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Estilos */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Estilo de Trabalho</h4>
              <p className="text-gray-700">{getEstiloTrabalho(resultado.perfilDominante)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Estilo de Liderança</h4>
              <p className="text-gray-700">{getEstiloLideranca(resultado.perfilDominante)}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold mb-2">Estilo de Comunicação</h4>
              <p className="text-gray-700">{getEstiloComunicacao(resultado.perfilDominante)}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={reiniciarTeste} variant="outline" className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span>Refazer Teste</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-blue-500" />
          <CardTitle>Teste de Perfil DISC</CardTitle>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pergunta {perguntaAtual + 1} de {perguntasDisc.length}</span>
            <span>{Math.round(((perguntaAtual + 1) / perguntasDisc.length) * 100)}%</span>
          </div>
          <Progress value={((perguntaAtual + 1) / perguntasDisc.length) * 100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {perguntasDisc[perguntaAtual].pergunta}
          </h3>
          
          <RadioGroup 
            value={respostaSelecionada} 
            onValueChange={setRespostaSelecionada}
            className="space-y-3"
          >
            {perguntasDisc[perguntaAtual].opcoes.map((opcao, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={opcao.tipo} id={`opcao-${index}`} />
                <Label htmlFor={`opcao-${index}`} className="flex-1 cursor-pointer">
                  {opcao.texto}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={proximaPergunta}
            disabled={!respostaSelecionada || salvarTesteMutation.isPending}
            className="flex items-center space-x-2"
          >
            <span>
              {perguntaAtual === perguntasDisc.length - 1 ? "Finalizar Teste" : "Próxima"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}