
import { Card, FeedbackType, UserProfile, NotificationPermissionStatus } from './types';

// --- HELPERS ---
export const calculateNextDueDate = (interval: number): Date => {
    const now = new Date();
    now.setDate(now.getDate() + interval);
    now.setHours(5, 0, 0, 0); // Due at 5 AM
    return now;
};

export const calculateSuperMemo2 = (card: Card, quality: FeedbackType): Pick<Card, 'repetitions' | 'easinessFactor' | 'interval' | 'dueDate'> => {
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


export const getAffinityClassName = (repetitions: number): string => {
    if (repetitions === 0) return 'affinity-low'; // New or failed cards
    if (repetitions <= 4) return 'affinity-mid'; // Learning cards
    return 'affinity-high'; // Well-known cards
};

export const requestNotificationPermission = async (): Promise<NotificationPermissionStatus> => {
    if (!('Notification' in window)) return 'unsupported';
    return await Notification.requestPermission();
};

export const manageNotifications = (profile: UserProfile, streak: number) => {
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

export const playFeedbackSound = (type: FeedbackType) => {
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
