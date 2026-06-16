'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Smartphone,
    Laptop,
    Headphones,
    Watch,
    Folder,
    Edit2,
    Trash2,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { useShopStore, Category } from '@/data/store/useShopStore';
import Link from 'next/link';
import './admin-shop-categories.css';

interface CategoryNodeProps {
    category: Category;
    level?: number;
}

const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('смартфон')) return <Smartphone size={18} />;
    if (n.includes('ноутбук')) return <Laptop size={18} />;
    if (n.includes('аксессуар')) return <Headphones size={18} />;
    if (n.includes('час')) return <Watch size={18} />;
    return <Folder size={18} />;
};

const CategoryNode = ({ category, level = 0 }: CategoryNodeProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = category.subCategories && category.subCategories.length > 0;

    return (
        <div className="admin-category-node">
            <div
                className={`admin-category-item ${level > 0 ? 'is-sub' : ''}`}
                style={{ paddingLeft: level > 0 ? `${level * 40 + 24}px` : '24px' }}
            >
                <div className="admin-category-item__left">
                    {/* Линия дерева для глубоких уровней */}
                    {level > 1 && (
                        <div
                            className="admin-category-item__level-line"
                            style={{ left: `${(level - 1) * 40 + 12}px` }}
                        />
                    )}

                    <button
                        className={`admin-category-item__toggle ${!hasChildren ? 'is-hidden' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <div className="admin-category-item__icon">
                        {getCategoryIcon(category.name)}
                    </div>

                    <div className="admin-category-item__info">
                        <span className="admin-category-item__name">{category.name}</span>
                    </div>
                </div>

                {/*<div className="admin-category-item__right">
                    <span className="admin-category-item__count">Товаров: 156</span>
                    <div className="admin-category-item__actions">
                        <button className="admin-category-item__action-btn"><Edit2 size={16} /></button>
                        <button className="admin-category-item__action-btn"><Trash2 size={16} /></button>
                    </div>
                </div>*/}
            </div>

            {hasChildren && isOpen && (
                <div className="admin-category-node__children">
                    {category.subCategories.map(sub => (
                        <CategoryNode key={sub.id} category={sub} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Helper to filter tree
const filterCategoryTree = (categories: Category[], query: string): Category[] => {
    if (!query) return categories;

    return categories.reduce((acc: Category[], cat) => {
        const isMatch = cat.name.toLowerCase().includes(query.toLowerCase());
        const filteredSubs = cat.subCategories ? filterCategoryTree(cat.subCategories, query) : [];
        const hasMatchingSubs = filteredSubs.length > 0;

        if (isMatch || hasMatchingSubs) {
            acc.push({
                ...cat,
                subCategories: filteredSubs
            });
        }
        return acc;
    }, []);
};

export const AdminShopCategories = () => {
    const { categories, fetchCategories, shop, isLoading } = useShopStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (shop?.id) {
            fetchCategories(shop.id);
        }
    }, [shop?.id, fetchCategories]);

    const filteredCategories = filterCategoryTree(categories, searchQuery);

    return (
        <div className="admin-shop-categories">
            <div className="admin-shop-categories__header">
                <h2 className="admin-shop-categories__title">Категории</h2>
                <Link href={`/admin/shop/${shop?.id}/categories/create`} className="admin-shop-categories__add-btn">
                    <Plus size={18} />
                    Добавить категорию
                </Link>
            </div>

            <div className="admin-shop-categories__toolbar">
                <div className="admin-shop-categories__search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск категории..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-shop-categories__list">
                {isLoading ? (
                    <div className="admin-shop-categories__loading">Загрузка категорий...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="admin-shop-categories__empty">Категории не найдены</div>
                ) : (
                    filteredCategories.map(category => (
                        <CategoryNode key={category.id} category={category} />
                    ))
                )}
            </div>

            <div className="admin-shop-categories__footer">
                Всего: {categories.length} категорий
            </div>
        </div>
    );
};
