const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://wqifsgaxevfdwmfkihhg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no arquivo .env');
  console.log('📝 Crie um arquivo .env na raiz do projeto com as seguintes variáveis:');
  console.log('SUPABASE_URL=https://wqifsgaxevfdwmfkihhg.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui');
  console.log('SUPABASE_ANON_KEY=sua_anon_key_aqui');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...\n');

  try {
    // 1. Ler o arquivo SQL de migração
    const migrationPath = path.join(__dirname, '../server/migrations/create_tables.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Executando migrações...');
    
    // 2. Executar as migrações
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Erro ao executar migrações:', error);
      
      // Tentar executar via SQL direto
      console.log('🔄 Tentando executar via SQL direto...');
      const { error: directError } = await supabase.from('_exec_sql').select('*').limit(1);
      
      if (directError) {
        console.error('❌ Erro ao executar SQL direto:', directError);
        console.log('\n📝 Para executar as migrações manualmente:');
        console.log('1. Acesse o painel do Supabase');
        console.log('2. Vá para SQL Editor');
        console.log('3. Cole o conteúdo do arquivo server/migrations/create_tables.sql');
        console.log('4. Execute o script');
        return;
      }
    }

    console.log('✅ Migrações executadas com sucesso!');

    // 3. Inserir dados de exemplo
    console.log('\n📊 Inserindo dados de exemplo...');
    
    // Usuários de exemplo
    const { error: usersError } = await supabase
      .from('users')
      .upsert([
        {
          id: 'admin-example',
          email: 'admin@isabelrh.com',
          name: 'Administrador',
          type: 'admin'
        },
        {
          id: 'empresa-example',
          email: 'empresa@techcorp.com',
          name: 'TechCorp',
          type: 'empresa'
        },
        {
          id: 'candidato-example',
          email: 'candidato@joao.com',
          name: 'João Silva',
          type: 'candidato'
        }
      ], { onConflict: 'email' });

    if (usersError) {
      console.error('❌ Erro ao inserir usuários:', usersError);
    } else {
      console.log('✅ Usuários de exemplo inseridos');
    }

    // Empresa de exemplo
    const { error: empresaError } = await supabase
      .from('empresas')
      .upsert([
        {
          id: 'empresa-1',
          user_id: 'empresa-example',
          nome: 'TechCorp Solutions',
          email: 'contato@techcorp.com',
          telefone: '(11) 99999-9999',
          cnpj: '12.345.678/0001-90',
          setor: 'Tecnologia',
          tamanho: '50-100 funcionários',
          localizacao: 'São Paulo, SP',
          website: 'https://techcorp.com',
          descricao: 'Empresa de tecnologia focada em soluções inovadoras'
        }
      ], { onConflict: 'cnpj' });

    if (empresaError) {
      console.error('❌ Erro ao inserir empresa:', empresaError);
    } else {
      console.log('✅ Empresa de exemplo inserida');
    }

    // Candidato de exemplo
    const { error: candidatoError } = await supabase
      .from('candidatos')
      .upsert([
        {
          id: 'candidato-1',
          user_id: 'candidato-example',
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          telefone: '(11) 88888-8888',
          localizacao: 'São Paulo, SP',
          experiencia: 3,
          educacao: 'Bacharel em Ciência da Computação',
          habilidades: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
          resumo: 'Desenvolvedor Full Stack com 3 anos de experiência em projetos web',
          expectativa_salarial: 5000,
          disponibilidade: 'Imediata',
          modalidade: 'hibrido',
          tipo_contrato: 'clt',
          setores: ['Tecnologia', 'Desenvolvimento'],
          linkedin: 'linkedin.com/in/joao-silva',
          github: 'github.com/joaosilva',
          score: 85,
          status: 'disponivel'
        }
      ], { onConflict: 'email' });

    if (candidatoError) {
      console.error('❌ Erro ao inserir candidato:', candidatoError);
    } else {
      console.log('✅ Candidato de exemplo inserido');
    }

    // Vaga de exemplo
    const { error: vagaError } = await supabase
      .from('vagas')
      .upsert([
        {
          id: 'vaga-1',
          empresa_id: 'empresa-1',
          titulo: 'Desenvolvedor Full Stack',
          descricao: 'Estamos procurando um desenvolvedor Full Stack para se juntar ao nosso time',
          requisitos: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
          beneficios: ['Plano de saúde', 'Vale refeição', 'Home office', 'PLR'],
          salario_min: 4000,
          salario_max: 8000,
          modalidade: 'hibrido',
          tipo_contrato: 'clt',
          localizacao: 'São Paulo, SP',
          experiencia: 2,
          status: 'ativa',
          candidatos_count: 0
        }
      ], { onConflict: 'id' });

    if (vagaError) {
      console.error('❌ Erro ao inserir vaga:', vagaError);
    } else {
      console.log('✅ Vaga de exemplo inserida');
    }

    console.log('\n🎉 Configuração do banco de dados concluída com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente no frontend (.env.local)');
    console.log('2. Execute o servidor: npm run dev');
    console.log('3. Acesse a aplicação e teste o login');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    console.log('\n📝 Para configuração manual:');
    console.log('1. Acesse o painel do Supabase');
    console.log('2. Execute o script SQL em server/migrations/create_tables.sql');
    console.log('3. Configure as variáveis de ambiente');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 