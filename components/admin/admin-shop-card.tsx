'use client';

import React from 'react';
import { Store, Box, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './admin-shop-card.css';
import {parseLogoPath} from "@/utils/utils";



interface AdminShopCardProps {
    shop: {
        id: string;
        name: string;
        urlAlias: string;
        logoPath?: string;
    };
    index: number;
    showManageButton?: boolean;
}


export const AdminShopCardSkeleton = () => {
    return (
        <div className="admin-shop-card is-skeleton">
            <div className="admin-shop-card__left">
                <div className="admin-shop-card__icon-wrapper skeleton-pulse" />
                <div className="admin-shop-card__info">
                    <div className="skeleton-line skeleton-pulse" style={{ width: '200px', height: '28px', marginBottom: '8px' }} />
                    <div className="admin-shop-card__meta">
                        <div className="skeleton-line skeleton-pulse" style={{ width: '120px', height: '16px' }} />
                        <span className="admin-shop-card__divider"></span>
                        <div className="skeleton-line skeleton-pulse" style={{ width: '100px', height: '16px' }} />
                        <div className="skeleton-line skeleton-pulse" style={{ width: '100px', height: '16px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminShopCard = ({ shop, index, showManageButton = true }: AdminShopCardProps) => {
    const router = useRouter();

    const handleCardClick = () => {
        if (showManageButton) {
            router.push(`/admin/shop/${shop.id}/products`);
        }
    };

    const background = parseLogoPath(shop.logoPath);

    return (
        <div
            className="admin-shop-card"
            style={{ background: background, cursor: showManageButton ? 'pointer' : 'default' }}
            onClick={handleCardClick}
        >
            <div className="admin-shop-card__left">
                <div className="admin-shop-card__icon-wrapper">
                    <Store size={28} />
                </div>
                <div className="admin-shop-card__info">
                    <h3 className="admin-shop-card__name">{shop.name}</h3>
                    <div className="admin-shop-card__meta">
                        <span className="admin-shop-card__url">
                            shopai.ru/{shop.urlAlias}
                        </span>
                        <span className="admin-shop-card__divider"></span>

                        <div className="admin-shop-card__stat">
                            <Box size={16} />
                            <span>156 товаров</span>
                        </div>
                        <div className="admin-shop-card__stat">
                            <ShoppingBag size={16} />
                            <span>89 заказов</span>
                        </div>
                    </div>
                </div>
            </div>

            {showManageButton && (
                <button className="admin-shop-card__manage-btn">
                    Управление
                </button>
            )}
        </div>
    );
};
