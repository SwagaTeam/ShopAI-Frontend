'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import './shop-products.css';
import { ShopProduct, Brand, Category, useShopStore } from '@/data/store/useShopStore';
import {sileo} from "sileo";

interface ShopProductsProps {
    products: ShopProduct[];
    isLoading: boolean;
    page: number;
    totalCount: number;
}

export const ShopProducts = ({ products, isLoading, page, totalCount }: ShopProductsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [stockQuantity, setStockQuantity] = useState(0);
    const [categoryId, setCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [formError, setFormError] = useState('');

    const {
        categories,
        brands,
        shop,
        isSubmittingProduct,
        fetchBrands,
        createProduct
    } = useShopStore();

    useEffect(() => {
        if (brands.length === 0) {
            fetchBrands();
        }
    }, [brands.length, fetchBrands]);

    const flattenCategories = (categories: Category[], prefix = ''): Array<{ id: string; name: string }> => {
        return categories.flatMap((category) => [
            { id: category.id, name: `${prefix}${category.name}` },
            ...flattenCategories(category.subCategories || [], `${prefix}— `)
        ]);
    };

    const categoryOptions = flattenCategories(categories);

    const resetForm = () => {
        setName('');
        setPrice(0);
        setDescription('');
        setImageUrl('');
        setStockQuantity(0);
        setCategoryId('');
        setBrandId('');
        setFormError('');
    };

    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!shop) {
            setFormError('Магазин не загружен.');
            return;
        }

        if (!name.trim() || price <= 0 || stockQuantity < 0 || !categoryId || !brandId) {
            setFormError('Заполните все обязательные поля.');
            return;
        }

        const success = await createProduct({
            shopId: shop.id,
            name: name.trim(),
            price,
            categoryId,
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            stockQuantity,
            brandId
        });

        if (success) {
            setIsModalOpen(false);
            resetForm();
            sileo.success({ title: "Успех!", description: `Товар ${name} создан`, duration: 2000  });
        } else {
            setFormError('Не удалось создать товар. Попробуйте ещё раз.');
        }
    };

    return (
        <div className="shop-products">
            <div className="shop-products__header">
                <h2 className="shop-products__title">Товары</h2>
                <button
                    className="shop-products__add-btn"
                    onClick={openModal}
                >
                    + Добавить товар
                </button>
            </div>

            <div className="shop-products__meta">
                <span>Страница {page}</span>
                <span>{totalCount} товаров</span>
            </div>

            <div className="shop-products__table-wrapper">
                {isLoading ? (
                    <p className="shop-products__empty">Загрузка товаров...</p>
                ) : products.length === 0 ? (
                    <p className="shop-products__empty">У магазина пока нет товаров</p>
                ) : (
                    <table className="shop-products__table">
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>На складе</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.categoryName ?? '—'}</td>
                                <td>{product.price.toLocaleString('ru-RU')} ₽</td>
                                <td>{product.stockQuantity} шт</td>
                                <td>
                                    <div className="shop-products__actions">
                                        <button className="shop-products__action-btn">
                                            <Pencil size={16} />
                                        </button>
                                        <button className="shop-products__action-btn shop-products__action-btn--danger">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Модальное окно "Добавить товар" */}
            {isModalOpen && (
                <div className="shop-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="shop-modal__header">
                            <h3 className="shop-modal__title">Добавить товар</h3>
                            <button className="shop-modal__close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form className="shop-modal__form" onSubmit={handleSubmit}>
                            <div className="shop-modal__field">
                                <label className="shop-modal__label">Название товара *</label>
                                <input
                                    type="text"
                                    className="shop-modal__input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Например, iPhone 15 Pro"
                                />
                            </div>

                            <div className="shop-modal__row">
                                <div className="shop-modal__field">
                                    <label className="shop-modal__label">Категория *</label>
                                    <select
                                        className="shop-modal__select"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        <option value="">Выберите категорию</option>
                                        {categoryOptions.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="shop-modal__field">
                                    <label className="shop-modal__label">Бренд *</label>
                                    <select
                                        className="shop-modal__select"
                                        value={brandId}
                                        onChange={(e) => setBrandId(e.target.value)}
                                    >
                                        <option value="">Выберите бренд</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="shop-modal__row">
                                <div className="shop-modal__field">
                                    <label className="shop-modal__label">Цена (₽) *</label>
                                    <input
                                        type="number"
                                        className="shop-modal__input"
                                        value={price}
                                        min={0}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                    />
                                </div>
                                <div className="shop-modal__field">
                                    <label className="shop-modal__label">Количество на складе *</label>
                                    <input
                                        type="number"
                                        className="shop-modal__input"
                                        value={stockQuantity}
                                        min={0}
                                        onChange={(e) => setStockQuantity(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="shop-modal__field">
                                <label className="shop-modal__label">URL изображения</label>
                                <input
                                    type="text"
                                    className="shop-modal__input"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="shop-modal__field">
                                <label className="shop-modal__label">Описание</label>
                                <textarea
                                    className="shop-modal__textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Краткое описание товара"
                                />
                            </div>

                            {formError && <div className="shop-modal__error">{formError}</div>}

                            <div className="shop-modal__footer">
                                <button type="button" className="shop-modal__btn shop-modal__btn--cancel" onClick={() => setIsModalOpen(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="shop-modal__btn shop-modal__btn--submit" disabled={isSubmittingProduct}>
                                    {isSubmittingProduct ? 'Сохраняем...' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
