import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface Shop {
    id: string;
    name: string;
    description: string;
    logoPath: string;
    urlAlias: string;
    ownerId: string;
    ownerName: string;
}

export interface Category {
    id: string;
    name: string;
    shopId: string;
    parentCategoryId: string | null;
    subCategories: Category[];
}

export interface ShopProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string | null;
    brandName: string | null;
    stockQuantity: number;
    categoryName?: string | null;
}

interface ShopState {
    shop: Shop | null;
    categories: Category[];
    products: ShopProduct[];
    productsPage: number;
    productsPageSize: number;
    totalProducts: number;
    totalProductPages: number;
    isLoading: boolean;
    error: string | null;
    
    fetchShop: (shopId: string) => Promise<void>;
    fetchCategories: (shopId: string) => Promise<void>;
    fetchShopProducts: (shopId: string, page?: number, pageSize?: number) => Promise<void>;
    updateShop: (shopId: string, name: string, urlAlias: string) => Promise<void>;
    deleteShop: (shopId: string) => Promise<void>;
}

export const useShopStore = create<ShopState>((set) => ({
    shop: null,
    categories: [],
    products: [],
    productsPage: 1,
    productsPageSize: 20,
    totalProducts: 0,
    totalProductPages: 0,
    isLoading: false,
    error: null,

    async fetchShop(shopId) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/Shops/${shopId}`);
            set({
                shop: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении магазина:', error);
            set({
                error: 'Ошибка при загрузке магазина',
                isLoading: false
            });
        }
    },

    async fetchCategories(shopId) {
        try {
            const response = await apiClient.get(`/Categories/shop/${shopId}`);
            set({
                categories: response.data
            });
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            set({
                error: 'Ошибка при загрузке категорий'
            });
        }
    },

    async fetchShopProducts(shopId, page = 1, pageSize = 20) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/Shops/${shopId}/products`, {
                params: { page, pageSize }
            });

            set({
                products: response.data.items,
                productsPage: response.data.page,
                productsPageSize: response.data.pageSize,
                totalProducts: response.data.totalCount,
                totalProductPages: response.data.totalPages,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении товаров магазина:', error);
            set({
                error: 'Ошибка при загрузке товаров магазина',
                isLoading: false
            });
        }
    },

    async updateShop(shopId, name, urlAlias) {
        try {
            await apiClient.put(`/Shops/${shopId}`, {
                name,
                urlAlias
            });
            await useShopStore.getState().fetchShop(shopId);
            set({ error: null });
        } catch (error) {
            console.error('Ошибка при обновлении магазина:', error);
            set({
                error: 'Ошибка при обновлении магазина'
            });
        }
    },

    async deleteShop(shopId) {
        try {
            await apiClient.delete(`/Shops/${shopId}`);
            set({ shop: null, error: null });
        } catch (error) {
            console.error('Ошибка при удалении магазина:', error);
            set({
                error: 'Ошибка при удалении магазина'
            });
        }
    }
}));
