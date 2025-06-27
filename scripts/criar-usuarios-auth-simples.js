// Script simplificado para criar usuários no Supabase Auth
// Execute: node scripts/criar-usuarios-auth-simples.js

const { createClient } = require('@supabase/supabase-js');

// IMPORTANTE: Substitua pela sua SERVICE ROLE KEY real
// Vá para Settings > API no painel do Supabase e copie a "service_role" key
const SUPABASE_URL = 'https://wqifsgaxevfdwmfkihhg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'SUA_SERVICE_ROLE_KEY_AQUI'; // ⚠️ SUBSTITUA AQUI

if (SUPABASE_SERVICE_ROLE_KEY === 'SUA_SERVICE_ROLE_KEY_AQUI') {
  console.log('❌ ERRO: Você precisa substituir a SERVICE ROLE KEY no script!');
  console.log('📋 Como obter:');
  console.log('1. Vá para o painel do Supabase');
  console.log('2. Settings > API');
  console.log('3. Copie a "service_role" key');
  console.log('4. Substitua no script e execute novamente');
  process.exit(1);
}

// Cliente Supabase com service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Lista de usuários para criar
const usuarios = [
  {
    email: 'joao.silva@email.com',
    password: 'senha123',
    user_metadata: { tipo: 'candidato' }
  },
  {
    email: 'maria.santos@email.com',
    password: 'senha123',
    user_metadata: { tipo: 'candidato' }
  },
  {
    email: 'techcorp@empresa.com',
    password: 'senha123',
    user_metadata: { tipo: 'empresa' }
  },
  {
    email: 'admin@isabelrh.com',
    password: 'senha123',
    user_metadata: { tipo: 'admin' }
  }
];

async function criarUsuarios() {
  console.log('🚀 Iniciando criação de usuários no Supabase Auth...\n');

  for (const usuario of usuarios) {
    try {
      console.log(`📧 Criando usuário: ${usuario.email}`);
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: usuario.email,
        password: usuario.password,
        email_confirm: true,
        user_metadata: usuario.user_metadata
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⚠️  Usuário ${usuario.email} já existe`);
        } else {
          console.error(`❌ Erro ao criar ${usuario.email}:`, error.message);
        }
      } else {
        console.log(`✅ Usuário ${usuario.email} criado com sucesso!`);
        console.log(`   ID: ${data.user.id}`);
        console.log(`   Tipo: ${usuario.user_metadata.tipo}`);
      }
    } catch (error) {
      console.error(`❌ Erro inesperado para ${usuario.email}:`, error.message);
    }
    
    console.log(''); // Linha em branco para separar
  }

  console.log('🎉 Processo de criação de usuários concluído!');
}

// Executar o script
criarUsuarios().catch(console.error); 