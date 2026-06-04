'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import { Header } from '@/components/header/header';
import { ReviewCard } from '@/components/review-card/review-card';
import { useProductStore } from '@/data/store/useProductStore';
import { useReviewsStore } from '@/data/store/useReviewsStore';
import { useCartStore } from '@/data/store/useCartStore';
import { useAuthStore } from '@/data/store/useAuthStore';
import {
    ChevronLeft, Star, Heart, GitCompare, X, CheckCircle
} from 'lucide-react';
import './reviews.css';

export default function ReviewsPage() {
    const router = useRouter();
    const params = useParams() as { id?: string };
    const productId = params?.id || '';
    const {id} = useAuthStore();
    const currentUserId = id;

    const { product, fetchProduct } = useProductStore();
    const {
        reviews, isLoading, error, hasMore, hasUserReview,
        fetchReviews, loadMoreReviews,
        isSubmitting, submitError, submitReview, checkUserReview
    } = useReviewsStore();
    const { addOrUpdateItem } = useCartStore();

    const [starFilter, setStarFilter] = useState<number | null>(null);
    const [photoFilter, setPhotoFilter] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchProduct(productId);
        fetchReviews(productId, 1, 10);
        checkUserReview(productId);
    }, [productId]);

    // Дополнительная проверка по загруженным отзывам
    const userAlreadyReviewed = useMemo(() => {
        if (hasUserReview) return true;
        if (!currentUserId) return false;
        return reviews.some(r => r.userId === currentUserId);
    }, [reviews, currentUserId, hasUserReview]);

    // Находим отзыв текущего пользователя
    const currentUserReview = useMemo(() => {
        if (!currentUserId) return null;
        return reviews.find(r => r.userId === currentUserId) || null;
    }, [reviews, currentUserId]);

    // Фильтрация на клиенте
    const filteredReviews = useMemo(() => {
        let result = reviews;
        if (starFilter !== null) {
            result = result.filter(r => r.rating === starFilter);
        }
        if (photoFilter) {
            result = result.filter(r => r.imagePaths && r.imagePaths.length > 0);
        }
        return result;
    }, [reviews, starFilter, photoFilter]);

    // Все фото из всех отзывов
    const allPhotos = useMemo(() => {
        const photos: string[] = [];
        reviews.forEach(r => {
            if (r.imagePaths) {
                r.imagePaths.forEach(p => photos.push(p));
            }
        });
        return photos;
    }, [reviews]);

    // Средний рейтинг
    const avgRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / reviews.length;
    }, [reviews]);

    const handleSubmit = async () => {
        if (newRating < 1 || newRating > 5) return;
        if (!newComment.trim()) return;
        if (userAlreadyReviewed) return;
        try {
            await submitReview(productId, newRating, newComment);
            setShowModal(false);
            setNewRating(0);
            setNewComment('');
        } catch (e) {
            // ошибка уже в сторе
        }
    };

    const resetFilters = () => {
        setStarFilter(null);
        setPhotoFilter(false);
    };

    const handleOpenModal = () => {
        if (userAlreadyReviewed) return;
        setShowModal(true);
    };

    return (
        <div className="reviews-page">
            <Head>
                <title>Отзывы — {product?.name || 'Товар'}</title>
            </Head>

            <Header isCompact={false} />

            <main className="reviews-page__container">
                {/* Назад к товару */}
                <button
                    className="reviews-page__back"
                    onClick={() => router.push(`/product/${productId}`)}
                >
                    <ChevronLeft size={18} />
                    Назад к товару
                </button>

                {/* Шапка товара */}
                {product && (
                    <div className="reviews-page__product-bar">
                        <div className="reviews-page__product-left">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="reviews-page__product-img"
                            />
                            <div>
                                <h2 className="reviews-page__product-name">{product.name}</h2>
                                <div className="reviews-page__product-rating">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < Math.round(avgRating) ? '#f5a623' : 'none'}
                                            color={i < Math.round(avgRating) ? '#f5a623' : '#d1d5db'}
                                        />
                                    ))}
                                    <span className="reviews-page__product-avg">
                                        {avgRating.toFixed(1)}
                                    </span>
                                    <span className="reviews-page__product-count">
                                        ({reviews.length} отзывов)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="reviews-page__product-right">
                            <div className="reviews-page__product-prices">
                                <span className="reviews-page__price">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                            <button
                                className="reviews-page__buy-btn"
                                onClick={() => addOrUpdateItem(productId, 1)}
                            >
                                Купить сейчас
                            </button>
                            <button
                                className="reviews-page__cart-btn"
                                onClick={() => addOrUpdateItem(productId, 1)}
                            >
                                Добавить в корзину
                            </button>
                            <button className="reviews-page__icon-btn">
                                <Heart size={20} />
                            </button>
                            <button className="reviews-page__icon-btn">
                                <GitCompare size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Основное тело */}
                <div className="reviews-page__body">
                    {/* Левая панель — Фильтры */}
                    <aside className="reviews-page__sidebar">
                        <h3 className="reviews-page__sidebar-title">Фильтры</h3>

                        <div className="reviews-page__filter-group">
                            <label className="reviews-page__checkbox">
                                <input
                                    type="checkbox"
                                    checked={!photoFilter}
                                    onChange={() => setPhotoFilter(false)}
                                />
                                Без фотографий
                            </label>
                            <label className="reviews-page__checkbox">
                                <input
                                    type="checkbox"
                                    checked={photoFilter}
                                    onChange={() => setPhotoFilter(true)}
                                />
                                С фотографиями
                            </label>
                        </div>

                        <button className="reviews-page__reset" onClick={resetFilters}>
                            Сбросить фильтры
                        </button>
                    </aside>

                    {/* Правая панель — Контент */}
                    <div className="reviews-page__content">

                        {/* Галерея фото */}
                        {allPhotos.length > 0 && (
                            <div className="reviews-page__photos-section">
                                <h3 className="reviews-page__photos-title">Фото и видео</h3>
                                <div className="reviews-page__photos-grid">
                                    {allPhotos.slice(0, 10).map((photo, idx) => (
                                        <img
                                            key={idx}
                                            src={photo}
                                            alt={`Фото ${idx + 1}`}
                                            className="reviews-page__photo"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Фильтр-табы */}
                        <div className="reviews-page__filter-tabs">
                            <div className="reviews-page__tabs-left">
                                <button
                                    className={`reviews-page__filter-tab ${starFilter === null && !photoFilter ? 'active' : ''}`}
                                    onClick={resetFilters}
                                >
                                    Все
                                </button>
                                <button
                                    className={`reviews-page__filter-tab ${photoFilter ? 'active' : ''}`}
                                    onClick={() => { setPhotoFilter(true); setStarFilter(null); }}
                                >
                                    С фото
                                </button>
                                {[5, 4, 3, 2, 1].map(s => (
                                    <button
                                        key={s}
                                        className={`reviews-page__filter-tab ${starFilter === s ? 'active' : ''}`}
                                        onClick={() => { setStarFilter(s); setPhotoFilter(false); }}
                                    >
                                        {s} <Star size={12} fill="#808080" color="#808080" />
                                    </button>
                                ))}
                            </div>

                            {/* Кнопка: написать отзыв ИЛИ уже оставлен */}
                            {userAlreadyReviewed ? (
                                <div className="reviews-page__already-reviewed">
                                    <CheckCircle size={16} />
                                    Вы уже оставили отзыв
                                </div>
                            ) : (
                                <button
                                    className="reviews-page__write-btn"
                                    onClick={handleOpenModal}
                                >
                                    Написать отзыв
                                </button>
                            )}
                        </div>

                        {/* Баннер «Ваш отзыв» */}
                        {currentUserReview && (
                            <div className="reviews-page__your-review-banner">
                                <div className="reviews-page__your-review-label">
                                    <CheckCircle size={16} />
                                    Ваш отзыв
                                </div>
                                <ReviewCard review={currentUserReview} />
                            </div>
                        )}

                        {/* Список отзывов */}
                        {isLoading && reviews.length === 0 && (
                            <div className="reviews-page__empty">Загрузка отзывов...</div>
                        )}

                        {!isLoading && filteredReviews.length === 0 && (
                            <div className="reviews-page__empty">
                                {error || 'Нет отзывов'}
                            </div>
                        )}

                        <div className="reviews-page__list">
                            {filteredReviews
                                .filter(r => r.id !== currentUserReview?.id)
                                .map(review => (
                                    <ReviewCard key={review.id} review={review} />
                                ))
                            }
                        </div>

                        {/* Показать ещё */}
                        {hasMore && filteredReviews.length > 0 && (
                            <div className="reviews-page__load-more-wrapper">
                                <button
                                    className="reviews-page__load-more"
                                    onClick={() => loadMoreReviews(productId)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Загрузка...' : 'Показать ещё'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Модалка — Написать отзыв */}
            {showModal && !userAlreadyReviewed && (
                <div className="review-modal__overlay" onClick={() => setShowModal(false)}>
                    <div className="review-modal" onClick={e => e.stopPropagation()}>
                        <div className="review-modal__header">
                            <h2 className="review-modal__title">Написать отзыв</h2>
                            <button
                                className="review-modal__close"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {product && (
                            <div className="review-modal__product">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="review-modal__product-img"
                                />
                                <span className="review-modal__product-name">{product.name}</span>
                            </div>
                        )}

                        <div className="review-modal__field">
                            <label className="review-modal__label">Ваша оценка</label>
                            <div className="review-modal__stars">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <button
                                        key={i}
                                        className="review-modal__star-btn"
                                        onMouseEnter={() => setHoverRating(i + 1)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setNewRating(i + 1)}
                                    >
                                        <Star
                                            size={32}
                                            fill={i < (hoverRating || newRating) ? '#1b5bf7' : 'none'}
                                            color={i < (hoverRating || newRating) ? '#1b5bf7' : '#d1d5db'}
                                        />
                                    </button>
                                ))}
                                {newRating > 0 && (
                                    <span className="review-modal__rating-text">
                                        {newRating === 1 && 'Ужасно'}
                                        {newRating === 2 && 'Плохо'}
                                        {newRating === 3 && 'Нормально'}
                                        {newRating === 4 && 'Хорошо'}
                                        {newRating === 5 && 'Отлично'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="review-modal__field">
                            <label className="review-modal__label">Комментарий</label>
                            <textarea
                                className="review-modal__textarea"
                                placeholder="Расскажите о своём опыте использования товара..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                rows={5}
                            />
                        </div>

                        {submitError && (
                            <div className="review-modal__error">{submitError}</div>
                        )}

                        <button
                            className="review-modal__submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || newRating < 1 || !newComment.trim()}
                        >
                            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}