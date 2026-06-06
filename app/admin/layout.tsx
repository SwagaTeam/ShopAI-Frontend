'use client';

import {HeaderOwner} from "@/components/header/header-owner";
import {AdminSidebar} from "@/components/admin-sidebar/admin-sidebar";
import React, {useEffect} from "react";
import "./admin-layout.css";
import {useAuthStore} from "@/data/store/useAuthStore";
import {useShopsStore} from "@/data/store/useShopsStore";
import {useRouter} from "next/navigation";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const role = useAuthStore((state) => state.role);
    const isAuthLoading = useAuthStore((state) => state.isLoading);
    const { shops, fetchMyShops, isLoading: isShopsLoading } = useShopsStore();
    const router = useRouter();

    const isAuthorized = role === 'Seller' || role === 'Admin';

    useEffect(() => {
        if (!isAuthLoading && role === 'User' && window.location.pathname !== '/admin') {
            router.push('/admin');
        }
    }, [role, isAuthLoading, router]);

    useEffect(() => {
        if (isAuthorized && shops.length === 0 && !isShopsLoading) {
            fetchMyShops();
        }
    }, [isAuthorized, fetchMyShops, shops.length, isShopsLoading]);

    if (isAuthLoading) {
        return (
            <div className="admin-full-loading">
                <div className="admin-loader"></div>
                <p>Проверка доступа...</p>
            </div>
        );
    }

    const showSidebar = role === 'Admin' || (role === 'Seller' && shops.length > 0);

    if (!showSidebar) {
        return (
            <div className="admin-layout-simple">
                <HeaderOwner />
                <main className="admin-layout__content-simple">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-layout__main">
                <HeaderOwner />
                <main className="admin-layout__content">
                    {children}
                </main>
            </div>
        </div>
    );
}
