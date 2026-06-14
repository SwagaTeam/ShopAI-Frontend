'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, GitCompare } from 'lucide-react';
import { renderStars } from '@/utils/utilsJSX';
import '@/app/product/product.css';
import './product-preview-modal.css';

interface ProductPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productData: {
        name: string;
        price: number;
        description: string;
        imageUrl: string | null;
        imageUrls?: string[];
        shopName: string;
        categoryName: string;
        brandName: string;
        stockQuantity: number;
        attributes?: Record<string, string>;
    };
}

export const ProductPreviewModal = ({ isOpen, onClose, productData }: ProductPreviewModalProps) => {
    const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        if (productData.imageUrl) setActiveImage(productData.imageUrl);
    }, [productData.imageUrl]);

    if (!isOpen) return null;

    const allImages = productData.imageUrls && productData.imageUrls.length > 0
        ? productData.imageUrls
        : productData.imageUrl ? [productData.imageUrl] : [];

    return (
        <div className="preview-modal-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                <div className="preview-modal__badge">Предпросмотр</div>
                <button className="preview-modal__close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="preview-modal__content">
                    <div className="page-container" style={{ paddingBottom: 0 }}>
                        <div className="container" style={{ maxWidth: '100%', padding: 0 }}>
                            {/* Хлебные крошки */}
                            <div className="top-bar">
                                <div className="breadcrumbs">
                                    Главная / {productData.categoryName || 'Категория'} / <span>{productData.name || 'Название'}</span>
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
                                        {allImages.map((url, idx) => (
                                            <div
                                                key={idx}
                                                className={`thumb ${activeImage === url ? 'active' : ''}`}
                                                onClick={() => setActiveImage(url)}
                                            >
                                                <img src={url} alt={`thumb ${idx}`} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="main-image-container">
                                        {activeImage ? (
                                            <img src={activeImage} alt={productData.name} />
                                        ) : (
                                            <div style={{color: '#94a3b8'}}>Нет изображения</div>
                                        )}
                                    </div>
                                </div>

                                <div className="product-info">
                                    <div className="brand">{productData.brandName?.toUpperCase() || 'БРЕНД'}</div>
                                    <h1 className="title">{productData.name || 'Название товара'}</h1>

                                    <div className="rating-row">
                                        <div className="stars">
                                            {renderStars(0, 20)}
                                        </div>
                                        <span className="rating-value">0.0</span>
                                        <a href="#" className="reviews-link" onClick={(e) => e.preventDefault()}>
                                            (0 отзывов)
                                        </a>
                                    </div>

                                    <div className="price-row">
                                        <span className="current-price">{(productData.price || 0).toLocaleString('ru-RU')} ₽</span>
                                    </div>

                                    <div className="rating-row">
                                        <div className="availability">
                                            <span className="availability-dot"></span>
                                            {productData.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии'}
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
                                        {productData.description || 'Описание товара отсутствует'}
                                    </div>
                                )}

                                {activeTab === 'characteristics' && (
                                    <div className="characteristics-list">
                                        <div className="char-item">
                                            <span className="char-name">Бренд</span>
                                            <span className="char-value">{productData.brandName || '—'}</span>
                                        </div>
                                        {productData.attributes && Object.entries(productData.attributes).map(([key, value]) => (
                                            <div className="char-item" key={key}>
                                                <span className="char-name">{key}</span>
                                                <span className="char-value">{value}</span>
                                            </div>
                                        ))}
                                        <div className="char-item">
                                            <span className="char-name">Категория</span>
                                            <span className="char-value">{productData.categoryName || '—'}</span>
                                        </div>
                                        <div className="char-item">
                                            <span className="char-name">Продавец</span>
                                            <span className="char-value">{productData.shopName || '—'}</span>
                                        </div>
                                        <div className="char-item">
                                            <span className="char-name">Остаток</span>
                                            <span className="char-value">{productData.stockQuantity} шт.</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="reviews-empty">В режиме предпросмотра отзывы недоступны</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
