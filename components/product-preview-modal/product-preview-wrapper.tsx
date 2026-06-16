'use client';

import React, { useState } from 'react';
import { X, Star, Heart, GitCompare, Search } from 'lucide-react';
import { renderStars } from '@/utils/utilsJSX';
import '@/app/product/product.css';
import './product-preview-modal.css';

interface ProductPreviewWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        name: string;
        price: number;
        description: string;
        imageUrl: string;
        imageUrls: string[];
        shopName: string;
        categoryName: string;
        brandName: string;
        stockQuantity: number;
        attributes: Record<string, string>;
    };
}

export const ProductPreviewWrapper = ({ isOpen, onClose, product }: ProductPreviewWrapperProps) => {
    const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');
    const [activeImage, setActiveImage] = useState<string | null>(null);

    if (!isOpen) return null;

    const currentImage = activeImage || product.imageUrl;
    const allImages = product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];

    return (
        <div className="preview-modal-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px', width: '95%', height: '90vh', overflowY: 'auto' }}>
                <div className="preview-modal__badge">Предпросмотр</div>
                <button className="preview-modal__close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="preview-modal__content" style={{ padding: '20px' }}>
                    <div className="page-container" style={{ paddingBottom: 0, background: 'transparent' }}>
                        <main className="container" style={{ maxWidth: '100%', padding: 0 }}>
                            {/* Хлебные крошки */}
                            <div className="top-bar">
                                <div className="breadcrumbs">
                                    Главная / {product.categoryName || 'Категория'} / <span>{product.name || 'Название'}</span>
                                </div>
                                <button className="refine-btn">
                                    <Search size={16} />
                                    Уточнить подбор
                                </button>
                            </div>

                            {/* Основной блок товара */}
                            <div className="product-main">
                                <div className="product-gallery">
                                    <div className="thumbnails">
                                        {allImages.map((url, index) => (
                                            <div
                                                key={index}
                                                className={`thumb ${currentImage === url ? 'active' : ''}`}
                                                onClick={() => setActiveImage(url)}
                                            >
                                                <img src={url} alt={`thumb ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="main-image-container">
                                        <img src={currentImage} alt={product.name} className="main-product-image" />
                                        <div className="product-like-wrapper">
                                            <div className="like-button"><Heart size={20} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <div className="brand">{product.brandName?.toUpperCase() || 'БРЕНД'}</div>
                                    <h1 className="title">{product.name || 'Название товара'}</h1>

                                    <div className="rating-row">
                                        <div className="stars">{renderStars(0, 20)}</div>
                                        <span className="rating-value">0.0</span>
                                        <span className="reviews-link">(0 отзывов)</span>
                                    </div>

                                    <div className="price-row">
                                        <span className="current-price">{Number(product.price).toLocaleString('ru-RU')} ₽</span>
                                    </div>

                                    <div className="rating-row">
                                        <div className={`availability ${product.stockQuantity > 0 ? '' : 'out-of-stock'}`}>
                                            <span className="availability-dot"></span>
                                            {product.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии'}
                                        </div>
                                        <button className="meta-btn">
                                            <GitCompare size={20} />
                                            Сравнить
                                        </button>
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn-primary" style={{ width: '100%' }}>В корзину</button>
                                        <button className="btn-secondary">Купить в 1 клик</button>
                                    </div>
                                </div>
                            </div>

                            {/* Табы */}
                            <div className="tabs-section">
                                <div className="tabs-header">
                                    {['description', 'characteristics', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab as any)}
                                        >
                                            {tab === 'description' ? 'Описание' : tab === 'characteristics' ? 'Характеристики' : 'Отзывы'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="tab-content">
                                {activeTab === 'description' && (
                                    <div className="description-text">
                                        {product.description || 'Описание отсутствует'}
                                    </div>
                                )}

                                {activeTab === 'characteristics' && (
                                    <div className="characteristics-list">
                                        {product.brandName && (
                                            <div className="char-item">
                                                <span className="char-name">Бренд</span>
                                                <span className="char-value">{product.brandName}</span>
                                            </div>
                                        )}
                                        {Object.entries(product.attributes).map(([key, value]) => (
                                            <div className="char-item" key={key}>
                                                <span className="char-name">{key}</span>
                                                <span className="char-value">{value}</span>
                                            </div>
                                        ))}
                                        <div className="char-item">
                                            <span className="char-name">Категория</span>
                                            <span className="char-value">{product.categoryName}</span>
                                        </div>
                                        <div className="char-item">
                                            <span className="char-name">Продавец</span>
                                            <span className="char-value">{product.shopName}</span>
                                        </div>
                                        <div className="char-item">
                                            <span className="char-name">Остаток</span>
                                            <span className="char-value">{product.stockQuantity} шт.</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="reviews-empty">В режиме предпросмотра отзывы недоступны</div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};
