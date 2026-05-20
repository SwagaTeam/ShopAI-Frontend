'use client';
import React, { useEffect } from 'react';
import './main.css';
import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import {CircleDollarSign, Handbag, HeartIcon, SearchIcon} from "lucide-react";
import { useProductsStore } from '@/data/store/useProductsStore';

export default function ShopAIPage() {
    const { popular, latest, isLoading, fetchMainPageProducts } = useProductsStore();

    useEffect(() => {
        fetchMainPageProducts(50);
    }, [fetchMainPageProducts]);

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
                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : popular.length > 0 ? (
                            popular.map((item) => (
                                <ProductCard 
                                    item={{
                                        productId: item.id,
                                        productName: item.name,
                                        price: item.price,
                                        imageUrl: item.imageUrl
                                    }} 
                                    key={item.id} 
                                />
                            ))
                        ) : (
                            <p>Нет товаров</p>
                        )}
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
                    <div className="section__header">
                        <h2 className="section__title">Новые поступления</h2>
                        <a href="#" className="section__link">Смотреть все &gt;</a>
                    </div>
                    <div className="recommendations__grid">
                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : latest.length > 0 ? (
                            latest.map((item) => (
                                <ProductCard 
                                    item={{
                                        productId: item.id,
                                        productName: item.name,
                                        price: item.price,
                                        imageUrl: item.imageUrl
                                    }} 
                                    key={item.id} 
                                />
                            ))
                        ) : (
                            <p>Нет товаров</p>
                        )}
                    </div>
                </section>

            </main>
        </div>
    );
}
