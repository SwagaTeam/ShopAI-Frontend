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

interface Stats {
    cartItemsCount: number;
    cartTotal: number;
    recentlyViewedCount: number;
    reviewsCount: number;
    wishlistCount: number;
}

interface ProductsState {
    latest: Product[];
    popular: Product[];
    stats: Stats;
    isLoading: boolean;
    error: string | null;
    
    fetchMainPageProducts: (count?: number) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
    latest: [],
    popular: [],
    stats: {
        cartItemsCount: 0,
        cartTotal: 0,
        recentlyViewedCount: 0,
        reviewsCount: 0,
        wishlistCount: 0,
    },
    isLoading: false,
    error: null,

    async fetchMainPageProducts(count = 30) {
        set({ isLoading: true, error: null });
        try {
            const responseDashboard = await apiClient.get('/dashboard');
            const responseMain = await apiClient.get('/Products/main-page', {
                params: { count }
            });
            set({
                latest: responseMain.data.latest,
                popular: responseDashboard.data.popular,
                stats: responseDashboard.data.stats,
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
