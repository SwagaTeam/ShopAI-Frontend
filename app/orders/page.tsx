'use client';

import React, { useEffect, useState } from 'react';
import {ChevronRight, Info, RefreshCw, X} from 'lucide-react';
import './orders.css';
import { Header } from "@/components/header/header";
import { useOrdersStore } from '@/data/store/useOrdersStore';
import Link from "next/link";
import {Placeholder} from "@/components/placeholder/placeholder";

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    }).format(new Date(value));

interface OrderItem {
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    totalPrice: number;
}

interface Order {
    id: string;
    status: string;
    statusLabel: string;
    shopName: string;
    deliveryAddress: string;
    createdAt: string;
    paymentStatus: string;
    items: OrderItem[];
}

export default function OrdersSection() {
    const { orders, isLoading, error, fetchOrders } = useOrdersStore();
    const [activeTab, setActiveTab] = useState<'actual' | 'completed'>('actual');
    const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[] | null>(null);

    useEffect(() => {
        void fetchOrders(true);
        const timer = window.setInterval(() => void fetchOrders(false), 30000);
        return () => window.clearInterval(timer);
    }, [fetchOrders]);

    // Фильтрация для вида вкладок (опционально, если бэк отдает все вместе)
    const filteredOrders = orders.filter(order =>
        activeTab === 'actual'
            ? !['COMPLETED', 'CANCELLED'].includes(order.status.toUpperCase())
            : ['COMPLETED', 'CANCELLED'].includes(order.status.toUpperCase())
    );

    const getStatusColorClass = (status: string) => {
        const s = status.toUpperCase();
        if (s === 'COMPLETED' || s === 'DELIVERED') return 'ozon-status--gray';
        if (s === 'CANCELLED') return 'ozon-status--red';
        return 'ozon-status--green';
    };

    const handleRateOrder = (items: OrderItem[]) => {
        if (items.length === 1) {
            // Если товар один - сразу переходим
            window.location.href = `/product/${items[0].productId}/reviews`;
        } else {
            setSelectedOrderItems(items);
        }
    };

    const closePopup = () => {
        setSelectedOrderItems(null);
    };

    return (
        <div className="ozon-page-bg">
            <Header isCompact={false} />
            <section className="ozon-orders-container">

                {/* Заголовок и вкладки */}
                <div className="ozon-header-block">
                    <div className="ozon-header-title">
                        <h2>Заказы</h2>
                    </div>

                    <div className="ozon-tabs">
                        <button
                            className={`ozon-tab ${activeTab === 'actual' ? 'ozon-tab--active' : ''}`}
                            onClick={() => setActiveTab('actual')}
                        >
                            Актуальные
                        </button>
                        <button
                            className={`ozon-tab ${activeTab === 'completed' ? 'ozon-tab--active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Завершённые
                        </button>
                    </div>
                </div>

                {isLoading && orders.length === 0 ? (
                    <div className="ozon-empty-state">
                        <RefreshCw className="ozon-spin" size={24} />
                        <p>Загрузка заказов...</p>
                    </div>
                ) : error ? (
                        <Placeholder
                            title={"Что-то пошло не так"}
                            text={"Я уже пытаюсь это починить"}
                            buttonText={"Обновить страницу"}
                            img={"/images/robot-error.png"}
                            onButtonClick={() => window.location.reload()}
                        />
                ) : filteredOrders.length === 0 ? (
                    <Placeholder
                        title={"Активных заказов пока нет"}
                        text={"Выберите что-нибудь классное — я уже жду ваш заказ!"}
                        buttonText={"Перейти в коризну"}
                        img={"/images/robot-info.png"}
                        nav={"/cart"}
                    />
                ) : (
                    <div className="ozon-orders-list">
                        {filteredOrders.map((order) => (
                            <article className="ozon-card" key={order.id}>
                                <div className="ozon-card__left">
                                    <h3 className={`ozon-card__status ${getStatusColorClass(order.status)}`}>
                                        {order.statusLabel}
                                    </h3>
                                    <p className="ozon-card__address">
                                        <strong>{order.items[0].productName}</strong>
                                    </p>
                                    <p className="ozon-card__date">
                                        Продавец: {order.shopName}
                                    </p>
                                    <p className="ozon-card__date">
                                        Заказ от {formatDate(order.createdAt)}, {order.deliveryAddress} • №{order.id }
                                    </p>

                                    {order.status.toUpperCase() === 'COMPLETED' && (
                                        <div className="ozon-card__actions">
                                            <button
                                                onClick={() => handleRateOrder(order.items)}
                                                className="ozon-btn ozon-btn--primary"
                                            >
                                                Оценить заказ
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="ozon-card__right">
                                    {order.items.map((item) => (
                                        <div className="ozon-product" key={item.productId}>
                                            <div className="ozon-product__image-wrap">
                                                {item.imageUrl && <img src={item.imageUrl} alt={item.productName} />}
                                                {order.paymentStatus === 'PAID' && (
                                                    <span className="ozon-product__badge">ОПЛАЧЕН</span>
                                                )}
                                            </div>
                                            <div className="ozon-product__price">{item.totalPrice} ₽</div>
                                            {item.quantity > 1 && (
                                                <div className="ozon-product__qty">{item.quantity} шт.</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Попап выбора товара для отзыва */}
            {selectedOrderItems && (
                <div className="ozon-popup-overlay" onClick={closePopup}>
                    <div className="ozon-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="ozon-popup__header">
                            <h3 className="ozon-popup__title">Выберите товар для отзыва</h3>
                            <button className="ozon-popup__close" onClick={closePopup}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="ozon-popup__items">
                            {selectedOrderItems.map((item) => (
                                <Link
                                    href={`/product/${item.productId}/reviews`}
                                    className="ozon-popup-item"
                                    key={item.productId}
                                    onClick={closePopup}
                                >
                                    <div className="ozon-popup-item__image-wrap">
                                        {item.imageUrl && (
                                            <img src={item.imageUrl} alt={item.productName} />
                                        )}
                                    </div>
                                    <div className="ozon-popup-item__info">
                                        <div className="ozon-popup-item__name">{item.productName}</div>
                                        <div className="ozon-popup-item__details">
                                            {item.quantity} шт. • {item.totalPrice} ₽
                                        </div>
                                    </div>
                                    <ChevronRight size={20} color={"#7e7e7e"} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}