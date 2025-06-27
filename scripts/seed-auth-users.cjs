const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const users = [
  {
    email: 'isabel@isabelcunha.com.br',
    password: 'admin123',
    data: { name: 'Isabel Cunha', type: 'admin' }
  },
  {
    email: 'joao.silva@email.com',
    password: 'senha123',
    data: { name: 'João Silva', type: 'candidato' }
  },
  {
    email: 'rh@techsolutions.com.br',
    password: 'senha123',
    data: { name: 'Tech Solutions', type: 'empresa' }
  }
];

async function createUsers() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      user_metadata: user.data,
      email_confirm: true
    });
    if (error) {
      console.error(`Erro ao criar ${user.email}:`, error.message);
    } else {
      console.log(`Usuário criado: ${user.email}`);
    }
  }
  process.exit();
}

createUsers(); 