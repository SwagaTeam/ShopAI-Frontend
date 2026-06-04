'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItemInterface } from "@/data/interfaces/ItemInterface";
import { useCartStore } from "@/data/store/useCartStore";
import { LikeButton } from "../like-button/like-button";
import "./product-card.css";
import { sileo } from "sileo";
import {CircleOff} from "lucide-react";

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
                <div className="product-card__image-wrapper">
                    {item.imageUrl ? (<img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="product-card__image"
                    />) : (<div className="product-card__image"> <CircleOff size={120} color={"#d1d1d1"}/></div> )}

                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <LikeButton itemId={item.productId} />
                    </div>
                </div>
            <div className="product-card">
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