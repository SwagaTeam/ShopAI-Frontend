import "./header.css"
import {Bell, ChevronDown, Handbag, Search} from "lucide-react";
import React, {useState} from "react";
import {Catalog} from "@/components/catalog/Catalog";

interface HeaderProps {
    isCompact: boolean;
}

export const Header = ({isCompact} : HeaderProps) => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);

    return (
        <>
            <header className="header">
                <div className="header__top">
                    <a href="#" className="header__logo">
                        <img src="/images/logo.png" alt="logo" />
                        ShopAI
                    </a>

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
                        <button className="header__ai-btn">
                            ИИ-помощник
                            <Search size={14} color={"#2563eb"} />
                        </button>
                        <button className="header__icon-btn">
                            <Bell size={24} color={"#4A5565"}/>
                        </button>
                        <button className="header__icon-btn">
                            <Handbag size={24} color={"#4A5565"}/>
                            <span className="header__badge">3</span>
                        </button>
                        <div className="header__avatar">П</div>
                    </div>
                </div>

                {!isCompact && <nav className="nav">
                    <a href="#" className="nav__link nav__link--active">Главная</a>
                    <a href="#" className="nav__link">Мои заказы</a>
                    <a href="#" className="nav__link">Избранное</a>
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
