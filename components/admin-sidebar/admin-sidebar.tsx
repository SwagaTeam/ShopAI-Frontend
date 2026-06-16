'use client';

import React from 'react';
import {
    ShoppingBag,
    PlusCircle,
    BarChart3,
    Tag,
    LogOut
} from 'lucide-react';
import './sidebar.css';
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {id: 'shops', title: 'Мои магазины', icon: ShoppingBag, path: '/admin/shops'},
    {id: 'analytics', title: 'Аналитика', icon: BarChart3, path: '/admin/analytics'},
    {id: 'brands', title: 'Бренды', icon: Tag, path: '/admin/brands'},
    {id: 'create-shop', title: 'Создать магазин', icon: PlusCircle, path: '/admin/create-shop'}
];

export const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <nav className="sidebar__nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                            href={item.path}
                        >
                            <Icon size={20} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar__footer">
                <Link href="/main" className="sidebar__item sidebar__item--logout">
                    <LogOut size={20} />
                    <span>Вернуться на маркетплейс</span>
                </Link>
            </div>
        </aside>
    );
};
