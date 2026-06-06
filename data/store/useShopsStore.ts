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

export interface CreateShopDto {
    name: string;
    description: string;
    logoPath: string;
    urlAlias: string;
}

interface ShopsState {
    shops: Shop[];
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
    createError: string | null;

    fetchMyShops: () => Promise<void>;
    createShop: (data: CreateShopDto) => Promise<boolean>;
}

export const useShopsStore = create<ShopsState>((set, get) => ({
    shops: [],
    isLoading: false,
    isCreating: false,
    error: null,
    createError: null,

    async fetchMyShops() {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Shops/my');
            set({
                shops: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении магазинов:', error);
            set({
                error: 'Ошибка при загрузке магазинов',
                isLoading: false
            });
        }
    },

    async createShop(data: CreateShopDto) {
        set({ isCreating: true, createError: null });
        try {
            await apiClient.post('/shops', data);
            await get().fetchMyShops();

            set({ isCreating: false });
            return true; // Успешно
        } catch (error) {
            console.error('Ошибка при создании магазина:', error);
            set({
                createError: 'Не удалось создать магазин. Проверьте данные или URL.',
                isCreating: false
            });
            return false;
        }
    }
}));