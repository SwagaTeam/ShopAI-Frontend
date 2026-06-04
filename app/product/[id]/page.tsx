'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import '../product.css';
import { Header } from "@/components/header/header";
import { Search, ChevronLeft, ChevronRight, Star, Heart, GitCompare, Minus, Plus } from 'lucide-react';
import { ProductCard } from "@/components/product-card/product-card";
import { useProductStore } from '@/data/store/useProductStore';
import {useParams} from "next/navigation";
import {useViewedStore} from "@/data/store/useViewedStore";
import {useCartStore} from "@/data/store/useCartStore";

const similarProducts = [
    { productId: "similar_1", productName: "Кроссовки мужские Nike Air Max Sc", price: 14999, imageUrl: "/api/placeholder/200/150" },
    { productId: "similar_2", productName: "Кроссовки Nike Air Max 1 Platinum Tint", price: 11299, imageUrl: "/api/placeholder/200/150" },
    { productId: "similar_3", productName: "Кроссовки Nike Air Max 1 Platinum Tint", price: 11299, imageUrl: "/api/placeholder/200/150" },
    { productId: "similar_4", productName: "Кроссовки Nike Air Max 1 Essential", price: 11299, imageUrl: "/api/placeholder/200/150" }
];

export default function ProductPage() {
    const { product, isLoading, error, fetchProduct } = useProductStore();
    const {viewProduct} = useViewedStore();
    const {addOrUpdateItem} = useCartStore();
    const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');
    const [quantity, setQuantity] = useState(1);
    const params = useParams() as { id?: string };
    const productId = params?.id || '';
    useEffect(() => {
        fetchProduct(productId);
        viewProduct(productId);
    }, [productId, fetchProduct]);

    // Обработчики количества
    const handleMinus = () => setQuantity(prev => Math.max(1, prev - 1));
    const handlePlus = () => setQuantity(prev => (product ? Math.min(product.stockQuantity, prev + 1) : prev + 1));

    if (isLoading) {
        return <div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>Загрузка товара...</div>;
    }

    if (error || !product) {
        return <div className="page-container" style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error || 'Товар не найден'}</div>;
    }

    return (
        <div className="page-container">
            <Head>
                <title>{product.name} - ShopAl</title>
            </Head>

            <Header isCompact={false} />

            <main className="container">
                {/* Хлебные крошки */}
                <div className="top-bar">
                    <div className="breadcrumbs">
                        Главная / {product.categoryName} / <span>{product.name}</span>
                    </div>
                    <button className="refine-btn">
                        <Search size={16} />
                        Уточнить подбор
                    </button>
                </div>

                {/* Основной блок товара */}
                <div className="product-main">
                    {/* Левая колонка - Фото */}
                    <div className="product-gallery">
                        <div className="thumbnails">
                            <div className="thumb active"><img src={product.imageUrl} alt="thumb 1" /></div>
                        </div>

                        <div className="main-image-container">
                            {/*<button className="arrow-btn arrow-left">
                                <ChevronLeft size={24}/>
                            </button>*/}
                            <img src={product.imageUrl} alt={product.name}/>
                            {/*<button className="arrow-btn arrow-right">
                                <ChevronRight size={24}/>
                            </button>*/}
                        </div>
                    </div>

                    {/* Правая колонка - Инфо */}
                    <div className="product-info">
                        <div className="brand">{product.brandName?.toUpperCase()}</div>
                        <h1 className="title">{product.name}</h1>

                        <div className="rating-row">
                            <div className="stars">
                                <Star size={20} fill="currentColor" color={"#82a4f8"} />
                                <Star size={20} fill="currentColor" color={"#82a4f8"} />
                                <Star size={20} fill="currentColor" color={"#82a4f8"} />
                                <Star size={20} fill="currentColor" color={"#82a4f8"} />
                                <Star size={20} fill="currentColor" color={"#82a4f8"} /> {/* {"#1b5bf7"}*/}
                            </div>
                            <span className="rating-value">0.0</span>
                            <a href="#" className="reviews-link" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}>(0 отзывов)</a>
                        </div>

                        <div className="price-row">
                            {/* Форматируем цену с пробелами */}
                            <span className="current-price">{product.price.toLocaleString('ru-RU')} ₽</span>
                        </div>

                        {product.stockQuantity > 0 ? (
                            <div className="availability">
                                <span className="availability-dot"></span>
                                В наличии
                            </div>
                        ) : (
                            <div className="availability" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                <span className="availability-dot" style={{ backgroundColor: '#dc2626' }}></span>
                                Нет в наличии
                            </div>
                        )}

                        <span className="quantity-label">Количество</span>
                        <div className="quantity-selector">
                            <button className="quantity-btn" onClick={handleMinus} disabled={quantity <= 1}>
                                <Minus size={16} />
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button className="quantity-btn" onClick={handlePlus} disabled={quantity >= product.stockQuantity}>
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="action-buttons">
                            <button onClick={() => addOrUpdateItem(productId, quantity)} className="btn-primary" disabled={product.stockQuantity === 0}>В корзину</button>
                            <button className="btn-secondary" disabled={product.stockQuantity === 0}>Купить в 1 клик</button>
                        </div>

                        <div className="meta-actions">
                            <button className="meta-btn">
                                <Heart size={20} />
                                В избранное
                            </button>
                            <button className="meta-btn">
                                <GitCompare size={20} />
                                Сравнить
                            </button>
                        </div>
                    </div>
                </div>

                {/* Табы */}
                <div className="tabs-section">
                    <div className="tabs-header">
                        <button
                            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Описание
                        </button>
                        <button
                            className={`tab ${activeTab === 'characteristics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('characteristics')}
                        >
                            Характеристики
                        </button>
                        <button
                            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Отзывы
                        </button>
                    </div>
                </div>

                {/* Контент табов */}
                <div className="tab-content">
                    {activeTab === 'description' && (
                        <div className="description-text">
                            {product.description}
                        </div>
                    )}

                    {activeTab === 'characteristics' && (
                        <div className="characteristics-list">
                            <div className="char-item">
                                <span className="char-name">Бренд</span>
                                <span className="char-value" style={{ textTransform: 'capitalize' }}>{product.brandName}</span>
                            </div>
                            <div className="char-item">
                                <span className="char-name">Категория</span>
                                <span className="char-value">{product.categoryName}</span>
                            </div>
                            <div className="char-item">
                                <span className="char-name">Продавец (Магазин)</span>
                                <span className="char-value">{product.shopName}</span>
                            </div>
                            <div className="char-item">
                                <span className="char-name">Остаток на складе</span>
                                <span className="char-value">{product.stockQuantity} шт.</span>
                            </div>
                            {/* Технические ID (обычно скрывают, но если нужно вывести по ТЗ): */}
                            <div className="char-item">
                                <span className="char-name">ID Категории</span>
                                <span className="char-value" style={{ fontSize: '12px', color: '#999' }}>{product.categoryId}</span>
                            </div>
                            <div className="char-item">
                                <span className="char-name">ID Магазина</span>
                                <span className="char-value" style={{ fontSize: '12px', color: '#999' }}>{product.shopId}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <p>Отзывов пока нет. Будьте первыми!</p>
                        </div>
                    )}
                </div>

                {/* Похожие товары
                <section className="similar-section">
                    <h2 className="similar-title">Похожие товары</h2>
                    <div className="products-grid">
                        {similarProducts.map((item) => (
                            <ProductCard key={item.productId} item={item} />
                        ))}
                    </div>
                </section>*/}
            </main>
        </div>
    );
}