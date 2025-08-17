// Ficheiro: netlify/functions/get-deck-cards.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const deckName = event.queryStringParameters.name;

  if (!deckName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nome do baralho não fornecido.' }) };
  }

  try {
    const { data, error } = await supabase
      .from('decks')
      .select('cards (front, back, downloads)')
      .ilike('name', deckName)
      .single();

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data ? data.cards : [])
    };

  } catch (error) {
    console.error(`Erro ao buscar cartas para o baralho ${deckName}:`, error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Não foi possível carregar as cartas do baralho.' }) 
    };
  }
};