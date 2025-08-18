
import React, { useRef, useState, useLayoutEffect } from 'react';
import { Card } from '../types';
import { getAffinityClassName } from '../utils';
import { ArrowLeftIcon, PlayIcon, Share2Icon, ArrowRightLeftIcon, PencilIcon } from './Icons';

export const DeckCardList: React.FC<{
    deckName: string;
    cards: Card[];
    onBack: () => void;
    onEditCard: (card: Card) => void;
    onPractice: (deckName: string) => void;
    onMoveCard: (card: Card) => void;
    onShareCard: (card: Card) => void;
}> = ({ deckName, cards, onBack, onEditCard, onPractice, onMoveCard, onShareCard }) => {
    const listRef = useRef<HTMLUListElement>(null);
    const [newCardId, setNewCardId] = useState<number | null>(null);

    useLayoutEffect(() => {
        const lastAddedCardId = sessionStorage.getItem('lastAddedCardId');
        if (lastAddedCardId) {
            setNewCardId(parseInt(lastAddedCardId, 10));
            sessionStorage.removeItem('lastAddedCardId');
            
            const cardElement = document.getElementById(`card-item-${lastAddedCardId}`);
            cardElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const timer = setTimeout(() => setNewCardId(null), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="deck-card-list-view">
            <div className="deck-card-list-header">
                 <button onClick={onBack} className="back-btn" aria-label="Voltar para baralhos"><ArrowLeftIcon/></button>
                <div className="deck-card-list-title">
                     <h2>{deckName}</h2>
                </div>
                <div className="deck-card-list-actions">
                     <button className="btn btn-practice" onClick={() => onPractice(deckName)} disabled={cards.length === 0}>
                        <PlayIcon/> Praticar
                    </button>
                </div>
            </div>
           
            {cards.length > 0 ? (
                <ul className="all-cards-list" ref={listRef}>
                    {cards.sort((a,b) => a.id - b.id).map(card => (
                        <li 
                            key={card.id} 
                            id={`card-item-${card.id}`}
                            className={`card-list-item ${getAffinityClassName(card.repetitions)} ${card.id === newCardId ? 'new-card-animation' : ''}`}
                        >
                            <div className="card-list-text">
                                <span className="card-list-front">{card.front}</span>
                                <span className="card-list-back">{card.back}</span>
                            </div>
                            <div className="card-list-actions">
                                <button className="deck-action-btn share" onClick={() => onShareCard(card)} title="Compartilhar com a Comunidade"><Share2Icon/></button>
                                <button className="deck-action-btn move" onClick={() => onMoveCard(card)} title="Mover Carta"><ArrowRightLeftIcon/></button>
                                <button className="edit-card-btn" onClick={() => onEditCard(card)} title="Editar Carta"><PencilIcon/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                 <div className="empty-deck-message">
                    <span>Este baralho está vazio.</span>
                </div>
            )}
        </div>
    );
}
