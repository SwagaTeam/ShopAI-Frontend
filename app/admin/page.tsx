'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/data/store/useAuthStore';
import { useShopsStore } from '@/data/store/useShopsStore';
import Link from 'next/link';
import { ShieldCheck, Clock, CheckCircle, Store, AlertCircle } from 'lucide-react';
import { sileo } from 'sileo';
import './shops.css';

const CATEGORY_LABELS: Record<string, string> = {
    electronics: 'Электроника',
    clothing: 'Одежда',
    adultGoods: 'Товары для взрослых (требует подтверждения 18+)',
    other: 'Другое',
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
    pending: 'Заявление находится на рассмотрении',
    approved: 'Заявление одобрено',
    rejected: 'Заявление отклонено',
};

const emptyRequestForm = {
    innOrOgrnip: '',
    socialOrWebsiteUrl: '',
    plannedCategory: 'electronics',
    description: '',
    acceptedMarketplaceRules: false,
};

export default function AdminPage() {
    const router = useRouter();
    const role = useAuthStore((state) => state.role);
    const {
        shops, fetchMyShops,
        myRequests, isRequestLoading, fetchMySellerRequests, submitSellerRequest,
        isRequestSubmitting, createShop, isCreating
    } = useShopsStore();

    const [requestForm, setRequestForm] = useState(emptyRequestForm);
    const [shopForm, setShopForm] = useState({
        name: '',
        description: '',
        logoPath: '',
        urlAlias: '',
    });

    const canManageShops = role === 'Seller' || role === 'Admin';
    const latestRequest = useMemo(() => {
        return [...myRequests].sort((a, b) =>
            new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
        )[0] ?? null;
    }, [myRequests]);

    useEffect(() => {
        if (role === 'Admin') {
            router.push('/admin/requests');
            return;
        }

        if (canManageShops) {
            fetchMyShops().then(() => {
                if (useShopsStore.getState().shops.length > 0) {
                    router.push('/admin/shops');
                }
            });
        } else {
            fetchMySellerRequests();
        }
    }, [role, canManageShops, fetchMyShops, fetchMySellerRequests, router]);

    const handleRequestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setRequestForm((prev) => ({ ...prev, [name]: val }));
    };

    const handleSellerRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{10,12}$/.test(requestForm.innOrOgrnip)) {
            sileo.error({ title: 'Ошибка валидации', description: 'ИНН или ОГРНИП должен содержать от 10 до 12 цифр.' });
            return;
        }
        const success = await submitSellerRequest(requestForm);
        if (success) {
            sileo.success({ title: 'Заявление отправлено', description: 'Ведомство проверит данные в течение 3-х рабочих дней.' });
        }
    };

    const handleCreateFirstShop = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createShop(shopForm);
        if (success) {
            sileo.success({ title: 'Магазин зарегистрирован', description: 'Переход в панель управления...' });
            router.push('/admin/shops');
        }
    };

    const refreshCurrentRole = async () => {
        await useAuthStore.getState().fetchProfile();
    };

    // 1. Форма запроса на статус продавца (Стиль Госуслуг)
    if (!canManageShops) {
        return (
            <div className="gov-layout">
                <section className="gov-card">
                    <div className="gov-card__header">
                        <ShieldCheck size={36} color="#005BFF" strokeWidth={1.5} />
                        <div>
                            <h1>{latestRequest ? 'Статус вашего заявления' : 'Регистрация продавца на платформе'}</h1>
                            {!latestRequest && <p>Заполните форму заявления для получения прав на ведение торговой деятельности.</p>}
                        </div>
                    </div>

                    {isRequestLoading ? (
                        <div className="gov-loading">Получение данных из реестра...</div>
                    ) : latestRequest ? (
                        <div className={`gov-status-banner gov-status-banner--${latestRequest.status.toLowerCase()}`}>
                            <div className="gov-status-banner__icon">
                                {latestRequest.status.toLowerCase() === 'pending' ? <Clock size={24} /> :
                                    latestRequest.status.toLowerCase() === 'rejected' ? <AlertCircle size={24} /> :
                                        <CheckCircle size={24} />}
                            </div>
                            <div className="gov-status-banner__content">
                                <strong>{REQUEST_STATUS_LABELS[latestRequest.status.toLowerCase()] || latestRequest.status}</strong>
                                {latestRequest.status.toLowerCase() === 'pending' && (
                                    <span>Мы уже получили вашу заявку. Мы уведомим вас о результате после завершения проверки всех данных.</span>
                                )}
                                <span>Категория: {CATEGORY_LABELS[latestRequest.plannedCategory] ?? latestRequest.plannedCategory}</span>
                                {latestRequest.status.toLowerCase() === 'approved' && (
                                    <button className="gov-btn-secondary" onClick={refreshCurrentRole}>
                                        Обновить профиль и продолжить
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {(!latestRequest || latestRequest.status === 'rejected') && (
                        <form className="gov-form" onSubmit={handleSellerRequestSubmit}>
                            <div className="gov-form__section">
                                <h3 className="gov-form__section-title">Сведения о предпринимателе</h3>
                                <div className="gov-form__grid">
                                    <div className="gov-input-group">
                                        <label>ИНН / ОГРНИП <span className="required">*</span></label>
                                        <input
                                            name="innOrOgrnip"
                                            value={requestForm.innOrOgrnip}
                                            onChange={handleRequestInputChange}
                                            placeholder="Введите 10 или 12 цифр"
                                            required
                                        />
                                    </div>
                                    <div className="gov-input-group">
                                        <label>Электронный ресурс (Сайт/Соцсеть) <span className="required">*</span></label>
                                        <input
                                            type="url"
                                            name="socialOrWebsiteUrl"
                                            value={requestForm.socialOrWebsiteUrl}
                                            onChange={handleRequestInputChange}
                                            placeholder="https://"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="gov-form__section">
                                <h3 className="gov-form__section-title">Информация о деятельности</h3>
                                <div className="gov-input-group">
                                    <label>Основная категория товаров <span className="required">*</span></label>
                                    <select name="plannedCategory" value={requestForm.plannedCategory} onChange={handleRequestInputChange}>
                                        {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="gov-input-group">
                                    <label>Описание торговой деятельности <span className="required">*</span></label>
                                    <textarea
                                        name="description"
                                        value={requestForm.description}
                                        onChange={handleRequestInputChange}
                                        rows={4}
                                        placeholder="Укажите специфику реализуемых товаров"
                                        required
                                    />
                                </div>
                                <div className="gov-checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="acceptedMarketplaceRules"
                                        name="acceptedMarketplaceRules"
                                        checked={requestForm.acceptedMarketplaceRules}
                                        onChange={handleRequestInputChange}
                                        required
                                    />
                                    <label htmlFor="acceptedMarketplaceRules">
                                        Я принимаю <Link href="/rules" className="gov-link">правила маркетплейса</Link> и подтверждаю достоверность данных <span className="required">*</span>
                                    </label>
                                </div>
                            </div>

                            <div className="gov-form__actions">
                                <button type="submit" className="gov-btn-primary" disabled={isRequestSubmitting}>
                                    {isRequestSubmitting ? 'Отправка заявления...' : 'Подать заявление'}
                                </button>
                                <span className="gov-form__hint">Нажимая кнопку, вы подтверждаете достоверность данных</span>
                            </div>
                        </form>
                    )}
                </section>
            </div>
        );
    }

    // 2. Создание первого магазина
    if (shops.length === 0) {
        return (
            <div className="gov-layout">
                <section className="gov-card">
                    <div className="gov-card__header">
                        <Store size={36} color="#005BFF" strokeWidth={1.5} />
                        <div>
                            <h1>Регистрация новой торговой площадки</h1>
                            <p>Права продавца подтверждены. Заполните данные для создания витрины.</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateFirstShop} className="gov-form">
                        <div className="gov-form__section">
                            <h3 className="gov-form__section-title">Основные реквизиты магазина</h3>
                            <div className="gov-input-group">
                                <label>Официальное наименование магазина <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={shopForm.name}
                                    onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
                                    placeholder="Например: ООО Вектор"
                                    required
                                />
                            </div>
                            <div className="gov-input-group">
                                <label>Символьное имя ссылки (URL Alias) <span className="required">*</span></label>
                                <div className="gov-input-prefix-wrapper">
                                    <span className="gov-input-prefix">shopai.com/</span>
                                    <input
                                        type="text"
                                        value={shopForm.urlAlias}
                                        onChange={(e) => setShopForm({...shopForm, urlAlias: e.target.value})}
                                        placeholder="my-shop"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="gov-input-group">
                                <label>Краткое описание витрины</label>
                                <textarea
                                    value={shopForm.description}
                                    onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                                    placeholder="Видна покупателям в разделе информации"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="gov-form__actions">
                            <button type="submit" className="gov-btn-primary" disabled={isCreating}>
                                {isCreating ? 'Регистрация...' : 'Зарегистрировать магазин'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        );
    }

    return <div className="gov-loading-fullscreen">Выполняется защищенный переход...</div>;
}