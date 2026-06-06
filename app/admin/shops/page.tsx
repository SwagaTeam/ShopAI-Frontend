'use client';

import React, { useEffect } from 'react';
import { useShopsStore } from '@/data/store/useShopsStore'; // Укажите правильный путь к вашему стору
import { Plus, Store, Box, ShoppingBag, DollarSign, Package } from 'lucide-react';
import './shops.css';

export default function ShopsPage() {
    const { shops, isLoading, fetchMyShops } = useShopsStore();

    useEffect(() => {
        fetchMyShops();
    }, [fetchMyShops]);

    return (
        <div className="shops-page">
            {/* Header */}
            <div className="shops-header">
                <h1 className="shops-title">Мои магазины</h1>
                <button className="shops-create-btn">
                    <Plus size={20} />
                    Создать магазин
                </button>
            </div>

            {/* Блоки аналитики (пока статические заглушки по макету) */}
            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-card__header">
                        <span className="analytics-card__title">Общая выручка</span>
                        <div className="analytics-card__icon bg-blue-light">
                            <DollarSign size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="analytics-card__value">582 340 ₽</div>
                    <div className="analytics-card__trend trend-up">+18% за месяц</div>
                    <div className="analytics-card__chart chart-placeholder-1"></div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card__header">
                        <span className="analytics-card__title">Всего заказов</span>
                        <div className="analytics-card__icon bg-blue-light">
                            <ShoppingBag size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="analytics-card__value">342</div>
                    <div className="analytics-card__trend trend-up">+24 за неделю</div>
                    <div className="analytics-card__chart chart-placeholder-2"></div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card__header">
                        <span className="analytics-card__title">Товаров продано</span>
                        <div className="analytics-card__icon bg-blue-light">
                            <Package size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="analytics-card__value">1 248</div>
                    <div className="analytics-card__trend trend-up">+156 за неделю</div>
                    <div className="analytics-card__chart chart-placeholder-3"></div>
                </div>
            </div>

            {/* Список магазинов */}
            <div className="shops-list">
                {isLoading ? (
                    <div className="shops-loading">Загрузка магазинов...</div>
                ) : shops.length === 0 ? (
                    <div className="shops-empty">У вас пока нет созданных магазинов.</div>
                ) : (
                    shops.map((shop, index) => (
                        <div
                            key={shop.id}
                            className="shop-card"
                            style={index % 4 === 3 ? { backgroundColor: '#2E7D32' } : undefined}
                        >
                            <div className="shop-card__left">
                                <div className="shop-card__icon-wrapper">
                                    <Store size={28} />
                                </div>
                                <div className="shop-card__info">
                                    <h3 className="shop-card__name">{shop.name}</h3>
                                    <div className="shop-card__meta">
                                        <span className="shop-card__url">
                                            shopai.ru/{shop.urlAlias}
                                        </span>
                                        <span className="shop-card__divider"></span>

                                        {/* Заглушки для статистики, так как их нет в интерфейсе Shop */}
                                        <div className="shop-card__stat">
                                            <Box size={16} />
                                            <span>156 товаров</span>
                                        </div>
                                        <div className="shop-card__stat">
                                            <ShoppingBag size={16} />
                                            <span>89 заказов</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="shop-card__manage-btn">
                                Управление
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}