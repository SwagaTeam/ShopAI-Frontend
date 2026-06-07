'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Camera } from 'lucide-react';
import { useAuthStore } from "@/data/store/useAuthStore";
import './profile.css';
import { Header } from "@/components/header/header";
import { getInitials } from "@/utils/utils";
import { useRouter } from "next/navigation";
import {sileo} from "sileo";
import { ProfileSkeleton } from "@/components/skeleton/skeleton";

export default function ProfilePage() {
    const {
        name,
        email,
        phone,
        updateProfile,
        clearAuth,
        fetchProfile,
        isLoading
    } = useAuthStore();
    const router = useRouter();

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
        setFormData({
            name: name || '',
            email: email || '',
            phone: phone || '',
        });
    }, [name, email, phone]);

    useEffect(() => {
        // Получаем профиль при монтировании компонента
        fetchProfile();
    }, [fetchProfile]);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            updateProfile(formData);
            sileo.success({ title: "Успех!", description: `Профиль обновлен`, duration: 2000  });
        } catch (error) {
            console.error('Ошибка при сохранении профиля:', error);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            // Добавить уведомление о несовпадении паролей
            return;
        }

        try {
            setPasswords({
                current: '',
                new: '',
                confirm: ''
            });
        } catch (error) {
            console.error('Ошибка при обновлении пароля:', error);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header isCompact={true} />
                <div className="profile-page-container">
                    <div className="profile-page">
                        <main className="profile-content">
                            <ProfileSkeleton />
                        </main>
                    </div>
                </div>
            </>
        );
    }


    return (
        <>
            <Header isCompact={true} />
            <div className="profile-page-container">
                <div className="profile-page">
                    <main className="profile-content">
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
                                <div className="profile-field_group">
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
                                </div>
                                <button
                                    type="button"
                                    className="profile-btn-primary"
                                    onClick={handleSaveProfile}
                                >
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
                                    <button
                                        type="button"
                                        className="profile-btn-primary"
                                        onClick={handleUpdatePassword}
                                    >
                                        Обновить пароль
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="profile-btn-primary"
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}