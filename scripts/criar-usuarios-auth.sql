-- Script para criar usuários no Supabase Auth
-- Este script deve ser executado via API ou CLI do Supabase
-- Não execute diretamente no SQL Editor

-- Para criar usuários no Supabase Auth, você precisa usar a API de administração
-- ou criar manualmente no painel do Supabase

-- Exemplo de como criar usuários via API (execute via curl ou Postman):

/*
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "password": "senha123",
    "email_confirm": true,
    "user_metadata": {
      "tipo": "candidato"
    }
  }'

curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria.santos@email.com",
    "password": "senha123",
    "email_confirm": true,
    "user_metadata": {
      "tipo": "candidato"
    }
  }'

curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "techcorp@empresa.com",
    "password": "senha123",
    "email_confirm": true,
    "user_metadata": {
      "tipo": "empresa"
    }
  }'

curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@isabelrh.com",
    "password": "senha123",
    "email_confirm": true,
    "user_metadata": {
      "tipo": "admin"
    }
  }'
*/

-- Alternativamente, você pode criar os usuários manualmente no painel do Supabase:
-- 1. Vá para Authentication > Users
-- 2. Clique em "Add User"
-- 3. Preencha os dados:
--    - Email: joao.silva@email.com
--    - Password: senha123
--    - Email confirmed: ✓
--    - User metadata: {"tipo": "candidato"}

-- Repita o processo para:
-- - maria.santos@email.com (candidato)
-- - techcorp@empresa.com (empresa)
-- - admin@isabelrh.com (admin)

-- Depois de criar os usuários no Auth, você pode verificar se eles foram criados:
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users 
WHERE email IN (
    'joao.silva@email.com',
    'maria.santos@email.com',
    'techcorp@empresa.com',
    'admin@isabelrh.com'
); 