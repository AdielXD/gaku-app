// ficheiro: netlify/functions/add-card-to-deck.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    const { deckName, card } = JSON.parse(event.body);

    // --- Validação dos Dados Recebidos ---
    if (!deckName || typeof deckName !== 'string' || deckName.trim() === '') {
      return { statusCode: 400, body: JSON.stringify({ error: 'O nome do baralho é inválido.' }) };
    }
    if (!card || !card.front || !card.back || card.front.trim() === '' || card.back.trim() === '') {
      return { statusCode: 400, body: JSON.stringify({ error: 'A carta precisa de ter frente e verso.' }) };
    }

    // --- Lógica para Adicionar a Carta ---
    // 1. Encontrar o ID do baralho público a partir do seu nome.
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select('id')
      .eq('name', deckName.trim())
      .single();

    if (deckError || !deck) {
      return { statusCode: 404, body: JSON.stringify({ error: 'O baralho da comunidade correspondente não foi encontrado.' }) };
    }

    // 2. Inserir a nova carta na tabela 'cards', associando-a ao ID do baralho.
    const { error: insertError } = await supabase
      .from('cards')
      .insert({
        front: card.front.trim(),
        back: card.back.trim(),
        deck_id: deck.id,
      });

    if (insertError) {
      // Se a carta já existir, a base de dados pode retornar um erro de unicidade.
      // Aqui, podemos tratar isso como um sucesso para o usuário, pois a carta já existe.
      if (insertError.code === '23505') { 
         console.log("Tentativa de adicionar uma carta duplicada, o que é esperado.");
      } else {
        throw insertError; // Lança outros erros.
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Carta adicionada à comunidade com sucesso!' })
    };

  } catch (error) {
    console.error('Erro em add-card-to-deck:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Ocorreu um erro interno ao adicionar a carta.' }) 
    };
  }
};