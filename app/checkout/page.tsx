import React from 'react';
import './checkout.css';
import { Header } from "@/components/header/header";
import { OrderSummary } from "@/components/order-summary/order-summary";
import { CreditCard, HandCoins, Smartphone } from "lucide-react";
import {Breadcrumb} from "@/components/breadcrumb/breadcrumb";

const orderItems = [
    { id: 1, name: 'Кроссовки спортивные', qty: '1 шт.', price: '5490 ₽' },
    { id: 2, name: 'Кроссовки спортивные', qty: '2 шт.', price: '11980 ₽' },
];

export default function CheckoutPage() {
    return (
        <>
            <Header isCompact={true} />
            <div className="checkout-page-container">
            <div className="checkout-page">
                <Breadcrumb isCart={false}/>

                <h1 className="checkout-page__title">Оформление заказа</h1>

                <div className="checkout-page__layout">
                    <div className="checkout-page__forms">
                        <section className="form-card">
                            <h2 className="form-card__title">Информация о доставке</h2>
                            <div className="form-group">
                                <label className="form-group__label">Имя и фамилия</label>
                                <input type="text" className="form-group__input" placeholder="Иван Иванов" defaultValue="Иван Иванов" />
                            </div>
                            <div className="form-group">
                                <label className="form-group__label">Телефон</label>
                                <input type="tel" className="form-group__input" placeholder="+7 (999) 123-45-67" defaultValue="+7 (999) 123-45-67" />
                            </div>
                            <div className="form-group">
                                <label className="form-group__label">Адрес доставки</label>
                                <input type="text" className="form-group__input" placeholder="Москва, ул. Пушкина, д. 1, кв. 1" defaultValue="Москва, ул. Пушкина, д. 1, кв. 1" />
                            </div>
                            <div className="form-group">
                                <label className="form-group__label">Комментарий к заказу (необязательно)</label>
                                <textarea className="form-group__textarea" placeholder="Например: позвонить за час до доставки"></textarea>
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
                                    <span className="payment-method__label">Банковская карта</span>
                                </label>
                                <label className="payment-method">
                                    <input type="radio" name="payment" className="payment-method__radio" />
                                    <span className="payment-method__icon">
                                        <HandCoins size={20} />
                                    </span>
                                    <span className="payment-method__label">Наличные при получении</span>
                                </label>
                                <label className="payment-method">
                                    <input type="radio" name="payment" className="payment-method__radio" />
                                    <span className="payment-method__icon">
                                        <Smartphone size={20} />
                                    </span>
                                    <span className="payment-method__label">СБП (Система быстрых платежей)</span>
                                </label>
                            </div>
                        </section>
                    </div>

                    <OrderSummary isCart={false} />
                </div>
            </div>
            </div>
        </>
    );
}