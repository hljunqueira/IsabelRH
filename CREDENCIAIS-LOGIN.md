# 🔐 Credenciais de Login - Sistema Isabel RH

## ✅ **Sistema Atualizado - Apenas Supabase**

O sistema agora usa **exclusivamente usuários do Supabase**. Todo o sistema mock foi removido para maior segurança e simplicidade.

## 👥 **Usuários Disponíveis**

### 🔑 **Admin**
- **Email:** `admin@isabelrh.com.br`
- **Senha:** `admin123`
- **Acesso:** Painel administrativo completo (`/admin`)

### 👤 **Candidato**
- **Email:** `candidato@isabelrh.com.br`
- **Senha:** `candidato123`
- **Acesso:** Área do candidato (`/candidato`)

### 🏢 **Empresa**
- **Email:** `empresa@isabelrh.com.br`
- **Senha:** `empresa123`
- **Acesso:** Área da empresa (`/empresa`)

## 🛠️ **Configuração no Supabase**

### **Método 1: SQL Editor (Recomendado)**
1. Acesse o **SQL Editor** no painel do Supabase
2. Execute o script: `scripts/criar-usuarios-supabase.sql`
3. Verifique se os usuários foram criados corretamente

### **Método 2: Authentication Dashboard**
1. Acesse **Authentication** → **Users** no Supabase
2. Clique em **"Add user"**
3. Adicione cada usuário com:
   - Email e senha conforme acima
   - **User Metadata:**
     ```json
     {
       "name": "Nome do Usuário",
       "type": "admin|candidato|empresa"
     }
     ```

## 🔄 **Redirecionamento Automático**

Após o login bem-sucedido, o sistema redireciona automaticamente:
- **Admin** → `/admin`
- **Candidato** → `/candidato`
- **Empresa** → `/empresa`

## 🚀 **Para Produção**

⚠️ **IMPORTANTE:** Altere essas senhas antes do deploy em produção!

1. **Crie usuários reais** com senhas seguras
2. **Remova os usuários de teste** do ambiente de produção
3. **Configure políticas RLS** adequadas no Supabase
4. **Ative verificação de email** se necessário

## ✅ **Status do Sistema**

- ✅ Sistema mock removido
- ✅ Autenticação 100% Supabase
- ✅ Redirecionamento baseado em tipo de usuário
- ✅ Tokens JWT seguros
- ✅ Sessões persistentes

## 🐛 **Solução de Problemas**

### **Login não funciona:**
1. Verifique se os usuários existem no Supabase Auth
2. Confirme as variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Execute o script SQL para criar os usuários

### **Redirecionamento falha:**
1. Verifique se o `user_metadata` contém o campo `type`
2. Confirme se as páginas `/admin`, `/candidato`, `/empresa` existem

### **Erro de token:**
1. Limpe o localStorage do navegador
2. Faça logout e login novamente
3. Verifique se a chave `SUPABASE_SERVICE_KEY` está correta 