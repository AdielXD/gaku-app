// Ficheiro: netlify/functions/record-deck-download.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    const { deckName } = JSON.parse(event.body);
    if (!deckName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nome do baralho não fornecido.' }) };
    }

    // 1. Encontrar o baralho pelo nome para obter o seu ID
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select('id')
      .ilike('name', deckName)
      .single();

    if (deckError || !deck) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Baralho não encontrado para registar o download.' }) };
    }

    // 2. Executar as duas lógicas de incremento em paralelo
    await Promise.all([
        supabase.rpc('increment_downloads', { deck_id_to_increment: deck.id }),
        supabase.rpc('increment_deck_cards_downloads', { deck_id_to_increment: deck.id })
    ]);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Erro em record-deck-download:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Não foi possível registar o download do baralho.' }) };
  }
};