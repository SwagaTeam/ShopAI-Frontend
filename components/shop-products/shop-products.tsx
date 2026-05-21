'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import './shop-products.css';
import { ShopProduct } from '@/data/store/useShopStore';

interface ShopProductsProps {
    products: ShopProduct[];
    isLoading: boolean;
    page: number;
    totalCount: number;
}

export const ShopProducts = ({ products, isLoading, page, totalCount }: ShopProductsProps) => {
    return (
        <div className="shop-products">
            <div className="shop-products__header">
                <h2 className="shop-products__title">Товары</h2>
                <button className="shop-products__add-btn">+ Добавить товар</button>
            </div>

            <div className="shop-products__meta">
                <span>Страница {page}</span>
                <span>{totalCount} товаров</span>
            </div>

            <div className="shop-products__table-wrapper">
                {isLoading ? (
                    <p className="shop-products__empty">Загрузка товаров...</p>
                ) : products.length === 0 ? (
                    <p className="shop-products__empty">У магазина пока нет товаров</p>
                ) : (
                    <table className="shop-products__table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>На складе</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.categoryName ?? '—'}</td>
                                    <td>{product.price.toLocaleString('ru-RU')} ₽</td>
                                    <td>{product.stockQuantity} шт</td>
                                    <td>
                                        <div className="shop-products__actions">
                                            <button className="shop-products__action-btn">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="shop-products__action-btn shop-products__action-btn--danger">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
