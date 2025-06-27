# Correção - CRUD de Propostas e Serviços

## Problema Identificado
Durante os testes do sistema, foram identificados erros críticos nas operações de criação de propostas e serviços:

### Erros Específicos
1. **Criação de Serviços**: `Could not find the 'empresaId' column of 'servicos'`
2. **Criação de Propostas**: `Could not find the 'data_proposta' column of 'propostas'`

## Estrutura Real do Banco de Dados

### Tabela `propostas`
- `id` (uuid)
- `empresa_id` (uuid)
- `tipo_servico` (USER-DEFINED)
- `descricao` (text)
- `valor_proposto` (varchar)
- `prazo_entrega` (varchar)
- `observacoes` (text)
- `aprovada` (text)
- `criado_em` (timestamp without time zone)

### Tabela `servicos`
- `id` (uuid)
- `empresa_id` (uuid)
- `candidato_id` (uuid)
- `tipo_servico` (USER-DEFINED)
- `descricao` (text)
- `valor` (varchar)
- `status` (USER-DEFINED)
- `data_inicio` (timestamp without time zone)
- `data_fim` (timestamp without time zone)
- `observacoes` (text)
- `criado_em` (timestamp without time zone)

## Correções Aplicadas

### 1. Rota POST `/api/admin/servicos`
**Antes**: Usava `...req.body` e mapeamento genérico de `empresaId`
**Depois**: Mapeamento específico de cada campo usando `empresa_id`

```typescript
const servicoData = {
  empresa_id: req.body.empresa_id,
  candidato_id: req.body.candidato_id,
  tipo_servico: req.body.tipo_servico,
  descricao: req.body.descricao,
  valor: req.body.valor,
  status: req.body.status || 'pendente',
  data_inicio: req.body.data_inicio,
  data_fim: req.body.data_fim,
  observacoes: req.body.observacoes,
  criado_em: new Date().toISOString()
};
```

### 2. Rota POST `/api/admin/propostas`
**Antes**: Usava `...req.body` com mapeamento genérico
**Depois**: Mapeamento específico de cada campo

```typescript
const propostaData = {
  empresa_id: req.body.empresa_id,
  tipo_servico: req.body.tipo_servico,
  descricao: req.body.descricao,
  valor_proposto: req.body.valor_proposto,
  prazo_entrega: req.body.prazo_entrega,
  observacoes: req.body.observacoes,
  aprovada: req.body.aprovada || 'pendente',
  criado_em: new Date().toISOString()
};
```

### 3. Rota PATCH `/api/admin/propostas/:id`
**Antes**: Usava `...req.body` e `atualizado_em`
**Depois**: Mapeamento específico com validação de campos

```typescript
const updateData: any = {
  empresa_id: req.body.empresa_id,
  tipo_servico: req.body.tipo_servico,
  descricao: req.body.descricao,
  valor_proposto: req.body.valor_proposto,
  prazo_entrega: req.body.prazo_entrega,
  observacoes: req.body.observacoes,
  aprovada: req.body.aprovada
};

// Remove campos undefined/null
Object.keys(updateData).forEach(key => {
  if (updateData[key] === undefined || updateData[key] === null) {
    delete updateData[key];
  }
});
```

## Campos Corrigidos

| Antes | Depois | Motivo |
|-------|--------|--------|
| `empresaId` | `empresa_id` | Nome correto da coluna no banco |
| `data_proposta` | `criado_em` | Campo não existia na tabela |
| `atualizado_em` | Removido | Campo não existe na estrutura atual |
| `...req.body` | Mapeamento específico | Evitar campos inválidos |

## Status Final
✅ **Criação de Serviços**: Corrigida
✅ **Criação de Propostas**: Corrigida  
✅ **Atualização de Propostas**: Corrigida
✅ **Mapeamento de Campos**: Alinhado com banco de dados
✅ **Validação TypeScript**: Corrigida

## Data da Correção
27 de dezembro de 2024

## Próximos Passos
1. Testar criação/edição no frontend
2. Validar todas as operações CRUD
3. Verificar se frontend envia dados no formato correto 