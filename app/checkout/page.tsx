"use client";

import React, { useEffect, useState } from "react";
import "./checkout.css";
import { Header } from "@/components/header/header";
import { OrderSummary } from "@/components/order-summary/order-summary";
import { CreditCard } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { useCartStore } from "@/data/store/useCartStore";
import { apiClient } from "@/data/api/apiClient";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";

interface CheckoutResponse {
    paymentId: string;
    orderIds: string[];
    confirmationUrl: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, fetchCart, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handlePay = async () => {
        if (items.length === 0) {
            sileo.error({ title: "Корзина пуста", description: "Добавьте товары перед оплатой", duration: 2000 });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.post<CheckoutResponse>("/Payments/checkout", {
                returnUrl: `${window.location.origin}/checkout`
            });

            const { paymentId, orderIds, confirmationUrl } = response.data;

            if (confirmationUrl?.startsWith("/api/Payments/")) {
                await apiClient.post(`/Payments/${paymentId}/confirm`, { orderIds });
                clearCart();
                sileo.success({ title: "Заказ оплачен", description: "Покупка успешно оформлена", duration: 2500 });
                router.push("/main");
                return;
            }

            if (confirmationUrl) {
                clearCart();
                window.location.href = confirmationUrl;
                return;
            }

            throw new Error("Payment confirmation URL is empty");
        } catch (error) {
            console.error("Ошибка при оформлении заказа:", error);
            sileo.error({ title: "Ошибка оплаты", description: "Не удалось создать платеж", duration: 2500 });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header isCompact={true} />
            <div className="checkout-page-container">
                <div className="checkout-page">
                    <Breadcrumb isCart={false} />

                    <h1 className="checkout-page__title">Оформление заказа</h1>

                    <div className="checkout-page__layout">
                        <div className="checkout-page__forms">
                            <section className="form-card">
                                <h2 className="form-card__title">Состав заказа</h2>
                                <div className="checkout-summary__items">
                                    {items.length === 0 ? (
                                        <p className="checkout-summary__disclaimer">Корзина пуста</p>
                                    ) : (
                                        items.map(item => (
                                            <div className="checkout-item" key={item.productId}>
                                                <div className="checkout-item__image-wrap">
                                                    {item.imageUrl && (
                                                        <img className="checkout-item__image" src={item.imageUrl} alt={item.productName} />
                                                    )}
                                                </div>
                                                <div className="checkout-item__info">
                                                    <div className="checkout-item__name">{item.productName}</div>
                                                    <div className="checkout-item__qty">{item.quantity} шт.</div>
                                                </div>
                                                <div className="checkout-item__price">{item.price * item.quantity} ₽</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            <section className="form-card">
                                <h2 className="form-card__title">Способ оплаты</h2>
                                <div className="payment-list">
                                    <label className="payment-method">
                                        <input type="radio" name="payment" className="payment-method__radio" defaultChecked />
                                        <span className="payment-method__icon">
                                            <CreditCard size={20} />
                                        </span>
                                        <span className="payment-method__label">YooKassa, банковская карта / СБП</span>
                                    </label>
                                </div>
                            </section>
                        </div>

                        <OrderSummary isCart={false} onPay={handlePay} isSubmitting={isSubmitting} />
                    </div>
                </div>
            </div>
        </>
    );
}
