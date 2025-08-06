// netlify/functions/get-public-decks.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // Conecta ao Supabase usando as variáveis de ambiente seguras
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // Seleciona todos os dados da tabela 'decks'
  // Ordena por nome em ordem alfabética
  const { data, error } = await supabase
    .from('decks')
    .select('id, name, description, author, downloads')
    .order('name', { ascending: true });

  if (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};