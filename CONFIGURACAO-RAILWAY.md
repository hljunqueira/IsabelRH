# 🚀 Configuração Completa - Deploy Isabel RH no Railway

## ✅ Status Atual
- ✅ **Servidor configurado**: Serve API + Frontend
- ✅ **Build funcionando**: `npm run build` ✅
- ✅ **Estrutura correta**: dist/public com arquivos estáticos
- ✅ **Rotas configuradas**: API em `/api/*` e SPA routing para frontend
- ✅ **Arquivos criados**: `railway.json` e `Procfile`

## 📁 Arquivos de Configuração Criados

### 1. `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. `Procfile`
```
web: npm start
```

## 🔧 Configurações do Railway

### 1. Variáveis de Ambiente (Settings → Environment)
```bash
NODE_ENV=production
PORT=5001

# Supabase
VITE_SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MTY3OTUsImV4cCI6MjA1MTA5Mjc5NX0.UeXsYJvG4_B4F3xvlb8_o2WQjqJrJX7r6H7qZ8Z-XUw
SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkxMDI5MywiZXhwIjoyMDY2NDg2MjkzfQ.X7xux96O-P36SiEEBBWBebh30oqd5T1JiBC1LhC1SEA

# Frontend URL (será atualizada após deploy)
FRONTEND_URL=https://isabelrh.com.br
```

### 2. Comandos de Build/Deploy
- **Build Command**: `npm run build` (automático via railway.json)
- **Start Command**: `npm start` (automático via Procfile)
- **Root Directory**: `/` (raiz do projeto)

## 🌐 Estrutura do Servidor

### Rotas Configuradas:
- **Frontend React**: `/` (todas as rotas não-API)
- **API Health**: `/api/health`
- **API Test**: `/api/test`
- **API Principal**: `/api`

### CORS Configurado para:
- `https://isabelrh.com.br`
- `https://www.isabelrh.com.br`
- `https://isabelrh.railway.app`
- `http://localhost:5174` (desenvolvimento)

## 📋 Passos para Deploy

### 1. No Railway Dashboard:
1. New Project → Deploy from GitHub repo
2. Selecionar repositório Isabel RH
3. Aguardar detecção automática do Node.js

### 2. Configurar Variáveis:
1. Settings → Environment
2. Adicionar todas as variáveis listadas acima
3. Deploy (automático após adicionar variáveis)

### 3. Configurar Domínio:
1. Settings → Domains
2. Add Custom Domain: `isabelrh.com.br`
3. Configurar DNS no Registro.br

## 🔍 Verificações de Funcionamento

### APIs de Teste:
- `GET /api/health` → Status do servidor
- `GET /api/test` → Teste completo
- `GET /api` → Informações da API

### Frontend:
- `GET /` → React App principal
- Todas as rotas → SPA routing funcionando

## 🛠️ Troubleshooting

### Se o deploy falhar:
1. Verificar logs no Railway
2. Confirmar que `npm run build` funciona localmente
3. Verificar se todas as variáveis foram adicionadas
4. Confirmar estrutura de arquivos: `dist/public/index.html` existe

### Se o frontend não carregar:
1. Verificar se build gerou `dist/public/`
2. Confirmar que servidor está servindo arquivos estáticos
3. Verificar CORS se acessando de domínio diferente

## 💰 Estimativa de Custos
- **Hobby Plan**: $5/mês (adequado para início)
- **Pro Plan**: $20/mês (para crescimento)

## 🎯 Próximos Passos
1. ✅ **Código pronto** - Estrutura correta
2. 🔄 **Deploy Railway** - Subir para produção
3. 🌐 **Domínio** - Configurar isabelrh.com.br
4. 🔐 **SSL** - Automático no Railway
5. 📊 **Monitoramento** - Verificar logs e performance

---

**📞 Suporte**: Se houver problemas, verificar logs do Railway e conferir este documento. 