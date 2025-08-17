
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
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const FlameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;


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
interface PublicCard {
  front: string;
  back: string;
  downloads?: number;
}

interface UserProfile {
    streak: number;
    lastStudiedDate: string | null; // ISO date string 'YYYY-MM-DD'
    dailyGoal: number; // XP
    dailyXp: number;
    dailyGoalMetDate: string | null; // To track if goal met today
    reminderTime: string; // "HH:MM" format
}

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

const XP_MAP = {
    // Review feedback
    again: 0,
    good: 10,
    easy: 15,
    // Actions
    addCard: 5,
    newDeck: 20,
    uploadDeck: 50,
    downloadDeck: 25,
    downloadCard: 5,
    communityContribution: 10,
};

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
     } catch (error: any) {
        console.error("Error uploading deck:", error);
        return { success: false, message: error.message };
     }
  },

  addCardToPublicDeck: async (deckName: string, card: { front: string; back: string }): Promise<{success: boolean, message?: string}> => {
     try {
        const response = await fetch('/.netlify/functions/add-card-to-deck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deckName, card }),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
        }
        return { success: true };
     } catch (error: any) {
        console.error("Error adding card to public deck:", error);
        return { success: false, message: error.message };
     }
  },

  recordDeckDownload: async (deckName: string): Promise<{success: boolean}> => {
      try {
          const response = await fetch('/.netlify/functions/record-deck-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deckName }),
          });
          return { success: response.ok };
      } catch (error) {
          console.error("Error recording deck download:", error);
          return { success: false };
      }
  },

  recordCardDownload: async (deckName: string, cardFront: string): Promise<{success: boolean}> => {
      try {
          const response = await fetch('/.netlify/functions/record-card-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deckName, cardFront }),
          });
          return { success: response.ok };
      } catch (error) {
          console.error("Error recording card download:", error);
          return { success: false };
      }
  },
};

// --- HELPERS ---
const calculateNextDueDate = (interval: number): Date => {
    const now = new Date();
    now.setDate(now.getDate() + interval);
    now.setHours(5, 0, 0, 0); // Due at 5 AM
    return now;
};

const calculateSuperMemo2 = (card: Card, quality: FeedbackType): Pick<Card, 'repetitions' | 'easinessFactor' | 'interval' | 'dueDate'> => {
    // Map button quality to SM-2 quality rating q (0-5)
    const q = quality === 'again' ? 2 : (quality === 'good' ? 4 : 5);

    if (q < 3) { // Incorrect response: Reset repetition sequence.
        return {
            repetitions: 0,
            easinessFactor: card.easinessFactor, // EF is not changed
            interval: 1, // Reset interval to 1 day
            dueDate: calculateNextDueDate(1).toISOString(),
        };
    }

    // Correct response:
    let newRepetitions: number;
    let newInterval: number;
    const newEasinessFactor = Math.max(1.3, card.easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

    if (card.repetitions === 0) {
        newRepetitions = 1;
        newInterval = 1;
    } else if (card.repetitions === 1) {
        newRepetitions = 2;
        newInterval = 6;
    } else {
        newRepetitions = card.repetitions + 1;
        newInterval = Math.ceil(card.interval * card.easinessFactor);
    }

    return {
        repetitions: newRepetitions,
        easinessFactor: newEasinessFactor,
        interval: newInterval,
        dueDate: calculateNextDueDate(newInterval).toISOString(),
    };
};


const getAffinityClassName = (repetitions: number): string => {
    if (repetitions === 0) return 'affinity-low'; // New or failed cards
    if (repetitions <= 4) return 'affinity-mid'; // Learning cards
    return 'affinity-high'; // Well-known cards
};

const requestNotificationPermission = async (): Promise<NotificationPermissionStatus> => {
    if (!('Notification' in window)) return 'unsupported';
    return await Notification.requestPermission();
};

const manageNotifications = (profile: UserProfile, streak: number) => {
    if (!('Notification' in window) || Notification.permission !== 'granted' || !('serviceWorker' in navigator)) {
        return;
    }

    navigator.serviceWorker.ready.then(registration => {
        // Always cancel previous notifications to avoid duplicates
        registration.active?.postMessage({ type: 'CANCEL_NOTIFICATIONS' });

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        // --- Logic to schedule next notification ---
        let title: string;
        let body: string;
        const targetTime = new Date();

        // Has the user studied today?
        const hasStudiedToday = profile.lastStudiedDate === todayStr;

        if (hasStudiedToday) {
            // Studied today, schedule for tomorrow
            const [hours, minutes] = profile.reminderTime.split(':').map(Number);
            targetTime.setDate(now.getDate() + 1);
            targetTime.setHours(hours, minutes, 0, 0);

            title = 'Continue sua ofensiva! 🔥';
            body = `Você está em uma ofensiva de ${streak} dia(s). Não pare agora!`;
            
        } else {
            // Not studied today. Is streak in danger?
            const eveningTime = new Date();
            eveningTime.setHours(21, 0, 0, 0); // 9 PM

            if (now < eveningTime) {
                // It's not evening yet, schedule a "streak danger" notification for the evening
                targetTime.setHours(21, 0, 0, 0);
                 title = 'Sua ofensiva está em perigo! 😨';
                 body = `Pratique hoje para manter sua ofensiva de ${streak} dia(s) viva. O Gaku acredita em você!`;
            } else {
                // It's already past the danger notification time. Schedule for tomorrow.
                const [hours, minutes] = profile.reminderTime.split(':').map(Number);
                targetTime.setDate(now.getDate() + 1);
                targetTime.setHours(hours, minutes, 0, 0);

                title = 'Hora de voltar a estudar! 🚀';
                body = `Comece uma nova ofensiva hoje. Você consegue!`;
            }
        }
        
        const delay = targetTime.getTime() - now.getTime();
        
        if (delay > 0 && registration.active) {
            registration.active.postMessage({
                type: 'SCHEDULE_NOTIFICATION',
                payload: {
                    delay,
                    title,
                    options: {
                        body,
                        lang: 'pt-BR',
                        icon: '/icon.svg',
                        badge: '/icon.svg',
                        vibrate: [100, 50, 100],
                        tag: 'gaku-study-reminder',
                        requireInteraction: true,
                        actions: [{ action: 'open_app', title: 'Abrir App' }]
                    }
                }
            });
            console.log(`Notification scheduled via Service Worker for ${targetTime}`);
        }
    });
};

const playFeedbackSound = (type: FeedbackType) => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);

        if (type === 'again') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(160, audioContext.currentTime);
        } else if (type === 'good') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        } else { // easy
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.01); 
        }

        oscillator.start(audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.25);
        oscillator.stop(audioContext.currentTime + 0.25);

    } catch (e) {
        console.error("Could not play sound", e);
    }
};

// --- INITIAL DATA ---
const getInitialCards = (): Card[] => {
    const today = new Date().toISOString();
    const initialSrsState = { repetitions: 0, easinessFactor: 2.5, interval: 0, dueDate: today };
    return [
      { id: 1, front: 'こんにちは', back: 'Olá', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 2, front: 'ありがとう', back: 'Obrigado(a)', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 3, front: 'はい', back: 'Sim', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 4, front: 'いいえ', back: 'Não', category: 'Vocabulário Básico', ...initialSrsState },
      { id: 5, front: '日本', back: 'Japão', category: 'Kanji', ...initialSrsState },
      { id: 6, front: '学', back: 'Gaku - Estudar / Aprender', category: 'Kanji', ...initialSrsState },
    ];
};

// --- UI COMPONENTS ---
const Loader: React.FC<{ isSmall?: boolean }> = ({ isSmall = false }) => (
    <div className={isSmall ? '' : "loader-overlay"}>
        <div className={`loader ${isSmall ? 'small' : ''}`}></div>
    </div>
);

const DarkModeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button onClick={toggleTheme} className="icon-btn" aria-label={`Ativar modo ${theme === 'light' ? 'escuro' : 'claro'}`}>
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
);

const StatsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="icon-btn" aria-label="Ver estatísticas" id="header-stats-btn">
        <BarChartIcon />
    </button>
);

const XpGainToast: React.FC<{ amount: number }> = ({ amount }) => (
    <div className="xp-toast-container">
        <div className="xp-toast-content">
            +{amount} XP
        </div>
    </div>
);

const Header: React.FC<{
    profile: UserProfile;
    onStatsClick: () => void;
    theme: Theme;
    toggleTheme: () => void;
}> = ({ profile, onStatsClick, theme, toggleTheme }) => {
    const { streak, dailyXp, dailyGoal } = profile;
    const xpProgress = dailyGoal > 0 ? (dailyXp / dailyGoal) * 100 : 0;

    return (
        <header>
            <div className="header-main">
                <h1>Gaku</h1>
                <div className="header-gamification">
                    <div className="streak-display" title={`Sua ofensiva atual é de ${streak} dias`}>
                        <FlameIcon />
                        <span>{streak}</span>
                    </div>
                </div>
            </div>
            <div className="header-side">
                 <div className="daily-goal-progress" title={`Meta diária: ${dailyXp} / ${dailyGoal} XP`}>
                    <div className="daily-goal-bar" style={{ width: `${Math.min(xpProgress, 100)}%` }}></div>
                    <ZapIcon />
                    <span>{dailyXp}/{dailyGoal}</span>
                </div>
                <StatsButton onClick={onStatsClick} />
                <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
};

const NavBar: React.FC<{
    currentView: View;
    onNavigate: (view: View) => void;
    reviewCount: number;
}> = ({ currentView, onNavigate, reviewCount }) => (
    <nav className="main-nav">
        <button onClick={() => onNavigate('review')} className={`nav-btn ${currentView === 'review' ? 'active' : ''}`} aria-label="Revisar" id="nav-review">
            <div className="nav-badge-container">
                <EyeIcon />
                {reviewCount > 0 && <span className="nav-badge">{reviewCount}</span>}
            </div>
            <span>Revisar</span>
        </button>
        <button onClick={() => onNavigate('decks')} className={`nav-btn ${currentView === 'decks' ? 'active' : ''}`} aria-label="Baralhos" id="nav-decks">
            <ListIcon />
            <span>Baralhos</span>
        </button>
        <button onClick={() => onNavigate('add')} className="nav-btn nav-btn-add" aria-label="Adicionar carta" id="nav-add">
            <PlusIcon />
            <span>Adicionar</span>
        </button>
        <button id="nav-community" onClick={() => onNavigate('community')} className={`nav-btn ${currentView === 'community' ? 'active' : ''}`} aria-label="Comunidade">
            <GlobeIcon />
            <span>Comunidade</span>
        </button>
        <button onClick={() => onNavigate('settings')} className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`} aria-label="Configurações">
            <SettingsIcon />
            <span>Ajustes</span>
        </button>
    </nav>
);

const Flashcard: React.FC<{
    card: Card;
    isFlipped: boolean;
    onFlip: () => void;
    feedbackState: string;
    onSwipe: (direction: 'left' | 'right' | 'up') => void;
    mode: 'review' | 'practice';
}> = ({ card, isFlipped, onFlip, feedbackState, onSwipe, mode }) => {
    const frontEl = useRef<HTMLDivElement>(null);
    const backEl = useRef<HTMLDivElement>(null);
    const [frontHasScroll, setFrontHasScroll] = useState(false);
    const [backHasScroll, setBackHasScroll] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // --- State for gesture detection ---
    const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
    const isInteracting = useRef(false);

    const getFontSizeClass = (text: string) => {
        const len = text.length;
        if (len <= 15) return 'text-size-large';
        if (len <= 80) return 'text-size-medium';
        return 'text-size-small';
    };

    useLayoutEffect(() => {
        if (frontEl.current) {
            setFrontHasScroll(frontEl.current.scrollHeight > frontEl.current.clientHeight);
        }
        if (backEl.current) {
            setBackHasScroll(backEl.current.scrollHeight > backEl.current.clientHeight);
        }
    }, [card, isFlipped]);

    const handleInteractionStart = (clientX: number, clientY: number) => {
        isInteracting.current = true;
        pointerStartRef.current = {
            x: clientX,
            y: clientY,
            time: Date.now()
        };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY);
        const allowSwipeViz = (mode === 'review' && isFlipped) || (mode === 'practice' && !isFlipped);
        if (allowSwipeViz && cardRef.current) {
            cardRef.current.classList.add('is-swiping');
        }
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isInteracting.current) return;
        
        const allowSwipeViz = (mode === 'review' && isFlipped) || (mode === 'practice' && !isFlipped);
        if (!allowSwipeViz) return;

        const diffX = e.touches[0].clientX - pointerStartRef.current.x;
        if (cardRef.current) {
            cardRef.current.style.transform = `translateX(${diffX}px)`;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isInteracting.current) return;
        isInteracting.current = false;
        
        if (cardRef.current) {
            cardRef.current.classList.remove('is-swiping');
            cardRef.current.style.transform = '';
        }
    
        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const duration = Date.now() - pointerStartRef.current.time;
        const diffX = touchEnd.x - pointerStartRef.current.x;
        const diffY = touchEnd.y - pointerStartRef.current.y;

        // TAP LOGIC
        if (duration < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
            onFlip();
            return; 
        }
        
        // SWIPE LOGIC
        const swipeThreshold = 60;
        const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 1.5;
        const isVerticalSwipe = mode === 'review' && Math.abs(diffY) > Math.abs(diffX) * 1.5;

        const canSwipe = (mode === 'review' && isFlipped) || (mode === 'practice' && !isFlipped);
        
        if (canSwipe) {
            if (isHorizontalSwipe) {
                if (diffX < -swipeThreshold) onSwipe('left');
                else if (diffX > swipeThreshold) onSwipe('right');
            } else if (isVerticalSwipe) { // Only relevant for review mode
                if (diffY < -swipeThreshold) onSwipe('up');
            }
        }
    };

    // --- Mouse handlers for desktop click ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only main button
        // Do not handle mouse events on touch devices to prevent double firing
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
        handleInteractionStart(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || !isInteracting.current) return;
        isInteracting.current = false;
        
        const duration = Date.now() - pointerStartRef.current.time;
        const diffX = e.clientX - pointerStartRef.current.x;
        const diffY = e.clientY - pointerStartRef.current.y;

        // CLICK LOGIC
        if (duration < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
            onFlip();
        }
    };

    const handleMouseLeave = () => {
        // Cancel interaction if mouse leaves while pressed
        if (isInteracting.current) {
            isInteracting.current = false;
        }
    };


    return (
        <div 
            id="flashcard-container"
            className={`flashcard-container ${feedbackState}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
        >
            <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="flashcard-face flashcard-front">
                    <div ref={frontEl} className={`${getFontSizeClass(card.front)} ${frontHasScroll ? 'has-scroll-indicator' : ''}`}>{card.front}</div>
                </div>
                <div className="flashcard-face flashcard-back">
                    <div ref={backEl} className={`${getFontSizeClass(card.back)} ${backHasScroll ? 'has-scroll-indicator' : ''}`}>{card.back}</div>
                </div>
            </div>
            <div className="feedback-icon-overlay">
                {feedbackState === 'feedback-again' && <XIcon />}
                {feedbackState === 'feedback-good' && <CheckIcon />}
                {feedbackState === 'feedback-easy' && <StarIcon />}
            </div>
        </div>
    );
};

const Controls: React.FC<{
    isFlipped: boolean;
    onShowAnswer: () => void;
    onFeedback: (quality: FeedbackType) => void;
    progressText: string;
}> = ({ isFlipped, onShowAnswer, onFeedback, progressText }) => {
    return (
        <div className="controls">
            <div className="progress">{progressText}</div>
            {isFlipped ? (
                <div id="srs-buttons-container" className="srs-buttons">
                    <button onClick={() => onFeedback('again')} className="btn srs-btn srs-again">Errei</button>
                    <button onClick={() => onFeedback('good')} className="btn srs-btn srs-good">OK (+{XP_MAP.good} XP)</button>
                    <button onClick={() => onFeedback('easy')} className="btn srs-btn srs-easy">Fácil (+{XP_MAP.easy} XP)</button>
                </div>
            ) : (
                <button id="show-answer-btn" onClick={onShowAnswer} className="btn">Mostrar Resposta</button>
            )}
        </div>
    );
};

const CustomDialog: React.FC<ModalConfig & { onDismiss: () => void }> = ({
    type, title, message, confirmText, cancelText, isDestructive, onConfirm, onCancel, onDismiss, initialValue
}) => {
    const [inputValue, setInputValue] = useState(initialValue || '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (type === 'prompt' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [type]);

    const handleConfirm = () => {
        onConfirm(inputValue);
        onDismiss();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        onDismiss();
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Do not handle Enter key if the target is the dialog's select input
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'SELECT') {
            if (type === 'prompt' && !inputValue.trim()) return;
            handleConfirm();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="custom-dialog-content" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
                <h3>{title}</h3>
                <div className="custom-dialog-message">{message}</div>
                {type === 'prompt' && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nome do baralho..."
                    />
                )}
                <div className="dialog-actions">
                    <button onClick={handleCancel} className="btn btn-cancel">
                        {cancelText || 'Cancelar'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`btn ${isDestructive ? 'btn-destructive' : ''}`}
                        disabled={type === 'prompt' && !inputValue.trim()}
                    >
                        {confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddCardForm: React.FC<{
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

const BulkAddView: React.FC<{
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

const DeckList: React.FC<{
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

const DeckCardList: React.FC<{
    deckName: string;
    cards: Card[];
    onBack: () => void;
    onEditCard: (card: Card) => void;
    onPractice: (deckName: string) => void;
    onMoveCard: (card: Card) => void;
}> = ({ deckName, cards, onBack, onEditCard, onPractice, onMoveCard }) => {
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

const CategorySelection: React.FC<{ 
    decks: DeckInfo[]; 
    onSelectCategory: (category: string) => void;
}> = ({ decks, onSelectCategory }) => (
    <div className="category-selection-view">
        <h2>Escolha uma categoria para revisar</h2>
        <ul className="category-list">
            {decks.map(({ name, count }) => (
                <li key={name}>
                    <button className="category-btn" onClick={() => onSelectCategory(name)}>
                        <span>{name}</span>
                        <span className="category-due-count">{count}</span>
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

const SessionComplete: React.FC<{ onAddMore: () => void; onGoToDecks: () => void; streak: number; }> = ({ onAddMore, onGoToDecks, streak }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const container = canvas.parentElement;
        if (!container) return;

        let animationFrameId: number;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const colors = ['#fbbc05', '#4285f4', '#34a853', '#ea4335', '#00a884'];
        
        let confettiParticles: any[] = [];
        const particleCount = 200;

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        for (let i = 0; i < particleCount; i++) {
            confettiParticles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height - rect.height, // Start above screen
                w: random(5, 15),
                h: random(3, 10),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: random(-7, 7),
                ySpeed: random(2, 5),
                opacity: 1,
                tilt: random(-15, 15),
                tiltAngle: 0,
                tiltAngleSpeed: random(0.05, 0.12),
            });
        }
        
        let particlesOnScreen = particleCount;

        const render = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (particlesOnScreen === 0) {
                 cancelAnimationFrame(animationFrameId);
                 return;
            }

            confettiParticles.forEach((p) => {
                if (p.opacity <= 0) return;

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.translate(p.x + p.tilt, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();

                p.y += p.ySpeed;
                p.rotation += p.rotationSpeed;
                p.tiltAngle += p.tiltAngleSpeed;
                p.tilt = Math.sin(p.tiltAngle) * 15;
                
                if (p.y > rect.height) {
                    if (p.opacity > 0) {
                        p.opacity = 0;
                        particlesOnScreen--;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const safetyTimeout = setTimeout(() => {
             cancelAnimationFrame(animationFrameId);
        }, 8000); // Stop after 8s regardless

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(safetyTimeout);
        };

    }, []);

    return (
        <div className="session-complete">
            <div className="confetti-canvas-container">
                <canvas ref={canvasRef}></canvas>
            </div>
            <h2>Parabéns!</h2>
            <p>Você revisou todas as cartas por hoje.</p>
            {streak > 1 && <p className="streak-message">Sua ofensiva agora é de <strong>{streak} dias</strong>! 🔥</p>}
            <div className="session-complete-actions">
                <button className="btn" onClick={onGoToDecks}>
                   <ListIcon/> Ver Baralhos
                </button>
                <button className="btn btn-outline" onClick={onAddMore}>
                   <PlusIcon/> Adicionar Cartas
                </button>
            </div>
        </div>
    );
};

const WelcomeEmptyState: React.FC<{ onAddNewDeck: () => void }> = ({ onAddNewDeck }) => (
    <div className="empty-state-container">
        <ListIcon />
        <h3>Bem-vindo ao Gaku!</h3>
        <p>Parece que você ainda não tem nenhum baralho. Crie o seu primeiro para começar a adicionar cartas e revisar.</p>
        <button className="btn" onClick={onAddNewDeck}>
            <PlusIcon /> Criar Meu Primeiro Baralho (+{XP_MAP.newDeck} XP)
        </button>
    </div>
);

const SettingsView: React.FC<{
    settings: { review: ReviewSettings, profile: UserProfile };
    onReviewSettingsChange: (newSettings: Partial<ReviewSettings>) => void;
    onProfileChange: (newProfile: Partial<UserProfile>) => void;
    onBackup: () => string;
    onRestore: (data: string) => void;
    onExportJson: () => void;
    onExportCsv: () => void;
    onImport: (file: File) => void;
    notificationPermission: NotificationPermissionStatus;
    onRequestPermission: () => void;
    onStartReviewTutorial: () => void;
}> = ({ settings, onReviewSettingsChange, onProfileChange, onBackup, onRestore, onExportJson, onExportCsv, onImport, notificationPermission, onRequestPermission, onStartReviewTutorial }) => {
    const [backupData, setBackupData] = useState('');
    const [restoreData, setRestoreData] = useState('');
    const [showCode, setShowCode] = useState(false);
    const restoreInputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const permissionStatusText: Record<NotificationPermissionStatus, string> = {
        default: 'Pendente',
        granted: 'Permitido',
        denied: 'Bloqueado',
        unsupported: 'Não suportado'
    };

    const handleBackup = () => {
        const data = onBackup();
        setBackupData(data);
        setShowCode(true);
        navigator.clipboard.writeText(data).then(() => {
             alert('Código de backup copiado para a área de transferência!');
        }, () => {
            alert('Não foi possível copiar o código. Por favor, copie manualmente.');
        });
    };

    const handleRestore = () => {
        if (restoreData.trim() === '') {
            alert('Por favor, cole seu código de backup.');
            return;
        }
        if (confirm('Restaurar os dados substituirá todos os seus baralhos e cartas atuais. Tem certeza que deseja continuar?')) {
            onRestore(restoreData);
            setRestoreData('');
            alert('Dados restaurados com sucesso!');
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
        }
        // Reset file input to allow selecting the same file again
        if (e.target) {
          e.target.value = '';
        }
    };

    return (
        <div className="settings-view">
            <h2>Ajustes</h2>
            <div className="settings-section">
                 <h3><SettingsIcon /> Configurações de Revisão</h3>
                 <div className="form-group">
                    <label htmlFor="review-order">Ordem da Revisão</label>
                    <select id="review-order" className="settings-select" value={settings.review.order} onChange={e => onReviewSettingsChange({ order: e.target.value as ReviewSettings['order'] })}>
                        <option value="default">Padrão (Mais antigos primeiro)</option>
                        <option value="random">Aleatória</option>
                        <option value="newestFirst">Mais novas primeiro</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="daily-limit">Limite Diário de Cartas (0 = sem limite)</label>
                    <input id="daily-limit" className="settings-input" type="number" min="0" value={settings.review.dailyLimit} onChange={e => onReviewSettingsChange({ dailyLimit: parseInt(e.target.value, 10) || 0 })} />
                </div>
            </div>
            <div className="settings-section">
                <h3><ZapIcon /> Metas e Lembretes</h3>
                 <div className="form-group">
                    <label htmlFor="daily-goal">Meta Diária de XP</label>
                    <input id="daily-goal" className="settings-input" type="number" min="0" step="10" value={settings.profile.dailyGoal} onChange={e => onProfileChange({ dailyGoal: parseInt(e.target.value, 10) || 0 })} />
                </div>
                 <div className="form-group">
                    <label htmlFor="reminder-time">Horário do Lembrete Diário</label>
                    <input id="reminder-time" className="settings-input" type="time" value={settings.profile.reminderTime} onChange={e => onProfileChange({ reminderTime: e.target.value })} />
                </div>
            </div>
            <div className="settings-section">
                <h3><BellIcon /> Notificações de Lembrete</h3>
                {notificationPermission === 'unsupported' ? (
                    <p>Seu navegador não suporta notificações.</p>
                ) : (
                    <>
                        <p className="settings-description">Status atual: <strong>{permissionStatusText[notificationPermission]}</strong></p>
                        <p className="settings-description">
                            Receba um lembrete diário para não esquecer de revisar suas cartas.
                        </p>
                        {notificationPermission !== 'granted' && (
                            <button className="btn" onClick={onRequestPermission}>
                                Ativar Notificações
                            </button>
                        )}
                        {notificationPermission === 'denied' && (
                             <p className="settings-description" style={{fontSize: '0.85rem'}}>
                                Para receber notificações, você precisa permitir nas configurações de site do seu navegador.
                            </p>
                        )}
                    </>
                )}
            </div>
            <div className="settings-section">
                <h3><HelpCircleIcon /> Ajuda</h3>
                <p className="settings-description">
                    Não tem certeza de como funciona a revisão de cartas? Veja o tutorial novamente.
                </p>
                <div className="backup-actions">
                     <button className="btn btn-outline" onClick={onStartReviewTutorial}>
                        <EyeIcon /> Como funciona a revisão?
                    </button>
                </div>
            </div>
            <div className="settings-section">
                <h3><CloudUploadIcon/> Backup & Restauração</h3>
                 <p className="settings-description">
                    Salve todos os seus dados em um código de texto ou exporte-os como um arquivo JSON (completo) ou CSV (para planilhas).
                </p>
                <div className="backup-actions">
                    <button className="btn" onClick={handleBackup}><CloudDownloadIcon/> Gerar Código de Backup</button>
                    <button className="btn" onClick={onExportJson}><FileTextIcon/> Exportar (JSON)</button>
                    <button className="btn" onClick={onExportCsv}><FileTextIcon/> Exportar (CSV)</button>
                </div>

                {showCode && (
                     <div className="code-display-area">
                        <label htmlFor="backup-code">Seu código de backup (guarde em um local seguro):</label>
                        <textarea id="backup-code" readOnly value={backupData} rows={5}></textarea>
                    </div>
                )}
                
                <h4 className="restore-title">Restaurar Dados</h4>
                <div className="backup-actions">
                    <button className="btn" onClick={() => fileInputRef.current?.click()}><CloudUploadIcon/> Importar Arquivo</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".csv,.json" style={{ display: 'none' }} />
                </div>
                 <textarea
                    ref={restoreInputRef}
                    value={restoreData}
                    onChange={e => setRestoreData(e.target.value)}
                    placeholder="Cole seu código de backup aqui..."
                    rows={5}
                />
                 <button className="btn" onClick={handleRestore} disabled={!restoreData.trim()}>Restaurar do Código</button>
            </div>
        </div>
    );
};

const StatsView: React.FC<{ cards: Card[], studyHistory: StudyDay[], onBack: () => void }> = ({ cards, studyHistory, onBack }) => {

    const stats = useMemo(() => {
        const totalCards = cards.length;
        const matureCards = cards.filter(c => c.interval >= 21).length;
        const learningCards = cards.filter(c => c.interval > 0 && c.interval < 21).length;
        const newCards = cards.filter(c => c.interval === 0).length;

        const totalReviewed = studyHistory.reduce((sum, day) => sum + day.reviewed, 0);
        const totalCorrect = studyHistory.reduce((sum, day) => sum + day.correct, 0);
        const successRate = totalReviewed > 0 ? ((totalCorrect / totalReviewed) * 100).toFixed(0) : '0';

        return { totalCards, matureCards, learningCards, newCards, totalReviewed, successRate };
    }, [cards, studyHistory]);

    const masteryData = [
        { label: 'Novas', value: stats.newCards, className: 'new' },
        { label: 'Aprendendo', value: stats.learningCards, className: 'learning' },
        { label: 'Maduras', value: stats.matureCards, className: 'mature' }
    ];
    const maxMasteryValue = Math.max(...masteryData.map(d => d.value), 1);

    const activityHistoryData = useMemo(() => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const studyDay = studyHistory.find(d => d.date === dateString);
            days.push({
                date: date,
                count: studyDay ? studyDay.reviewed : 0,
            });
        }
        return days;
    }, [studyHistory]);

    const maxActivityValue = Math.max(...activityHistoryData.map(d => d.count), 1);

    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
    const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric' });

    if (cards.length === 0) {
        return (
            <div className="stats-view">
                 <div className="deck-card-list-header">
                    <button onClick={onBack} className="back-btn" aria-label="Voltar"><ArrowLeftIcon/></button>
                    <h2 style={{flexGrow: 1}}>Estatísticas</h2>
                </div>
                <div className="empty-state-container">
                    <BarChartIcon />
                    <h3>Sem dados para exibir</h3>
                    <p>Comece a adicionar e revisar cartas para ver suas estatísticas de aprendizado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-view">
            <div className="deck-card-list-header">
                <button onClick={onBack} className="back-btn" aria-label="Voltar"><ArrowLeftIcon/></button>
                <h2 style={{flexGrow: 1}}>Estatísticas</h2>
            </div>
            <div className="stats-cards-container">
                <div className="stat-card">
                    <span className="stat-value">{stats.totalCards}</span>
                    <span className="stat-label">Total de Cartas</span>
                </div>
                 <div className="stat-card">
                    <span className="stat-value">{stats.totalReviewed}</span>
                    <span className="stat-label">Revisões Totais</span>
                </div>
                 <div className="stat-card">
                    <span className="stat-value">{stats.successRate}<small>%</small></span>
                    <span className="stat-label">Taxa de Acerto</span>
                </div>
            </div>

             <div className="activity-chart-container">
                <h3><CalendarIcon /> Histórico de Atividade (Últimos 30 dias)</h3>
                <div className="activity-chart">
                    {activityHistoryData.map(({ date, count }, index) => {
                        const isFirstOfMonth = date.getDate() === 1;
                        const isMonday = date.getDay() === 1;
                        const showLabel = isFirstOfMonth || isMonday;
                        const labelText = isFirstOfMonth 
                            ? monthFormatter.format(date)
                            : dayFormatter.format(date);
                        
                        return (
                           <div key={index} className="activity-bar-wrapper" title={`${dayFormatter.format(date)} de ${monthFormatter.format(date)}: ${count} revisões`}>
                                <div className="activity-bar-value">{count}</div>
                                <div 
                                    className={`activity-bar ${ (isFirstOfMonth || isMonday) ? 'significant-day' : ''}`}
                                    style={{ height: `${(count / maxActivityValue) * 100}%` }}
                                ></div>
                                <div className={`activity-bar-label ${isFirstOfMonth ? 'is-month' : ''}`}>
                                    {showLabel ? labelText : ''}
                                 </div>
                           </div>
                        );
                    })}
                </div>
            </div>

            <div className="mastery-chart-container">
                <h3>Domínio das Cartas</h3>
                <div className="mastery-chart">
                    {masteryData.map(data => (
                        <div key={data.label} className="chart-bar-container">
                            <div className="chart-bar-value">{data.value}</div>
                            <div
                                className={`chart-bar ${data.className}`}
                                style={{ height: `${(data.value / maxMasteryValue) * 100}%` }}
                                title={`${data.label}: ${data.value}`}
                            ></div>
                            <div className="chart-bar-label">{data.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PracticeView: React.FC<{
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

const CommunityView: React.FC<{
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
    
    const localDeckNamesSet = useMemo(() => new Set(localCards.map(c => c.category.toLowerCase())), [localCards]);

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
                            {publicDecks.map((deck) => (
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
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDownloadAll(deck); }} 
                                            className="deck-action-btn download" 
                                            title={`Baixar todo o baralho ${deck.name} (+${XP_MAP.downloadDeck} XP)`}
                                            disabled={downloading !== null}
                                        >
                                            {downloading === deck.name ? <Loader isSmall={true} /> : <CloudDownloadIcon/>}
                                        </button>
                                    </div>
                                </li>
                            ))}
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

const ShareDeckModal: React.FC<{
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


// --- MAIN APP COMPONENT ---
const App = () => {
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
         allCategories.forEach(cat => {
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
                            <Share2Icon />
                            <span>A carta <strong>"{newCard.front}"</strong> não existe no baralho público <strong>"{newCard.category}"</strong>. Deseja compartilhá-la com a comunidade? (+{XP_MAP.communityContribution} XP)</span>
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

    const handleConfirmShare = async (description: string, author: string) => {
        if (!deckToShare) return;

        setIsLoading(true);
        const remoteExists = await communityApi.checkDeckExists(deckToShare);
        if (remoteExists) {
            setIsLoading(false);
            alert(`Um baralho com o nome "${deckToShare}" já foi compartilhado na comunidade. Por favor, renomeie o seu baralho se quiser compartilhá-lo.`);
            setDeckToShare(null);
            return;
        }

        const cardsToShare = cards.filter(c => c.category === deckToShare && c.repetitions !== -1);
        const deckData = { name: deckToShare, description, author };

        const result = await communityApi.uploadDeck(deckData, cardsToShare);
        setIsLoading(false);
        setDeckToShare(null);

        if (result.success) {
            alert(`Baralho "${deckToShare}" compartilhado com a comunidade com sucesso!`);
            grantXp(XP_MAP.uploadDeck);
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
    
    // --- Onboarding Tour Component ---
    const OnboardingTour: React.FC<{
        isActive: boolean;
        steps: any[];
        currentStepIndex: number;
        onNext: () => void;
        onPrev: () => void;
        onEnd: () => void;
        options?: { isCardFlipped?: boolean; onFlipCard?: () => void };
    }> = ({ isActive, steps, currentStepIndex, onNext, onPrev, onEnd, options }) => {
        
        const currentStep = steps[currentStepIndex];
        const holeRef = useRef<HTMLDivElement>(null);
        const tooltipRef = useRef<HTMLDivElement>(null);

        useLayoutEffect(() => {
            if (!isActive || !currentStep) return;

            // Flip card if needed for the current step
            if(options?.onFlipCard && options.isCardFlipped !== currentStep.isFlipped) {
                options.onFlipCard();
            }
        
            const targetElement = document.getElementById(currentStep.elementId);
            const holeEl = holeRef.current;
            const tooltipEl = tooltipRef.current;
        
            if (targetElement && holeEl && tooltipEl) {
                const rect = targetElement.getBoundingClientRect();
                const isWideScreen = window.innerWidth >= 900;
        
                // --- Hole Positioning ---
                const isAddButtonOnDesktop = currentStep.elementId === 'nav-add' && isWideScreen;
                const isHeaderButtonOnDesktop = ['header-stats-btn'].includes(currentStep.elementId) && isWideScreen;
                
                holeEl.style.borderRadius = (currentStep.isRound && !isAddButtonOnDesktop) || isHeaderButtonOnDesktop ? '50%' : 'var(--border-radius)';
                holeEl.style.width = `${rect.width + 10}px`;
                holeEl.style.height = `${rect.height + 10}px`;
                holeEl.style.top = `${rect.top - 5}px`;
                holeEl.style.left = `${rect.left - 5}px`;
                holeEl.style.opacity = '1';
                holeEl.style.visibility = 'visible';
        
                // --- Tooltip Positioning ---
                tooltipEl.style.opacity = '1';
                tooltipEl.style.visibility = 'visible';
                tooltipEl.style.transform = 'scale(1)';
        
                const arrowEl = tooltipEl.querySelector('.onboarding-tooltip-arrow') as HTMLElement;
                if (arrowEl) {
                    arrowEl.className = 'onboarding-tooltip-arrow'; // Reset classes
                }
        
                const tooltipHeight = tooltipEl.offsetHeight;
                const tooltipWidth = tooltipEl.offsetWidth;
                const space = 15;
                const margin = 10;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
        
                let top, left;
        
                if (isWideScreen) {
                    // Desktop layout logic
                    if (currentStep.position === 'bottom') { // For header items
                        if (arrowEl) arrowEl.classList.add('top-arrow');
                        top = rect.bottom + space;
                    } else { // For sidebar items
                        if (arrowEl) arrowEl.classList.add('left-arrow');
                        left = rect.right + space;
                        top = rect.top + rect.height / 2 - tooltipHeight / 2;
                        tooltipEl.style.setProperty('--arrow-top-pos', `${tooltipHeight / 2}px`);
                    }
                } else {
                    // Mobile layout logic
                    if (currentStep.position === 'top' && rect.top - tooltipHeight - space > margin) {
                        if (arrowEl) arrowEl.classList.add('bottom-arrow');
                        top = rect.top - tooltipHeight - space;
                    } else {
                        if (arrowEl) arrowEl.classList.add('top-arrow');
                        top = rect.bottom + space;
                    }
                }
        
                // Horizontal positioning for both mobile and desktop (when applicable)
                if (left === undefined) {
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
                }
        
                // Boundary checks
                if (left < margin) left = margin;
                if (left + tooltipWidth > viewportWidth - margin) {
                    left = viewportWidth - margin - tooltipWidth;
                }
                if (top < margin) top = margin;
                if (top + tooltipHeight > viewportHeight - margin) {
                    top = viewportHeight - margin - tooltipHeight;
                }
        
                tooltipEl.style.top = `${top}px`;
                tooltipEl.style.left = `${left}px`;
        
                // Arrow positioning
                const elementCenterH = rect.left + rect.width / 2;
                const arrowPositionH = elementCenterH - left;
                tooltipEl.style.setProperty('--arrow-left-pos', `${arrowPositionH}px`);
            }
        }, [currentStepIndex, isActive, options?.isCardFlipped]);


        if (!isActive) return null;

        return (
             <div className="onboarding-container">
                <div ref={holeRef} className="onboarding-hole" />
                <div ref={tooltipRef} className="onboarding-tooltip" style={{
                    '--arrow-top-pos': '50%', // Default values
                    '--arrow-left-pos': '50%'
                } as React.CSSProperties}>
                    <div className="onboarding-tooltip-arrow" />
                     <button onClick={onEnd} className="onboarding-close-btn" aria-label="Fechar tour"><XIcon /></button>
                    <h4>{currentStep.title}</h4>
                    <p>{currentStep.text}</p>
                    <div className="onboarding-nav">
                        <div className="onboarding-dots">
                            {steps.map((_, i) => <div key={i} className={`onboarding-dot ${i === currentStepIndex ? 'active' : ''}`} />)}
                        </div>
                        <div className="onboarding-nav-buttons">
                           {currentStepIndex > 0 && <button onClick={onPrev} className="btn btn-cancel">Anterior</button>}
                           {currentStepIndex < steps.length - 1 
                                ? <button onClick={onNext} className="btn">Próximo</button>
                                : <button onClick={onEnd} className="btn">Começar!</button>
                           }
                        </div>
                    </div>
                </div>
            </div>
        );
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

// --- RENDER APP ---
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}