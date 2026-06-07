"use client"
import React, {useEffect, useState} from 'react';
import './auth.css';
import {Bot, ChevronLeft, Eye, EyeOff} from "lucide-react";
import {sileo} from "sileo";
import Link from "next/link";
import {useAuthStore} from "@/data/store/useAuthStore";
import {useRouter} from "next/navigation";
import {authApi} from "@/data/AuthApi";
import Image from "next/image";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const { setAuth, isAuth } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    useEffect(() => {
        if (isAuth) {
            router.replace('/main');
        }
    }, [isAuth, router]);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            return sileo.error({ title: "Ошибка", description: "Пароли не совпадают", duration: 2000 });
        }

        setLoading(true);
        try {
            const payload = {
                fullName: registerData.name,
                email: registerData.email,
                phone: registerData.phone,
                password: registerData.password
            };

            await authApi.register(payload);

            sileo.success({ title: "Успех!", description: "Регистрация прошла успешно. Теперь войдите.", duration: 2000  });
            setActiveTab('login');
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await authApi.login(loginData);
            setAuth(data.accessToken, data.refreshToken);

            sileo.success({ title: "Успех!", description: "Добро пожаловать", duration: 2000 });
            router.push('/main');
        } catch {
            sileo.error({ title: "Ошибка", description: "Неверный логин или пароль", duration: 2000  });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* Декоративные элементы фона */}
            <div className="auth-decor">
                <div className="auth-decor__speech">
                    <Image src="/images/auth/robot-hello.png" alt="Robot" width={600} height={600} className="auth-decor__robot" priority />
                    <div className="auth-decor__bubble">
                        Привет! <br />
                        Меня зовут Шопи :) <br />
                        Буду рад помочь <br />
                        с выбором товара
                    </div>
                </div>
                <Image src="/images/auth/plum.png" alt="Plum" width={280} height={280} className="auth-decor__item auth-decor__plum" />
                <Image src="/images/auth/sweater.png" alt="Sweater" width={160} height={160} className="auth-decor__item auth-decor__sweater" />
                <Image src="/images/auth/trainers.png" alt="Trainers" width={180} height={180} className="auth-decor__trainers" />
                <Image src="/images/auth/court.png" alt="Cart" width={220} height={220} className="auth-decor__cart" />
                <div className="auth-decor__floor-container">
                     <Image src="/images/auth/Floor.png" alt="Floor" width={1920} height={200} className="auth-decor__floor" />
                </div>
            </div>

            <div className="auth-page__container">
                <div className="auth-card">
                    <div className="auth-card__header">
                        <div className="auth-card__logo">
                            <Bot size={32} color="#fff" />
                        </div>
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
                        <form className="auth-form" onSubmit={handleRegisterSubmit}>
                            <div className="auth-field">
                                <label className="auth-field__label">Имя</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ваше имя"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-field__label">Почта</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-field__label">Номер телефона</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+7 (___) ___-__-__"
                                    value={registerData.phone}
                                    onChange={handleRegisterChange}
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-field__label">Пароль</label>
                                <div className="auth-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="********"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        className="auth-input auth-input--with-action"
                                    />
                                    <button
                                        type="button"
                                        className="auth-input-wrapper__action"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-field__label">Подтвердите пароль</label>
                                <div className="auth-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="********"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        className="auth-input auth-input--with-action"
                                    />
                                    <button
                                        type="button"
                                        className="auth-input-wrapper__action"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="auth-btn">
                                {loading ? "Загрузка..." : "Зарегистрироваться"}
                            </button>

                            <div className="auth-footer">
                                <span>Уже есть аккаунт? <button type="button" className="auth-footer__link" onClick={() => setActiveTab('login')}>Вход</button></span>
                            </div>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleLoginSubmit}>
                            <div className="auth-field">
                                <label className="auth-field__label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-field__label">Пароль</label>
                                <div className="auth-input-wrapper">
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="********"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        className="auth-input auth-input--with-action"
                                    />
                                    <button
                                        type="button"
                                        className="auth-input-wrapper__action"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    >
                                        {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="auth-btn">
                                {loading ? "Вход..." : "Войти"}
                            </button>

                            <div className="auth-footer">
                                <button type="button" className="auth-footer__link">Забыли пароль?</button>
                                <div className="auth-footer__text">
                                    Нет аккаунта? <button type="button" className="auth-footer__link" onClick={() => setActiveTab('register')}>Регистрация</button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
