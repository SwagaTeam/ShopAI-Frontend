"use client"
import React, { useState } from 'react';
import './AuthPage.css';
import {ChevronLeft, Eye, EyeOff, LockKeyhole, Mail, User} from "lucide-react";
import {sileo} from "sileo";
import Link from "next/link";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

    // Состояния для полей пароля
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginData(prev => ({...prev, [name]: value}))
    }

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({...prev, [name]: value}));
    };

    const handleRegisterSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Валидация
        if (registerData.password !== registerData.confirmPassword) {
            sileo.error({
                title: "Ошибка",
                description: "Пароли не совпадают"
            });
            return;
        }

        if (registerData.password.length < 6) {
            sileo.error({
                title: "Ошибка",
                description: "Пароль должен быть не менее 6 символов"
            });
            return;
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // Простой success тост
        if (loginData.email && loginData.password) {
            sileo.success({
                title: "Добро пожаловать!",
                description: `Вы успешно вошли в систему`,
            });
        } else {
            sileo.error({
                title: "Ошибка",
                description: "Заполните все поля"
            });
        }
    };

        return (
            <div className="auth-page">
                <div className="auth-page__container">
                    {/* Декоративные элементы */}
                    <div className="auth-decor">
                        <div className="auth-decor__item auth-decor__item--small">
                            <div className="auth-decor__dot auth-decor__dot--left"></div>
                            <div className="auth-decor__dot auth-decor__dot--right"></div>
                        </div>
                        <div className="auth-decor__item auth-decor__item--white">
                            <div className="auth-decor__dot auth-decor__dot--left"></div>
                            <div className="auth-decor__dot auth-decor__dot--right"></div>
                        </div>
                        <div className="auth-decor__item auth-decor__item--blue">
                            <div className="auth-decor__dot auth-decor__dot--left"></div>
                            <div className="auth-decor__dot auth-decor__dot--right"></div>
                        </div>
                        <div className="auth-decor__item auth-decor__item--super-small">
                            <div className="auth-decor__dot auth-decor__dot--left"></div>
                            <div className="auth-decor__dot auth-decor__dot--right"></div>
                        </div>
                    </div>

                    {/* Карточка с формой */}
                    <div className="auth-card">
                        <Link href={"/"} className="auth-page__back-btn" aria-label="Назад">
                            <ChevronLeft size={24} color="#4A5565" />
                        </Link>
                        <div className="auth-card__header">
                            <div className="auth-card__logo"></div>
                            <h1 className="auth-card__title">ShopAI</h1>
                        </div>

                        <div className="auth-tabs">
                            <button
                                className={`auth-tabs__btn ${activeTab === 'login' ? 'auth-tabs__btn--active' : ''}`}
                                onClick={() => setActiveTab('login')}
                            >
                                Вход
                            </button>
                            <button
                                className={`auth-tabs__btn ${activeTab === 'register' ? 'auth-tabs__btn--active' : ''}`}
                                onClick={() => setActiveTab('register')}
                            >
                                Регистрация
                            </button>
                        </div>

                        {activeTab === 'register' ? (
                            // ФОРМА РЕГИСТРАЦИИ
                            <form className="auth-form" onSubmit={handleRegisterSubmit}>
                                <div className="auth-field">
                                    <label className="auth-field__label">Имя</label>
                                    <div className="auth-input-wrapper">
                                    <span className="auth-input-wrapper__icon">
                                        <User size={15} color={"#99A1AF"} />
                                    </span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={registerData.name}
                                            onChange={handleRegisterChange}
                                            className="auth-input auth-input--with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-field__label">Почта</label>
                                    <div className="auth-input-wrapper">
                                    <span className="auth-input-wrapper__icon">
                                        <Mail size={15} color={"#99A1AF"}/>
                                    </span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerData.email}
                                            onChange={handleRegisterChange}
                                            className="auth-input auth-input--with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-field__label">Пароль</label>
                                    <div className="auth-input-wrapper">
                                    <span className="auth-input-wrapper__icon">
                                        <LockKeyhole size={15} color={"#99A1AF"} />
                                    </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            className="auth-input auth-input--with-icon auth-input--with-action"
                                        />
                                        <button
                                            type="button"
                                            className="auth-input-wrapper__action"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={15} color={"#99A1AF"} /> : <Eye size={15} color={"#99A1AF"} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-field__label">Подтвердите пароль</label>
                                    <div className="auth-input-wrapper">
                                    <span className="auth-input-wrapper__icon">
                                        <LockKeyhole size={15} color={"#99A1AF"} />
                                    </span>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={registerData.confirmPassword}
                                            onChange={handleRegisterChange}
                                            className="auth-input auth-input--with-icon auth-input--with-action"
                                        />
                                        <button
                                            type="button"
                                            className="auth-input-wrapper__action"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={15} color={"#99A1AF"} /> : <Eye size={15} color={"#99A1AF"} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="auth-btn">Зарегистрироваться</button>

                                <div className="auth-footer">
                                    <span>Уже есть аккаунт? <button className="auth-footer__link" onClick={() => setActiveTab('login')}>Авторизация</button></span>
                                </div>
                            </form>
                        ) : (
                            // ФОРМА ВХОДА
                            <form className="auth-form" onSubmit={handleLoginSubmit}>
                                <div className="auth-field">
                                    <label className="auth-field__label">Email</label>
                                    <div className="auth-input-wrapper">
                                        <input
                                            type="email"
                                            name="email"
                                            value={loginData.email}
                                            onChange={handleLoginChange}
                                            className="auth-input"
                                        />
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-field__label">Пароль</label>
                                    <div className="auth-input-wrapper">
                                        <input
                                            type={showLoginPassword ? "text" : "password"}
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className="auth-input auth-input--with-action"
                                        />
                                        <button
                                            type="button"
                                            className="auth-input-wrapper__action"
                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        >
                                            {showLoginPassword ? <EyeOff size={15} color={"#99A1AF"} /> : <Eye size={15} color={"#99A1AF"} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="auth-btn">Войти</button>

                                <div className="auth-footer">
                                    <button type="button" className="auth-footer__link">Забыли пароль?</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }
