// netlify/functions/record-deck-download.js
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

    // Esta função do Supabase incrementa o contador de downloads do baralho
    await supabase.rpc('increment_downloads_by_name', { deck_name_to_increment: deckName });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Erro em record-deck-download:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Não foi possível registar o download do baralho.' }) };
  }
};