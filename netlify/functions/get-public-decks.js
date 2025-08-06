// netlify/functions/get-public-decks.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*, cards(count)'); // Pede todos os campos de 'decks' e a contagem de 'cards'

    if (error) {
      throw error;
    }

    // Formata os dados para o frontend
    const formattedData = data.map(deck => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      author: deck.author,
      downloads: deck.downloads,
      cardCount: deck.cards[0]?.count || 0
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(formattedData)
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};