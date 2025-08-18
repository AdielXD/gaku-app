
import { PublicDeck, PublicCard, Card } from './types';

// --- COMMUNITY BACKEND API ---
// This will make calls to your Netlify Functions, which will in turn
// communicate with your Supabase database.
export const communityApi = {
  getPublicDecks: async (): Promise<PublicDeck[]> => {
    try {
      const response = await fetch('/.netlify/functions/get-public-decks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.sort((a: PublicDeck, b: PublicDeck) => b.downloads - a.downloads);
    } catch (error) {
      console.error("Error fetching public decks:", error);
      return [];
    }
  },

  getDeckCards: async (deckName: string): Promise<PublicCard[]> => {
     try {
        const response = await fetch(`/.netlify/functions/get-deck-cards?name=${encodeURIComponent(deckName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
     } catch (error) {
        console.error(`Error fetching cards for deck ${deckName}:`, error);
        return [];
     }
  },

  checkDeckExists: async (deckName: string): Promise<boolean> => {
    try {
        const response = await fetch(`/.netlify/functions/check-deck-exists?name=${encodeURIComponent(deckName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error(`Error checking if deck ${deckName} exists:`, error);
        return true; // Fail safe: assume it exists to prevent accidental uploads.
    }
  },

  uploadDeck: async (deckData: Omit<PublicDeck, 'cardCount' | 'downloads'>, cards: Card[] | { front: string, back: string }[]): Promise<{success: boolean, message?: string}> => {
     try {
        const response = await fetch('/.netlify/functions/upload-deck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                deck: deckData, 
                cards: cards.map(c => ({ front: c.front, back: c.back })) 
            }),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
        }
        return { success: true };
     } catch (error: any) {
        console.error("Error uploading deck:", error);
        return { success: false, message: error.message };
     }
  },

  addCardToPublicDeck: async (deckName: string, card: { front: string; back: string }): Promise<{success: boolean, message?: string}> => {
     try {
        const response = await fetch('/.netlify/functions/add-card-to-deck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deckName, card }),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
        }
        return { success: true };
     } catch (error: any) {
        console.error("Error adding card to public deck:", error);
        return { success: false, message: error.message };
     }
  },

  recordDeckDownload: async (deckName: string): Promise<{success: boolean}> => {
      try {
          const response = await fetch('/.netlify/functions/record-deck-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deckName }),
          });
          return { success: response.ok };
      } catch (error) {
          console.error("Error recording deck download:", error);
          return { success: false };
      }
  },

  recordCardDownload: async (deckName: string, cardFront: string): Promise<{success: boolean}> => {
      try {
          const response = await fetch('/.netlify/functions/record-card-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deckName, cardFront }),
          });
          return { success: response.ok };
      } catch (error) {
          console.error("Error recording card download:", error);
          return { success: false };
      }
  },
};
