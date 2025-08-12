// netlify/functions/download-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // 1. Recebe o NOME do baralho, como o frontend envia.
  const deckName = event.queryStringParameters.name;

  if (!deckName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nome do baralho não fornecido.' }) };
  }

  try {
    // 2. Procura o baralho pelo NOME para obter o seu ID e as suas cartas.
    const { data: deck, error } = await supabase
      .from('decks')
      .select('id, cards (front, back)')
      .eq('name', deckName)
      .single();

    if (error || !deck) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Baralho não encontrado.' }) };
    }

    // 3. Usa o ID que encontrámos para incrementar o contador de downloads.
    //    A sua função 'increment_downloads' no Supabase, que espera um ID, já está correta para isto.
    await supabase.rpc('increment_downloads', { deck_id_to_increment: deck.id });

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