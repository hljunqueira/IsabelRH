import { storage } from "./storage";
import type { Usuario, Candidato, Empresa } from "@shared/schema";

export interface Mensagem {
  id: string;
  conversaId: string;
  remetenteId: string;
  remetenteTipo: 'candidato' | 'empresa' | 'admin';
  destinatarioId: string;
  destinatarioTipo: 'candidato' | 'empresa' | 'admin';
  conteudo: string;
  tipo: 'texto' | 'template' | 'sistema';
  templateId?: string;
  lida: boolean;
  dataEnvio: Date;
  dataLeitura?: Date;
}

export interface Conversa {
  id: string;
  candidatoId: string;
  empresaId: string;
  vagaId?: string;
  titulo: string;
  status: 'ativa' | 'encerrada' | 'arquivada';
  ultimaMensagem?: Mensagem;
  totalMensagens: number;
  naoLidas: number;
  criadaEm: Date;
  atualizadaEm: Date;
}

export interface TemplateMensagem {
  id: string;
  nome: string;
  categoria: 'aprovacao' | 'reprovacao' | 'entrevista' | 'teste' | 'geral';
  assunto: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
  criadoEm: Date;
}

export interface Notificacao {
  id: string;
  usuarioId: string;
  tipo: 'mensagem' | 'candidatura' | 'sistema';
  titulo: string;
  mensagem: string;
  dados?: Record<string, any>;
  lida: boolean;
  criadaEm: Date;
  lidaEm?: Date;
}

export class SistemaComunicacao {
  private conversas: Map<string, Conversa> = new Map();
  private mensagens: Map<string, Mensagem> = new Map();
  private templates: Map<string, TemplateMensagem> = new Map();
  private notificacoes: Map<string, Notificacao> = new Map();

  constructor() {
    this.carregarTemplates();
  }

  private carregarTemplates() {
    const templatesPadrao: TemplateMensagem[] = [
      {
        id: 'template-aprovacao',
        nome: 'Candidatura Aprovada',
        categoria: 'aprovacao',
        assunto: 'Parabéns! Sua candidatura foi aprovada',
        conteudo: `Olá {{nome_candidato}}!

Parabéns! Sua candidatura para a vaga de {{titulo_vaga}} foi aprovada na triagem inicial.

Score obtido: {{score}}%
Classificação: {{classificacao}}

Próximos passos: {{proximos_passos}}

Aguarde nosso contato para agendamento da {{proxima_etapa}}.

Atenciosamente,
Equipe de RH`,
        variaveis: ['nome_candidato', 'titulo_vaga', 'score', 'classificacao', 'proximos_passos', 'proxima_etapa'],
        ativo: true,
        criadoEm: new Date()
      },
      {
        id: 'template-reprovacao',
        nome: 'Candidatura Não Aprovada',
        categoria: 'reprovacao',
        assunto: 'Atualização sobre sua candidatura',
        conteudo: `Olá {{nome_candidato}},

Obrigado pelo interesse na vaga de {{titulo_vaga}}.

Infelizmente, sua candidatura não foi aprovada nesta etapa.

Score obtido: {{score}}%
Motivo: {{motivo}}

Mantenha seu perfil atualizado para futuras oportunidades.

Atenciosamente,
Equipe de RH`,
        variaveis: ['nome_candidato', 'titulo_vaga', 'score', 'motivo'],
        ativo: true,
        criadoEm: new Date()
      },
      {
        id: 'template-entrevista',
        nome: 'Agendamento de Entrevista',
        categoria: 'entrevista',
        assunto: 'Agendamento de Entrevista',
        conteudo: `Olá {{nome_candidato}}!

Sua candidatura para {{titulo_vaga}} foi selecionada para entrevista.

Data: {{data_entrevista}}
Horário: {{horario_entrevista}}
Local: {{local_entrevista}}
Tipo: {{tipo_entrevista}}

Por favor, confirme sua presença respondendo esta mensagem.

Atenciosamente,
{{nome_recrutador}}
{{cargo_recrutador}}`,
        variaveis: ['nome_candidato', 'titulo_vaga', 'data_entrevista', 'horario_entrevista', 'local_entrevista', 'tipo_entrevista', 'nome_recrutador', 'cargo_recrutador'],
        ativo: true,
        criadoEm: new Date()
      }
    ];

    templatesPadrao.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async criarConversa(
    candidatoId: string,
    empresaId: string,
    vagaId?: string,
    titulo?: string
  ): Promise<Conversa> {
    const id = crypto.randomUUID();
    const conversa: Conversa = {
      id,
      candidatoId,
      empresaId,
      vagaId,
      titulo: titulo || 'Nova conversa',
      status: 'ativa',
      totalMensagens: 0,
      naoLidas: 0,
      criadaEm: new Date(),
      atualizadaEm: new Date()
    };

    this.conversas.set(id, conversa);
    return conversa;
  }

  async obterConversas(usuarioId: string, tipo: 'candidato' | 'empresa'): Promise<Conversa[]> {
    const conversas = Array.from(this.conversas.values());
    
    if (tipo === 'candidato') {
      return conversas.filter(c => c.candidatoId === usuarioId);
    } else {
      return conversas.filter(c => c.empresaId === usuarioId);
    }
  }

  async enviarMensagem(
    conversaId: string,
    remetenteId: string,
    remetenteTipo: 'candidato' | 'empresa' | 'admin',
    destinatarioId: string,
    destinatarioTipo: 'candidato' | 'empresa' | 'admin',
    conteudo: string,
    tipo: 'texto' | 'template' = 'texto',
    templateId?: string
  ): Promise<Mensagem> {
    const id = crypto.randomUUID();
    const mensagem: Mensagem = {
      id,
      conversaId,
      remetenteId,
      remetenteTipo,
      destinatarioId,
      destinatarioTipo,
      conteudo,
      tipo,
      templateId,
      lida: false,
      dataEnvio: new Date()
    };

    this.mensagens.set(id, mensagem);

    // Atualizar conversa
    const conversa = this.conversas.get(conversaId);
    if (conversa) {
      conversa.ultimaMensagem = mensagem;
      conversa.totalMensagens++;
      conversa.naoLidas++;
      conversa.atualizadaEm = new Date();
    }

    // Criar notificação
    await this.criarNotificacao(
      destinatarioId,
      'mensagem',
      'Nova mensagem',
      `Você recebeu uma nova mensagem na conversa "${conversa?.titulo || 'Nova conversa'}"`,
      { conversaId, mensagemId: id }
    );

    return mensagem;
  }

  async enviarMensagemTemplate(
    conversaId: string,
    remetenteId: string,
    remetenteTipo: 'candidato' | 'empresa' | 'admin',
    destinatarioId: string,
    destinatarioTipo: 'candidato' | 'empresa' | 'admin',
    templateId: string,
    variaveis: Record<string, string>
  ): Promise<Mensagem> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template não encontrado');
    }

    let conteudo = template.conteudo;
    
    // Substituir variáveis
    Object.entries(variaveis).forEach(([chave, valor]) => {
      const regex = new RegExp(`{{${chave}}}`, 'g');
      conteudo = conteudo.replace(regex, valor);
    });

    return this.enviarMensagem(
      conversaId,
      remetenteId,
      remetenteTipo,
      destinatarioId,
      destinatarioTipo,
      conteudo,
      'template',
      templateId
    );
  }

  async obterMensagens(conversaId: string): Promise<Mensagem[]> {
    const mensagens = Array.from(this.mensagens.values());
    return mensagens
      .filter(m => m.conversaId === conversaId)
      .sort((a, b) => a.dataEnvio.getTime() - b.dataEnvio.getTime());
  }

  async marcarComoLida(mensagemId: string): Promise<void> {
    const mensagem = this.mensagens.get(mensagemId);
    if (mensagem && !mensagem.lida) {
      mensagem.lida = true;
      mensagem.dataLeitura = new Date();

      // Atualizar contador de não lidas da conversa
      const conversa = this.conversas.get(mensagem.conversaId);
      if (conversa && conversa.naoLidas > 0) {
        conversa.naoLidas--;
      }
    }
  }

  async marcarConversaComoLida(conversaId: string, usuarioId: string): Promise<void> {
    const mensagens = await this.obterMensagens(conversaId);
    const mensagensNaoLidas = mensagens.filter(m => 
      !m.lida && m.destinatarioId === usuarioId
    );

    for (const mensagem of mensagensNaoLidas) {
      await this.marcarComoLida(mensagem.id);
    }
  }

  async obterTemplates(categoria?: string): Promise<TemplateMensagem[]> {
    const templates = Array.from(this.templates.values());
    if (categoria) {
      return templates.filter(t => t.categoria === categoria && t.ativo);
    }
    return templates.filter(t => t.ativo);
  }

  async criarTemplate(template: Omit<TemplateMensagem, 'id' | 'criadoEm'>): Promise<TemplateMensagem> {
    const id = crypto.randomUUID();
    const novoTemplate: TemplateMensagem = {
      ...template,
      id,
      criadoEm: new Date()
    };

    this.templates.set(id, novoTemplate);
    return novoTemplate;
  }

  async criarNotificacao(
    usuarioId: string,
    tipo: 'mensagem' | 'candidatura' | 'sistema',
    titulo: string,
    mensagem: string,
    dados?: Record<string, any>
  ): Promise<Notificacao> {
    const id = crypto.randomUUID();
    const notificacao: Notificacao = {
      id,
      usuarioId,
      tipo,
      titulo,
      mensagem,
      dados,
      lida: false,
      criadaEm: new Date()
    };

    this.notificacoes.set(id, notificacao);
    return notificacao;
  }

  async obterNotificacoes(usuarioId: string, naoLidas?: boolean): Promise<Notificacao[]> {
    const notificacoes = Array.from(this.notificacoes.values())
      .filter(n => n.usuarioId === usuarioId);

    if (naoLidas !== undefined) {
      return notificacoes.filter(n => n.lida === !naoLidas);
    }

    return notificacoes.sort((a, b) => b.criadaEm.getTime() - a.criadaEm.getTime());
  }

  async marcarNotificacaoComoLida(notificacaoId: string): Promise<void> {
    const notificacao = this.notificacoes.get(notificacaoId);
    if (notificacao && !notificacao.lida) {
      notificacao.lida = true;
      notificacao.lidaEm = new Date();
    }
  }

  async obterEstatisticasComunicacao(usuarioId: string): Promise<{
    totalConversas: number;
    mensagensNaoLidas: number;
    notificacoesNaoLidas: number;
    conversasAtivas: number;
  }> {
    const conversas = await this.obterConversas(usuarioId, 'candidato');
    const notificacoes = await this.obterNotificacoes(usuarioId, true);

    return {
      totalConversas: conversas.length,
      mensagensNaoLidas: conversas.reduce((total, c) => total + c.naoLidas, 0),
      notificacoesNaoLidas: notificacoes.length,
      conversasAtivas: conversas.filter(c => c.status === 'ativa').length
    };
  }

  async enviarNotificacaoCandidatura(
    candidatoId: string,
    tipo: 'aprovacao' | 'reprovacao' | 'entrevista' | 'teste',
    dados: Record<string, any>
  ): Promise<void> {
    const templates = {
      aprovacao: 'template-aprovacao',
      reprovacao: 'template-reprovacao',
      entrevista: 'template-entrevista',
      teste: 'template-entrevista'
    };

    const templateId = templates[tipo];
    if (!templateId) return;

    // Criar conversa se não existir
    const conversas = await this.obterConversas(candidatoId, 'candidato');
    let conversa = conversas.find(c => c.vagaId === dados.vagaId);

    if (!conversa) {
      conversa = await this.criarConversa(
        candidatoId,
        dados.empresaId,
        dados.vagaId,
        `Candidatura - ${dados.tituloVaga}`
      );
    }

    // Enviar mensagem template
    await this.enviarMensagemTemplate(
      conversa.id,
      dados.empresaId,
      'empresa',
      candidatoId,
      'candidato',
      templateId,
      dados
    );

    // Criar notificação
    await this.criarNotificacao(
      candidatoId,
      'candidatura',
      `Atualização da candidatura - ${dados.tituloVaga}`,
      `Sua candidatura foi ${tipo === 'aprovacao' ? 'aprovada' : tipo === 'reprovacao' ? 'não aprovada' : 'selecionada para ' + tipo}`,
      { vagaId: dados.vagaId, tipo }
    );
  }
}

export const sistemaComunicacao = new SistemaComunicacao(); 