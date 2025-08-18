
import React from 'react';
import { View } from '../types';
import { EyeIcon, ListIcon, PlusIcon, GlobeIcon, SettingsIcon } from './Icons';

export const NavBar: React.FC<{
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
