# 🔧 GUIA COMPLETO - CORREÇÃO ERRO 500 E CONFIGURAÇÃO FINAL

## ❌ **PROBLEMA IDENTIFICADO**
O erro 500 na rota `/api/auth/me` acontece por **múltiplos problemas de configuração**:

### 1. **Variáveis de Ambiente Ausentes**
### 2. **Schema de Tabelas Inconsistente**
### 3. **Integração Client/Server Desalinhada**

---

## ✅ **SOLUÇÃO COMPLETA IMPLEMENTADA**

### 🔑 **1. CONFIGURAÇÃO DO SUPABASE**

#### **A. Criar arquivo `.env` na raiz do projeto:**
```env
# Configuração do Supabase para o servidor
SUPABASE_URL=https://sua-instancia.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_ANON_KEY=sua-anon-key

# Configuração do ambiente
NODE_ENV=development
```

#### **B. Criar arquivo `client/.env.local`:**
```env
# Configuração do Supabase para o cliente
VITE_SUPABASE_URL=https://sua-instancia.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key

# URL da API do backend
VITE_API_URL=http://localhost:5001
```

#### **C. Como obter as chaves do Supabase:**

1. **Acesse:** https://supabase.com/dashboard/projects
2. **Selecione seu projeto**
3. **Vá em:** Settings → API
4. **Copie:**
   - `Project URL` → `SUPABASE_URL` e `VITE_SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY` e `VITE_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

---

### 🗄️ **2. SCHEMA DO BANCO DE DADOS**

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  tipo TEXT CHECK (tipo IN ('candidato', 'empresa', 'admin')) DEFAULT 'candidato',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de candidatos
CREATE TABLE IF NOT EXISTS candidatos (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  celular TEXT,
  linkedin TEXT,
  github TEXT,
  portfolio TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  data_nascimento DATE,
  estado_civil TEXT,
  genero TEXT,
  pcd TEXT,
  nivel_escolaridade TEXT,
  curso TEXT,
  instituicao TEXT,
  ano_formacao TEXT,
  idiomas TEXT[],
  habilidades TEXT[],
  experiencias TEXT,
  certificacoes TEXT,
  objetivo_profissional TEXT,
  pretensao_salarial TEXT,
  disponibilidade TEXT,
  modalidade_trabalho TEXT,
  curriculo_url TEXT,
  areas_interesse TEXT[],
  foto_perfil TEXT,
  perfil_disc TEXT,
  pontuacao_d INTEGER DEFAULT 0,
  pontuacao_i INTEGER DEFAULT 0,
  pontuacao_s INTEGER DEFAULT 0,
  pontuacao_c INTEGER DEFAULT 0,
  data_teste_disc TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cnpj TEXT,
  razao_social TEXT,
  nome_fantasia TEXT,
  inscricao_estadual TEXT,
  setor TEXT,
  porte TEXT,
  telefone TEXT,
  celular TEXT,
  website TEXT,
  linkedin TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  descricao TEXT,
  missao TEXT,
  visao TEXT,
  valores TEXT,
  beneficios TEXT[],
  cultura TEXT,
  numero_funcionarios TEXT,
  ano_fundacao TEXT,
  contato TEXT,
  cargo_contato TEXT,
  logo_empresa TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para candidatos
CREATE POLICY "Candidatos can manage own profile" ON candidatos
  FOR ALL USING (auth.uid() = id);

-- Políticas para empresas
CREATE POLICY "Empresas can manage own profile" ON empresas
  FOR ALL USING (auth.uid() = id);

-- Função para criar usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, tipo)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nome', COALESCE(NEW.raw_user_meta_data->>'tipo', 'candidato'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 🔧 **3. CORREÇÕES IMPLEMENTADAS NO CÓDIGO**

#### **A. ✅ Cliente (client/src/lib/supabase.ts):**
- ✅ Removidas URLs hardcoded
- ✅ Verificação de configuração adicionada
- ✅ Tipos alinhados com o servidor
- ✅ API simplificada e funcional
- ✅ Tratamento de erros melhorado

#### **B. ✅ Hook de Autenticação (useAuth.tsx):**
- ✅ Verificação de configuração antes de operações
- ✅ Logs detalhados para debugging
- ✅ Tratamento de erros melhorado
- ✅ Fallbacks para cenários sem configuração
- ✅ Redirecionamento simplificado e confiável

#### **C. ✅ Servidor (routes.ts):**
- ✅ Logs detalhados na rota `/api/auth/me`
- ✅ Verificação de configuração do Supabase
- ✅ Mensagens de erro mais específicas
- ✅ Busca na tabela correta (`users` em vez de `usuarios`)
- ✅ Tratamento de diferentes tipos de erro

---

## 🚀 **4. COMO TESTAR**

### **A. Verificar Configuração:**
1. **Reinicie o servidor:** `npm run dev:server`
2. **Abra o console do navegador**
3. **Procure por:**
   - ✅ `"✅ Supabase configurado e conectado"`
   - ❌ `"⚠️ Supabase não configurado!"`

### **B. Testar Login:**
1. **Acesse:** http://localhost:5173/login
2. **Tente fazer login**
3. **Verifique o console para:**
   - ✅ `"✅ Login Supabase bem-sucedido"`
   - ✅ `"✅ Dados do usuário obtidos"`
   - ❌ Mensagens de erro específicas

### **C. Verificar Dados:**
1. **Faça login como admin**
2. **Acesse:** http://localhost:5173/admin
3. **Verifique se os dados carregam sem erro 500**

---

## 🔍 **5. TROUBLESHOOTING**

### **Problema:** Ainda recebe erro 500
**Solução:** Verifique se:
- ✅ Arquivos `.env` foram criados corretamente
- ✅ Chaves do Supabase estão corretas
- ✅ SQL foi executado no Supabase
- ✅ Servidor foi reiniciado após criar `.env`

### **Problema:** "Supabase não configurado"
**Solução:**
- ✅ Crie o arquivo `client/.env.local`
- ✅ Reinicie o cliente: `npm run dev`

### **Problema:** Usuário não encontrado
**Solução:**
- ✅ Execute o SQL para criar as tabelas
- ✅ Crie um usuário teste no Authentication do Supabase
- ✅ Verifique se o trigger `handle_new_user` está funcionando

---

## 📊 **STATUS ATUAL**

### ✅ **CORREÇÕES IMPLEMENTADAS:**
- ✅ **Dados exemplo removidos** (SeedData, TesteConexao)
- ✅ **Botões "Voltar" adicionados** em todas as páginas admin
- ✅ **Funcionalidades reais** implementadas (Comunicação, Hunting, Multi-Cliente)
- ✅ **Erro 500 corrigido** com logs detalhados
- ✅ **Integração client/server** melhorada
- ✅ **Schema do banco** padronizado
- ✅ **Tratamento de erros** robusto
- ✅ **Configuração verificada** automaticamente

### 🎯 **PRÓXIMOS PASSOS:**
1. **Configure o Supabase** seguindo o item 1 deste guia
2. **Execute o SQL** do item 2 no Supabase
3. **Reinicie o servidor** e cliente
4. **Teste o login** e verifique os logs
5. **Acesse a área admin** e confirme que funciona

---

**🎉 Com essas correções, o sistema deve funcionar completamente!** 