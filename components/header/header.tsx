'use client';

import "./header.css"
import {Bell, ChevronDown, Handbag, Search, Store, LogOut} from "lucide-react";
import React, {useState} from "react";
import {Catalog} from "@/components/catalog/Catalog";
import Link from "next/link";
import {useAuthStore} from "@/data/store/useAuthStore";
import {getInitials} from "@/utils/utils";
import {usePathname, useRouter} from "next/navigation";
import {router} from "next/client";

interface HeaderProps {
    isCompact: boolean;
}

export const Header = ({isCompact} : HeaderProps) => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false); // Состояние для меню профиля

    // Предполагаем, что в store также может быть email, если нет — используем заглушку
    const { name, email, clearAuth } = useAuthStore() as { name: string, email?: string, clearAuth: () => void };
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (href: string) => {
        return pathname === href ? 'nav__link nav__link--active' : 'nav__link';
    };

    return (
        <>
            <header className="header">
                <div className="header__top">
                    <Link href={"/main"} className="header__logo">
                        <img src="/images/logo.png" alt="logo" />
                        ShopAI
                    </Link>

                    <div className="header__search">
                        <button className="header__catalog-btn" onClick={() => setCatalogOpen(!isCatalogOpen)}>
                            <ChevronDown size={24}/>
                            Каталог
                        </button>
                        <input type="text" className="header__search-input" placeholder="Найти товар или магазин..." />
                        <div className="header__search-icon">
                            <Search size={16} color={"#99A1AF"} />
                        </div>
                    </div>

                    <div className="header__actions">
                        <Link href={"/ai-assistant"} className="header__ai-btn">
                            ИИ-помощник
                            <Search size={14} color={"#2563eb"} />
                        </Link>
                        {/*<button className="header__icon-btn">
                            <Bell size={24} color={"#4A5565"}/>
                        </button>*/}
                        <Link href={"/cart"} className="header__icon-btn">
                            <Handbag size={24} color={"#4A5565"}/>
                            {/*<span className="header__badge">3</span>*/}
                        </Link>

                        {/* Контейнер для аватара и выпадающего меню */}
                        <div className="header__avatar-wrapper">
                            <button
                                className="header__avatar"
                                onClick={() => setProfileOpen(!isProfileOpen)}
                                aria-label="Открыть меню профиля"
                            >
                                {getInitials(name)}
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div className="profile-dropdown__overlay" onClick={() => setProfileOpen(false)} />
                                    <div className="profile-dropdown">
                                        <Link
                                            href="/profile"
                                            className="profile-dropdown__user"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <div className="profile-dropdown__name">{name || "Пользователь"}</div>
                                            <div className="profile-dropdown__email">{email || "user@example.com"}</div>
                                        </Link>

                                        <div className="profile-dropdown__divider" />

                                        <Link
                                            href="/admin/shops"
                                            className="profile-dropdown__item"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Store size={20} color="#4A5565" />
                                            <span>Мои магазины</span>
                                        </Link>

                                        <button
                                            className="profile-dropdown__item profile-dropdown__item--logout"
                                            onClick={() => {
                                                clearAuth();
                                                router.push("/");
                                            }}
                                        >
                                            <LogOut size={20} color="#4A5565" />
                                            <span>Выйти</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!isCompact && <nav className="nav">
                    <Link href={"/main"} className={isActive("/main")}>Главная</Link>
                    <Link href="/favorites" className={isActive("/favorites")}>Избранное</Link>
                    <Link href="/viewed" className={isActive("/viewed")}>Просмотренные</Link>
                    <Link href={"/orders"} className={isActive("/orders")}>Мои заказы</Link>
                </nav>}
            </header>

                {isCatalogOpen && (
                    <>
                        <div className={isCompact ? "catalog-overlay header-catalog__compact" : "catalog-overlay"} onClick={() => setCatalogOpen(false)} />
                        <div className={isCompact ? "catalog-wrapper header-catalog__compact" : "catalog-wrapper"}>
                            <Catalog />
                        </div>
                    </>
                )}
        </>
    );
}