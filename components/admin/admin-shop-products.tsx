'use client';

import React, { useEffect, useState } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Package,
    Image as ImageIcon
} from 'lucide-react';
import { useShopStore } from '@/data/store/useShopStore';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import Link from 'next/link';
import './admin-shop-products.css';

export const AdminShopProducts = () => {
    const {
        products,
        fetchShopProducts,
        shop,
        isLoading,
        productsPage,
        totalProductPages,
        totalProducts,
        productsPageSize,
        deleteProduct
    } = useShopStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({
        isOpen: false,
        productId: '',
        productName: ''
    });

    useEffect(() => {
        if (shop?.id) {
            fetchShopProducts(shop.id, 1, productsPageSize);
        }
    }, [shop?.id, fetchShopProducts, productsPageSize]);

    const handlePageChange = (newPage: number) => {
        if (shop?.id && newPage >= 1 && newPage <= totalProductPages) {
            fetchShopProducts(shop.id, newPage, productsPageSize);
        }
    };

    const handleDeleteProduct = (productId: string, productName: string) => {
        setDeleteModal({
            isOpen: true,
            productId,
            productName
        });
    };

    const confirmDelete = async () => {
        if (deleteModal.productId) {
            await deleteProduct(deleteModal.productId);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="admin-shop-products">
            <div className="admin-shop-products__header">
                <h2 className="admin-shop-products__title">Товары магазина</h2>
                <Link href={`/admin/products/create?shopId=${shop?.id}`} className="admin-shop-products__add-btn">
                    <Plus size={18} />
                    Добавить товар
                </Link>
            </div>

            <div className="admin-shop-products__toolbar">
                <div className="admin-shop-products__search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск по названию или id..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-shop-products__table-container">
                {isLoading ? (
                    <div className="admin-shop-products__loading">
                        <Package size={40} className="animate-bounce mb-4 opacity-20" />
                        <p>Загрузка товаров...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="admin-shop-products__empty">
                        <Package size={40} className="mb-4 opacity-20" />
                        <p>В магазине пока нет товаров</p>
                    </div>
                ) : (
                    <table className="admin-shop-products__table">
                        <thead>
                            <tr>
                                <th>Товар</th>
                                <th>Бренд</th>
                                <th>Цена</th>
                                <th>Остаток</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-cell-info">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="product-image-mini" />
                                            ) : (
                                                <div className="product-image-mini flex items-center justify-center">
                                                    <ImageIcon size={20} className="text-slate-300" />
                                                </div>
                                            )}
                                            <div className="product-name-wrapper">
                                                <span className="product-name">{product.name}</span>
                                                <span className="product-id">ID: {product.id.substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.brandName || '—'}</td>
                                    <td>
                                        <span className="product-price">{formatPrice(product.price)}</span>
                                    </td>
                                    <td>
                                        <span className={`product-badge badge-stock ${
                                            product.stockQuantity === 0 ? 'out' :
                                            product.stockQuantity < 10 ? 'low' : ''
                                        }`}>
                                            {product.stockQuantity === 0 ? 'Нет в наличии' : `${product.stockQuantity} шт.`}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="product-actions">
                                            <Link href={`/admin/products/${product.id}/edit`} className="product-action-btn" title="Редактировать">
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                className="product-action-btn delete"
                                                title="Удалить"
                                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                            >
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

            {!isLoading && products.length > 0 && (
                <div className="admin-shop-products__footer">
                    <div className="pagination-info">
                        Показано {(productsPage - 1) * productsPageSize + 1} - {Math.min(productsPage * productsPageSize, totalProducts)} из {totalProducts} товаров
                    </div>

                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={productsPage === 1}
                            onClick={() => handlePageChange(productsPage - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {[...Array(totalProductPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`pagination-btn ${productsPage === i + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="pagination-btn"
                            disabled={productsPage === totalProductPages}
                            onClick={() => handlePageChange(productsPage + 1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Удаление товара"
                message={`Вы уверены, что хотите удалить товар "${deleteModal.productName}"? Это действие нельзя будет отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
                isDanger={true}
            />
        </div>
    );
};
