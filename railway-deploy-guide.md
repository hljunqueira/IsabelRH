# 🚀 Guia Completo: Deploy Isabel RH no Railway

## 📋 Pré-requisitos
- [ ] Conta no GitHub
- [ ] Código do Isabel RH no repositório
- [ ] Conta no Railway.app
- [ ] Supabase configurado

## 🔧 1. Preparar o Projeto

### Criar arquivos de configuração:

**1.1. Dockerfile (opcional, mas recomendado):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
RUN npm ci

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5001

# Start server
CMD ["npm", "start"]
```

**1.2. .env.production:**
```env
NODE_ENV=production
PORT=5001
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_KEY=sua_service_key
FRONTEND_URL=https://seu-dominio.railway.app
```

**1.3. Atualizar package.json:**
```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "node dist/index.js",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cross-env NODE_ENV=development tsx server/index.ts",
    "dev:client": "cd client && npx vite --config vite.config.ts"
  }
}
```

## 🚀 2. Deploy no Railway

### 2.1. Conectar Repositório:
1. Acesse [railway.app](https://railway.app)
2. Clique "New Project" → "Deploy from GitHub repo"
3. Selecione o repositório Isabel RH
4. Railway detecta automaticamente Node.js

### 2.2. Configurar Variáveis:
```bash
# No painel Railway → Settings → Environment
NODE_ENV=production
PORT=5001
VITE_SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co  
SUPABASE_SERVICE_KEY=sua_service_key
FRONTEND_URL=https://isabelrh.railway.app
```

### 2.3. Configurar Build:
```bash
# Build Command
npm run build

# Start Command  
npm start

# Root Directory
/ (raiz do projeto)
```

## 🌐 3. Domínio Personalizado

### 3.1. No Railway:
1. Settings → Domains
2. Add Custom Domain
3. Digite: `isabelrh.com.br`
4. Copie os registros DNS

### 3.2. No Registro.br:
```dns
Tipo: CNAME
Nome: www
Valor: xxx.railway.app

Tipo: A  
Nome: @
Valor: IP fornecido pelo Railway
```

## 💰 4. Custos Railway

| **Plano** | **Preço** | **Recursos** |
|-----------|-----------|--------------|
| **Hobby** | $5/mês | 500h CPU, 1GB RAM, 1GB storage |
| **Pro** | $20/mês | Ilimitado, 8GB RAM, priority |

## ✅ 5. Vantagens Railway vs Outros

| **Recurso** | **Railway** | **Vercel** | **Render** |
|-------------|-------------|------------|------------|
| **Backend completo** | ✅ | ❌ | ✅ |
| **Deploy automático** | ✅ | ✅ | ✅ |
| **SSL grátis** | ✅ | ✅ | ✅ |
| **Logs real-time** | ✅ | ⚠️ | ✅ |
| **DB integração** | ✅ | ❌ | ⚠️ |
| **Custo/benefício** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🔧 6. Configurações Finais

### 6.1. Atualizar CORS no código:
```javascript
// server/index.ts
app.use(cors({
  origin: [
    'https://isabelrh.com.br',
    'https://www.isabelrh.com.br', 
    'https://isabelrh.railway.app',
    'http://localhost:5174' // desenvolvimento
  ],
  credentials: true
}));
```

### 6.2. Atualizar Supabase:
```bash
# Supabase Dashboard → Authentication → URL Configuration
Site URL: https://isabelrh.com.br
Redirect URLs: https://isabelrh.com.br/auth/callback
```

## 🎯 7. Checklist Final

- [ ] Código no GitHub
- [ ] Projeto criado no Railway  
- [ ] Variáveis de ambiente configuradas
- [ ] Build funcionando
- [ ] Deploy realizado
- [ ] Domínio personalizado
- [ ] SSL ativo
- [ ] Supabase atualizado
- [ ] CORS configurado
- [ ] Teste completo realizado

## 📞 Suporte
- Railway: [docs.railway.app](https://docs.railway.app)
- Comunidade: Discord do Railway
- Status: [railway.statuspage.io](https://railway.statuspage.io) 