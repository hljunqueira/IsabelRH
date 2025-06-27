# 🗑️ Operação de Zeramento de Dados - Isabel RH

## 🎯 Objetivos

1. **Zerar todos os dados** das tabelas principais
2. **Corrigir problemas de estrutura** do banco  
3. **Resolver usuários de teste** não aparecendo no admin

---

## 🚨 Problemas Identificados

### 1. Usuários de Teste Não Aparecem no Admin
**Causa:** Os usuários estão no `auth.users` (Supabase Auth) mas não nas tabelas `candidatos` e `empresas`

### 2. Erros de Estrutura do Banco
- ❌ `column vagas.destaque does not exist`
- ❌ `relation "public.campanhas_hunting" does not exist`  
- ❌ `relation "public.clientes" does not exist`

---

## ✅ Soluções Aplicadas

### 1. Correção Final do Código
**Arquivo:** `server/index.ts`
- ✅ Linha 1424: `created_at` → `criado_em`
- ✅ Todas as queries agora usam nomes corretos das colunas

### 2. Comandos SQL para Zeramento

#### A. Limpar Todos os Dados
```sql
-- LIMPAR TODAS AS TABELAS
TRUNCATE TABLE vagas CASCADE;
TRUNCATE TABLE candidatos CASCADE;
TRUNCATE TABLE empresas CASCADE;
TRUNCATE TABLE candidaturas CASCADE;
TRUNCATE TABLE servicos CASCADE;
TRUNCATE TABLE propostas CASCADE;
TRUNCATE TABLE conversas CASCADE;
TRUNCATE TABLE mensagens CASCADE;
TRUNCATE TABLE notificacoes CASCADE;

-- Limpar tabelas que podem não existir
DELETE FROM campanhas_hunting WHERE true;
DELETE FROM clientes WHERE true;
```

#### B. Corrigir Estrutura do Banco
```sql
-- 1. Adicionar coluna destaque se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vagas' AND column_name = 'destaque'
    ) THEN
        ALTER TABLE vagas ADD COLUMN destaque BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 2. Criar tabela campanhas_hunting
CREATE TABLE IF NOT EXISTS campanhas_hunting (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome varchar NOT NULL,
    descricao text,
    status varchar DEFAULT 'ativa',
    total_contatos integer DEFAULT 0,
    contatos_sucesso integer DEFAULT 0,
    integracao_linkedin boolean DEFAULT false,
    integracao_github boolean DEFAULT false,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

-- 3. Criar tabela clientes  
CREATE TABLE IF NOT EXISTS clientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome varchar NOT NULL,
    email varchar UNIQUE,
    telefone varchar,
    cnpj varchar,
    plano varchar DEFAULT 'basico',
    status varchar DEFAULT 'ativo',
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

-- 4. Verificar/ajustar tabela notificacoes
CREATE TABLE IF NOT EXISTS notificacoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    titulo varchar NOT NULL,
    mensagem text,
    tipo varchar DEFAULT 'info',
    lida boolean DEFAULT false,
    criado_em timestamp with time zone DEFAULT now(),
    lida_em timestamp with time zone
);
```

#### C. Criar Usuários de Teste Completos
```sql
-- 1. Inserir empresa de teste
INSERT INTO empresas (
    id, 
    nome, 
    cnpj, 
    email, 
    telefone, 
    cidade, 
    estado, 
    setor, 
    descricao,
    criado_em
) VALUES (
    gen_random_uuid(),
    'Empresa Teste Admin',
    '12.345.678/0001-90',
    'empresa@teste.com',
    '(48) 3333-4444',
    'Florianópolis',
    'SC',
    'Tecnologia',
    'Empresa de teste para admin',
    now()
);

-- 2. Inserir candidato de teste
INSERT INTO candidatos (
    id,
    nome,
    email,
    telefone,
    cpf,
    cidade,
    estado,
    area_interesse,
    experiencia,
    criado_em
) VALUES (
    gen_random_uuid(),
    'Candidato Teste Admin',
    'candidato@teste.com',
    '(48) 9999-8888',
    '123.456.789-10',
    'Florianópolis',
    'SC',
    'Tecnologia',
    'Pleno',
    now()
);
```

---

## 🔄 Status Esperado Após Operação

### Dados Zerados ✅
- Todas as tabelas principais vazias
- Sistema limpo para começar do zero

### Estrutura Corrigida ✅
- Coluna `destaque` na tabela `vagas`
- Tabela `campanhas_hunting` criada
- Tabela `clientes` criada  
- Tabela `notificacoes` com estrutura correta

### Admin Funcional ✅
- Usuários de teste visíveis no admin
- Sem erros de coluna inexistente
- Queries funcionando corretamente

---

## 🚀 Comandos de Execução

1. **Aplicar no Supabase SQL Editor:**
   - Executar seção B (Estrutura)
   - Executar seção A (Zeramento)
   - Executar seção C (Usuários de teste)

2. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

3. **Testar no admin:**
   - Acessar `/admin`
   - Verificar se candidatos e empresas aparecem
   - Conferir logs sem erros

---

## 📝 Observações

- **Backup:** Dados atuais serão perdidos permanentemente
- **Usuários Auth:** Usuários no `auth.users` continuarão existindo  
- **Logs:** Devem ficar limpos sem erros de coluna

### Status: 🟡 Pronto para execução das queries SQL
