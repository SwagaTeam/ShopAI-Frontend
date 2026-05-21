'use client';

import React from 'react';
import { Settings, Folder, Package } from 'lucide-react';
import './shop-sidebar.css';

interface ShopSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const ShopSidebar = ({ activeTab, onTabChange }: ShopSidebarProps) => {
    return (
        <aside className="shop-sidebar">
            <button
                className={`shop-nav__item ${activeTab === 'products' ? 'shop-nav__item--active' : ''}`}
                onClick={() => onTabChange('products')}
            >
                <Package size={20} />
                Товары
            </button>
            <button
                className={`shop-nav__item ${activeTab === 'categories' ? 'shop-nav__item--active' : ''}`}
                onClick={() => onTabChange('categories')}
            >
                <Folder size={20} />
                Категории
            </button>
            <button
                className={`shop-nav__item ${activeTab === 'settings' ? 'shop-nav__item--active' : ''}`}
                onClick={() => onTabChange('settings')}
            >
                <Settings size={20} />
                Настройки
            </button>
        </aside>
    );
};
