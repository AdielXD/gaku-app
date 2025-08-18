
import React, { useState, useRef } from 'react';
import { ReviewSettings, UserProfile, NotificationPermissionStatus } from '../types';
import { SettingsIcon, ZapIcon, BellIcon, HelpCircleIcon, EyeIcon, CloudUploadIcon, CloudDownloadIcon, FileTextIcon } from './Icons';

export const SettingsView: React.FC<{
    settings: { review: ReviewSettings, profile: UserProfile };
    onReviewSettingsChange: (newSettings: Partial<ReviewSettings>) => void;
    onProfileChange: (newProfile: Partial<UserProfile>) => void;
    onBackup: () => string;
    onRestore: (data: string) => void;
    onExportJson: () => void;
    onExportCsv: () => void;
    onImport: (file: File) => void;
    notificationPermission: NotificationPermissionStatus;
    onRequestPermission: () => void;
    onStartReviewTutorial: () => void;
}> = ({ settings, onReviewSettingsChange, onProfileChange, onBackup, onRestore, onExportJson, onExportCsv, onImport, notificationPermission, onRequestPermission, onStartReviewTutorial }) => {
    const [backupData, setBackupData] = useState('');
    const [restoreData, setRestoreData] = useState('');
    const [showCode, setShowCode] = useState(false);
    const restoreInputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const permissionStatusText: Record<NotificationPermissionStatus, string> = {
        default: 'Pendente',
        granted: 'Permitido',
        denied: 'Bloqueado',
        unsupported: 'Não suportado'
    };

    const handleBackup = () => {
        const data = onBackup();
        setBackupData(data);
        setShowCode(true);
        navigator.clipboard.writeText(data).then(() => {
             alert('Código de backup copiado para a área de transferência!');
        }, () => {
            alert('Não foi possível copiar o código. Por favor, copie manualmente.');
        });
    };

    const handleRestore = () => {
        if (restoreData.trim() === '') {
            alert('Por favor, cole seu código de backup.');
            return;
        }
        if (confirm('Restaurar os dados substituirá todos os seus baralhos e cartas atuais. Tem certeza que deseja continuar?')) {
            onRestore(restoreData);
            setRestoreData('');
            alert('Dados restaurados com sucesso!');
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
        }
        // Reset file input to allow selecting the same file again
        if (e.target) {
          e.target.value = '';
        }
    };

    return (
        <div className="settings-view">
            <h2>Ajustes</h2>
            <div className="settings-section">
                 <h3><SettingsIcon /> Configurações de Revisão</h3>
                 <div className="form-group">
                    <label htmlFor="review-order">Ordem da Revisão</label>
                    <select id="review-order" className="settings-select" value={settings.review.order} onChange={e => onReviewSettingsChange({ order: e.target.value as ReviewSettings['order'] })}>
                        <option value="default">Padrão (Mais antigos primeiro)</option>
                        <option value="random">Aleatória</option>
                        <option value="newestFirst">Mais novas primeiro</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="daily-limit">Limite Diário de Cartas (0 = sem limite)</label>
                    <input id="daily-limit" className="settings-input" type="number" min="0" value={settings.review.dailyLimit} onChange={e => onReviewSettingsChange({ dailyLimit: parseInt(e.target.value, 10) || 0 })} />
                </div>
            </div>
            <div className="settings-section">
                <h3><ZapIcon /> Metas e Lembretes</h3>
                 <div className="form-group">
                    <label htmlFor="daily-goal">Meta Diária de XP</label>
                    <input id="daily-goal" className="settings-input" type="number" min="0" step="10" value={settings.profile.dailyGoal} onChange={e => onProfileChange({ dailyGoal: parseInt(e.target.value, 10) || 0 })} />
                </div>
                 <div className="form-group">
                    <label htmlFor="reminder-time">Horário do Lembrete Diário</label>
                    <input id="reminder-time" className="settings-input" type="time" value={settings.profile.reminderTime} onChange={e => onProfileChange({ reminderTime: e.target.value })} />
                </div>
            </div>
            <div className="settings-section">
                <h3><BellIcon /> Notificações de Lembrete</h3>
                {notificationPermission === 'unsupported' ? (
                    <p>Seu navegador não suporta notificações.</p>
                ) : (
                    <>
                        <p className="settings-description">Status atual: <strong>{permissionStatusText[notificationPermission]}</strong></p>
                        <p className="settings-description">
                            Receba um lembrete diário para não esquecer de revisar suas cartas.
                        </p>
                        {notificationPermission !== 'granted' && (
                            <button className="btn" onClick={onRequestPermission}>
                                Ativar Notificações
                            </button>
                        )}
                        {notificationPermission === 'denied' && (
                             <p className="settings-description" style={{fontSize: '0.85rem'}}>
                                Para receber notificações, você precisa permitir nas configurações de site do seu navegador.
                            </p>
                        )}
                    </>
                )}
            </div>
            <div className="settings-section">
                <h3><HelpCircleIcon /> Ajuda</h3>
                <p className="settings-description">
                    Não tem certeza de como funciona a revisão de cartas? Veja o tutorial novamente.
                </p>
                <div className="backup-actions">
                     <button className="btn btn-outline" onClick={onStartReviewTutorial}>
                        <EyeIcon /> Como funciona a revisão?
                    </button>
                </div>
            </div>
            <div className="settings-section">
                <h3><CloudUploadIcon/> Backup & Restauração</h3>
                 <p className="settings-description">
                    Salve todos os seus dados em um código de texto ou exporte-os como um arquivo JSON (completo) ou CSV (para planilhas).
                </p>
                <div className="backup-actions">
                    <button className="btn" onClick={handleBackup}><CloudDownloadIcon/> Gerar Código de Backup</button>
                    <button className="btn" onClick={onExportJson}><FileTextIcon/> Exportar (JSON)</button>
                    <button className="btn" onClick={onExportCsv}><FileTextIcon/> Exportar (CSV)</button>
                </div>

                {showCode && (
                     <div className="code-display-area">
                        <label htmlFor="backup-code">Seu código de backup (guarde em um local seguro):</label>
                        <textarea id="backup-code" readOnly value={backupData} rows={5}></textarea>
                    </div>
                )}
                
                <h4 className="restore-title">Restaurar Dados</h4>
                <div className="backup-actions">
                    <button className="btn" onClick={() => fileInputRef.current?.click()}><CloudUploadIcon/> Importar Arquivo</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".csv,.json" style={{ display: 'none' }} />
                </div>
                 <textarea
                    ref={restoreInputRef}
                    value={restoreData}
                    onChange={e => setRestoreData(e.target.value)}
                    placeholder="Cole seu código de backup aqui..."
                    rows={5}
                />
                 <button className="btn" onClick={handleRestore} disabled={!restoreData.trim()}>Restaurar do Código</button>
            </div>
        </div>
    );
};
