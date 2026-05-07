'use client';

import React, { useEffect, useState } from 'react';
import './agent.css';
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/data/store/useAuthStore";

export default function AgentPage() {
    const router = useRouter();
    const { clearAuth, isAuth, fullName } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !isAuth) {
            router.replace('/auth');
        }
    }, [isAuth, isHydrated, router]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        clearAuth();
        router.push('/');
    };

    if (!isHydrated || !isAuth) {
        return null;
    }

    return (
        <div className="dev">
            <h1>Привет, </h1>
            <p>{fullName || 'Пользователь'}!</p>
            <button
                onClick={handleLogout}
                className="btnPrimary"
                style={{ cursor: 'pointer', border: 'none' }}
            >
                Выйти
            </button>
        </div>
    );
}
