"use client";

import React, { useEffect, useState } from "react";
import "./checkout.css";
import { Header } from "@/components/header/header";
import { OrderSummary } from "@/components/order-summary/order-summary";
import { CreditCard, MapPin, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { useCartStore } from "@/data/store/useCartStore";
import { useAuthStore } from "@/data/store/useAuthStore";
import { apiClient } from "@/data/api/apiClient";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";

interface CheckoutResponse {
    paymentId: string;
    orderIds: string[];
    confirmationUrl: string;
}

interface DeliveryAddress {
    id: string;
    title: string;
    addressLine: string;
    entrance?: string | null;
    floor?: string | null;
    apartment?: string | null;
    comment?: string | null;
}

const emptyAddressForm = {
    title: "",
    addressLine: "",
    entrance: "",
    floor: "",
    apartment: "",
    comment: "",
};

export default function CheckoutPage() {
    const router = useRouter();
    const { phone } = useAuthStore();
    const { items, fetchCart, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddressSaving, setIsAddressSaving] = useState(false);
    const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
    const [deliveryMode, setDeliveryMode] = useState<"saved" | "new">("new");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [addressForm, setAddressForm] = useState(emptyAddressForm);
    const [contactPhone, setContactPhone] = useState(phone || "");
    const [orderComment, setOrderComment] = useState("");

    useEffect(() => {
        fetchCart();
        void fetchAddresses();
    }, [fetchCart]);

    useEffect(() => {
        if (!contactPhone && phone) {
            setContactPhone(phone);
        }
    }, [contactPhone, phone]);

    const fetchAddresses = async () => {
        try {
            const response = await apiClient.get<DeliveryAddress[]>("/DeliveryAddresses");
            setAddresses(response.data);
            if (response.data.length > 0) {
                setDeliveryMode("saved");
                setSelectedAddressId(response.data[0].id);
            }
        } catch (error) {
            console.error("Ошибка при получении адресов доставки:", error);
        }
    };

    const handleAddressChange = (field: keyof typeof addressForm, value: string) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
    };

    const saveAddress = async () => {
        if (addressForm.title.trim().length === 0 || addressForm.addressLine.trim().length < 10) {
            sileo.error({ title: "Адрес не сохранен", description: "Укажите название и полный адрес", duration: 2500 });
            return null;
        }

        setIsAddressSaving(true);
        try {
            const response = await apiClient.post<DeliveryAddress>("/DeliveryAddresses", addressForm);
            const created = response.data;
            setAddresses(prev => [created, ...prev]);
            setSelectedAddressId(created.id);
            setDeliveryMode("saved");
            setAddressForm(emptyAddressForm);
            sileo.success({ title: "Адрес сохранен", description: "Теперь его можно выбирать при заказе", duration: 2200 });
            return created;
        } catch (error) {
            console.error("Ошибка при сохранении адреса:", error);
            sileo.error({ title: "Ошибка", description: "Не удалось сохранить адрес доставки", duration: 2500 });
            return null;
        } finally {
            setIsAddressSaving(false);
        }
    };

    const resolveDeliveryPayload = async () => {
        if (deliveryMode === "saved") {
            if (!selectedAddressId) {
                sileo.error({ title: "Выберите адрес", description: "Добавьте или выберите место доставки", duration: 2500 });
                return null;
            }

            return { deliveryAddressId: selectedAddressId, deliveryAddressText: null };
        }

        if (addressForm.addressLine.trim().length < 10) {
            sileo.error({ title: "Укажите адрес", description: "Адрес доставки должен быть подробнее", duration: 2500 });
            return null;
        }

        const created = await saveAddress();
        if (!created) return null;
        return { deliveryAddressId: created.id, deliveryAddressText: null };
    };

    const handlePay = async () => {
        if (items.length === 0) {
            sileo.error({ title: "Корзина пуста", description: "Добавьте товары перед оплатой", duration: 2000 });
            return;
        }

        if (contactPhone.trim().length < 5) {
            sileo.error({ title: "Укажите телефон", description: "Телефон нужен для доставки заказа", duration: 2500 });
            return;
        }

        if (orderComment.length > 500) {
            sileo.error({ title: "Комментарий слишком длинный", description: "Максимум 500 символов", duration: 2500 });
            return;
        }

        setIsSubmitting(true);
        try {
            const delivery = await resolveDeliveryPayload();
            if (!delivery) return;

            const response = await apiClient.post<CheckoutResponse>("/Payments/checkout", {
                returnUrl: `${window.location.origin}/checkout`,
                ...delivery,
                contactPhone,
                comment: orderComment,
            });

            const { paymentId, orderIds, confirmationUrl } = response.data;

            if (confirmationUrl?.startsWith("/api/Payments/")) {
                await apiClient.post(`/Payments/${paymentId}/confirm`, { orderIds });
                clearCart();
                sileo.success({ title: "Заказ оплачен", description: "Покупка успешно оформлена", duration: 2500 });
                router.push("/profile?tab=orders");
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
                                <h2 className="form-card__title">Доставка</h2>

                                {addresses.length > 0 && (
                                    <div className="delivery-toggle">
                                        <button
                                            type="button"
                                            className={deliveryMode === "saved" ? "delivery-toggle__btn--active" : ""}
                                            onClick={() => setDeliveryMode("saved")}
                                        >
                                            Сохраненный адрес
                                        </button>
                                        <button
                                            type="button"
                                            className={deliveryMode === "new" ? "delivery-toggle__btn--active" : ""}
                                            onClick={() => setDeliveryMode("new")}
                                        >
                                            Новый адрес
                                        </button>
                                    </div>
                                )}

                                {deliveryMode === "saved" && addresses.length > 0 ? (
                                    <div className="address-list">
                                        {addresses.map(address => (
                                            <label className="address-option" key={address.id}>
                                                <input
                                                    type="radio"
                                                    checked={selectedAddressId === address.id}
                                                    onChange={() => setSelectedAddressId(address.id)}
                                                />
                                                <span className="address-option__icon">
                                                    <MapPin size={18} />
                                                </span>
                                                <span>
                                                    <strong>{address.title}</strong>
                                                    <small>{address.addressLine}</small>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="delivery-form">
                                        <div className="form-group">
                                            <label className="form-group__label">Название места *</label>
                                            <input
                                                className="form-group__input"
                                                value={addressForm.title}
                                                onChange={(e) => handleAddressChange("title", e.target.value)}
                                                placeholder="Дом, офис, пункт выдачи"
                                            />
                                        </div>
                                        <div className="form-group form-group--wide">
                                            <label className="form-group__label">Адрес доставки *</label>
                                            <input
                                                className="form-group__input"
                                                value={addressForm.addressLine}
                                                onChange={(e) => handleAddressChange("addressLine", e.target.value)}
                                                placeholder="Город, улица, дом"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-group__label">Подъезд</label>
                                            <input className="form-group__input" value={addressForm.entrance} onChange={(e) => handleAddressChange("entrance", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-group__label">Этаж</label>
                                            <input className="form-group__input" value={addressForm.floor} onChange={(e) => handleAddressChange("floor", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-group__label">Квартира / офис</label>
                                            <input className="form-group__input" value={addressForm.apartment} onChange={(e) => handleAddressChange("apartment", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-group__label">Комментарий к адресу</label>
                                            <input className="form-group__input" value={addressForm.comment} onChange={(e) => handleAddressChange("comment", e.target.value)} />
                                        </div>
                                        <button type="button" className="address-save-btn" onClick={saveAddress} disabled={isAddressSaving}>
                                            <Plus size={16} />
                                            {isAddressSaving ? "Сохранение..." : "Добавить место доставки"}
                                        </button>
                                    </div>
                                )}

                                <div className="checkout-contact">
                                    <div className="form-group">
                                        <label className="form-group__label">Телефон для доставки *</label>
                                        <input
                                            type="tel"
                                            className="form-group__input"
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                            placeholder="+7 999 123-45-67"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-group__label">Комментарий к заказу</label>
                                        <textarea
                                            className="form-group__textarea"
                                            value={orderComment}
                                            onChange={(e) => setOrderComment(e.target.value)}
                                            maxLength={500}
                                            placeholder="Например: позвонить за час до доставки"
                                        />
                                        <span className="checkout-form-hint">{orderComment.length}/500</span>
                                    </div>
                                </div>
                            </section>

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
