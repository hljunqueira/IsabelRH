# 🚀 GUIA COMPLETO - SOLUÇÃO ISABEL RH

## 📋 PROBLEMA IDENTIFICADO

O erro `"Erro ao buscar dados do usuário: SyntaxError: Unexpected token '<', '<!DOCTYPE '... is not valid JSON"` indica que:

1. **A rota `/api/auth/me` não está funcionando**
2. **O backend está retornando HTML em vez de JSON**
3. **Os usuários do Supabase Auth não estão nas tabelas do sistema**

## 🔧 SOLUÇÃO PASSO A PASSO

### PASSO 1: EXECUTAR SCRIPT SQL COMPLETO

1. **Acesse o painel do Supabase**
2. **Vá em SQL Editor**
3. **Cole e execute o script `schema-completo.sql`**

```sql
-- Copie todo o conteúdo do arquivo scripts/schema-completo.sql
-- e cole no SQL Editor do Supabase
```

### PASSO 2: ADICIONAR USUÁRIOS DO SUPABASE AUTH

1. **Execute o script `adicionar-usuarios-auth.sql`**
2. **No painel do Supabase, vá em Authentication > Users**
3. **Copie os UIDs dos usuários**
4. **Edite o script com os UIDs reais**

### PASSO 3: CONFIGURAR BACKEND

1. **Instalar dependência CORS:**
```bash
npm install cors @types/cors
```

2. **O arquivo `server/index.ts` já foi corrigido para:**
   - Permitir CORS
   - Escutar em `0.0.0.0` em vez de `127.0.0.1`

### PASSO 4: ADICIONAR DADOS DE EXEMPLO

1. **Execute o script `adicionar-dados-exemplo.sql`**
2. **Substitua os UIDs pelos reais dos seus usuários**

### PASSO 5: TESTAR O SISTEMA

1. **Reinicie o backend:**
```bash
npm run dev
```

2. **Teste o login no frontend**
3. **Verifique se a rota `/api/auth/me` retorna JSON**

## 📁 ARQUIVOS CRIADOS/CORRIGIDOS

### ✅ Scripts SQL:
- `scripts/schema-completo.sql` - Schema completo do banco
- `scripts/adicionar-usuarios-auth.sql` - Adicionar usuários do Auth
- `scripts/adicionar-dados-exemplo.sql` - Dados de exemplo

### ✅ Backend Corrigido:
- `server/index.ts` - CORS e configuração de host

### ✅ Dependências:
- `cors` e `@types/cors` instalados

## 🔍 VERIFICAÇÃO

### 1. Verificar Tabelas Criadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 2. Verificar Usuários Adicionados:
```sql
SELECT 
  u.id,
  u.email,
  u.tipo,
  CASE 
    WHEN c.id IS NOT NULL THEN 'Candidato'
    WHEN e.id IS NOT NULL THEN 'Empresa'
    ELSE 'Sem perfil'
  END as perfil
FROM usuarios u
LEFT JOIN candidatos c ON u.id = c.id
LEFT JOIN empresas e ON u.id = e.id;
```

### 3. Testar Rota de API:
```bash
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:5000/api/auth/me
```

## 🚨 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema 1: "relation 'usuarios' does not exist"
**Solução:** Execute o script `schema-completo.sql` primeiro

### Problema 2: "foreign key violation"
**Solução:** Certifique-se de que os UIDs nas tabelas correspondem aos do Supabase Auth

### Problema 3: "CORS error"
**Solução:** Verifique se o CORS está configurado corretamente no backend

### Problema 4: "Port already in use"
**Solução:** 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📞 SUPORTE

Se ainda houver problemas:

1. **Verifique os logs do backend**
2. **Teste a rota `/api/auth/me` diretamente**
3. **Confirme que as tabelas foram criadas**
4. **Verifique se os usuários estão nas tabelas**

## 🎯 RESULTADO ESPERADO

Após seguir todos os passos:

✅ **Login funcionando no frontend**
✅ **Rota `/api/auth/me` retornando JSON**
✅ **Dados do usuário sendo carregados**
✅ **Sistema completo operacional**

---

**💡 DICA:** Mantenha os UIDs dos usuários do Supabase Auth sempre sincronizados com as tabelas do sistema! 