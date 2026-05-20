import React from 'react';
import './cart.css';
import { Header } from '@/components/header/header';
import Link from "next/link";
import {CartItem} from "@/components/cart-item/cart-item";
import {ChevronRight} from "lucide-react";
import {OrderSummary} from "@/components/order-summary/order-summary";
import {Breadcrumb} from "@/components/breadcrumb/breadcrumb";
import {ICartItem} from "@/data/interfaces/ICartItem";

const cartMockData: ICartItem[] = [
    { productId: "1", productName: 'Кроссовки спортивные Nike Air Max', price: 5490, quantity: 1, imageUrl: "https://i1-e.pinimg.com/1200x/d3/8c/42/d38c42339d5aad971fcd5d1796caa117.jpg" },
    { productId: "2", productName: 'Кроссовки спортивные Nike Air Max 2', price: 5990, quantity: 2, imageUrl: "https://i1-e.pinimg.com/1200x/d3/8c/42/d38c42339d5aad971fcd5d1796caa117.jpg" },
    { productId: "3", productName: 'Кроссовки спортивные Nike Air Max 3', price: 6490, quantity: 1, imageUrl: "" },
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
                        <CartItem item={item} key={item.productId} />
                    ))}
                </div>
                <OrderSummary isCart={true} />
            </div>
        </div>
            </div>
        </>
    );
}
