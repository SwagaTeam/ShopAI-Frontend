'use client';

import React, { useState } from 'react';
import { ItemInterface } from "@/data/interfaces/ItemInterface";
import { useCartStore } from "@/data/store/useCartStore"; // Укажите ваш правильный путь к стору корзины
import { LikeButton } from "../like-button/like-button";
import "./product-card.css";
import {sileo} from "sileo";

export const ProductCard = ({ item }: { item: ItemInterface }) => {
    const addOrUpdateItem = useCartStore((state) => state.addOrUpdateItem);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (isAdding) return;

        setIsAdding(true);
        try {
            await addOrUpdateItem(item.productId, 1);
        } catch (error) {
            sileo.error({ title: "Ошибка!", description: "Не удалось добавить товар в корзину", duration: 2000  });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="product-card">
            <div className="product-card__image-wrapper">
                <img src={item.imageUrl} alt={item.productName} className="product-card__image" />
                <LikeButton itemId={item.productId} />
            </div>
            <h3 className="product-card__title">{item.productName}</h3>
            <div className="product-card__price">{item.price.toLocaleString('ru-RU')} ₽</div>
            <button
                className={`product-card__btn ${isAdding ? 'is-loading' : ''}`}
                onClick={handleAddToCart}
                disabled={isAdding}
            >
                {isAdding ? 'Добавление...' : 'Добавить в корзину'}
            </button>
        </div>
    );
};
