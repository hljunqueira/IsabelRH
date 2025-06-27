# IsabelRH - Plataforma de Recrutamento e Consultoria RH

Uma plataforma completa de recrutamento e consultoria em recursos humanos, desenvolvida com tecnologias modernas e funcionalidades avançadas.

## 🚀 Funcionalidades

### Para Candidatos
- Cadastro e perfil profissional
- Busca de vagas
- Candidatura em vagas
- Comunicação com empresas
- Teste DISC integrado

### Para Empresas
- Cadastro e perfil empresarial
- Publicação de vagas
- **Ranking Inteligente** de candidatos
- **Triagem Automática** de currículos
- **Parsing de Currículos** com IA
- **Relatórios Avançados** de recrutamento

### Para Administradores
- **Sistema de Comunicação** integrado
- **Hunting** para busca ativa de talentos
- **Multi-Cliente** para gestão de múltiplas empresas
- Dashboard administrativo completo

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **UI Components**: Radix UI + shadcn/ui
- **Estado**: React Query + Context API
- **Roteamento**: Wouter

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd IsabelRH
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1. Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e as chaves de API

#### 3.2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:
```env
# Supabase Configuration
SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Database Configuration
DATABASE_URL=postgresql://postgres:905718@db.wqifsgaxevfdwmfkihhg.supabase.co:5432/postgres

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=7d
```

Crie um arquivo `.env.local` na pasta `client/`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# API Configuration
VITE_API_URL=http://localhost:5000
```

### 4. Configure o banco de dados

#### 4.1. Execute as migrações
```bash
npm run db:setup
```

#### 4.2. Ou execute manualmente no Supabase
1. Acesse o painel do Supabase
2. Vá para SQL Editor
3. Cole o conteúdo do arquivo `server/migrations/create_tables.sql`
4. Execute o script

### 5. Execute a aplicação
```bash
npm run dev
```

A aplicação estará disponível em:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📊 Estrutura do Projeto

```
IsabelRH/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── lib/           # Configurações e utilitários
│   │   ├── pages/         # Páginas da aplicação
│   │   └── ui/            # Componentes de UI
│   └── public/            # Arquivos estáticos
├── server/                # Backend Node.js
│   ├── lib/               # Configurações e utilitários
│   ├── migrations/        # Scripts de migração
│   └── routes/            # Rotas da API
├── shared/                # Código compartilhado
└── scripts/               # Scripts de configuração
```

## 🔐 Autenticação

A aplicação usa Supabase Auth com os seguintes tipos de usuário:
- **Candidato**: Acesso ao banco de talentos e candidaturas
- **Empresa**: Acesso às funcionalidades de recrutamento
- **Admin**: Acesso completo ao sistema

### Usuários de Exemplo
Após executar `npm run db:setup`, os seguintes usuários estarão disponíveis:

- **Admin**: admin@isabelrh.com
- **Empresa**: empresa@techcorp.com  
- **Candidato**: candidato@joao.com

## 🚀 Funcionalidades Avançadas

### Ranking Inteligente
- Algoritmo de matching baseado em habilidades, experiência e localização
- Score personalizado para cada vaga
- Filtros avançados de busca

### Triagem Automática
- Análise automática de currículos
- Filtros por critérios específicos
- Dashboard de métricas

### Parsing de Currículos
- Extração automática de dados de currículos
- Suporte a múltiplos formatos (PDF, DOC, DOCX)
- Integração com IA para análise de conteúdo

### Sistema de Comunicação
- Chat em tempo real entre candidatos e empresas
- Notificações push
- Histórico de conversas

### Hunting
- Busca ativa de talentos
- Segmentação por critérios específicos
- Campanhas de recrutamento

### Multi-Cliente
- Gestão de múltiplas empresas
- Relatórios consolidados
- Configurações personalizadas por cliente

## 📈 Relatórios

- Métricas de recrutamento
- Análise de performance
- Dashboards interativos
- Exportação de dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: contato@isabelrh.com

---

Desenvolvido com ❤️ pela equipe IsabelRH 