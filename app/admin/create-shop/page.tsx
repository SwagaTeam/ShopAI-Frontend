'use client';

import React, { useState, useRef } from 'react';
import {Sparkles, UploadCloud, MessageSquare, Store, ShoppingBag, Loader2, RefreshCw, WandSparkles} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useShopStore } from '@/data/store/useShopStore';
import './create-shop.css';

export default function CreateShopPage() {
    const router = useRouter();
    const { createShop, isSubmittingShop, error } = useShopStore();

    const [name, setName] = useState('');
    const [urlAlias, setUrlAlias] = useState('');
    const [description, setDescription] = useState('');

    // AI States
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [aiDescription, setAiDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (!urlAlias || urlAlias === value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
            setUrlAlias(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        }
    };

    const applySuggestion = (suggestion: string) => {
        setName(suggestion);
        setUrlAlias(suggestion.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        setShowAiPanel(false);
        setAiSuggestions([]);
        setAiDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createShop({
            name,
            urlAlias,
            description,
            logoPath: logoPreview || ''
        });
        if (success) {
            router.push('/admin/shops');
        }
    };

    const generateAiNames = async () => {
        if (!aiDescription.trim()) return;

        setIsGenerating(true);
        setAiSuggestions([]);

        // Имитация задержки сети и "раздумий" ИИ
        await new Promise(resolve => setTimeout(resolve, 1500));

        const desc = aiDescription.toLowerCase();
        let suggestions: string[] = [];

        if (desc.includes('одежд') || desc.includes('мод') || desc.includes('стил')) {
            suggestions = ['VogueVibe', 'StyleSync', 'ThreadFlow Boutique'];
        } else if (desc.includes('техн') || desc.includes('электр') || desc.includes('гаджет')) {
            suggestions = ['CyberPulse', 'TechNova Store', 'GadgetGrid'];
        } else if (desc.includes('ед') || desc.includes('продукт') || desc.includes('вкус')) {
            suggestions = ['FreshFlow Market', 'TasteHaven', 'PureBites'];
        } else if (desc.includes('космет') || desc.includes('красот') || desc.includes('уход')) {
            suggestions = ['GlowAura', 'Lumina Beauty', 'Essence Lab'];
        } else {
            suggestions = ['Nexus Goods', 'Apex Retail', 'Lumina Store'];
        }

        setAiSuggestions(suggestions);
        setIsGenerating(false);
    };

    return (
        <div className="create-shop">
            <div className="create-shop__form-container">
                <form onSubmit={handleSubmit} className="create-shop__form">
                    <section className="create-shop__section">
                        <h2 className="create-shop__section-title">Основное</h2>

                        <div className="create-shop__field">
                            <label className="create-shop__label">Название магазина</label>
                            <div className="create-shop__input-wrapper">
                                <input
                                    type="text"
                                    className="create-shop__input"
                                    placeholder="Введите название"
                                    value={name}
                                    onChange={handleNameChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className={`create-shop__ai-trigger`}
                                    onClick={() => setShowAiPanel(!showAiPanel)}
                                >
                                    <WandSparkles size={16} />
                                    {showAiPanel ? 'Закрыть' : 'Придумать название'}
                                </button>
                            </div>
                        </div>

                        {/* Интерактивная панель ИИ */}
                        {showAiPanel && (
                            <div className="create-shop__ai-panel">
                                <div className="ai-panel__header">
                                    <span className="create-shop__label">Создание названия магазина с помощью ИИ</span>
                                </div>

                                {aiSuggestions.length === 0 ? (
                                    <div className="ai-panel__content">
                                        <textarea
                                            className="ai-panel__textarea"
                                            placeholder="Опишите ваш магазин. Например: аудиотехника Hi-End класса..."
                                            value={aiDescription}
                                            onChange={(e) => setAiDescription(e.target.value)}
                                            autoFocus
                                            disabled={isGenerating}
                                        />
                                        <button
                                            type="button"
                                            className="ai-panel__generate-btn create-shop__ai-trigger"
                                            onClick={generateAiNames}
                                            disabled={!aiDescription.trim() || isGenerating}
                                        >
                                            {isGenerating ? (
                                                <><Loader2 size={16} className="spin" /> Генерируем...</>
                                            ) : (
                                                <><Sparkles size={16} /> Сгенерировать варианты</>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="ai-panel__results">
                                        <div className="ai-panel__results-title">Выберите подходящий вариант:</div>
                                        <div className="ai-panel__suggestions">
                                            {aiSuggestions.map((suggestion, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="ai-panel__suggestion-chip"
                                                    onClick={() => applySuggestion(suggestion)}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className="ai-panel__retry-btn"
                                            onClick={() => setAiSuggestions([])}
                                        >
                                            <RefreshCw size={14} /> Уточнить описание
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="create-shop__field" style={{ marginTop: '20px' }}>
                            <label className="create-shop__label">Описание магазина</label>
                            <textarea
                                className="create-shop__textarea"
                                placeholder="Расскажите о вашем магазине покупателям"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </section>

                    <section className="create-shop__section">
                        <h2 className="create-shop__section-title">Обложка</h2>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                            accept="image/*"
                        />
                        <div
                            className="create-shop__upload"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="create-shop__upload-icon">
                                <UploadCloud size={24} />
                            </div>
                            <div className="create-shop__upload-text">
                                Перетащите обложку или нажмите
                            </div>
                            <div className="create-shop__upload-hint">
                                JPG, PNG или WebP (макс. 5МБ)
                            </div>
                        </div>
                    </section>

                    {error && <div style={{ color: '#ef4444', fontSize: '14px', padding: '0 24px' }}>{error}</div>}

                    <div className="create-shop__footer">
                        <button
                            type="button"
                            className="create-shop__btn-cancel"
                            onClick={() => router.back()}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="create-shop__btn-submit"
                            disabled={isSubmittingShop}
                        >
                            {isSubmittingShop ? 'Создание...' : 'Создать магазин'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="create-shop__preview-container">
                <div className="create-shop__preview-label">Предпросмотр</div>
                <div className="shop-preview">
                    <div className="shop-preview__banner">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Preview" />
                        ) : (
                            'Обложка магазина'
                        )}
                    </div>
                    <div className="shop-preview__content">
                        <div className="shop-preview__header">
                            <div className="shop-preview__logo">
                                <Store size={24} />
                            </div>
                            <div className="shop-preview__info">
                                <div className="shop-preview__name">{name || 'Название магазина'}</div>
                                <div className="shop-preview__url">shopai.ru/{urlAlias || 'your-alias'}</div>
                                <div className="shop-preview__stats">
                                    <ShoppingBag size={14} /> 0 товаров
                                    <Store size={14} /> 0 подписчиков
                                </div>
                            </div>
                        </div>
                        <div className="shop-preview__actions">
                            <button className="shop-preview__btn" type="button">Подписаться</button>
                            <div className="shop-preview__chat">
                                <MessageSquare size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}