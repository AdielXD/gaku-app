
import React from 'react';
import { FeedbackType, XP_MAP } from '../types';

export const Controls: React.FC<{
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
