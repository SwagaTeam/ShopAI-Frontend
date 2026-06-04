'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItemInterface } from "@/data/interfaces/ItemInterface";
import { useCartStore } from "@/data/store/useCartStore";
import { LikeButton } from "../like-button/like-button";
import "./product-card.css";
import { sileo } from "sileo";
import {CircleOff, Plus, Minus, Star} from "lucide-react";
import { useRouter } from "next/navigation";
import {renderStars} from "@/utils/utilsJSX";

export const ProductCard = ({ item }: { item: ItemInterface }) => {
    const addOrUpdateItem = useCartStore((state) => state.addOrUpdateItem);
    const items = useCartStore((state) => state.items); // Получаем все товары в корзине
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    const cartItem = items.find(i => i.productId === item.id);
    const quantityInCart = cartItem?.quantity || 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding) return;

        setIsAdding(true);
        try {
            await addOrUpdateItem(item.id, 1);
        } catch (error) {
            sileo.error({
                title: "Ошибка!",
                description: "Не удалось добавить товар в корзину",
                duration: 2000
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleIncrease = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addOrUpdateItem(item.id, 1);
        } catch (error) {
            console.error("Ошибка при увеличении", error);
        }
    };

    const handleDecrease = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addOrUpdateItem(item.id, -1);
        } catch (error) {
            console.error("Ошибка при уменьшении", error);
        }
    };

    return (
        <Link href={`/product/${item.id}`} className="product-card-link">
            <div className="product-card__image-wrapper">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.id}
                        className="product-card__image"
                    />
                ) : (
                    <div className="product-card__image">
                        <CircleOff size={120} color={"#d1d1d1"}/>
                    </div>
                )}

                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <LikeButton itemId={item.id} />
                </div>
            </div>

            <div className="product-card">
                <h3 className="product-card__title">{item.name}</h3>
                <div className={"product-card__bottom"}>
                    <p className="product-card__price">{item.price.toLocaleString('ru-RU')} ₽</p>
                    <div className="product-card__rating-container">
                        <div className="product-card__rating-stars">
                            {renderStars(item.rating, 11)}
                        </div>
                        {item.rating > 0 && <p className="product-card__rating">{item.rating}</p>}
                    </div>

                </div>

                <div className="product-card__actions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <div className="cart-action-wrapper">
                        <button
                            className={`add-to-cart-btn ${quantityInCart > 0 ? 'in-cart' : ''} ${isAdding ? 'is-loading' : ''}`}
                            onClick={quantityInCart > 0 ? () => router.push("/cart") : handleAddToCart}
                            disabled={isAdding && quantityInCart === 0}
                        >
                            {isAdding && quantityInCart === 0 ? 'Добавление...' : quantityInCart > 0 ? 'В корзине' : 'Добавить в корзину'}
                        </button>

                        <div className={`quantity-badge ${quantityInCart > 0 ? 'visible' : ''}`}>
                            <button className="quantity-btn" onClick={handleDecrease}>
                                <Minus size={18} strokeWidth={3} />
                            </button>
                            <span className="quantity-value">{quantityInCart}</span>
                            <button className="quantity-btn" onClick={handleIncrease}>
                                <Plus size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};