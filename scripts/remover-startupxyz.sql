-- Script para remover o cliente StartupXYZ
-- Execute este comando no Supabase SQL Editor

-- Primeiro, remove os usuários associados ao cliente StartupXYZ
DELETE FROM usuarios_clientes 
WHERE cliente_id IN (
  SELECT id FROM clientes WHERE dominio = 'startupxyz.com'
);

-- Depois, remove o cliente StartupXYZ
DELETE FROM clientes 
WHERE dominio = 'startupxyz.com';

-- Verificar quantos clientes restaram (deve mostrar apenas 1)
SELECT COUNT(*) as total_clientes FROM clientes;

-- Mostrar o cliente que restou
SELECT nome, dominio, plano, status FROM clientes;
