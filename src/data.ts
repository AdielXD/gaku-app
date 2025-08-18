
import { Card } from './types';

// --- INITIAL DATA ---
export const getInitialCards = (): Card[] => {
    const today = new Date().toISOString();
    const initialSrsState = { repetitions: 0, easinessFactor: 2.5, interval: 0, dueDate: today };
    return [
      { id: 1, front: 'こんにちは', back: 'Olá', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 2, front: 'ありがとう', back: 'Obrigado(a)', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 3, front: 'はい', back: 'Sim', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 4, front: 'いいえ', back: 'Não', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 5, front: '日本', back: 'Japão', category: 'Kanji', ...initialSrsState },
      { id: 6, front: '学', back: 'Gaku - Estudar / Aprender', category: 'Kanji', ...initialSrsState },
    ];
};
