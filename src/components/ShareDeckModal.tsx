
import React, { useState } from 'react';
import { XP_MAP } from '../types';
import { Loader } from './Loader';

export const ShareDeckModal: React.FC<{
    deckName: string;
    onConfirm: (description: string, author: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}> = ({ deckName, onConfirm, onCancel, isLoading }) => {
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState(localStorage.getItem('gaku-author-name') || '');

    const handleConfirm = () => {
        if (!author.trim()) {
            alert("Por favor, insira seu nome de autor.");
            return;
        }
        localStorage.setItem('gaku-author-name', author.trim());
        onConfirm(description.trim(), author.trim());
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="custom-dialog-content" onClick={(e) => e.stopPropagation()}>
                <h3>Compartilhar "{deckName}"</h3>
                <p>Adicione alguns detalhes para ajudar outros usuários a encontrar seu baralho.</p>
                <div className="form-group">
                    <label htmlFor="share-author">Seu Nome (Autor)</label>
                    <input
                        id="share-author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Ex: Hideo"
                        maxLength={50}
                        required
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="share-description">Descrição (Opcional)</label>
                    <textarea
                        id="share-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Vocabulário essencial do JLPT N5, kanji, etc."
                        rows={3}
                        maxLength={200}
                    />
                </div>
                <div className="dialog-actions">
                    <button onClick={onCancel} className="btn btn-cancel" disabled={isLoading}>
                        Cancelar
                    </button>
                    <button onClick={handleConfirm} className="btn" disabled={!author.trim() || isLoading}>
                        {isLoading ? <Loader isSmall={true} /> : `Confirmar (+${XP_MAP.uploadDeck} XP)`}
                    </button>
                </div>
            </div>
        </div>
    );
};
