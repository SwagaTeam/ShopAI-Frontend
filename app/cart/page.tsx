import React from 'react';
import './cart.css';
import { Header } from '@/components/header/header';
import Link from "next/link";

const cartMockData = [
    { id: 1, name: 'Кроссовки спортивные Nike Air Max', price: '5490 ₽', count: 1, checked: false },
    { id: 2, name: 'Кроссовки спортивные Nike Air Max 2', price: '5990 ₽', count: 2, checked: true },
    { id: 3, name: 'Кроссовки спортивные Nike Air Max 3', price: '6490 ₽', count: 1, checked: false },
];

export default function CartPage() {
    return (
        <>
        <Header isCompact={false} />
        <div className="cart-page">
            {/* Breadcrumbs */}
            <ul className="breadcrumbs">
                <li className="breadcrumbs__item"><a href="#" className="breadcrumbs__link">Главная</a></li>
                <li className="breadcrumbs__separator">&gt;</li>
                <li className="breadcrumbs__item">Корзина</li>
            </ul>

            <h1 className="cart-page__title">Корзина (2)</h1>

            <div className="cart-page__layout">
                {/* Cart Items List */}
                <div className="cart-page__list">
                    {cartMockData.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item__checkbox-wrap">
                                <input type="checkbox" className="cart-item__checkbox" defaultChecked={item.checked} />
                            </div>
                            <div className="cart-item__image-wrap">
                                {/* Placeholder shoe image */}
                                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'><path d='M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z'/></svg>" alt="shoe" className="cart-item__image" />
                            </div>
                            <div className="cart-item__info">
                                <h3 className="cart-item__name">{item.name}</h3>
                                <p className="cart-item__price">{item.price}</p>
                            </div>
                            <div className="cart-item__controls">
                                <div className="cart-item__counter">
                                    <button className="cart-item__counter-btn">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    </button>
                                    <span className="cart-item__counter-value">{item.count}</span>
                                    <button className="cart-item__counter-btn">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    </button>
                                </div>
                                <div className="cart-item__actions">
                                    <button className="cart-item__action-btn">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                    </button>
                                    <button className="cart-item__action-btn">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Sidebar */}
                <aside className="summary-box">
                    <h2 className="summary-box__title">Итого</h2>
                    <div className="summary-box__list">
                        <div className="summary-box__row">
                            <span className="summary-box__label">Товары (3)</span>
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
                    <Link href={"/checkout"} className="summary-box__submit-btn">Перейти к оплате</Link>
                    <Link href={"/main"} className="summary-box__continue-link">Продолжить покупки</Link>
                </aside>
            </div>
        </div>
        </>
    );
}
