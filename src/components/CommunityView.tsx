
import React, { useState, useMemo, useEffect } from 'react';
import { Card, View, ModalConfig, PublicDeck, PublicCard, XP_MAP } from '../types';
import { communityApi } from '../api';
import { Loader } from './Loader';
import { CustomDialog } from './CustomDialog';
import { ArrowLeftIcon, CloudDownloadIcon, DownloadIcon, CheckCircleIcon, GlobeIcon, Share2Icon } from './Icons';

export const CommunityView: React.FC<{
    onDownloadDeck: (deck: PublicDeck, cards: PublicCard[]) => void;
    onDownloadCard: (card: PublicCard, deckName: string) => void;
    localCards: Card[];
    onNavigate: (view: View) => void;
    publicDecks: PublicDeck[];
    isLoading: boolean;
}> = ({ onDownloadDeck, onDownloadCard, localCards, onNavigate, publicDecks, isLoading }) => {
    const [downloading, setDownloading] = useState<string | null>(null);
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [expandedDeck, setExpandedDeck] = useState<PublicDeck | null>(null);
    const [deckCards, setDeckCards] = useState<PublicCard[]>([]);
    const [areCardsLoading, setAreCardsLoading] = useState(false);
    const [deckStatuses, setDeckStatuses] = useState<Record<string, 'owned' | 'partial' | 'unowned'>>({});
    const [areStatusesLoading, setAreStatusesLoading] = useState(false);
    
    const localDeckNamesSet = useMemo(() => new Set(localCards.map(c => c.category.toLowerCase())), [localCards]);

    useEffect(() => {
        if (publicDecks.length > 0 && !isLoading) {
            const checkDeckStatuses = async () => {
                setAreStatusesLoading(true);
                const newStatuses: Record<string, 'owned' | 'partial' | 'unowned'> = {};
                
                await Promise.all(publicDecks.map(async (deck) => {
                    const localDeckNameLower = deck.name.toLowerCase();
                    const localDeckExists = localDeckNamesSet.has(localDeckNameLower);

                    if (!localDeckExists) {
                        newStatuses[deck.name] = 'unowned';
                        return;
                    }

                    try {
                        const communityCards = await communityApi.getDeckCards(deck.name);
                        if (!communityCards || communityCards.length === 0) {
                            const localCardsInDeck = localCards.filter(c => c.category.toLowerCase() === localDeckNameLower);
                            newStatuses[deck.name] = localCardsInDeck.length > 0 ? 'partial' : 'owned';
                            return;
                        }

                        const localCardsInDeck = localCards.filter(c => c.category.toLowerCase() === localDeckNameLower);
                        const localCardFronts = new Set(localCardsInDeck.map(c => c.front.toLowerCase()));
                        const hasAllCards = communityCards.every(cc => localCardFronts.has(cc.front.toLowerCase()));

                        if (hasAllCards) {
                            newStatuses[deck.name] = 'owned';
                        } else {
                            newStatuses[deck.name] = 'partial';
                        }
                    } catch (error) {
                        console.error(`Failed to get status for deck ${deck.name}`, error);
                        newStatuses[deck.name] = 'unowned'; // Fail safe
                    }
                }));

                setDeckStatuses(newStatuses);
                setAreStatusesLoading(false);
            };
            checkDeckStatuses();
        }
    }, [publicDecks, localCards, isLoading, localDeckNamesSet]);

    const handleDownloadAll = async (deck: PublicDeck) => {
        setDownloading(deck.name);
        await communityApi.recordDeckDownload(deck.name);
        const cards = await communityApi.getDeckCards(deck.name);
        setDownloading(null);
        
        if (cards.length === 0) {
            alert(`Não foi possível baixar as cartas para "${deck.name}". Tente novamente mais tarde.`);
            return;
        }

        const handleConfirmDownload = () => onDownloadDeck(deck, cards);

        const localDeckExists = localDeckNamesSet.has(deck.name.toLowerCase());
        
        if (localDeckExists) {
             setModalConfig({
                type: 'confirm',
                title: 'Atualizar Baralho?',
                message: `Você já tem um baralho chamado "${deck.name}". Baixar este baralho irá adicionar as cartas da comunidade que você ainda não tem. Deseja continuar?`,
                confirmText: 'Continuar',
                onConfirm: handleConfirmDownload,
            });
        } else {
            handleConfirmDownload();
        }
    };
    
    const handleExpandDeck = async (deck: PublicDeck) => {
        setExpandedDeck(deck);
        setAreCardsLoading(true);
        const cards = await communityApi.getDeckCards(deck.name);
        setAreCardsLoading(false);
        if (cards && cards.length > 0) {
            setDeckCards(cards);
        } else {
            alert(`Não foi possível carregar as cartas para "${deck.name}" ou o baralho está vazio.`);
            setExpandedDeck(null);
        }
    };

    if (expandedDeck) {
        const localCardsInThisDeck = localCards.filter(c => c.category.toLowerCase() === expandedDeck.name.toLowerCase());
        const allCardsDownloaded = deckCards.every(communityCard => 
            localCardsInThisDeck.some(lc => lc.front.toLowerCase() === communityCard.front.toLowerCase())
        );

        return (
            <div className="deck-card-list-view">
                 <div className="deck-card-list-header">
                    <button onClick={() => setExpandedDeck(null)} className="back-btn" aria-label="Voltar para comunidade"><ArrowLeftIcon/></button>
                    <div className="deck-card-list-title">
                         <h2>{expandedDeck.name}</h2>
                    </div>
                    <div className="deck-card-list-actions">
                         <button 
                             className="btn btn-practice"
                             onClick={() => handleDownloadAll(expandedDeck)}
                             disabled={downloading !== null || allCardsDownloaded}
                         >
                            <CloudDownloadIcon/> {allCardsDownloaded ? 'Tudo baixado' : 'Baixar Tudo'}
                        </button>
                    </div>
                </div>
                {areCardsLoading ? <Loader /> : (
                    <ul className="all-cards-list">
                        {deckCards.map(card => {
                            const isDownloaded = localCardsInThisDeck.some(lc => lc.front.toLowerCase() === card.front.toLowerCase());
                            return (
                                <li key={`${card.front}-${card.back}`} className="card-list-item">
                                    <div className="card-list-text">
                                        <span className="card-list-front">{card.front}</span>
                                        <span className="card-list-back">{card.back}</span>
                                    </div>
                                    <div className="card-list-meta">
                                        <span className="download-count"><DownloadIcon/> {card.downloads || 0}</span>
                                    </div>
                                    <div className="card-list-actions">
                                        {isDownloaded ? (
                                            <button className="deck-action-btn owned" title="Você já possui esta carta" disabled>
                                                <CheckCircleIcon/>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => onDownloadCard(card, expandedDeck.name)} 
                                                className="deck-action-btn download" 
                                                title={`Baixar carta (+${XP_MAP.downloadCard} XP)`}
                                            >
                                                <CloudDownloadIcon/>
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <div className="decks-view">
            <div className="decks-view-header">
                <h2>Explorar Baralhos da Comunidade</h2>
            </div>

            {isLoading ? <Loader /> : (
                <>
                    {publicDecks.length > 0 ? (
                        <ul className="deck-list">
                            {publicDecks.map((deck) => {
                                const status = deckStatuses[deck.name];
                                const isStatusLoading = areStatusesLoading && !status;

                                return (
                                <li key={deck.id || deck.name} className="deck-list-item">
                                    <div className="deck-item-main" onClick={() => handleExpandDeck(deck)} style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <div className="deck-name">{deck.name}</div>
                                            <div className="deck-card-count">{deck.cardCount} cartas</div>
                                        </div>
                                        <div className="deck-card-count" style={{ fontStyle: 'italic', paddingRight: '20px' }}>{deck.description || 'Sem descrição.'}</div>
                                        <div className="deck-metadata">
                                            <span>Por: <strong>{deck.author || 'Anônimo'}</strong></span>
                                            <span className="download-count"><DownloadIcon/> {deck.downloads || 0}</span>
                                        </div>
                                    </div>
                                    <div className="deck-item-actions">
                                         {isStatusLoading || downloading === deck.name ? (
                                            <div className="deck-action-btn" style={{ cursor: 'default' }}>
                                                <Loader isSmall={true} />
                                            </div>
                                        ) : status === 'owned' ? (
                                            <button
                                                className="deck-action-btn owned"
                                                title="Você já possui todas as cartas deste baralho."
                                                disabled
                                            >
                                                <CheckCircleIcon />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDownloadAll(deck); }}
                                                className={`deck-action-btn download ${status === 'partial' ? 'partial' : ''}`}
                                                title={status === 'partial'
                                                    ? `Atualizar baralho. Faltam cartas. (+${XP_MAP.downloadDeck} XP)`
                                                    : `Baixar todo o baralho ${deck.name} (+${XP_MAP.downloadDeck} XP)`
                                                }
                                                disabled={downloading !== null}
                                            >
                                                <CloudDownloadIcon />
                                            </button>
                                        )}
                                    </div>
                                </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="empty-state-container">
                            <GlobeIcon />
                            <h3>A comunidade está vazia</h3>
                            <p>Ainda não há baralhos compartilhados. Que tal ser o primeiro?</p>
                            <button className="btn btn-outline" onClick={() => onNavigate('decks')}>
                                <Share2Icon/> Compartilhar um baralho
                            </button>
                        </div>
                    )}
                     {publicDecks.length > 0 && (
                        <div className="community-footer">
                            <p>Viu um baralho que gostou? Baixe-o! Ou <button className="btn-link" onClick={() => onNavigate('decks')}>compartilhe um dos seus</button> para ajudar a comunidade.</p>
                        </div>
                     )}
                </>
            )}
            {modalConfig && <CustomDialog {...modalConfig} onDismiss={() => setModalConfig(null)} />}
        </div>
    );
};
