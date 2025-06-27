-- Verificar a estrutura da tabela users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Verificar se há dados na tabela users
SELECT COUNT(*) as total_usuarios FROM users;

-- Verificar se há dados na tabela usuarios
SELECT COUNT(*) as total_usuarios FROM usuarios; 