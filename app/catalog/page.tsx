"use client";

import React, { useEffect } from 'react';
import './catalog.css';
import {Header} from "@/components/header/header";
import {ProductCardSkeleton} from "@/components/skeleton/skeleton";
import {ProductCard} from "@/components/product-card/product-card";
import {useCatalogStore} from "@/data/store/useCatalogStore";


export default function CatalogPage() {
    const {
        products,
        categories,
        brands,
        isLoading,
        totalCount,
        filters,
        setFilters,
        fetchProducts,
        fetchCategories,
        fetchBrands,
        resetFilters
    } = useCatalogStore();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setFilters({ categoryId: filters.categoryId === categoryId ? undefined : categoryId });
    };

    const handleBrandChange = (brandId: string) => {
        setFilters({ brandId: filters.brandId === brandId ? undefined : brandId });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'price_asc') setFilters({ sortBy: 'price', sortDescending: false });
        else if (val === 'price_desc') setFilters({ sortBy: 'price', sortDescending: true });
        else setFilters({ sortBy: val, sortDescending: true });
    };

    return (
        <div className="layout">
            <Header isCompact={false} />

            <main className="catalog">
                <div className="catalog__container">

                    {/* Хлебные крошки */}
                    <nav className="breadcrumbs">
                        <a href="/" className="breadcrumbs__link">Главная</a>
                        <span className="breadcrumbs__separator">{'>'}</span>
                        <a href="/shoes" className="breadcrumbs__link">Обувь</a>
                        <span className="breadcrumbs__separator">{'>'}</span>
                        <span className="breadcrumbs__current">Кроссовки</span>
                    </nav>

                    {/* Заголовок страницы */}
                    <div className="catalog__header">
                        <h1 className="catalog__title">Каталог</h1>
                        <span className="catalog__count">{totalCount} товаров</span>
                    </div>

                    <div className="catalog__body">

                        {/* Сайдбар с фильтрами */}
                        <aside className="filters">

                            {/* Фильтр: Категории */}
                            <div className="filter-group">
                                <h3 className="filter-group__title">Категории</h3>
                                <ul className="checkbox-list">
                                    {categories.map(cat => (
                                        <li className="checkbox-item" key={cat.id}>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox-input"
                                                    checked={filters.categoryId === cat.id}
                                                    onChange={() => handleCategoryChange(cat.id)}
                                                />
                                                <span className="checkbox-custom"></span>
                                                <span className="checkbox-text">{cat.name}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Фильтр: Цена */}
                            <div className="filter-group">
                                <h3 className="filter-group__title">Цена</h3>
                                <div className="filter-price">
                                    <div className="filter-price__inputs">
                                        <input
                                            type="number"
                                            className="filter-price__input"
                                            placeholder="От"
                                            value={filters.minPrice || ''}
                                            onChange={(e) => setFilters({ minPrice: Number(e.target.value) || undefined })}
                                        />
                                        <input
                                            type="number"
                                            className="filter-price__input"
                                            placeholder="До"
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => setFilters({ maxPrice: Number(e.target.value) || undefined })}
                                        />
                                    </div>
                                    {/* Сохраняем визуальный слайдер из верстки */}
                                    <div className="filter-price__slider">
                                        <div className="filter-price__slider-track">
                                            <div className="filter-price__slider-range"></div>
                                            <div className="filter-price__slider-thumb filter-price__slider-thumb--left"></div>
                                            <div className="filter-price__slider-thumb filter-price__slider-thumb--right"></div>
                                        </div>
                                    </div>
                                    <div className="filter-price__labels">
                                        <span>0 ₽</span>
                                        <span>50 000 ₽</span>
                                    </div>
                                </div>
                            </div>

                            {/* Фильтр: Бренд */}
                            <div className="filter-group">
                                <h3 className="filter-group__title">Бренд</h3>
                                <ul className="checkbox-list">
                                    {brands.map(brand => (
                                        <li className="checkbox-item" key={brand.id}>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox-input"
                                                    checked={filters.brandId === brand.id}
                                                    onChange={() => handleBrandChange(brand.id)}
                                                />
                                                <span className="checkbox-custom"></span>
                                                <span className="checkbox-text">{brand.name}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Фильтр: Рейтинг */}
                            <div className="filter-group">
                                <h3 className="filter-group__title">Рейтинг</h3>
                                <ul className="checkbox-list">
                                    {[5, 4, 3].map(rating => (
                                        <li className="checkbox-item" key={rating}>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox-input"
                                                    checked={filters.minRating === rating}
                                                    onChange={() => setFilters({ minRating: filters.minRating === rating ? undefined : rating })}
                                                />
                                                <span className="checkbox-custom"></span>
                                                <span className="checkbox-text rating-stars">
                                                    {'★'.repeat(rating)}
                                                    <span className="rating-stars--empty">{'★'.repeat(5 - rating)}</span>
                                                    {rating < 5 && ' и выше'}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Фильтр: Размер обуви (Сохраняем структуру верстки) */}
                            <div className="filter-group">
                                <h3 className="filter-group__title">Размер обуви</h3>
                                <div className="size-tabs">
                                    <button className="size-tabs__btn size-tabs__btn--active">RU</button>
                                    <button className="size-tabs__btn">US</button>
                                    <button className="size-tabs__btn">UK</button>
                                    <button className="size-tabs__btn">EU</button>
                                    <button className="size-tabs__btn">Стопа, см</button>
                                </div>
                                <div className="size-grid">
                                    {[38, 39, 40, 41, 42, 43].map(size => (
                                        <label className="checkbox-label" key={size}>
                                            <input type="checkbox" className="checkbox-input" />
                                            <span className="checkbox-custom"></span>
                                            <span className="checkbox-text">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Сброс фильтров */}
                            <button className="btn-reset-filters" onClick={resetFilters}>Сбросить фильтры</button>
                        </aside>

                        {/* Основной контент */}
                        <div className="catalog__content">

                            {/* Блок ИИ Помощника */}
                            <div className="ai-prompt-box">
                                <div className="ai-prompt-box__icon">🤖</div>
                                <input
                                    type="text"
                                    className="ai-prompt-box__input"
                                    placeholder="Напишите уточнение ИИ-помощнику:"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            // Здесь может быть логика ИИ, пока оставляем как есть
                                            console.log("AI Prompt:", (e.target as HTMLInputElement).value);
                                        }
                                    }}
                                />
                                <button className="ai-prompt-box__btn">Уточнить 💡</button>
                            </div>

                            {/* Сортировка */}
                            <div className="catalog__controls">
                                <select className="sort-select" onChange={handleSortChange} value={filters.sortBy === 'price' ? (filters.sortDescending ? 'price_desc' : 'price_asc') : filters.sortBy}>
                                    <option value="popularity">По популярности</option>
                                    <option value="price_asc">Сначала дешевые</option>
                                    <option value="price_desc">Сначала дорогие</option>
                                    <option value="rating">По рейтингу</option>
                                    <option value="name">По названию</option>
                                    <option value="createdAt">По новизне</option>
                                </select>
                            </div>

                            <div className="selections__grid">
                                {isLoading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <ProductCardSkeleton key={i} />
                                    ))
                                ) : products.length > 0 ? (
                                    products.map((item) => (
                                        <ProductCard
                                            item={item}
                                            key={item.id}
                                        />
                                    ))
                                ) : (
                                    <p>Нет товаров</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
