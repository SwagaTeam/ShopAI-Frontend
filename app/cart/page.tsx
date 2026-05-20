'use client';

import React, { useEffect } from 'react';
import './cart.css';
import { Header } from '@/components/header/header';
import Link from "next/link";
import {CartItem} from "@/components/cart-item/cart-item";
import {ChevronRight, HeartCrack} from "lucide-react";
import {OrderSummary} from "@/components/order-summary/order-summary";
import {Breadcrumb} from "@/components/breadcrumb/breadcrumb";
import {ICartItem} from "@/data/interfaces/ICartItem";
import { useCartStore } from '@/data/store/useCartStore';
import {CartSkeleton} from "@/components/cart-item/cart-skeleton";

export default function CartPage() {
    const { items, totalPrice, isLoading, error, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return (
        <>
        <Header isCompact={true} />
            <div className="cart-page-container">

        <div className="cart-page">
            <Breadcrumb isCart={true} />
            <h1 className="cart-page__title">{items.length > 0 ? `Корзина (${items.length})` : ``}</h1>
            {isLoading ? (
                <div className="cart-page__layout">
                    <div className="cart-page__list">
                    <CartSkeleton count={3} />
                    </div>
                    <OrderSummary isCart={true} />
                </div>

            ) : error ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                    {error}
                </div>
            ) : items.length === 0 ? (
                <div className="cart-page__empty">
                    <img className="cart-page__empty-image" src={"/images/placeholder.png"} alt={"Пустая корзина"}/>
                    <h2 className="cart-page__empty-title">Корзина пуста</h2>
                    <p className="cart-page__empty-text">Добавьте первый товар, чтобы я не грустил</p>
                    <Link href="/main" className="cart-page__continue-link">
                        Продолжить покупки
                    </Link>
                </div>
            ) : (
                <div className="cart-page__layout">
                    <div className="cart-page__list">
                        {items.map((item) => (
                            <CartItem item={item} key={item.productId} />
                        ))}
                    </div>
                    <OrderSummary isCart={true} />
                </div>
            )}
        </div>
            </div>
        </>
    );
}
