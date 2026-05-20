import React from 'react';
import './checkout.css';
import {Header} from "@/components/header/header";

const orderItems = [
    { id: 1, name: 'Кроссовки спортивные', qty: '1 шт.', price: '5490 ₽' },
    { id: 2, name: 'Кроссовки спортивные', qty: '2 шт.', price: '11980 ₽' },
];

export default function CheckoutPage() {
    return (
        <>
            <Header isCompact={false} />
        <div className="checkout-page">
            {/* Breadcrumbs */}
            <ul className="breadcrumbs">
                <li className="breadcrumbs__item"><a href="#" className="breadcrumbs__link">Корзина</a></li>
                <li className="breadcrumbs__separator">&gt;</li>
                <li className="breadcrumbs__item">Оформление заказа</li>
            </ul>

            <h1 className="checkout-page__title">Оформление заказа</h1>

            <div className="checkout-page__layout">

                {/* Left Column: Forms */}
                <div className="checkout-page__forms">

                    {/* Delivery Info Form */}
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

                    {/* Payment Method Form */}
                    <section className="form-card">
                        <h2 className="form-card__title">Способ оплаты</h2>
                        <div className="payment-list">
                            <label className="payment-method">
                                <input type="radio" name="payment" className="payment-method__radio" defaultChecked />
                                <span className="payment-method__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" rx="2" ry="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </span>
                                <span className="payment-method__label">Банковская карта</span>
                            </label>
                            <label className="payment-method">
                                <input type="radio" name="payment" className="payment-method__radio" />
                                <span className="payment-method__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                </span>
                                <span className="payment-method__label">Наличные при получении</span>
                            </label>
                            <label className="payment-method">
                                <input type="radio" name="payment" className="payment-method__radio" />
                                <span className="payment-method__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </span>
                                <span className="payment-method__label">СБП (Система быстрых платежей)</span>
                            </label>
                        </div>
                    </section>

                </div>

                {/* Right Column: Order Summary */}
                <aside className="checkout-summary">
                    <h2 className="checkout-summary__title">Ваш заказ</h2>

                    <div className="checkout-summary__items">
                        {orderItems.map(item => (
                            <div key={item.id} className="checkout-item">
                                <div className="checkout-item__image-wrap">
                                    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'><path d='M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z'/></svg>" alt="shoe" className="checkout-item__image" />
                                </div>
                                <div className="checkout-item__info">
                                    <p className="checkout-item__name">{item.name}</p>
                                    <span className="checkout-item__qty">{item.qty}</span>
                                </div>
                                <span className="checkout-item__price">{item.price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-box__list">
                        <div className="summary-box__row">
                            <span className="summary-box__label">Товары</span>
                            <span className="summary-box__value">17470 ₽</span>
                        </div>
                        <div className="summary-box__row">
                            <span className="summary-box__label">Доставка</span>
                            <span className="summary-box__value summary-box__value--free">Бесплатно</span>
                        </div>
                    </div>
                    <div className="summary-box__divider"></div>
                    <div className="summary-box__total-row">
                        <span className="summary-box__total-label">Итого</span>
                        <span className="summary-box__total-value">17470 ₽</span>
                    </div>

                    <button className="summary-box__submit-btn">Оплатить заказ</button>

                    <p className="checkout-summary__disclaimer">
                        Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                    </p>
                </aside>

            </div>
        </div>
        </>
    );
}
