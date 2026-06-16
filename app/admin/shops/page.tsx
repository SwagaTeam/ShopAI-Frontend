'use client';

import React, { useEffect } from 'react';
import { useShopsStore } from '@/data/store/useShopsStore';
import { Plus, Store, Box, ShoppingBag, DollarSign, Package } from 'lucide-react';
import './shops.css';
import Link from "next/link";
import { AdminShopCard } from '@/components/admin/admin-shop-card';

const cardGradients = [
    'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
];

export default function ShopsPage() {
    const { shops, isLoading, fetchMyShops } = useShopsStore();

    useEffect(() => {
        if (shops.length === 0 && !isLoading) {
            fetchMyShops();
        }
    }, [fetchMyShops, shops.length, isLoading]);

    return (
        <div className="admin-shops-page">
            {/* Header */}
            <div className="admin-shops-header">
                <h1 className="admin-shops-title">Мои магазины</h1>
                <Link href="/admin/create-shop" className="admin-shops-create-btn">
                    <Plus size={20} />
                    Создать магазин
                </Link>
            </div>

            {/* Блоки аналитики (пока статические заглушки по макету) */}
            <div className="admin-analytics-grid">
                <div className="admin-analytics-card">
                    <div className="admin-analytics-card__header">
                        <span className="admin-analytics-card__title">Общая выручка</span>
                        <div className="admin-analytics-card__icon bg-blue-light">
                            <DollarSign size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="admin-analytics-card__value">582 340 ₽</div>
                    <div className="admin-analytics-card__trend trend-up">+18% за месяц</div>
                    <div className="admin-analytics-card__chart chart-placeholder-1"></div>
                </div>

                <div className="admin-analytics-card">
                    <div className="admin-analytics-card__header">
                        <span className="admin-analytics-card__title">Всего заказов</span>
                        <div className="admin-analytics-card__icon bg-blue-light">
                            <ShoppingBag size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="admin-analytics-card__value">342</div>
                    <div className="admin-analytics-card__trend trend-up">+24 за неделю</div>
                    <div className="admin-analytics-card__chart chart-placeholder-2"></div>
                </div>

                <div className="admin-analytics-card">
                    <div className="admin-analytics-card__header">
                        <span className="admin-analytics-card__title">Товаров продано</span>
                        <div className="admin-analytics-card__icon bg-blue-light">
                            <Package size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="admin-analytics-card__value">1 248</div>
                    <div className="admin-analytics-card__trend trend-up">+156 за неделю</div>
                    <div className="admin-analytics-card__chart chart-placeholder-3"></div>
                </div>
            </div>

            {/* Список магазинов */}
            <div className="admin-shops-list">
                {isLoading ? (
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
