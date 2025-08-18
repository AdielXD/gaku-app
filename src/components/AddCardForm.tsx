
import React, { useState, useEffect, useRef } from 'react';
import { Card, View, XP_MAP } from '../types';
import { TrashIcon } from './Icons';

export const AddCardForm: React.FC<{
    onAddCard: (card: Omit<Card, 'id'>) => void;
    onEditCard: (card: Card) => void;
    onDeleteCard?: (id: number) => void;
    existingCategories: string[];
    editingCard?: Card | null;
    onDone: () => void;
    onNavigate: (view: View) => void;
}> = ({ onAddCard, onEditCard, onDeleteCard, existingCategories, editingCard, onDone, onNavigate }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [category, setCategory] = useState('');
    const [showInstructions, setShowInstructions] = useState(true);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (editingCard) {
            setFront(editingCard.front);
            setBack(editingCard.back);
            setCategory(editingCard.category);
            setShowInstructions(false);
        } else {
            // Reset form for new card
            setFront('');
            setBack('');
            setCategory(sessionStorage.getItem('gaku-last-category') || existingCategories[0] || '');
        }
    }, [editingCard, existingCategories]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const categoryTrimmed = category.trim();
        if (!front.trim() || !back.trim() || !categoryTrimmed) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        sessionStorage.setItem('gaku-last-category', categoryTrimmed);
        const today = new Date().toISOString();

        if (editingCard) {
            onEditCard({ ...editingCard, front, back, category: categoryTrimmed });
        } else {
            onAddCard({
                front,
                back,
                category: categoryTrimmed,
                repetitions: 0,
                easinessFactor: 2.5,
                interval: 0,
                dueDate: today,
            });
             // Animate and clear for next card
            if(formRef.current) {
                formRef.current.classList.add('new-card-animation');
                setTimeout(() => formRef.current?.classList.remove('new-card-animation'), 1500);
            }
            setFront('');
            setBack('');
            // Keep category for faster additions
            (document.getElementById('front-input') as HTMLInputElement)?.focus();
        }

        if (editingCard) {
            onDone();
        }
    };

    const handleDelete = () => {
        if (editingCard && onDeleteCard) {
            onDeleteCard(editingCard.id);
            onDone();
        }
    };
    
    return (
        <div className={editingCard ? "edit-card-form" : "add-card-view"}>
            <div className="add-card-view-header">
                <h2>{editingCard ? 'Editar Carta' : 'Adicionar Nova Carta'}</h2>
                {editingCard ? (
                     <button onClick={onDone} className="btn-link">Cancelar</button>
                ) : (
                     <button onClick={() => onNavigate('bulk-add')} className="btn-link">
                       Adicionar em Massa
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} ref={formRef} className={editingCard ? "" : "add-card-form"}>
                 {showInstructions && !editingCard && (
                    <div className="form-instructions">
                       <strong>Dica:</strong> Para criar um novo baralho, basta digitar um nome que ainda não existe no campo <code>Categoria</code>.
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="front">Frente</label>
                    <textarea id="front-input" value={front} onChange={e => setFront(e.target.value)} placeholder="ex: 日本" required />
                </div>
                <div className="form-group">
                    <label htmlFor="back">Verso</label>
                    <textarea value={back} onChange={e => setBack(e.target.value)} placeholder="ex: Japão" required />
                </div>
                <div className="form-group">
                    <div className="form-group-header">
                        <label htmlFor="category">Categoria (Baralho)</label>
                         <button type="button" onClick={() => onNavigate('decks')} className="btn-link">Gerenciar Baralhos</button>
                    </div>
                    <input
                        id="category"
                        list="category-list"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        placeholder="ex: Kanji N5"
                        required
                    />
                    <datalist id="category-list">
                        {existingCategories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
                <button type="submit" className="btn">
                    {editingCard ? 'Salvar Alterações' : `Adicionar Carta (+${XP_MAP.addCard} XP)`}
                </button>
                {editingCard && onDeleteCard && (
                    <button type="button" onClick={handleDelete} className="btn-delete">
                        <TrashIcon/> Apagar Carta
                    </button>
                )}
            </form>
        </div>
    );
};
