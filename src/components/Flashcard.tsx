
import React, { useRef, useState, useLayoutEffect } from 'react';
import { Card } from '../types';
import { XIcon, CheckIcon, StarIcon } from './Icons';

export const Flashcard: React.FC<{
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
