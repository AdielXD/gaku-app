// netlify/functions/check-deck-exists.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const deckName = event.queryStringParameters.name;

    if (!deckName) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Nome do baralho não fornecido.' }) };
    }

    try {
        const { data, error } = await supabase
            .from('decks')
            .select('name')
            .ilike('name', deckName.trim()); // .ilike é case-insensitive

        if (error) {
            throw error;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ exists: data && data.length > 0 })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};