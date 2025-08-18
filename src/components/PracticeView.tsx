
import React, { useState, useCallback } from 'react';
import { Card } from '../types';
import { Flashcard } from './Flashcard';
import { XIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons';

export const PracticeView: React.FC<{
    cards: Card[];
    deckName: string;
    onEnd: () => void;
}> = ({ cards, deckName, onEnd }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (cards.length === 0) {
        return <div className="practice-view">Nenhuma carta para praticar.</div>;
    }

    const currentCard = cards[currentIndex];

    const goToNext = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex(prev => (prev + 1) % cards.length);
    }, [cards.length]);

    const goToPrev = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
    }, [cards.length]);
    
    const handlePracticeSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
        // In practice mode, swipe is for navigation on the front of the card
        if (direction === 'left') { // swipe left for next card
            goToNext();
        } else if (direction === 'right') { // swipe right for previous card
            goToPrev();
        }
    }, [goToNext, goToPrev]);
    
    return (
        <div className="practice-view">
             <div className="practice-header">
                <button onClick={onEnd} className="back-btn"><XIcon/></button>
                <h3>Praticando: {deckName}</h3>
                <div className="progress">{currentIndex + 1}/{cards.length}</div>
            </div>
            <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} feedbackState="" onSwipe={handlePracticeSwipe} mode="practice" />
            <div className="practice-controls">
                <button onClick={goToPrev} className="icon-btn" aria-label="Carta Anterior"><ArrowLeftIcon/></button>
                <button onClick={() => setIsFlipped(!isFlipped)} className="btn">
                    {isFlipped ? 'Ocultar Resposta' : 'Mostrar Resposta'}
                </button>
                <button onClick={goToNext} className="icon-btn" aria-label="Próxima Carta"><ArrowRightIcon/></button>
            </div>
        </div>
    );
};
