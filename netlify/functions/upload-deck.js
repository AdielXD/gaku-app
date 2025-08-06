// netlify/functions/upload-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const { deck, cards } = JSON.parse(event.body);

  if (!deck || !deck.name) {
    return { statusCode: 400, body: 'Dados do baralho estão faltando.' };
  }

  // 1. Insere o novo baralho
  const { data: newDeck, error: deckError } = await supabase
    .from('decks')
    .insert({
      name: deck.name,
      description: deck.description,
      author: deck.author,
      downloads: 0
    })
    .select()
    .single();

  if (deckError) {
    return { statusCode: 500, body: JSON.stringify(deckError) };
  }

  // 2. Se houver cartas para adicionar, insere-as
  if (cards && cards.length > 0) {
    const cardsWithDeckId = cards.map(card => ({
      ...card,
      deck_id: newDeck.id
    }));

    const { error: cardsError } = await supabase.from('cards').insert(cardsWithDeckId);

    if (cardsError) {
      return { statusCode: 500, body: JSON.stringify(cardsError) };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Baralho enviado com sucesso!', deck: newDeck })
  };
};