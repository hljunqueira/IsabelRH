# Editor de Planos - Sistema Multi-Cliente

## 🎯 **Nova Funcionalidade Implementada**

Adicionei um **Editor de Planos** completo na aba **Config** da página Multi-Cliente, permitindo personalizar os valores antes de executar o script SQL.

## ✨ **Funcionalidades do Editor**

### **1. Edição Completa dos Planos**
- ✅ **Nome do Plano** - Básico, Premium, Enterprise (editável)
- ✅ **Preço** - Valor mensal em reais (R$)
- ✅ **Limite de Usuários** - Quantidade máxima de usuários
- ✅ **Limite de Vagas** - Quantidade máxima de vagas
- ✅ **Recursos** - Lista de funcionalidades (separados por vírgula)

### **2. Interface Intuitiva**
- 📋 **Cards separados** para cada plano
- 🎨 **Preview em tempo real** dos valores
- 📱 **Design responsivo** (grid adaptativo)
- 🏷️ **Badges** para identificação dos planos

### **3. Geração de SQL Personalizado**
- 🔧 **SQL automático** baseado nos valores editados
- 📋 **Botão "Copiar"** para clipboard
- 👁️ **Visualização** do código SQL gerado
- 📚 **Instruções** passo-a-passo

## 🛠️ **Como Usar**

### **Passo 1: Editar os Planos**
1. Acesse **Multi-Cliente** → Aba **Config**
2. No **Editor de Planos**, ajuste os valores:
   - **Básico**: R$ 500 (5 usuários, 10 vagas)
   - **Premium**: R$ 2.500 (20 usuários, 100 vagas)  
   - **Enterprise**: R$ 8.900 (100 usuários, 1000 vagas)

### **Passo 2: Gerar SQL Personalizado**
1. Clique em **"Copiar SQL Personalizado"**
2. O código será copiado para o clipboard
3. Ou clique em **"Visualizar SQL"** para ver o código

### **Passo 3: Executar no Supabase**
1. Acesse **Supabase SQL Editor**
2. Cole o SQL personalizado
3. Execute o script
4. Recarregue a página Multi-Cliente

## 💡 **Exemplo de Uso**

### **Valores Personalizados:**
```
Básico: R$ 299 (3 usuários, 5 vagas)
Premium: R$ 1.990 (15 usuários, 75 vagas)
Enterprise: R$ 5.990 (50 usuários, 500 vagas)
```

### **SQL Gerado Automaticamente:**
```sql
INSERT INTO planos (nome, preco, usuarios, vagas, recursos) VALUES 
('Básico', 299, 3, 5, '["Gestão básica", "Suporte email"]'),
('Premium', 1990, 15, 75, '["Gestão completa", "Suporte prioritário"]'),
('Enterprise', 5990, 50, 500, '["Gestão ilimitada", "Suporte 24/7"]')
ON CONFLICT (nome) DO NOTHING;
```

## 🎨 **Interface Implementada**

### **Cards de Edição:**
- Input para **preço** (número com decimais)
- Input para **usuários** (número inteiro)
- Input para **vagas** (número inteiro)
- Input para **nome** (texto)
- Input para **recursos** (texto separado por vírgula)

### **Preview Dinâmico:**
```
Preview: Premium - R$ 2.500,00 (20 usuários, 100 vagas)
```

### **Botões de Ação:**
- 📋 **Copiar SQL Personalizado** - Copia para clipboard
- 👁️ **Visualizar/Ocultar SQL** - Mostra código gerado
- 💾 **Salvar Configurações** - Para outras configs

## 🔧 **Implementação Técnica**

### **Estado TypeScript:**
```typescript
interface PlanoEditavel {
  nome: string;
  preco: number;
  usuarios: number;
  vagas: number;
  recursos: string[];
}
```

### **Função de Atualização Tipo-Segura:**
```typescript
const atualizarPlano = (index: number, campo: keyof PlanoEditavel, valor: any) => {
  // Validação específica para cada campo
  // Conversão automática de tipos (string → number)
}
```

### **Geração SQL Dinâmica:**
```typescript
const gerarSqlPersonalizado = () => {
  // Template SQL com valores interpolados
  // Formatação automática para PostgreSQL
}
```

## ✅ **Benefícios**

### **1. Flexibilidade Total**
- Customize preços para seu mercado
- Ajuste limites conforme necessidade
- Adicione/remova recursos facilmente

### **2. Experiência do Usuário**
- Não precisa editar SQL manualmente
- Preview em tempo real das alterações
- Interface amigável e intuitiva

### **3. Segurança**
- Validação de tipos automática
- SQL gerado de forma segura
- Sem risco de syntax errors

## 🚀 **Próximos Passos**

Agora você pode:
1. ✅ **Personalizar** todos os valores dos planos
2. ✅ **Gerar** SQL automaticamente
3. ✅ **Executar** no Supabase
4. ✅ **Testar** a página Multi-Cliente completa

O sistema está pronto para ser personalizado conforme suas necessidades! 🎉 