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

#### Compartilhar Nativo (Mobile):
- [ ] Em dispositivo mobile, clique em "Compartilhar..."
- [ ] **Resultado esperado:** Abre menu nativo do sistema
- [ ] **Fallback:** Se não funcionar, deve copiar o link

### 5️⃣ **Teste Responsividade**

#### Desktop (1920x1080):
- [ ] Layout com 3 colunas de cards
- [ ] Botões têm tamanho adequado
- [ ] Dropdown não sai da tela

#### Tablet (768px):
- [ ] Layout com 2 colunas
- [ ] Botões continuam funcionais
- [ ] Dropdown se posiciona corretamente

#### Mobile (375px):
- [ ] Layout com 1 coluna
- [ ] Botões são touch-friendly
- [ ] Dropdown não ultrapassa borda da tela

### 6️⃣ **Teste de Performance**

- [ ] **Página carrega rápido** (< 3 segundos)
- [ ] **Não há travamentos** ao interagir
- [ ] **Dropdowns abrem/fecham suavemente**
- [ ] **Toast notifications** aparecem rapidamente

### 7️⃣ **Teste de Erros**

#### Console do Navegador:
- [ ] Abra DevTools (F12)
- [ ] Vá para aba "Console"
- [ ] **Não deve haver erros vermelhos**
- [ ] Warnings amarelos são aceitáveis

#### Ações de Teste:
- [ ] Clique rapidamente múltiplas vezes no botão compartilhar
- [ ] Abra vários dropdowns ao mesmo tempo
- [ ] Teste em janela muito pequena
- [ ] **Sistema deve se comportar estável**

### 8️⃣ **Teste de Integração**

- [ ] **Botão "Candidatar-se"** ainda funciona normalmente
- [ ] **Botão "Ver mais"** ainda mostra alert com detalhes
- [ ] **Navegação geral** não foi afetada
- [ ] **Busca global** no header ainda funciona

## 🚨 Sinais de Problema

### ❌ **PARE O TESTE se encontrar:**
- **Página não carrega** (tela branca/erro)
- **Console cheio de erros vermelhos**
- **Layout completamente quebrado**
- **Botões não funcionam**
- **Performance muito lenta** (> 10 segundos)

### ⚠️ **Atenção para:**
- Layout desalinhado em mobile
- Dropdowns saindo da tela
- Toast notifications não aparecendo
- Links de compartilhamento incorretos
- Cores das redes sociais erradas

## 🔧 Casos de Teste Específicos

### Teste 1: Vaga Sem Salário
- [ ] Encontre uma vaga sem salário
- [ ] Compartilhe via WhatsApp
- [ ] **Verificar:** Texto deve mostrar "Salário a combinar"

### Teste 2: Vaga com Descrição Longa
- [ ] Encontre vaga com descrição > 100 caracteres
- [ ] Compartilhe via qualquer rede
- [ ] **Verificar:** Descrição está truncada com "..."

### Teste 3: Multiple Cards
- [ ] Teste compartilhamento em 3 cards diferentes
- [ ] **Verificar:** URLs são diferentes para cada vaga
- [ ] **Verificar:** Dados corretos para cada vaga

### Teste 4: Network Offline
- [ ] Desconecte internet
- [ ] Tente copiar link
- [ ] **Verificar:** Deve mostrar erro "Não foi possível copiar"

## 📱 Teste em Diferentes Navegadores

### Chrome:
- [ ] Todas as funcionalidades trabalham
- [ ] Performance boa
- [ ] Visual correto

### Firefox:
- [ ] Compartilhamento funciona
- [ ] Dropdowns se comportam bem
- [ ] Toast notifications aparecem

### Safari (Mac):
- [ ] Web Share API funciona em mobile
- [ ] Layout responsivo OK

### Edge:
- [ ] Sem problemas de compatibilidade

## 🎯 URLs para Testar

### Links de Compartilhamento Esperados:
```
http://localhost:3000/candidato?highlight=[ID_DA_VAGA]
```

### Exemplos de Compartilhamento WhatsApp:
```
🚀 Oportunidade de emprego: [TITULO] na [EMPRESA]! 💼

📍 [CIDADE], [ESTADO]
💰 [SALARIO ou "Salário a combinar"]

[DESCRIÇÃO truncada...]

Candidate-se em: http://localhost:3000/candidato?highlight=123
```

## ✅ Status Final do Teste

**Data:** ___________  
**Hora:** ___________  
**Navegador:** ___________  
**Dispositivo:** ___________  

### Resultado Geral:
- [ ] ✅ **APROVADO** - Tudo funcionando perfeitamente
- [ ] ⚠️ **APROVADO COM RESSALVAS** - Pequenos ajustes necessários
- [ ] ❌ **REPROVADO** - Problemas significativos encontrados

### Problemas Encontrados:
________________________________
________________________________
________________________________

### Próximos Passos:
- [ ] **Deploy para produção** (se aprovado)
- [ ] **Fazer ajustes** (se ressalvas)
- [ ] **Reverter implementação** (se reprovado)

---

## 🆘 Em Caso de Problema

### Parar Servidor:
```bash
Ctrl + C (no terminal onde rodou npm run dev)
```

### Reverter Mudanças:
```bash
git restore client/src/pages/Home.tsx
npm run build
npm run dev
```

### Contato de Emergência:
- **Backup disponível:** Commit `bd802e81`
- **Documentação completa:** `BACKUP-E-REVERSAO-COMPARTILHAMENTO.md`
- **Status:** Sistema testado em build (sem erros) 