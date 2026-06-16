'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useShopStore } from '@/data/store/useShopStore';
import { AdminShopCard, AdminShopCardSkeleton } from '@/components/admin/admin-shop-card';
import { Placeholder } from '@/components/placeholder/placeholder';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import { Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import './shop-layout.css';

export default function ShopManagementLayout({ children }: { children: React.ReactNode }) {
    const { id } = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const { shop, fetchShop, isLoading, error, deleteShop } = useShopStore();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (id && !isLoading && !error && (!shop || shop.id !== id)) {
            fetchShop(id as string);
        }
    }, [id, fetchShop, shop, isLoading, error]);

    const handleDeleteShop = async () => {
        if (id) {
            await deleteShop(id as string);
            router.push('/admin/shops');
        }
    };

    if (error && !isLoading) {
        return (
            <div className="shop-management-layout">
                <Placeholder
                    title={"Что-то пошло не так"}
                    text={"Я уже пытаюсь это починить"}
                    buttonText={"Обновить страницу"}
                    img={"/images/robot-error.png"}
                    onButtonClick={() => window.location.reload()}
                />
            </div>
        );
    }

    const navItems = [
        { name: 'Товары', path: `/admin/shop/${id}/products` },
        { name: 'Категории', path: `/admin/shop/${id}/categories` },
    ];

    return (
        <div className="shop-management-layout">
            <div className="shop-management-header">
                {isLoading || !shop ? (
                    <AdminShopCardSkeleton />
                ) : (
                    <AdminShopCard shop={shop} index={0} showManageButton={false} />
                )}
            </div>

            <div className="shop-management-nav-container">
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

                {!isLoading && shop && (
                    <div className="shop-management-nav__actions">
                        <Link
                            href={`/admin/create-shop?editId=${shop.id}`}
                            className="shop-nav-action-btn"
                            title="Настройки магазина"
                        >
                            <Settings size={20} />
                        </Link>
                        <button
                            className="shop-nav-action-btn delete"
                            onClick={() => setIsDeleteModalOpen(true)}
                            title="Удалить магазин"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="shop-management-content">
                {!shop && isLoading ? (
                    <div className="shop-management-content__loading">
                        <div className="admin-loader"></div>
                        <span>Загрузка данных...</span>
                    </div>
                ) : !shop && !isLoading ? (
                    <div className="shop-management-content__loading">
                         <span>Магазин не найден</span>
                    </div>
                ) : (
                    children
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteShop}
                title="Удаление магазина"
                message={`Вы уверены, что хотите безвозвратно удалить магазин "${shop?.name}"? Это действие приведет к удалению всех товаров и категорий.`}
                confirmText="Удалить"
                cancelText="Отмена"
                isDanger={true}
            />
        </div>
    );
}
