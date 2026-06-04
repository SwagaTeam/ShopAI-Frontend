'use client';

import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { ProductCard } from '@/components/product-card/product-card';
import { useAiAssistantStore, AiHistoryEntry, AiProduct } from '@/data/store/useAiAssistantStore';
import {
    Send, Sparkles, SlidersHorizontal, Trash2, ChevronDown, ChevronUp,
    Package, ShoppingBag, Tag, Search, Wrench, Smartphone, Gamepad2,
    Home, Shirt, Gift, DollarSign, AlertCircle, ChevronLeft
} from 'lucide-react';
import './ai-assistant.css';
import Link from "next/link";

const quickPrompts = [
    { icon: <Wrench size={16} />, text: 'Всё для ремонта ванной' },
    { icon: <Smartphone size={16} />, text: 'Хороший смартфон до 50 000 ₽' },
    { icon: <Gamepad2 size={16} />, text: 'Подборка для геймера' },
    { icon: <Home size={16} />, text: 'Уютный дом: декор и текстиль' },
    { icon: <Shirt size={16} />, text: 'Мужской деловой гардероб' },
    { icon: <Gift size={16} />, text: 'Подарок девушке на день рождения' },
];

export default function AiAssistantPage() {
    const { history, isLoading, error, sendQuery, clearHistory } = useAiAssistantStore();

    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [limit, setLimit] = useState('');

    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    const handleSend = async () => {
        const trimmed = query.trim();
        if (!trimmed || isLoading) return;

        const bMin = budgetMin ? parseInt(budgetMin) : undefined;
        const bMax = budgetMax ? parseInt(budgetMax) : undefined;
        const lim = limit ? parseInt(limit) : undefined;

        setQuery('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        await sendQuery(trimmed, bMin, bMax, undefined, lim);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickPrompt = (text: string) => {
        setQuery(text);
        inputRef.current?.focus();
    };

    return (
        <div className="ai-page">
            <Head>
                <title>ИИ-помощник ШОПИ — ShopAI</title>
            </Head>

            <div className="ai-page__layout">
                <aside className="ai-page__sidebar">
                    <div className="ai-page__sidebar-header">
                        <div className="ai-page__logo">
                            <Link href="/main" className="ai-page__back-link">
                                <ChevronLeft size={24} />
                            </Link>
                            <div className="ai-page__logo-icon">
                                <img src="/images/robot-love.png" alt="Шопи" />
                            </div>
                            <div>
                                <div className="ai-page__logo-name">ШОПИ</div>
                                <div className="ai-page__logo-sub">ИИ-ассистент</div>
                            </div>
                        </div>
                    </div>

                    <div className="ai-page__sidebar-section">
                        <div className="ai-page__sidebar-label">Вдохновение</div>
                        <div className="ai-page__quick-list">
                            {quickPrompts.map((p, idx) => (
                                <button
                                    key={idx}
                                    className="ai-page__quick-item"
                                    onClick={() => handleQuickPrompt(p.text)}
                                >
                                    <span className="ai-page__quick-icon">{p.icon}</span>
                                    <span className="ai-page__quick-text">{p.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {history.length > 0 && (
                        <div className="ai-page__sidebar-footer">
                            <button className="ai-page__clear-btn" onClick={clearHistory}>
                                <Trash2 size={16} />
                                Очистить диалог
                            </button>
                        </div>
                    )}
                </aside>

                <main className="ai-page__main">
                    <div className="ai-page__chat">
                        <div className="ai-page__chat-container">
                            {history.length === 0 && !isLoading && (
                                <div className="ai-page__welcome">
                                    <div className="ai-page__welcome-glow"></div>
                                    <div className="ai-page__welcome-icon">
                                        <img src="/images/robot-love.png" alt="Шопи"/>
                                    </div>
                                    <h1 className="ai-page__welcome-title">
                                        Что будем искать сегодня?
                                    </h1>
                                    <div className="ai-page__welcome-chips">
                                        {quickPrompts.slice(0, 3).map((p, idx) => (
                                            <button
                                                key={idx}
                                                className="ai-page__welcome-chip"
                                                onClick={() => handleQuickPrompt(p.text)}
                                            >
                                                {p.icon} {p.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {history.map((entry) => (
                                <ChatEntry key={entry.id} entry={entry} />
                            ))}

                            {isLoading && (
                                <div className="ai-page__message ai-page__message--bot">
                                    <div className="ai-page__message-avatar ai-page__message-avatar--bot">
                                        <img src="/images/robot-love.png" alt="Шопи"/>
                                    </div>
                                    <div className="ai-page__message-body">
                                        <div className="ai-page__typing">
                                            <span className="ai-page__typing-dot"></span>
                                            <span className="ai-page__typing-dot"></span>
                                            <span className="ai-page__typing-dot"></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="ai-page__error">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div ref={chatEndRef} className="ai-page__scroll-anchor" />
                        </div>
                    </div>

                    {/* Плавающая панель ввода */}
                    <div className="ai-page__input-wrapper">
                        <div className="ai-page__input-container">
                            {showFilters && (
                                <div className="ai-page__filters">
                                    <div className="ai-page__filters-row">
                                        <div className="ai-page__filter-field">
                                            <label>От (₽)</label>
                                            <input type="number" placeholder="0" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
                                        </div>
                                        <div className="ai-page__filter-field">
                                            <label>До (₽)</label>
                                            <input type="number" placeholder="∞" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
                                        </div>
                                        <div className="ai-page__filter-field">
                                            <label>Лимит</label>
                                            <input type="number" placeholder="10" value={limit} onChange={e => setLimit(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="ai-page__input-row">
                                <button
                                    className={`ai-page__filter-toggle ${showFilters ? 'active' : ''}`}
                                    onClick={() => setShowFilters(!showFilters)}
                                    title="Настройки"
                                >
                                    <SlidersHorizontal size={20} />
                                </button>

                                <textarea
                                    ref={inputRef}
                                    className="ai-page__input"
                                    placeholder="Например: Собери лук для офиса..."
                                    value={query}
                                    onChange={handleTextareaInput}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />

                                <button
                                    className="ai-page__send-btn"
                                    onClick={handleSend}
                                    disabled={!query.trim() || isLoading}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function ChatEntry({ entry }: { entry: AiHistoryEntry }) {
    const [expandedBundle, setExpandedBundle] = useState<number | null>(null);
    const { interpreted, items, bundles } = entry.response;

    const toggleBundle = (idx: number) => {
        setExpandedBundle(expandedBundle === idx ? null : idx);
    };

    const bundleTotal = (bundle: AiProduct[]) => bundle.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="ai-page__entry">
            <div className="ai-page__message ai-page__message--user">
                <div className="ai-page__message-body ai-page__message-body--user">
                    {entry.query}
                </div>
            </div>

            <div className="ai-page__message ai-page__message--bot">
                <div className="ai-page__message-avatar ai-page__message-avatar--bot">
                    <img src="/images/robot-love.png" alt="Шопи"/>
                </div>
                <div className="ai-page__message-body ai-page__message-body--bot">

                    {interpreted && (
                        <div className="ai-page__interpreted">
                            <div className="ai-page__interpreted-header">
                                <Search size={14} />
                                <span>Распознано: <strong>{interpreted.intent}</strong></span>
                            </div>

                            <div className="ai-page__tags-row">
                                {interpreted.keywords?.map((kw, i) => (
                                    <span key={i} className="ai-page__tag ai-page__tag--keyword">{kw}</span>
                                ))}
                                {interpreted.brands?.map((b, i) => (
                                    <span key={`b-${i}`} className="ai-page__tag ai-page__tag--brand">{b}</span>
                                ))}
                                {interpreted.colors?.map((c, i) => (
                                    <span key={`c-${i}`} className="ai-page__tag ai-page__tag--color">{c}</span>
                                ))}
                            </div>

                            {(interpreted.budgetMin > 0 || interpreted.budgetMax > 0) && (
                                <div className="ai-page__budget-line">
                                    <DollarSign size={14} />
                                    <span>Бюджет: {interpreted.budgetMin > 0 ? `от ${interpreted.budgetMin.toLocaleString('ru-RU')} ₽` : ''}
                                        {interpreted.budgetMax > 0 ? ` до ${interpreted.budgetMax.toLocaleString('ru-RU')} ₽` : ''}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {items && items.length > 0 && (
                        <div className="ai-page__results-section">
                            <div className="ai-page__results-header">
                                <ShoppingBag size={18} />
                                <h3>Отдельные товары</h3>
                            </div>
                            <div className="ai-page__products-grid">
                                {items.map(item => (
                                    <ProductCard
                                        item={{
                                            productId: item.id,
                                            productName: item.name,
                                            price: item.price,
                                            imageUrl: item.imageUrl
                                        }}
                                        key={item.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {bundles && bundles.length > 0 && (
                        <div className="ai-page__bundles-section">
                            <div className="ai-page__results-header">
                                <Package size={18} />
                                <h3>Готовые комплекты</h3>
                            </div>
                            <div className="ai-page__bundles-list">
                                {bundles.map((bundle, idx) => (
                                    <div key={idx} className={`ai-page__bundle ${expandedBundle === idx ? 'expanded' : ''}`}>
                                        <button className="ai-page__bundle-header" onClick={() => toggleBundle(idx)}>
                                            <div className="ai-page__bundle-info">
                                                <span className="ai-page__bundle-number">Сет #{idx + 1}</span>
                                                <span className="ai-page__bundle-meta">
                                                    {bundle.length} предметов · <strong>{bundleTotal(bundle).toLocaleString('ru-RU')} ₽</strong>
                                                </span>
                                            </div>
                                            <div className="ai-page__bundle-preview">
                                                {bundle.slice(0, 3).map((item, i) => (
                                                    <img key={i} src={item.imageUrl} alt={item.name} className="ai-page__bundle-thumb" />
                                                ))}
                                                {bundle.length > 3 && (
                                                    <span className="ai-page__bundle-more">+{bundle.length - 3}</span>
                                                )}
                                            </div>
                                            <div className="ai-page__bundle-arrow">
                                                {expandedBundle === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </button>

                                        {expandedBundle === idx && (
                                            <div className="ai-page__bundle-content">
                                                <div className="ai-page__products-grid">
                                                    {bundle.map(item => (
                                                        <ProductCard
                                                            item={{ productId: item.id, productName: item.name, price: item.price, imageUrl: item.imageUrl }}
                                                            key={item.id}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!items || items.length === 0) && (!bundles || bundles.length === 0) && (
                        <div className="ai-page__no-results">
                            Не удалось подобрать товары. Попробуйте уточнить запрос.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}