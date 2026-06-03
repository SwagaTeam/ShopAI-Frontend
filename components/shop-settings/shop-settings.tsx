'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import './shop-settings.css';

interface ShopSettingsProps {
    shopName: string;
    urlAlias: string;
    onSave: (name: string, urlAlias: string) => Promise<void>;
    onDelete: () => Promise<void>;
}

export const ShopSettings = ({ shopName, urlAlias, onSave, onDelete }: ShopSettingsProps) => {
    const [formData, setFormData] = useState({
        name: shopName,
        urlAlias: urlAlias
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
            name: shopName,
            urlAlias: urlAlias
        });
    }, [shopName, urlAlias]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(formData.name, formData.urlAlias);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Вы уверены? Удаление магазина безвозвратно.')) {
            await onDelete();
        }
    };

    return (
        <div className="shop-settings">
            <section className="shop-settings__section">
                <h2 className="shop-settings__title">Настройки магазина</h2>

                <div className="shop-settings__form">
                    <div className="shop-settings__field">
                        <label className="shop-settings__label">Название магазина</label>
                        <input
                            type="text"
                            className="shop-settings__input"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Введите название магазина"
                        />
                    </div>

                    <div className="shop-settings__field">
                        <label className="shop-settings__label">URL (адрес магазина)</label>
                        <div className="shop-settings__url-wrapper">
                            <span className="shop-settings__url-prefix">shopal.com/</span>
                            <input
                                type="text"
                                className="shop-settings__input shop-settings__input--inline"
                                value={formData.urlAlias}
                                onChange={(e) => setFormData(prev => ({ ...prev, urlAlias: e.target.value }))}
                                placeholder="electronics-shop"
                            />
                        </div>
                    </div>

                    <button 
                        className="shop-settings__save-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </div>
            </section>

            <section className="shop-settings__section shop-settings__section--danger">
                <h2 className="shop-settings__title">Опасная зона</h2>
                <p className="shop-settings__warning-text">
                    Удаление магазина приведет к безвозвратной потере всех данных, включая товары, категории и заказы.
                </p>
                <button 
                    className="shop-settings__delete-btn"
                    onClick={handleDelete}
                >
                    <Trash2 size={18} />
                    Удалить магазин
                </button>
            </section>
        </div>
    );
};
