'use client';

import React, { useEffect } from 'react';
import { useShopsStore } from '@/data/store/useShopsStore';
import { useAnalyticsStore } from '@/data/store/useAnalyticsStore';
import { Plus,ShoppingBag, DollarSign, Star } from 'lucide-react';
import './shops.css';
import Link from "next/link";
import { AdminShopCard } from '@/components/admin/admin-shop-card';

export default function ShopsPage() {
    const { shops, isLoading: isShopsLoading, fetchMyShops } = useShopsStore();
    const { overview, fetchOverview, isLoading: isAnalyticsLoading } = useAnalyticsStore();

    useEffect(() => {
        fetchMyShops();
        fetchOverview();
    }, [fetchMyShops, fetchOverview]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="admin-shops-page">
            {/* Header */}
            <div className="admin-shops-header">
                <h1 className="admin-shops-title">Мои магазины</h1>
                <div className="admin-shops-actions">
                    <Link href="/admin/analytics" className="admin-shops-analytics-link">
                        Подробная аналитика
                    </Link>
                    <Link href="/admin/create-shop" className="admin-shops-create-btn">
                        <Plus size={20} />
                        Создать магазин
                    </Link>
                </div>
            </div>

            {/* Блоки аналитики */}
            <div className="admin-analytics-grid">
                <div className="admin-analytics-card">
                    <div className="admin-analytics-card__header">
                        <span className="admin-analytics-card__title">Общая выручка</span>
                        <div className="admin-analytics-card__icon bg-blue-light">
                            <DollarSign size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="admin-analytics-card__value">
                        {isAnalyticsLoading ? '...' : formatCurrency(overview?.revenue || 0)}
                    </div>
                    <div className="admin-analytics-card__trend trend-up">Всего по всем магазинам</div>
                    <div className="admin-analytics-card__chart chart-placeholder-1"></div>
                </div>

                <div className="admin-analytics-card">
                    <div className="admin-analytics-card__header">
                        <span className="admin-analytics-card__title">Всего заказов</span>
                        <div className="admin-analytics-card__icon bg-green-light">
                            <ShoppingBag size={16} color="#10b981" />
                        </div>
                    </div>
                    <div className="admin-analytics-card__value">
                        {isAnalyticsLoading ? '...' : overview?.ordersCount || 0}
                    </div>
                    <div className="admin-analytics-card__trend trend-up">За всё время</div>
                    <div className="admin-analytics-card__chart chart-placeholder-2"></div>
                </div>

                <div className="admin-analytics-card">
                    <div className="admin-analytics-card__header">
                        <span className="admin-analytics-card__title">Рейтинг товаров</span>
                        <div className="admin-analytics-card__icon bg-amber-light">
                            <Star size={16} color="#f59e0b" />
                        </div>
                    </div>
                    <div className="admin-analytics-card__value">
                        {isAnalyticsLoading ? '...' : (overview?.averageRating || 0).toFixed(1)}
                    </div>
                    <div className="admin-analytics-card__trend trend-up">Средняя оценка</div>
                    <div className="admin-analytics-card__chart chart-placeholder-3"></div>
                </div>
            </div>

            {/* Список магазинов */}
            <div className="admin-shops-list">
                {isShopsLoading ? (
                    <div className="admin-shops-loading">Загрузка магазинов...</div>
                ) : shops.length === 0 ? (
                    <div className="admin-shops-empty">У вас пока нет созданных магазинов.</div>
                ) : (
                    shops.map((shop, index) => (
                        <AdminShopCard key={shop.id} shop={shop} index={index} />
                    ))
                )}
            </div>
        </div>
    );
}
