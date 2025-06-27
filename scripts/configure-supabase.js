const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function configureSupabase() {
  console.log('🔧 Configuração do Supabase para IsabelRH\n');
  
  console.log('📋 Para obter as chaves do Supabase:');
  console.log('1. Acesse https://supabase.com');
  console.log('2. Faça login e acesse seu projeto');
  console.log('3. Vá em Settings > API');
  console.log('4. Copie a URL e as chaves\n');

  try {
    // Obter configurações do usuário
    const supabaseUrl = await question('🔗 URL do Supabase (ex: https://xxx.supabase.co): ');
    const anonKey = await question('🔑 Anon Key: ');
    const serviceRoleKey = await question('🔐 Service Role Key: ');
    const jwtSecret = await question('🔒 JWT Secret (ou pressione Enter para gerar automaticamente): ') || generateJWTSecret();

    // Validar entradas
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.log('❌ Todas as chaves são obrigatórias!');
      rl.close();
      return;
    }

    // Configurar arquivo .env
    const envContent = `# Supabase Configuration
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}

# Database Configuration
DATABASE_URL=postgresql://postgres:905718@db.wqifsgaxevfdwmfkihhg.supabase.co:5432/postgres

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
`;

    // Configurar arquivo client/.env.local
    const clientEnvContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${anonKey}

# API Configuration
VITE_API_URL=http://localhost:5000
`;

    // Escrever arquivos
    fs.writeFileSync('.env', envContent);
    fs.writeFileSync('client/.env.local', clientEnvContent);

    console.log('\n✅ Arquivos de configuração criados com sucesso!');
    console.log('📁 .env (backend)');
    console.log('📁 client/.env.local (frontend)');

    // Perguntar se quer configurar o banco
    const setupDB = await question('\n🗄️ Deseja configurar o banco de dados agora? (s/n): ');
    
    if (setupDB.toLowerCase() === 's' || setupDB.toLowerCase() === 'sim') {
      console.log('\n🚀 Executando configuração do banco...');
      
      // Importar e executar setup do banco
      const { setupDatabase } = require('./setup-database.js');
      await setupDatabase();
    }

    console.log('\n🎉 Configuração concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Execute: npm run dev');
    console.log('2. Acesse: http://localhost:5173');
    console.log('3. Teste o login com os usuários de exemplo');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
  } finally {
    rl.close();
  }
}

function generateJWTSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Executar se chamado diretamente
if (require.main === module) {
  configureSupabase();
}

module.exports = { configureSupabase }; 