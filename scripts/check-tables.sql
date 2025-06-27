-- Script para verificar se as tabelas foram criadas
-- Execute este script no SQL Editor do Supabase

-- Verificar se as tabelas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTE'
        ELSE 'NÃO EXISTE'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'usuarios',
    'candidatos', 
    'empresas',
    'vagas',
    'candidaturas',
    'banco_talentos',
    'contatos',
    'servicos',
    'propostas',
    'relatorios',
    'testes_disc',
    'filtros_salvos'
)
ORDER BY table_name;

-- Verificar estrutura da tabela candidatos (se existir)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'candidatos'
ORDER BY ordinal_position;

-- Verificar se os enums foram criados
SELECT 
    typname as enum_name,
    enumlabel as enum_value
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname IN ('tipo_usuario', 'status_consultoria', 'tipo_servico', 'tipo_disc', 'prioridade')
ORDER BY t.typname, e.enumsortorder; 