import { storage } from "./storage";
import type { Candidato, Vaga, Candidatura } from "@shared/schema";

export interface ScoreCandidato {
  candidato: Candidato;
  candidatura: Candidatura;
  score: number;
  detalhes: {
    disc: { score: number; max: number; descricao: string };
    habilidades: { score: number; max: number; descricao: string };
    experiencia: { score: number; max: number; descricao: string };
    localizacao: { score: number; max: number; descricao: string };
    salario: { score: number; max: number; descricao: string };
  };
}

export interface ConfiguracaoScore {
  pesoDisc: number;
  pesoHabilidades: number;
  pesoExperiencia: number;
  pesoLocalizacao: number;
  pesoSalaario: number;
}

const CONFIGURACAO_PADRAO: ConfiguracaoScore = {
  pesoDisc: 30,
  pesoHabilidades: 30,
  pesoExperiencia: 20,
  pesoLocalizacao: 10,
  pesoSalaario: 10
};

// Mapeamento de compatibilidade DISC
const COMPATIBILIDADE_DISC: Record<string, string[]> = {
  'dominante': ['dominante', 'influente'],
  'influente': ['influente', 'dominante', 'estavel'],
  'estavel': ['estavel', 'influente', 'conscencioso'],
  'conscencioso': ['conscencioso', 'estavel', 'dominante']
};

export function calcularScoreCandidato(
  candidato: Candidato,
  vaga: Vaga,
  configuracao: ConfiguracaoScore = CONFIGURACAO_PADRAO
): ScoreCandidato {
  const detalhes = {
    disc: calcularScoreDisc(candidato, vaga, configuracao.pesoDisc),
    habilidades: calcularScoreHabilidades(candidato, vaga, configuracao.pesoHabilidades),
    experiencia: calcularScoreExperiencia(candidato, vaga, configuracao.pesoExperiencia),
    localizacao: calcularScoreLocalizacao(candidato, vaga, configuracao.pesoLocalizacao),
    salario: calcularScoreSalario(candidato, vaga, configuracao.pesoSalaario)
  };

  const scoreTotal = Object.values(detalhes).reduce((total, criterio) => total + criterio.score, 0);

  return {
    candidato,
    candidatura: {} as Candidatura, // Será preenchido depois
    score: Math.round(scoreTotal),
    detalhes
  };
}

function calcularScoreDisc(candidato: Candidato, vaga: Vaga, pesoMaximo: number): { score: number; max: number; descricao: string } {
  if (!candidato.perfilDisc) {
    return { score: 0, max: pesoMaximo, descricao: "Perfil DISC não disponível" };
  }

  // Para simplificar, vamos usar o perfil DISC do candidato como base
  // Em uma implementação real, a vaga teria um perfil DISC desejado
  const perfilCandidato = candidato.perfilDisc.toLowerCase();
  
  // Simular perfil desejado baseado na área da vaga
  let perfilDesejado = 'dominante'; // padrão
  if (vaga.area?.toLowerCase().includes('rh') || vaga.area?.toLowerCase().includes('recursos humanos')) {
    perfilDesejado = 'influente';
  } else if (vaga.area?.toLowerCase().includes('tecnologia') || vaga.area?.toLowerCase().includes('ti')) {
    perfilDesejado = 'conscencioso';
  } else if (vaga.area?.toLowerCase().includes('vendas') || vaga.area?.toLowerCase().includes('comercial')) {
    perfilDesejado = 'dominante';
  }

  if (perfilCandidato === perfilDesejado) {
    return { score: pesoMaximo, max: pesoMaximo, descricao: "Perfil DISC perfeito" };
  }

  const perfisCompativeis = COMPATIBILIDADE_DISC[perfilDesejado] || [];
  if (perfisCompativeis.includes(perfilCandidato)) {
    return { score: pesoMaximo * 0.7, max: pesoMaximo, descricao: "Perfil DISC compatível" };
  }

  return { score: pesoMaximo * 0.3, max: pesoMaximo, descricao: "Perfil DISC diferente" };
}

function calcularScoreHabilidades(candidato: Candidato, vaga: Vaga, pesoMaximo: number): { score: number; max: number; descricao: string } {
  if (!candidato.habilidades || !vaga.requisitos) {
    return { score: 0, max: pesoMaximo, descricao: "Habilidades não disponíveis" };
  }

  const habilidadesCandidato = candidato.habilidades.map((h: string) => h.toLowerCase());
  const requisitosVaga = vaga.requisitos.toLowerCase();
  
  // Extrair palavras-chave dos requisitos
  const palavrasChave = requisitosVaga.split(/[,\s]+/).filter(p => p.length > 2);
  
  const habilidadesMatch = palavrasChave.filter(palavra => 
    habilidadesCandidato.some(hab => hab.includes(palavra) || palavra.includes(hab))
  );

  const percentualMatch = palavrasChave.length > 0 ? habilidadesMatch.length / palavrasChave.length : 0;
  const score = percentualMatch * pesoMaximo;

  return {
    score: Math.round(score),
    max: pesoMaximo,
    descricao: `${habilidadesMatch.length}/${palavrasChave.length} habilidades compatíveis`
  };
}

function calcularScoreExperiencia(candidato: Candidato, vaga: Vaga, pesoMaximo: number): { score: number; max: number; descricao: string } {
  // Extrair anos de experiência do campo experiencias
  const experiencias = candidato.experiencias || '';
  const anosExperiencia = extrairAnosExperiencia(experiencias);
  
  // Estimar experiência mínima baseada no nível da vaga
  let experienciaMinima = 0;
  if (vaga.nivel === 'junior') experienciaMinima = 1;
  else if (vaga.nivel === 'pleno') experienciaMinima = 3;
  else if (vaga.nivel === 'senior') experienciaMinima = 5;
  else experienciaMinima = 2; // padrão

  if (anosExperiencia >= experienciaMinima) {
    const multiplicador = Math.min(1.5, anosExperiencia / experienciaMinima);
    const score = Math.min(pesoMaximo, pesoMaximo * multiplicador);
    
    return {
      score: Math.round(score),
      max: pesoMaximo,
      descricao: `${anosExperiencia} anos de experiência (mínimo: ${experienciaMinima})`
    };
  }

  const percentual = anosExperiencia / experienciaMinima;
  const score = percentual * pesoMaximo * 0.5; // Penaliza experiência insuficiente

  return {
    score: Math.round(score),
    max: pesoMaximo,
    descricao: `${anosExperiencia} anos de experiência (mínimo: ${experienciaMinima})`
  };
}

function extrairAnosExperiencia(experiencias: string): number {
  // Regex para encontrar anos de experiência
  const regex = /(\d+)\s*(anos?|years?)/i;
  const match = experiencias.match(regex);
  return match ? parseInt(match[1]) : 0;
}

function calcularScoreLocalizacao(candidato: Candidato, vaga: Vaga, pesoMaximo: number): { score: number; max: number; descricao: string } {
  const cidadeCandidato = candidato.cidade?.toLowerCase();
  const estadoCandidato = candidato.estado?.toLowerCase();
  const cidadeVaga = vaga.cidade?.toLowerCase();
  const estadoVaga = vaga.estado?.toLowerCase();

  if (cidadeCandidato === cidadeVaga) {
    return { score: pesoMaximo, max: pesoMaximo, descricao: "Mesma cidade" };
  }

  if (estadoCandidato === estadoVaga) {
    return { score: pesoMaximo * 0.7, max: pesoMaximo, descricao: "Mesmo estado" };
  }

  // Verificar se é remoto
  if (vaga.modalidade === 'remoto') {
    return { score: pesoMaximo * 0.8, max: pesoMaximo, descricao: "Vaga remota" };
  }

  return { score: pesoMaximo * 0.3, max: pesoMaximo, descricao: "Localização diferente" };
}

function calcularScoreSalario(candidato: Candidato, vaga: Vaga, pesoMaximo: number): { score: number; max: number; descricao: string } {
  const pretensaoCandidato = extrairValorSalario(candidato.pretensaoSalarial || '');
  const salarioVaga = extrairValorSalario(vaga.salario || '');

  if (pretensaoCandidato <= salarioVaga) {
    return { score: pesoMaximo, max: pesoMaximo, descricao: "Pretensão dentro da faixa" };
  }

  const percentualExcedente = salarioVaga > 0 ? (pretensaoCandidato - salarioVaga) / salarioVaga : 0;
  
  if (percentualExcedente <= 0.1) { // Até 10% acima
    return { score: pesoMaximo * 0.7, max: pesoMaximo, descricao: "Pretensão ligeiramente acima" };
  }

  if (percentualExcedente <= 0.2) { // Até 20% acima
    return { score: pesoMaximo * 0.4, max: pesoMaximo, descricao: "Pretensão acima da faixa" };
  }

  return { score: pesoMaximo * 0.1, max: pesoMaximo, descricao: "Pretensão muito acima" };
}

function extrairValorSalario(salario: string): number {
  // Regex para extrair valores numéricos de strings como "R$ 5.000 - R$ 8.000"
  const regex = /R?\$?\s*([\d.,]+)/g;
  const match = regex.exec(salario);
  
  if (!match) return 0;
  
  // Pegar o primeiro valor encontrado
  const valor = match[1].replace(/\./g, '').replace(',', '.');
  return parseFloat(valor) || 0;
}

export async function obterCandidatosRanking(vagaId: string): Promise<ScoreCandidato[]> {
  try {
    const candidaturas = await storage.getCandidaturasByVaga(vagaId);
    const vaga = await storage.getVaga(vagaId);
    
    if (!vaga) {
      throw new Error("Vaga não encontrada");
    }

    const candidatosComScore: ScoreCandidato[] = [];

    for (const candidatura of candidaturas) {
      const candidato = await storage.getCandidato(candidatura.candidatoId);
      if (candidato) {
        const scoreCandidato = calcularScoreCandidato(candidato, vaga);
        scoreCandidato.candidatura = candidatura;
        candidatosComScore.push(scoreCandidato);
      }
    }

    // Ordenar por score (maior para menor)
    return candidatosComScore.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Erro ao obter candidatos ranking:", error);
    throw error;
  }
}

export function obterClassificacaoScore(score: number): string {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muito Bom";
  if (score >= 70) return "Bom";
  if (score >= 60) return "Regular";
  if (score >= 50) return "Abaixo da Média";
  return "Baixo";
} 