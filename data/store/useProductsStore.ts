import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string | null;
    brandName: string | null;
    stockQuantity: number;
}

interface ProductsState {
    latest: Product[];
    popular: Product[];
    isLoading: boolean;
    error: string | null;
    
    fetchMainPageProducts: (count?: number) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
    latest: [],
    popular: [],
    isLoading: false,
    error: null,

    async fetchMainPageProducts(count = 50) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Products/main-page', {
                params: { count }
            });
            set({
                latest: response.data.latest,
                popular: response.data.popular,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            set({
                error: 'Ошибка при загрузке товаров',
                isLoading: false
            });
        }
    }
}));
