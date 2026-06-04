'use client';

import React, { useEffect } from 'react';
import './cart.css';
import { Header } from '@/components/header/header';
import {CartItem} from "@/components/cart-item/cart-item";
import {OrderSummary} from "@/components/order-summary/order-summary";
import {Breadcrumb} from "@/components/breadcrumb/breadcrumb";
import { useCartStore } from '@/data/store/useCartStore';
import {CartSkeleton} from "@/components/cart-item/cart-skeleton";
import {Placeholder} from "@/components/placeholder/placeholder";

export default function CartPage() {
    const { items, isLoading, error, fetchCart, updateItemQuantity, removeItem } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleIncrement = (productId: string) => {
        updateItemQuantity(productId, 1);
    };

    const handleDecrement = (productId: string, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateItemQuantity(productId, -1);
        }
    };

    const handleRemove = (productId: string) => {
        removeItem(productId);
    };

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
                <Placeholder
                    title={"Корзина пуста"}
                    text={"Добавьте первый товар, чтобы я не грустил"}
                    buttonText={"Продолжить покупки"}
                    img={"/images/placeholder.png"}
                    nav={"/main"}
                />
            ) : (
                <div className="cart-page__layout">
                    <div className="cart-page__list">
                        {items.map((item) => (
                            <CartItem 
                                item={item} 
                                key={item.productId}
                                onIncrement={() => handleIncrement(item.productId)}
                                onDecrement={() => handleDecrement(item.productId, item.quantity)}
                                onRemove={() => handleRemove(item.productId)}
                            />
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
