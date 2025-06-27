-- =====================================================
-- SCRIPT PARA ADICIONAR USUÁRIOS DO SUPABASE AUTH
-- Execute este script após criar as tabelas
-- =====================================================

-- 1. FUNÇÃO PARA ADICIONAR USUÁRIOS AUTOMATICAMENTE
-- =====================================================

-- Função que será chamada quando um usuário se registrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir na tabela usuarios
  INSERT INTO public.usuarios (id, email, tipo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'candidato')::tipo_usuario
  );
  
  -- Se for candidato, criar perfil de candidato
  IF COALESCE(NEW.raw_user_meta_data->>'tipo', 'candidato') = 'candidato' THEN
    INSERT INTO public.candidatos (id, nome)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nome', 'Candidato')
    );
  END IF;
  
  -- Se for empresa, criar perfil de empresa
  IF COALESCE(NEW.raw_user_meta_data->>'tipo', 'candidato') = 'empresa' THEN
    INSERT INTO public.empresas (id, nome)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nome', 'Empresa')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando um usuário for criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. ADICIONAR USUÁRIOS EXISTENTES MANUALMENTE
-- =====================================================

-- IMPORTANTE: Substitua os UUIDs abaixo pelos UIDs reais dos usuários do seu Supabase Auth
-- Você pode encontrar esses UIDs no painel do Supabase em Authentication > Users

-- Exemplo de como adicionar usuários existentes:
-- (Descomente e ajuste conforme necessário)

/*
-- Adicionar candidato
INSERT INTO public.usuarios (id, email, tipo) 
VALUES (
  'SEU_UID_CANDIDATO_AQUI', -- Substitua pelo UID real
  'candidato@exemplo.com',  -- Substitua pelo email real
  'candidato'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.candidatos (id, nome, telefone, cidade, estado, habilidades, areas_interesse)
VALUES (
  'SEU_UID_CANDIDATO_AQUI', -- Mesmo UID do usuário
  'João Silva',
  '(11) 99999-9999',
  'São Paulo',
  'SP',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript'],
  ARRAY['Desenvolvimento Web', 'Frontend', 'Full Stack']
) ON CONFLICT (id) DO NOTHING;

-- Adicionar empresa
INSERT INTO public.usuarios (id, email, tipo) 
VALUES (
  'SEU_UID_EMPRESA_AQUI', -- Substitua pelo UID real
  'empresa@exemplo.com',  -- Substitua pelo email real
  'empresa'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.empresas (id, nome, cnpj, setor, cidade, estado, descricao)
VALUES (
  'SEU_UID_EMPRESA_AQUI', -- Mesmo UID do usuário
  'Tech Solutions Ltda',
  '12.345.678/0001-90',
  'Tecnologia',
  'São Paulo',
  'SP',
  'Empresa de desenvolvimento de software'
) ON CONFLICT (id) DO NOTHING;

-- Adicionar admin
INSERT INTO public.usuarios (id, email, tipo) 
VALUES (
  'SEU_UID_ADMIN_AQUI', -- Substitua pelo UID real
  'admin@isabelrh.com', -- Substitua pelo email real
  'admin'
) ON CONFLICT (id) DO NOTHING;
*/

-- 3. SCRIPT PARA LISTAR USUÁRIOS DO AUTH
-- =====================================================

-- Execute esta query para ver todos os usuários do Supabase Auth
-- e copie os UIDs para usar no script acima

/*
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;
*/

-- 4. SCRIPT PARA VERIFICAR USUÁRIOS ADICIONADOS
-- =====================================================

-- Verificar usuários na tabela usuarios
SELECT 
  u.id,
  u.email,
  u.tipo,
  u.criado_em,
  CASE 
    WHEN c.id IS NOT NULL THEN 'Candidato criado'
    WHEN e.id IS NOT NULL THEN 'Empresa criada'
    ELSE 'Sem perfil'
  END as status_perfil
FROM usuarios u
LEFT JOIN candidatos c ON u.id = c.id
LEFT JOIN empresas e ON u.id = e.id
ORDER BY u.criado_em DESC;

-- 5. INSTRUÇÕES DE USO
-- =====================================================

/*
PASSO A PASSO:

1. Execute o script schema-completo.sql primeiro
2. Execute este script para criar a função e trigger
3. No painel do Supabase, vá em Authentication > Users
4. Copie os UIDs dos usuários que você quer adicionar
5. Descomente e edite as seções de INSERT acima
6. Execute novamente este script com os UIDs corretos

OU

Para novos usuários que se registrarem:
- A função handle_new_user() será executada automaticamente
- O usuário será adicionado na tabela usuarios
- Um perfil será criado baseado no tipo (candidato/empresa)
- O tipo pode ser definido no metadata do usuário durante o registro

EXEMPLO DE REGISTRO COM TIPO:
{
  "email": "candidato@exemplo.com",
  "password": "senha123",
  "options": {
    "data": {
      "tipo": "candidato",
      "nome": "João Silva"
    }
  }
}
*/ 