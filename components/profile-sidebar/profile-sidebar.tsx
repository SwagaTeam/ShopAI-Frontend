'use client';

import React from 'react';
import { Bell, PackageCheck, ShoppingBag, User } from 'lucide-react';
import './profile-sidebar.css';

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const ProfileSidebar = ({ activeTab, onTabChange }: ProfileSidebarProps) => {
    return (
        <aside className="profile-sidebar">
            <button
                className={`profile-nav__item ${activeTab === 'personal' ? 'profile-nav__item--active' : ''}`}
                onClick={() => onTabChange('personal')}
            >
                <User size={20} />
                Личные данные
            </button>
            <button
                className={`profile-nav__item ${activeTab === 'shops' ? 'profile-nav__item--active' : ''}`}
                onClick={() => onTabChange('shops')}
            >
                <ShoppingBag size={20} />
                Мои магазины
            </button>
        </aside>
    );
};
