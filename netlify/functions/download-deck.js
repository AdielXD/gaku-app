// netlify/functions/download-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // Pega o ID do baralho da URL (ex: /download-deck?id=123)
  const deckId = event.queryStringParameters.id;

  if (!deckId) {
    return { statusCode: 400, body: 'ID do baralho não fornecido.' };
  }

  // Pega os dados do baralho e todas as cartas associadas a ele
  const { data: deck, error } = await supabase
    .from('decks')
    .select(`
      id,
      name,
      description,
      author,
      cards (id, front, back)
    `)
    .eq('id', deckId)
    .single(); // .single() retorna um objeto só, em vez de um array

  if (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
  
  // Incrementa o contador de downloads
  await supabase.rpc('increment_downloads', { deck_id_to_increment: deckId });

  return {
    statusCode: 200,
    body: JSON.stringify(deck)
  };
};