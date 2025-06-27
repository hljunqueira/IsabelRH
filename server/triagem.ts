import { storage } from "./storage";
import { obterCandidatosRanking, obterClassificacaoScore } from "./ranking";
import type { Candidato, Vaga, Candidatura } from "@shared/schema";

export interface FiltroTriagem {
  id: string;
  vagaId: string;
  nome: string;
  criterios: {
    scoreMinimo: number;
    perfilDiscDesejado?: string[];
    habilidadesObrigatorias?: string[];
    experienciaMinima?: number;
    localizacaoObrigatoria?: boolean;
    pretensaoMaxima?: number;
    nivelEscolaridadeMinimo?: string;
    idiomasObrigatorios?: string[];
  };
  acoes: {
    scoreAlto: 'aprovado' | 'entrevista' | 'teste';
    scoreMedio: 'triagem' | 'entrevista' | 'reprovado';
    scoreBaixo: 'reprovado' | 'triagem' | 'aguardando';
  };
  ativo: boolean;
  criadoEm: Date;
}

export interface ResultadoTriagem {
  candidaturaId: string;
  candidatoId: string;
  vagaId: string;
  score: number;
  classificacao: string;
  statusAnterior: string;
  statusNovo: string;
  motivo: string;
  filtrosAplicados: string[];
  aprovadoAutomaticamente: boolean;
  dataTriagem: Date;
}

export class SistemaTriagem {
  private filtros: Map<string, FiltroTriagem> = new Map();

  constructor() {
    this.carregarFiltros();
  }

  private async carregarFiltros() {
    // Em uma implementação real, carregaria do banco de dados
    // Por enquanto, vamos usar filtros padrão
    const filtrosPadrao: FiltroTriagem[] = [
      {
        id: 'filtro-padrao',
        vagaId: 'todas',
        nome: 'Filtro Padrão',
        criterios: {
          scoreMinimo: 60,
          experienciaMinima: 1,
          pretensaoMaxima: 15000
        },
        acoes: {
          scoreAlto: 'entrevista',
          scoreMedio: 'triagem',
          scoreBaixo: 'reprovado'
        },
        ativo: true,
        criadoEm: new Date()
      }
    ];

    filtrosPadrao.forEach(filtro => {
      this.filtros.set(filtro.id, filtro);
    });
  }

  async criarFiltro(filtro: Omit<FiltroTriagem, 'id' | 'criadoEm'>): Promise<FiltroTriagem> {
    const id = crypto.randomUUID();
    const novoFiltro: FiltroTriagem = {
      ...filtro,
      id,
      criadoEm: new Date()
    };
    
    this.filtros.set(id, novoFiltro);
    return novoFiltro;
  }

  async obterFiltros(vagaId?: string): Promise<FiltroTriagem[]> {
    const filtros = Array.from(this.filtros.values());
    if (vagaId) {
      return filtros.filter(f => f.vagaId === vagaId || f.vagaId === 'todas');
    }
    return filtros;
  }

  async aplicarTriagemAutomatica(vagaId: string): Promise<ResultadoTriagem[]> {
    try {
      // Obter candidatos com ranking
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      const filtros = await this.obterFiltros(vagaId);
      
      if (filtros.length === 0) {
        console.log('Nenhum filtro encontrado para a vaga:', vagaId);
        return [];
      }

      const resultados: ResultadoTriagem[] = [];

      for (const candidatoComScore of candidatosComScore) {
        for (const filtro of filtros) {
          if (!filtro.ativo) continue;

          const resultado = await this.aplicarFiltro(
            candidatoComScore,
            filtro
          );

          if (resultado) {
            resultados.push(resultado);
            
            // Atualizar status da candidatura
            await this.atualizarStatusCandidatura(
              resultado.candidaturaId,
              resultado.statusNovo,
              resultado.motivo
            );

            // Enviar notificação se necessário
            if (resultado.aprovadoAutomaticamente) {
              await this.enviarNotificacaoAprovacao(resultado);
            }
          }
        }
      }

      return resultados;
    } catch (error) {
      console.error('Erro ao aplicar triagem automática:', error);
      throw error;
    }
  }

  private async aplicarFiltro(
    candidatoComScore: any,
    filtro: FiltroTriagem
  ): Promise<ResultadoTriagem | null> {
    const { candidato, candidatura, score, classificacao } = candidatoComScore;
    const { criterios, acoes } = filtro;

    // Verificar critérios básicos
    if (score < criterios.scoreMinimo) {
      return this.criarResultado(
        candidatura.id,
        candidato.id,
        candidatura.vagaId,
        score,
        classificacao,
        candidatura.status,
        acoes.scoreBaixo,
        `Score ${score} abaixo do mínimo ${criterios.scoreMinimo}`,
        [filtro.nome]
      );
    }

    // Verificar perfil DISC
    if (criterios.perfilDiscDesejado && candidato.perfilDisc) {
      if (!criterios.perfilDiscDesejado.includes(candidato.perfilDisc)) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          'reprovado',
          `Perfil DISC ${candidato.perfilDisc} não compatível`,
          [filtro.nome]
        );
      }
    }

    // Verificar habilidades obrigatórias
    if (criterios.habilidadesObrigatorias && candidato.habilidades) {
      const habilidadesFaltantes = criterios.habilidadesObrigatorias.filter(
        hab => !candidato.habilidades.some((candHab: string) => 
          candHab.toLowerCase().includes(hab.toLowerCase())
        )
      );

      if (habilidadesFaltantes.length > 0) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          'reprovado',
          `Habilidades obrigatórias não encontradas: ${habilidadesFaltantes.join(', ')}`,
          [filtro.nome]
        );
      }
    }

    // Verificar experiência
    if (criterios.experienciaMinima) {
      const experiencias = candidato.experiencias || '';
      const anosExperiencia = this.extrairAnosExperiencia(experiencias);
      
      if (anosExperiencia < criterios.experienciaMinima) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          'reprovado',
          `${anosExperiencia} anos de experiência (mínimo: ${criterios.experienciaMinima})`,
          [filtro.nome]
        );
      }
    }

    // Verificar pretensão salarial
    if (criterios.pretensaoMaxima && candidato.pretensaoSalarial) {
      const pretensao = this.extrairValorSalario(candidato.pretensaoSalarial);
      
      if (pretensao > criterios.pretensaoMaxima) {
        return this.criarResultado(
          candidatura.id,
          candidato.id,
          candidatura.vagaId,
          score,
          classificacao,
          candidatura.status,
          'reprovado',
          `Pretensão salarial R$ ${pretensao} acima do máximo R$ ${criterios.pretensaoMaxima}`,
          [filtro.nome]
        );
      }
    }

    // Determinar ação baseada no score
    let novaAcao: string;
    if (score >= 80) {
      novaAcao = acoes.scoreAlto;
    } else if (score >= 60) {
      novaAcao = acoes.scoreMedio;
    } else {
      novaAcao = acoes.scoreBaixo;
    }

    return this.criarResultado(
      candidatura.id,
      candidato.id,
      candidatura.vagaId,
      score,
      classificacao,
      candidatura.status,
      novaAcao,
      `Triagem automática aplicada - Score: ${score}`,
      [filtro.nome],
      novaAcao === 'aprovado' || novaAcao === 'entrevista'
    );
  }

  private criarResultado(
    candidaturaId: string,
    candidatoId: string,
    vagaId: string,
    score: number,
    classificacao: string,
    statusAnterior: string,
    statusNovo: string,
    motivo: string,
    filtrosAplicados: string[],
    aprovadoAutomaticamente: boolean = false
  ): ResultadoTriagem {
    return {
      candidaturaId,
      candidatoId,
      vagaId,
      score,
      classificacao,
      statusAnterior,
      statusNovo,
      motivo,
      filtrosAplicados,
      aprovadoAutomaticamente,
      dataTriagem: new Date()
    };
  }

  private async atualizarStatusCandidatura(
    candidaturaId: string,
    novoStatus: string,
    motivo: string
  ): Promise<void> {
    try {
      // Em uma implementação real, atualizaria no banco de dados
      console.log(`Atualizando candidatura ${candidaturaId} para status: ${novoStatus}`);
      
      // Aqui você chamaria o método de atualização do storage
      // await storage.updateCandidatura(candidaturaId, {
      //   status: novoStatus,
      //   observacoes: motivo,
      //   dataTriagem: new Date()
      // });
    } catch (error) {
      console.error('Erro ao atualizar status da candidatura:', error);
    }
  }

  private async enviarNotificacaoAprovacao(resultado: ResultadoTriagem): Promise<void> {
    try {
      // Em uma implementação real, enviaria email/notificação
      console.log(`Notificação enviada para candidato ${resultado.candidatoId}: ${resultado.motivo}`);
      
      // Exemplo de template de notificação
      const template = {
        para: 'candidato@email.com',
        assunto: 'Parabéns! Sua candidatura foi aprovada na triagem',
        corpo: `
          Olá!
          
          Sua candidatura foi aprovada na triagem automática com score de ${resultado.score}%.
          
          Próximos passos: ${resultado.statusNovo === 'entrevista' ? 'Entrevista' : 'Teste técnico'}
          
          Boa sorte!
        `
      };
      
      // await enviarEmail(template);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  private extrairAnosExperiencia(experiencias: string): number {
    const regex = /(\d+)\s*(anos?|years?)/i;
    const match = experiencias.match(regex);
    return match ? parseInt(match[1]) : 0;
  }

  private extrairValorSalario(salario: string): number {
    const regex = /R?\$?\s*([\d.,]+)/g;
    const match = regex.exec(salario);
    
    if (!match) return 0;
    
    const valor = match[1].replace(/\./g, '').replace(',', '.');
    return parseFloat(valor) || 0;
  }

  async obterEstatisticasTriagem(vagaId: string): Promise<{
    totalCandidatos: number;
    aprovados: number;
    reprovados: number;
    emTriagem: number;
    entrevistas: number;
    mediaScore: number;
  }> {
    try {
      const candidatosComScore = await obterCandidatosRanking(vagaId);
      
      const estatisticas = {
        totalCandidatos: candidatosComScore.length,
        aprovados: 0,
        reprovados: 0,
        emTriagem: 0,
        entrevistas: 0,
        mediaScore: 0
      };

      let totalScore = 0;

      candidatosComScore.forEach(candidato => {
        totalScore += candidato.score;
        
        if (candidato.score >= 80) {
          estatisticas.aprovados++;
        } else if (candidato.score >= 60) {
          estatisticas.emTriagem++;
        } else {
          estatisticas.reprovados++;
        }
      });

      estatisticas.mediaScore = candidatosComScore.length > 0 
        ? Math.round(totalScore / candidatosComScore.length) 
        : 0;

      return estatisticas;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

export const sistemaTriagem = new SistemaTriagem(); 