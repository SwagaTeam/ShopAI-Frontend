'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './confirm-modal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    isDanger = false
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <button className="confirm-modal__close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="confirm-modal__content">
                    <div className={`confirm-modal__icon ${isDanger ? 'danger' : ''}`}>
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="confirm-modal__title">{title}</h3>
                    <p className="confirm-modal__message">{message}</p>
                </div>

                <div className="confirm-modal__footer">
                    <button
                        className={`btn-primary ${isDanger ? 'btn-danger' : ''}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
