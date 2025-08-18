
import React from 'react';

// --- INTERFACES, TYPES & CONSTANTS ---
export interface Card {
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
export type View = 'review' | 'add' | 'decks' | 'settings' | 'stats' | 'community' | 'bulk-add';
export type NotificationPermissionStatus = NotificationPermission | 'unsupported';
export type Theme = 'light' | 'dark';
export type FeedbackType = 'again' | 'good' | 'easy';
export type DeckInfo = { name: string; count: number; };
export interface StudyDay { date: string; reviewed: number; correct: number; }
export interface PublicDeck { id?: number; name: string; cardCount: number; description: string; author: string; downloads: number; }
export interface PublicCard {
  front: string;
  back: string;
  downloads?: number;
}

export interface UserProfile {
    streak: number;
    lastStudiedDate: string | null; // ISO date string 'YYYY-MM-DD'
    dailyGoal: number; // XP
    dailyXp: number;
    dailyGoalMetDate: string | null; // To track if goal met today
    reminderTime: string; // "HH:MM" format
}

export interface ReviewSettings {
  order: 'default' | 'random' | 'newestFirst';
  dailyLimit: number;
}

export interface ModalConfig {
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

export const XP_MAP = {
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
