import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    userId: string | null;
    isAuth: boolean;
    // Действия
    setAuth: (token: string, refreshToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            userId: null,
            isAuth: false,

            setAuth: (token, refreshToken) =>
                set({ token, refreshToken, isAuth: true }),

            clearAuth: () =>
                set({ token: null, refreshToken: null, userId: null, isAuth: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
