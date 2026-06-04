'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import '../product.css';
import { Header } from "@/components/header/header";
import { Search,  Star, Heart, GitCompare, Minus, Plus, } from 'lucide-react';
import { useProductStore } from '@/data/store/useProductStore';
import { useReviewsStore } from '@/data/store/useReviewsStore';
import {useParams, useRouter} from "next/navigation";
import { useViewedStore } from "@/data/store/useViewedStore";
import { useCartStore } from "@/data/store/useCartStore";
import {renderStars} from "@/utils/utilsJSX";
import {ReviewCard} from "@/components/review-card/review-card";

export default function ProductPage() {
    const { product, isLoading, error, fetchProduct } = useProductStore();
    const { review, isLoading: reviewsLoading, error: reviewsError, fetchFirstReview } = useReviewsStore();
    const { viewProduct } = useViewedStore();
    const { addOrUpdateItem } = useCartStore();
    const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');
    const [quantity, setQuantity] = useState(1);
    const params = useParams() as { id?: string };
    const productId = params?.id || '';
    const router = useRouter();

    useEffect(() => {
        fetchProduct(productId);
        viewProduct(productId);
        fetchFirstReview(productId);
    }, [productId, fetchProduct, fetchFirstReview]);

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
                            <img src={product.imageUrl} alt={product.name} />
                        </div>
                    </div>

                    {/* Правая колонка - Инфо */}
                    <div className="product-info">
                        <div className="brand">{product.brandName?.toUpperCase()}</div>
                        <h1 className="title">{product.name}</h1>

                        <div className="rating-row">
                            <div className="stars">
                                {renderStars(review ? review.rating : 0, 20)}
                            </div>
                            <span className="rating-value">{review ? review.rating.toFixed(1) : '0.0'}</span>
                            <a href="#" className="reviews-link" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}>
                                ({review ? '1 отзыв' : '0 отзывов'})
                            </a>
                        </div>

                        <div className="price-row">
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
                        <div className="reviews-container">

                            {/* Сводка рейтинга */}
                            <div className="reviews-summary">
                                <div className="reviews-summary-left">
                                    <div className="reviews-avg-score">
                                        {review ? review.rating.toFixed(1) : '0.0'}
                                    </div>
                                    <div className="reviews-avg-stars">
                                        {renderStars(review ? review.rating : 0, 20)}
                                    </div>
                                    <div className="reviews-avg-count">
                                        ({review ? '1 отзыв' : '0 отзывов'})
                                    </div>
                                </div>

                                <div className="reviews-bars">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = review && review.rating === star ? 1 : 0;
                                        const total = review ? 1 : 0;
                                        const percent = total > 0 ? (count / total) * 100 : 0;
                                        return (
                                            <div className="reviews-bar-row" key={star}>
                                                <span className="reviews-bar-label">{star}</span>
                                                <Star size={14} fill="#808080" color="#808080" className="reviews-bar-star-icon" />
                                                <div className="reviews-bar-track">
                                                    <div className="reviews-bar-fill" style={{ width: `${percent}%` }} />
                                                </div>
                                                <span className="reviews-bar-count">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="reviews-summary-right">
                                    <button
                                        className="write-review-btn"
                                        onClick={() => router.push(`/product/${productId}/reviews`)}
                                    >
                                        Написать отзыв
                                    </button>
                                </div>
                            </div>

                            {/* Загрузка */}
                            {reviewsLoading && (
                                <div className="reviews-loading">Загрузка отзывов...</div>
                            )}

                            {/* Ошибка / пусто */}
                            {!reviewsLoading && (reviewsError || !review) && (
                                <div className="reviews-empty">Нет отзывов</div>
                            )}

                            {/* Карточка отзыва */}
                            {!reviewsLoading && review && (
                                <>
                                <ReviewCard review={review} />

                                <div className="all-reviews-btn-wrapper">
                                    <button
                                        className="all-reviews-btn"
                                        onClick={() => router.push(`/product/${productId}/reviews`)}
                                    >
                                        Все отзывы
                                    </button>
                                </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}