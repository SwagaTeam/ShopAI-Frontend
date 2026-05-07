import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode'; // Импортируем декодер

interface MyJwtPayload {
    sub?: string;
    FullName?: string;
    id?: string;
}

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    userId: string | null;
    fullName: string | null;
    isAuth: boolean;
    setAuth: (token: string, refreshToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            userId: null,
            fullName: null,
            isAuth: false,

            setAuth: (token, refreshToken) => {
                const decoded = jwtDecode<MyJwtPayload>(token);
                set({
                    token,
                    refreshToken,
                    isAuth: true,
                    userId: decoded.sub || decoded.id || null,
                    fullName: decoded.FullName || null
                });
            },

            clearAuth: () =>
                set({
                    token: null,
                    refreshToken: null,
                    userId: null,
                    fullName: null,
                    isAuth: false
                }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
