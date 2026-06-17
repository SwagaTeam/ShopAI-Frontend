'use client';

import "./header.css"
import {ChevronDown, Handbag, Store, LogOut, Sparkles} from "lucide-react";
import React, {useState, useEffect} from "react";
import {Catalog} from "@/components/catalog/Catalog";
import Link from "next/link";
import {useAuthStore} from "@/data/store/useAuthStore";
import {useFavoritesStore} from "@/data/store/useFavoritesStore";
import {useCatalogStore} from "@/data/store/useCatalogStore";
import {getInitials} from "@/utils/utils";
import {usePathname, useRouter} from "next/navigation";
import {AutocompleteSearch} from "./Autocomplete";

interface HeaderProps {
    isCompact: boolean;
    isSuperCompact?: boolean;
}

export const Header = ({isCompact, isSuperCompact = false} : HeaderProps) => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);

    const { fetchFavorites, isFetched } = useFavoritesStore();
    const { setFilters } = useCatalogStore();
    const router = useRouter();

    const handleSearch = (term: string) => {
        if (!term.trim()) return;
        setFilters({ searchTerm: term });
        router.push("/catalog");
    };

    useEffect(() => {
        if (!isFetched) {
            fetchFavorites();
        }
    }, [isFetched, fetchFavorites]);

    useEffect(() => {
        if (isCatalogOpen) {
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
            document.documentElement.classList.remove('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
            document.documentElement.classList.remove('no-scroll');
        };
    }, [isCatalogOpen]);

    const { name, email, role, clearAuth } = useAuthStore() as { name: string, email?: string, role: string | null, clearAuth: () => void };
    const pathname = usePathname();

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

                    {!isSuperCompact && (
                        <div className="header__search">
                            {/*<button className="header__catalog-btn" onClick={() => setCatalogOpen(!isCatalogOpen)}>
                                <ChevronDown size={24}/>
                                <span>Каталог</span>
                            </button>*/}
                            <AutocompleteSearch onSearch={handleSearch} />
                        </div>
                    )}

                    <div className="header__actions">
                        <Link href={"/ai-assistant"} className="header__ai-btn">
                            <span>ИИ-помощник</span>
                            <Sparkles size={14} color={"#2563eb"} />
                        </Link>
                        <Link href={"/cart"} className="header__icon-btn">
                            <Handbag size={24} color={"#4A5565"}/>
                        </Link>

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
                                            href={role === 'Admin' ? "/admin/requests" : role === 'Seller' ? "/admin/shops" : "/admin"}
                                            className="profile-dropdown__item"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Store size={20} color="#4A5565" />
                                            <span>
                                                {role === 'Admin' ? 'Управление' : role === 'Seller' ? 'Мои магазины' : 'Стать продавцом'}
                                            </span>
                                        </Link>

                                        <button
                                            className="profile-dropdown__item profile-dropdown__item--logout"
                                            onClick={() => {
                                                clearAuth();
                                                router.push("/auth");
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
