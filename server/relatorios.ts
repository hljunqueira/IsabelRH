import { storage } from "./storage";
import { obterCandidatosRanking } from "./ranking";
import { sistemaTriagem } from "./triagem";
import type { Vaga, Candidatura, Candidato, Empresa } from "@shared/schema";

export interface MetricaProcessoSeletivo {
  vagaId: string;
  tituloVaga: string;
  totalCandidatos: number;
  candidatosAprovados: number;
  candidatosReprovados: number;
  candidatosEmTriagem: number;
  candidatosEntrevistados: number;
  mediaScore: number;
  tempoMedioProcesso: number; // em dias
  taxaConversao: number; // %
  custoPorContratacao: number;
  fonteCandidatos: {
    plataforma: number;
    linkedin: number;
    indicação: number;
    outros: number;
  };
}

export interface KPIRecrutamento {
  totalVagas: number;
  vagasAtivas: number;
  vagasEncerradas: number;
  totalCandidatos: number;
  totalCandidaturas: number;
  mediaCandidatosPorVaga: number;
  taxaAprovacao: number;
  tempoMedioContratacao: number;
  custoMedioContratacao: number;
  satisfacaoEmpresas: number;
  satisfacaoCandidatos: number;
}

export interface RelatorioMensal {
  mes: string;
  ano: number;
  vagasPublicadas: number;
  candidaturasRecebidas: number;
  entrevistasRealizadas: number;
  contratacoesEfetivadas: number;
  faturamento: number;
  custos: number;
  lucro: number;
  metricasPorVaga: MetricaProcessoSeletivo[];
}

export interface DadosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export class SistemaRelatorios {
  async obterMetricasProcessoSeletivo(vagaId: string): Promise<MetricaProcessoSeletivo> {
    try {
      const vaga = await storage.getVaga(vagaId);
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const candidaturas = await storage.getCandidaturasByVaga(vagaId);
      const candidatosComScore = await obterCandidatosRanking(vagaId);

      const totalCandidatos = candidaturas.length;
      let candidatosAprovados = 0;
      let candidatosReprovados = 0;
      let candidatosEmTriagem = 0;
      let candidatosEntrevistados = 0;
      let totalScore = 0;

      candidaturas.forEach(candidatura => {
        switch (candidatura.status) {
          case 'aprovado':
            candidatosAprovados++;
            break;
          case 'reprovado':
            candidatosReprovados++;
            break;
          case 'triagem':
            candidatosEmTriagem++;
            break;
          case 'entrevista':
            candidatosEntrevistados++;
            break;
        }
      });

      candidatosComScore.forEach(candidato => {
        totalScore += candidato.score;
      });

      const mediaScore = totalCandidatos > 0 ? Math.round(totalScore / totalCandidatos) : 0;
      const taxaConversao = totalCandidatos > 0 ? (candidatosAprovados / totalCandidatos) * 100 : 0;

      // Calcular tempo médio do processo (simulado)
      const tempoMedioProcesso = this.calcularTempoMedioProcesso(candidaturas);

      // Calcular custo por contratação (simulado)
      const custoPorContratacao = this.calcularCustoContratacao(candidatosAprovados);

      // Simular fonte de candidatos
      const fonteCandidatos = {
        plataforma: Math.round(totalCandidatos * 0.6),
        linkedin: Math.round(totalCandidatos * 0.25),
        indicação: Math.round(totalCandidatos * 0.1),
        outros: Math.round(totalCandidatos * 0.05)
      };

      return {
        vagaId,
        tituloVaga: vaga.titulo,
        totalCandidatos,
        candidatosAprovados,
        candidatosReprovados,
        candidatosEmTriagem,
        candidatosEntrevistados,
        mediaScore,
        tempoMedioProcesso,
        taxaConversao,
        custoPorContratacao,
        fonteCandidatos
      };
    } catch (error) {
      console.error('Erro ao obter métricas do processo seletivo:', error);
      throw error;
    }
  }

  async obterKPIRecrutamento(): Promise<KPIRecrutamento> {
    try {
      const vagas = await storage.getAllVagas();
      const candidatos = await storage.getAllCandidatos();
      const empresas = await storage.getAllEmpresas();

      const totalVagas = vagas.length;
      const vagasAtivas = vagas.filter(v => v.status === 'ativa').length;
      const vagasEncerradas = vagas.filter(v => v.status === 'encerrada').length;

      let totalCandidaturas = 0;
      let totalAprovados = 0;
      let totalEntrevistas = 0;

      // Calcular métricas de candidaturas
      for (const vaga of vagas) {
        const candidaturas = await storage.getCandidaturasByVaga(vaga.id);
        totalCandidaturas += candidaturas.length;
        
        candidaturas.forEach(candidatura => {
          if (candidatura.status === 'aprovado') totalAprovados++;
          if (candidatura.status === 'entrevista') totalEntrevistas++;
        });
      }

      const totalCandidatos = candidatos.length;
      const mediaCandidatosPorVaga = totalVagas > 0 ? totalCandidaturas / totalVagas : 0;
      const taxaAprovacao = totalCandidaturas > 0 ? (totalAprovados / totalCandidaturas) * 100 : 0;
      const tempoMedioContratacao = this.calcularTempoMedioContratacao(vagas);
      const custoMedioContratacao = this.calcularCustoMedioContratacao(totalAprovados);

      // Simular satisfação (em uma implementação real, viria de pesquisas)
      const satisfacaoEmpresas = 85; // %
      const satisfacaoCandidatos = 78; // %

      return {
        totalVagas,
        vagasAtivas,
        vagasEncerradas,
        totalCandidatos,
        totalCandidaturas,
        mediaCandidatosPorVaga: Math.round(mediaCandidatosPorVaga * 100) / 100,
        taxaAprovacao: Math.round(taxaAprovacao * 100) / 100,
        tempoMedioContratacao,
        custoMedioContratacao,
        satisfacaoEmpresas,
        satisfacaoCandidatos
      };
    } catch (error) {
      console.error('Erro ao obter KPIs de recrutamento:', error);
      throw error;
    }
  }

  async obterRelatorioMensal(mes: number, ano: number): Promise<RelatorioMensal> {
    try {
      const vagas = await storage.getAllVagas();
      const candidatos = await storage.getAllCandidatos();

      // Filtrar dados do mês/ano
      const vagasDoMes = vagas.filter(vaga => {
        const dataVaga = new Date(vaga.publicadoEm);
        return dataVaga.getMonth() === mes - 1 && dataVaga.getFullYear() === ano;
      });

      let candidaturasRecebidas = 0;
      let entrevistasRealizadas = 0;
      let contratacoesEfetivadas = 0;

      for (const vaga of vagasDoMes) {
        const candidaturas = await storage.getCandidaturasByVaga(vaga.id);
        candidaturasRecebidas += candidaturas.length;
        
        candidaturas.forEach(candidatura => {
          if (candidatura.status === 'entrevista') entrevistasRealizadas++;
          if (candidatura.status === 'aprovado') contratacoesEfetivadas++;
        });
      }

      // Calcular métricas por vaga
      const metricasPorVaga: MetricaProcessoSeletivo[] = [];
      for (const vaga of vagasDoMes) {
        const metrica = await this.obterMetricasProcessoSeletivo(vaga.id);
        metricasPorVaga.push(metrica);
      }

      // Simular dados financeiros
      const faturamento = contratacoesEfetivadas * 5000; // R$ 5.000 por contratação
      const custos = candidaturasRecebidas * 50; // R$ 50 por candidatura processada
      const lucro = faturamento - custos;

      const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      return {
        mes: nomesMeses[mes - 1],
        ano,
        vagasPublicadas: vagasDoMes.length,
        candidaturasRecebidas,
        entrevistasRealizadas,
        contratacoesEfetivadas,
        faturamento,
        custos,
        lucro,
        metricasPorVaga
      };
    } catch (error) {
      console.error('Erro ao obter relatório mensal:', error);
      throw error;
    }
  }

  async obterDadosGraficoCandidaturasPorMes(meses: number = 12): Promise<DadosGrafico> {
    try {
      const dados: { mes: string; candidaturas: number }[] = [];
      const hoje = new Date();

      for (let i = meses - 1; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mes = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        
        let candidaturas = 0;
        const vagas = await storage.getAllVagas();
        
        for (const vaga of vagas) {
          const candidaturasVaga = await storage.getCandidaturasByVaga(vaga.id);
          candidaturas += candidaturasVaga.length;
        }

        dados.push({ mes, candidaturas });
      }

      return {
        labels: dados.map(d => d.mes),
        datasets: [{
          label: 'Candidaturas',
          data: dados.map(d => d.candidaturas),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2
        }]
      };
    } catch (error) {
      console.error('Erro ao obter dados do gráfico:', error);
      throw error;
    }
  }

  async obterDadosGraficoStatusCandidaturas(): Promise<DadosGrafico> {
    try {
      const vagas = await storage.getAllVagas();
      let candidatado = 0;
      let triagem = 0;
      let entrevista = 0;
      let aprovado = 0;
      let reprovado = 0;

      for (const vaga of vagas) {
        const candidaturas = await storage.getCandidaturasByVaga(vaga.id);
        
        candidaturas.forEach(candidatura => {
          switch (candidatura.status) {
            case 'candidatado':
              candidatado++;
              break;
            case 'triagem':
              triagem++;
              break;
            case 'entrevista':
              entrevista++;
              break;
            case 'aprovado':
              aprovado++;
              break;
            case 'reprovado':
              reprovado++;
              break;
          }
        });
      }

      return {
        labels: ['Candidatado', 'Triagem', 'Entrevista', 'Aprovado', 'Reprovado'],
        datasets: [{
          label: 'Candidaturas por Status',
          data: [candidatado, triagem, entrevista, aprovado, reprovado],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      };
    } catch (error) {
      console.error('Erro ao obter dados do gráfico de status:', error);
      throw error;
    }
  }

  async obterDadosGraficoAreasMaisProcuradas(): Promise<DadosGrafico> {
    try {
      const vagas = await storage.getAllVagas();
      const areas: Record<string, number> = {};

      vagas.forEach(vaga => {
        if (vaga.area) {
          areas[vaga.area] = (areas[vaga.area] || 0) + 1;
        }
      });

      const areasOrdenadas = Object.entries(areas)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

      return {
        labels: areasOrdenadas.map(([area]) => area),
        datasets: [{
          label: 'Vagas por Área',
          data: areasOrdenadas.map(([, count]) => count),
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 1
        }]
      };
    } catch (error) {
      console.error('Erro ao obter dados do gráfico de áreas:', error);
      throw error;
    }
  }

  async exportarRelatorioPDF(dados: any, tipo: string): Promise<string> {
    try {
      // Em uma implementação real, usar uma biblioteca como jsPDF
      console.log(`Exportando relatório ${tipo} para PDF...`);
      
      // Simular geração de PDF
      const nomeArquivo = `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      return nomeArquivo;
    } catch (error) {
      console.error('Erro ao exportar relatório PDF:', error);
      throw error;
    }
  }

  async exportarRelatorioExcel(dados: any, tipo: string): Promise<string> {
    try {
      // Em uma implementação real, usar uma biblioteca como xlsx
      console.log(`Exportando relatório ${tipo} para Excel...`);
      
      // Simular geração de Excel
      const nomeArquivo = `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      return nomeArquivo;
    } catch (error) {
      console.error('Erro ao exportar relatório Excel:', error);
      throw error;
    }
  }

  private calcularTempoMedioProcesso(candidaturas: Candidatura[]): number {
    // Simular cálculo de tempo médio
    return Math.round(Math.random() * 30) + 15; // 15-45 dias
  }

  private calcularCustoContratacao(aprovados: number): number {
    // Simular custo por contratação
    return aprovados > 0 ? Math.round((Math.random() * 2000) + 3000) : 0; // R$ 3.000-5.000
  }

  private calcularTempoMedioContratacao(vagas: Vaga[]): number {
    // Simular tempo médio de contratação
    return Math.round(Math.random() * 20) + 25; // 25-45 dias
  }

  private calcularCustoMedioContratacao(aprovados: number): number {
    // Simular custo médio por contratação
    return aprovados > 0 ? Math.round((Math.random() * 1500) + 2500) : 0; // R$ 2.500-4.000
  }
}

export const sistemaRelatorios = new SistemaRelatorios(); 