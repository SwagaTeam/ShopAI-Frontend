'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItemInterface } from "@/data/interfaces/ItemInterface";
import { useCartStore } from "@/data/store/useCartStore";
import { LikeButton } from "../like-button/like-button";
import "./product-card.css";
import { sileo } from "sileo";

export const ProductCard = ({ item }: { item: ItemInterface }) => {
    const addOrUpdateItem = useCartStore((state) => state.addOrUpdateItem);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding) return;

        setIsAdding(true);
        try {
            await addOrUpdateItem(item.productId, 1);
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

    return (
        <Link href={`/product/${item.productId}`} className="product-card-link">
            <div className="product-card">
                <div className="product-card__image-wrapper">
                    <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="product-card__image"
                    />
                    {/* Оборачиваем лайк, чтобы клик по нему не вызывал переход */}
                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <LikeButton itemId={item.productId} />
                    </div>
                </div>
                <h3 className="product-card__title">{item.productName}</h3>
                <div className="product-card__price">
                    {item.price.toLocaleString('ru-RU')} ₽
                </div>
                <button
                    className={`product-card__btn ${isAdding ? 'is-loading' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                >
                    {isAdding ? 'Добавление...' : 'Добавить в корзину'}
                </button>
            </div>
        </Link>
    );
};