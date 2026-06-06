import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { apiClient } from "@/data/api/apiClient";

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    isAuth: boolean;
    isLoading: boolean;
    setAuth: (token: string, refreshToken: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
    updateProfile: (profile: Partial<Pick<AuthState, 'name' | 'email' | 'phone' | 'id' | 'role'>>) => void;
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
            role: null,
            isAuth: false,
            isLoading: false,

            async setAuth(token, refreshToken) {
                try {
                    set({ token, refreshToken, isLoading: true });

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
                        phone: userData.phone || null,
                        role: userData.role || null,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Ошибка при получении профиля после авторизации:', error);
                    set({ isAuth: false, isLoading: false });
                }
            },

            async fetchProfile() {
                const { token } = get();

                if (!token) {
                    console.warn('Нет токена для получения профиля');
                    return;
                }

                try {
                    set({ isLoading: true });

                    const response = await apiClient.get('/Users/current');

                    if (response.data) {
                        const userData = response.data;

                        set({
                            id: userData.id || null,
                            name: userData.name || null,
                            email: userData.email || null,
                            phone: userData.phone || null,
                            role: userData.role || null,
                            isAuth: true,
                            isLoading: false
                        });
                    }
                } catch (error) {
                    console.error('Ошибка при получении профиля:', error);
                    set({ isLoading: false });

                    // Если ошибка авторизации, возможно нужно очистить токен
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        get().clearAuth();
                    }
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
                    role: null,
                    isAuth: false,
                    isLoading: false,
                }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);