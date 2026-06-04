import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface ViewedProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string | null;
    brandName: string | null;
    stockQuantity: number;
}

interface ViewedState {
    items: ViewedProduct[];
    isLoading: boolean;
    error: string | null;
    
    fetchViewed: () => Promise<void>;
    viewProduct: (id: string) => Promise<void>;
}

export const useViewedStore = create<ViewedState>((set) => ({
    items: [],
    isLoading: false,
    error: null,

    async fetchViewed() {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/RecentlyViewed');
            set({
                items: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении просмотренных товаров:', error);
            set({
                error: 'Ошибка при загрузке просмотренных товаров',
                isLoading: false
            });
        }
    },

    async viewProduct(id: string) {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post(`/RecentlyViewed/${id}`);
            set({
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка просмотре товара:', error);
            set({
                isLoading: false
            });
        }
    },
}));
