import React from 'react';
import './cart.css';
import { Header } from '@/components/header/header';
import Link from "next/link";
import {CartItem} from "@/components/cart-item/cart-item";
import {ChevronRight} from "lucide-react";
import {OrderSummary} from "@/components/order-summary/order-summary";
import {Breadcrumb} from "@/components/breadcrumb/breadcrumb";

const cartMockData = [
    { id: 1, name: 'Кроссовки спортивные Nike Air Max', price: '5490 ₽', count: 1, checked: false },
    { id: 2, name: 'Кроссовки спортивные Nike Air Max 2', price: '5990 ₽', count: 2, checked: true },
    { id: 3, name: 'Кроссовки спортивные Nike Air Max 3', price: '6490 ₽', count: 1, checked: false },
];

export default function CartPage() {
    return (
        <>
        <Header isCompact={true} />
            <div className="cart-page-container">


        <div className="cart-page">
            <Breadcrumb isCart={true} />

            <h1 className="cart-page__title">Корзина (2)</h1>

            <div className="cart-page__layout">
                <div className="cart-page__list">
                    {cartMockData.map((item) => (
                        <CartItem item={item} key={item.id} />
                    ))}
                </div>
                <OrderSummary isCart={true} />
            </div>
        </div>
            </div>
        </>
    );
}
