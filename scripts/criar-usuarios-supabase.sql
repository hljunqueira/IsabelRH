-- Criação de usuários no Supabase Auth
-- Execute este script no SQL Editor do Supabase

-- 1. Inserir usuários na tabela auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
-- Admin
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@isabelrh.com.br',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Administrador Isabel RH", "type": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
-- Candidato
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'candidato@isabelrh.com.br',
  crypt('candidato123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "João Silva Santos", "type": "candidato"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
-- Empresa
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'empresa@isabelrh.com.br',
  crypt('empresa123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Tech Innovate Ltda", "type": "empresa"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 2. Inserir usuários na tabela users (se existir)
INSERT INTO public.users (
  id,
  email,
  name,
  type,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'type' as type,
  created_at,
  updated_at
FROM auth.users 
WHERE email IN ('admin@isabelrh.com.br', 'candidato@isabelrh.com.br', 'empresa@isabelrh.com.br')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  updated_at = NOW();

-- 3. Inserir dados específicos na tabela candidatos (se existir)
INSERT INTO public.candidatos (
  user_id,
  nome,
  email,
  telefone,
  cidade,
  estado,
  experiencia,
  escolaridade,
  created_at
)
SELECT 
  u.id,
  u.name,
  u.email,
  '(48) 99999-9999',
  'Florianópolis',
  'SC',
  'Intermediário',
  'Superior Completo',
  NOW()
FROM auth.users u
WHERE u.email = 'candidato@isabelrh.com.br'
ON CONFLICT (user_id) DO NOTHING;

-- 4. Inserir dados específicos na tabela empresas (se existir)
INSERT INTO public.empresas (
  user_id,
  nome,
  email,
  cnpj,
  telefone,
  cidade,
  estado,
  setor,
  created_at
)
SELECT 
  u.id,
  u.name,
  u.email,
  '12.345.678/0001-90',
  '(48) 3333-4444',
  'Florianópolis',
  'SC',
  'Tecnologia',
  NOW()
FROM auth.users u
WHERE u.email = 'empresa@isabelrh.com.br'
ON CONFLICT (user_id) DO NOTHING;

-- Verificar se os usuários foram criados
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'type' as type,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email IN ('admin@isabelrh.com.br', 'candidato@isabelrh.com.br', 'empresa@isabelrh.com.br')
ORDER BY email; 