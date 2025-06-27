// Script para criar usuários no Supabase Auth
// Execute: node scripts/criar-usuarios-auth.js

const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase (substitua pelos seus valores)
const SUPABASE_URL = 'https://wqifsgaxevfdwmfkihhg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWZzZ2F4ZXZmZHdtZmtpaGhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk5NzI5MCwiZXhwIjoyMDUwNTczMjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // Substitua pela sua service role key

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
  
  // Verificar usuários criados
  console.log('\n📋 Verificando usuários criados...');
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Erro ao listar usuários:', error.message);
    } else {
      const usuariosCriados = users.users.filter(user => 
        usuarios.some(u => u.email === user.email)
      );
      
      console.log(`✅ Total de usuários encontrados: ${usuariosCriados.length}`);
      
      usuariosCriados.forEach(user => {
        console.log(`   - ${user.email} (${user.user_metadata?.tipo || 'sem tipo'})`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error.message);
  }
}

// Executar o script
criarUsuarios().catch(console.error); 