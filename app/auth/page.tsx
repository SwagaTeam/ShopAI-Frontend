"use client"
import React, {useEffect, useState} from 'react';
import './auth.css';
import {ChevronLeft, Eye, EyeOff, LockKeyhole, Mail, Phone, User} from "lucide-react";
import {sileo} from "sileo";
import Link from "next/link";
import {useAuthStore} from "@/data/store/useAuthStore";
import {useRouter} from "next/navigation";
import {authApi} from "@/data/AuthApi";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const { setAuth, isAuth } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Состояния для полей пароля
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && isAuth) {
            router.replace('/agent');
        }
    }, [isAuth, isHydrated, router]);

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
            return sileo.error({ title: "Ошибка", description: "Пароли не совпадают" });
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

            sileo.success({ title: "Успех!", description: "Регистрация прошла успешно. Теперь войдите." });
            setActiveTab('login');
        } catch (error: any) {
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

            sileo.success({ title: "Успех!", description: "Добро пожаловать"});
            router.push('/agent');
        } catch (err: any) {
            sileo.error({ title: "Ошибка", description: "Неверный логин или пароль" });
        } finally {
            setLoading(false);
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
                                    <label className="auth-field__label">Номер телефона</label>
                                    <div className="auth-input-wrapper">
                                    <span className="auth-input-wrapper__icon">
                                        <Phone size={15} color={"#99A1AF"}/>
                                    </span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={registerData.phone}
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

                                <button type="submit" disabled={loading} className="auth-btn">
                                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                                </button>

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

                                <button type="submit" disabled={loading} className="auth-btn">
                                    {loading ? "Вход..." : "Войти"}
                                </button>

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
