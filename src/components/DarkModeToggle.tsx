
import React from 'react';
import { Theme } from '../types';
import { MoonIcon, SunIcon } from './Icons';

export const DarkModeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button onClick={toggleTheme} className="icon-btn" aria-label={`Ativar modo ${theme === 'light' ? 'escuro' : 'claro'}`}>
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
);
