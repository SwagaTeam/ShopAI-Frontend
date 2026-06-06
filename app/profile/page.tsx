'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Camera } from 'lucide-react';
import { useAuthStore } from "@/data/store/useAuthStore";
import { apiClient } from "@/data/api/apiClient";
import './profile.css';
import {Header} from "@/components/header/header";
import {getInitials} from "@/utils/utils";
import { ProfileSidebar } from "@/components/profile-sidebar/profile-sidebar";
import { ShopsSection } from "@/components/profile-shops/shops";
import "@/components/profile-sidebar/profile-sidebar.css";
import {useRouter} from "next/navigation";

export default function ProfilePage() {
    const { name, email, phone, updateProfile, clearAuth } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('personal');

    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };


    const [formData, setFormData] = useState({
        name: name || '',
        email: email || '',
        phone: phone || '',
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        const tab = new URLSearchParams(window.location.search).get('tab');
        if (tab) {
            setActiveTab(tab);
        }

        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/Users/current');
                if (response.data) {
                    const profile = {
                        id: response.data.id,
                        name: response.data.name,
                        email: response.data.email,
                        phone: response.data.phone,
                        role: response.data.role
                    };

                    updateProfile(profile);
                    setFormData({
                        name: profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                    });
                }
            } catch (error) {
                console.error('Ошибка при синхронизации профиля с сервером', error);
            }
        };

        fetchProfile();
    }, [updateProfile]);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <Header isCompact={true}/>
            <div className={'profile-page-container'}>
        <div className="profile-page">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="profile-content">
                {activeTab === 'personal' && (
                    <>
                        <section className="profile-section">
                            <h2 className="profile-section__title">Личная информация</h2>

                            <div className="profile-avatar">
                                <div className="profile-avatar__circle-wrap">
                                    <div className="profile-avatar__circle">
                                        {getInitials(formData.name)}
                                    </div>
                                    <button className="profile-avatar__btn" aria-label="Сменить фото">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="profile-avatar__info-title">Фото профиля</h3>
                                    <p className="profile-avatar__info-desc">JPG, PNG или GIF. Максимум 2МБ</p>
                                </div>
                            </div>

                            <div className="profile-form">
                                <div className="profile-field">
                                    <label className="profile-field__label">Полное имя</label>
                                    <div className="profile-field__input-wrap">
                                        <input
                                            type="text"
                                            className="profile-field__input"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Иванов Иван Иванович"
                                        />
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <label className="profile-field__label">Email</label>
                                    <div className="profile-field__input-wrap">
                                        <input
                                            type="email"
                                            className="profile-field__input"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="ivan@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <label className="profile-field__label">Телефон</label>
                                    <div className="profile-field__input-wrap">
                                        <input
                                            type="tel"
                                            className="profile-field__input"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="+7 (999) 123-45-67"
                                        />
                                    </div>
                                </div>

                                <button type="button" className="profile-btn-primary">
                                    Сохранить изменения
                                </button>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h2 className="profile-section__title password-title">Смена пароля</h2>

                            <div className="profile-form">
                                <div className="profile-field password-section">
                                    <label className="profile-field__label">Текущий пароль</label>
                                    <div className="profile-field__input-wrap">
                                        <input
                                            type="password"
                                            className="profile-field__input"
                                            placeholder="••••••••"
                                            value={passwords.current}
                                            onChange={(e) => handlePasswordChange('current', e.target.value)}
                                        />
                                        <button type="button" className="profile-field__icon-btn" aria-label="Показать пароль">
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="profile-field password-section">
                                    <label className="profile-field__label">Новый пароль</label>
                                    <div className="profile-field__input-wrap">
                                        <input
                                            type="password"
                                            className="profile-field__input"
                                            placeholder="••••••••"
                                            value={passwords.new}
                                            onChange={(e) => handlePasswordChange('new', e.target.value)}
                                        />
                                        <button type="button" className="profile-field__icon-btn" aria-label="Показать пароль">
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="profile-field password-section">
                                    <label className="profile-field__label">Подтвердите новый пароль</label>
                                    <div className="profile-field__input-wrap">
                                        <input
                                            type="password"
                                            className="profile-field__input"
                                            placeholder="••••••••"
                                            value={passwords.confirm}
                                            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                        />
                                        <button type="button" className="profile-field__icon-btn" aria-label="Показать пароль">
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="profile__botom-section">
                                    <button type="button" className="profile-btn-primary">
                                        Обновить пароль
                                    </button>
                                    <button onClick={handleLogout} className="profile-btn-primary">
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'shops' && (
                    <ShopsSection />
                )}

                {activeTab === 'notifications' && (
                    <section className="profile-section">
                        <h2 className="profile-section__title">Уведомления</h2>
                        <p style={{ color: '#667085' }}>Раздел в разработке...</p>
                    </section>
                )}
            </main>
        </div>
            </div>
        </>
    );
}
