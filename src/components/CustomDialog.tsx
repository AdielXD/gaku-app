
import React, { useState, useEffect, useRef } from 'react';
import { ModalConfig } from '../types';

export const CustomDialog: React.FC<ModalConfig & { onDismiss: () => void }> = ({
    type, title, message, confirmText, cancelText, isDestructive, onConfirm, onCancel, onDismiss, initialValue
}) => {
    const [inputValue, setInputValue] = useState(initialValue || '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (type === 'prompt' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [type]);

    const handleConfirm = () => {
        onConfirm(inputValue);
        onDismiss();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        onDismiss();
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Do not handle Enter key if the target is the dialog's select input
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'SELECT') {
            if (type === 'prompt' && !inputValue.trim()) return;
            handleConfirm();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="custom-dialog-content" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
                <h3>{title}</h3>
                <div className="custom-dialog-message">{message}</div>
                {type === 'prompt' && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nome do baralho..."
                    />
                )}
                <div className="dialog-actions">
                    <button onClick={handleCancel} className="btn btn-cancel">
                        {cancelText || 'Cancelar'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`btn ${isDestructive ? 'btn-destructive' : ''}`}
                        disabled={type === 'prompt' && !inputValue.trim()}
                    >
                        {confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
