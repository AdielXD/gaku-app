
import React, { useState } from 'react';
import { Card, View } from '../types';

export const BulkAddView: React.FC<{
    onBulkAdd: (cards: Omit<Card, 'id' | 'repetitions' | 'easinessFactor' | 'interval' | 'dueDate'>[]) => void;
    onNavigate: (view: View) => void;
    existingCategories: string[];
}> = ({ onBulkAdd, onNavigate, existingCategories }) => {
    const [text, setText] = useState('');
    const [defaultDeck, setDefaultDeck] = useState(sessionStorage.getItem('gaku-last-category') || existingCategories[0] || '');

    const handleSubmit = () => {
        const lines = text.trim().split('\n');
        const newCardsData: Omit<Card, 'id' | 'repetitions' | 'easinessFactor' | 'interval' | 'dueDate'>[] = [];
        const errors: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const separator = ';';
            const parts = line.split(separator).map(p => p.trim());
            
            const front = parts[0];
            const back = parts[1];
            let category = parts.length > 2 && parts[2] ? parts[2] : defaultDeck;

            if (!front || !back) {
                errors.push(`Linha ${i + 1}: Formato inválido. Precisa de 'Frente' e 'Verso'.`);
                continue;
            }
            
            if (!category.trim()) {
                 errors.push(`Linha ${i + 1}: Categoria não especificada e nenhum baralho padrão definido.`);
                 continue;
            }

            newCardsData.push({ front, back, category: category.trim() });
        }

        if (errors.length > 0) {
            alert("Erros encontrados:\n" + errors.join('\n'));
            return;
        }

        if (newCardsData.length === 0) {
            alert("Nenhuma carta para adicionar. Verifique o texto inserido.");
            return;
        }
        
        onBulkAdd(newCardsData);
        alert(`${newCardsData.length} carta(s) adicionada(s) com sucesso!`);
        onNavigate('decks');
    };

    return (
        <div className="add-card-view">
             <div className="add-card-view-header">
                <h2>Adicionar Cartas</h2>
                <button onClick={() => onNavigate('add')} className="btn-link">Adicionar uma por vez</button>
            </div>
            <div className="add-card-form">
                <div className="form-instructions" style={{textAlign: 'left'}}>
                    Adicione cartas, uma por linha, no formato:
                    <br />
                    <code>Frente; Verso; Nome do Baralho</code>
                    <br />
                    O nome do baralho é opcional. Se não o especificar, será usado o baralho padrão abaixo. Separe com <strong>ponto e vírgula (;)</strong>.
                </div>
                <div className="form-group">
                    <label htmlFor="bulk-cards">Cartas:</label>
                    <textarea 
                        id="bulk-cards"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={"こんにちは, Olá, Vocabulário Básico\n日本, Japão, Kanji\nありがとう, Obrigado(a)"}
                        rows={8}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="default-deck">Baralho Padrão (se não especificado na linha):</label>
                    <input 
                        id="default-deck"
                        type="text"
                        value={defaultDeck}
                        onChange={e => setDefaultDeck(e.target.value)}
                        placeholder="Ex: Vocabulário Básico"
                        list="category-list"
                    />
                     <datalist id="category-list">
                       {existingCategories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
                <button onClick={handleSubmit} className="btn" disabled={!text.trim()}>Adicionar Cartas</button>
            </div>
        </div>
    );
};
