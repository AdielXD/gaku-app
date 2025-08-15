// netlify/functions/record-card-download.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    const { deckName, cardFront } = JSON.parse(event.body);

    if (!deckName || !cardFront) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Dados insuficientes para registar o download da carta.' }) };
    }

    // Esta função do Supabase encontra a carta pelo nome do baralho e pela frente, e incrementa o seu contador.
    await supabase.rpc('increment_card_download_by_front', { 
        p_deck_name: deckName, 
        p_card_front: cardFront 
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Erro em record-card-download:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Não foi possível registar o download da carta.' }) };
  }
};