'use client';

import React, { useState } from 'react';
import { useCartStore } from "@/data/store/useCartStore";
import { sileo } from "sileo";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import "./add-to-cart-button.css";

interface AddToCartButtonProps {
    productId: string;
    stockQuantity: number;
    className?: string;
    showText?: boolean;
}

export const AddToCartButton = ({ productId, stockQuantity, className = "", showText = true }: AddToCartButtonProps) => {
    const addOrUpdateItem = useCartStore((state) => state.addOrUpdateItem);
    const items = useCartStore((state) => state.items);
    const router = useRouter();

    const cartItem = items.find(i => i.productId === productId);
    const quantityInCart = cartItem?.quantity || 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (stockQuantity === 0) return;

        try {
            await addOrUpdateItem(productId, 1);
        } catch (error) {
            sileo.error({
                title: "Ошибка!",
                description: "Не удалось добавить товар в корзину",
                duration: 2000
            });
        }
    };

    const handleIncrease = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart >= stockQuantity) return;
        try {
            await addOrUpdateItem(productId, 1);
        } catch (error) {
            sileo.error({
                title: "Ошибка!",
                description: "Не удалось увеличить количество",
                duration: 2000
            });
        }
    };

    const handleDecrease = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addOrUpdateItem(productId, -1);
        } catch (error) {
            sileo.error({
                title: "Ошибка!",
                description: "Не удалось уменьшить количество",
                duration: 2000
            });
        }
    };

    return (
        <div className={`cart-action-wrapper ${className}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <button
                className={`add-to-cart-btn ${quantityInCart > 0 ? 'in-cart' : ''}`}
                onClick={quantityInCart > 0 ? () => router.push("/cart") : handleAddToCart}
                disabled={stockQuantity === 0}
            >
                {stockQuantity === 0
                    ? 'Нет в наличии'
                    : quantityInCart > 0
                        ? (showText ? 'В корзине' : '')
                        : (showText ? 'Купить' : '')}
            </button>

            <div className={`quantity-badge ${quantityInCart > 0 ? 'visible' : ''}`}>
                <button className="quantity-btn" onClick={handleDecrease}>
                    <Minus size={18} strokeWidth={3} />
                </button>
                <span className="quantity-value">{quantityInCart}</span>
                <button className="quantity-btn" onClick={handleIncrease} disabled={quantityInCart >= stockQuantity}>
                    <Plus size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};
