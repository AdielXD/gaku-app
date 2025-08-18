
import React, { useState, useMemo, useEffect, useCallback } from 'react';

import { Card, View, StudyDay, UserProfile, Theme, ReviewSettings, FeedbackType, ModalConfig, NotificationPermissionStatus, DeckInfo, PublicDeck, PublicCard, XP_MAP } from './types';
import { communityApi } from './api';
import { getInitialCards } from './data';
import { calculateSuperMemo2, playFeedbackSound, requestNotificationPermission, manageNotifications } from './utils';

import { AddCardForm } from './components/AddCardForm';
import { BulkAddView } from './components/BulkAddView';
import { CategorySelection } from './components/CategorySelection';
import { CommunityView } from './components/CommunityView';
import { Controls } from './components/Controls';
import { CustomDialog } from './components/CustomDialog';
import { DeckCardList } from './components/DeckCardList';
import { DeckList } from './components/DeckList';
import { Flashcard } from './components/Flashcard';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { NavBar } from './components/NavBar';
import { OnboardingTour } from './components/OnboardingTour';
import { PracticeView } from './components/PracticeView';
import { SessionComplete } from './components/SessionComplete';
import { SettingsView } from './components/SettingsView';
import { ShareDeckModal } from './components/ShareDeckModal';
import { StatsView } from './components/StatsView';
import { WelcomeEmptyState } from './components/WelcomeEmptyState';
import { XpGainToast } from './components/XpGainToast';


// --- MAIN APP COMPONENT ---
export const App = () => {
    // --- ONE-TIME DATA MIGRATION ---
    useEffect(() => {
        const runDataMigration = () => {
            const migrationKey = 'gaku-migration-v3-user-profile';
            if (localStorage.getItem(migrationKey) === 'true') {
                return false; // Migration already done, no reload needed
            }

            console.log("Running one-time data migration check...");
            let migrationOccurred = false;
            
            // --- Previous migration logic ---
            const oldMigrationKey = 'gaku-migration-v2-supermemo-complete';
            if(localStorage.getItem(oldMigrationKey)) {
                // assume previous migrations ran
            }

            // Mark this specific migration as complete.
            localStorage.setItem(migrationKey, 'true');

            if (migrationOccurred) {
                 console.log("Data migration complete. Reloading page to apply changes.");
                 window.location.reload();
                 return true; // Reloading page
            }
            return false; // No migration, no reload needed
        };
        
        const isReloading = runDataMigration();
        if (isReloading) {
            document.body.style.display = 'none'; // Hide body to prevent flash of old content
        }

    }, []); // Empty dependency array ensures it runs only once on mount.


    // --- STATE MANAGEMENT ---
    const [cards, setCards] = useState<Card[]>(() => {
        try {
            const savedCards = localStorage.getItem('gaku-cards');
            return savedCards ? JSON.parse(savedCards) : getInitialCards();
        } catch (e) {
            console.error("Failed to parse cards from localStorage", e);
            return getInitialCards();
        }
    });
    
    const [studyHistory, setStudyHistory] = useState<StudyDay[]>(() => {
        const savedHistory = localStorage.getItem('gaku-study-history');
        if (!savedHistory) return [];
        try {
            const parsed = JSON.parse(savedHistory);
            // Check if it's the new format. If not, reset to avoid bad data.
            return (parsed.length > 0 && parsed[0].hasOwnProperty('reviewed')) ? parsed : [];
        } catch(e) { 
            return [];
        }
    });

    const [userProfile, setUserProfile] = useState<UserProfile>(() => {
        try {
            const savedProfile = localStorage.getItem('gaku-user-profile');
            const defaults: UserProfile = { streak: 0, lastStudiedDate: null, dailyGoal: 50, dailyXp: 0, dailyGoalMetDate: null, reminderTime: '10:00' };
            const parsed = savedProfile ? JSON.parse(savedProfile) : {};
            return { ...defaults, ...parsed };
        } catch(e) {
            return { streak: 0, lastStudiedDate: null, dailyGoal: 50, dailyXp: 0, dailyGoalMetDate: null, reminderTime: '10:00' };
        }
    });

    const [view, setView] = useState<View>('review');
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [movingCard, setMovingCard] = useState<Card | null>(null);
    const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
    const [practiceDeck, setPracticeDeck] = useState<string | null>(null);
    const [feedbackState, setFeedbackState] = useState('');
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [deckToShare, setDeckToShare] = useState<string | null>(null);
    const [cardToShare, setCardToShare] = useState<Card | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermissionStatus>('default');
    const [isLoading, setIsLoading] = useState(false);
    const [reviewQueue, setReviewQueue] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [xpToastInfo, setXpToastInfo] = useState<{ amount: number; id: number } | null>(null);
    const [publicDecks, setPublicDecks] = useState<PublicDeck[]>([]);
    const [arePublicDecksLoading, setArePublicDecksLoading] = useState(true);

    // Settings State
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('gaku-theme') as Theme) || 'light');
    const [reviewSettings, setReviewSettings] = useState<ReviewSettings>(() => {
        try {
            const savedSettings = localStorage.getItem('gaku-review-settings');
            const defaults: ReviewSettings = { order: 'default', dailyLimit: 50 };
            const parsed = savedSettings ? JSON.parse(savedSettings) : {};
            return { ...defaults, ...parsed };
        } catch(e) { 
            return { order: 'default', dailyLimit: 50 }; 
        }
    });
    
    // Onboarding State
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [isReviewOnboarding, setIsReviewOnboarding] = useState(false);
    const [reviewOnboardingStep, setReviewOnboardingStep] = useState(0);
    const [viewBeforeTutorial, setViewBeforeTutorial] = useState<View>('review');


    // --- DERIVED STATE & MEMOS ---
    const now = useMemo(() => new Date(), [view, cards]); // Recalculate 'now' when cards change or view switches

    const dueCards = useMemo(() => {
        return cards.filter(card => new Date(card.dueDate) <= now);
    }, [cards, now]);

    const decksWithDueCounts = useMemo(() => {
        const deckMap = new Map<string, number>();
        dueCards.forEach(card => {
            deckMap.set(card.category, (deckMap.get(card.category) || 0) + 1);
        });
        return Array.from(deckMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [dueCards]);
    
    const currentCard = reviewQueue[currentCardIndex];

    const allDecks = useMemo(() => {
         const deckMap = new Map<string, number>();
         cards.forEach(card => {
            // Exclude placeholder cards from count
            if (card.repetitions !== -1) {
                deckMap.set(card.category, (deckMap.get(card.category) || 0) + 1);
            }
         });
         // Make sure decks with only placeholder cards are still listed (as count 0)
         const allCategories = new Set(cards.map(c => c.category));
         allCategories.forEach((cat: string) => {
            if (!deckMap.has(cat)) {
                deckMap.set(cat, 0);
            }
         });

         return Array.from(deckMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [cards]);
    
    const existingCategories = useMemo(() => allDecks.map(d => d.name), [allDecks]);
    
    const cardsInSelectedDeck = useMemo(() => {
        if (!selectedDeck) return [];
        return cards.filter(c => c.category === selectedDeck && c.repetitions !== -1);
    }, [cards, selectedDeck]);

    const cardsInPracticeDeck = useMemo(() => {
        if (!practiceDeck) return [];
        return cards.filter(c => c.category === practiceDeck && c.repetitions !== -1);
    }, [cards, practiceDeck]);


    // --- EFFECTS ---
    useEffect(() => {
        try {
            localStorage.setItem('gaku-cards', JSON.stringify(cards));
        } catch (e) {
            console.error("Failed to save cards to localStorage", e);
        }
    }, [cards]);

    useEffect(() => {
         try {
            localStorage.setItem('gaku-study-history', JSON.stringify(studyHistory));
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
    }, [studyHistory]);
    
    useEffect(() => {
        try {
            localStorage.setItem('gaku-user-profile', JSON.stringify(userProfile));
        } catch (e) {
            console.error("Failed to save user profile to localStorage", e);
        }
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('gaku-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const onboardingComplete = localStorage.getItem('gaku-onboarding-complete');
        if (onboardingComplete !== 'true' && cards.length <= 6) {
            // Delay start to allow UI to render
            const timer = setTimeout(() => setIsOnboarding(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);
    
    useEffect(() => {
        const fetchPublicDecks = async () => {
            setArePublicDecksLoading(true);
            const decks = await communityApi.getPublicDecks();
            setPublicDecks(decks);
            setArePublicDecksLoading(false);
        };
        fetchPublicDecks();
    }, []);
    
    useEffect(() => {
        if ('Notification' in window) {
            const permission = Notification.permission;
            setNotificationPermission(permission);
            if (permission === 'granted') {
                 manageNotifications(userProfile, userProfile.streak);
            }
        } else {
            setNotificationPermission('unsupported');
        }
    }, []);
    
    // Recalculate streak and handle daily XP reset
    useEffect(() => {
        const calculateCurrentStreak = (history: StudyDay[]): number => {
            if (!history || history.length === 0) return 0;

            const studiedDates = new Set(history.map(d => d.date));
            let streak = 0;
            const today = new Date();

            const isStudied = (d: Date) => studiedDates.has(d.toISOString().split('T')[0]);

            const checkDate = new Date();
            if (!isStudied(checkDate)) {
                checkDate.setDate(checkDate.getDate() - 1);
            }

            if (!isStudied(checkDate)) return 0;

            while (isStudied(checkDate)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
            return streak;
        };

        const currentStreak = calculateCurrentStreak(studyHistory);
        const todayStr = new Date().toISOString().split('T')[0];

        setUserProfile(p => {
            let newDailyXp = p.dailyXp;
            // Reset daily XP if the last study day was not today AND today's goal hasn't been met.
            if (p.lastStudiedDate !== todayStr && p.dailyGoalMetDate !== todayStr) {
                newDailyXp = 0;
            }
            return { ...p, streak: currentStreak, dailyXp: newDailyXp };
        });

    }, [studyHistory]);
    
    useEffect(() => {
        if (movingCard) {
            const otherDecks = allDecks.filter(d => d.name !== movingCard.category).map(d => d.name);
            if (otherDecks.length === 0) {
                alert("Não há outros baralhos para mover a carta.");
                setMovingCard(null);
                return;
            }

            let selectedDeckForMove = otherDecks[0];

            setModalConfig({
                type: 'confirm', // Using confirm type, but message will have the select
                title: `Mover "${movingCard.front}"`,
                message: (
                    <div className="form-group">
                        <label htmlFor="move-deck-select">Selecione o baralho de destino:</label>
                        <select
                            id="move-deck-select"
                            className="dialog-select"
                            defaultValue={selectedDeckForMove}
                            onChange={e => selectedDeckForMove = e.target.value}
                            autoFocus
                        >
                            {otherDecks.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                ),
                confirmText: 'Mover',
                onConfirm: () => handleConfirmMoveCard(movingCard.id, selectedDeckForMove),
                onCancel: () => setMovingCard(null),
            });
        }
    }, [movingCard, allDecks]); // Rerun if allDecks changes while modal is conceptually open


    // Reset review state when category changes or view is left
    useEffect(() => {
        // This effect should only clear the review state when the user navigates away from the review view.
        if (view !== 'review') {
            setCurrentCategory(null);
            setReviewQueue([]);
        }
        // Always reset card index and flip state when view or category changes to start fresh.
        setCurrentCardIndex(0);
        setIsFlipped(false);
    }, [currentCategory, view]);

    // --- HANDLERS ---
    const grantXp = (amount: number, options: { isStudy?: boolean } = {}) => {
        if (amount <= 0) return;
    
        const todayStr = new Date().toISOString().split('T')[0];
        setUserProfile(p => {
            const newDailyXp = p.dailyXp + amount;
            const goalMet = p.dailyGoal > 0 && newDailyXp >= p.dailyGoal;
            const wasGoalAlreadyMet = p.dailyGoalMetDate === todayStr;
    
            if (goalMet && !wasGoalAlreadyMet) {
                console.log(`Daily goal of ${p.dailyGoal} XP reached!`);
                // Future: show a special "goal met" animation/toast
            }
    
            const updatedProfile: Partial<UserProfile> = {
                dailyXp: newDailyXp,
                dailyGoalMetDate: goalMet ? todayStr : p.dailyGoalMetDate,
            };
            if(options.isStudy) {
                updatedProfile.lastStudiedDate = todayStr;
            }
            return { ...p, ...updatedProfile };
        });
    
        setXpToastInfo({ amount, id: Date.now() });
    };

    const handleNavigate = (targetView: View) => {
        setEditingCard(null); // Clear any editing state when changing views
        setSelectedDeck(null); // Clear deck selection
        setPracticeDeck(null); // Clear practice mode
        setView(targetView);
    };

    const handleSelectCategory = (category: string) => {
        const reviewOnboardingComplete = localStorage.getItem('gaku-review-onboarding-complete') === 'true';

        let queue = dueCards.filter(c => c.category === category);
        switch (reviewSettings.order) {
            case 'random': queue = [...queue].sort(() => Math.random() - 0.5); break;
            case 'newestFirst': queue.sort((a, b) => b.id - a.id); break;
            default: queue.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); break;
        }
        if (reviewSettings.dailyLimit > 0) {
            queue = queue.slice(0, reviewSettings.dailyLimit);
        }

        setReviewQueue(queue);
        setCurrentCardIndex(0);
        setCurrentCategory(category);
        
        if (!reviewOnboardingComplete) {
            setViewBeforeTutorial('review');
            setIsReviewOnboarding(true);
            setReviewOnboardingStep(0);
        }
    };

    const handleShowAnswer = () => setIsFlipped(true);
    
    const checkAndOfferCommunityShare = async (newCard: Omit<Card, 'id'>) => {
        const publicDeckInfo = publicDecks.find(deck => deck.name.toLowerCase() === newCard.category.toLowerCase());
        
        if (!publicDeckInfo) {
            return; // Not a public deck
        }

        console.log(`Checking if card "${newCard.front}" exists in public deck "${newCard.category}"...`);
        // This fetch is fire-and-forget, it might be slow but won't block UI.
        const publicCards = await communityApi.getDeckCards(newCard.category);

        // Proceed only if the fetch was likely successful (might be an empty deck)
        if (publicCards) {
            const cardExists = publicCards.some(pc => pc.front.trim().toLowerCase() === newCard.front.trim().toLowerCase());
            
            if (!cardExists) {
                setModalConfig({
                    type: 'confirm',
                    title: 'Contribuir para a Comunidade?',
                    message: (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <p>A carta <strong>"{newCard.front}"</strong> não existe no baralho público <strong>"{newCard.category}"</strong>. Deseja compartilhá-la com a comunidade? (+{XP_MAP.communityContribution} XP)</p>
                        </div>
                    ),
                    confirmText: 'Compartilhar',
                    cancelText: 'Agora não',
                    onConfirm: async () => {
                        setIsLoading(true);
                        const result = await communityApi.addCardToPublicDeck(newCard.category, { front: newCard.front, back: newCard.back });
                        setIsLoading(false);
                        if (result.success) {
                            alert('Obrigado por sua contribuição! A carta foi adicionada à comunidade.');
                            grantXp(XP_MAP.communityContribution);
                        } else {
                            alert(`Não foi possível adicionar a carta: ${result.message || 'Tente novamente mais tarde.'}`);
                        }
                    },
                });
            } else {
                 console.log(`Card "${newCard.front}" already exists in public deck. No action taken.`);
            }
        }
    };

    const handleFeedback = (quality: FeedbackType) => {
        if (!currentCard) return;
        
        const feedbackClass = `feedback-${quality}`;
        setFeedbackState(feedbackClass);
        playFeedbackSound(quality);

        const updatedSrs = calculateSuperMemo2(currentCard, quality);
        const updatedCard = { ...currentCard, ...updatedSrs };
        const isCorrect = quality === 'good' || quality === 'easy';
        const xpGained = XP_MAP[quality];

        setTimeout(() => {
            setCards(prev => prev.map(c => c.id === currentCard.id ? updatedCard : c));
            
            const todayStr = new Date().toISOString().split('T')[0];
            setStudyHistory(prev => {
                const todayEntryIndex = prev.findIndex(d => d.date === todayStr);
                if (todayEntryIndex > -1) {
                    const newHistory = [...prev];
                    const updatedEntry = {
                        ...newHistory[todayEntryIndex],
                        reviewed: newHistory[todayEntryIndex].reviewed + 1,
                        correct: isCorrect ? newHistory[todayEntryIndex].correct + 1 : newHistory[todayEntryIndex].correct,
                    };
                    newHistory[todayEntryIndex] = updatedEntry;
                    return newHistory;
                } else {
                    return [...prev, { date: todayStr, reviewed: 1, correct: isCorrect ? 1 : 0 }];
                }
            });

            grantXp(xpGained, { isStudy: true });

            setCurrentCardIndex(prev => prev + 1);
            
            setIsFlipped(false);
            setFeedbackState('');
        }, 550); // Duration should match CSS animation
    };
    
    const handleSwipeFeedback = (direction: 'left' | 'right' | 'up') => {
        if (direction === 'left') {
            handleFeedback('again');
        } else if (direction === 'right') {
            handleFeedback('good');
        } else if (direction === 'up') {
            handleFeedback('easy');
        }
    };

    const handleAddOrUpdateCard = (newOrUpdatedCardData: Card | Omit<Card, 'id'>) => {
        let cardToSave: Card;

        if ('id' in newOrUpdatedCardData) { // Editing existing card
            cardToSave = newOrUpdatedCardData as Card;
            setCards(prevCards => prevCards.map(c => c.id === cardToSave.id ? cardToSave : c));
        } else { // Adding new card
            const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
            cardToSave = { ...newOrUpdatedCardData, id: newId } as Card;
            setCards(prevCards => [...prevCards, cardToSave]);
            sessionStorage.setItem('lastAddedCardId', String(newId));
            grantXp(XP_MAP.addCard);

            // Check if this new card can be contributed to the community
            checkAndOfferCommunityShare(newOrUpdatedCardData);
        }
    };
    
    const handleBulkAddCards = (newCardsData: Omit<Card, 'id' | 'repetitions' | 'easinessFactor' | 'interval' | 'dueDate'>[]) => {
        let maxId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
        const today = new Date().toISOString();
        const initialSrsState = { repetitions: 0, easinessFactor: 2.5, interval: 0, dueDate: today };

        const cardsToSave: Card[] = newCardsData.map(newCard => ({
            ...initialSrsState,
            ...newCard,
            id: maxId++,
        }));

        const newDeckNames = new Set(cardsToSave.map(c => c.category));
        const existingDeckNamesLower = new Set(existingCategories.map(c => c.toLowerCase()));

        const placeholderCards = [...newDeckNames]
            .filter(name => !existingDeckNamesLower.has(name.toLowerCase()))
            .map(deckName => ({
                id: maxId++,
                front: 'placeholder',
                back: 'placeholder',
                category: deckName,
                repetitions: -1,
                easinessFactor: -1,
                interval: -1,
                dueDate: '',
            }));

        setCards(prev => [...prev.filter(c => c.repetitions !== -1), ...cardsToSave, ...placeholderCards]);
        grantXp(XP_MAP.addCard * cardsToSave.length);
    };

    const handleEditCard = (card: Card) => {
        setEditingCard(card);
        setView('add');
    };

    const handleDeleteCard = (id: number) => {
        setModalConfig({
            type: 'confirm',
            title: 'Apagar Carta?',
            message: 'Tem certeza que deseja apagar esta carta permanentemente?',
            confirmText: 'Apagar',
            isDestructive: true,
            onConfirm: () => {
                setCards(prev => prev.filter(c => c.id !== id));
                setEditingCard(null); // Clear editing state
                setView('decks'); // Go back to the deck list
            },
        });
    };

    const handleMoveCard = (card: Card) => {
        setMovingCard(card);
    };

    const handleConfirmMoveCard = (cardId: number, newCategory: string) => {
        setCards(prev => prev.map(c => c.id === cardId ? { ...c, category: newCategory } : c));
        setMovingCard(null);
    };
    
    const handleRenameDeck = (oldName: string, newName: string) => {
        setModalConfig({
            type: 'prompt',
            title: `Renomear "${oldName}"`,
            message: 'Digite o novo nome para este baralho.',
            initialValue: oldName,
            confirmText: 'Renomear',
            onConfirm: (newDeckName) => {
                if (newDeckName && newDeckName.trim() !== oldName) {
                    if (existingCategories.some(c => c.toLowerCase() === newDeckName.trim().toLowerCase())) {
                        alert(`Um baralho chamado "${newDeckName}" já existe.`);
                        return;
                    }
                    setCards(prev => prev.map(c => c.category === oldName ? { ...c, category: newDeckName.trim() } : c));
                }
            },
        });
    };
    
    const handleDeleteDeck = (deckName: string) => {
        setModalConfig({
            type: 'confirm',
            title: `Apagar "${deckName}"?`,
            message: 'Isso apagará o baralho e todas as cartas dentro dele permanentemente. Esta ação não pode ser desfeita.',
            confirmText: 'Apagar Tudo',
            isDestructive: true,
            onConfirm: () => {
                const itemEl = document.getElementById(`deck-item-${deckName.replace(/\s+/g, '-')}`);
                if (itemEl) {
                    itemEl.classList.add('is-deleting');
                    setTimeout(() => {
                         setCards(prev => prev.filter(c => c.category !== deckName));
                    }, 500);
                } else {
                     setCards(prev => prev.filter(c => c.category !== deckName));
                }
            }
        });
    };
    
    const handleAddNewDeck = () => {
         setModalConfig({
            type: 'prompt',
            title: 'Criar Novo Baralho',
            message: `Digite o nome para o seu novo baralho. (+${XP_MAP.newDeck} XP)`,
            confirmText: 'Criar',
            onConfirm: (deckName) => {
                if (deckName) {
                    const trimmedDeckName = deckName.trim();
                    if (existingCategories.some(c => c.toLowerCase() === trimmedDeckName.toLowerCase())) {
                        alert(`Um baralho chamado "${trimmedDeckName}" já existe.`);
                        return;
                    }
                    
                    const placeholderCard: Omit<Card, 'id'> = {
                        front: 'placeholder', back: 'placeholder', category: trimmedDeckName, 
                        repetitions: -1, easinessFactor: -1, interval: -1, dueDate: ''
                    };

                    const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
                    const cardToSave = { ...placeholderCard, id: newId } as Card;
                    
                    setCards(prev => [...prev, cardToSave]);
                    setSelectedDeck(trimmedDeckName);
                    setView('decks');
                    grantXp(XP_MAP.newDeck);
                }
            },
        });
    };

    const handleShareDeck = (deckName: string) => {
        setDeckToShare(deckName);
    };

    const handleShareCard = async (card: Card) => {
        setIsLoading(true);
        const deckExists = await communityApi.checkDeckExists(card.category);
        
        if (deckExists) {
            const publicCards = await communityApi.getDeckCards(card.category);
            setIsLoading(false);
            const cardExistsInPublicDeck = publicCards.some(pc => pc.front.trim().toLowerCase() === card.front.trim().toLowerCase());

            if (cardExistsInPublicDeck) {
                alert(`A carta "${card.front}" já existe no baralho público "${card.category}".`);
                return;
            }

            setModalConfig({
                type: 'confirm',
                title: 'Contribuir para a Comunidade?',
                message: `Deseja adicionar a carta "${card.front}" ao baralho público existente "${card.category}"? (+${XP_MAP.communityContribution} XP)`,
                confirmText: 'Compartilhar',
                onConfirm: async () => {
                    setIsLoading(true);
                    const result = await communityApi.addCardToPublicDeck(card.category, { front: card.front, back: card.back });
                    setIsLoading(false);
                    if (result.success) {
                        alert('Obrigado pela contribuição! A carta foi compartilhada.');
                        grantXp(XP_MAP.communityContribution);
                    } else {
                        alert(`Falha ao compartilhar: ${result.message || 'Tente novamente.'}`);
                    }
                },
            });

        } else {
            // Deck does not exist, trigger the full share deck flow for this one card
            setIsLoading(false);
            setCardToShare(card);
            setDeckToShare(card.category);
        }
    };

    const handleConfirmShare = async (description: string, author: string) => {
        if (!deckToShare) return;

        setIsLoading(true);
        // This check is now only for the full-deck share flow
        if (!cardToShare) {
            const remoteExists = await communityApi.checkDeckExists(deckToShare);
            if (remoteExists) {
                setIsLoading(false);
                alert(`Um baralho com o nome "${deckToShare}" já foi compartilhado na comunidade. Por favor, renomeie o seu baralho se quiser compartilhá-lo.`);
                setDeckToShare(null);
                return;
            }
        }

        const cardsToUpload = cardToShare
            ? [cardToShare]
            : cards.filter(c => c.category === deckToShare && c.repetitions !== -1);
        
        if (cardsToUpload.length === 0) {
            setIsLoading(false);
            alert("Não há cartas para compartilhar.");
            setDeckToShare(null);
            setCardToShare(null);
            return;
        }

        const deckData = { name: deckToShare, description, author };
        const result = await communityApi.uploadDeck(deckData, cardsToUpload);
        
        setIsLoading(false);
        setDeckToShare(null);
        setCardToShare(null); // Always reset this

        if (result.success) {
            alert(`Baralho "${deckToShare}" compartilhado com a comunidade com sucesso!`);
            grantXp(XP_MAP.uploadDeck); // Creating a new deck is always a big contribution
        } else {
            alert(`Falha ao compartilhar o baralho: ${result.message || 'Erro desconhecido.'}`);
        }
    };


    const handleReviewSettingsChange = (newSettings: Partial<ReviewSettings>) => {
        setReviewSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('gaku-review-settings', JSON.stringify(updated));
            return updated;
        });
    };
    
    const handleProfileChange = (newProfile: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...newProfile }));
    };

    const handleBackup = (): string => {
        const data = {
            cards: cards.filter(c => c.repetitions !== -1), // Don't backup placeholders
            studyHistory: studyHistory,
            reviewSettings: reviewSettings,
            userProfile: userProfile,
        };
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    };

    const handleRestore = (data: string) => {
        try {
            const decoded = decodeURIComponent(escape(atob(data)));
            const parsed = JSON.parse(decoded);
            if (parsed.cards && Array.isArray(parsed.cards)) {
                setCards(parsed.cards);
                if (parsed.studyHistory) setStudyHistory(parsed.studyHistory);
                if (parsed.reviewSettings) handleReviewSettingsChange(parsed.reviewSettings);
                if (parsed.userProfile) setUserProfile(parsed.userProfile);
            } else {
                throw new Error("Formato de dados inválido.");
            }
        } catch (e) {
            alert('Código de backup inválido ou corrompido.');
            console.error("Restore failed:", e);
        }
    };
    
    const exportToCsv = (data: Card[], fileName: string) => {
        const headers = ['front', 'back', 'category'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + [
                headers.join(','),
                ...data.map(card => headers.map(header => `"${String(card[header as keyof Card]).replace(/"/g, '""')}"`).join(','))
            ].join('\n');
        
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportCsv = () => {
        exportToCsv(cards.filter(c => c.repetitions !== -1), 'gaku_backup_total');
    };
    
    const handleExportDeck = (deckName: string) => {
        const deckCards = cards.filter(c => c.category === deckName && c.repetitions !== -1);
        const fileName = `gaku_baralho_${deckName.replace(/\s+/g, '_')}`;
        exportToCsv(deckCards, fileName);
    };
    
    const handleExportJson = () => {
        const data = {
            cards: cards.filter(c => c.repetitions !== -1),
            studyHistory: studyHistory,
            reviewSettings: reviewSettings,
            userProfile: userProfile,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement('a');
        link.setAttribute('href', jsonString);
        link.setAttribute('download', 'gaku_backup.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                if (file.name.toLowerCase().endsWith('.csv')) {
                    const rows = text.split('\n').slice(1); // ignore header
                    if (rows.length === 0) throw new Error("Arquivo CSV vazio ou inválido.");
                    
                    let maxId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) : 0;
                    const today = new Date().toISOString();
                    const initialSrsState = { repetitions: 0, easinessFactor: 2.5, interval: 0, dueDate: today };

                    const newCards = rows.map((row) => {
                        if (!row.trim()) return null;
                        const columns = row.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g)?.map(col => col.replace(/"/g, '')) || [];
                        if (columns.length >= 2) {
                            maxId++;
                            return {
                                id: maxId,
                                front: columns[0] || '',
                                back: columns[1] || '',
                                category: columns[2] || 'Importado',
                                ...initialSrsState
                            };
                        }
                        return null;
                    }).filter((c): c is Card => c !== null && c.front.trim() !== '' && c.back.trim() !== '');

                    if(newCards.length > 0) {
                         setCards(prev => [...prev.filter(c => c.repetitions !== -1), ...newCards]);
                         alert(`${newCards.length} carta(s) importada(s) com sucesso!`);
                         grantXp(XP_MAP.addCard * newCards.length);
                         setView('decks');
                    } else {
                         throw new Error("Nenhuma carta válida encontrada no arquivo.");
                    }
                } else if (file.name.toLowerCase().endsWith('.json')) {
                    if (confirm('Restaurar de um arquivo JSON substituirá todos os seus baralhos, histórico e configurações atuais. Tem certeza que deseja continuar?')) {
                        const parsed = JSON.parse(text);
                        if (parsed.cards && Array.isArray(parsed.cards)) {
                            setCards(parsed.cards);
                            if (parsed.studyHistory) setStudyHistory(parsed.studyHistory);
                            if (parsed.reviewSettings) handleReviewSettingsChange(parsed.reviewSettings);
                            if (parsed.userProfile) setUserProfile(parsed.userProfile);
                            alert('Dados restaurados com sucesso do arquivo JSON!');
                            setView('review'); // Go to a neutral view
                        } else {
                            throw new Error("Formato de dados JSON inválido.");
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao importar arquivo:", error);
                alert(`Falha ao importar o arquivo. Verifique se o formato está correto e o conteúdo não está corrompido.`);
            }
        };

        reader.onerror = () => {
            alert("Não foi possível ler o arquivo.");
        };

        if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.json')) {
             alert("Formato de arquivo não suportado. Por favor, selecione um arquivo .csv ou .json.");
             return;
        }

        reader.readAsText(file, 'UTF-8');
    };


    const handleImportCommunityDeck = (deck: PublicDeck, communityCards: PublicCard[]) => {
        let maxId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) : 0;
        const today = new Date().toISOString();
        const initialSrsState = { repetitions: 0, easinessFactor: 2.5, interval: 0, dueDate: today };

        const localCardsInDeck = cards.filter(c => c.category.toLowerCase() === deck.name.toLowerCase());
        
        const newCardsToAdd = communityCards.filter(communityCard => 
            !localCardsInDeck.some(localCard => localCard.front.toLowerCase() === communityCard.front.toLowerCase())
        ).map(communityCard => {
            maxId++;
            return {
                ...initialSrsState,
                id: maxId,
                front: communityCard.front,
                back: communityCard.back,
                category: deck.name, // Use the original casing
            };
        });

        if (newCardsToAdd.length > 0) {
            setCards(prev => [...prev.filter(c => c.repetitions !== -1), ...newCardsToAdd]);
            alert(`${newCardsToAdd.length} nova(s) carta(s) adicionada(s) ao baralho "${deck.name}"!`);
            grantXp(XP_MAP.downloadDeck);
        } else {
            alert(`O baralho "${deck.name}" já está atualizado com todas as cartas da comunidade.`);
        }
        setView('decks');
        setSelectedDeck(deck.name);
    };

    const handleImportSingleCard = (card: PublicCard, deckName: string) => {
        const targetDeckName = existingCategories.find(c => c.toLowerCase() === deckName.toLowerCase()) || deckName;
    
        const cardExists = cards.some(c => 
            c.category.toLowerCase() === deckName.toLowerCase() &&
            c.front.toLowerCase().trim() === card.front.toLowerCase().trim()
        );
    
        if (cardExists) {
            alert(`A carta "${card.front}" já existe no seu baralho "${targetDeckName}".`);
            return;
        }
        
        // Fire-and-forget the download recording so the UI is not blocked
        communityApi.recordCardDownload(deckName, card.front);
    
        let maxId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
        const today = new Date().toISOString();
        const initialSrsState = { repetitions: 0, easinessFactor: 2.5, interval: 0, dueDate: today };
        
        const newCard: Card = {
            ...initialSrsState,
            id: maxId,
            front: card.front,
            back: card.back,
            category: targetDeckName,
        };
    
        // When we add a new card to a new deck, we should remove the placeholder for that deck if it exists.
        setCards(prev => [...prev.filter(c => !(c.repetitions === -1 && c.category.toLowerCase() === targetDeckName.toLowerCase())), newCard]);
        alert(`Carta "${card.front}" adicionada ao baralho "${targetDeckName}"!`);
        grantXp(XP_MAP.downloadCard);
    };

    const handleRequestNotificationPermission = async () => {
        const status = await requestNotificationPermission();
        setNotificationPermission(status);
        if (status === 'granted') {
            alert('Notificações ativadas! Você será lembrado de estudar.');
            manageNotifications(userProfile, userProfile.streak);
        } else if (status === 'denied') {
            alert('As notificações foram bloqueadas. Para ativá-las, você precisa alterar as permissões de notificação para este site nas configurações do seu navegador.');
        }
    };

    const handleStartReviewTutorial = () => {
        setViewBeforeTutorial(view); // Save current view
        // Create a dummy queue for the tutorial
        const dummyCard = cards.find(c => c.repetitions !== -1) || getInitialCards()[0];
        setReviewQueue([dummyCard]);
        setCurrentCardIndex(0);
        
        setIsReviewOnboarding(true);
        setReviewOnboardingStep(0);
        setView('review'); // Switch to review view to show the elements
    };

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const renderContent = () => {
        if (isLoading && !deckToShare) return <Loader />; // Full screen loader, except for share modal
        if (isOnboarding || isReviewOnboarding) return null; // Tour handles its own UI
        
        if (practiceDeck) {
            return <PracticeView cards={cardsInPracticeDeck} deckName={practiceDeck} onEnd={() => setPracticeDeck(null)} />;
        }
        
        if (view === 'add') {
            return <AddCardForm 
                onAddCard={handleAddOrUpdateCard}
                onEditCard={handleAddOrUpdateCard}
                onDeleteCard={handleDeleteCard}
                existingCategories={existingCategories}
                editingCard={editingCard}
                onDone={() => { setEditingCard(null); setView('decks'); }}
                onNavigate={handleNavigate}
            />;
        }

        if (view === 'bulk-add') {
            return <BulkAddView 
                onBulkAdd={handleBulkAddCards} 
                onNavigate={handleNavigate} 
                existingCategories={existingCategories} 
            />;
        }

        if (view === 'decks') {
            if (selectedDeck) {
                return <DeckCardList 
                    deckName={selectedDeck} 
                    cards={cardsInSelectedDeck} 
                    onBack={() => setSelectedDeck(null)}
                    onEditCard={handleEditCard}
                    onPractice={setPracticeDeck}
                    onMoveCard={handleMoveCard}
                    onShareCard={handleShareCard}
                />
            }
            return <DeckList 
                decks={allDecks} 
                onSelectDeck={setSelectedDeck}
                onRenameDeck={handleRenameDeck}
                onDeleteDeck={handleDeleteDeck}
                onAddNewDeck={handleAddNewDeck}
                onExportDeck={handleExportDeck}
                onShareDeck={handleShareDeck}
            />;
        }

        if (view === 'settings') {
            return <SettingsView 
                settings={{ review: reviewSettings, profile: userProfile }}
                onReviewSettingsChange={handleReviewSettingsChange}
                onProfileChange={handleProfileChange}
                onBackup={handleBackup}
                onRestore={handleRestore}
                onExportJson={handleExportJson}
                onExportCsv={handleExportCsv}
                onImport={handleImportFile}
                notificationPermission={notificationPermission}
                onRequestPermission={handleRequestNotificationPermission}
                onStartReviewTutorial={handleStartReviewTutorial}
            />;
        }

        if (view === 'stats') {
             return <StatsView cards={cards.filter(c => c.repetitions !== -1)} studyHistory={studyHistory} onBack={() => handleNavigate('review')} />;
        }

        if (view === 'community') {
            return <CommunityView 
                onDownloadDeck={handleImportCommunityDeck} 
                onDownloadCard={handleImportSingleCard}
                localCards={cards} 
                onNavigate={handleNavigate}
                publicDecks={publicDecks}
                isLoading={arePublicDecksLoading}
            />;
        }

        // --- Review View Logic ---
        if (allDecks.length === 0) {
            return <WelcomeEmptyState onAddNewDeck={handleAddNewDeck} />;
        }

        if (currentCategory && currentCard) {
            return (
                <div className="review-view">
                    <Flashcard
                        card={currentCard}
                        isFlipped={isFlipped}
                        onFlip={handleShowAnswer}
                        feedbackState={feedbackState}
                        onSwipe={handleSwipeFeedback}
                        mode="review"
                    />
                    <Controls
                        isFlipped={isFlipped}
                        onShowAnswer={handleShowAnswer}
                        onFeedback={handleFeedback}
                        progressText={`${currentCardIndex + 1} / ${reviewQueue.length}`}
                    />
                </div>
            );
        }
        
        // After finishing a queue, schedule notifications
        if(currentCategory && !currentCard) {
            manageNotifications(userProfile, userProfile.streak);
        }

        if (decksWithDueCounts.length > 0) {
             return <CategorySelection decks={decksWithDueCounts} onSelectCategory={handleSelectCategory} />;
        }
        
        return <SessionComplete onAddMore={() => setView('bulk-add')} onGoToDecks={() => setView('decks')} streak={userProfile.streak} />;
    };
    
    const mainTourSteps = [
        { elementId: 'nav-review', title: 'Bem-vindo ao Gaku!', text: 'Esta é a tela de Revisão. Aqui você verá as cartas que precisam ser estudadas hoje com base na repetição espaçada.', position: 'top' },
        { elementId: 'nav-decks', title: 'Gerenciar Baralhos', text: 'Aqui você pode ver todas as suas cartas, editar baralhos existentes e praticar sem o sistema de repetição.', position: 'top' },
        { elementId: 'nav-add', title: 'Adicionar Cartas', text: 'Use este botão para criar novas cartas e baralhos para os seus estudos.', position: 'top', isRound: true },
        { elementId: 'nav-community', title: 'Explore a Comunidade', text: 'Baixe baralhos compartilhados por outros usuários para expandir seus estudos.', position: 'top' },
        { elementId: 'header-stats-btn', title: 'Acompanhe seu Progresso', text: 'Clique aqui a qualquer momento para ver suas estatísticas de estudo, como o histórico de revisões e o domínio das cartas.', position: 'bottom', isRound: true }
    ];

    const reviewTourSteps = [
        { elementId: 'flashcard-container', title: 'Como Revisar', text: 'Primeiro, veja o conteúdo na frente da carta e tente se lembrar do que está no verso.', position: 'bottom', isFlipped: false },
        { elementId: 'show-answer-btn', title: 'Revele a Resposta', text: 'Depois de tentar lembrar, clique aqui para virar a carta e ver se você acertou.', position: 'top', isFlipped: false },
        { elementId: 'srs-buttons-container', title: 'Avalie sua Dificuldade', text: 'Selecione uma opção com base na dificuldade que você teve para lembrar: "Errei", "OK" (se foi difícil) ou "Fácil".', position: 'top', isFlipped: true },
        { elementId: 'flashcard-container', title: 'Pronto!', text: 'O Gaku usará sua resposta para decidir quando mostrar esta carta novamente. Continue assim para fortalecer sua memória!', position: 'bottom', isFlipped: true }
    ];

    return (
        <>
            <div className="app-container">
                <Header 
                    profile={userProfile}
                    onStatsClick={() => setView('stats')}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
                <div className="content-wrapper">
                    {view === 'review' && currentCard && (
                         <div className="review-view">
                            <Flashcard
                                card={currentCard}
                                isFlipped={isFlipped}
                                onFlip={handleShowAnswer}
                                feedbackState={feedbackState}
                                onSwipe={handleSwipeFeedback}
                                mode="review"
                            />
                            <Controls
                                isFlipped={isFlipped}
                                onShowAnswer={handleShowAnswer}
                                onFeedback={handleFeedback}
                                progressText={`${currentCardIndex + 1} / ${reviewQueue.length}`}
                            />
                        </div>
                    )}
                    {/* Render other content, but not review view if it's already rendered above */}
                    {!(view === 'review' && currentCard) && renderContent()}
                </div>
                 <NavBar currentView={view} onNavigate={handleNavigate} reviewCount={dueCards.length} />
            </div>
             {modalConfig && <CustomDialog {...modalConfig} onDismiss={() => setModalConfig(null)} />}
             {deckToShare && (
                <ShareDeckModal 
                    deckName={deckToShare}
                    onConfirm={handleConfirmShare}
                    onCancel={() => {
                        setDeckToShare(null);
                        setCardToShare(null);
                        setIsLoading(false);
                    }}
                    isLoading={isLoading}
                />
             )}
             {xpToastInfo && <XpGainToast amount={xpToastInfo.amount} key={xpToastInfo.id} />}
             <OnboardingTour
                isActive={isOnboarding}
                steps={mainTourSteps}
                currentStepIndex={onboardingStep}
                onNext={() => setOnboardingStep(s => s + 1)}
                onPrev={() => setOnboardingStep(s => s - 1)}
                onEnd={() => {
                    localStorage.setItem('gaku-onboarding-complete', 'true');
                    setIsOnboarding(false);
                }}
             />
             <OnboardingTour
                isActive={isReviewOnboarding}
                steps={reviewTourSteps}
                currentStepIndex={reviewOnboardingStep}
                onNext={() => setReviewOnboardingStep(s => s + 1)}
                onPrev={() => setReviewOnboardingStep(s => s - 1)}
                onEnd={() => {
                    localStorage.setItem('gaku-review-onboarding-complete', 'true');
                    setIsReviewOnboarding(false);
                    if (viewBeforeTutorial !== 'review') {
                        handleNavigate(viewBeforeTutorial);
                    }
                }}
                options={{
                    isCardFlipped: isFlipped,
                    onFlipCard: () => setIsFlipped(f => !f),
                }}
             />
        </>
    );
};
