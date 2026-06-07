"use client";

import Link from "next/link";
import { useState } from "react";
import "./order-summary.css";
import { useCartStore } from "@/data/store/useCartStore";
import {Ellipsis, X} from "lucide-react";

interface OrderSummaryProps {
    isCart: boolean;
    onPay?: () => void;
    isSubmitting?: boolean;
}

export const OrderSummary = ({ isCart, onPay, isSubmitting }: OrderSummaryProps) => {
    const { items, totalPrice, itemsCount } = useCartStore();
    const [showAllItems, setShowAllItems] = useState(false);

    const visibleItems = items.slice(0, 3);
    const hasMoreItems = items.length > 3;

    const toggleShowAll = () => {
        setShowAllItems(!showAllItems);
    };

    return (
        <>
            <aside className={`summary-box ${isCart ? "summary-box--cart" : ""}`}>
                <h2 className="summary-box__title">{isCart ? "Итого" : "Ваш заказ"}</h2>

                {!isCart && items.length > 0 && (
                    <div className="summary-box__items">
                        {visibleItems.map(item => (
                            <div className="summary-item" key={item.productId}>
                                <div className="summary-item__image-wrap">
                                    {item.imageUrl && (
                                        <img className="summary-item__image" src={item.imageUrl} alt={item.productName} />
                                    )}
                                </div>
                                <div className="summary-item__info">
                                    <div className="summary-item__name">{item.productName}</div>
                                    <div className="summary-item__qty">{item.quantity} шт.</div>
                                </div>
                                <div className="summary-item__price">{item.price * item.quantity} ₽</div>
                            </div>
                        ))}

                        {hasMoreItems && (
                            <button
                                className="summary-box__more-btn"
                                onClick={toggleShowAll}
                            >
                                <Ellipsis size={30} color={"#959595"} />
                            </button>
                        )}

                        <div className="summary-box__divider first-divider"></div>
                    </div>
                )}

                <div className="summary-box__list">
                    <div className="summary-box__row">
                        <span className="summary-box__label">Товары ({itemsCount} шт.)</span>
                        <span className="summary-box__value">{totalPrice} ₽</span>
                    </div>
                    {totalPrice > 200 && (
                        <div className="summary-box__row">
                            <span className="summary-box__label">Доставка</span>
                            <span className="summary-box__value summary-box__value--free">Бесплатно</span>
                        </div>
                    )}
                </div>

                <div className="summary-box__divider"></div>

                <div className="summary-box__total-row">
                    <span className="summary-box__total-label">Итого</span>
                    <span className="summary-box__total-value">{totalPrice} ₽</span>
                </div>

                {isCart ? (
                    <div className="summary-box__buttons">
                        <Link href="/checkout" className="summary-box__submit-btn">Перейти к оплате</Link>
                        <Link href="/main" className="summary-box__continue-link">Продолжить покупки</Link>
                    </div>
                ) : (
                    <div className="summary-box__buttons">
                        <button
                            type="button"
                            className="summary-box__submit-btn"
                            onClick={onPay}
                            disabled={isSubmitting || totalPrice <= 0}
                        >
                            {isSubmitting ? "Создание платежа..." : "Оплатить заказ"}
                        </button>
                        <p className="summary-box__warning">
                            Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                        </p>
                    </div>
                )}
            </aside>

            {/* Попап со всеми товарами */}
            {showAllItems && hasMoreItems && (
                <div className="summary-popup-overlay" onClick={toggleShowAll}>
                    <div className="summary-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="summary-popup__header">
                            <h3 className="summary-popup__title">Все товары</h3>
                            <button className="summary-popup__close" onClick={toggleShowAll}>
                                <X size={20} color={"#959595"} />
                            </button>
                        </div>
                        <div className="summary-popup__items">
                            {items.map(item => (
                                <div className="summary-popup-item" key={item.productId}>
                                    <div className="summary-popup-item__image-wrap">
                                        {item.imageUrl && (
                                            <img className="summary-popup-item__image" src={item.imageUrl} alt={item.productName} />
                                        )}
                                    </div>
                                    <div className="summary-popup-item__info">
                                        <div className="summary-popup-item__name">{item.productName}</div>
                                        <div className="summary-popup-item__qty">{item.quantity} шт.</div>
                                    </div>
                                    <div className="summary-popup-item__price">{item.price * item.quantity} ₽</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};