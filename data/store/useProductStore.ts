import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient'; // Ваш импорт apiClient

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
    categoryId: string;
    categoryName: string;
    shopId: string;
    shopName: string;
    brandName: string;
}

interface ProductState {
    product: Product | null;
    isLoading: boolean;
    error: string | null;

    fetchProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    product: null,
    isLoading: false,
    error: null,

    async fetchProduct(id: string) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/Products/${id}`);
            set({
                product: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении товара:', error);
            set({
                error: 'Не удалось загрузить данные товара',
                isLoading: false
            });
        }
    },
}));