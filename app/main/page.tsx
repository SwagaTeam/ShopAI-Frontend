'use client';
import React from 'react';
import './main.css';
import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import {ItemInterface} from "@/data/interfaces/ItemInterface";
import {CircleDollarSign, Handbag, HeartIcon, SearchIcon} from "lucide-react";

const personalSelections: ItemInterface[] = [
    { productId: "1", productName: 'Ноутбук для работы', price: 75990, imageUrl: "https://i1-e.pinimg.com/736x/d6/46/14/d646147952636b44ac290ff5b14a5524.jpg"},
    { productId: "2", productName: 'Подарок маме', price: 2890, imageUrl: "https://i1-e.pinimg.com/1200x/37/d8/08/37d8086c81539907ae60b680825ffd69.jpg"},
    { productId: "3", productName: 'Спортивная форма', price: 4500, imageUrl: "https://i1-e.pinimg.com/736x/4b/5b/9b/4b5b9bd24eac9539ff301ac9c7332144.jpg"},
    { productId: "4", productName: 'Смартфон флагман', price: 89990, imageUrl: "https://i1-e.pinimg.com/1200x/91/16/db/9116dbc4ff54139192b5658911583d3f.jpg"},
    { productId: "5", productName: 'Наушники беспроводные', price: 12990, imageUrl: "https://i1-e.pinimg.com/736x/a7/92/e2/a792e27edaadf63065ae62bb0188cab0.jpg"},
];

export default function ShopAIPage() {
    return (
        <div className="page">
            <Header isCompact={false} />

            <main className="main">
                <section className="selections">
                    <div className="section__header">
                        <h2 className="section__title">Личные подборки от Шопи</h2>
                        <a href="#" className="section__link">Смотреть все &gt;</a>
                    </div>

                    <div className="selections__grid">
                        {personalSelections.map((item: ItemInterface) => (
                            <ProductCard item={item} key={item.productId} />
                        ))}
                    </div>
                </section>

                <section className="dashboard">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card__icon">
                                <SearchIcon size={17} color="#155DFC" />
                            </div>
                            <div className="stat-card__value">12</div>
                            <div className="stat-card__label">Активных подборок</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">
                                <HeartIcon size={17} color="#155DFC"/>
                            </div>
                            <div className="stat-card__value">24</div>
                            <div className="stat-card__label">В избранном</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">
                                <Handbag size={17} color="#155DFC"/>
                            </div>
                            <div className="stat-card__value">8</div>
                            <div className="stat-card__label">Заказов в этом месяце</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">
                                <CircleDollarSign size={17} color="#155DFC"/>
                            </div>
                            <div className="stat-card__value">12 500 ₽</div>
                            <div className="stat-card__label">Сумма выкупа</div>
                        </div>
                    </div>

                    <div className="banner">
                        <img src="/images/robot-love.png" alt="Шопи"/>
                        <div className="banner__content">
                            <h2 className="banner__title">Рады видеть Вас в ShopAI!</h2>
                            <p className="banner__subtitle">ИИ-помощник Шопи подберет идеальные товары</p>
                            <div className="banner__actions">
                                <button className="btn btn--white">Подобрать товары с ИИ</button>
                                <button className="btn btn--outline-white">Смотреть рекомендации</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="recommendations">
                    <div className="recommendations__grid">
                        {personalSelections.map((item: ItemInterface) => (
                            <ProductCard item={item} key={item.productId} />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
