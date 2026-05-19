'use client';

import React, { useState } from 'react';
import './catalog.css';
import { Monitor, Shirt, Package, Home, Smile, Heart, Gamepad2, Book, ChevronDown, ChevronUp } from 'lucide-react';

const categories = [
    { id: 'electronics', label: 'Электроника', icon: <Monitor size={16} /> },
    { id: 'clothes', label: 'Одежда', icon: <Shirt size={16} /> },
    { id: 'shoes', label: 'Обувь', icon: <Package size={16} /> },
    { id: 'home', label: 'Дом и сад', icon: <Home size={16} /> },
    { id: 'sport', label: 'Спорт', icon: <Smile size={16} /> },
    { id: 'beauty', label: 'Красота', icon: <Heart size={16} /> },
    { id: 'toys', label: 'Игрушки', icon: <Gamepad2 size={16} /> },
    { id: 'books', label: 'Книги', icon: <Book size={16} /> },
];

const subcategoriesData = {
    shoes: {
        title: 'Обувь',
        subtitle: 'Выберите подкатегорию',
        columns: [
            [
                {
                    title: 'Женская обувь',
                    items: ['аквашузы', 'босоножки', 'сапоги', 'кроссовки', 'кеды', 'шлепки', 'тапки'],
                },
            ],
            [
                {
                    title: 'Мужская обувь',
                    items: ['сандали', 'кроссовки', 'тапки'],
                },
            ],
            [
                {
                    title: 'Детская обувь',
                    items: ['обувь для девочек', 'обувь для мальчиков', 'школа'],
                },
                {
                    title: 'Уход и аксессуары',
                    items: ['губки', 'щётки', 'ложки и рожки'],
                },
            ],
        ],
    },
};

interface CatalogProps {
    isCompact: boolean;
}

export function Catalog() {
    const [activeCategory, setActiveCategory] = useState('shoes');

    const activeData = subcategoriesData[activeCategory as keyof typeof subcategoriesData];

    return (
        <div className="catalog-container">
            <div className="catalog">
            <aside className="catalog__sidebar">
                <div className="catalog__sidebar-header">
                    <h3 className="catalog__sidebar-title">Категории</h3>
                    <span className="catalog__sidebar-arrow">
                        <ChevronDown size={10} />
                    </span>
                </div>

                <ul className="catalog__category-list">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className={`catalog__category-item ${
                                activeCategory === category.id ? 'catalog__category-item--active' : ''
                            }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span className="catalog__category-icon">{category.icon}</span>
                            {category.label}
                        </li>
                    ))}
                </ul>

                <div className="catalog__sidebar-header" style={{ paddingTop: '16px', paddingBottom: 0 }}>
                    <span style={{ visibility: 'hidden' }}>Spacer</span>
                    <span className="catalog__sidebar-arrow">
                        <ChevronUp size={10} />
                    </span>
                </div>
            </aside>

            <main className="catalog__content">
                {activeData ? (
                    <>
                        <header className="catalog__header">
                            <h1 className="catalog__title">{activeData.title}</h1>
                            <p className="catalog__subtitle">{activeData.subtitle}</p>
                        </header>

                        <div className="catalog__grid">
                            {activeData.columns.map((col, colIndex) => (
                                <div key={colIndex} className="catalog__column">
                                    {col.map((group, groupIndex) => (
                                        <section key={groupIndex} className="catalog__group">
                                            <h2 className="catalog__group-title">{group.title}</h2>
                                            <ul className="catalog__item-list">
                                                {group.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="catalog__item">
                                                        <a href="#" className="catalog__item-link">
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="catalog__header">
                        <h1 className="catalog__title">Раздел в разработке</h1>
                        <p className="catalog__subtitle">Выберите категорию "Обувь" для просмотра макета</p>
                    </div>
                )}
            </main>
            </div>
        </div>
    );
}