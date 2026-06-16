'use client';

import React from 'react';
import { Store, Box, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './admin-shop-card.css';

interface AdminShopCardProps {
    shop: {
        id: string;
        name: string;
        urlAlias: string;

    };
    index: number;
    showManageButton?: boolean;
}

const cardGradients = [
    'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
];

export const AdminShopCard = ({ shop, index, showManageButton = true }: AdminShopCardProps) => {
    const router = useRouter();

    const handleCardClick = () => {
        if (showManageButton) {
            router.push(`/admin/shop/${shop.id}/products`);
        }
    };

    return (
        <div
            className="admin-shop-card"
            style={{ background: cardGradients[index % cardGradients.length], cursor: showManageButton ? 'pointer' : 'default' }}
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
