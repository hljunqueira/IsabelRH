-- Verificar Estrutura das Tabelas do Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se as tabelas existem
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('candidatos', 'empresas', 'vagas', 'servicos', 'propostas', 'users')
ORDER BY tablename;

-- 2. Verificar estrutura da tabela candidatos
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'candidatos'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela empresas  
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'empresas'
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela vagas
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'vagas'
ORDER BY ordinal_position;

-- 5. Verificar estrutura da tabela servicos
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'servicos'
ORDER BY ordinal_position;

-- 6. Verificar estrutura da tabela propostas
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'propostas'
ORDER BY ordinal_position;

-- 7. Contar registros em cada tabela
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
  'servicos' as tabela,
  COUNT(*) as total_registros
FROM servicos
UNION ALL
SELECT 
  'propostas' as tabela,
  COUNT(*) as total_registros
FROM propostas
ORDER BY tabela;

-- 8. Verificar foreign keys e relationships
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('vagas', 'servicos', 'propostas')
ORDER BY tc.table_name, kcu.column_name;

-- 9. Verificar políticas RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('candidatos', 'empresas', 'vagas', 'servicos', 'propostas')
ORDER BY tablename, policyname;

-- 10. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('candidatos', 'empresas', 'vagas', 'servicos', 'propostas')
ORDER BY tablename; 