'use client';

import React, {useState, useEffect, Suspense} from 'react';
import {Sparkles, MessageSquare, Store, Loader2, RefreshCw, WandSparkles} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShopStore } from '@/data/store/useShopStore';
import './create-shop.css';

function CreateShopFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('editId');
    const { createShop, updateShop, isSubmittingShop, error, shop: currentShop, fetchShop } = useShopStore();

    const [name, setName] = useState('');
    const [urlAlias, setUrlAlias] = useState('');
    const [description, setDescription] = useState('');

    // AI States
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [aiDescription, setAiDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

    const [selectedColor, setSelectedColor] = useState('#2563eb');
    const [isGradientMode, setIsGradientMode] = useState(false);
    const [gradColor1, setGradColor1] = useState('#2563eb');
    const [gradColor2, setGradColor2] = useState('#1d4ed8');

    // Эффект для загрузки данных при редактировании
    useEffect(() => {
        if (editId) {
            fetchShop(editId);
        }
    }, [editId, fetchShop]);

    // Эффект для заполнения полей при получении данных магазина
    useEffect(() => {
        if (editId && currentShop && currentShop.id === editId) {
            setName(currentShop.name);
            setUrlAlias(currentShop.urlAlias);
            setDescription(currentShop.description || '');

            const color = currentShop.logoPath || '#2563eb';
            if (color.includes('gradient')) {
                setIsGradientMode(true);
                const colors = color.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g);
                if (colors && colors.length >= 2) {
                    setGradColor1(colors[0]);
                    setGradColor2(colors[1]);
                }
            } else {
                setIsGradientMode(false);
                setSelectedColor(color);
            }
        }
    }, [editId, currentShop]);

    const PRESET_COLORS = [
        '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4',
        'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
    ];

    const getBrightness = (color: string): number => {
        if (!color) return 0;
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2]+hex[2] : hex.substring(4, 6), 16);
            return (r * 299 + g * 587 + b * 114) / 1000;
        }
        if (color.includes('gradient')) {
            const matches = color.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g);
            if (matches) {
                const brightnesses = matches.map(getBrightness);
                return Math.max(...brightnesses);
            }
        }
        return 0;
    };

    const currentColor = isGradientMode
        ? `linear-gradient(135deg, ${gradColor1} 0%, ${gradColor2} 100%)`
        : selectedColor;

    const brightness = getBrightness(currentColor);
    const isTooLight = brightness > 225;

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
        if (isTooLight) return;

        if (editId) {
            await updateShop(editId, name, urlAlias);
            router.push(`/admin/shop/${editId}/products`);
        } else {
            const success = await createShop({
                name,
                urlAlias,
                description,
                logoPath: currentColor
            });
            if (success) {
                router.push('/admin/shops');
            }
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
                <h1 className="admin-shop-create-title">Создать магазин</h1>
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
                        <div className="create-shop__section-header">
                            <h2 className="create-shop__section-title">Оформление</h2>
                            <div className="create-shop__mode-toggle">
                                <button
                                    type="button"
                                    className={`mode-btn ${!isGradientMode ? 'is-active' : ''}`}
                                    onClick={() => setIsGradientMode(false)}
                                >
                                    Цвет
                                </button>
                                <button
                                    type="button"
                                    className={`mode-btn ${isGradientMode ? 'is-active' : ''}`}
                                    onClick={() => setIsGradientMode(true)}
                                >
                                    Градиент
                                </button>
                            </div>
                        </div>

                        <div className="create-shop__color-picker">
                            {!isGradientMode ? (
                                <>
                                    <div className="create-shop__color-presets">
                                        {PRESET_COLORS.filter(c => !c.includes('gradient')).map((color, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`create-shop__color-option ${selectedColor === color ? 'is-active' : ''}`}
                                                style={{ background: color }}
                                                onClick={() => setSelectedColor(color)}
                                            />
                                        ))}
                                    </div>

                                    <div className="create-shop__custom-color">
                                        <label className="create-shop__label">Свой цвет</label>
                                        <div className="create-shop__custom-color-input-wrapper">
                                            <input
                                                type="color"
                                                className="create-shop__color-input"
                                                value={selectedColor.startsWith('#') ? selectedColor : '#2563eb'}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="create-shop__input"
                                                value={selectedColor}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="create-shop__color-presets">
                                        {PRESET_COLORS.filter(c => c.includes('gradient')).map((color, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`create-shop__color-option ${currentColor === color ? 'is-active' : ''}`}
                                                style={{ background: color }}
                                                onClick={() => {
                                                    const colors = color.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g);
                                                    if (colors && colors.length >= 2) {
                                                        setGradColor1(colors[0]);
                                                        setGradColor2(colors[1]);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="create-shop__custom-color">
                                        <label className="create-shop__label">Настройка градиента</label>
                                        <div className="create-shop__gradient-inputs">
                                            <div className="gradient-input-group">
                                                <input
                                                    type="color"
                                                    className="create-shop__color-input"
                                                    value={gradColor1}
                                                    onChange={(e) => setGradColor1(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className="create-shop__input"
                                                    value={gradColor1}
                                                    onChange={(e) => setGradColor1(e.target.value)}
                                                />
                                            </div>
                                            <div className="gradient-arrow">→</div>
                                            <div className="gradient-input-group">
                                                <input
                                                    type="color"
                                                    className="create-shop__color-input"
                                                    value={gradColor2}
                                                    onChange={(e) => setGradColor2(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className="create-shop__input"
                                                    value={gradColor2}
                                                    onChange={(e) => setGradColor2(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {isTooLight && (
                            <div className="create-shop__warning">
                                Этот цвет слишком светлый! Текст и элементы управления могут быть плохо видны.
                                Пожалуйста, выберите более темный оттенок.
                            </div>
                        )}
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
                            disabled={isSubmittingShop || isTooLight}
                        >
                            {isSubmittingShop ? (editId ? 'Сохранение...' : 'Создание...') : (editId ? 'Сохранить изменения' : 'Создать магазин')}
                        </button>
                    </div>
                </form>
            </div>

            <div className="create-shop__preview-container">
                <div className="create-shop__preview-label">Предпросмотр</div>
                <div className="shop-preview">
                    <div className="shop-preview__banner" style={{ background: currentColor }}></div>
                    <div className="shop-preview__content">
                        <div className="shop-preview__header">
                            <div className="shop-preview__logo" style={{ background: currentColor }}>
                                <Store size={24} />
                            </div>
                            <div className="shop-preview__info">
                                <div className="shop-preview__name">{name || 'Название магазина'}</div>
                                <div className="shop-preview__url">shopai.ru/{urlAlias || 'your-alias'}</div>
                            </div>
                        </div>
                        <div className="shop-preview__actions">
                            <button className="shop-preview__btn" type="button" style={{ background: currentColor }}>Подписаться</button>
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

export default function CreateShopPage() {
    return (
        <Suspense fallback={<div>Загрузка формы...</div>}>
            <CreateShopFormContent />
        </Suspense>
    );
}