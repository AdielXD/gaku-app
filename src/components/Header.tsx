
import React from 'react';
import { UserProfile, Theme } from '../types';
import { FlameIcon, ZapIcon } from './Icons';
import { StatsButton } from './StatsButton';
import { DarkModeToggle } from './DarkModeToggle';

export const Header: React.FC<{
    profile: UserProfile;
    onStatsClick: () => void;
    theme: Theme;
    toggleTheme: () => void;
}> = ({ profile, onStatsClick, theme, toggleTheme }) => {
    const { streak, dailyXp, dailyGoal } = profile;
    const xpProgress = dailyGoal > 0 ? (dailyXp / dailyGoal) * 100 : 0;

    return (
        <header>
            <div className="header-main">
                <h1>Gaku</h1>
                <div className="header-gamification">
                    <div className="streak-display" title={`Sua ofensiva atual é de ${streak} dias`}>
                        <FlameIcon />
                        <span>{streak}</span>
                    </div>
                </div>
            </div>
            <div className="header-side">
                 <div className="daily-goal-progress" title={`Meta diária: ${dailyXp} / ${dailyGoal} XP`}>
                    <div className="daily-goal-bar" style={{ width: `${Math.min(xpProgress, 100)}%` }}></div>
                    <ZapIcon />
                    <span>{dailyXp}/{dailyGoal}</span>
                </div>
                <StatsButton onClick={onStatsClick} />
                <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
};
