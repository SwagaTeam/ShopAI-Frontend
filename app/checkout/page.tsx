"use client";

import React, { useEffect, useState } from "react";
import "./checkout.css";
import { Header } from "@/components/header/header";
import { OrderSummary } from "@/components/order-summary/order-summary";
import { CreditCard, MapPin, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { useCartStore } from "@/data/store/useCartStore";
import { useAuthStore } from "@/data/store/useAuthStore";
import { useCheckoutStore } from "@/data/store/useCheckoutStore"; // <-- Наш новый стор
import { useRouter } from "next/navigation";
import { sileo } from "sileo";

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

    const {
        addresses,
        isAddressSaving,
        isSubmitting,
        fetchAddresses,
        saveAddress,
        submitOrder,
        confirmPayment
    } = useCheckoutStore();

    const [deliveryMode, setDeliveryMode] = useState<"saved" | "new">("new");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [addressForm, setAddressForm] = useState(emptyAddressForm);
    const [contactPhone, setContactPhone] = useState(phone || "");
    const [orderComment, setOrderComment] = useState("");

    useEffect(() => {
        fetchCart();
        fetchAddresses().then(() => {
            const currentAddresses = useCheckoutStore.getState().addresses;
            if (currentAddresses.length > 0) {
                setDeliveryMode("saved");
                setSelectedAddressId(currentAddresses[0].id);
            }
        });
    }, [fetchCart, fetchAddresses]);

    useEffect(() => {
        if (!contactPhone && phone) {
            setContactPhone(phone);
        }
    }, [contactPhone, phone]);

    const handleAddressChange = (field: keyof typeof addressForm, value: string) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveAddress = async () => {
        if (addressForm.title.trim().length === 0 || addressForm.addressLine.trim().length < 10) {
            sileo.error({ title: "Адрес не сохранен", description: "Укажите название и полный адрес", duration: 2500 });
            return null;
        }

        const created = await saveAddress(addressForm);
        if (created) {
            setSelectedAddressId(created.id);
            setDeliveryMode("saved");
            setAddressForm(emptyAddressForm);
            sileo.success({ title: "Адрес сохранен", description: "Теперь его можно выбирать при заказе", duration: 2200 });
        } else {
            sileo.error({ title: "Ошибка", description: "Не удалось сохранить адрес доставки", duration: 2500 });
        }
        return created;
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

        const created = await handleSaveAddress();
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

        const delivery = await resolveDeliveryPayload();
        if (!delivery) return;

        const orderData = await submitOrder({
            returnUrl: `${window.location.origin}/checkout`,
            ...delivery,
            contactPhone,
            comment: orderComment,
        });

        if (!orderData) {
            sileo.error({ title: "Ошибка оплаты", description: "Не удалось создать платеж", duration: 2500 });
            return;
        }

        const { paymentId, orderIds, confirmationUrl } = orderData;

        if (confirmationUrl?.startsWith("/api/Payments/")) {
            const confirmed = await confirmPayment(paymentId, orderIds);
            if (confirmed) {
                clearCart();
                sileo.success({ title: "Заказ оплачен", description: "Покупка успешно оформлена", duration: 2500 });
                router.push("/orders");
            }
            return;
        }

        if (confirmationUrl) {
            clearCart();
            window.location.href = confirmationUrl;
            return;
        }

        sileo.error({ title: "Ошибка", description: "Сбой получения данных для оплаты", duration: 2500 });
    };

    const isFormValid = addressForm.title.trim() !== "" && addressForm.addressLine.trim() !== "";

    return (
        <>
            <Header isCompact={true} />
            <div className="checkout-page-container">
                <div className="checkout-page">
                    <Breadcrumb isCart={false} />
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
                                            <label className="form-group__label">Название адреса доставки *</label>
                                            <input
                                                className="form-group__input"
                                                value={addressForm.title}
                                                onChange={(e) => handleAddressChange("title", e.target.value)}
                                                placeholder="Например, дом или офис"
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
                                        <button type="button" className="address-save-btn" onClick={handleSaveAddress} disabled={!isFormValid || isAddressSaving}>
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
                                <h2 className="form-card__title">Способ оплаты</h2>
                                <div className="payment-list">
                                    <label className="payment-method">
                                        <input type="radio" name="payment" className="payment-method__radio" defaultChecked />
                                        <span className="payment-method__icon">
                                            <CreditCard size={20} />
                                        </span>
                                        <span className="payment-method__label">ЮKassa, банковская карта / СБП</span>
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