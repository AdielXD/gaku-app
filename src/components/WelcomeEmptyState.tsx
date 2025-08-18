
import React from 'react';
import { ListIcon, PlusIcon } from './Icons';
import { XP_MAP } from '../types';

export const WelcomeEmptyState: React.FC<{ onAddNewDeck: () => void }> = ({ onAddNewDeck }) => (
    <div className="empty-state-container">
        <ListIcon />
        <h3>Bem-vindo ao Gaku!</h3>
        <p>Parece que você ainda não tem nenhum baralho. Crie o seu primeiro para começar a adicionar cartas e revisar.</p>
        <button className="btn" onClick={onAddNewDeck}>
            <PlusIcon /> Criar Meu Primeiro Baralho (+{XP_MAP.newDeck} XP)
        </button>
    </div>
);
