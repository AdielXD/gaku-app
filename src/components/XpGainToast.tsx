
import React from 'react';

export const XpGainToast: React.FC<{ amount: number }> = ({ amount }) => (
    <div className="xp-toast-container">
        <div className="xp-toast-content">
            +{amount} XP
        </div>
    </div>
);
