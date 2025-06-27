# 🔧 Configurações de Ambiente - Isabel RH

## 📋 Variáveis Necessárias para Produção

### 🚀 Criar arquivo `.env` com:

```bash
# 🌍 Environment
NODE_ENV=production

# 🚀 Server
PORT=5001
FRONTEND_URL=https://isabelrh.com.br

# 🔑 Supabase Configuration
VITE_SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
SUPABASE_SERVICE_KEY=sua_service_key_aqui

# 📧 Email Configuration (Future)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=contato@isabelrh.com.br
# SMTP_PASS=sua_senha_app

# 🔐 JWT Secret (Future)
# JWT_SECRET=sua_chave_secreta_muito_forte

# 📊 Analytics (Future)
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# 🎯 Feature Flags
# ENABLE_NOTIFICATIONS=true
# ENABLE_ANALYTICS=true
# ENABLE_REAL_EMAIL=false
```

## 🔍 Como obter as chaves Supabase:

1. **Supabase Dashboard**: https://supabase.com/dashboard
2. **Projeto Isabel RH** → Settings → API
3. **URL**: Já temos `https://wqifsgaxevfdwmfkihhg.supabase.co`
4. **Anon Key**: Chave pública (pode ser exposta)
5. **Service Key**: Chave privada (NUNCA expor no frontend)

## 🚀 Configuração no Railway:

```bash
# Painel Railway → Settings → Environment Variables
NODE_ENV=production
PORT=5001
VITE_SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=https://isabelrh.railway.app
```

## 🔒 Segurança:

- ✅ **Nunca** commitar chaves reais no GitHub
- ✅ **Service Key** só no servidor (nunca no frontend)
- ✅ **Anon Key** pode ser pública (tem limitações)
- ✅ **CORS** configurado apenas para domínios autorizados 