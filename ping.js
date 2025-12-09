import { createClient } from '@supabase/supabase-js';

// Pega as senhas que vamos configurar no GitHub
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Faltam as chaves do Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function acordarBanco() {
  console.log('Tentando conectar ao Supabase...');
  
  // Faz uma leitura simples na tabela 'decks' que eu vi que você tem no projeto
  const { data, error } = await supabase
    .from('decks')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Erro ao conectar:', error.message);
    process.exit(1);
  } else {
    console.log('Sucesso! O banco respondeu e está acordado.');
  }
}

acordarBanco();