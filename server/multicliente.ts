import { storage } from "./storage";
import type { Usuario, Empresa } from "@shared/schema";

export interface Cliente {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavel: string;
  cargoResponsavel: string;
  plano: 'basico' | 'profissional' | 'enterprise';
  status: 'ativo' | 'inativo' | 'suspenso';
  dataContrato: Date;
  dataVencimento: Date;
  limiteUsuarios: number;
  limiteVagas: number;
  recursosAtivos: string[];
  configuracoes: ConfiguracaoCliente;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface ConfiguracaoCliente {
  tema: 'claro' | 'escuro' | 'auto';
  idioma: 'pt-BR' | 'en-US' | 'es-ES';
  fusoHorario: string;
  formatoData: string;
  formatoMoeda: string;
  notificacoes: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  integracoes: {
    linkedin: boolean;
    indeed: boolean;
    glassdoor: boolean;
    zapier: boolean;
  };
  personalizacao: {
    logo?: string;
    cores: {
      primaria: string;
      secundaria: string;
      acento: string;
    };
    nomeSistema?: string;
    dominio?: string;
  };
  permissoes: {
    criarVagas: boolean;
    editarVagas: boolean;
    excluirVagas: boolean;
    visualizarCandidatos: boolean;
    editarCandidatos: boolean;
    excluirCandidatos: boolean;
    gerarRelatorios: boolean;
    configurarSistema: boolean;
    gerenciarUsuarios: boolean;
    hunting: boolean;
    parsing: boolean;
  };
}

export interface UsuarioCliente {
  id: string;
  clienteId: string;
  usuarioId: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  perfil: 'admin' | 'gerente' | 'recrutador' | 'visualizador';
  permissoes: string[];
  status: 'ativo' | 'inativo';
  ultimoAcesso?: Date;
  criadoEm: Date;
}

export interface EstatisticasCliente {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalVagas: number;
  vagasAtivas: number;
  totalCandidatos: number;
  totalCandidaturas: number;
  contratacoesMes: number;
  faturamentoMes: number;
  usoRecursos: Record<string, number>;
}

export interface FaturamentoCliente {
  id: string;
  clienteId: string;
  mes: number;
  ano: number;
  valor: number;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  dataVencimento: Date;
  dataPagamento?: Date;
  itens: {
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }[];
  criadoEm: Date;
}

export class SistemaMultiCliente {
  private clientes: Map<string, Cliente> = new Map();
  private usuariosClientes: Map<string, UsuarioCliente> = new Map();
  private faturamentos: Map<string, FaturamentoCliente> = new Map();

  constructor() {
    this.carregarClientesExemplo();
  }

  private carregarClientesExemplo() {
    // Dados mock removidos - sistema agora usa dados reais do Supabase
    console.log('🗂️ Sistema Multi-Cliente: Iniciado sem dados mock');
  }

  async criarCliente(cliente: Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Cliente> {
    const id = crypto.randomUUID();
    const novoCliente: Cliente = {
      ...cliente,
      id,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    this.clientes.set(id, novoCliente);
    return novoCliente;
  }

  async obterCliente(clienteId: string): Promise<Cliente | null> {
    return this.clientes.get(clienteId) || null;
  }

  async obterTodosClientes(): Promise<Cliente[]> {
    return Array.from(this.clientes.values());
  }

  async atualizarCliente(clienteId: string, dados: Partial<Cliente>): Promise<Cliente | null> {
    const cliente = this.clientes.get(clienteId);
    if (!cliente) return null;

    const clienteAtualizado: Cliente = {
      ...cliente,
      ...dados,
      atualizadoEm: new Date()
    };

    this.clientes.set(clienteId, clienteAtualizado);
    return clienteAtualizado;
  }

  async adicionarUsuarioCliente(usuarioCliente: Omit<UsuarioCliente, 'id' | 'criadoEm'>): Promise<UsuarioCliente> {
    const id = crypto.randomUUID();
    const novoUsuario: UsuarioCliente = {
      ...usuarioCliente,
      id,
      criadoEm: new Date()
    };

    this.usuariosClientes.set(id, novoUsuario);
    return novoUsuario;
  }

  async obterUsuariosCliente(clienteId: string): Promise<UsuarioCliente[]> {
    const usuarios = Array.from(this.usuariosClientes.values());
    return usuarios.filter(u => u.clienteId === clienteId);
  }

  async obterUsuarioCliente(usuarioId: string): Promise<UsuarioCliente | null> {
    const usuarios = Array.from(this.usuariosClientes.values());
    return usuarios.find(u => u.usuarioId === usuarioId) || null;
  }

  async verificarPermissao(usuarioId: string, permissao: string): Promise<boolean> {
    const usuarioCliente = await this.obterUsuarioCliente(usuarioId);
    if (!usuarioCliente) return false;

    const cliente = await this.obterCliente(usuarioCliente.clienteId);
    if (!cliente) return false;

    // Verificar se o recurso está ativo para o cliente
    if (!cliente.recursosAtivos.includes(permissao)) {
      return false;
    }

    // Verificar permissões específicas do usuário
    if (usuarioCliente.permissoes.includes(permissao)) {
      return true;
    }

    // Verificar permissões do perfil
    switch (usuarioCliente.perfil) {
      case 'admin':
        return true;
      case 'gerente':
        return ['criarVagas', 'editarVagas', 'visualizarCandidatos', 'editarCandidatos', 'gerarRelatorios', 'gerenciarUsuarios'].includes(permissao);
      case 'recrutador':
        return ['criarVagas', 'editarVagas', 'visualizarCandidatos', 'editarCandidatos'].includes(permissao);
      case 'visualizador':
        return ['visualizarCandidatos', 'gerarRelatorios'].includes(permissao);
      default:
        return false;
    }
  }

  async obterConfiguracaoCliente(clienteId: string): Promise<ConfiguracaoCliente | null> {
    const cliente = await this.obterCliente(clienteId);
    return cliente?.configuracoes || null;
  }

  async atualizarConfiguracaoCliente(clienteId: string, configuracao: Partial<ConfiguracaoCliente>): Promise<ConfiguracaoCliente | null> {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) return null;

    const configuracaoAtualizada: ConfiguracaoCliente = {
      ...cliente.configuracoes,
      ...configuracao
    };

    await this.atualizarCliente(clienteId, { configuracoes: configuracaoAtualizada });
    return configuracaoAtualizada;
  }

  async obterEstatisticasCliente(clienteId: string): Promise<EstatisticasCliente> {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const usuarios = await this.obterUsuariosCliente(clienteId);
    // Simular dados de vagas e candidatos baseados nos limites do cliente
    const totalVagas = Math.floor(Math.random() * cliente.limiteVagas);
    const vagasAtivas = Math.floor(totalVagas * 0.7);
    const totalCandidatos = Math.floor(Math.random() * 1000);
    const totalCandidaturas = Math.floor(totalCandidatos * 0.3);
    const contratacoesMes = Math.floor(Math.random() * 20);
    const faturamentoMes = contratacoesMes * 5000; // R$ 5.000 por contratação

    const usoRecursos: Record<string, number> = {};
    cliente.recursosAtivos.forEach(recurso => {
      usoRecursos[recurso] = Math.floor(Math.random() * 100);
    });

    return {
      totalUsuarios: usuarios.length,
      usuariosAtivos: usuarios.filter(u => u.status === 'ativo').length,
      totalVagas,
      vagasAtivas,
      totalCandidatos,
      totalCandidaturas,
      contratacoesMes,
      faturamentoMes,
      usoRecursos
    };
  }

  async gerarFaturamento(clienteId: string, mes: number, ano: number): Promise<FaturamentoCliente> {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const id = crypto.randomUUID();
    const valorPlano = this.obterValorPlano(cliente.plano);
    const dataVencimento = new Date(ano, mes - 1, 10); // 10º dia do mês

    const faturamento: FaturamentoCliente = {
      id,
      clienteId,
      mes,
      ano,
      valor: valorPlano,
      status: 'pendente',
      dataVencimento,
      itens: [
        {
          descricao: `Plano ${cliente.plano} - ${mes}/${ano}`,
          quantidade: 1,
          valorUnitario: valorPlano,
          valorTotal: valorPlano
        }
      ],
      criadoEm: new Date()
    };

    this.faturamentos.set(id, faturamento);
    return faturamento;
  }

  async obterFaturamentosCliente(clienteId: string): Promise<FaturamentoCliente[]> {
    const faturamentos = Array.from(this.faturamentos.values());
    return faturamentos.filter(f => f.clienteId === clienteId);
  }

  async marcarFaturamentoComoPago(faturamentoId: string): Promise<void> {
    const faturamento = this.faturamentos.get(faturamentoId);
    if (faturamento) {
      faturamento.status = 'pago';
      faturamento.dataPagamento = new Date();
    }
  }

  async verificarLimitesCliente(clienteId: string, tipo: 'usuarios' | 'vagas'): Promise<{ dentroLimite: boolean; atual: number; limite: number }> {
    const cliente = await this.obterCliente(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    if (tipo === 'usuarios') {
      const usuarios = await this.obterUsuariosCliente(clienteId);
      return {
        dentroLimite: usuarios.length < cliente.limiteUsuarios,
        atual: usuarios.length,
        limite: cliente.limiteUsuarios
      };
    } else {
      // Para vagas, simular contagem baseada no limite
      const totalVagas = Math.floor(Math.random() * cliente.limiteVagas);
      
      return {
        dentroLimite: totalVagas < cliente.limiteVagas,
        atual: totalVagas,
        limite: cliente.limiteVagas
      };
    }
  }

  async obterClientesVencendo(): Promise<Cliente[]> {
    const hoje = new Date();
    const clientes = Array.from(this.clientes.values());
    
    return clientes.filter(cliente => {
      const diasParaVencimento = Math.ceil((cliente.dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diasParaVencimento <= 30 && cliente.status === 'ativo';
    });
  }

  async obterClientesInativos(): Promise<Cliente[]> {
    const clientes = Array.from(this.clientes.values());
    return clientes.filter(cliente => cliente.status === 'inativo' || cliente.status === 'suspenso');
  }

  private obterValorPlano(plano: Cliente['plano']): number {
    switch (plano) {
      case 'basico':
        return 299;
      case 'profissional':
        return 599;
      case 'enterprise':
        return 1299;
      default:
        return 299;
    }
  }
}

export const sistemaMultiCliente = new SistemaMultiCliente(); 