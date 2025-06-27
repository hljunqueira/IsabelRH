import { useState, useCallback } from 'react';

interface DadosExtraidos {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  experiencia: Array<{
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string;
    tecnologias: string[];
  }>;
  educacao: Array<{
    instituicao: string;
    curso: string;
    nivel: string;
    periodo: string;
    concluido: boolean;
  }>;
  habilidades: Array<{
    nome: string;
    nivel: 'basico' | 'intermediario' | 'avancado' | 'expert';
    categoria: string;
  }>;
  idiomas: Array<{
    idioma: string;
    nivel: 'basico' | 'intermediario' | 'avancado' | 'nativo';
  }>;
  certificacoes: Array<{
    nome: string;
    emissor: string;
    data: string;
    validade?: string;
  }>;
  resumo: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  expectativaSalarial?: number;
  disponibilidade?: string;
  preferencias?: {
    modalidade: 'presencial' | 'hibrido' | 'remoto';
    tipoContrato: 'clt' | 'pj' | 'freelance';
    setores: string[];
  };
}

interface ArquivoProcessado {
  id: string;
  nome: string;
  tamanho: number;
  tipo: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  progresso: number;
  dadosExtraidos?: DadosExtraidos;
  erro?: string;
  timestamp: Date;
}

interface ResultadoParsing {
  sucesso: boolean;
  dados?: DadosExtraidos;
  erro?: string;
  confianca: number;
  camposDetectados: string[];
  camposFaltantes: string[];
}

interface UseParsingProps {
  onProcessamentoCompleto?: (dados: DadosExtraidos) => void;
  onErro?: (erro: string) => void;
}

export function useParsing({ onProcessamentoCompleto, onErro }: UseParsingProps = {}) {
  const [arquivos, setArquivos] = useState<ArquivoProcessado[]>([]);
  const [processando, setProcessando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Processar arquivo individual
  const processarArquivo = useCallback(async (arquivo: File): Promise<ResultadoParsing> => {
    setProcessando(true);
    setError(null);

    const arquivoId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Adicionar arquivo à lista
    const novoArquivo: ArquivoProcessado = {
      id: arquivoId,
      nome: arquivo.name,
      tamanho: arquivo.size,
      tipo: arquivo.type,
      status: 'processando',
      progresso: 0,
      timestamp: new Date()
    };

    setArquivos(prev => [...prev, novoArquivo]);

    try {
      // Simular progresso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setArquivos(prev => prev.map(a => 
          a.id === arquivoId 
            ? { ...a, progresso: i }
            : a
        ));
      }

      // Simular dados extraídos
      const dadosExtraidos: DadosExtraidos = {
        id: arquivoId,
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-9999',
        endereco: {
          rua: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        experiencia: [
          {
            empresa: 'TechCorp',
            cargo: 'Desenvolvedor Full Stack Senior',
            periodo: '2020 - 2023',
            descricao: 'Desenvolvimento de aplicações web usando React, Node.js e Python',
            tecnologias: ['React', 'Node.js', 'Python', 'PostgreSQL']
          },
          {
            empresa: 'StartupXYZ',
            cargo: 'Desenvolvedor Frontend',
            periodo: '2018 - 2020',
            descricao: 'Desenvolvimento de interfaces de usuário responsivas',
            tecnologias: ['Vue.js', 'JavaScript', 'CSS', 'HTML']
          }
        ],
        educacao: [
          {
            instituicao: 'Universidade de São Paulo',
            curso: 'Bacharel em Ciência da Computação',
            nivel: 'Graduação',
            periodo: '2014 - 2018',
            concluido: true
          },
          {
            instituicao: 'FGV',
            curso: 'MBA em Gestão de Projetos',
            nivel: 'Pós-graduação',
            periodo: '2019 - 2021',
            concluido: true
          }
        ],
        habilidades: [
          { nome: 'JavaScript', nivel: 'avancado', categoria: 'Linguagens' },
          { nome: 'TypeScript', nivel: 'avancado', categoria: 'Linguagens' },
          { nome: 'React', nivel: 'expert', categoria: 'Frameworks' },
          { nome: 'Node.js', nivel: 'avancado', categoria: 'Backend' },
          { nome: 'Python', nivel: 'intermediario', categoria: 'Linguagens' },
          { nome: 'SQL', nivel: 'avancado', categoria: 'Banco de Dados' }
        ],
        idiomas: [
          { idioma: 'Português', nivel: 'nativo' },
          { idioma: 'Inglês', nivel: 'avancado' },
          { idioma: 'Espanhol', nivel: 'intermediario' }
        ],
        certificacoes: [
          {
            nome: 'AWS Certified Developer',
            emissor: 'Amazon Web Services',
            data: '2022-06-15',
            validade: '2025-06-15'
          }
        ],
        resumo: 'Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento web, especializado em React e Node.js. Apaixonado por criar soluções inovadoras e escaláveis.',
        linkedin: 'linkedin.com/in/joaosilva',
        github: 'github.com/joaosilva',
        portfolio: 'joaosilva.dev',
        expectativaSalarial: 8000,
        disponibilidade: 'Imediata',
        preferencias: {
          modalidade: 'hibrido',
          tipoContrato: 'clt',
          setores: ['Tecnologia', 'E-commerce', 'Fintech']
        }
      };

      // Atualizar arquivo como concluído
      setArquivos(prev => prev.map(a => 
        a.id === arquivoId 
          ? { ...a, status: 'concluido', progresso: 100, dadosExtraidos }
          : a
      ));

      const resultado: ResultadoParsing = {
        sucesso: true,
        dados: dadosExtraidos,
        confianca: 0.92,
        camposDetectados: ['nome', 'email', 'telefone', 'experiencia', 'educacao', 'habilidades'],
        camposFaltantes: ['certificacoes', 'idiomas']
      };

      onProcessamentoCompleto?.(dadosExtraidos);
      return resultado;

    } catch (err) {
      const erro = err instanceof Error ? err.message : 'Erro desconhecido';
      
      setArquivos(prev => prev.map(a => 
        a.id === arquivoId 
          ? { ...a, status: 'erro', erro }
          : a
      ));

      setError(erro);
      onErro?.(erro);

      return {
        sucesso: false,
        erro,
        confianca: 0,
        camposDetectados: [],
        camposFaltantes: []
      };
    } finally {
      setProcessando(false);
    }
  }, [onProcessamentoCompleto, onErro]);

  // Processar múltiplos arquivos
  const processarArquivos = useCallback(async (arquivos: File[]): Promise<ResultadoParsing[]> => {
    const resultados: ResultadoParsing[] = [];
    
    for (const arquivo of arquivos) {
      const resultado = await processarArquivo(arquivo);
      resultados.push(resultado);
    }
    
    return resultados;
  }, [processarArquivo]);

  // Validar dados extraídos
  const validarDados = useCallback((dados: DadosExtraidos): {
    valido: boolean;
    erros: string[];
    avisos: string[];
  } => {
    const erros: string[] = [];
    const avisos: string[] = [];

    // Validações obrigatórias
    if (!dados.nome || dados.nome.trim().length < 2) {
      erros.push('Nome é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!dados.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      erros.push('Email é obrigatório e deve ser válido');
    }

    if (!dados.telefone || dados.telefone.trim().length < 10) {
      erros.push('Telefone é obrigatório');
    }

    // Validações de aviso
    if (!dados.experiencia || dados.experiencia.length === 0) {
      avisos.push('Nenhuma experiência profissional detectada');
    }

    if (!dados.educacao || dados.educacao.length === 0) {
      avisos.push('Nenhuma formação acadêmica detectada');
    }

    if (!dados.habilidades || dados.habilidades.length < 3) {
      avisos.push('Poucas habilidades detectadas');
    }

    if (!dados.resumo || dados.resumo.trim().length < 50) {
      avisos.push('Resumo muito curto ou não detectado');
    }

    return {
      valido: erros.length === 0,
      erros,
      avisos
    };
  }, []);

  // Exportar dados em diferentes formatos
  const exportarDados = useCallback(async (dados: DadosExtraidos, formato: 'json' | 'pdf' | 'csv'): Promise<string> => {
    try {
      const response = await fetch('/api/parsing/exportar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dados,
          formato
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Download automático
      const a = document.createElement('a');
      a.href = url;
      a.download = `curriculo_${dados.nome.replace(/\s+/g, '_')}.${formato}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return url;
    } catch (err) {
      const erro = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(erro);
      throw err;
    }
  }, []);

  // Comparar currículos
  const compararCurriculos = useCallback((curriculos: DadosExtraidos[]): {
    comparacao: Array<{
      campo: string;
      valores: string[];
      similaridade: number;
    }>;
    ranking: Array<{
      candidato: DadosExtraidos;
      score: number;
      pontos: string[];
    }>;
  } => {
    if (curriculos.length < 2) {
      throw new Error('É necessário pelo menos 2 currículos para comparação');
    }

    // Simular comparação
    const comparacao = [
      {
        campo: 'experiencia',
        valores: curriculos.map(c => `${c.experiencia.length} anos`),
        similaridade: 0.75
      },
      {
        campo: 'habilidades',
        valores: curriculos.map(c => c.habilidades.map(h => h.nome).join(', ')),
        similaridade: 0.60
      },
      {
        campo: 'educacao',
        valores: curriculos.map(c => c.educacao.map(e => e.nivel).join(', ')),
        similaridade: 0.85
      }
    ];

    const ranking = curriculos.map((candidato, index) => ({
      candidato,
      score: 85 - (index * 10),
      pontos: [
        `${candidato.experiencia.length} anos de experiência`,
        `${candidato.habilidades.length} habilidades`,
        candidato.certificacoes.length > 0 ? 'Possui certificações' : 'Sem certificações'
      ]
    }));

    return { comparacao, ranking };
  }, []);

  // Remover arquivo da lista
  const removerArquivo = useCallback((arquivoId: string) => {
    setArquivos(prev => prev.filter(a => a.id !== arquivoId));
  }, []);

  // Limpar todos os arquivos
  const limparArquivos = useCallback(() => {
    setArquivos([]);
    setError(null);
  }, []);

  // Obter estatísticas
  const obterEstatisticas = useCallback(() => {
    const total = arquivos.length;
    const concluidos = arquivos.filter(a => a.status === 'concluido').length;
    const comErro = arquivos.filter(a => a.status === 'erro').length;
    const processando = arquivos.filter(a => a.status === 'processando').length;

    return {
      total,
      concluidos,
      comErro,
      processando,
      taxaSucesso: total > 0 ? (concluidos / total) * 100 : 0
    };
  }, [arquivos]);

  return {
    // Estado
    arquivos,
    processando,
    error,
    
    // Ações principais
    processarArquivo,
    processarArquivos,
    validarDados,
    exportarDados,
    compararCurriculos,
    
    // Gerenciamento de arquivos
    removerArquivo,
    limparArquivos,
    
    // Utilitários
    obterEstatisticas,
    limparError: () => setError(null)
  };
} 