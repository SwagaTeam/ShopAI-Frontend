'use client';

import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, RefreshCw } from 'lucide-react';
import { apiClient } from '@/data/api/apiClient';
import './orders.css';

type OrderItem = {
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    price: number;
    totalPrice: number;
};

type Order = {
    id: string;
    shopName: string;
    createdAt: string;
    status: string;
    statusLabel: string;
    paymentStatus: string;
    deliveryAddress: string;
    contactPhone: string;
    comment?: string | null;
    totalPrice: number;
    items: OrderItem[];
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));

export const OrdersSection = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async (showLoader = false) => {
        if (showLoader) setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Order[]>('/Orders/my');
            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка при получении заказов:', error);
            setError('Не удалось загрузить заказы');
        } finally {
            if (showLoader) setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchOrders(true);
        const timer = window.setInterval(() => void fetchOrders(false), 30000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <section className="orders-section">
            <div className="orders-section__header">
                <div>
                    <h2>Заказы</h2>
                    <p>История покупок и текущий статус доставки</p>
                </div>
                <button type="button" onClick={() => fetchOrders(true)} disabled={isLoading}>
                    <RefreshCw size={18} />
                    Обновить
                </button>
            </div>

            {isLoading ? (
                <div className="orders-empty">Загрузка заказов...</div>
            ) : error ? (
                <div className="orders-empty orders-empty--error">{error}</div>
            ) : orders.length === 0 ? (
                <div className="orders-empty">Заказов пока нет</div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <article className="order-card" key={order.id}>
                            <div className="order-card__top">
                                <div>
                                    <h3>Заказ #{order.id.slice(0, 8)}</h3>
                                    <p>{order.shopName} · {formatDate(order.createdAt)}</p>
                                </div>
                                <span className={`order-status order-status--${order.status.toLowerCase()}`}>
                                    {order.statusLabel}
                                </span>
                            </div>

                            <div className="order-card__meta">
                                <div>
                                    <MapPin size={16} />
                                    <span>{order.deliveryAddress}</span>
                                </div>
                                <div>
                                    <Phone size={16} />
                                    <span>{order.contactPhone}</span>
                                </div>
                                <div>
                                    <Clock size={16} />
                                    <span>Оплата: {order.paymentStatus || 'создана'}</span>
                                </div>
                            </div>

                            {order.comment && <p className="order-card__comment">Комментарий: {order.comment}</p>}

                            <div className="order-card__items">
                                {order.items.map((item) => (
                                    <div className="order-item" key={item.productId}>
                                        <div className="order-item__image">
                                            {item.imageUrl && <img src={item.imageUrl} alt={item.productName} />}
                                        </div>
                                        <div className="order-item__name">{item.productName}</div>
                                        <div className="order-item__qty">{item.quantity} шт.</div>
                                        <div className="order-item__price">{item.totalPrice} ₽</div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card__total">
                                <span>Итого</span>
                                <strong>{order.totalPrice} ₽</strong>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};
