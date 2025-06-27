import { storage } from "./storage";
import type { Candidato, InsertCandidato } from "@shared/schema";

export interface DadosExtraidos {
  nome?: string;
  email?: string;
  telefone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  genero?: string;
  nivelEscolaridade?: string;
  curso?: string;
  instituicao?: string;
  anoFormacao?: string;
  idiomas?: string[];
  habilidades?: string[];
  experiencias?: string;
  certificacoes?: string;
  objetivoProfissional?: string;
  pretensaoSalarial?: string;
  disponibilidade?: string;
  modalidadeTrabalho?: string;
  areasInteresse?: string[];
}

export interface ResultadoParsing {
  sucesso: boolean;
  dados: DadosExtraidos;
  confianca: number;
  erros: string[];
  avisos: string[];
}

export class SistemaParsing {
  private habilidadesComuns = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'Docker',
    'AWS', 'Azure', 'Google Cloud', 'Linux', 'Windows', 'MacOS',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Slack',
    'Excel', 'PowerPoint', 'Word', 'Photoshop', 'Illustrator', 'Figma',
    'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano'
  ];

  private niveisEscolaridade = [
    'Ensino Fundamental', 'Ensino Médio', 'Técnico', 'Graduação', 'Pós-graduação', 'Mestrado', 'Doutorado'
  ];

  private estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  async processarCurriculo(
    conteudo: string,
    candidatoId?: string
  ): Promise<ResultadoParsing> {
    try {
      const dados: DadosExtraidos = {};
      const erros: string[] = [];
      const avisos: string[] = [];
      let confianca = 0;

      // Extrair dados básicos
      const nome = this.extrairNome(conteudo);
      if (nome) {
        dados.nome = nome;
        confianca += 10;
      } else {
        erros.push('Nome não encontrado');
      }

      const email = this.extrairEmail(conteudo);
      if (email) {
        dados.email = email;
        confianca += 15;
      } else {
        erros.push('Email não encontrado');
      }

      const telefone = this.extrairTelefone(conteudo);
      if (telefone) {
        dados.telefone = telefone;
        confianca += 10;
      } else {
        avisos.push('Telefone não encontrado');
      }

      // Extrair links
      const linkedin = this.extrairLinkedIn(conteudo);
      if (linkedin) {
        dados.linkedin = linkedin;
        confianca += 5;
      }

      const github = this.extrairGitHub(conteudo);
      if (github) {
        dados.github = github;
        confianca += 5;
      }

      const portfolio = this.extrairPortfolio(conteudo);
      if (portfolio) {
        dados.portfolio = portfolio;
        confianca += 5;
      }

      // Extrair endereço
      const endereco = this.extrairEndereco(conteudo);
      if (endereco) {
        dados.endereco = endereco.endereco;
        dados.cidade = endereco.cidade;
        dados.estado = endereco.estado;
        dados.cep = endereco.cep;
        confianca += 10;
      }

      // Extrair informações pessoais
      const dataNascimento = this.extrairDataNascimento(conteudo);
      if (dataNascimento) {
        dados.dataNascimento = dataNascimento;
        confianca += 5;
      }

      const estadoCivil = this.extrairEstadoCivil(conteudo);
      if (estadoCivil) {
        dados.estadoCivil = estadoCivil;
        confianca += 3;
      }

      const genero = this.extrairGenero(conteudo);
      if (genero) {
        dados.genero = genero;
        confianca += 3;
      }

      // Extrair formação acadêmica
      const formacao = this.extrairFormacaoAcademica(conteudo);
      if (formacao) {
        dados.nivelEscolaridade = formacao.nivel;
        dados.curso = formacao.curso;
        dados.instituicao = formacao.instituicao;
        dados.anoFormacao = formacao.ano;
        confianca += 15;
      }

      // Extrair idiomas
      const idiomas = this.extrairIdiomas(conteudo);
      if (idiomas.length > 0) {
        dados.idiomas = idiomas;
        confianca += 8;
      }

      // Extrair habilidades
      const habilidades = this.extrairHabilidades(conteudo);
      if (habilidades.length > 0) {
        dados.habilidades = habilidades;
        confianca += 12;
      }

      // Extrair experiência
      const experiencias = this.extrairExperiencias(conteudo);
      if (experiencias) {
        dados.experiencias = experiencias;
        confianca += 10;
      }

      // Extrair certificações
      const certificacoes = this.extrairCertificacoes(conteudo);
      if (certificacoes) {
        dados.certificacoes = certificacoes;
        confianca += 5;
      }

      // Extrair objetivo profissional
      const objetivo = this.extrairObjetivoProfissional(conteudo);
      if (objetivo) {
        dados.objetivoProfissional = objetivo;
        confianca += 5;
      }

      // Extrair pretensão salarial
      const pretensao = this.extrairPretensaoSalarial(conteudo);
      if (pretensao) {
        dados.pretensaoSalarial = pretensao;
        confianca += 5;
      }

      // Extrair disponibilidade
      const disponibilidade = this.extrairDisponibilidade(conteudo);
      if (disponibilidade) {
        dados.disponibilidade = disponibilidade;
        confianca += 3;
      }

      // Extrair modalidade de trabalho
      const modalidade = this.extrairModalidadeTrabalho(conteudo);
      if (modalidade) {
        dados.modalidadeTrabalho = modalidade;
        confianca += 3;
      }

      // Extrair áreas de interesse
      const areasInteresse = this.extrairAreasInteresse(conteudo);
      if (areasInteresse.length > 0) {
        dados.areasInteresse = areasInteresse;
        confianca += 5;
      }

      return {
        sucesso: confianca >= 30,
        dados,
        confianca: Math.min(confianca, 100),
        erros,
        avisos
      };
    } catch (error) {
      console.error('Erro ao processar currículo:', error);
      return {
        sucesso: false,
        dados: {},
        confianca: 0,
        erros: ['Erro interno no processamento'],
        avisos: []
      };
    }
  }

  async aplicarDadosExtraidos(
    candidatoId: string,
    dados: DadosExtraidos
  ): Promise<boolean> {
    try {
      const candidato = await storage.getCandidato(candidatoId);
      if (!candidato) {
        throw new Error('Candidato não encontrado');
      }

      // Preparar dados para atualização
      const dadosAtualizacao: Partial<InsertCandidato> = {};

      // Aplicar apenas campos que não estão preenchidos ou que têm dados mais completos
      if (dados.nome && !candidato.nome) dadosAtualizacao.nome = dados.nome;
      if (dados.telefone && !candidato.telefone) dadosAtualizacao.telefone = dados.telefone;
      if (dados.linkedin && !candidato.linkedin) dadosAtualizacao.linkedin = dados.linkedin;
      if (dados.github && !candidato.github) dadosAtualizacao.github = dados.github;
      if (dados.portfolio && !candidato.portfolio) dadosAtualizacao.portfolio = dados.portfolio;
      if (dados.endereco && !candidato.endereco) dadosAtualizacao.endereco = dados.endereco;
      if (dados.cidade && !candidato.cidade) dadosAtualizacao.cidade = dados.cidade;
      if (dados.estado && !candidato.estado) dadosAtualizacao.estado = dados.estado;
      if (dados.cep && !candidato.cep) dadosAtualizacao.cep = dados.cep;
      if (dados.dataNascimento && !candidato.dataNascimento) dadosAtualizacao.dataNascimento = dados.dataNascimento;
      if (dados.estadoCivil && !candidato.estadoCivil) dadosAtualizacao.estadoCivil = dados.estadoCivil;
      if (dados.genero && !candidato.genero) dadosAtualizacao.genero = dados.genero;
      if (dados.nivelEscolaridade && !candidato.nivelEscolaridade) dadosAtualizacao.nivelEscolaridade = dados.nivelEscolaridade;
      if (dados.curso && !candidato.curso) dadosAtualizacao.curso = dados.curso;
      if (dados.instituicao && !candidato.instituicao) dadosAtualizacao.instituicao = dados.instituicao;
      if (dados.anoFormacao && !candidato.anoFormacao) dadosAtualizacao.anoFormacao = dados.anoFormacao;
      if (dados.idiomas && (!candidato.idiomas || candidato.idiomas.length === 0)) dadosAtualizacao.idiomas = dados.idiomas;
      if (dados.habilidades && (!candidato.habilidades || candidato.habilidades.length === 0)) dadosAtualizacao.habilidades = dados.habilidades;
      if (dados.experiencias && !candidato.experiencias) dadosAtualizacao.experiencias = dados.experiencias;
      if (dados.certificacoes && !candidato.certificacoes) dadosAtualizacao.certificacoes = dados.certificacoes;
      if (dados.objetivoProfissional && !candidato.objetivoProfissional) dadosAtualizacao.objetivoProfissional = dados.objetivoProfissional;
      if (dados.pretensaoSalarial && !candidato.pretensaoSalarial) dadosAtualizacao.pretensaoSalarial = dados.pretensaoSalarial;
      if (dados.disponibilidade && !candidato.disponibilidade) dadosAtualizacao.disponibilidade = dados.disponibilidade;
      if (dados.modalidadeTrabalho && !candidato.modalidadeTrabalho) dadosAtualizacao.modalidadeTrabalho = dados.modalidadeTrabalho;
      if (dados.areasInteresse && (!candidato.areasInteresse || candidato.areasInteresse.length === 0)) dadosAtualizacao.areasInteresse = dados.areasInteresse;

      // Atualizar candidato
      await storage.updateCandidato(candidatoId, dadosAtualizacao);
      return true;
    } catch (error) {
      console.error('Erro ao aplicar dados extraídos:', error);
      return false;
    }
  }

  private extrairNome(conteudo: string): string | null {
    // Buscar padrões de nome no início do documento
    const linhas = conteudo.split('\n').slice(0, 10);
    for (const linha of linhas) {
      const nome = linha.trim();
      if (nome.length > 3 && nome.length < 100 && /^[A-ZÀ-Ú][a-zà-ú\s]+$/.test(nome)) {
        return nome;
      }
    }
    return null;
  }

  private extrairEmail(conteudo: string): string | null {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = conteudo.match(emailRegex);
    return emails ? emails[0] : null;
  }

  private extrairTelefone(conteudo: string): string | null {
    const telefoneRegex = /\(?([0-9]{2})\)?[\s-]?([0-9]{4,5})[\s-]?([0-9]{4})/g;
    const telefones = conteudo.match(telefoneRegex);
    return telefones ? telefones[0] : null;
  }

  private extrairLinkedIn(conteudo: string): string | null {
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
    const linkedins = conteudo.match(linkedinRegex);
    return linkedins ? linkedins[0] : null;
  }

  private extrairGitHub(conteudo: string): string | null {
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi;
    const githubs = conteudo.match(githubRegex);
    return githubs ? githubs[0] : null;
  }

  private extrairPortfolio(conteudo: string): string | null {
    const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|dev|io|net|org)/gi;
    const portfolios = conteudo.match(portfolioRegex);
    return portfolios ? portfolios[0] : null;
  }

  private extrairEndereco(conteudo: string): { endereco: string; cidade: string; estado: string; cep: string } | null {
    const enderecoRegex = /([^,]+),\s*([^,]+),\s*([A-Z]{2})\s*-\s*CEP:\s*(\d{5}-?\d{3})/i;
    const match = conteudo.match(enderecoRegex);
    
    if (match) {
      return {
        endereco: match[1].trim(),
        cidade: match[2].trim(),
        estado: match[3].trim(),
        cep: match[4].trim()
      };
    }
    return null;
  }

  private extrairDataNascimento(conteudo: string): string | null {
    const dataRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/g;
    const datas = conteudo.match(dataRegex);
    return datas ? datas[0] : null;
  }

  private extrairEstadoCivil(conteudo: string): string | null {
    const estados = ['solteiro', 'casado', 'divorciado', 'viúvo', 'separado'];
    const conteudoLower = conteudo.toLowerCase();
    
    for (const estado of estados) {
      if (conteudoLower.includes(estado)) {
        return estado.charAt(0).toUpperCase() + estado.slice(1);
      }
    }
    return null;
  }

  private extrairGenero(conteudo: string): string | null {
    const generos = ['masculino', 'feminino', 'não binário'];
    const conteudoLower = conteudo.toLowerCase();
    
    for (const genero of generos) {
      if (conteudoLower.includes(genero)) {
        return genero.charAt(0).toUpperCase() + genero.slice(1);
      }
    }
    return null;
  }

  private extrairFormacaoAcademica(conteudo: string): { nivel: string; curso: string; instituicao: string; ano: string } | null {
    const formacaoRegex = /(?:Graduação|Bacharelado|Licenciatura|Técnico|Mestrado|Doutorado)[^:]*:\s*([^,]+),\s*([^,]+),\s*(\d{4})/i;
    const match = conteudo.match(formacaoRegex);
    
    if (match) {
      return {
        nivel: match[0].split(':')[0].trim(),
        curso: match[1].trim(),
        instituicao: match[2].trim(),
        ano: match[3].trim()
      };
    }
    return null;
  }

  private extrairIdiomas(conteudo: string): string[] {
    const idiomas: string[] = [];
    const conteudoLower = conteudo.toLowerCase();
    
    const idiomasComuns = ['inglês', 'espanhol', 'francês', 'alemão', 'italiano', 'português'];
    
    for (const idioma of idiomasComuns) {
      if (conteudoLower.includes(idioma)) {
        idiomas.push(idioma.charAt(0).toUpperCase() + idioma.slice(1));
      }
    }
    
    return idiomas;
  }

  private extrairHabilidades(conteudo: string): string[] {
    const habilidades: string[] = [];
    const conteudoLower = conteudo.toLowerCase();
    
    for (const habilidade of this.habilidadesComuns) {
      if (conteudoLower.includes(habilidade.toLowerCase())) {
        habilidades.push(habilidade);
      }
    }
    
    return habilidades;
  }

  private extrairExperiencias(conteudo: string): string | null {
    // Buscar seção de experiência
    const experienciaRegex = /(?:experiência|experience)[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)/i;
    const match = conteudo.match(experienciaRegex);
    
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  private extrairCertificacoes(conteudo: string): string | null {
    const certificacaoRegex = /(?:certificações|certifications)[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)/i;
    const match = conteudo.match(certificacaoRegex);
    
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  private extrairObjetivoProfissional(conteudo: string): string | null {
    const objetivoRegex = /(?:objetivo|objective)[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)/i;
    const match = conteudo.match(objetivoRegex);
    
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  private extrairPretensaoSalarial(conteudo: string): string | null {
    const pretensaoRegex = /(?:pretensão|pretensão|salário|salary)[^:]*:\s*R?\$?\s*([\d.,]+)/i;
    const match = conteudo.match(pretensaoRegex);
    
    if (match) {
      return `R$ ${match[1]}`;
    }
    return null;
  }

  private extrairDisponibilidade(conteudo: string): string | null {
    const disponibilidadeRegex = /(?:disponibilidade|availability)[^:]*:\s*([^,\n]+)/i;
    const match = conteudo.match(disponibilidadeRegex);
    
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  private extrairModalidadeTrabalho(conteudo: string): string | null {
    const modalidades = ['presencial', 'remoto', 'híbrido', 'hibrido'];
    const conteudoLower = conteudo.toLowerCase();
    
    for (const modalidade of modalidades) {
      if (conteudoLower.includes(modalidade)) {
        return modalidade.charAt(0).toUpperCase() + modalidade.slice(1);
      }
    }
    return null;
  }

  private extrairAreasInteresse(conteudo: string): string[] {
    const areas: string[] = [];
    const areasComuns = ['desenvolvimento', 'marketing', 'vendas', 'rh', 'recursos humanos', 'financeiro', 'administrativo'];
    const conteudoLower = conteudo.toLowerCase();
    
    for (const area of areasComuns) {
      if (conteudoLower.includes(area)) {
        areas.push(area.charAt(0).toUpperCase() + area.slice(1));
      }
    }
    
    return areas;
  }
}

export const sistemaParsing = new SistemaParsing(); 