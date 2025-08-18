
import React from 'react';
import { DeckInfo, XP_MAP } from '../types';
import { ListIcon, PlusIcon, ArrowRightIcon, Share2Icon, FileTextIcon, PencilIcon, TrashIcon } from './Icons';

export const DeckList: React.FC<{
    decks: DeckInfo[];
    onSelectDeck: (deckName: string) => void;
    onRenameDeck: (oldName: string, newName: string) => void;
    onDeleteDeck: (deckName: string) => void;
    onAddNewDeck: () => void;
    onExportDeck: (deckName: string) => void;
    onShareDeck: (deckName: string) => void;
}> = ({ decks, onSelectDeck, onRenameDeck, onDeleteDeck, onAddNewDeck, onExportDeck, onShareDeck }) => {
    
    if (decks.length === 0) {
        return (
            <div className="empty-state-container">
                <ListIcon />
                <h3>Nenhum baralho encontrado</h3>
                <p>Crie seu primeiro baralho para começar a adicionar cartas e estudar.</p>
                <button className="btn" onClick={onAddNewDeck}>
                    <PlusIcon /> Criar Baralho (+{XP_MAP.newDeck} XP)
                </button>
            </div>
        )
    }

    return (
        <div className="decks-view">
             <div className="decks-view-header">
                <h2>Meus Baralhos</h2>
                <button className="btn btn-add-deck" onClick={onAddNewDeck}>
                    <PlusIcon/> Novo Baralho
                </button>
            </div>
            <ul className="deck-list">
                {decks.map(({ name, count }) => (
                    <li key={name} className="deck-list-item" id={`deck-item-${name.replace(/\s+/g, '-')}`}>
                        <button className="deck-item-main" onClick={() => onSelectDeck(name)} disabled={count === 0}>
                            <div className="deck-info">
                                <div className="deck-name">{name}</div>
                                <div className="deck-card-count">{count} {count === 1 ? 'carta' : 'cartas'}</div>
                            </div>
                            <ArrowRightIcon/>
                        </button>
                        <div className="deck-item-actions">
                             <button 
                                onClick={() => onShareDeck(name)} 
                                className="deck-action-btn share" 
                                title={`Compartilhar com a Comunidade (+${XP_MAP.uploadDeck} XP)`}
                                disabled={count === 0}
                            >
                                <Share2Icon/>
                            </button>
                             <button 
                                onClick={() => onExportDeck(name)} 
                                className="deck-action-btn" 
                                title="Exportar Baralho (CSV)"
                                disabled={count === 0}
                            >
                                <FileTextIcon/>
                            </button>
                            <button onClick={() => onRenameDeck(name, '')} className="deck-action-btn" title="Renomear Baralho"><PencilIcon/></button>
                            <button onClick={() => onDeleteDeck(name)} className="deck-action-btn delete" title="Apagar Baralho"><TrashIcon/></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
