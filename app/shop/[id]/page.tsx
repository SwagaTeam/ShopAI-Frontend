'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useShopStore } from '@/data/store/useShopStore';
import { ProductCard } from '@/components/product-card/product-card';
import { Placeholder } from '@/components/placeholder/placeholder';
import { ShoppingBag, Info, ShieldCheck } from 'lucide-react';
import { parseLogoPath } from "@/utils/utils";
import { ProductCardSkeleton } from "@/components/skeleton/skeleton";
import { Header } from "@/components/header/header";
import './shop-user.css';
import LogoLoop from "@/components/logo-loop/LogoLoop";
import {ItemInterface} from "@/data/interfaces/ItemInterface";

export default function UserShopPage() {
    const { id } = useParams();
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

    const {
        shop,
        products,
        categories,
        brands,
        isLoading,
        error,
        fetchShop,
        fetchShopProducts,
        fetchCategories,
        fetchBrands,
        productsPage,
        totalProductPages
    } = useShopStore();

    useEffect(() => {
        if (id) {
            const shopIdStr = id as string;
            fetchShop(shopIdStr);
            fetchCategories(shopIdStr);
            fetchBrands();
            fetchShopProducts(shopIdStr, 1, 20);
        }
    }, [id, fetchShop, fetchCategories, fetchBrands, fetchShopProducts]);

    if (error && !isLoading) {
        return (
            <div className="shop-user-main">
                <Placeholder
                    title="Что-то пошло не так"
                    text="Мы уже чиним эту страницу. Попробуйте обновить чуть позже."
                    buttonText="Обновить страницу"
                    img="/images/robot-error.png"
                    onButtonClick={() => window.location.reload()}
                />
            </div>
        );
    }

    const background = shop ? parseLogoPath(shop.logoPath) : "#005bff";

    const handleCategoryChange = (categoryId: string | null) => {
        setActiveCategoryId(categoryId);
        if (id) {
            // Если ваш бэкенд поддерживает фильтрацию по категории, передайте её аргументом:
            fetchShopProducts(id as string, 1, 20);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageChange = (newPage: number) => {
        if (id && newPage >= 1 && newPage <= totalProductPages) {
            fetchShopProducts(id as string, newPage, 20);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Трансформируем бренды для LogoLoop
    const formattedBrands = brands?.map(brand => ({
        src: brand.logoUrl,
        alt: brand.name,
        href: brand.logoUrl // или ссылка на внутренний поиск по бренду, если есть
    })) || [];

    return (
        <>
            <Header isCompact={false} />

            <main className="shop-user-main">
                {/* Баннер магазина */}
                <div className="shop-user-showcase" style={{ background }}>
                    <div className="shop-user-showcase__overlay">
                        <div className="shop-user-brand-block">
                            {shop?.logoPath && !shop.logoPath.startsWith('#') && !shop.logoPath.startsWith('linear') ? (
                                <img src={shop.logoPath} alt={shop.name} className="shop-user-avatar" />
                            ) : (
                                <div className="shop-user-avatar-fallback">
                                    {shop?.name ? shop.name.charAt(0).toUpperCase() : 'M'}
                                </div>
                            )}
                            <div className="shop-user-info">
                                <h1 className="shop-user-title">
                                    {isLoading ? 'Загрузка магазина...' : shop?.name}
                                </h1>
                                <p className="shop-user-status">
                                    <ShieldCheck size={16} className="ozon-verified-icon" />
                                    Проверенный продавец Ozon
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Карусель брендов магазина (если они есть) */}
                {formattedBrands.length > 0 && (
                    <div className="shop-user-brands-loop">
                        <LogoLoop
                            logos={formattedBrands}
                            speed={60}
                            direction="left"
                            logoHeight={60}
                            gap={60}
                            scaleOnHover
                            fadeOutColor={"#ffffff"}
                            ariaLabel="Бренды магазина"
                        />
                    </div>
                )}

                <div className="shop-user-content-layout">
                    {/* Категории магазина */}
                    {categories && categories.length > 0 && (
                        <nav className="shop-user-categories" aria-label="Категории магазина">
                            <span className="shop-user-categories__title">Категории</span>
                            <div className="shop-user-categories__list">
                                <button
                                    className={`shop-user-category-badge ${activeCategoryId === null ? 'is-active' : ''}`}
                                    onClick={() => handleCategoryChange(null)}
                                >
                                    Все товары
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`shop-user-category-badge ${activeCategoryId === cat.id ? 'is-active' : ''}`}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* Описание магазина */}
                    {shop?.description && (
                        <div className="shop-user-description-card">
                            <Info size={20} className="shop-user-description-icon" />
                            <div className="shop-user-description-text">
                                <h3>О магазине</h3>
                                <p>{shop.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Сетка товаров */}
                    <section className="shop-user-products-section">
                        <div className="shop-user-section-header">
                            <h2 className="shop-user-section-title">
                                Все товары магазина
                            </h2>
                            {!isLoading && <span className="shop-user-products-count">Найдено: {products.length}</span>}
                        </div>

                        {isLoading ? (
                            <div className="shop-user__grid">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <Placeholder
                                title="В этом магазине пока нет товаров"
                                text="Загляните сюда позже или вернитесь на главную витрину."
                                buttonText="Вернуться на главную"
                                img="/images/placeholder.png"
                                nav="/main"
                            />
                        ) : (
                            <>
                                <div className="shop-user__grid">
                                    {(products as ItemInterface[]).map((item) => (
                                        <ProductCard item={item} key={item.id} />
                                    ))}
                                </div>

                                {/* Пагинация */}
                                {totalProductPages > 1 && (
                                    <div className="ozon-pagination">
                                        <button
                                            className="ozon-pagination__btn"
                                            disabled={productsPage === 1}
                                            onClick={() => handlePageChange(productsPage - 1)}
                                        >
                                            Назад
                                        </button>
                                        {Array.from({ length: totalProductPages }).map((_, idx) => {
                                            const pageNum = idx + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`ozon-pagination__page ${productsPage === pageNum ? 'is-active' : ''}`}
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            className="ozon-pagination__btn"
                                            disabled={productsPage === totalProductPages}
                                            onClick={() => handlePageChange(productsPage + 1)}
                                        >
                                            Вперед
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}