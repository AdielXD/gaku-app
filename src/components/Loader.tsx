
import React from 'react';

export const Loader: React.FC<{ isSmall?: boolean }> = ({ isSmall = false }) => (
    <div className={isSmall ? '' : "loader-overlay"}>
        <div className={`loader ${isSmall ? 'small' : ''}`}></div>
    </div>
);
