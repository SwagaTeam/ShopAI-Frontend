import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    isAuth: boolean;
    setAuth: (token: string, refreshToken: string) => Promise<void>;
    updateProfile: (profile: Partial<Pick<AuthState, 'name' | 'email' | 'phone' | 'id'>>) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            id: null,
            name: null,
            email: null,
            phone: null,
            isAuth: false,

            async setAuth(token, refreshToken) {
                try {
                    set({ token, refreshToken });

                    const response = await axios.get('/api/Users/current', {
                        headers: {
                            'accept': 'text/plain',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const userData = response.data;

                    set({
                        isAuth: true,
                        id: userData.id || null,
                        name: userData.name || null,
                        email: userData.email || null,
                        phone: userData.phone || null
                    });
                } catch (error) {
                    console.error('Ошибка при получении профиля после авторизации:', error);
                    get().clearAuth();
                }
            },

            updateProfile: (profile) =>
                set((state) => ({
                    ...state,
                    ...profile,
                })),

            clearAuth: () =>
                set({
                    token: null,
                    refreshToken: null,
                    id: null,
                    name: null,
                    email: null,
                    phone: null,
                    isAuth: false,
                }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);