// netlify/functions/download-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const deckName = event.queryStringParameters.name;

  if (!deckName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nome do baralho não fornecido.' }) };
  }

  try {
    // Usamos .ilike() para busca case-insensitive, como boa prática
    const { data: deck, error } = await supabase
      .from('decks')
      .select('id, cards (front, back, downloads)')
      .ilike('name', deckName) // Boa prática: busca 'case-insensitive'
      .single();

    if (error || !deck) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Baralho não encontrado.' }) };
    }

    // --- LÓGICA DE INCREMENTO ---
    // 1. Incrementa o contador do BARALHO
    await supabase.rpc('increment_downloads', { deck_id_to_increment: deck.id });

    // 2. (NOVO!) Incrementa o contador de TODAS AS CARTAS no baralho
    await supabase.rpc('increment_deck_cards_downloads', { deck_id_to_increment: deck.id });

    return {
      statusCode: 200,
      body: JSON.stringify(deck.cards || [])
    };

  } catch (error) {
    console.error(`Erro ao baixar o baralho ${deckName}:`, error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Ocorreu um erro interno ao processar o seu pedido.' }) 
    };
  }
};