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
import { useAuthStore } from "@/data/store/useAuthStore";
import { ClipboardList } from 'lucide-react';

const sellerMenuItems = [
    {id: 'shops', title: 'Мои магазины', icon: ShoppingBag, path: '/admin/shops'},
    {id: 'analytics', title: 'Аналитика', icon: BarChart3, path: '/admin/analytics'},
    {id: 'brands', title: 'Бренды', icon: Tag, path: '/admin/brands'},
    {id: 'create-shop', title: 'Создать магазин', icon: PlusCircle, path: '/admin/create-shop'}
];

const adminMenuItems = [
    {id: 'requests', title: 'Заявки', icon: ClipboardList, path: '/admin/requests'},
    ...sellerMenuItems
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const { role } = useAuthStore();

    const items = role === 'Admin' ? adminMenuItems : sellerMenuItems;

    return (
        <aside className="sidebar">
            <nav className="sidebar__nav">
                {items.map((item) => {
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
