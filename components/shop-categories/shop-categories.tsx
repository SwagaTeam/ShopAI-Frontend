'use client';

import React from 'react';
import { Folder } from 'lucide-react';
import './shop-categories.css';

interface Category {
    id: string;
    name: string;
    shopId: string;
    parentCategoryId: string | null;
    subCategories: Category[];
}

interface ShopCategoriesProps {
    categories: Category[];
    isLoading: boolean;
}

const CategoryItem = ({ category, level = 0 }: { category: Category; level?: number }) => {
    return (
        <>
            <div className="category-item" style={{ marginLeft: `${level * 24}px` }}>
                <div className="category-item__content">
                    <Folder size={18} color="#667085" />
                    <span className="category-item__name">{category.name}</span>
                </div>
            </div>
            {category.subCategories && category.subCategories.length > 0 && (
                category.subCategories.map((subCat) => (
                    <CategoryItem key={subCat.id} category={subCat} level={level + 1} />
                ))
            )}
        </>
    );
};

export const ShopCategories = ({ categories, isLoading }: ShopCategoriesProps) => {
    return (
        <div className="shop-categories">
            <div className="shop-categories__header">
                <h2 className="shop-categories__title">Категории товаров</h2>
                <button className="shop-categories__add-btn">
                    <span>+</span>
                    Добавить категорию
                </button>
            </div>

            <div className="shop-categories__list">
                {isLoading ? (
                    <p style={{ color: '#667085' }}>Загрузка категорий...</p>
                ) : categories.length === 0 ? (
                    <p style={{ color: '#667085' }}>У магазина нет категорий</p>
                ) : (
                    categories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                    ))
                )}
            </div>
        </div>
    );
};
