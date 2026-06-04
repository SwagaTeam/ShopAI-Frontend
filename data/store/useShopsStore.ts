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

// Тип для отправки данных на сервер
export interface CreateShopDto {
    name: string;
    description: string;
    logoPath: string;
    urlAlias: string;
}

interface ShopsState {
    shops: Shop[];
    isLoading: boolean;
    isCreating: boolean; // Состояние загрузки для создания
    error: string | null;
    createError: string | null; // Ошибка при создании

    fetchMyShops: () => Promise<void>;
    createShop: (data: CreateShopDto) => Promise<boolean>; // Возвращает true при успехе
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
            // Отправляем POST запрос
            await apiClient.post('/shops', data);

            // Заново запрашиваем список магазинов, чтобы обновить UI
            await get().fetchMyShops();

            set({ isCreating: false });
            return true; // Успешно
        } catch (error) {
            console.error('Ошибка при создании магазина:', error);
            set({
                createError: 'Не удалось создать магазин. Проверьте данные или URL.',
                isCreating: false
            });
            return false; // Ошибка
        }
    }
}));