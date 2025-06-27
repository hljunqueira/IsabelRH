import { storage } from "./storage";
import { sistemaComunicacao } from "./comunicacao";
import type { Candidato, Vaga } from "@shared/schema";

export interface PerfilHunting {
  id: string;
  nome: string;
  email?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  empresaAtual?: string;
  cargoAtual?: string;
  localizacao?: string;
  habilidades?: string[];
  experiencia?: number;
  scoreCompatibilidade?: number;
  status: 'disponivel' | 'contatado' | 'interessado' | 'nao_interessado' | 'contratado';
  dataContato?: Date;
  observacoes?: string;
  fonte: 'linkedin' | 'github' | 'portfolio' | 'indicação' | 'outros';
  campanhaId?: string;
  criadoEm: Date;
}

export interface CampanhaHunting {
  id: string;
  vagaId: string;
  titulo: string;
  descricao: string;
  criterios: {
    habilidades: string[];
    experienciaMinima: number;
    experienciaMaxima?: number;
    localizacao?: string[];
    empresasExcluidas?: string[];
    empresasIncluidas?: string[];
    nivelEscolaridade?: string[];
  };
  status: 'ativa' | 'pausada' | 'encerrada';
  totalEncontrados: number;
  totalContatados: number;
  totalInteressados: number;
  totalContratados: number;
  criadaEm: Date;
  atualizadaEm: Date;
}

export interface TemplateContato {
  id: string;
  nome: string;
  assunto: string;
  mensagem: string;
  variaveis: string[];
  ativo: boolean;
  criadoEm: Date;
}

export interface ResultadoBusca {
  perfis: PerfilHunting[];
  totalEncontrados: number;
  tempoBusca: number;
  filtrosAplicados: string[];
}

export class SistemaHunting {
  private campanhas: Map<string, CampanhaHunting> = new Map();
  private perfis: Map<string, PerfilHunting> = new Map();
  private templates: Map<string, TemplateContato> = new Map();

  constructor() {
    this.carregarTemplates();
  }

  private carregarTemplates() {
    const templatesPadrao: TemplateContato[] = [
      {
        id: 'template-hunting-1',
        nome: 'Primeiro Contato - Desenvolvedor',
        assunto: 'Oportunidade de Desenvolvimento - {{empresa}}',
        mensagem: `Olá {{nome}}!

Vi seu perfil no LinkedIn e fiquei impressionado com sua experiência em {{habilidades}}.

Estamos buscando um {{cargo}} para nossa equipe em {{empresa}}. A vaga oferece:

• {{beneficios}}
• {{salario}}
• {{modalidade}}

Gostaria de conversar sobre essa oportunidade? Podemos agendar uma call para discutir mais detalhes.

Atenciosamente,
{{recrutador}}
{{empresa}}`,
        variaveis: ['nome', 'habilidades', 'cargo', 'empresa', 'beneficios', 'salario', 'modalidade', 'recrutador'],
        ativo: true,
        criadoEm: new Date()
      },
      {
        id: 'template-hunting-2',
        nome: 'Follow-up - Interesse',
        assunto: 'Re: Oportunidade {{empresa}} - Próximos Passos',
        mensagem: `Olá {{nome}}!

Obrigado pelo interesse na oportunidade de {{cargo}} na {{empresa}}!

Gostaria de agendar uma conversa para discutir:

• Detalhes da vaga e responsabilidades
• Cultura da empresa e valores
• Processo seletivo
• Suas expectativas e objetivos

Qual horário seria melhor para você? Sugestões:
• Segunda-feira, 14h
• Terça-feira, 10h
• Quarta-feira, 16h

Aguardo seu retorno!

{{recrutador}}
{{empresa}}`,
        variaveis: ['nome', 'cargo', 'empresa', 'recrutador'],
        ativo: true,
        criadoEm: new Date()
      }
    ];

    templatesPadrao.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async criarCampanha(campanha: Omit<CampanhaHunting, 'id' | 'criadaEm' | 'atualizadaEm' | 'totalEncontrados' | 'totalContatados' | 'totalInteressados' | 'totalContratados'>): Promise<CampanhaHunting> {
    const id = crypto.randomUUID();
    const novaCampanha: CampanhaHunting = {
      ...campanha,
      id,
      totalEncontrados: 0,
      totalContatados: 0,
      totalInteressados: 0,
      totalContratados: 0,
      criadaEm: new Date(),
      atualizadaEm: new Date()
    };

    this.campanhas.set(id, novaCampanha);
    return novaCampanha;
  }

  async obterCampanhas(vagaId?: string): Promise<CampanhaHunting[]> {
    const campanhas = Array.from(this.campanhas.values());
    if (vagaId) {
      return campanhas.filter(c => c.vagaId === vagaId);
    }
    return campanhas;
  }

  async buscarTalentos(campanhaId: string): Promise<ResultadoBusca> {
    try {
      const campanha = this.campanhas.get(campanhaId);
      if (!campanha) {
        throw new Error('Campanha não encontrada');
      }

      const inicioBusca = Date.now();
      const perfisEncontrados: PerfilHunting[] = [];

      // Simular busca em diferentes fontes
      const perfisLinkedIn = await this.buscarNoLinkedIn(campanha.criterios);
      const perfisGitHub = await this.buscarNoGitHub(campanha.criterios);
      const perfisPortfolio = await this.buscarEmPortfolios(campanha.criterios);

      // Combinar e filtrar resultados
      const todosPerfis = [...perfisLinkedIn, ...perfisGitHub, ...perfisPortfolio];
      
      // Remover duplicatas
      const perfisUnicos = this.removerDuplicatas(todosPerfis);
      
      // Aplicar filtros adicionais
      const perfisFiltrados = this.aplicarFiltros(perfisUnicos, campanha.criterios);
      
      // Calcular score de compatibilidade
      const vaga = await storage.getVaga(campanha.vagaId);
      if (vaga) {
        perfisFiltrados.forEach(perfil => {
          perfil.scoreCompatibilidade = this.calcularScoreCompatibilidade(perfil, vaga);
          perfil.campanhaId = campanhaId;
        });
      }

      // Ordenar por score
      perfisFiltrados.sort((a, b) => (b.scoreCompatibilidade || 0) - (a.scoreCompatibilidade || 0));

      // Salvar perfis encontrados
      perfisFiltrados.forEach(perfil => {
        this.perfis.set(perfil.id, perfil);
      });

      // Atualizar campanha
      campanha.totalEncontrados = perfisFiltrados.length;
      campanha.atualizadaEm = new Date();

      const tempoBusca = Date.now() - inicioBusca;

      return {
        perfis: perfisFiltrados,
        totalEncontrados: perfisFiltrados.length,
        tempoBusca,
        filtrosAplicados: this.obterFiltrosAplicados(campanha.criterios)
      };
    } catch (error) {
      console.error('Erro ao buscar talentos:', error);
      throw error;
    }
  }

  async contatarTalento(perfilId: string, templateId: string, variaveis: Record<string, string>): Promise<boolean> {
    try {
      const perfil = this.perfis.get(perfilId);
      const template = this.templates.get(templateId);

      if (!perfil || !template) {
        throw new Error('Perfil ou template não encontrado');
      }

      // Aplicar variáveis ao template
      let mensagem = template.mensagem;
      Object.entries(variaveis).forEach(([chave, valor]) => {
        const regex = new RegExp(`{{${chave}}}`, 'g');
        mensagem = mensagem.replace(regex, valor);
      });

      // Enviar mensagem (simulado)
      console.log(`Enviando mensagem para ${perfil.nome} (${perfil.email}):`);
      console.log(`Assunto: ${template.assunto}`);
      console.log(`Mensagem: ${mensagem}`);

      // Atualizar status do perfil
      perfil.status = 'contatado';
      perfil.dataContato = new Date();

      // Atualizar campanha
      const campanhas = Array.from(this.campanhas.values());
      const campanha = campanhas.find(c => c.id === perfil.campanhaId);
      if (campanha) {
        campanha.totalContatados++;
        campanha.atualizadaEm = new Date();
      }

      return true;
    } catch (error) {
      console.error('Erro ao contatar talento:', error);
      return false;
    }
  }

  async atualizarStatusPerfil(perfilId: string, status: PerfilHunting['status'], observacoes?: string): Promise<void> {
    const perfil = this.perfis.get(perfilId);
    if (perfil) {
      perfil.status = status;
      if (observacoes) {
        perfil.observacoes = observacoes;
      }

      // Atualizar contadores da campanha
      const campanhas = Array.from(this.campanhas.values());
      const campanha = campanhas.find(c => c.id === perfil.campanhaId);
      if (campanha) {
        switch (status) {
          case 'interessado':
            campanha.totalInteressados++;
            break;
          case 'contratado':
            campanha.totalContratados++;
            break;
        }
        campanha.atualizadaEm = new Date();
      }
    }
  }

  async obterPerfis(campanhaId?: string, status?: PerfilHunting['status']): Promise<PerfilHunting[]> {
    const perfis = Array.from(this.perfis.values());
    
    let filtrados = perfis;
    
    if (campanhaId) {
      filtrados = filtrados.filter(p => p.campanhaId === campanhaId);
    }
    
    if (status) {
      filtrados = filtrados.filter(p => p.status === status);
    }
    
    return filtrados.sort((a, b) => (b.scoreCompatibilidade || 0) - (a.scoreCompatibilidade || 0));
  }

  async obterTemplatesContato(): Promise<TemplateContato[]> {
    return Array.from(this.templates.values()).filter(t => t.ativo);
  }

  async criarTemplateContato(template: Omit<TemplateContato, 'id' | 'criadoEm'>): Promise<TemplateContato> {
    const id = crypto.randomUUID();
    const novoTemplate: TemplateContato = {
      ...template,
      id,
      criadoEm: new Date()
    };

    this.templates.set(id, novoTemplate);
    return novoTemplate;
  }

  async obterEstatisticasHunting(campanhaId?: string): Promise<{
    totalPerfis: number;
    perfisContatados: number;
    perfisInteressados: number;
    perfisContratados: number;
    taxaResposta: number;
    taxaConversao: number;
  }> {
    const perfis = await this.obterPerfis(campanhaId);
    
    const totalPerfis = perfis.length;
    const perfisContatados = perfis.filter(p => p.status === 'contatado' || p.status === 'interessado' || p.status === 'contratado').length;
    const perfisInteressados = perfis.filter(p => p.status === 'interessado' || p.status === 'contratado').length;
    const perfisContratados = perfis.filter(p => p.status === 'contratado').length;
    
    const taxaResposta = perfisContatados > 0 ? (perfisInteressados / perfisContatados) * 100 : 0;
    const taxaConversao = totalPerfis > 0 ? (perfisContratados / totalPerfis) * 100 : 0;

    return {
      totalPerfis,
      perfisContatados,
      perfisInteressados,
      perfisContratados,
      taxaResposta: Math.round(taxaResposta * 100) / 100,
      taxaConversao: Math.round(taxaConversao * 100) / 100
    };
  }

  private async buscarNoLinkedIn(criterios: CampanhaHunting['criterios']): Promise<PerfilHunting[]> {
    // Simular busca no LinkedIn
    const perfis: PerfilHunting[] = [];
    
    const nomes = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira'];
    const empresas = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'];
    const cargos = ['Desenvolvedor Senior', 'Tech Lead', 'Arquiteto de Software', 'Engenheiro de Software'];
    
    for (let i = 0; i < 10; i++) {
      const perfil: PerfilHunting = {
        id: crypto.randomUUID(),
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        email: `candidato${i}@email.com`,
        linkedin: `https://linkedin.com/in/candidato${i}`,
        empresaAtual: empresas[Math.floor(Math.random() * empresas.length)],
        cargoAtual: cargos[Math.floor(Math.random() * cargos.length)],
        localizacao: 'São Paulo, SP',
        habilidades: criterios.habilidades.slice(0, Math.floor(Math.random() * 3) + 1),
        experiencia: Math.floor(Math.random() * 10) + 2,
        status: 'disponivel',
        fonte: 'linkedin',
        criadoEm: new Date()
      };
      
      perfis.push(perfil);
    }
    
    return perfis;
  }

  private async buscarNoGitHub(criterios: CampanhaHunting['criterios']): Promise<PerfilHunting[]> {
    // Simular busca no GitHub
    const perfis: PerfilHunting[] = [];
    
    const nomes = ['Dev Silva', 'Code Santos', 'Tech Oliveira', 'Hack Costa', 'Bug Ferreira'];
    
    for (let i = 0; i < 5; i++) {
      const perfil: PerfilHunting = {
        id: crypto.randomUUID(),
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        github: `https://github.com/dev${i}`,
        empresaAtual: 'Freelancer',
        cargoAtual: 'Desenvolvedor Full Stack',
        localizacao: 'Rio de Janeiro, RJ',
        habilidades: criterios.habilidades.slice(0, Math.floor(Math.random() * 2) + 1),
        experiencia: Math.floor(Math.random() * 8) + 1,
        status: 'disponivel',
        fonte: 'github',
        criadoEm: new Date()
      };
      
      perfis.push(perfil);
    }
    
    return perfis;
  }

  private async buscarEmPortfolios(criterios: CampanhaHunting['criterios']): Promise<PerfilHunting[]> {
    // Simular busca em portfolios
    const perfis: PerfilHunting[] = [];
    
    const nomes = ['Port Silva', 'Folio Santos', 'Work Oliveira', 'Show Costa', 'Case Ferreira'];
    
    for (let i = 0; i < 3; i++) {
      const perfil: PerfilHunting = {
        id: crypto.randomUUID(),
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        portfolio: `https://portfolio${i}.dev`,
        empresaAtual: 'Startup',
        cargoAtual: 'Desenvolvedor Frontend',
        localizacao: 'Belo Horizonte, MG',
        habilidades: criterios.habilidades.slice(0, Math.floor(Math.random() * 2) + 1),
        experiencia: Math.floor(Math.random() * 6) + 1,
        status: 'disponivel',
        fonte: 'portfolio',
        criadoEm: new Date()
      };
      
      perfis.push(perfil);
    }
    
    return perfis;
  }

  private removerDuplicatas(perfis: PerfilHunting[]): PerfilHunting[] {
    const unicos = new Map<string, PerfilHunting>();
    
    perfis.forEach(perfil => {
      const chave = perfil.email || perfil.linkedin || perfil.github || perfil.portfolio || perfil.nome;
      if (!unicos.has(chave)) {
        unicos.set(chave, perfil);
      }
    });
    
    return Array.from(unicos.values());
  }

  private aplicarFiltros(perfis: PerfilHunting[], criterios: CampanhaHunting['criterios']): PerfilHunting[] {
    return perfis.filter(perfil => {
      // Filtrar por experiência
      if (perfil.experiencia && perfil.experiencia < criterios.experienciaMinima) {
        return false;
      }
      
      if (criterios.experienciaMaxima && perfil.experiencia && perfil.experiencia > criterios.experienciaMaxima) {
        return false;
      }
      
      // Filtrar por localização
      if (criterios.localizacao && criterios.localizacao.length > 0) {
        if (!perfil.localizacao || !criterios.localizacao.some(loc => 
          perfil.localizacao?.toLowerCase().includes(loc.toLowerCase())
        )) {
          return false;
        }
      }
      
      // Filtrar por empresas excluídas
      if (criterios.empresasExcluidas && criterios.empresasExcluidas.length > 0) {
        if (perfil.empresaAtual && criterios.empresasExcluidas.some(emp => 
          perfil.empresaAtual?.toLowerCase().includes(emp.toLowerCase())
        )) {
          return false;
        }
      }
      
      return true;
    });
  }

  private calcularScoreCompatibilidade(perfil: PerfilHunting, vaga: Vaga): number {
    let score = 0;
    
    // Score por habilidades
    if (perfil.habilidades && vaga.requisitos) {
      const requisitos = vaga.requisitos.toLowerCase();
      const habilidadesMatch = perfil.habilidades.filter(hab => 
        requisitos.includes(hab.toLowerCase())
      );
      score += (habilidadesMatch.length / perfil.habilidades.length) * 40;
    }
    
    // Score por experiência
    if (perfil.experiencia) {
      if (perfil.experiencia >= 5) score += 30;
      else if (perfil.experiencia >= 3) score += 20;
      else if (perfil.experiencia >= 1) score += 10;
    }
    
    // Score por localização
    if (perfil.localizacao && vaga.cidade) {
      if (perfil.localizacao.toLowerCase().includes(vaga.cidade.toLowerCase())) {
        score += 20;
      } else if (perfil.localizacao.toLowerCase().includes(vaga.estado?.toLowerCase() || '')) {
        score += 10;
      }
    }
    
    // Score por empresa atual
    if (perfil.empresaAtual) {
      const empresasTop = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix'];
      if (empresasTop.some(emp => perfil.empresaAtual?.toLowerCase().includes(emp))) {
        score += 10;
      }
    }
    
    return Math.min(score, 100);
  }

  private obterFiltrosAplicados(criterios: CampanhaHunting['criterios']): string[] {
    const filtros: string[] = [];
    
    if (criterios.habilidades.length > 0) {
      filtros.push(`Habilidades: ${criterios.habilidades.join(', ')}`);
    }
    
    if (criterios.experienciaMinima > 0) {
      filtros.push(`Experiência mínima: ${criterios.experienciaMinima} anos`);
    }
    
    if (criterios.localizacao && criterios.localizacao.length > 0) {
      filtros.push(`Localização: ${criterios.localizacao.join(', ')}`);
    }
    
    return filtros;
  }
}

export const sistemaHunting = new SistemaHunting(); 