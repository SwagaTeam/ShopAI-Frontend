"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import './catalog.css';
import { Header } from "@/components/header/header";
import { ProductCardSkeleton } from "@/components/skeleton/skeleton";
import { ProductCard } from "@/components/product-card/product-card";
import { useCatalogStore } from "@/data/store/useCatalogStore";
import { Filter, X, Loader2 } from 'lucide-react';
import {Placeholder} from "@/components/placeholder/placeholder";

export default function CatalogPage() {
    const {
        products,
        brands,
        isLoading,
        isFetchingMore,
        totalCount,
        filters,
        setFilters,
        fetchProducts,
        fetchBrands,
        resetFilters
    } = useCatalogStore();

    const [brandSearch, setBrandSearch] = useState('');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, []);

    const lastProductElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && products.length < totalCount) {
                setFilters({ pageNumber: (filters.pageNumber || 1) + 1 });
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingMore, products.length, totalCount, filters.pageNumber, setFilters]);

    const handleBrandChange = (brandId: string) => {
        setFilters({ brandId: filters.brandId === brandId ? undefined : brandId, pageNumber: 1 });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'price_asc') setFilters({ sortBy: 'price', sortDescending: false, pageNumber: 1 });
        else if (val === 'price_desc') setFilters({ sortBy: 'price', sortDescending: true, pageNumber: 1 });
        else setFilters({ sortBy: val, sortDescending: true, pageNumber: 1 });
    };

    const filteredBrands = useMemo(() => {
        return brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));
    }, [brands, brandSearch]);

    return (
        <div className="layout">
            <Header isCompact={false} />

            <main className="catalog">
                <aside className={`catalog-sidebar ${isMobileFiltersOpen ? 'catalog-sidebar--open' : ''}`}>
                    <div className="catalog-sidebar__header">
                        <h2 className="catalog-sidebar__title">Фильтры</h2>
                        <button
                            className="catalog-sidebar__close"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Фильтр: Цена */}
                    <div className="catalog-filter-group">
                        <h3 className="catalog-filter-group__title">Цена, ₽</h3>
                        <div className="catalog-filter-price">
                            <div className="catalog-filter-price__inputs">
                                <input
                                    type="number"
                                    className="catalog-filter-price__input"
                                    placeholder="От"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => setFilters({ minPrice: Number(e.target.value) || undefined, pageNumber: 1 })}
                                />
                                <input
                                    type="number"
                                    className="catalog-filter-price__input"
                                    placeholder="До"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => setFilters({ maxPrice: Number(e.target.value) || undefined, pageNumber: 1 })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Фильтр: Бренд */}
                    <div className="catalog-filter-group">
                        <h3 className="catalog-filter-group__title">Бренды</h3>
                        <div className="catalog-filter-search">
                            <input
                                type="text"
                                className="catalog-filter-search__input"
                                placeholder="Поиск..."
                                value={brandSearch}
                                onChange={(e) => setBrandSearch(e.target.value)}
                            />
                        </div>
                        <ul className="catalog-checkbox-list">
                            {filteredBrands.map(brand => (
                                <li className="catalog-checkbox-item" key={brand.id}>
                                    <label className="catalog-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="catalog-checkbox-input"
                                            checked={filters.brandId === brand.id}
                                            onChange={() => handleBrandChange(brand.id)}
                                        />
                                        {brand.logoUrl && (
                                            <img
                                                src={brand.logoUrl}
                                                alt={brand.name}
                                                className="catalog-checkbox-logo"
                                            />
                                        )}
                                        <span className="catalog-checkbox-text">{brand.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Фильтр: В наличии */}
                    <div className="catalog-filter-group">
                        <h3 className="catalog-filter-group__title">Наличие</h3>
                        <ul className="catalog-checkbox-list" style={{ maxHeight: 'none', overflow: 'visible' }}>
                            <li className="catalog-checkbox-item">
                                <label className="catalog-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="catalog-checkbox-input"
                                        checked={filters.inStock === true}
                                        onChange={() => setFilters({ inStock: filters.inStock ? undefined : true, pageNumber: 1 })}
                                    />
                                    <span className="catalog-checkbox-text">Только в наличии</span>
                                </label>
                            </li>
                        </ul>
                    </div>

                    {/* Сброс фильтров */}
                    <button className="catalog-btn-reset" onClick={resetFilters}>Сбросить всё</button>
                </aside>


                <div className="catalog__container">

                    {/* Заголовок страницы */}
                    <div className="catalog__header">
                        <h1 className="catalog__title">Все товары</h1>
                        <span className="catalog__count">{totalCount} товаров</span>
                    </div>

                    <div className="catalog__body">

                        {/* Основной контент */}
                        <div className="catalog__content">

                            {/* Блок ИИ Помощника
                            <div className="catalog-ai-box">
                                <div className="catalog-ai-box__icon">🤖</div>
                                <input
                                    type="text"
                                    className="catalog-ai-box__input"
                                    placeholder="Подобрать товары с ИИ (например: 'белые кроссовки до 5000')"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            console.log("AI Prompt:", (e.target as HTMLInputElement).value);
                                        }
                                    }}
                                />
                                <button className="catalog-ai-box__btn">Найти</button>
                            </div>*/}

                            {/* Сортировка */}
                            <div className="catalog__controls">
                                <button
                                    className="catalog-btn-mobile-filters"
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                >
                                    <Filter size={18} />
                                    <span>Фильтры</span>
                                </button>

                                <select
                                    className="catalog-sort-select"
                                    onChange={handleSortChange}
                                    value={filters.sortBy === 'price' ? (filters.sortDescending ? 'price_desc' : 'price_asc') : filters.sortBy}
                                >
                                    <option value="popularity">Популярные</option>
                                    <option value="price_asc">Дешевле</option>
                                    <option value="price_desc">Дороже</option>
                                    <option value="rating">Высокий рейтинг</option>
                                    <option value="createdAt">Новинки</option>
                                </select>
                            </div>

                            <div className="catalog-page-grid">
                                {isLoading && products.length === 0 ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <ProductCardSkeleton key={i} />
                                    ))
                                ) : products.length > 0 ? (
                                    <>
                                        {products.map((item, index) => {
                                            if (products.length === index + 1) {
                                                return (
                                                    <div ref={lastProductElementRef} key={item.id}>
                                                        <ProductCard item={item} />
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <ProductCard
                                                        item={item}
                                                        key={item.id}
                                                    />
                                                );
                                            }
                                        })}
                                    </>
                                ) : (
                                    <div style={{ gridColumn: '1 / -1'}}>
                                        <Placeholder
                                            title={"Товары не найдены"}
                                            text={"Обратитесь ко мне за помощью :)"}
                                            buttonText={"Искать товары с Шопи"}
                                            img={"/images/robot-info.png"}
                                            nav={"/ai-assistant"}
                                        />
                                    </div>
                                )}
                            </div>

                            {(isFetchingMore || (isLoading && products.length > 0)) && (
                                <div className="catalog-infinite-loader" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                                    <Loader2 className="animate-spin" size={32} color="#2562e9" />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
