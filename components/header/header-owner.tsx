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


export const HeaderOwner = () => {
    const [isProfileOpen, setProfileOpen] = useState(false);

    const { name, email, clearAuth } = useAuthStore() as { name: string, email?: string, clearAuth: () => void };
    const router = useRouter();


    return (
        <>
            <header className="header">
                <div className="header__top">
                    <Link href={"/admin"} className="header__logo">
                        <img src="/images/logo.png" alt="logo" />
                        ShopAI
                        <span className="header__logo-badge">Владелец</span>
                    </Link>

                    <div className="header__actions">
                        <div className="header__avatar-wrapper">
                            <div className="header__avatar-container">
                                <button
                                    className="header__avatar"
                                    onClick={() => setProfileOpen(!isProfileOpen)}
                                    aria-label="Открыть меню профиля"
                                >
                                    {getInitials(name)}
                                </button>
                                <span onClick={() => setProfileOpen(!isProfileOpen)} className="header__name">{name}</span>
                            </div>
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
                                            href="/main"
                                            className="profile-dropdown__item"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Store size={20} color="#4A5565" />
                                            <span>Вернуться на маркетплейс</span>
                                        </Link>
                                        <button
                                            className="profile-dropdown__item profile-dropdown__item--logout"
                                            onClick={() => {
                                                clearAuth();
                                                router.push("/auth");
                                            }}
                                        >
                                            <LogOut size={20} color="#4A5565" />
                                            <span>Выйти из аккаунта</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

        </>
    );
}