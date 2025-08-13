import React, { useState, useMemo, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// --- ICONS (SVG as React Components) ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const CloudUploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V12"/><path d="m7 9 5-5 5 5"/><path d="M12 4v12"/></svg>;
const CloudDownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V12"/><path d="m7 15 5 5 5-5"/><path d="M12 4v16"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20Z"/><path d="M2 12h20"/></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const Share2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>;
const ArrowRightLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l-4-4 4-4"/><path d="M7 13h10"/><path d="M13 7l4 4-4 4"/></svg>;


// --- GA & ANALYTICS ---
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer: any[];
    }
}

const trackEvent = (action: string, params?: { [key: string]: any }) => {
    if (window.gtag) {
        window.gtag('event', action, params);
    } else {
        // This might be noisy if GA is blocked by an ad blocker.
        // console.warn(`GA not initialized, but tried to track event: ${action}`);
    }
};

// --- INTERFaces, TYPES & CONSTANTS ---
interface Card {
  id: number;
  front: string;
  back: string;
  category: string;
  // SRS properties (SuperMemo 2)
  repetitions: number;      // n: Number of correct repetitions in a row.
  easinessFactor: number;   // EF: How "easy" the card is, starts at 2.5.
  interval: number;         // I(n): Number of days for the next review.
  dueDate: string;
}
type View = 'review' | 'add' | 'decks' | 'settings' | 'stats' | 'community' | 'bulk-add';
type NotificationPermissionStatus = NotificationPermission | 'unsupported';
type Theme = 'light' | 'dark';
type FeedbackType = 'again' | 'good' | 'easy';
type DeckInfo = { name: string; count: number; };
interface StudyDay { date: string; reviewed: number; correct: number; }
interface PublicDeck { id?: number; name: string; cardCount: number; description: string; author: string; downloads: number; }
type PublicCard = Omit<Card, 'id' | 'category' | 'repetitions' | 'easinessFactor' | 'interval' | 'dueDate'>;


interface ReviewSettings {
  order: 'default' | 'random' | 'newestFirst';
  dailyLimit: number;
}

interface ModalConfig {
  type: 'confirm' | 'prompt';
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: (inputValue?: string) => void;
  onCancel?: () => void;
  initialValue?: string;
}

// --- COMMUNITY BACKEND API ---
// This will make calls to your Netlify Functions, which will in turn
// communicate with your Supabase database.
const communityApi = {
  getPublicDecks: async (): Promise<PublicDeck[]> => {
    try {
      const response = await fetch('/.netlify/functions/get-public-decks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.sort((a: PublicDeck, b: PublicDeck) => b.downloads - a.downloads);
    } catch (error) {
      console.error("Error fetching public decks:", error);
      return [];
    }
  },

  getDeckCards: async (deckName: string): Promise<PublicCard[]> => {
     try {
        const response = await fetch(`/.netlify/functions/download-deck?name=${encodeURIComponent(deckName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
     } catch (error) {
        console.error(`Error fetching cards for deck ${deckName}:`, error);
        return [];
     }
  },

  checkDeckExists: async (deckName: string): Promise<boolean> => {
    try {
        const response = await fetch(`/.netlify/functions/check-deck-exists?name=${encodeURIComponent(deckName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error(`Error checking if deck ${deckName} exists:`, error);
        return true; // Fail safe: assume it exists to prevent accidental uploads.
    }
  },

  uploadDeck: async (deckData: Omit<PublicDeck, 'cardCount' | 'downloads'>, cards: Card[]): Promise<{success: boolean, message?: string}> => {
     try {
        const response = await fetch('/.netlify/functions/upload-deck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                deck: deckData, 
                cards: cards.map(c => ({ front: c.front, back: c.back })) 
            }),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
        }
        return { success: true };
     } catch (error) {
        console.error(`Error uploading deck ${deckData.name}:`, error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
     }
  },
};

// --- DATABASE HOOKS (using local storage) ---
const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- UTILITY FUNCTIONS ---
const getTodaysDateString = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
};

const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const calculateAffinity = (card: Card) => {
    if (card.repetitions > 5 || card.interval > 30) return 'high';
    if (card.repetitions > 2 || card.interval > 7) return 'mid';
    return 'low';
};


// --- UI COMPONENTS ---

const Loader = ({ small = false, className = '' }: { small?: boolean; className?: string }) => (
  <div className={`loader ${small ? 'small' : ''} ${className}`} />
);

const IconButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, className, ...props }, ref) => (
    <button ref={ref} className={`icon-btn ${className}`} {...props}>
      {children}
    </button>
  )
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'destructive' | 'cancel' | 'link' }>(
  ({ children, className, variant = 'primary', ...props }, ref) => {
    const variantClasses = {
      primary: '',
      outline: 'btn-outline',
      destructive: 'btn-destructive',
      cancel: 'btn-cancel',
      link: 'btn-link',
    };
    return (
      <button ref={ref} className={`btn ${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);


const Modal = ({ config, closeModal }: { config: ModalConfig, closeModal: () => void }) => {
    const [inputValue, setInputValue] = useState(config.initialValue || '');
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'Enter' && config.type !== 'prompt') {
                confirmButtonRef.current?.click();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal, config.type]);

    const handleConfirm = () => {
        config.onConfirm(inputValue);
        closeModal();
    };

    const handleCancel = () => {
        if (config.onCancel) config.onCancel();
        closeModal();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="custom-dialog-content" onClick={(e) => e.stopPropagation()}>
                <h3>{config.title}</h3>
                <div className="custom-dialog-message">{config.message}</div>
                {config.type === 'prompt' && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />
                )}
                <div className="dialog-actions">
                    <Button variant="cancel" onClick={handleCancel}>
                        {config.cancelText || 'Cancelar'}
                    </Button>
                    <Button
                        ref={confirmButtonRef}
                        variant={config.isDestructive ? 'destructive' : 'primary'}
                        onClick={handleConfirm}
                    >
                        {config.confirmText || 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- FLASHCARD COMPONENT ---
interface FlashcardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  onFeedback?: (type: FeedbackType) => void;
  mode?: 'review' | 'practice';
}

const Flashcard = ({ frontContent, backContent, isFlipped, onFlip, onFeedback, mode = 'review' }: FlashcardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontContentRef = useRef<HTMLDivElement>(null);
  const backContentRef = useRef<HTMLDivElement>(null);
  const [frontTextSize, setFrontTextSize] = useState('text-size-medium');
  const [backTextSize, setBackTextSize] = useState('text-size-medium');
  const [showFrontScroll, setShowFrontScroll] = useState(false);
  const [showBackScroll, setShowBackScroll] = useState(false);

  // Swipe gesture state
  const swipeStartX = useRef(0);
  const swipeCurrentX = useRef(0);
  const isSwiping = useRef(false);
  const swipeThreshold = 50; // pixels

  // Tap vs Swipe state
  const touchStartTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const tapThreshold = 10; // pixels
  const tapTimeThreshold = 200; // ms

  const adjustTextSize = (ref: React.RefObject<HTMLDivElement>, setTextSize: (size: string) => void) => {
    const el = ref.current;
    if (!el) return;
    const contentLength = el.textContent?.length || 0;
    if (contentLength <= 20) setTextSize('text-size-large');
    else if (contentLength <= 100) setTextSize('text-size-medium');
    else setTextSize('text-size-small');
  };
  
  const checkScroll = (ref: React.RefObject<HTMLDivElement>, setShowScroll: (show: boolean) => void) => {
    const el = ref.current;
    if (el) {
        setShowScroll(el.scrollHeight > el.clientHeight);
    }
  };

  useLayoutEffect(() => {
    adjustTextSize(frontContentRef, setFrontTextSize);
    adjustTextSize(backContentRef, setBackTextSize);
    checkScroll(frontContentRef, setShowFrontScroll);
    checkScroll(backContentRef, setShowBackScroll);
  }, [frontContent, backContent]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTime.current = Date.now();
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    
    if ((mode === 'review' && isFlipped) || mode === 'practice') {
      swipeStartX.current = e.touches[0].clientX;
      swipeCurrentX.current = e.touches[0].clientX;
      isSwiping.current = true;
      if (containerRef.current) {
        containerRef.current.classList.add('is-swiping');
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    swipeCurrentX.current = e.touches[0].clientX;
    const diff = swipeCurrentX.current - swipeStartX.current;

    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const touchEndTime = Date.now();
    const movedX = Math.abs(touchStartPos.current.x - swipeCurrentX.current);
    const movedY = Math.abs(touchStartPos.current.y - (isSwiping.current ? swipeCurrentX.current : touchStartPos.current.y));

    if (touchEndTime - touchStartTime.current < tapTimeThreshold && movedX < tapThreshold && movedY < tapThreshold) {
      onFlip(); // It's a tap
      if (isSwiping.current) {
         resetSwipe();
      }
      return;
    }

    if (!isSwiping.current) return;

    const diff = swipeCurrentX.current - swipeStartX.current;

    if (onFeedback && Math.abs(diff) > swipeThreshold) {
      if (diff < 0) onFeedback('again'); // Swipe left
      else onFeedback('good');           // Swipe right
    } else {
      resetSwipe();
    }
    
    isSwiping.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      // Ignore if it's a touch device
      if ('ontouchstart' in window) return;

      touchStartTime.current = Date.now();
      touchStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
      // Ignore if it's a touch device
      if ('ontouchstart' in window) return;

      const touchEndTime = Date.now();
      const movedX = Math.abs(touchStartPos.current.x - e.clientX);
      const movedY = Math.abs(touchStartPos.current.y - e.clientY);

      if (touchEndTime - touchStartTime.current < tapTimeThreshold && movedX < tapThreshold && movedY < tapThreshold) {
          onFlip();
      }
  };

  const resetSwipe = () => {
    if (containerRef.current) {
      containerRef.current.classList.remove('is-swiping');
      containerRef.current.style.transform = 'translateX(0)';
    }
  };

  useEffect(() => {
    if (!isFlipped && mode === 'review') {
        resetSwipe();
    }
  }, [isFlipped, mode]);


  return (
    <div
      className="flashcard-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <div ref={frontContentRef} className={`${frontTextSize} ${showFrontScroll ? 'has-scroll-indicator' : ''}`}>
            {frontContent}
          </div>
        </div>
        <div className="flashcard-face flashcard-back">
          <div ref={backContentRef} className={`${backTextSize} ${showBackScroll ? 'has-scroll-indicator' : ''}`}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- VIEWS ---

const WelcomeEmptyState = ({ onCreateDeck }: { onCreateDeck: () => void }) => (
    <div className="empty-state-container">
        <ListIcon />
        <h3>Bem-vindo ao Gaku!</h3>
        <p>Parece que você ainda não tem baralhos. Crie um para começar a adicionar seus flashcards e iniciar seus estudos.</p>
        <Button onClick={onCreateDeck}>
            <PlusIcon />
            Criar Meu Primeiro Baralho
        </Button>
    </div>
);


const SessionComplete = ({ onSeeDecks, onAddCards }: { onSeeDecks: () => void, onAddCards: () => void }) => {
    return (
      <div className="session-complete">
        <h2>Parabéns!</h2>
        <p>Você revisou todas as cartas por hoje.</p>
        <div className="session-complete-actions">
          <Button onClick={onSeeDecks}><ListIcon /> Ver Baralhos</Button>
          <Button onClick={onAddCards} variant="outline"><PlusIcon /> Adicionar Cartas</Button>
        </div>
      </div>
    );
};

const ReviewView = ({ cards, onFeedback, onSessionComplete, onCreateDeck, decksExist }: { cards: Card[], onFeedback: (card: Card, feedback: FeedbackType) => void, onSessionComplete: () => void, onCreateDeck: () => void, decksExist: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedbackAnimation, setFeedbackAnimation] = useState('');
  const [feedbackIcon, setFeedbackIcon] = useState<React.ReactNode>(null);

  const currentCard = cards[currentIndex];

  useEffect(() => {
      if (cards.length > 0 && currentIndex >= cards.length) {
          onSessionComplete();
      }
  }, [currentIndex, cards.length, onSessionComplete]);
  
  if (!decksExist) {
    return <WelcomeEmptyState onCreateDeck={onCreateDeck} />;
  }

  if (!currentCard) {
    return <SessionComplete onSeeDecks={onSessionComplete} onAddCards={onCreateDeck} />;
  }
  
  const handleFeedback = (type: FeedbackType) => {
    if (!isFlipped) return;
    
    let animationClass = '';
    let icon = null;
    if (type === 'again') {
        animationClass = 'feedback-again';
        icon = <XIcon />;
    } else if (type === 'good') {
        animationClass = 'feedback-good';
        icon = <CheckIcon />;
    } else {
        animationClass = 'feedback-easy';
        icon = <StarIcon />;
    }
    setFeedbackAnimation(animationClass);
    setFeedbackIcon(icon);
    
    setTimeout(() => {
      onFeedback(currentCard, type);
      setIsFlipped(false);
      setFeedbackAnimation('');
      setFeedbackIcon(null);
      // Only advance if it wasn't 'again'
      if (type !== 'again') {
          setCurrentIndex(i => i + 1);
      } else {
          // Move 'again' card to the back of the review queue (simple approach)
          // A more robust implementation might re-insert it a few cards away.
      }
    }, 600);
  };
  
  const handleFlip = () => {
    trackEvent('flip_card', {
        type: 'review',
        direction: isFlipped ? 'back_to_front' : 'front_to_back',
        card_id: currentCard.id
    });
    setIsFlipped(!isFlipped);
  }

  return (
    <div className="review-view">
      <div className={`feedback-wrapper ${feedbackAnimation}`}>
        <div className="feedback-icon-overlay">{feedbackIcon}</div>
        <Flashcard
          frontContent={currentCard.front}
          backContent={currentCard.back}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onFeedback={handleFeedback}
          mode="review"
        />
      </div>

      <div className="controls">
        <div className="progress">{currentIndex + 1} / {cards.length}</div>
        {isFlipped ? (
          <div className="srs-buttons">
            <Button className="srs-btn srs-again" onClick={() => handleFeedback('again')}>Errei</Button>
            <Button className="srs-btn srs-good" onClick={() => handleFeedback('good')}>OK</Button>
            <Button className="srs-btn srs-easy" onClick={() => handleFeedback('easy')}>Fácil</Button>
          </div>
        ) : (
          <Button onClick={handleFlip}>Mostrar Resposta</Button>
        )}
      </div>
    </div>
  );
};

const AddCardView = ({ onSave, decks, initialDeck, onBulkAdd, onBack }: { onSave: (card: Card) => void; decks: DeckInfo[], initialDeck: string | null; onBulkAdd: (deckName: string) => void, onBack: () => void; }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [category, setCategory] = useState(initialDeck || (decks[0]?.name || ''));
    const [newCategory, setNewCategory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCategory = category === '__new__' ? newCategory.trim() : category;
        if (!front.trim() || !back.trim() || !finalCategory) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const newCard: Card = {
            id: Date.now(),
            front: front.trim(),
            back: back.trim(),
            category: finalCategory,
            repetitions: 0,
            easinessFactor: 2.5,
            interval: 0,
            dueDate: getTodaysDateString(),
        };
        onSave(newCard);
        setFront('');
        setBack('');
        // Focus front for next card
        document.getElementById('front-input')?.focus();
    };

    return (
        <div className="add-card-view">
            <div className="add-card-view-header">
              <h2>Adicionar Cartão</h2>
              <Button variant="link" onClick={() => onBulkAdd(category)}>
                Adicionar em Massa
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="add-card-form">
                <div className="form-group">
                    <label htmlFor="front-input">Frente</label>
                    <textarea id="front-input" value={front} onChange={e => setFront(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="back-input">Verso</label>
                    <textarea id="back-input" value={back} onChange={e => setBack(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="category-select">Baralho</label>
                    <select id="category-select" value={category} onChange={e => setCategory(e.target.value)}>
                        {decks.map(deck => <option key={deck.name} value={deck.name}>{deck.name}</option>)}
                        <option value="__new__">-- Novo Baralho --</option>
                    </select>
                </div>
                {category === '__new__' && (
                    <div className="form-group">
                        <label htmlFor="new-category-input">Nome do Novo Baralho</label>
                        <input
                            id="new-category-input"
                            type="text"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            required
                        />
                    </div>
                )}
                <Button type="submit">
                  <PlusIcon/> Salvar Cartão
                </Button>
            </form>
        </div>
    );
};

const DecksView = ({ cards, decks, onSaveCard, onDeleteCard, onSaveDeck, onDeleteDeck, onRenameDeck, onMoveCard, onBulkAdd, onPractice, onShareDeck }) => {
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [viewingDeck, setViewingDeck] = useState<string | null>(null);
    const [practiceMode, setPracticeMode] = useState(false);
    
    const [itemToDelete, setItemToDelete] = useState<{ type: 'card' | 'deck', id: number | string } | null>(null);

    const handleViewDeck = (deckName: string) => {
        trackEvent('view_deck', { deck_name: deckName });
        setViewingDeck(deckName);
    };

    const handleBackToDecks = () => {
        trackEvent('navigate', { to_view: 'deck_list', from_view: 'card_list' });
        setViewingDeck(null);
        setPracticeMode(false);
    };

    const handleSaveCardAndCloseModal = (card: Card) => {
        onSaveCard(card);
        setEditingCard(null);
    };

    const handleDeleteWithAnimation = (type: 'card' | 'deck', id: number | string) => {
        setItemToDelete({ type, id });
        setTimeout(() => {
            if (type === 'card') onDeleteCard(id as number);
            else if (type === 'deck') onDeleteDeck(id as string);
            setItemToDelete(null);
        }, 500);
    };
    
    const startPracticeMode = () => {
        if(viewingDeck) {
            trackEvent('start_practice', { deck_name: viewingDeck });
            setPracticeMode(true);
        }
    };
    
    if (practiceMode && viewingDeck) {
        const practiceCards = cards.filter(c => c.category === viewingDeck);
        return <PracticeView
            cards={practiceCards}
            deckName={viewingDeck}
            onExit={() => setPracticeMode(false)}
        />
    }

    if (viewingDeck) {
        return <DeckCardListView
            deckName={viewingDeck}
            cards={cards.filter(c => c.category === viewingDeck)}
            onBack={handleBackToDecks}
            onEditCard={setEditingCard}
            onDeleteCard={(id) => handleDeleteWithAnimation('card', id)}
            onMoveCard={onMoveCard}
            itemToDelete={itemToDelete?.type === 'card' ? itemToDelete.id : null}
            onPractice={startPracticeMode}
            onBulkAdd={onBulkAdd}
        />
    }

    return (
        <div className="decks-view">
            <div className="decks-view-header">
                <h2>Meus Baralhos</h2>
                <Button className="btn-add-deck" variant="link" onClick={() => onSaveDeck('')}>
                    <PlusIcon /> Novo Baralho
                </Button>
            </div>
            {decks.length > 0 ? (
                <ul className="deck-list">
                    {decks.map(deck => (
                        <li key={deck.name} className={`deck-list-item ${itemToDelete?.id === deck.name ? 'is-deleting' : ''}`}>
                            <button className="deck-item-main" onClick={() => handleViewDeck(deck.name)}>
                                <span className="deck-name">{deck.name}</span>
                                <span className="deck-card-count">{deck.count} carta{deck.count !== 1 ? 's' : ''}</span>
                            </button>
                            <div className="deck-item-actions">
                               <IconButton className="share" title="Compartilhar Baralho" onClick={() => onShareDeck(deck)} disabled={deck.count === 0}>
                                    <Share2Icon />
                                </IconButton>
                                <IconButton className="rename" title="Renomear Baralho" onClick={() => onRenameDeck(deck.name)}>
                                    <PencilIcon />
                                </IconButton>
                                <IconButton className="delete" title="Excluir Baralho" onClick={() => handleDeleteWithAnimation('deck', deck.name)}>
                                    <TrashIcon />
                                </IconButton>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                 <div className="empty-deck-message">
                    <span>Você ainda não tem baralhos.</span>
                 </div>
            )}
            
            {editingCard && <EditCardModal card={editingCard} decks={decks} onSave={handleSaveCardAndCloseModal} onCancel={() => setEditingCard(null)} />}
        </div>
    );
};

const DeckCardListView = ({ deckName, cards, onBack, onEditCard, onDeleteCard, onMoveCard, itemToDelete, onPractice, onBulkAdd }) => {
    const [newlyAddedCardId, setNewlyAddedCardId] = useState<number | null>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const latestCard = cards.reduce((latest, card) => (!latest || card.id > latest.id) ? card : latest, null as Card | null);
        if (latestCard && latestCard.id !== newlyAddedCardId && !cards.find(c => c.id === newlyAddedCardId)) {
            setNewlyAddedCardId(latestCard.id);
            listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

            const timer = setTimeout(() => {
                setNewlyAddedCardId(null);
            }, 2000); // Animation duration is 1.5s
            return () => clearTimeout(timer);
        }
    }, [cards]);

    return (
        <div className="deck-card-list-view">
            <div className="deck-card-list-header">
                <IconButton className="back-btn" onClick={onBack} title="Voltar para os Baralhos">
                    <ArrowLeftIcon />
                </IconButton>
                <div className="deck-card-list-title">
                    <h2 title={deckName}>{deckName}</h2>
                </div>
                <div className="deck-card-list-actions">
                     <Button variant="link" onClick={() => onBulkAdd(deckName)}>
                       <PlusIcon /> Em Massa
                    </Button>
                    <Button className="btn-practice" onClick={onPractice} disabled={cards.length === 0}>
                        <PlayIcon /> Praticar
                    </Button>
                </div>
            </div>
            {cards.length > 0 ? (
                <ul className="all-cards-list" ref={listRef}>
                    {cards.sort((a,b) => b.id - a.id).map(card => (
                        <li key={card.id} className={`card-list-item affinity-${calculateAffinity(card)} ${itemToDelete === card.id ? 'is-deleting' : ''} ${newlyAddedCardId === card.id ? 'new-card-animation' : ''}`}>
                            <div className="card-list-text">
                                <span className="card-list-front">{card.front}</span>
                                <span className="card-list-back">{card.back}</span>
                            </div>
                            <div className="card-list-actions">
                                <IconButton className="move" title="Mover para outro baralho" onClick={() => onMoveCard(card.id)}>
                                    <ArrowRightLeftIcon />
                                </IconButton>
                                <IconButton className="edit-card-btn" title="Editar Cartão" onClick={() => onEditCard(card)}>
                                    <PencilIcon />
                                </IconButton>
                                <IconButton className="edit-card-btn delete" title="Excluir Cartão" onClick={() => onDeleteCard(card.id)}>
                                    <TrashIcon />
                                </IconButton>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty-deck-message">
                    <p>Este baralho está vazio.</p>
                    <p>Adicione alguns cartões para começar a praticar!</p>
                </div>
            )}
        </div>
    );
};

const PracticeView = ({ cards, deckName, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const currentCard = cards[currentIndex];

    const handleNav = (direction: 'next' | 'prev') => {
        trackEvent('practice_navigate', { direction, deck_name: deckName });
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= cards.length) newIndex = 0;
        if (newIndex < 0) newIndex = cards.length - 1;
        setCurrentIndex(newIndex);
        setIsFlipped(false);
    };
    
    const handleFlip = () => {
        trackEvent('flip_card', {
            type: 'practice',
            direction: isFlipped ? 'back_to_front' : 'front_to_back',
            card_id: currentCard.id
        });
        setIsFlipped(f => !f);
    }
    
    if (!currentCard) {
        return (
            <div className="practice-view">
                 <div className="practice-header">
                    <IconButton className="back-btn" onClick={onExit} title="Sair do modo de prática">
                        <XIcon />
                    </IconButton>
                    <h3>Praticar: {deckName}</h3>
                </div>
                <div className="empty-deck-message">
                    <p>Não há cartões para praticar neste baralho.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="practice-view">
            <div className="practice-header">
                 <IconButton className="back-btn" onClick={onExit} title="Sair do modo de prática">
                    <XIcon />
                 </IconButton>
                 <h3>Praticar: {deckName}</h3>
                 <div className="progress">{currentIndex + 1}/{cards.length}</div>
            </div>
            <Flashcard
                frontContent={currentCard.front}
                backContent={currentCard.back}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                mode="practice"
            />
            <div className="practice-controls">
                <IconButton onClick={() => handleNav('prev')} title="Cartão Anterior">
                    <ArrowLeftIcon />
                </IconButton>
                <Button onClick={handleFlip}>
                    {isFlipped ? 'Ocultar Resposta' : 'Mostrar Resposta'}
                </Button>
                <IconButton onClick={() => handleNav('next')} title="Próximo Cartão">
                    <ArrowRightIcon />
                </IconButton>
            </div>
        </div>
    );
};


const EditCardModal = ({ card, decks, onSave, onCancel }) => {
    const [front, setFront] = useState(card.front);
    const [back, setBack] = useState(card.back);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...card, front, back });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="edit-card-form" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Cartão</h2>
                    <div className="form-group">
                        <label htmlFor="edit-front">Frente</label>
                        <textarea id="edit-front" value={front} onChange={e => setFront(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-back">Verso</label>
                        <textarea id="edit-back" value={back} onChange={e => setBack(e.target.value)} required />
                    </div>
                    <div className="dialog-actions">
                        <Button variant="cancel" type="button" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BulkAddView = ({ deckName, onSave, onBack }) => {
    const [text, setText] = useState('');

    const handleSave = () => {
        trackEvent('bulk_add_cards', { deck_name: deckName, line_count: text.split('\n').length });
        onSave(deckName, text);
        onBack();
    };

    return (
        <div className="settings-view">
            <div className="deck-card-list-header">
                <IconButton className="back-btn" onClick={onBack} title="Voltar">
                    <ArrowLeftIcon />
                </IconButton>
                <h2>Adicionar em Massa em "{deckName}"</h2>
            </div>
            <div className="settings-section">
                <div className="form-instructions">
                    <p>Digite ou cole seus cartões aqui. Cada linha representa um cartão.</p>
                    <p>Use um <strong>ponto e vírgula (;)</strong> ou <strong>tab</strong> para separar a frente do verso.</p>
                    <p>Exemplo: <code>ありがとう;Obrigado</code></p>
                </div>
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={'こんにちは;Olá\nさようなら;Adeus'}
                    rows={15}
                />
                <Button onClick={handleSave} disabled={!text.trim()}>
                    <PlusIcon /> Adicionar Cartões
                </Button>
            </div>
        </div>
    );
};

const SettingsView = ({ settings, onSaveSettings, onExport, onRestore, onResetApp, onShowTour, theme, onThemeChange }) => {
    const [restoreCode, setRestoreCode] = useState('');
    const [isRestoring, setIsRestoring] = useState(false);
    
    const handleRestoreClick = () => {
        if (!isRestoring) {
            setIsRestoring(true);
            return;
        }
        onRestore(restoreCode);
        setIsRestoring(false);
        setRestoreCode('');
    };
    
    return (
        <div className="settings-view">
             <h2>Ajustes</h2>
            <div className="settings-section">
                <h3><SettingsIcon /> Geral</h3>
                <div className="form-group">
                    <label>Tema</label>
                    <div className="theme-toggle" style={{ display: 'flex', gap: '10px' }}>
                        <Button variant={theme === 'light' ? 'primary' : 'cancel'} onClick={() => onThemeChange('light')}>Claro</Button>
                        <Button variant={theme === 'dark' ? 'primary' : 'cancel'} onClick={() => onThemeChange('dark')}>Escuro</Button>
                    </div>
                </div>
                <Button onClick={onShowTour} variant="link" style={{ alignSelf: 'flex-start' }}>Mostrar tour de introdução</Button>
            </div>
            
            <div className="settings-section">
                <h3><EyeIcon /> Revisão</h3>
                <div className="form-group">
                    <label htmlFor="review-order">Ordem das revisões</label>
                    <select
                        id="review-order"
                        className="settings-select"
                        value={settings.order}
                        onChange={(e) => onSaveSettings({ ...settings, order: e.target.value as ReviewSettings['order'] })}
                    >
                        <option value="default">Padrão (SRS)</option>
                        <option value="random">Aleatória</option>
                        <option value="newestFirst">Mais novos primeiro</option>
                    </select>
                </div>
                 <div className="form-group">
                    <label htmlFor="daily-limit">Limite diário de revisões</label>
                    <input
                        id="daily-limit"
                        type="number"
                        className="settings-input"
                        value={settings.dailyLimit}
                        onChange={(e) => onSaveSettings({ ...settings, dailyLimit: parseInt(e.target.value, 10) || 0 })}
                        min="0"
                    />
                    <small>Defina como 0 para sem limite.</small>
                </div>
            </div>

            <div className="settings-section">
                <h3><CloudUploadIcon /> Backup & Restauração</h3>
                 <p>
                    Exporte seus dados para um arquivo de texto para backup ou para movê-los para outro dispositivo.
                    Cole os dados de um backup para restaurar.
                </p>
                <div className="backup-actions">
                    <Button onClick={onExport}><CloudDownloadIcon /> Exportar Dados</Button>
                    <Button onClick={handleRestoreClick} variant="outline">
                        <CloudUploadIcon /> {isRestoring ? "Confirmar Restauração" : "Restaurar Dados"}
                    </Button>
                </div>
                {isRestoring && (
                    <div className="code-display-area">
                         <label htmlFor="restore-code" className="restore-title">Cole seu código de backup aqui:</label>
                        <textarea
                            id="restore-code"
                            value={restoreCode}
                            onChange={(e) => setRestoreCode(e.target.value)}
                            placeholder="Cole o código de backup aqui..."
                        />
                    </div>
                )}
            </div>

            <div className="settings-section">
                 <h3><TrashIcon /> Zona de Perigo</h3>
                 <p>Esta ação não pode ser desfeita. Todos os seus baralhos e progresso de estudo serão perdidos permanentemente.</p>
                 <Button onClick={onResetApp} variant="destructive">
                     <TrashIcon/> Apagar Todos os Dados
                 </Button>
            </div>
        </div>
    );
};

const StatsView = ({ cards, studyHistory }) => {
    const stats = useMemo(() => {
        const now = new Date();
        const todayStr = getTodaysDateString();
        
        const matureThreshold = 21; // days
        
        const totalCards = cards.length;
        const dueToday = cards.filter(c => c.dueDate <= todayStr).length;
        const newCards = cards.filter(c => c.repetitions === 0).length;
        const learning = cards.filter(c => c.repetitions > 0 && c.interval < matureThreshold).length;
        const mature = cards.filter(c => c.interval >= matureThreshold).length;

        const totalReviews = studyHistory.reduce((sum, day) => sum + day.reviewed, 0);
        const correctReviews = studyHistory.reduce((sum, day) => sum + day.correct, 0);
        const accuracy = totalReviews > 0 ? ((correctReviews / totalReviews) * 100).toFixed(0) : '0';

        return { totalCards, dueToday, newCards, learning, mature, accuracy, totalReviews };
    }, [cards, studyHistory]);
    
    const masteryData = [
        { label: 'Novos', value: stats.newCards, className: 'new' },
        { label: 'Aprendendo', value: stats.learning, className: 'learning' },
        { label: 'Maduros', value: stats.mature, className: 'mature' },
    ];
    
    if (cards.length === 0) {
        return (
             <div className="empty-state-container">
                <BarChartIcon />
                <h3>Estatísticas</h3>
                <p>Nenhum dado para mostrar ainda. Comece a estudar para ver seu progresso aqui!</p>
            </div>
        );
    }

    return (
        <div className="stats-view">
            <h2>Estatísticas</h2>
            <div className="stats-cards-container">
                <div className="stat-card">
                    <div className="stat-value">{stats.totalCards}</div>
                    <div className="stat-label">Total de Cartas</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.dueToday}</div>
                    <div className="stat-label">Para Hoje</div>
                </div>
                 <div className="stat-card">
                    <div className="stat-value">{stats.accuracy}<small>%</small></div>
                    <div className="stat-label">Precisão</div>
                </div>
            </div>
            
            <div className="mastery-chart-container">
                <h3>Maestria dos Cartões</h3>
                <div className="mastery-chart">
                    {masteryData.map(item => (
                        <div key={item.label} className="chart-bar-container">
                             <div className="chart-bar-value">{item.value}</div>
                            <div
                                className={`chart-bar ${item.className}`}
                                style={{ height: `${stats.totalCards > 0 ? (item.value / stats.totalCards) * 100 : 0}%` }}
                                title={`${item.label}: ${item.value}`}
                            />
                            <div className="chart-bar-label">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <ActivityHistoryChart studyHistory={studyHistory} />
        </div>
    );
};

const ActivityHistoryChart = ({ studyHistory }) => {
    const chartData = useMemo(() => {
        const data = new Map<string, number>();
        studyHistory.forEach(day => {
            data.set(day.date, day.reviewed);
        });

        const result = [];
        let date = new Date();
        date.setDate(date.getDate() - 89); // ~3 months of history

        for (let i = 0; i < 90; i++) {
            const dateStr = date.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                value: data.get(dateStr) || 0,
                dateObj: new Date(date)
            });
            date.setDate(date.getDate() + 1);
        }
        return result;
    }, [studyHistory]);

    const maxValue = Math.max(...chartData.map(d => d.value), 1); // Avoid division by zero
    
    return (
        <div className="activity-chart-container">
            <h3><CalendarIcon /> Histórico de Atividade (Últimos 90 dias)</h3>
            <div className="activity-chart">
                {chartData.map(({ date, value, dateObj }) => {
                    const height = (value / maxValue) * 100;
                    const dayOfMonth = dateObj.getDate();
                    const isFirstOfMonth = dayOfMonth === 1;
                    const isSunday = dateObj.getDay() === 0;

                    let label = '';
                    if (isFirstOfMonth) {
                        label = dateObj.toLocaleDateString('default', { month: 'short' });
                    } else if (isSunday) {
                        label = String(dayOfMonth);
                    }
                    
                    return (
                        <div key={date} className="activity-bar-wrapper" title={`${value} revisões em ${dateObj.toLocaleDateString()}`}>
                            <div className="activity-bar-value">{value}</div>
                            <div className={`activity-bar ${value > 0 ? 'significant-day' : ''}`} style={{ height: `${height}%` }}></div>
                             {label && <div className={`activity-bar-label ${isFirstOfMonth ? 'is-month' : ''}`}>{label}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CommunityView = ({ localDecks, onDownloadDeck, navigateTo }) => {
    const [publicDecks, setPublicDecks] = useState<PublicDeck[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        trackEvent('view_community_page');
        const fetchDecks = async () => {
            try {
                setLoading(true);
                const decks = await communityApi.getPublicDecks();
                setPublicDecks(decks);
            } catch (err) {
                setError('Não foi possível carregar os baralhos da comunidade. Tente novamente mais tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDecks();
    }, []);

    const isDeckOwned = (deckName: string) => {
        return localDecks.some(d => d.name === deckName);
    };

    if (loading) {
        return (
            <div className="settings-view">
                <h2>Comunidade</h2>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Loader />
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="settings-view"><h2>Comunidade</h2><p>{error}</p></div>;
    }

    return (
        <div className="decks-view">
            <h2>Comunidade</h2>
            {publicDecks.length > 0 ? (
                <ul className="deck-list">
                    {publicDecks.map(deck => (
                        <li key={deck.id || deck.name} className="deck-list-item">
                           <div className="deck-item-main" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', cursor: 'default' }}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                    <span className="deck-name">{deck.name}</span>
                                    <span className="deck-card-count">{deck.cardCount} cartas</span>
                                </div>
                                <p style={{fontSize: '0.9rem', color: 'var(--secondary-text-color)', margin: 0}}>{deck.description}</p>
                                <div className="deck-metadata">
                                    <span>por: <em>{deck.author || 'Anônimo'}</em></span>
                                    <div className="download-count">
                                        <DownloadIcon /> {deck.downloads}
                                    </div>
                                </div>
                            </div>

                            <div className="deck-item-actions">
                               {isDeckOwned(deck.name) ? (
                                    <IconButton className="owned" title="Você já possui este baralho" disabled>
                                        <CheckCircleIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton className="download" title="Baixar Baralho" onClick={() => onDownloadDeck(deck)}>
                                        <CloudDownloadIcon />
                                    </IconButton>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty-deck-message">
                    <span>Ainda não há baralhos na comunidade.</span>
                </div>
            )}
             <div className="community-footer">
                <p>Quer compartilhar seu próprio baralho? Vá para a tela 'Baralhos' e clique no ícone de compartilhamento!</p>
            </div>
        </div>
    );
};


const OnboardingTour = ({ steps, currentStepIndex, onNext, onPrev, onEnd }) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [arrowClass, setArrowClass] = useState('top-arrow');
    const [arrowPos, setArrowPos] = useState({ top: '50%', left: '50%' });

    const step = steps[currentStepIndex];

    useEffect(() => {
        if (!step) return;

        const targetEl = document.querySelector(step.target);
        if (!targetEl) {
            console.warn(`Onboarding target not found: ${step.target}`);
            // Maybe skip to next step or end tour if target is essential
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        setTargetRect(rect);

        const tooltipEl = document.querySelector('.onboarding-tooltip') as HTMLElement;
        if (!tooltipEl) return;
        
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const gap = 15; // Gap between element and tooltip
        const margin = 10; // Margin from viewport edges

        let top = 0, left = 0;
        let arrow = 'top-arrow';
        let arrowTop = '50%', arrowLeft = '50%';
        
        // Default position: below the element
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        arrow = 'top-arrow';
        arrowLeft = `${tooltipRect.width / 2}px`;

        // If it goes off the bottom, position it above
        if (top + tooltipRect.height > window.innerHeight - margin) {
            top = rect.top - tooltipRect.height - gap;
            arrow = 'bottom-arrow';
        }
        
        // Adjust horizontal position
        if (left < margin) {
            left = margin;
        } else if (left + tooltipRect.width > window.innerWidth - margin) {
            left = window.innerWidth - tooltipRect.width - margin;
        }
        
        // Adjust arrow position after tooltip is placed
        const arrowOffset = rect.left + rect.width / 2 - left;
        arrowLeft = `${Math.max(15, Math.min(arrowOffset, tooltipRect.width - 15))}px`;

        setTooltipPos({ top, left });
        setArrowClass(arrow);
        setArrowPos({ top: arrowTop, left: arrowLeft });

    }, [step, currentStepIndex]);

    if (!step || !targetRect) return null;
    
    const holeStyle = {
        top: `${targetRect.top - 5}px`,
        left: `${targetRect.left - 5}px`,
        width: `${targetRect.width + 10}px`,
        height: `${targetRect.height + 10}px`,
        borderRadius: step.shape === 'circle' ? '50%' : '10px',
        visibility: 'visible',
        opacity: 1
    } as React.CSSProperties;

    const tooltipStyle = {
        top: `${tooltipPos.top}px`,
        left: `${tooltipPos.left}px`,
        '--arrow-left-pos': arrowPos.left,
        '--arrow-top-pos': arrowPos.top,
        visibility: 'visible',
        opacity: 1,
        transform: 'scale(1)'
    } as React.CSSProperties;

    return (
        <div className="onboarding-container">
            <div className="onboarding-hole" style={holeStyle} />
            <div className="onboarding-tooltip" style={tooltipStyle}>
                 <button className="onboarding-close-btn" onClick={() => onEnd(true)}>
                    <XIcon />
                </button>
                <h4>{step.title}</h4>
                <p>{step.content}</p>
                <div className="onboarding-nav">
                    <div className="onboarding-dots">
                        {steps.map((_, index) => (
                            <div key={index} className={`onboarding-dot ${index === currentStepIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                    <div className="onboarding-nav-buttons">
                        {currentStepIndex > 0 && <Button variant="cancel" onClick={onPrev}>Anterior</Button>}
                        <Button onClick={onNext}>
                            {currentStepIndex === steps.length - 1 ? 'Concluir' : 'Próximo'}
                        </Button>
                    </div>
                </div>
                <div className={`onboarding-tooltip-arrow ${arrowClass}`} />
            </div>
        </div>
    );
};


// --- APP CONTAINER ---
const App = () => {
  const [cards, setCards] = usePersistentState<Card[]>('flashcards', []);
  const [studyHistory, setStudyHistory] = usePersistentState<StudyDay[]>('studyHistory', []);
  const [view, setView] = useState<View>('review');
  const [theme, setTheme] = usePersistentState<Theme>('gaku-theme', 'dark');
  const [reviewSettings, setReviewSettings] = usePersistentState<ReviewSettings>('reviewSettings', { order: 'default', dailyLimit: 50 });
  const [activeCard, setActiveCard] = useState<Card | null>(null); // For editing
  const [selectedDeckForAdd, setSelectedDeckForAdd] = useState<string | null>(null); // Pre-select deck in add view
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [activeView, setActiveView] = useState<View>('review'); // This is what the user sees
  const [communityDecksLoading, setCommunityDecksLoading] = useState(false);
  const [showTour, setShowTour] = usePersistentState<boolean>('showTour', true);
  const [tourStep, setTourStep] = useState(0);

    // GA Initialization
    useEffect(() => {
        const gaMeasurementId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID;
        if (gaMeasurementId) {
            const scriptId = 'ga-gtag';
            if (document.getElementById(scriptId)) return;

            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
            script.async = true;
            document.head.appendChild(script);

            const inlineScript = document.createElement('script');
            inlineScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
            `;
            document.head.appendChild(inlineScript);
        }
    }, []);

  const navigateTo = (newView: View) => {
    if (view !== newView) {
        trackEvent('navigate', { from_view: view, to_view: newView });
        setView(newView);
    }
  };

  const decks = useMemo<DeckInfo[]>(() => {
    const deckMap = new Map<string, number>();
    cards.forEach(card => {
      deckMap.set(card.category, (deckMap.get(card.category) || 0) + 1);
    });
    return Array.from(deckMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cards]);
  
  const dueCards = useMemo(() => {
    const today = getTodaysDateString();
    let filtered = cards.filter(c => c.dueDate <= today);

    switch (reviewSettings.order) {
        case 'random':
            filtered = filtered.sort(() => Math.random() - 0.5);
            break;
        case 'newestFirst':
            filtered = filtered.sort((a,b) => b.id - a.id);
            break;
        case 'default':
        default:
            // Default sort is by due date (oldest first)
            filtered = filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            break;
    }
    
    if (reviewSettings.dailyLimit > 0) {
        return filtered.slice(0, reviewSettings.dailyLimit);
    }

    return filtered;
  }, [cards, reviewSettings]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    trackEvent('toggle_theme', { to_theme: newTheme });
    setTheme(newTheme);
  };
  
  const handleSaveCard = (card: Card) => {
    const isEditing = cards.some(c => c.id === card.id);
    trackEvent(isEditing ? 'edit_card' : 'add_card', { category: card.category });
    setCards(prev => {
      const newCards = isEditing ? prev.map(c => c.id === card.id ? card : c) : [...prev, card];
      // If a new category was created, ensure the deck exists
      if (!prev.some(c => c.category === card.category)) {
          console.log(`New deck "${card.category}" created implicitly.`);
      }
      return newCards;
    });
  };

  const handleDeleteCard = (id: number) => {
     setModalConfig({
        type: 'confirm',
        title: 'Excluir Cartão?',
        message: 'Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        isDestructive: true,
        onConfirm: () => {
            const cardToDelete = cards.find(c => c.id === id);
            if (cardToDelete) {
                trackEvent('delete_card', { category: cardToDelete.category });
                setCards(prev => prev.filter(c => c.id !== id));
            }
        },
    });
  };

   const handleMoveCard = (cardId: number) => {
        const cardToMove = cards.find(c => c.id === cardId);
        if (!cardToMove) return;

        const otherDecks = decks.filter(d => d.name !== cardToMove.category);

        if (otherDecks.length === 0) {
            setModalConfig({
                type: 'confirm',
                title: 'Nenhum outro baralho disponível',
                message: 'Crie outro baralho para poder mover este cartão.',
                confirmText: 'Ok',
                onConfirm: () => {},
                cancelText: ''
            });
            return;
        }

        setModalConfig({
            type: 'confirm',
            title: 'Mover Cartão para...',
            message: (
                <div className="form-group">
                    <label>Selecione o baralho de destino:</label>
                    <select id="move-card-select" className="dialog-select" defaultValue={otherDecks[0].name}>
                        {otherDecks.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                </div>
            ),
            confirmText: 'Mover',
            onConfirm: () => {
                const select = document.getElementById('move-card-select') as HTMLSelectElement;
                const newDeckName = select.value;
                if (newDeckName) {
                    trackEvent('move_card', { from_deck: cardToMove.category, to_deck: newDeckName });
                    setCards(prev => prev.map(c => c.id === cardId ? { ...c, category: newDeckName } : c));
                }
            },
        });
    };
  
    const handleSaveNewDeck = (initialName: string = '') => {
        setModalConfig({
            type: 'prompt',
            title: initialName ? 'Renomear Baralho' : 'Novo Baralho',
            message: 'Digite o nome do baralho:',
            initialValue: initialName,
            confirmText: 'Salvar',
            onConfirm: (deckName) => {
                if (!deckName || !deckName.trim()) return;
                deckName = deckName.trim();
                
                if (decks.some(d => d.name.toLowerCase() === deckName.toLowerCase() && d.name !== initialName)) {
                    alert('Um baralho com este nome já existe.');
                    return;
                }
                
                if (initialName) { // Renaming
                    trackEvent('rename_deck', { old_name: initialName, new_name: deckName });
                    setCards(prev => prev.map(c => c.category === initialName ? { ...c, category: deckName } : c));
                } else { // Creating new
                    trackEvent('create_deck', { deck_name: deckName });
                    // To "create" a deck, we just need to be ready to assign cards to it.
                    // A deck with no cards doesn't exist in our data model.
                    // We can switch to the 'add' view with this new deck selected.
                    setSelectedDeckForAdd(deckName);
                    navigateTo('add');
                }
            }
        });
    };

    const handleDeleteDeck = (deckName: string) => {
        setModalConfig({
            type: 'confirm',
            title: `Excluir "${deckName}"?`,
            message: 'Todos os cartões neste baralho serão permanentemente excluídos. Esta ação não pode ser desfeita.',
            confirmText: 'Excluir Baralho',
            isDestructive: true,
            onConfirm: () => {
                trackEvent('delete_deck', { deck_name: deckName });
                setCards(prev => prev.filter(c => c.category !== deckName));
            }
        });
    };

  const handleFeedback = (card: Card, feedback: FeedbackType) => {
    trackEvent('review_feedback', { category: card.category, feedback_type: feedback });
    
    let newRepetitions = card.repetitions;
    let newEasinessFactor = card.easinessFactor;
    let newInterval = card.interval;

    const todayStr = getTodaysDateString();
    setStudyHistory(prev => {
        const today = prev.find(d => d.date === todayStr);
        if (today) {
            return prev.map(d => d.date === todayStr ? { ...d, reviewed: d.reviewed + 1, correct: d.correct + (feedback !== 'again' ? 1 : 0) } : d);
        } else {
            return [...prev, { date: todayStr, reviewed: 1, correct: (feedback !== 'again' ? 1 : 0) }];
        }
    });

    if (feedback === 'again') {
      newRepetitions = 0;
      newInterval = 1; // Show again tomorrow
    } else {
      newRepetitions += 1;
      if (feedback === 'good') {
          newEasinessFactor = card.easinessFactor; // No change
      } else if (feedback === 'easy') {
          newEasinessFactor = card.easinessFactor + 0.15;
      }
      
      if (newRepetitions === 1) {
          newInterval = 1;
      } else if (newRepetitions === 2) {
          newInterval = 6;
      } else {
          newInterval = Math.ceil(card.interval * newEasinessFactor);
      }
    }
    
    // Adjust easiness factor based on feedback, but keep it within bounds
    if (feedback === 'again') {
        newEasinessFactor = Math.max(1.3, card.easinessFactor - 0.2);
    }
    
    const newDueDate = addDays(getTodaysDateString(), newInterval);
    
    const updatedCard: Card = {
        ...card,
        repetitions: newRepetitions,
        easinessFactor: newEasinessFactor,
        interval: newInterval,
        dueDate: newDueDate,
    };
    
    setCards(prev => prev.map(c => c.id === card.id ? updatedCard : c));
  };

  const handleSaveSettings = (newSettings: ReviewSettings) => {
    trackEvent('save_settings', { order: newSettings.order, daily_limit: newSettings.dailyLimit });
    setReviewSettings(newSettings);
  };
  
  const handleExport = () => {
    trackEvent('export_data');
    const data = {
        cards,
        studyHistory,
        reviewSettings
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaku_backup_${getTodaysDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (json: string) => {
      setModalConfig({
        type: 'confirm',
        title: 'Restaurar Backup?',
        message: 'Isso substituirá todos os seus dados atuais. Esta ação não pode ser desfeita.',
        confirmText: 'Restaurar',
        isDestructive: true,
        onConfirm: () => {
            try {
                const data = JSON.parse(json);
                if (data.cards && data.studyHistory && data.reviewSettings) {
                    trackEvent('restore_data_success');
                    setCards(data.cards);
                    setStudyHistory(data.studyHistory);
                    setReviewSettings(data.reviewSettings);
                    navigateTo('review');
                } else {
                     trackEvent('restore_data_fail', { reason: 'invalid_format' });
                    alert('Arquivo de backup inválido.');
                }
            } catch (error) {
                 trackEvent('restore_data_fail', { reason: 'parse_error' });
                alert('Erro ao ler o arquivo de backup.');
                console.error("Restore error:", error);
            }
        },
    });
  };

  const handleResetApp = () => {
     setModalConfig({
        type: 'confirm',
        title: 'Apagar TODOS os dados?',
        message: 'Tem certeza? Todo o seu progresso e todos os cartões serão perdidos para sempre.',
        confirmText: 'Sim, apagar tudo',
        isDestructive: true,
        onConfirm: () => {
            trackEvent('reset_application');
            setCards([]);
            setStudyHistory([]);
            setReviewSettings({ order: 'default', dailyLimit: 50 });
            localStorage.clear(); // Extreme measure
            navigateTo('review');
        },
    });
  };

    const handleBulkAdd = (deckName: string) => {
        trackEvent('navigate_to_bulk_add', { from_deck: deckName });
        setSelectedDeckForAdd(deckName);
        navigateTo('bulk-add');
    };

    const handleSaveBulkCards = (deckName: string, text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const newCards: Card[] = lines.map((line, index) => {
            const parts = line.split(/[;\t]/); // Split by semicolon or tab
            const front = parts[0]?.trim() || '';
            const back = parts.slice(1).join(';').trim() || '';

            if (!front || !back) return null;

            return {
                id: Date.now() + index,
                front,
                back,
                category: deckName,
                repetitions: 0,
                easinessFactor: 2.5,
                interval: 0,
                dueDate: getTodaysDateString(),
            };
        }).filter((card): card is Card => card !== null);

        if (newCards.length > 0) {
            trackEvent('save_bulk_cards', { deck_name: deckName, count: newCards.length });
            setCards(prev => [...prev, ...newCards]);
        }
        navigateTo('decks');
        // A slight delay to allow the view to change before viewing the deck
        setTimeout(() => {
            const deckListView = document.querySelector('.decks-view');
            if(deckListView) {
                // This is a bit of a hack to trigger the view change inside DecksView
                // A better solution would involve a more robust navigation system.
            }
        }, 100);
    };
    
    const handleShareDeck = (deck: DeckInfo) => {
        const deckCards = cards.filter(c => c.category === deck.name);
        setModalConfig({
            type: 'prompt',
            title: `Compartilhar "${deck.name}"`,
            message: 'Adicione uma breve descrição para o seu baralho:',
            initialValue: '',
            confirmText: 'Compartilhar',
            onConfirm: async (description) => {
                 if (!description) {
                    alert('A descrição é obrigatória.');
                    return;
                }
                trackEvent('share_deck', { deck_name: deck.name, card_count: deckCards.length });
                const deckData = {
                    name: deck.name,
                    description,
                    author: 'Anônimo' // Placeholder for now
                };
                
                // Show loader in modal
                // This part needs a more robust modal system to show a loading state
                
                const exists = await communityApi.checkDeckExists(deck.name);
                if (exists) {
                    alert(`Um baralho chamado "${deck.name}" já existe na comunidade. Por favor, renomeie o seu baralho se quiser compartilhá-lo.`);
                    return;
                }

                const result = await communityApi.uploadDeck(deckData, deckCards);
                if (result.success) {
                    alert('Baralho compartilhado com sucesso!');
                    navigateTo('community');
                } else {
                    alert(`Falha ao compartilhar o baralho: ${result.message}`);
                }
            }
        });
    };

    const handleDownloadDeck = async (deck: PublicDeck) => {
        trackEvent('download_deck_start', { deck_name: deck.name });
        setCommunityDecksLoading(true);
        try {
            const publicCards = await communityApi.getDeckCards(deck.name);
            if(publicCards.length === 0) throw new Error("Deck is empty or failed to load.");
            
            const newCards: Card[] = publicCards.map((c, i) => ({
                id: Date.now() + i,
                front: c.front,
                back: c.back,
                category: deck.name,
                repetitions: 0,
                easinessFactor: 2.5,
                interval: 0,
                dueDate: getTodaysDateString(),
            }));

            setCards(prev => [...prev, ...newCards]);
            trackEvent('download_deck_success', { deck_name: deck.name, card_count: newCards.length });
            alert(`Baralho "${deck.name}" baixado com sucesso!`);
            
        } catch (error) {
            trackEvent('download_deck_fail', { deck_name: deck.name });
            alert(`Não foi possível baixar o baralho "${deck.name}".`);
            console.error(error);
        } finally {
            setCommunityDecksLoading(false);
        }
    };

  const tourSteps = [
    {
      target: '.review-view',
      title: 'Bem-vindo ao Gaku!',
      content: 'Este é o seu painel de revisão. As cartas que precisam ser estudadas aparecerão aqui todos os dias.',
    },
    {
      target: '.nav-btn-add',
      title: 'Adicionar Cartas',
      content: 'Clique neste botão a qualquer momento para adicionar novos flashcards aos seus baralhos.',
      shape: 'circle',
    },
    {
      target: '.nav-btn[aria-label="Baralhos"]',
      title: 'Gerenciar Baralhos',
      content: 'Aqui você pode ver todos os seus baralhos, editar cartões, praticar e muito mais.',
    },
    {
      target: '.nav-btn[aria-label="Comunidade"]',
      title: 'Comunidade',
      content: 'Descubra e baixe baralhos criados por outros usuários, ou compartilhe os seus!',
    },
    {
        target: '.nav-btn[aria-label="Ajustes"]',
        title: 'Ajustes',
        content: 'Personalize sua experiência de estudo, gerencie backups e configure o aplicativo como preferir.',
    }
  ];
  
  const endTour = (fromCloseButton = false) => {
    trackEvent('tour_ended', { step: tourStep, premature_exit: fromCloseButton });
    setShowTour(false);
    setTourStep(0);
  };
  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
       trackEvent('tour_next_step', { from_step: tourStep, to_step: tourStep + 1 });
       setTourStep(tourStep + 1);
    } else {
      endTour();
    }
  };
  const prevTourStep = () => {
    if (tourStep > 0) {
        trackEvent('tour_prev_step', { from_step: tourStep, to_step: tourStep - 1 });
        setTourStep(tourStep - 1);
    }
  };


  const renderContent = () => {
    switch (view) {
      case 'review':
        return <ReviewView 
                    cards={dueCards} 
                    onFeedback={handleFeedback} 
                    onSessionComplete={() => navigateTo('decks')}
                    onCreateDeck={() => navigateTo('add')}
                    decksExist={decks.length > 0}
                />;
      case 'add':
        return <AddCardView 
                    onSave={handleSaveCard} 
                    decks={decks} 
                    initialDeck={selectedDeckForAdd}
                    onBulkAdd={handleBulkAdd}
                    onBack={() => navigateTo('decks')} 
                />;
      case 'decks':
        return <DecksView 
                    cards={cards} 
                    decks={decks}
                    onSaveCard={handleSaveCard}
                    onDeleteCard={handleDeleteCard}
                    onSaveDeck={handleSaveNewDeck}
                    onDeleteDeck={handleDeleteDeck}
                    onRenameDeck={handleSaveNewDeck}
                    onMoveCard={handleMoveCard}
                    onBulkAdd={handleBulkAdd}
                    onPractice={() => {}}
                    onShareDeck={handleShareDeck}
                />;
      case 'settings':
          return <SettingsView 
                    settings={reviewSettings}
                    onSaveSettings={handleSaveSettings}
                    onExport={handleExport}
                    onRestore={handleRestore}
                    onResetApp={handleResetApp}
                    onShowTour={() => { trackEvent('tour_restarted'); setShowTour(true); setTourStep(0); }}
                    theme={theme}
                    onThemeChange={(t) => { trackEvent('toggle_theme', { to_theme: t }); setTheme(t); }}
                 />;
      case 'stats':
          trackEvent('view_stats');
          return <StatsView cards={cards} studyHistory={studyHistory} />;
      case 'community':
          return <CommunityView localDecks={decks} onDownloadDeck={handleDownloadDeck} navigateTo={navigateTo} />;
      case 'bulk-add':
          return <BulkAddView 
                    deckName={selectedDeckForAdd || 'Geral'} 
                    onSave={handleSaveBulkCards}
                    onBack={() => navigateTo('decks')}
                 />
      default:
        return <ReviewView cards={dueCards} onFeedback={handleFeedback} onSessionComplete={() => {}} onCreateDeck={() => navigateTo('add')} decksExist={decks.length > 0} />;
    }
  };

  return (
    <div className="app-container">
        {showTour && decks.length === 0 && (
            <OnboardingTour
                steps={tourSteps}
                currentStepIndex={tourStep}
                onNext={nextTourStep}
                onPrev={prevTourStep}
                onEnd={endTour}
            />
        )}
      <header>
        <h1>Gaku APP</h1>
        <div className="header-actions">
           <IconButton onClick={() => navigateTo('stats')} title="Estatísticas">
                <BarChartIcon />
            </IconButton>
           <IconButton onClick={handleThemeToggle} title={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </IconButton>
        </div>
      </header>
      
      <main className="content-wrapper">{renderContent()}</main>

      <NavBar
        activeView={view}
        onNavigate={navigateTo}
        reviewCount={dueCards.length}
        onAddClick={() => {
            setActiveCard(null);
            setSelectedDeckForAdd(null);
            navigateTo('add');
        }}
      />

      {modalConfig && (
        <Modal 
            config={modalConfig}
            closeModal={() => setModalConfig(null)}
        />
      )}
      {communityDecksLoading && (
        <div className="modal-overlay">
            <Loader />
        </div>
      )}
    </div>
  );
};

const NavBar = ({ activeView, onNavigate, reviewCount, onAddClick }) => {
    const navItems: { view: View, label: string, icon: React.ReactNode }[] = [
        { view: 'review', label: 'Revisar', icon: <EyeIcon/> },
        { view: 'decks', label: 'Baralhos', icon: <ListIcon/> },
        { view: 'community', label: 'Comunidade', icon: <GlobeIcon/> },
        { view: 'settings', label: 'Ajustes', icon: <SettingsIcon/> },
    ];

    return (
        <nav className="main-nav">
            {navItems.slice(0, 2).map(item => (
                <button
                    key={item.view}
                    className={`nav-btn ${activeView === item.view ? 'active' : ''}`}
                    onClick={() => onNavigate(item.view)}
                    aria-label={item.label}
                >
                    <span className="nav-badge-container">
                        {item.icon}
                        {item.view === 'review' && reviewCount > 0 && <span className="nav-badge">{reviewCount > 99 ? '99+' : reviewCount}</span>}
                    </span>
                    <span>{item.label}</span>
                </button>
            ))}

            <button className="nav-btn nav-btn-add" onClick={onAddClick} aria-label="Adicionar Cartão">
                <PlusIcon />
                <span>Adicionar</span>
            </button>
            
            {navItems.slice(2).map(item => (
                 <button
                    key={item.view}
                    className={`nav-btn ${activeView === item.view ? 'active' : ''}`}
                    onClick={() => onNavigate(item.view)}
                    aria-label={item.label}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};


const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}