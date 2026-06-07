'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItemInterface } from "@/data/interfaces/ItemInterface";
import { useCartStore } from "@/data/store/useCartStore";
import { LikeButton } from "../like-button/like-button";
import "./product-card.css";
import { sileo } from "sileo";
import {CircleOff, Plus, Minus} from "lucide-react";
import { useRouter } from "next/navigation";
import {renderStars} from "@/utils/utilsJSX";

import { AddToCartButton } from "../add-to-cart-button/add-to-cart-button";

export const ProductCard = ({ item }: { item: ItemInterface }) => {
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
                    <LikeButton itemId={item.id} initialIsFavorite={item.isInWishlist}/>
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

                <div className="product-card__actions">
                    <AddToCartButton productId={item.id} stockQuantity={item.stockQuantity} />
                </div>
            </div>
        </Link>
    );
};
