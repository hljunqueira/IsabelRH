# 🔧 Correção de Propostas e Serviços - Isabel RH

## 🚨 Problemas Identificados

### 1. Erro ao Criar Proposta
```
❌ Could not find the 'data_proposta' column of 'propostas'
```

### 2. Erro ao Criar Serviço  
```
❌ Could not find the 'empresaId' column of 'servicos'
```

## ✅ Correções Aplicadas no Código

### 1. Função Criar Propostas (server/index.ts)
```typescript
// ANTES:
data_proposta: new Date().toISOString()  // ❌

// DEPOIS: 
criado_em: new Date().toISOString()  // ✅
```

### 2. Função Criar Serviços (server/index.ts)
```typescript
// ANTES:
.insert(req.body)  // ❌ Passava empresaId diretamente

// DEPOIS:
const servicoData = {
  ...req.body,
  empresa_id: req.body.empresaId || req.body.empresa_id,  // ✅ Mapeia campos
  criado_em: new Date().toISOString()
};
delete servicoData.empresaId;  // ✅ Remove campo incorreto
```

## 🔄 Migração SQL Necessária

Execute no Supabase SQL Editor:

```sql
-- 1. Tabela propostas
ALTER TABLE propostas 
ADD COLUMN IF NOT EXISTS criado_em timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS atualizado_em timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS aprovada varchar DEFAULT 'pendente';

-- 2. Tabela servicos  
ALTER TABLE servicos
ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id),
ADD COLUMN IF NOT EXISTS criado_em timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS atualizado_em timestamp with time zone DEFAULT now();
```

## 🚀 Próximos Passos

1. **Execute a migração SQL** no Supabase
2. **Reinicie o servidor:** `npm run dev`
3. **Teste no admin:** Criar proposta e serviço

### Status: 🟡 Aguardando aplicação da migração SQL
