// netlify/functions/share-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // Só permite requisições do tipo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  // Pega os dados enviados pelo frontend
  const { deck, cards } = JSON.parse(event.body);

  if (!deck || !cards || cards.length === 0) {
    return { statusCode: 400, body: 'Dados do baralho ou das cartas estão faltando.' };
  }

  // 1. Insere o novo baralho na tabela 'decks' e pega o ID dele
  const { data: newDeck, error: deckError } = await supabase
    .from('decks')
    .insert({
      name: deck.name,
      description: deck.description,
      author: deck.author
    })
    .select()
    .single();

  if (deckError) {
    return { statusCode: 500, body: JSON.stringify(deckError) };
  }

  // 2. Associa o ID do novo baralho a cada carta
  const cardsWithDeckId = cards.map(card => ({
    ...card,
    deck_id: newDeck.id
  }));

  // 3. Insere todas as cartas na tabela 'cards'
  const { error: cardsError } = await supabase
    .from('cards')
    .insert(cardsWithDeckId);

  if (cardsError) {
    // Se der erro aqui, o ideal seria deletar o baralho que foi criado.
    // Mas para simplificar, vamos apenas retornar o erro.
    return { statusCode: 500, body: JSON.stringify(cardsError) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Baralho compartilhado com sucesso!', deck: newDeck })
  };
};