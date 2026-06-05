'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Clock, Package, ShieldCheck, ShoppingCart, Store, X } from 'lucide-react';
import { sileo } from 'sileo';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/data/api/apiClient';
import { useAuthStore } from '@/data/store/useAuthStore';
import { useShopsStore } from '@/data/store/useShopsStore';
import './shops.css';

type SellerRequestStatus = 'pending' | 'approved' | 'rejected';

type SellerAccessRequest = {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    innOrOgrnip: string;
    socialOrWebsiteUrl: string;
    plannedCategory: string;
    description: string;
    acceptedMarketplaceRules: boolean;
    status: SellerRequestStatus;
    createdAtUtc: string;
    reviewedAtUtc?: string | null;
    adminComment?: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
    electronics: 'Электроника',
    clothing: 'Одежда',
    adultGoods: 'Товары для взрослых (требует подтверждения 18+)',
    other: 'Другое',
};

const REQUEST_STATUS_LABELS: Record<SellerRequestStatus, string> = {
    pending: 'На проверке',
    approved: 'Одобрена',
    rejected: 'Отклонена',
};

const emptyRequestForm = {
    innOrOgrnip: '',
    socialOrWebsiteUrl: '',
    plannedCategory: 'electronics',
    description: '',
    acceptedMarketplaceRules: false,
};

export const ShopsSection = () => {
    const router = useRouter();
    const role = useAuthStore((state) => state.role);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const { shops, isLoading, error, fetchMyShops, createShop, isCreating, createError } = useShopsStore();

    const canManageShops = role === 'Seller' || role === 'Admin';
    const isAdmin = role === 'Admin';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopForm, setShopForm] = useState({
        name: '',
        description: '',
        logoPath: '',
        urlAlias: '',
    });

    const [requestForm, setRequestForm] = useState(emptyRequestForm);
    const [myRequests, setMyRequests] = useState<SellerAccessRequest[]>([]);
    const [pendingRequests, setPendingRequests] = useState<SellerAccessRequest[]>([]);
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
    const [adminActionId, setAdminActionId] = useState<string | null>(null);

    const latestRequest = useMemo(() => myRequests[0] ?? null, [myRequests]);

    useEffect(() => {
        if (canManageShops) {
            fetchMyShops();
        }
    }, [canManageShops, fetchMyShops]);

    useEffect(() => {
        void fetchMySellerRequests();
        if (isAdmin) {
            void fetchPendingSellerRequests();
        }
    }, [isAdmin]);

    const fetchMySellerRequests = async () => {
        setIsRequestLoading(true);
        try {
            const response = await apiClient.get<SellerAccessRequest[]>('/SellerAccessRequests/my');
            setMyRequests(response.data);
        } catch (error) {
            console.error('Ошибка при получении заявки продавца:', error);
        } finally {
            setIsRequestLoading(false);
        }
    };

    const fetchPendingSellerRequests = async () => {
        try {
            const response = await apiClient.get<SellerAccessRequest[]>('/SellerAccessRequests', {
                params: { status: 'pending' },
            });
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Ошибка при получении заявок продавцов:', error);
        }
    };

    const handleShopInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShopForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRequestInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequestForm((prev) => ({ ...prev, acceptedMarketplaceRules: e.target.checked }));
    };

    const handleCreateShop = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createShop(shopForm);

        if (success) {
            setIsModalOpen(false);
            setShopForm({ name: '', description: '', logoPath: '', urlAlias: '' });
        }
    };

    const handleSellerRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^\d{10,12}$/.test(requestForm.innOrOgrnip)) {
            sileo.error({ title: 'Ошибка', description: 'ИНН / ОГРНИП должен содержать 10-12 цифр', duration: 2500 });
            return;
        }

        if (!requestForm.acceptedMarketplaceRules) {
            sileo.error({ title: 'Ошибка', description: 'Подтвердите правила площадки', duration: 2500 });
            return;
        }

        setIsRequestSubmitting(true);
        try {
            await apiClient.post('/SellerAccessRequests', requestForm);
            setRequestForm(emptyRequestForm);
            await fetchMySellerRequests();
            sileo.success({ title: 'Заявка отправлена', description: 'Администратор проверит ее в ближайшее время', duration: 2500 });
        } catch (error: any) {
            const description = error?.response?.data || 'Не удалось отправить заявку';
            sileo.error({ title: 'Ошибка', description: String(description), duration: 3000 });
        } finally {
            setIsRequestSubmitting(false);
        }
    };

    const handleAdminDecision = async (requestId: string, action: 'approve' | 'reject') => {
        setAdminActionId(requestId);
        try {
            await apiClient.post(`/SellerAccessRequests/${requestId}/${action}`, {});
            await fetchPendingSellerRequests();
            await fetchMySellerRequests();
            sileo.success({
                title: action === 'approve' ? 'Заявка одобрена' : 'Заявка отклонена',
                description: action === 'approve' ? 'Пользователь получил роль продавца' : 'Пользователь сможет отправить новую заявку',
                duration: 2500,
            });
        } catch (error) {
            console.error('Ошибка при обработке заявки:', error);
            sileo.error({ title: 'Ошибка', description: 'Не удалось обработать заявку', duration: 2500 });
        } finally {
            setAdminActionId(null);
        }
    };

    const refreshCurrentRole = async () => {
        try {
            const response = await apiClient.get('/Users/current');
            updateProfile({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                phone: response.data.phone,
                role: response.data.role,
            });
            await fetchMyShops();
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    return (
        <>
            <div className="shops-header">
                <div>
                    <h2 className="shops-title">Мои магазины</h2>
                    <p className="shops-subtitle">Управление магазинами и заявкой на права продавца</p>
                </div>
                {canManageShops && (
                    <button className="shops-create-btn" onClick={() => setIsModalOpen(true)}>
                        <Store size={18} />
                        Создать магазин
                    </button>
                )}
            </div>

            {!canManageShops && (
                <section className="seller-request">
                    <div className="seller-request__header">
                        <ShieldCheck size={24} />
                        <div>
                            <h3>Заявка на создание магазина</h3>
                            <p>После одобрения администратором вы сможете создавать магазины.</p>
                        </div>
                    </div>

                    {isRequestLoading ? (
                        <div className="seller-request__status">Загрузка заявки...</div>
                    ) : latestRequest ? (
                        <div className={`seller-request__status seller-request__status--${latestRequest.status}`}>
                            {latestRequest.status === 'pending' ? <Clock size={18} /> : <CheckCircle size={18} />}
                            <div>
                                <strong>{REQUEST_STATUS_LABELS[latestRequest.status]}</strong>
                                <span>
                                    Категория: {CATEGORY_LABELS[latestRequest.plannedCategory] ?? latestRequest.plannedCategory}
                                </span>
                                {latestRequest.status === 'approved' && (
                                    <button type="button" onClick={refreshCurrentRole}>
                                        Обновить права
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {(!latestRequest || latestRequest.status === 'rejected') && (
                        <form className="seller-request__form" onSubmit={handleSellerRequestSubmit}>
                            <div className="form-group">
                                <label>ИНН / ОГРНИП *</label>
                                <input
                                    name="innOrOgrnip"
                                    value={requestForm.innOrOgrnip}
                                    onChange={handleRequestInputChange}
                                    inputMode="numeric"
                                    pattern="\d{10,12}"
                                    minLength={10}
                                    maxLength={12}
                                    placeholder="10-12 цифр"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ссылка на соцсеть / сайт *</label>
                                <input
                                    type="url"
                                    name="socialOrWebsiteUrl"
                                    value={requestForm.socialOrWebsiteUrl}
                                    onChange={handleRequestInputChange}
                                    placeholder="https://example.com/profile"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Планируемая категория товаров *</label>
                                <select
                                    name="plannedCategory"
                                    value={requestForm.plannedCategory}
                                    onChange={handleRequestInputChange}
                                    required
                                >
                                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Почему вам нужно создать магазин? *</label>
                                <textarea
                                    name="description"
                                    value={requestForm.description}
                                    onChange={handleRequestInputChange}
                                    maxLength={300}
                                    rows={4}
                                    placeholder="Коротко опишите цель магазина"
                                    required
                                />
                                <span className="form-hint">{requestForm.description.length}/300</span>
                            </div>

                            <label className="seller-request__checkbox">
                                <input
                                    type="checkbox"
                                    checked={requestForm.acceptedMarketplaceRules}
                                    onChange={handleRulesChange}
                                />
                                <span>Я не буду нарушать правила площадки</span>
                            </label>

                            <button type="submit" className="shops-create-btn" disabled={isRequestSubmitting}>
                                {isRequestSubmitting ? 'Отправка...' : 'Запросить права продавца'}
                            </button>
                        </form>
                    )}
                </section>
            )}

            {isAdmin && pendingRequests.length > 0 && (
                <section className="admin-requests">
                    <h3>Заявки на права продавца</h3>
                    <div className="admin-requests__list">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="admin-request">
                                <div>
                                    <strong>{request.userName || request.userEmail}</strong>
                                    <p>{request.userEmail}</p>
                                    <p>ИНН / ОГРНИП: {request.innOrOgrnip}</p>
                                    <p>Категория: {CATEGORY_LABELS[request.plannedCategory] ?? request.plannedCategory}</p>
                                    <a href={request.socialOrWebsiteUrl} target="_blank" rel="noreferrer">
                                        {request.socialOrWebsiteUrl}
                                    </a>
                                    <p>{request.description}</p>
                                </div>
                                <div className="admin-request__actions">
                                    <button
                                        type="button"
                                        onClick={() => handleAdminDecision(request.id, 'approve')}
                                        disabled={adminActionId === request.id}
                                    >
                                        Одобрить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAdminDecision(request.id, 'reject')}
                                        disabled={adminActionId === request.id}
                                    >
                                        Отклонить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {canManageShops && (
                <div className="shops-grid">
                    {isLoading ? (
                        <div className="shops-empty">Загрузка магазинов...</div>
                    ) : error ? (
                        <div className="shops-empty shops-empty--error">{error}</div>
                    ) : shops.length === 0 ? (
                        <div className="shops-empty">У вас пока нет магазинов</div>
                    ) : (
                        shops.map((shop) => (
                            <div key={shop.id} className="shop-card">
                                <div className="shop-card__header">
                                    <div className="shop-card__icon">
                                        <Store size={24} color="#155DFC" />
                                    </div>
                                    <h3 className="shop-card__name">{shop.name}</h3>
                                </div>

                                <p className="shop-card__url">shopal.com/{shop.urlAlias}</p>

                                <div className="shop-card__stats">
                                    <div className="shop-stat">
                                        <div className="shop-stat__icon">
                                            <Package size={18} color="#667085" />
                                        </div>
                                        <div>
                                            <div className="shop-stat__value">0</div>
                                            <div className="shop-stat__label">товаров</div>
                                        </div>
                                    </div>

                                    <div className="shop-stat">
                                        <div className="shop-stat__icon">
                                            <ShoppingCart size={18} color="#667085" />
                                        </div>
                                        <div>
                                            <div className="shop-stat__value">0</div>
                                            <div className="shop-stat__label">заказов</div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => router.push(`/shop/${shop.id}`)} className="shop-card__btn">
                                    Управление
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Создать новый магазин</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateShop} className="modal-form">
                            <div className="form-group">
                                <label>Название магазина *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={shopForm.name}
                                    onChange={handleShopInputChange}
                                    placeholder="Например: Супер Кроссовки"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Короткий URL (Alias) *</label>
                                <div className="url-input-wrapper">
                                    <span className="url-prefix">shopal.com/</span>
                                    <input
                                        type="text"
                                        name="urlAlias"
                                        value={shopForm.urlAlias}
                                        onChange={handleShopInputChange}
                                        placeholder="super-shoes"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Ссылка на логотип</label>
                                <input
                                    type="url"
                                    name="logoPath"
                                    value={shopForm.logoPath}
                                    onChange={handleShopInputChange}
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    name="description"
                                    value={shopForm.description}
                                    onChange={handleShopInputChange}
                                    placeholder="Краткое описание вашего магазина"
                                    rows={3}
                                />
                            </div>

                            {createError && <div className="form-error">{createError}</div>}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="btn-submit" disabled={isCreating}>
                                    {isCreating ? 'Создание...' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
