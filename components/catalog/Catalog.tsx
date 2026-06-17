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

export function Catalog() {
    const [activeCategory, setActiveCategory] = useState('shoes');

    const activeData = subcategoriesData[activeCategory as keyof typeof subcategoriesData];

    return (
        <div className="megamenu-container">
            <div className="megamenu">
            <aside className="megamenu__sidebar">
                <div className="megamenu__sidebar-header">
                    <h3 className="megamenu__sidebar-title">Категории</h3>
                    <span className="megamenu__sidebar-arrow">
                        <ChevronDown size={10} />
                    </span>
                </div>

                <ul className="megamenu__category-list">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className={`megamenu__category-item ${
                                activeCategory === category.id ? 'megamenu__category-item--active' : ''
                            }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span className="megamenu__category-icon">{category.icon}</span>
                            {category.label}
                        </li>
                    ))}
                </ul>

                <div className="megamenu__sidebar-header" style={{ paddingTop: '16px', paddingBottom: 0 }}>
                    <span style={{ visibility: 'hidden' }}>Spacer</span>
                    <span className="megamenu__sidebar-arrow">
                        <ChevronUp size={10} />
                    </span>
                </div>
            </aside>

            <main className="megamenu__content">
                {activeData ? (
                    <>
                        <header className="megamenu__header">
                            <h1 className="megamenu__title">{activeData.title}</h1>
                            <p className="megamenu__subtitle">{activeData.subtitle}</p>
                        </header>

                        <div className="megamenu__grid">
                            {activeData.columns.map((col, colIndex) => (
                                <div key={colIndex} className="megamenu__column">
                                    {col.map((group, groupIndex) => (
                                        <section key={groupIndex} className="megamenu__group">
                                            <h2 className="megamenu__group-title">{group.title}</h2>
                                            <ul className="megamenu__item-list">
                                                {group.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="megamenu__item">
                                                        <a href="#" className="megamenu__item-link">
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
                    <div className="megamenu__header">
                        <h1 className="megamenu__title">Раздел в разработке</h1>
                        <p className="megamenu__subtitle">Выберите категорию &quot;Обувь&quot; для просмотра макета</p>
                    </div>
                )}
            </main>
            </div>
        </div>
    );
}
