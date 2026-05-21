'use client';

import React, { useEffect } from 'react';
import { Store, Package, ShoppingCart } from 'lucide-react';
import { useShopsStore } from '@/data/store/useShopsStore';
import './shops.css';
import {useRouter} from "next/navigation";

export const ShopsSection = () => {
    const { shops, isLoading, error, fetchMyShops } = useShopsStore();
    const router = useRouter();

    useEffect(() => {
        fetchMyShops();
    }, [fetchMyShops]);
    return (
        <>
            <div className="shops-header">
                <div>
                    <h2 className="shops-title">Мои магазины</h2>
                    <p className="shops-subtitle">Управление вашими магазинами на платформе</p>
                </div>
                <button className="shops-create-btn">
                    <Store size={18} />
                    Создать магазин
                </button>
            </div>

            <div className="shops-grid">
                {isLoading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        Загрузка магазинов...
                    </div>
                ) : error ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'red' }}>
                        {error}
                    </div>
                ) : shops.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#667085' }}>
                        <p>У вас пока нет магазинов</p>
                    </div>
                ) : (
                    shops.map((shop) => (
                        <div key={shop.id} className="shop-card">
                            <div className="shop-card__header">
                                <div className="shop-card__icon">
                                    <Store size={24} color="#155DFC" />
                                </div>
                                <h3 className="shop-card__name">{shop.name}</h3>
                            </div>

                            <p className="shop-card__url">shopal.com/{shop.urlAlias}</p>

                            <div className="shop-card__stats">
                                <div className="shop-stat">
                                    <div className="shop-stat__icon">
                                        <Package size={18} color="#667085" />
                                    </div>
                                    <div>
                                        <div className="shop-stat__value">0</div>
                                        <div className="shop-stat__label">товаров</div>
                                    </div>
                                </div>

                                <div className="shop-stat">
                                    <div className="shop-stat__icon">
                                        <ShoppingCart size={18} color="#667085" />
                                    </div>
                                    <div>
                                        <div className="shop-stat__value">0</div>
                                        <div className="shop-stat__label">заказов</div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => router.push(`/shop/${shop.id}`)} className="shop-card__btn">Управление</button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};
