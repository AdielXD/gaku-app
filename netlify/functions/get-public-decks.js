// ficheiro: netlify/functions/get-public-decks.js

const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    // Otimização: A consulta agora é mais explícita e robusta.
    // Ela busca todos os baralhos e, para cada um, conta as cartas associadas.
    const { data, error } = await supabase
      .from('decks')
      .select('*, cards(count)'); // Pede todos os campos de 'decks' e a contagem de 'cards'

    if (error) {
      throw error;
    }

    // Otimização: O resultado é formatado de forma segura no servidor.
    // Isto garante que o frontend sempre receberá os dados no formato esperado.
    const formattedData = data.map(deck => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      author: deck.author,
      downloads: deck.downloads,
      // Garante que cardCount seja sempre um número, mesmo que a relação 'cards' não exista.
      cardCount: deck.cards[0]?.count || 0
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(formattedData)
    };

  } catch (error) {
    // Otimização: Tratamento de erros melhorado para devolver uma mensagem clara.
    console.error('Erro em get-public-decks:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Não foi possível carregar os baralhos da comunidade." }) 
    };
  }
};