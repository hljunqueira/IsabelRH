# 🧪 Guia de Teste Local - Sistema de Compartilhamento

## 🚀 Servidor Iniciado!

O servidor de desenvolvimento está rodando. Acesse:
**http://localhost:3000**

## ✅ Checklist de Teste (Passo a Passo)

### 1️⃣ **Teste Básico - Página Home**
- [ ] Abra `http://localhost:3000`
- [ ] Verifique se a página carrega sem erros
- [ ] Role até a seção "Vagas em Destaque"
- [ ] Confirme que as vagas aparecem

### 2️⃣ **Teste Layout dos Cards**
Em cada card de vaga, verifique:
- [ ] **3 botões estão visíveis:** "Candidatar-se", "Ver mais", "Compartilhar"
- [ ] **Botão compartilhar** tem ícone de Share (seta com pontinhos)
- [ ] **Layout está equilibrado** (não quebrou)
- [ ] **Cores estão corretas** (laranja, azul, cinza)

### 3️⃣ **Teste Dropdown de Compartilhamento**
- [ ] **Clique no botão de compartilhamento** (ícone Share2)
- [ ] **Dropdown abre** mostrando 7 opções
- [ ] **Ícones coloridos** aparecem para cada rede:
  - 🟢 WhatsApp (verde)
  - 🔵 LinkedIn (azul)
  - 🔵 Facebook (azul escuro)
  - ⚫ X/Twitter (preto)
  - 🔘 E-mail (cinza)
  - 🔘 Copiar link (cinza)
  - 🟠 Compartilhar... (laranja)

### 4️⃣ **Teste Funcionalidades de Compartilhamento**

#### WhatsApp:
- [ ] Clique em "WhatsApp"
- [ ] **Resultado esperado:** Abre WhatsApp Web ou app
- [ ] **Texto inclui:** título da vaga, empresa, localização
- [ ] **Link está presente** no final da mensagem

#### LinkedIn:
- [ ] Clique em "LinkedIn"
- [ ] **Resultado esperado:** Abre página de compartilhamento do LinkedIn
- [ ] **URL da vaga** está no campo

#### Facebook:
- [ ] Clique em "Facebook"
- [ ] **Resultado esperado:** Abre página de compartilhamento do Facebook
- [ ] **URL da vaga** está no campo

#### X (Twitter):
- [ ] Clique em "X (Twitter)"
- [ ] **Resultado esperado:** Abre página de tweet
- [ ] **Texto formatado** aparece no tweet
- [ ] **Link da vaga** está incluído

#### E-mail:
- [ ] Clique em "E-mail"
- [ ] **Resultado esperado:** Abre cliente de e-mail padrão
- [ ] **Assunto:** Nome da vaga e empresa
- [ ] **Corpo:** Texto formatado com link

#### Copiar Link:
- [ ] Clique em "Copiar link"
- [ ] **Resultado esperado:** Toast notification aparece
- [ ] **Mensagem:** "Link copiado!" 
- [ ] **Teste:** Cole em qualquer lugar (Ctrl+V) e verifique se é o link correto

### 5️⃣ **Teste Responsividade**

#### Desktop (1920x1080):
- [ ] Layout com 3 colunas de cards
- [ ] Botões têm tamanho adequado
- [ ] Dropdown não sai da tela

#### Mobile (375px):
- [ ] Layout com 1 coluna
- [ ] Botões são touch-friendly
- [ ] Dropdown não ultrapassa borda da tela

### 6️⃣ **Teste de Performance**
- [ ] **Página carrega rápido** (< 3 segundos)
- [ ] **Não há travamentos** ao interagir
- [ ] **Dropdowns abrem/fecham suavemente**

### 7️⃣ **Teste Console (F12)**
- [ ] Abra DevTools (F12)
- [ ] Vá para aba "Console"
- [ ] **Não deve haver erros vermelhos**

## 🚨 Sinais de Problema

### ❌ **PARE O TESTE se encontrar:**
- **Página não carrega** (tela branca/erro)
- **Console cheio de erros vermelhos**
- **Layout completamente quebrado**
- **Botões não funcionam**

## ✅ Status Final do Teste

### Resultado:
- [ ] ✅ **APROVADO** - Fazer deploy
- [ ] ❌ **REPROVADO** - Reverter

---

## 🆘 Em Caso de Problema

### Reverter Mudanças:
```bash
git restore client/src/pages/Home.tsx
npm run build
npm run dev
```

**Backup disponível:** Commit `bd802e81` 