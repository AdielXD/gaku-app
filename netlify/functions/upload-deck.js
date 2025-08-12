// ficheiro: netlify/functions/upload-deck.js

const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  try {
    const { deck, cards } = JSON.parse(event.body);

    // --- Otimização: Validação Robusta de Dados ---
    if (!deck || typeof deck.name !== 'string' || deck.name.trim().length < 2) {
      return { statusCode: 400, body: JSON.stringify({ error: 'O nome do baralho é inválido.' }) };
    }
    if (!deck.author || typeof deck.author !== 'string' || deck.author.trim().length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'O nome do autor é obrigatório.' }) };
    }
    if (!Array.isArray(cards) || cards.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Um baralho não pode ser partilhado sem cartas.' }) };
    }
    for (const card of cards) {
      if (!card.front || !card.back || card.front.trim() === '' || card.back.trim() === '') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Todas as cartas devem ter frente e verso.' }) };
      }
    }

    // --- Inserção na Base de Dados com Tratamento de Erros ---
    let newDeck;
    try {
      const { data, error } = await supabase
        .from('decks')
        .insert({
          name: deck.name.trim(),
          description: (deck.description || '').trim(),
          author: deck.author.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      newDeck = data;

    } catch (error) {
      // Otimização: Experiência do usuário melhorada para nomes duplicados.
      if (error.code === '23505') { // Código de erro do PostgreSQL para violação de unicidade
        return { statusCode: 409, body: JSON.stringify({ error: 'Um baralho com este nome já existe na comunidade.' }) };
      }
      throw error; // Re-lança outros erros
    }

    const cardsWithDeckId = cards.map(card => ({
      front: card.front.trim(),
      back: card.back.trim(),
      deck_id: newDeck.id
    }));

    const { error: cardsError } = await supabase.from('cards').insert(cardsWithDeckId);

    if (cardsError) {
      // Otimização: Tenta apagar o baralho se a inserção das cartas falhar.
      // Isto evita que fiquem baralhos vazios e órfãos na base de dados.
      await supabase.from('decks').delete().eq('id', newDeck.id);
      throw cardsError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Baralho partilhado com sucesso!', deck: newDeck })
    };

  } catch (error) {
    console.error('Erro em upload-deck:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Ocorreu um erro interno ao partilhar o baralho.' }) 
    };
  }
};