'use client';

import React, { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useShopStore } from '@/data/store/useShopStore';
import { AdminShopCard } from '@/components/admin/admin-shop-card';
import Link from 'next/link';
import './shop-layout.css';

export default function ShopManagementLayout({ children }: { children: React.ReactNode }) {
    const { id } = useParams();
    const pathname = usePathname();
    const { shop, fetchShop, isLoading } = useShopStore();

    useEffect(() => {
        if (id) {
            fetchShop(id as string);
        }
    }, [id, fetchShop]);

    if (isLoading && !shop) {
        return <div className="shop-layout-loading">Загрузка данных магазина...</div>;
    }

    if (!shop) {
        return <div className="shop-layout-error">Магазин не найден</div>;
    }

    const navItems = [
        { name: 'Товары', path: `/admin/shop/${id}/products` },
        { name: 'Категории', path: `/admin/shop/${id}/categories` },
    ];

    return (
        <div className="shop-management-layout">
            <div className="shop-management-header">
                <AdminShopCard shop={shop} index={0} showManageButton={false} />
            </div>

            <nav className="shop-management-nav">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`shop-management-nav__item ${isActive ? 'is-active' : ''}`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="shop-management-content">
                {children}
            </div>
        </div>
    );
}
