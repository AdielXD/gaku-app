
import React, { useMemo } from 'react';
import { Card, StudyDay } from '../types';
import { ArrowLeftIcon, BarChartIcon, CalendarIcon } from './Icons';

export const StatsView: React.FC<{ cards: Card[], studyHistory: StudyDay[], onBack: () => void }> = ({ cards, studyHistory, onBack }) => {

    const stats = useMemo(() => {
        const totalCards = cards.length;
        const matureCards = cards.filter(c => c.interval >= 21).length;
        const learningCards = cards.filter(c => c.interval > 0 && c.interval < 21).length;
        const newCards = cards.filter(c => c.interval === 0).length;

        const totalReviewed = studyHistory.reduce((sum, day) => sum + day.reviewed, 0);
        const totalCorrect = studyHistory.reduce((sum, day) => sum + day.correct, 0);
        const successRate = totalReviewed > 0 ? ((totalCorrect / totalReviewed) * 100).toFixed(0) : '0';

        return { totalCards, matureCards, learningCards, newCards, totalReviewed, successRate };
    }, [cards, studyHistory]);

    const masteryData = [
        { label: 'Novas', value: stats.newCards, className: 'new' },
        { label: 'Aprendendo', value: stats.learningCards, className: 'learning' },
        { label: 'Maduras', value: stats.matureCards, className: 'mature' }
    ];
    const maxMasteryValue = Math.max(...masteryData.map(d => d.value), 1);

    const activityHistoryData = useMemo(() => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const studyDay = studyHistory.find(d => d.date === dateString);
            days.push({
                date: date,
                count: studyDay ? studyDay.reviewed : 0,
            });
        }
        return days;
    }, [studyHistory]);

    const maxActivityValue = Math.max(...activityHistoryData.map(d => d.count), 1);

    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
    const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric' });

    if (cards.length === 0) {
        return (
            <div className="stats-view">
                 <div className="deck-card-list-header">
                    <button onClick={onBack} className="back-btn" aria-label="Voltar"><ArrowLeftIcon/></button>
                    <h2 style={{flexGrow: 1}}>Estatísticas</h2>
                </div>
                <div className="empty-state-container">
                    <BarChartIcon />
                    <h3>Sem dados para exibir</h3>
                    <p>Comece a adicionar e revisar cartas para ver suas estatísticas de aprendizado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-view">
            <div className="deck-card-list-header">
                <button onClick={onBack} className="back-btn" aria-label="Voltar"><ArrowLeftIcon/></button>
                <h2 style={{flexGrow: 1}}>Estatísticas</h2>
            </div>
            <div className="stats-cards-container">
                <div className="stat-card">
                    <span className="stat-value">{stats.totalCards}</span>
                    <span className="stat-label">Total de Cartas</span>
                </div>
                 <div className="stat-card">
                    <span className="stat-value">{stats.totalReviewed}</span>
                    <span className="stat-label">Revisões Totais</span>
                </div>
                 <div className="stat-card">
                    <span className="stat-value">{stats.successRate}<small>%</small></span>
                    <span className="stat-label">Taxa de Acerto</span>
                </div>
            </div>

             <div className="activity-chart-container">
                <h3><CalendarIcon /> Histórico de Atividade (Últimos 30 dias)</h3>
                <div className="activity-chart">
                    {activityHistoryData.map(({ date, count }, index) => {
                        const isFirstOfMonth = date.getDate() === 1;
                        const isMonday = date.getDay() === 1;
                        const showLabel = isFirstOfMonth || isMonday;
                        const labelText = isFirstOfMonth 
                            ? monthFormatter.format(date)
                            : dayFormatter.format(date);
                        
                        return (
                           <div key={index} className="activity-bar-wrapper" title={`${dayFormatter.format(date)} de ${monthFormatter.format(date)}: ${count} revisões`}>
                                <div className="activity-bar-value">{count}</div>
                                <div 
                                    className={`activity-bar ${ (isFirstOfMonth || isMonday) ? 'significant-day' : ''}`}
                                    style={{ height: `${(count / maxActivityValue) * 100}%` }}
                                ></div>
                                <div className={`activity-bar-label ${isFirstOfMonth ? 'is-month' : ''}`}>
                                    {showLabel ? labelText : ''}
                                 </div>
                           </div>
                        );
                    })}
                </div>
            </div>

            <div className="mastery-chart-container">
                <h3>Domínio das Cartas</h3>
                <div className="mastery-chart">
                    {masteryData.map(data => (
                        <div key={data.label} className="chart-bar-container">
                            <div className="chart-bar-value">{data.value}</div>
                            <div
                                className={`chart-bar ${data.className}`}
                                style={{ height: `${(data.value / maxMasteryValue) * 100}%` }}
                                title={`${data.label}: ${data.value}`}
                            ></div>
                            <div className="chart-bar-label">{data.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
