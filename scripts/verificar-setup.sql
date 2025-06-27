-- Script para verificar se o setup está completo
-- Execute este script no SQL Editor do Supabase

-- Verificar se as tabelas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✓ Criada'
        ELSE '✗ Não encontrada'
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
    'relatorios'
)
ORDER BY table_name;

-- Verificar se os enums foram criados
SELECT 
    t.typname as enum_name,
    CASE 
        WHEN t.typname IS NOT NULL THEN '✓ Criado'
        ELSE '✗ Não encontrado'
    END as status
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN (
    'tipo_usuario',
    'status_consultoria',
    'tipo_servico',
    'tipo_disc',
    'prioridade'
)
GROUP BY t.typname
ORDER BY t.typname;

-- Verificar se há dados nas tabelas principais
SELECT 
    'usuarios' as tabela,
    COUNT(*) as total_registros
FROM usuarios
UNION ALL
SELECT 
    'candidatos' as tabela,
    COUNT(*) as total_registros
FROM candidatos
UNION ALL
SELECT 
    'empresas' as tabela,
    COUNT(*) as total_registros
FROM empresas
UNION ALL
SELECT 
    'vagas' as tabela,
    COUNT(*) as total_registros
FROM vagas
UNION ALL
SELECT 
    'candidaturas' as tabela,
    COUNT(*) as total_registros
FROM candidaturas;

-- Verificar se os usuários foram criados no Supabase Auth
SELECT 
    id,
    email,
    raw_user_meta_data->>'tipo' as tipo_usuario,
    created_at
FROM auth.users 
WHERE email IN (
    'joao.silva@email.com',
    'maria.santos@email.com',
    'techcorp@empresa.com',
    'admin@isabelrh.com'
)
ORDER BY email;

-- Verificar estrutura da tabela candidatos (deve ter a coluna 'cidade')
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'candidatos'
AND column_name = 'cidade';

-- Teste de inserção simples para verificar se as constraints estão funcionando
DO $$
BEGIN
    -- Tentar inserir um candidato de teste
    INSERT INTO candidatos (id, nome, cidade) 
    VALUES ('550e8400-e29b-41d4-a716-446655440099', 'Teste Candidato', 'São Paulo')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Teste de inserção na tabela candidatos: OK';
    
    -- Limpar o teste
    DELETE FROM candidatos WHERE id = '550e8400-e29b-41d4-a716-446655440099';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro no teste de inserção: %', SQLERRM;
END $$;

-- Resumo final
SELECT 
    CASE 
        WHEN COUNT(*) = 10 THEN '✓ Setup completo - Todas as tabelas criadas'
        ELSE '⚠ Setup incompleto - Algumas tabelas estão faltando'
    END as status_setup
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
    'relatorios'
); 