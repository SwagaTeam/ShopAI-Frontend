'use client';

import React, { useState } from 'react';
import { Folder, ChevronRight, X, Plus } from 'lucide-react';
import './shop-categories.css';
import { useShopStore } from '@/data/store/useShopStore';
import {sileo} from "sileo"; // Путь к вашему стору

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
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = category.subCategories && category.subCategories.length > 0;

    return (
        <div className="category-node">
            <div className="category-item" style={{ paddingLeft: `${level * 20 + 12}px` }}>
                <div className="category-item__main">
                    <button
                        className={`category-item__arrow ${!hasChildren ? 'is-hidden' : ''} ${isOpen ? 'is-open' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <ChevronRight size={16} />
                    </button>

                    <div className="category-item__icon">
                        {level === 0 ? <Folder size={18} /> : <div className="category-item__dot" />}
                    </div>

                    <span className="category-item__name">{category.name}</span>
                </div>
            </div>

            {hasChildren && isOpen && (
                <div className="category-node__children">
                    {category.subCategories.map((subCat) => (
                        <CategoryItem key={subCat.id} category={subCat} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const ShopCategories = ({ categories, isLoading }: ShopCategoriesProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    // Получаем методы и состояние из стора
    const shop = useShopStore((state) => state.shop);
    const createCategory = useShopStore((state) => state.createCategory);
    const isSubmitting = useShopStore((state) => state.isSubmittingCategory);

    // Берем ID текущего магазина (или фоллбэк из вашего контракта, если магазин еще не загружен)
    const currentShopId = shop?.id || "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCategoryName('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        const success = await createCategory({
            name: categoryName.trim(),
            shopId: currentShopId,
        });

        if (success) {
            sileo.success({ title: "Успех!", description: `Категория ${categoryName} создана` });
            handleCloseModal();
        }
    };

    return (
        <div className="shop-categories">
            <div className="shop-categories__header">
                <div className="shop-categories__title-group">
                    <h2 className="shop-categories__title">Категории товаров</h2>
                    <span className="shop-categories__count">{categories.length} категорий</span>
                </div>
                <button
                    className="shop-categories__add-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} />
                    Добавить категорию
                </button>
            </div>

            <div className="shop-categories__container">
                {isLoading ? (
                    <div className="shop-categories__empty">Загрузка категорий...</div>
                ) : categories.length === 0 ? (
                    <div className="shop-categories__empty">У магазина нет категорий</div>
                ) : (
                    <div className="shop-categories__list">
                        {categories.map((category) => (
                            <CategoryItem key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Window */}
            {isModalOpen && (
                <div className="category-modal-overlay" onClick={handleCloseModal}>
                    <div className="category-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="category-modal__header">
                            <h3 className="category-modal__title">Добавить категорию</h3>
                            <button className="category-modal__close" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="category-modal__body">
                                <div className="category-modal__field">
                                    <label htmlFor="modalCategoryName">Название категории *</label>
                                    <input
                                        id="modalCategoryName"
                                        type="text"
                                        placeholder="Введите название..."
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        autoFocus
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="category-modal__footer">
                                <button
                                    type="button"
                                    className="category-modal__btn-cancel"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="category-modal__btn-create"
                                    disabled={!categoryName.trim() || isSubmitting}
                                >
                                    {isSubmitting ? 'Создание...' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};