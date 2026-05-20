import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface FavoriteProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string | null;
    brandName: string | null;
    stockQuantity: number;
}

interface FavoritesState {
    items: FavoriteProduct[];
    isLoading: boolean;
    error: string | null;
    
    fetchFavorites: () => Promise<void>;
    addToFavorites: (productId: string) => Promise<void>;
    removeFromFavorites: (productId: string) => Promise<void>;
    toggleFavorite: (productId: string) => Promise<boolean>;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
    items: [],
    isLoading: false,
    error: null,

    async fetchFavorites() {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Favorites');
            set({
                items: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении избранного:', error);
            set({
                error: 'Ошибка при загрузке избранного',
                isLoading: false
            });
        }
    },

    async addToFavorites(productId) {
        try {
            await apiClient.post(`/Favorites/${productId}`, {});
            await useFavoritesStore.getState().fetchFavorites();
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
            set({
                error: 'Ошибка при добавлении в избранное'
            });
        }
    },

    async removeFromFavorites(productId) {
        try {
            await apiClient.delete(`/Favorites/${productId}`);
            await useFavoritesStore.getState().fetchFavorites();
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
            set({
                error: 'Ошибка при удалении из избранного'
            });
        }
    },

    async toggleFavorite(productId) {
        try {
            const response = await apiClient.post(`/Favorites/${productId}/toggle`, {});
            const isAdded = response.data.isAdded;
            await useFavoritesStore.getState().fetchFavorites();
            return isAdded;
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
            set({
                error: 'Ошибка при изменении избранного'
            });
            throw error;
        }
    }
}));
