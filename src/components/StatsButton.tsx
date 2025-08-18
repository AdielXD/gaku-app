
import React from 'react';
import { BarChartIcon } from './Icons';

export const StatsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="icon-btn" aria-label="Ver estatísticas" id="header-stats-btn">
        <BarChartIcon />
    </button>
);
