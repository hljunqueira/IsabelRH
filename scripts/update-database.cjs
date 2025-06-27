const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateDatabase() {
  try {
    console.log('🔄 Atualizando estrutura do banco de dados...');

    // SQL para tornar o campo senha opcional
    const alterTableSQL = `
      ALTER TABLE usuarios 
      ALTER COLUMN senha DROP NOT NULL;
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: alterTableSQL });
    
    if (error) {
      // Se não conseguir executar via RPC, vamos tentar uma abordagem diferente
      console.log('⚠️  Não foi possível executar via RPC. Execute manualmente no SQL Editor:');
      console.log(alterTableSQL);
      console.log('\n📝 Ou remova a coluna senha se não for mais necessária:');
      console.log('ALTER TABLE usuarios DROP COLUMN senha;');
    } else {
      console.log('✅ Campo senha tornou-se opcional');
    }

    // Verificar se existem usuários sem senha e preencher com valor padrão
    const { data: usuarios, error: selectError } = await supabase
      .from('usuarios')
      .select('id, senha')
      .is('senha', null);

    if (selectError) {
      console.error('❌ Erro ao buscar usuários:', selectError);
      return;
    }

    if (usuarios && usuarios.length > 0) {
      console.log(`📝 Encontrados ${usuarios.length} usuários sem senha`);
      console.log('ℹ️  Estes usuários devem fazer login via Supabase Auth');
      
      // Atualizar usuários sem senha com um valor placeholder
      for (const usuario of usuarios) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ senha: 'managed_by_supabase_auth' })
          .eq('id', usuario.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar usuário ${usuario.id}:`, updateError);
        }
      }
      console.log('✅ Usuários atualizados com placeholder');
    }

    console.log('\n🎉 Atualização concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Faça login/cadastro pelo frontend usando Supabase Auth');
    console.log('2. O backend agora usa JWT do Supabase para autenticação');
    console.log('3. A rota /api/auth/login foi desabilitada');

  } catch (error) {
    console.error('❌ Erro durante a atualização:', error);
  }
}

updateDatabase(); 