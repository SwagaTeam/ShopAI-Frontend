'use client';

import "./header.css"
import {Bell, ChevronDown, Handbag, Search} from "lucide-react";
import React, {useState} from "react";
import {Catalog} from "@/components/catalog/Catalog";
import Link from "next/link";
import {useAuthStore} from "@/data/store/useAuthStore";
import {getInitials} from "@/utils/utils";
import { usePathname } from "next/navigation";

interface HeaderProps {
    isCompact: boolean;

}

export const Header = ({isCompact} : HeaderProps) => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const { name } = useAuthStore();
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

                    <div className="header__search">
                        <button className="header__catalog-btn" onClick={() => setCatalogOpen(!isCatalogOpen)}>
                            <ChevronDown size={21}/>
                            Каталог
                        </button>
                        <input type="text" className="header__search-input" placeholder="Найти товар или магазин..." />
                        <div className="header__search-icon">
                            <Search size={15} color={"#99A1AF"} />
                        </div>
                    </div>

                    <div className="header__actions">
                        <Link href={"/ai-assistant"} className="header__ai-btn">
                            ИИ-помощник
                            <Search size={14} color={"#2563eb"} />
                        </Link>
                        <button className="header__icon-btn">
                            <Bell size={24} color={"#4A5565"}/>
                        </button>
                        <Link href={"/cart"} className="header__icon-btn">
                            <Handbag size={24} color={"#4A5565"}/>
                            {/*<span className="header__badge">3</span>*/}
                        </Link>
                        <Link href={"/profile"} className="header__avatar">{getInitials(name)}</Link>
                    </div>
                </div>

                {!isCompact && <nav className="nav">
                    <Link href={"/main"} className={isActive("/main")}>Главная</Link>
                    <Link href="/favorites" className={isActive("/favorites")}>Избранное</Link>
                    <Link href="/viewed" className={isActive("/viewed")}>Просмотренные</Link>
                    <Link href={""} className="nav__link">Мои заказы</Link>
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
