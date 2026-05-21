'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShopSidebar } from '@/components/shop-sidebar/shop-sidebar';
import { ShopSettings } from '@/components/shop-settings/shop-settings';
import { ShopCategories } from '@/components/shop-categories/shop-categories';
import { ShopProducts } from '@/components/shop-products/shop-products';
import { useShopStore } from '@/data/store/useShopStore';
import '../shop-page.css';
import '@/components/shop-sidebar/shop-sidebar.css';
import '@/components/shop-settings/shop-settings.css';
import '@/components/shop-categories/shop-categories.css';
import '@/components/shop-products/shop-products.css';

export default function ShopPage() {
    const params = useParams() as { id?: string };
    const router = useRouter();
    const shopId = params?.id || '';
    const [activeTab, setActiveTab] = useState('products');
    const {
        shop,
        categories,
        products,
        productsPage,
        totalProducts,
        isLoading,
        error,
        fetchShop,
        fetchCategories,
        fetchBrands,
        fetchShopProducts,
        updateShop,
        deleteShop
    } = useShopStore();

    useEffect(() => {
        if (shopId) {
            fetchShop(shopId);
            fetchCategories(shopId);
            fetchBrands();
            fetchShopProducts(shopId, 1, 20);
        }
    }, [shopId, fetchShop, fetchCategories, fetchBrands, fetchShopProducts]);

    const handleSave = async (name: string, urlAlias: string) => {
        if (shopId) {
            await updateShop(shopId, name, urlAlias);
        }
    };

    const handleDelete = async () => {
        if (!shopId) return;
        await deleteShop(shopId);
        router.push('/profile');
    };

    return (
        <div className="shop-page-container">
            <div className="shop-page__header-container">
                <div className="shop-page__header">
                    <button className="shop-page__back-btn" onClick={() => router.push('/profile')}>
                        &larr;
                    </button>
                    <div className="shop-page__header-text">
                        <h1 className="shop-page__title">
                            {shop ? shop.name : 'Загрузка магазина...'}
                        </h1>
                        {shop && (
                            <p className="shop-page__subtitle">
                                shopai.com/{shop.urlAlias}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="shop-page">
                <ShopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <main className="shop-main-content">
                    {error && <div className="shop-page__error">{error}</div>}
                    {activeTab === 'products' && (
                        <ShopProducts
                            products={products}
                            isLoading={isLoading}
                            page={productsPage}
                            totalCount={totalProducts}
                        />
                    )}
                    {activeTab === 'categories' && (
                        <ShopCategories categories={categories} isLoading={isLoading} />
                    )}
                    {activeTab === 'settings' && shop && (
                        <ShopSettings
                            shopName={shop.name}
                            urlAlias={shop.urlAlias}
                            onSave={handleSave}
                            onDelete={handleDelete}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
