'use client';
import React from 'react';
import './main.css';
import {Header} from "@/app/components/header/header";
import {ProductCard} from "@/app/components/product-card/product-card";
import {ItemInterface} from "@/data/interfaces/ItemInterface";

// --- Моковые данные ---
const personalSelections: ItemInterface[] = [
    { productId: "1", productName: 'Ноутбук для работы', price: 75990, imageUrl: "https://i1-e.pinimg.com/1200x/63/71/13/63711329b647e48e71063efbb5932a20.jpg"},
    { productId: "2", productName: 'Подарок маме', price: 2890, imageUrl: "https://i.pinimg.com/736x/f6/9d/ad/f69dadc96259b2831336e0a3c007c511.jpg"},
    { productId: "3", productName: 'Спортивная форма', price: 4500, imageUrl: "https://i.pinimg.com/736x/7f/e0/a7/7fe0a77c3309a65d51d7a30c297dc449.jpg"},
    { productId: "4", productName: 'Смартфон флагман', price: 89990, imageUrl: "https://i1-e.pinimg.com/1200x/91/16/db/9116dbc4ff54139192b5658911583d3f.jpg"},
    { productId: "5", productName: 'Наушники беспроводные', price: 12990, imageUrl: "https://i1-e.pinimg.com/736x/52/f2/ad/52f2ad12342c984f6b4c1f35c7a22ed9.jpg"},
];

export default function ShopAIPage() {
    return (
        <div className="page">
            <Header />
            {/* Main Content */}
            <main className="main">

                {/* Selections Section */}
                <section className="selections">
                    <div className="section__header">
                        <h2 className="section__title">Личные подборки от Шопи</h2>
                        <a href="#" className="section__link">Смотреть все &gt;</a>
                    </div>

                    <div className="selections__grid">
                        {personalSelections.map((item: ItemInterface) => (
                            <ProductCard item={item} />
                        ))}
                    </div>
                </section>

                {/* Dashboard Section */}
                <section className="dashboard">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                            <div className="stat-card__value">12</div>
                            <div className="stat-card__label">Активных подборок</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
                            <div className="stat-card__value">24</div>
                            <div className="stat-card__label">В избранном</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                            <div className="stat-card__value">8</div>
                            <div className="stat-card__label">Заказов в этом месяце</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                            <div className="stat-card__value">12 500 ₽</div>
                            <div className="stat-card__label">Сумма выкупа</div>
                        </div>
                    </div>

                    <div className="banner">
                        <div className="banner__content">
                            <h2 className="banner__title">Рады видеть Вас в ShopAI!</h2>
                            <p className="banner__subtitle">ИИ-помощник Шопи подберет идеальные товары</p>
                            <div className="banner__actions">
                                <button className="btn btn--white">Подобрать товары с ИИ</button>
                                <button className="btn btn--outline-white">Смотреть рекомендации</button>
                            </div>
                        </div>
                        {/* Иллюстрация робота (плейсхолдер) */}
                        <div className="banner__illustration">🤖</div>
                    </div>
                </section>

                {/* Recommendations Section */}
                <section className="recommendations">
                    <div className="recommendations__grid">
                        {personalSelections.map((item: ItemInterface) => (
                            <ProductCard item={item} />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}