'use client';

import React, { useEffect, useState } from 'react';
import { Store, Package, ShoppingCart, X } from 'lucide-react';
import { useShopsStore } from '@/data/store/useShopsStore';
import './shops.css';
import { useRouter } from "next/navigation";

export const ShopsSection = () => {
    // Достаем новые методы и состояния из стора
    const { shops, isLoading, error, fetchMyShops, createShop, isCreating, createError } = useShopsStore();
    const router = useRouter();

    // Состояния для попапа и формы
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoPath: '',
        urlAlias: ''
    });

    useEffect(() => {
        fetchMyShops();
    }, [fetchMyShops]);

    // Обработчик изменения полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createShop(formData);

        if (success) {
            // Закрываем модалку и очищаем форму при успехе
            setIsModalOpen(false);
            setFormData({ name: '', description: '', logoPath: '', urlAlias: '' });
        }
    };

    return (
        <>
            <div className="shops-header">
                <div>
                    <h2 className="shops-title">Мои магазины</h2>
                    <p className="shops-subtitle">Управление вашими магазинами на платформе</p>
                </div>
                {/* Кнопка теперь открывает модалку */}
                <button className="shops-create-btn" onClick={() => setIsModalOpen(true)}>
                    <Store size={18} />
                    Создать магазин
                </button>
            </div>

            <div className="shops-grid">
                {isLoading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        Загрузка магазинов...
                    </div>
                ) : error ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'red' }}>
                        {error}
                    </div>
                ) : shops.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#667085' }}>
                        <p>У вас пока нет магазинов</p>
                    </div>
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

                            <button onClick={() => router.push(`/shop/${shop.id}`)} className="shop-card__btn">Управление</button>
                        </div>
                    ))
                )}
            </div>

            {/* ПОПАП (МОДАЛЬНОЕ ОКНО) */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Создать новый магазин</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Название магазина *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
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
                                        value={formData.urlAlias}
                                        onChange={handleInputChange}
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
                                    value={formData.logoPath}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
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