'use client';

import React, { useState } from 'react';
import {
    ShoppingBag,
    Store,
    PlusCircle,
    LogOut
} from 'lucide-react';
import './sidebar.css';
import Link from "next/link";

const menuItems = [
    {id: 'shops', title: 'Мои магазины', icon: ShoppingBag, path: '/shops'},
    {id: 'create-shop', title: 'Создать магазин', icon: PlusCircle, path: '/create-shop'}
];

export const AdminSidebar = () => {
    const [activeItem, setActiveItem] = useState('shops');

    return (
        <aside className="sidebar">

            <nav className="sidebar__nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            className={`sidebar__item ${activeItem === item.id ? 'sidebar__item--active' : ''}`}
                            href={"/admin" + item.path}
                        >
                            <Icon size={20} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar__footer">
                <Link href="/main" className="sidebar__item sidebar__item--logout">
                    <span>Вернуться на маркетплейс</span>
                </Link>
            </div>
        </aside>
    );
};