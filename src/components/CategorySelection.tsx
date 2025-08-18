
import React from 'react';
import { DeckInfo } from '../types';

export const CategorySelection: React.FC<{ 
    decks: DeckInfo[]; 
    onSelectCategory: (category: string) => void;
}> = ({ decks, onSelectCategory }) => (
    <div className="category-selection-view">
        <h2>Escolha uma categoria para revisar</h2>
        <ul className="category-list">
            {decks.map(({ name, count }) => (
                <li key={name}>
                    <button className="category-btn" onClick={() => onSelectCategory(name)}>
                        <span>{name}</span>
                        <span className="category-due-count">{count}</span>
                    </button>
                </li>
            ))}
        </ul>
    </div>
);
