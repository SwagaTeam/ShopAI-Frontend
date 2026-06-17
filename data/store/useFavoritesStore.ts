import { create } from 'zustand';
import { apiClient, getStoredAccessToken } from '@/data/api/apiClient';
import {ItemInterface} from "@/data/interfaces/ItemInterface";

interface FavoritesState {
    items: ItemInterface[];
    isLoading: boolean;
    isFetched: boolean;
    error: string | null;
    
    fetchFavorites: () => Promise<void>;
    addToFavorites: (productId: string) => Promise<void>;
    removeFromFavorites: (productId: string) => Promise<void>;
    toggleFavorite: (productId: string, initialItem?: ItemInterface) => Promise<boolean>;
    addBundleToFavorites: (productIds: string[]) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
    items: [],
    isLoading: false,
    isFetched: false,
    error: null,

    async fetchFavorites() {
        set({ isLoading: true, error: null });
        if (!getStoredAccessToken()) {
            set({
                items: [],
                isLoading: false,
                isFetched: true
            });
            return;
        }

        try {
            const response = await apiClient.get('/Favorites');
            set({
                items: response.data,
                isLoading: false,
                isFetched: true
            });
        } catch (error) {
            console.error('Ошибка при получении избранного:', error);
            set({
                error: 'Ошибка при загрузке избранного',
                isLoading: false,
                isFetched: true
            });
        }
    },

    async addBundleToFavorites(productIds) {
        set({ isLoading: true });
        try {
            await apiClient.post('/Favorites/bundles', { productIds });
            await useFavoritesStore.getState().fetchFavorites();
        } catch (error) {
            console.error('Ошибка при добавлении бандла в избранное:', error);
            set({ error: 'Не удалось добавить комплект в избранное', isLoading: false });
            throw error;
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

    async toggleFavorite(productId, initialItem) {
        const previousItems = useFavoritesStore.getState().items;
        const isCurrentlyFavorite = previousItems.some(item => item.id === productId);

        // Оптимистичное обновление
        if (isCurrentlyFavorite) {
            set({ items: previousItems.filter(item => item.id !== productId) });
        } else {
            // Если у нас есть объект товара, добавляем его, иначе создаем минимальный объект
            const newItem: ItemInterface = initialItem || {
                id: productId,
                name: '',
                price: 0,
                imageUrl: '',
                rating: 0,
                stockQuantity: 0,
                isInWishlist: true,
                quantity: 0,
                brandName: '',
                reviewsCount: 0,
                shopName: '',
                tags: [],
                cartQuantity: 0
            };
            set({ items: [...previousItems, newItem] });
        }

        try {
            const response = await apiClient.post(`/Favorites/${productId}/toggle`, {});
            const isAdded = response.data.isAdded;
            // После успешного запроса можно обновить список полностью, чтобы синхронизировать данные (например, если newItem был неполным)
            await useFavoritesStore.getState().fetchFavorites();
            return isAdded;
        } catch (error) {
            // Откат в случае ошибки
            set({ items: previousItems });
            console.error('Ошибка при изменении избранного:', error);
            set({
                error: 'Ошибка при изменении избранного'
            });
            throw error;
        }
    }
}));
