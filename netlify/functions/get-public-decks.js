// netlify/functions/download-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // Pega o NOME do baralho da URL (ex: /download-deck?name=Kanji)
  const deckName = event.queryStringParameters.name;

  if (!deckName) {
    return { statusCode: 400, body: 'Nome do baralho não fornecido.' };
  }

  // Pega os dados do baralho e todas as suas cartas, buscando pelo NOME
  const { data, error } = await supabase
    .from('decks')
    .select('cards (front, back)')
    .eq('name', deckName) // Mudamos de 'id' para 'name'
    .single();

  if (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
  
  // Aqui vamos apenas retornar as cartas, como o novo frontend espera
  return {
    statusCode: 200,
    body: JSON.stringify(data ? data.cards : []) // Retorna um array de cartas
  };
};