'use client';
import React, { useEffect } from 'react';
import './main.css';
import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import {CircleDollarSign, Handbag, HeartIcon, SearchIcon} from "lucide-react";
import { useProductsStore } from '@/data/store/useProductsStore';
import Link from "next/link";
import {ProductCardSkeleton, StatCardSkeleton} from "@/components/skeleton/skeleton";

export default function ShopAIPage() {
    const { popular, latest, stats, isLoading, fetchMainPageProducts } = useProductsStore();

    useEffect(() => {
        fetchMainPageProducts(30);
    }, [fetchMainPageProducts]);

    return (
        <div className="page">
            <Header isCompact={false} />

            <main className="main">
                <section className="selections">
                    <div className="section__header">
                        <h2 className="section__title">Личные подборки от Шопи</h2>
                        {/*<a href="#" className="section__link">Смотреть все &gt;</a>*/}
                    </div>

                    <div className="selections__grid">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))
                        ) : popular.length > 0 ? (
                            popular.slice(0, 5).map((item) => (
                                <ProductCard 
                                    item={item}
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
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <StatCardSkeleton key={i} />
                            ))
                        ) : (
                            <>
                                <div className="stat-card">
                                    <div className="stat-card__icon">
                                        <SearchIcon size={17} color="#155DFC" />
                                    </div>
                                    <div className="stat-card__value">{stats.recentlyViewedCount}</div>
                                    <div className="stat-card__label">Недавно просмотрено</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card__icon">
                                        <HeartIcon size={17} color="#155DFC"/>
                                    </div>
                                    <div className="stat-card__value">{stats.wishlistCount}</div>
                                    <div className="stat-card__label">В избранном</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card__icon">
                                        <Handbag size={17} color="#155DFC"/>
                                    </div>
                                    <div className="stat-card__value">{stats.cartItemsCount}</div>
                                    <div className="stat-card__label">Товаров в корзине</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card__icon">
                                        <CircleDollarSign size={17} color="#155DFC"/>
                                    </div>
                                    <div className="stat-card__value">{stats.cartTotal} ₽</div>
                                    <div className="stat-card__label">Сумма корзины</div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="banner">
                        <img src="/images/robot-love.png" alt="Шопи"/>
                        <div className="banner__content">
                            <h2 className="banner__title">Рады видеть Вас в ShopAI!</h2>
                            <p className="banner__subtitle">ИИ-помощник Шопи подберет идеальные товары</p>
                            <div className="banner__actions">
                                <Link href={"/ai-assistant"} className="btn btn--white">Подобрать товары с ИИ</Link>
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
                    <div className="selections__grid">
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))
                        ) : latest.length > 0 ? (
                            latest.map((item) => (
                                <ProductCard
                                    item={item}
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
