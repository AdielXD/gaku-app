
import React, { useLayoutEffect, useRef } from 'react';
import { XIcon } from './Icons';

export const OnboardingTour: React.FC<{
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
